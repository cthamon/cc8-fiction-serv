const express = require('express');
const { upload } = require('../controllers/multer');
const novelController = require('../controllers/novelController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', novelController.getAllNovel);
router.get('/user', userController.protect, novelController.getUserNovel);
router.post('/create', userController.protect, upload.single('image'), novelController.uploadPicture, novelController.createNovel);

module.exports = router;
