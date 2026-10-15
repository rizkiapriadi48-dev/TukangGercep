const { Item, Category, User, ProviderProfile, Booking, BookingItem } = require('../models');
const { redirectWith, getErrorMessage } = require('../helpers/helper');

class Controller {
  // ===== HOME (landing page + search/filter/sort) =====

  static async home(req, res) {
    try {
      const { search, categoryId, sort } = req.query;

      const categories = await Category.findAll();
      const items = await Item.getServices({ search, categoryId, sort });

      res.render('home', {
        categories,
        items,
        search: search || '',
        categoryId: categoryId || '',
        sort: sort || 'newest'
      });
    } catch (error) {
      res.send(error.message);
    }
  }

  // ===== DAFTAR JASA DAN DETAIL =====

    static async showItems(req, res) {
    try {
      const items = await Item.getServices();

      res.render('items', { items });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async showItemDetail(req, res) {
    try {
      const { id } = req.params;
      const { error } = req.query;

      const item = await Item.findByPk(id, {
        include: [
          { model: Category },
          {
            model: User,
            include: [{ model: ProviderProfile }]
          }
        ]
      });

      if (!item) return res.send('Jasa tidak ditemukan');

      res.render('item-detail', { item, error });
    } catch (error) {
      res.send(error.message);
    }
  }

  // ===== CRUD SELLER =====

  static async showSellerItems(req, res) {
    try {
      const user = req.session.user;
      const { edit, success, error } = req.query;

      const items = await Item.findAll({
        where: { UserId: user.id },
        include: [{ model: Category }],
        order: [['createdAt', 'DESC']]
      });
      const categories = await Category.findAll();

      // Kalau ada ?edit=ID, cari jasa yang mau diedit
      const editItem = edit ? items.find(item => item.id == edit) : null;

      res.render('seller-items', { items, categories, editItem, success, error });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async createItem(req, res) {
    try {
      const user = req.session.user;
      const { name, description, price, imageUrl, categoryId } = req.body;

      await Item.create({
        name,
        description,
        price,
        imageUrl,
        CategoryId: categoryId || null,
        UserId: user.id
      });

      redirectWith(res, '/seller/items', 'success', 'Jasa berhasil ditambahkan');
    } catch (error) {
      redirectWith(res, '/seller/items', 'error', getErrorMessage(error));
    }
  }

  static async updateItem(req, res) {
    try {
      const user = req.session.user;
      const { id } = req.params;
      const { name, description, price, imageUrl, categoryId } = req.body;

      // where UserId = user.id supaya seller tidak bisa mengubah jasa milik seller lain
      const item = await Item.findOne({ where: { id, UserId: user.id } });
      if (!item) {
        throw new Error('Jasa tidak ditemukan atau bukan milik Anda');
      }

      await item.update({
        name,
        description,
        price,
        imageUrl,
        CategoryId: categoryId || null
      });

      redirectWith(res, '/seller/items', 'success', 'Jasa berhasil diperbarui');
    } catch (error) {
      redirectWith(res, '/seller/items', 'error', getErrorMessage(error));
    }
  }

  // Sesuai soal: penghapusan memakai promise chaining .then() dan .catch()
  static async deleteItem(req, res) {
    try {
      const user = req.session.user;
      const { id } = req.params;

      Item.destroy({ where: { id, UserId: user.id } })
        .then(count => {
          if (!count) {
            throw new Error('Jasa tidak ditemukan atau bukan milik Anda');
          }
          redirectWith(res, '/seller/items', 'success', 'Jasa berhasil dihapus');
        })
        .catch(error => {
          redirectWith(res, '/seller/items', 'error', getErrorMessage(error));
        });
    } catch (error) {
      res.send(error.message);
    }
  }

  // ===== PEMESANAN =====

  static async showBookings(req, res) {
    try {
      const user = req.session.user;
      const { success, error } = req.query;

      const bookings = await Booking.findAll({
        where: { UserId: user.id },
        include: [
          {
            model: BookingItem,
            include: [{ model: Item }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.render('bookings', { bookings, success, error });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async createBooking(req, res) {
    try {
      const user = req.session.user;
      const { itemId, quantity, serviceAddress, notes } = req.body;
      const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const item = await Item.findByPk(itemId);
      if (!item) {
        throw new Error('Jasa tidak ditemukan');
      }

      const booking = await Booking.create({
        UserId: user.id,
        serviceAddress,
        notes,
        photoUrl,
        status: 'pending'
      });

      await BookingItem.create({
        BookingId: booking.id,
        ItemId: item.id,
        quantity: Number(quantity) || 1
      });

      redirectWith(res, '/bookings', 'success', 'Pesanan berhasil dibuat');
    } catch (error) {
      redirectWith(res, `/items/${req.body.itemId}`, 'error', getErrorMessage(error));
    }
  }

  static async cancelBooking(req, res) {
    try {
      const user = req.session.user;
      const { id } = req.params;

      const booking = await Booking.findOne({ where: { id, UserId: user.id } });
      if (!booking) {
        throw new Error('Pesanan tidak ditemukan');
      }
      if (booking.status !== 'pending') {
        throw new Error('Hanya pesanan berstatus pending yang bisa dibatalkan');
      }

      await booking.update({ status: 'cancelled' });

      redirectWith(res, '/bookings', 'success', 'Pesanan berhasil dibatalkan');
    } catch (error) {
      redirectWith(res, '/bookings', 'error', getErrorMessage(error));
    }
  }
}

module.exports = Controller;
