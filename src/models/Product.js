const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

module.exports = sequelize.define('Product', {
  enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  description: DataTypes.STRING,
  price: { type: DataTypes.FLOAT, allowNull: false },
  price_with_discount: { type: DataTypes.FLOAT, allowNull: false },
}, { tableName: 'products', timestamps: true, underscored: true })
