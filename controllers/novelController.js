const { Op } = require('sequelize');
const { User, Novel, Episode, Rating, Comment, ReadHistory, FollowNovel, Paragraph, sequelize } = require('../models');
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
        const novel = await Novel.findAll({ include: User });
        novels = novel.map(({ id, title, description, novelType, cover, price, userId, User }) => { return { id, title, description, novelType, cover, price, userId, writer: User.username, writerImg: User.profileImg }; });
        res.status(200).json({ novels });
    } catch (err) {
        next(err);
    }
};

exports.getNovel = async (req, res, next) => {
    try {
        const { id } = req.params;
        const novels = await Novel.findAll({ where: { id }, include: User });
        novel = novels.map(({ id, title, description, novelType, cover, price, userId, User }) => { return { id, title, description, novelType, cover, price, userId, writer: User.username, writerImg: User.profileImg }; });
        res.status(200).json({ novel });
    } catch (err) {
        next(err);
    }
};

exports.getUserNovel = async (req, res, next) => {
    try {
        const novel = await Novel.findAll({ where: { userId: req.user.id }, include: User });
        novels = novel.map(({ id, title, description, novelType, cover, price, userId, User }) => { return { id, title, description, novelType, cover, price, userId, writer: User.username }; });
        res.status(200).json({ novels });
    } catch (err) {
        next(err);
    }
};

exports.getAllEpisode = async (req, res, next) => {
    try {
        const { novelId } = req.params;
        const episode = await Episode.findAll({ where: { novelId }, include: { model: Novel, include: { model: User } } });
        const episodes = episode.map(({ id, episodeNumber, episodeTitle, price, Novel, updatedAt }) => { return { id, title: Novel.title, novelId: Novel.id, writer: Novel.User.username, episodeNumber, episodeTitle, price, updatedAt }; });
        res.status(200).json({ episodes });
    } catch (err) {
        next(err);
    }
};

exports.getEpisodeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const episodes = await Episode.findAll({ where: { id }, include: { model: Novel, include: { model: User } } });
        const episode = episodes.map(({ id, episodeNumber, episodeTitle, Novel }) => { return { id, title: Novel.title, writer: Novel.User.username, episodeNumber, episodeTitle }; });
        res.status(200).json({ episode });
    } catch (err) {
        next(err);
    };
};

exports.getEpisode = async (req, res, next) => {
    try {
        const { novelId, episodeNumber } = req.params;
        const episodes = await Episode.findAll({ where: { novelId, episodeNumber }, include: { model: Novel, include: { model: User } } });
        const episode = episodes.map(({ id, episodeNumber, episodeTitle, Novel }) => { return { id, title: Novel.title, writer: Novel.User.username, episodeNumber, episodeTitle }; });
        res.status(200).json({ episode });
    } catch (err) {
        next(err);
    }
};

exports.getParagraph = async (req, res, next) => {
    try {
        const { episodeId } = req.params;
        const paragraphs = await Paragraph.findAll({ where: { episodeId }, include: { model: Episode } });
        const paragraph = paragraphs.map(({ paragraph }) => { return { paragraph }; });
        res.status(200).json({ episodeNumber: paragraphs[0].Episode.episodeNumber, episodeTitle: paragraphs[0].Episode.episodeTitle, price: paragraphs[0].Episode.price, paragraph });
    } catch (err) {
        next(err);
    }
};

exports.createNovel = async (req, res, next) => {
    try {
        const { title, description, novelType, cover, price } = req.body;
        const { id } = (req.user);
        const novel = await Novel.create({
            userId: id,
            title,
            description,
            novelType,
            cover: req.imgUrl,
            price
        });
        res.status(201).json({ novel });
    } catch (err) {
        next(err);
    }
};

