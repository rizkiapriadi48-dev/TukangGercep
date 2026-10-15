'use strict';
const { Model, Op } = require('sequelize');
const { formatRupiah } = require('../helpers/helper');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsTo(models.User, {
        foreignKey: 'UserId'
      });

      Item.belongsTo(models.Category, {
        foreignKey: 'CategoryId'
      });

      Item.hasMany(models.BookingItem, {
        foreignKey: 'ItemId'
      });

      Item.belongsToMany(models.Booking, {
        through: models.BookingItem,
        foreignKey: 'ItemId',
        otherKey: 'BookingId'
      });
    }

    // Getter: harga dalam format rupiah
    get formattedPrice() {
      return formatRupiah(this.price);
    }

    // Static method: ambil daftar jasa (search, filter, sort, eager loading)
    static getServices({ search, categoryId, sort, limit } = {}) {
      const where = {};

      if (search) {
        where.name = { [Op.iLike]: `%${search}%` };
      }

      if (categoryId) {
        where.CategoryId = categoryId;
      }

      let order = [['createdAt', 'DESC']];
      if (sort === 'price_asc') order = [['price', 'ASC']];
      if (sort === 'price_desc') order = [['price', 'DESC']];
      if (sort === 'oldest') order = [['createdAt', 'ASC']];
      if (sort === 'newest') order = [['createdAt', 'DESC']];

      const options = {
        where,
        order,
        include: [
          { model: sequelize.models.Category },
          {
            model: sequelize.models.User,
            include: [{ model: sequelize.models.ProviderProfile }]
          }
        ]
      };

      if (limit) options.limit = limit;

      return Item.findAll(options);
    }
  }

  Item.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Nama jasa wajib diisi' },
        notEmpty: { msg: 'Nama jasa wajib diisi' }
      }
    },
    description: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Harga wajib diisi' },
        isInt: { msg: 'Harga harus berupa angka' },
        min: { args: [1], msg: 'Harga harus lebih dari 0' }
      }
    },
    UserId: DataTypes.INTEGER,
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Kategori wajib dipilih' }
      }
    }
  }, {
    hooks: {
      // Merapikan spasi nama jasa sebelum divalidasi dan disimpan
      beforeValidate(item) {
        if (item.name) {
          item.name = item.name.trim().replace(/\s+/g, ' ');
        }
      }
    },
    sequelize,
    modelName: 'Item',
  });

  return Item;
};
