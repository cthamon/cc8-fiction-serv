const express = require('express');
const novelController = require('../controllers/novelController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/create', userController.protect, novelController.createNovel);

module.exports = router;
