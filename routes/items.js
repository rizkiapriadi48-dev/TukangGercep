const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');

router.get('/', Controller.showItems);
router.get('/:id', Controller.showItemDetail);

module.exports = router;