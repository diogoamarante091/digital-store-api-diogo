const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

module.exports = sequelize.define('ProductOption', {
  title: { type: DataTypes.STRING, allowNull: false },
  shape: { type: DataTypes.ENUM('square', 'circle'), defaultValue: 'square' },
  radius: DataTypes.STRING,
  type: { type: DataTypes.ENUM('text', 'color'), defaultValue: 'text' },
  values: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() { return JSON.parse(this.getDataValue('values') || '[]') },
    set(value) { this.setDataValue('values', JSON.stringify(value)) },
  },
}, { tableName: 'product_options', timestamps: true, underscored: true })
