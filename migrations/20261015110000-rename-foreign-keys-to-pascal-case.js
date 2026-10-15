'use strict';

/** Mengonversi FK lama camelCase pada database yang telah bermigrasi. */
module.exports = {
  async up(queryInterface) {
    const renameIfLegacyColumnExists = async (table, legacyName, pascalName) => {
      const columns = await queryInterface.describeTable(table);
      if (columns[legacyName]) {
        await queryInterface.renameColumn(table, legacyName, pascalName);
      }
    };

    await renameIfLegacyColumnExists('ProviderProfiles', 'userId', 'UserId');
    await renameIfLegacyColumnExists('Items', 'userId', 'UserId');
    await renameIfLegacyColumnExists('Items', 'categoryId', 'CategoryId');
    await renameIfLegacyColumnExists('Bookings', 'userId', 'UserId');
    await renameIfLegacyColumnExists('BookingItems', 'bookingId', 'BookingId');
    await renameIfLegacyColumnExists('BookingItems', 'itemId', 'ItemId');
  },

  async down(queryInterface) {
    const renameIfPascalColumnExists = async (table, pascalName, legacyName) => {
      const columns = await queryInterface.describeTable(table);
      if (columns[pascalName]) {
        await queryInterface.renameColumn(table, pascalName, legacyName);
      }
    };

    await renameIfPascalColumnExists('BookingItems', 'ItemId', 'itemId');
    await renameIfPascalColumnExists('BookingItems', 'BookingId', 'bookingId');
    await renameIfPascalColumnExists('Bookings', 'UserId', 'userId');
    await renameIfPascalColumnExists('Items', 'CategoryId', 'categoryId');
    await renameIfPascalColumnExists('Items', 'UserId', 'userId');
    await renameIfPascalColumnExists('ProviderProfiles', 'UserId', 'userId');
  }
};
