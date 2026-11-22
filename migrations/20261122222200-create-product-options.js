'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_options', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      product_id: { allowNull: false, type: Sequelize.INTEGER, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE' },
      title: { allowNull: false, type: Sequelize.STRING },
      shape: { allowNull: false, type: Sequelize.ENUM('square', 'circle'), defaultValue: 'square' },
      radius: { allowNull: true, type: Sequelize.STRING },
      type: { allowNull: false, type: Sequelize.ENUM('text', 'color'), defaultValue: 'text' },
      values: { allowNull: false, type: Sequelize.TEXT },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('product_options')
  },
}
