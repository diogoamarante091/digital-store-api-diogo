const sequelize = require('../config/database')
const Category = require('./Category')
const Product = require('./Product')
const ProductImage = require('./ProductImage')
const ProductOption = require('./ProductOption')
const ProductCategory = require('./ProductCategory')

Product.hasMany(ProductImage, { as: 'images', foreignKey: 'product_id' })
Product.hasMany(ProductOption, { as: 'options', foreignKey: 'product_id' })
Product.belongsToMany(Category, { as: 'categories', through: ProductCategory, foreignKey: 'product_id', otherKey: 'category_id' })
Category.belongsToMany(Product, { as: 'products', through: ProductCategory, foreignKey: 'category_id', otherKey: 'product_id' })

module.exports = { sequelize, Category, Product, ProductImage, ProductOption }
