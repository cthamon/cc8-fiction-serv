const { Novel } = require('../models');
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

exports.getAllNovel = async (req, res, next) => {
    try {
        const novels = await Novel.findAll();
        res.status(200).json({ novels });
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

