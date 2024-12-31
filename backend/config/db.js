const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'messaging_app',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'mehak@123',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    port: 3306,
    logging: false, 
  }
);

module.exports = sequelize;
