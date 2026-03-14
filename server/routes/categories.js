const express = require('express');
const router = express.Router();
const { Category, Product } = require('../models');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [Product]
    });
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;