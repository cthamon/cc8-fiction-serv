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
router.get('/follow/', userController.protect, userController.getFollowList);
router.post('/follow/:followingId', userController.protect, userController.follow);
router.delete('/unfollow/:id', userController.protect, userController.unfollow);
router.get('/follownovel/', userController.protect, userController.getFollowNovelList);
router.post('/follownovel/:novelId', userController.protect, userController.followNovel);
router.delete('/unfollownovel/:id', userController.protect, userController.unfollowNovel);
router.get('/history/', userController.protect, userController.viewHistory);
router.post('/read/:novelContentId', userController.protect, userController.historySave);
router.delete('/unread/:id', userController.protect, userController.removeHistory);


module.exports = router;
