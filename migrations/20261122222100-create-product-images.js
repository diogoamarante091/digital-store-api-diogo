'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_images', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      product_id: { allowNull: false, type: Sequelize.INTEGER, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE' },
      enabled: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: true },
      type: { allowNull: true, type: Sequelize.STRING },
      path: { allowNull: false, type: Sequelize.TEXT },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('product_images')
  },
}
