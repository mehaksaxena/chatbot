const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const User = require('./User')(sequelize, DataTypes); 

module.exports = { sequelize, User };
