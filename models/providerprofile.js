'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProviderProfile extends Model {
    static associate(models) {
      ProviderProfile.belongsTo(models.User, {
        foreignKey: 'UserId'
      });
    }
  }

  ProviderProfile.init({
    UserId: DataTypes.INTEGER,
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Nama lengkap wajib diisi' },
        notEmpty: { msg: 'Nama lengkap wajib diisi' }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Nomor telepon wajib diisi' },
        notEmpty: { msg: 'Nomor telepon wajib diisi' },
        isNumeric: { msg: 'Nomor telepon hanya boleh berisi angka' },
        len: { args: [9, 15], msg: 'Nomor telepon harus 9 sampai 15 digit' }
      }
    }
  }, {
    sequelize,
    modelName: 'ProviderProfile',
  });

  return ProviderProfile;
};