exports.editNovel = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, novelType, cover, price } = req.body;
        let url = await Novel.findAll({ where: { [Op.and]: [{ id }, { userId: req.user.id }] } });
        url = JSON.parse(JSON.stringify(url[0].cover));
        const publicId = `${url.split('/')[7]}/${url.split('/')[8]}/${(url.split('/')[9]).split('.')[0]}`;
        cloudinary.uploader.destroy(publicId, async (err, result) => { if (err) return next(err); });
        await Novel.update({ title, description, novelType, price }, { where: { [Op.and]: [{ id }, { userId: req.user.id }] } });
        await Novel.update({ cover: req.imgUrl }, { where: { id } });
        res.status(200).json({ message: 'update novel success' });
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
        const novels = await Episode.findAll({ where: { novelId: id } });
        const episodeId = await novels.map(item => item.id);
        await ReadHistory.destroy({ where: { episodeId } });
        await Comment.destroy({ where: { episodeId } });
        await FollowNovel.destroy({ where: { novelId: id } });
        await Rating.destroy({ where: { novelId: id } });
        await Episode.destroy({ where: { novelId: id } });
        await Novel.destroy({ where: { id } });
        res.status(200).json({ message: 'delete novel success' });
    } catch (err) {
        next(err);
    };
};

exports.createContent = async (req, res, next) => {
    try {
        const { novelId } = req.params;
        let { episodeNumber, episodeTitle, price, paragraph } = req.body;
        if (!episodeNumber) episodeNumber = await Episode.count({ where: { novelId } }) + 1;
        const checkDuplicate = await Episode.findAll({ where: { novelId } });
        const checkDup = checkDuplicate.map(item => item.episodeNumber);
        if (checkDup.includes(episodeNumber)) return res.status(400).json({ message: 'episode number exist' });
        let checker = await Novel.findAll({ where: { id: novelId } });
        checker = JSON.parse(JSON.stringify(checker[0].userId));
        if (req.user.id !== checker) return res.status(400).json({ message: 'you are not owner of the novel' });
        const episode = await Episode.create({ episodeNumber, episodeTitle, novelId, price });
        const episodeId = (JSON.stringify(episode.id));
        const info = paragraph.map(item => ({ 'paragraph': item, episodeId }));
        const content = await Paragraph.bulkCreate(info);
        res.status(200).json({ episode, content });
    } catch (err) {
        next(err);
    }
};

exports.editContent = async (req, res, next) => {
    try {
        const { episodeId } = req.params;
        const { episodeNumber, episodeTitle, price, paragraph } = req.body;
        await Episode.update({ episodeNumber, episodeTitle, price }, { where: { id: episodeId } });
        await Paragraph.destroy({ where: { episodeId } });
        const info = paragraph.map(item => ({ 'paragraph': item, episodeId }));
        await Paragraph.bulkCreate(info);
        res.status(200).json({ message: "update success" });
    } catch (err) {
        next(err);
    }
};

exports.deleteContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        await ReadHistory.destroy({ where: { episodeId: id } });
        await Comment.destroy({ where: { episodeId: id } });
        await Paragraph.destroy({ where: { episodeId: id } });
        await Episode.destroy({ where: { id } });
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
        const { episodeId } = req.params;
        const userComment = await Comment.findAll({ where: { episodeId } });
        res.status(200).json({ userComment });
    } catch (err) {
        next(err);
    }
};

exports.getAllEpisodeCommentNumber = async (req, res, next) => {
    try {
        const { novelId, episodeNumber } = req.params;
        let episodeId = await Episode.findAll({ where: { [Op.and]: [{ novelId, episodeNumber }] } });
        episodeId = JSON.parse(JSON.stringify(episodeId[0].id));
        const userComment = await Comment.findAll({ where: { episodeId } });
        res.status(200).json({ userComment });
    } catch (err) {
        next(err);
    }
};

exports.commentEpisode = async (req, res, next) => {
    try {
        const { episodeId } = req.params;
        const { comment } = req.body;
        const userComment = await Comment.create({ comment, episodeId, userId: req.user.id });
        res.status(200).json({ userComment });
    } catch (err) {
        next(err);
    }
};

exports.commentEpisodeNumber = async (req, res, next) => {
    try {
        const { novelId, episodeNumber } = req.params;
        const { comment } = req.body;
        let episodeId = await Episode.findAll({ where: { [Op.and]: [{ novelId, episodeNumber }] } });
        episodeId = JSON.parse(JSON.stringify(episodeId[0].id));
        const userComment = await Comment.create({ comment, episodeId, userId: req.user.id });
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