const { redirectWith } = require('../helpers/helper');

// Harus sudah login
function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    return redirectWith(res, '/login', 'error', 'Silakan login terlebih dahulu');
  }
  next();
}

// Harus seller (dipasang setelah isLoggedIn)
function isSeller(req, res, next) {
  if (req.session.user.role !== 'seller') {
    return redirectWith(res, '/login', 'error', 'Halaman ini hanya untuk seller');
  }
  next();
}

// Harus buyer (dipasang setelah isLoggedIn)
function isBuyer(req, res, next) {
  if (req.session.user.role !== 'buyer') {
    return redirectWith(res, '/login', 'error', 'Halaman ini hanya untuk pelanggan');
  }
  next();
}

module.exports = { isLoggedIn, isSeller, isBuyer };