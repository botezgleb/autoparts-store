require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const { migrateDatabase } = require('./migrations/migrate');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Маршруты
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AutoParts Store API is running',
    timestamp: new Date().toISOString()
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL подключен');
    
    await migrateDatabase();
    
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      console.log(`API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Не удалось запустить сервер:', error);
    process.exit(1);
  }
};

startServer();