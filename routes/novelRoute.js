const express = require('express');
const { upload } = require('../controllers/multer');
const novelController = require('../controllers/novelController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', novelController.getAllNovel);
router.get('/user', userController.protect, novelController.getUserNovel);
router.get('/:id', novelController.getNovel);
router.get('/:novelId/episode', novelController.getAllEpisode);
router.get('/content/:id', novelController.getEpisodeById);
router.get('/:novelId/episode/:episodeNumber', novelController.getEpisode);
router.post('/create', userController.protect, upload.single('image'), novelController.uploadPicture, novelController.createNovel);
router.post('/createcontent/:novelId', userController.protect, novelController.createEpisode);
router.patch('/updatepic/:id', userController.protect, upload.single('image'), novelController.uploadPicture, novelController.updateCoverPic);
router.patch('/edit/:id', userController.protect, novelController.editNovel);
router.patch('/editcontent/:id', userController.protect, novelController.editNovelContentById);
router.delete('/:id', userController.protect, novelController.deleteNovel);
router.delete('/content/:id', userController.protect, novelController.deleteContent);
router.get('/rating/:novelId', novelController.getAllNovelRating);
router.post('/rating/:novelId', userController.protect, novelController.ratingNovel);
router.patch('/updaterating/:novelId', userController.protect, novelController.updateRating);
router.delete('/rating/:id', userController.protect, novelController.deleteRating);
router.get('/comment/:novelContentId', novelController.getAllEpisodeComment);
router.get('/comment/novel/:novelId/:episodeNumber', novelController.getAllEpisodeCommentNumber);
router.post('/comment/:novelContentId', userController.protect, novelController.commentEpisode);
router.post('/comment/:novelId/:episodeNumber', userController.protect, novelController.commentEpisodeNumber);
router.patch('/updatecomment/:id', userController.protect, novelController.updateComment);
router.delete('/comment/:id', userController.protect, novelController.deleteComment);

module.exports = router;