const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const { Product, Category } = require('../models');

router.get('/', async (req, res) => {
  try {
    const { category, brand, carBrand, page = 1, limit = 12 } = req.query;
    
    const where = {};
    if (category) where.categoryId = category;
    if (brand) where.brand = { [Op.iLike]: `%${brand}%` };
    if (carBrand) where.carBrand = { [Op.iLike]: `%${carBrand}%` };
    
    const products = await Product.findAndCountAll({
      where,
      include: [Category],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    res.json({
      products: products.rows,
      totalCount: products.count,
      totalPages: Math.ceil(products.count / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category]
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          { brand: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [Category]
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;