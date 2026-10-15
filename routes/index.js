const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');

const userRouter = require('./userRoutes');
const itemRouter = require('./items');
const sellerRouter = require('./sellers');
const bookingRouter = require('./bookings');

router.get('/', Controller.home);

router.use('/', userRouter); // /register, /login, /logout
router.use('/items', itemRouter);
router.use('/seller/items', sellerRouter);
router.use('/bookings', bookingRouter);

module.exports = router;