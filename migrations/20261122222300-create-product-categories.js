'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_categories', {
      product_id: { allowNull: false, primaryKey: true, type: Sequelize.INTEGER, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE' },
      category_id: { allowNull: false, primaryKey: true, type: Sequelize.INTEGER, references: { model: 'categories', key: 'id' }, onDelete: 'CASCADE' },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('product_categories')
  },
}
