const { Novel, NovelContent, Rating, Comment, sequelize } = require('../models');
const { Op } = require('sequelize');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.uploadPicture = async (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, { folder: "/project/cover" }, async (err, result) => {
        if (err) return next(err);
        req.imgUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
        next();
    });
};

exports.getAllNovel = async (req, res, next) => {
    try {
        const novels = await Novel.findAll();
        res.status(200).json({ novels });
    } catch (err) {
        next(err);
    }
};

exports.getNovel = async (req, res, next) => {
    try {
        const { id } = req.params;
        const novel = await Novel.findAll({ where: { id } });
        res.status(200).json({ novel });
    } catch (err) {
        next(err);
    }
};

exports.getUserNovel = async (req, res, next) => {
    try {
        const novels = await Novel.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ novels });
    } catch (err) {
        next(err);
    }
};

exports.getAllEpisode = async (req, res, next) => {
    try {
        const { novelId } = req.params;
        const episodes = await NovelContent.findAll({ where: { novelId } });
        res.status(200).json({ episodes });
    } catch (err) {
        next(err);
    }
};

exports.getEpisode = async (req, res, next) => {
    try {
        const { novelId, episodeNumber } = req.params;
        const episodes = await NovelContent.findAll({ where: { novelId, episodeNumber } });
        res.status(200).json({ episodes });
    } catch (err) {
        next(err);
    }
};

exports.createNovel = async (req, res, next) => {
    try {
        const { title, description, novelType, cover } = req.body;
        const { id } = (req.user);
        const novel = await Novel.create({
            userId: id,
            title,
            description,
            novelType,
            cover: req.imgUrl
        });
        res.status(201).json({ novel });
    } catch (err) {
        next(err);
    }
};

exports.updateCoverPic = async (req, res, next) => {
    try {
        const { id } = req.params;
        let url = await Novel.findAll({ where: { [Op.and]: [{ id }, { userId: req.user.id }] } });
        url = JSON.parse(JSON.stringify(url[0].cover));
        const publicId = `${url.split('/')[7]}/${url.split('/')[8]}/${(url.split('/')[9]).split('.')[0]}`;
        cloudinary.uploader.destroy(publicId, async (err, result) => { if (err) return next(err); });
        await Novel.update({ cover: req.imgUrl }, { where: { id } });
        res.status(200).json({ message: 'cover updated' });
    } catch (err) {
        next(err);
    }
};

exports.editNovel = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, novelType } = req.body;
        await Novel.update({ title, description, novelType }, { where: { [Op.and]: [{ id }, { userId: req.user.id }] } });
        res.status(200).json({ message: 'update user success' });
    } catch (err) {
        next(err);
    };
};

exports.deleteNovel = async (req, res, next) => {
    try {
        const { id } = req.params;
        let checker = await Novel.findAll({ where: { id } });
        url = JSON.parse(JSON.stringify(checker[0].cover));
        checker = JSON.parse(JSON.stringify(checker[0].userId));
        if (req.user.id !== checker) return res.status(400).json({ message: 'you are not owner of the novel' });
        const publicId = `${url.split('/')[7]}/${url.split('/')[8]}/${(url.split('/')[9]).split('.')[0]}`;
        cloudinary.uploader.destroy(publicId, async (err, result) => { if (err) return next(err); });
        await NovelContent.destroy({ where: { novelId: id } });
        await Novel.destroy({ where: { id } });
        res.status(200).json({ message: 'delete novel success' });
    } catch (err) {
        next(err);
    };
};

exports.createEpisode = async (req, res, next) => {
    try {
        const { novelId } = req.params;
        const episodeNumber = await NovelContent.count({ where: { novelId } }) + 1;
        let checker = await Novel.findAll({ where: { id: novelId } });
        checker = JSON.parse(JSON.stringify(checker[0].userId));
        if (req.user.id !== checker) return res.status(400).json({ message: 'you are not owner of the novel' });
        const { episodeTitle, content } = req.body;
        const episode = await NovelContent.create({ episodeNumber, episodeTitle, content, novelId });
        res.status(200).json({ episode });
    } catch (err) {
        next(err);
    }
};

