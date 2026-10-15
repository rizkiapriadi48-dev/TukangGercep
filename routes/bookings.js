const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');
const uploadPhoto = require('../middlewares/upload');
const { isLoggedIn, isBuyer } = require('../middlewares/auth');

// Pesanan hanya dapat dilihat dan dibuat oleh buyer yang sudah login.
router.use(isLoggedIn, isBuyer);

router.get('/', Controller.showBookings);
router.post('/', uploadPhoto, Controller.createBooking);
router.post('/:id/cancel', Controller.cancelBooking);

module.exports = router;
