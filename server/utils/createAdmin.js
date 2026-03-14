const { User } = require('../models');
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
  try {
    const adminCount = await User.count({ where: { role: 'admin' } });
    
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await User.create({
        email: 'admin@autoparts.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

module.exports = { createAdminUser };