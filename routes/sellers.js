const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');
const { isLoggedIn, isSeller } = require('../middlewares/auth');

// Semua halaman dan aksi pengelolaan jasa hanya untuk seller yang sudah login.
router.use(isLoggedIn, isSeller);

router.get('/', Controller.showSellerItems);
router.post('/', Controller.createItem);
router.post('/:id/update', Controller.updateItem);
router.post('/:id/delete', Controller.deleteItem);

module.exports = router;
