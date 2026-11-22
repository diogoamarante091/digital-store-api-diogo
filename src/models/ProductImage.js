const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

module.exports = sequelize.define('ProductImage', {
  enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  type: DataTypes.STRING,
  path: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'product_images', timestamps: true, underscored: true })
