const express = require('express');
const userController = require('../controllers/userController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', userController.protect, orderController.getOrder);
router.post('/', userController.protect, orderController.createOrder);
router.post('/item/:id', userController.protect, orderController.createOrderItem);

module.exports = router;
