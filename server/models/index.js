const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: '/images/placeholder.jpg'
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  carBrand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  carModel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.STRING
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

Product.beforeSave((product, options) => {
  product.inStock = product.quantity > 0;
});
Product.beforeUpdate((product, options) => {
  product.inStock = product.quantity > 0;
});

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  }
}, {
  timestamps: true
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: true
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Product.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE', hooks: true });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', onDelete: 'CASCADE' });

Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'RESTRICT' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', onDelete: 'RESTRICT' });

User.hasMany(Order, { foreignKey: 'userId', onDelete: 'SET NULL' });
Order.belongsTo(User, { foreignKey: 'userId', onDelete: 'SET NULL' });

module.exports = {
  sequelize,
  Category,
  Product,
  Order,
  OrderItem,
  User
};
