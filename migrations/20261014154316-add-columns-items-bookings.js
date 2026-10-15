'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Items', 'description', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn('Items', 'imageUrl', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Bookings', 'notes', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn('Bookings', 'photoUrl', {
      type: Sequelize.STRING
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Items', 'description');
    await queryInterface.removeColumn('Items', 'imageUrl');
    await queryInterface.removeColumn('Bookings', 'notes');
    await queryInterface.removeColumn('Bookings', 'photoUrl');
  }
};