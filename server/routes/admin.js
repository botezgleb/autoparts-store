const express = require('express');
const router = express.Router();
const { Product, Category, sequelize } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);
router.use(requireAdmin);

router.get('/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      Product.count(),
      Category.count(),
      Product.sum('quantity'),
      Product.count({ where: { inStock: true } })
    ]);

    res.json({
      totalProducts: stats[0],
      totalCategories: stats[1],
      totalStock: stats[2] || 0,
      inStockProducts: stats[3]
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const productData = req.body;
    
    if (!productData.sku) {
      const brandCode = productData.brand.substring(0, 3).toUpperCase();
      const randomNum = Math.floor(Math.random() * 1000);
      productData.sku = `${brandCode}-${Date.now()}-${randomNum}`;
    }

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.update(req.body);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const where = {};
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    const products = await Product.findAndCountAll({
      where,
      include: [Category],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      products: products.rows,
      totalCount: products.count,
      totalPages: Math.ceil(products.count / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching products for admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;