exports.editNovelContent = async (req, res, next) => {
    try {
        const { novelId, episodeNumber } = req.params;
        let checker = await Novel.findAll({ where: { id: novelId } });
        checker = JSON.parse(JSON.stringify(checker[0].userId));
        if (req.user.id !== checker) return res.status(400).json({ message: 'you are not owner of the novel' });
        const { episodeTitle, content } = req.body;
        await NovelContent.update({ episodeTitle, content }, { where: { [Op.and]: [{ novelId }, { episodeNumber }] } });
        res.status(200).json({ message: "update success" });
    } catch (err) {
        next(err);
    }
};

exports.deleteContent = async (req, res, next) => {
    try {
        const { novelId, episodeNumber } = req.params;
        let checker = await Novel.findAll({ where: { id: novelId } });
        checker = JSON.parse(JSON.stringify(checker[0].userId));
        if (req.user.id !== checker) return res.status(400).json({ message: 'you are not owner of the novel' });
        await NovelContent.destroy({ where: { [Op.and]: [{ novelId }, { episodeNumber }] } });
        res.status(200).json({ message: "delete success" });
    } catch (err) {
        next(err);
    }
};

exports.getAllNovelRating = async (req, res, next) => {
    try {
        const { novelId } = req.params;
        const novelRating = await Rating.findAll({ where: { novelId } });
        res.status(200).json({ novelRating });
    } catch (err) {
        next(err);
    }
};

exports.ratingNovel = async (req, res, next) => {
    try {
        const { novelId } = req.params;
        const { score, comment } = req.body;
        const rating = await Rating.create({ score, comment, novelId, userId: req.user.id });
        res.status(200).json({ rating });
    } catch (err) {
        next(err);
    }
};

exports.updateRating = async (req, res, next) => {
    try {
        const { novelId } = req.params;
        const { score, comment } = req.body;
        await Rating.update({ score, comment }, { where: { [Op.and]: [{ novelId }, { userId: req.user.id }] } });
        res.status(200).json({ message: "update success" });
    } catch (err) {
        next(err);
    }
};

exports.deleteRating = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Rating.destroy({ where: { [Op.and]: [{ id }, { userId: req.user.id }] } });
        res.status(200).json({ message: "delete success" });
    } catch (err) {
        next(err);
    }
};

exports.getAllEpisodeComment = async (req, res, next) => {
    try {
        const { novelContentId } = req.params;
        const userComment = await Comment.findAll({ where: { novelContentId } });
        res.status(200).json({ userComment });
    } catch (err) {
        next(err);
    }
};

exports.commentEpisode = async (req, res, next) => {
    try {
        const { novelContentId } = req.params;
        const { comment } = req.body;
        const userComment = await Comment.create({ comment, novelContentId, userId: req.user.id });
        res.status(200).json({ userComment });
    } catch (err) {
        next(err);
    }
};

exports.commentEpisodeNumber = async (req, res, next) => {
    try {
        const { novelId, episodeNumber } = req.params;
        const { comment } = req.body;
        let novelContentId = await NovelContent.findAll({ where: { [Op.and]: [{ novelId, episodeNumber }] } });
        novelContentId = JSON.parse(JSON.stringify(novelContentId[0].id));
        console.log(novelContentId);
        const userComment = await Comment.create({ comment, novelContentId, userId: req.user.id });
        res.status(200).json({ userComment });
    } catch (err) {
        next(err);
    }
};

exports.updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        await Comment.update({ comment }, { where: { [Op.and]: [{ id }, { userId: req.user.id }] } });
        res.status(200).json({ message: "update success" });
    } catch (err) {
        next(err);
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Comment.destroy({ where: { [Op.and]: [{ id }, { userId: req.user.id }] } });
        res.status(200).json({ message: "delete success" });
    } catch (err) {
        next(err);
    }
};