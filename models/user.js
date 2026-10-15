'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.ProviderProfile, {
        foreignKey: 'UserId'
      });

      User.hasMany(models.Item, {
        foreignKey: 'UserId'
      });

      User.hasMany(models.Booking, {
        foreignKey: 'UserId'
      });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Username wajib diisi' },
        notEmpty: { msg: 'Username wajib diisi' }
      }
    },
    email: { //requirement untuk password email dan role
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Email sudah terdaftar' },
      validate: {
        notNull: { msg: 'Email wajib diisi' },
        notEmpty: { msg: 'Email wajib diisi' },
        isEmail: { msg: 'Format email tidak valid' }
      }
    },
    password: { //requirement untuk password email dan role
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Password wajib diisi' },
        notEmpty: { msg: 'Password wajib diisi' },
        len: { args: [8, 100], msg: 'Password minimal 8 karakter' }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: { args: [['buyer', 'seller']], msg: 'Role harus buyer atau seller' }
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
    hooks: {
      beforeCreate(user) {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    sequelize,
    modelName: 'User',
  });

  return User;
};
