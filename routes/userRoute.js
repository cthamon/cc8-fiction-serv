const express = require('express');
const { upload } = require('../controllers/multer');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/me', userController.protect, userController.me);
router.post('/register', upload.single('image'), userController.uploadPicture, userController.register);
router.post('/login', userController.login);
router.patch('/upload', userController.protect, upload.single('image'), userController.reUploadPicture);
// router.put('/', userController.protect, userController.updateUser);

module.exports = router;
