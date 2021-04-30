const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/me', userController.protect, userController.me);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/', userController.protect, userController.updateUser);

module.exports = router;
