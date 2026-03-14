require('dotenv').config();

const { sequelize } = require('../models');
const { createAdminUser } = require('../utils/createAdmin');

const migrateDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');

    await createAdminUser();
    console.log('Admin user ensured');
  } catch (error) {
    console.error('Database sync failed:', error);
  }
};

if (require.main === module) {
  migrateDatabase();
}

module.exports = { migrateDatabase };
