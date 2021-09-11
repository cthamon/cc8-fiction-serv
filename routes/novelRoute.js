const express = require('express');
const { upload } = require('../controllers/multer');
const novelController = require('../controllers/novelController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', novelController.getAllNovel);
router.get('/user', userController.protect, novelController.getUserNovel);
router.get('/userrating', userController.protect, novelController.getUserNovelRating);
router.get('/userrating/:id', novelController.getUserNovelRatingById);
router.get('/user/:id', novelController.getNovelByUserId);
router.get('/noveltypes', novelController.getAllNovelTypes);
router.get('/episode', novelController.getAllEpisode);
router.get('/:id', novelController.getNovel);
router.get('/:novelId/episode', novelController.getNovelEpisode);
router.get('/content/:id', novelController.getEpisodeById);
router.get('/:novelId/episode/:episodeNumber', novelController.getEpisode);
router.get('/paragraph/:episodeId', novelController.getParagraph);
router.post('/create', userController.protect, upload.single('image'), novelController.uploadPicture, novelController.createNovel);
router.post('/createcontent/:novelId', userController.protect, novelController.createContent);
router.patch('/edit/:id', userController.protect, upload.single('image'), novelController.uploadPicture, novelController.editNovel);
router.patch('/editcontent/:episodeId', userController.protect, novelController.editContent);
router.delete('/:id', userController.protect, novelController.deleteNovel);
router.delete('/content/:id', userController.protect, novelController.deleteContent);
router.get('/rating/:novelId', novelController.getNovelRating);
router.post('/rating/:novelId', userController.protect, novelController.ratingNovel);
router.patch('/updaterating/:novelId', userController.protect, novelController.updateRating);
router.delete('/rating/:id', userController.protect, novelController.deleteRating);
router.get('/comment/:episodeId', novelController.getAllEpisodeComment);
router.get('/comment/id/:commentId', novelController.getComment);
router.post('/comment/:episodeId', userController.protect, novelController.commentEpisode);
router.post('/comment/:novelId/:episodeNumber', userController.protect, novelController.commentEpisodeNumber);
router.patch('/updatecomment/:id', userController.protect, novelController.updateComment);
router.delete('/comment/:id', userController.protect, novelController.deleteComment);


module.exports = router;