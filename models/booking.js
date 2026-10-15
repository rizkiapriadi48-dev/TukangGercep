'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: 'UserId'
      });

      Booking.hasMany(models.BookingItem, {
        foreignKey: 'BookingId'
      });

      Booking.belongsToMany(models.Item, {
        through: models.BookingItem,
        foreignKey: 'BookingId',
        otherKey: 'ItemId'
      });
    }
  }

  Booking.init({
    UserId: DataTypes.INTEGER,
    serviceAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Alamat pengerjaan wajib diisi' },
        notEmpty: { msg: 'Alamat pengerjaan wajib diisi' }
      }
    },
    notes:{
       type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Catatan wajib diisi' },
        notEmpty: { msg: 'Catatan wajib diisi' }
    } 
  },
    photoUrl: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Booking',
  });

  return Booking;
};
