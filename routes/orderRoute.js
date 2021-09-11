const express = require('express');
const userController = require('../controllers/userController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', userController.protect, orderController.getOrder);
router.post('/', userController.protect, orderController.createOrder);
router.post('/item/:id', userController.protect, orderController.createOrderItem);
router.get('/purchaselist/', userController.protect, orderController.purchaseList);
router.post('/buynovel/:novelId', userController.protect, orderController.buyNovel);
router.post('/buyepisode/:episodeId', userController.protect, orderController.buyEpisode);

module.exports = router;
