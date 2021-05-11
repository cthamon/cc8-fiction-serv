const express = require('express');
const { upload } = require('../controllers/multer');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/me', userController.protect, userController.me);
router.post('/register', upload.single('image'), userController.uploadPicture, userController.register);
router.post('/login', userController.login);
router.patch('/password', userController.protect, userController.changePassword);
router.patch('/updatepic', userController.protect, upload.single('image'), userController.uploadPicture, userController.updateProfilePic);
router.patch('/deletepic', userController.protect, userController.deleteProfilePic);
router.patch('/edit', userController.protect, userController.updateUser);
router.patch('/editpw', userController.protect, userController.updateSecureUser);

module.exports = router;
