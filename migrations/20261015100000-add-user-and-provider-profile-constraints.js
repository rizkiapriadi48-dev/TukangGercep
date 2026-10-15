'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Users', {
      fields: ['email'],
      type: 'unique',
      name: 'users_email_unique'
    });

    await queryInterface.addConstraint('ProviderProfiles', {
      fields: ['UserId'],
      type: 'unique',
      name: 'provider_profiles_user_id_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('ProviderProfiles', 'provider_profiles_user_id_unique');
    await queryInterface.removeConstraint('Users', 'users_email_unique');
  }
};
