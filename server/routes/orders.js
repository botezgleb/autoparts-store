const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product, sequelize } = require('../models');

const generateOrderNumber = () => {
  return 'ORD-' + Date.now();
};

router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { customerName, email, phone, address, items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Корзина пуста' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });

      if (!product) {
        await transaction.rollback();
        return res.status(400).json({ error: `Товар не найден: ${item.productId}` });
      }

      if (product.quantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ error: `Недостаточно товара: ${product.name}` });
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: parseFloat(product.price)
      });
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customerName,
      email,
      phone,
      address,
      totalAmount,
      userId: req.user?.id || null
    }, { transaction });

    for (const itemData of orderItems) {
      await OrderItem.create({
        ...itemData,
        orderId: order.id
      }, { transaction });

      await Product.decrement('quantity', {
        by: itemData.quantity,
        where: { id: itemData.productId },
        transaction
      });
    }

    await transaction.commit();

    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });

    res.status(201).json(completeOrder);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        include: [Product]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
