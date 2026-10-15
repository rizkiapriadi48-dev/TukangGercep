'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingItem.belongsTo(models.Booking, {
        foreignKey: 'BookingId'
      });

      BookingItem.belongsTo(models.Item, {
        foreignKey: 'ItemId'
      });
    }
  }
  BookingItem.init({
    BookingId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BookingItem',
  });
  return BookingItem;
};
