'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      firstname: { allowNull: false, type: Sequelize.STRING },
      surname: { allowNull: false, type: Sequelize.STRING },
      email: { allowNull: false, type: Sequelize.STRING, unique: true },
      password: { allowNull: false, type: Sequelize.STRING },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users')
  },
}
