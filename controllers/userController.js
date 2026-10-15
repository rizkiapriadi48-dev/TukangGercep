const bcrypt = require('bcryptjs');
const { sequelize, User, ProviderProfile } = require('../models');
const { redirectWith, getErrorMessage } = require('../helpers/helper');

class UserController {
  static showLogin(req, res) {
    const { error, success } = req.query;
    res.render('users/login', { error, success });
  }

  static showRegister(req, res) {
    const { error } = req.query;
    res.render('users/register', { error });
  }

  static async register(req, res) {
    try {
      const { username, email, password, role, fullName, phone } = req.body;

      // Rapikan nomor telepon: buang spasi dan tanda hubung
      const cleanPhone = phone ? phone.replace(/[\s-]/g, '') : phone;

      // Transaction: kalau salah satu gagal, semuanya dibatalkan
      await sequelize.transaction(async (t) => {
        // Password di-hash otomatis oleh hook beforeCreate di models/user.js
        const newUser = await User.create(
          { username, email, password, role, phone: cleanPhone },
          { transaction: t }
        );

        // Seller otomatis dibuatkan profil penyedia jasa (relasi One-to-One)
        if (role === 'seller') {
          await ProviderProfile.create(
            {
              UserId: newUser.id,
              fullName: fullName || username,
              phone: cleanPhone
            },
            { transaction: t }
          );
        }
      });

      redirectWith(res, '/login', 'success', 'Registrasi berhasil, silakan login');
    } catch (err) {
      redirectWith(res, '/register', 'error', getErrorMessage(err));
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return redirectWith(res, '/login', 'error', 'Invalid Email / Password');
      }

      // Simpan data lengkap supaya controller lain bisa memakai id dan role
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
      };

      if (user.role === 'seller') {
        res.redirect('/seller/items');
      } else {
        res.redirect('/');
      }
    } catch (err) {
      console.log(err);
      res.send(err.message || 'Gagal login');
    }
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return redirectWith(res, '/login', 'error', 'Gagal logout');
      }
      res.redirect('/login');
    });
  }
}

module.exports = UserController;
