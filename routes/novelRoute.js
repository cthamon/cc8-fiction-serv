const express = require('express');
const { upload } = require('../controllers/multer');
const novelController = require('../controllers/novelController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', novelController.getAllNovel);
router.get('/:id', novelController.getNovel);
router.get('/:novelId/episode', novelController.getAllEpisode);
router.get('/:novelId/episode/:episodeNumber', novelController.getEpisode);
router.get('/user', userController.protect, novelController.getUserNovel);
router.post('/create', userController.protect, upload.single('image'), novelController.uploadPicture, novelController.createNovel);
router.post('/createcontent/:novelId', userController.protect, novelController.createEpisode);
router.patch('/updatepic/:id', userController.protect, upload.single('image'), novelController.uploadPicture, novelController.updateCoverPic);
router.patch('/edit/:id', userController.protect, novelController.editNovel);
router.patch('/editcontent/:novelId/:episodeNumber', userController.protect, novelController.editNovelContent);
router.delete('/:id', userController.protect, novelController.deleteNovel);
router.delete('/content/:novelId/:episodeNumber', userController.protect, novelController.deleteContent);

module.exports = router;
