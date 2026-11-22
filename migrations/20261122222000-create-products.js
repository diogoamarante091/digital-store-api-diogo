'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      enabled: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: false },
      name: { allowNull: false, type: Sequelize.STRING },
      slug: { allowNull: false, type: Sequelize.STRING, unique: true },
      stock: { allowNull: false, type: Sequelize.INTEGER, defaultValue: 0 },
      description: { allowNull: true, type: Sequelize.STRING },
      price: { allowNull: false, type: Sequelize.FLOAT },
      price_with_discount: { allowNull: false, type: Sequelize.FLOAT },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('products')
  },
}
