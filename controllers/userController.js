const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, Novel, Episode, Follow, FollowNovel, ReadHistory } = require('../models');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.protect = async (req, res, next) => {
    try {
        let token = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
            token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'you are unauthorized' });
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { id: payload.id } });
        if (!user) return res.status(400).json({ message: 'user not found' });
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

exports.me = (req, res, next) => {
    const { id, email, username, password, profileImg, description, address, phoneNumber } = req.user;
    res.status(200).json({
        user: {
            id,
            email,
            username,
            password,
            profileImg,
            description,
            address,
            phoneNumber
        }
    });
};

exports.userProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ where: { id } });
        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
};

exports.uploadPicture = async (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, { folder: "/project/profile" }, async (err, result) => {
        if (err) return next(err);
        req.imgUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
        next();
    });
};

exports.register = async (req, res, next) => {
    try {
        const { email, username, password, confirmPassword, profileImg, description, address, phoneNumber } = req.body;
        if (password !== confirmPassword) return res.status(400).json({ message: 'password not match' });
        const hashedPassword = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            profileImg: req.imgUrl,
            description,
            address,
            phoneNumber
        });

        const payload = { id: user.id, email, username, profileImg, description, address, phoneNumber };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: +process.env.JWT_EXPIRES_IN });
        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = await User.findOne({ where: { [Op.or]: [{ email: email }, { username: username }] } });
        if (!user) return res.status(400).json({ message: 'username or password incorrect' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'username or password incorrect' });
        const payload = { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: +process.env.JWT_EXPIRES_IN });
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, password, confirmPassword } = req.body;
        const isMatch = await bcrypt.compare(currentPassword, req.user.password);
        if (!isMatch) return res.status(400).json({ message: 'incorrect current password' });
        if (password !== confirmPassword) return res.status(400).json({ message: 'confirm password is not match' });
        const hashedPassword = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
        await User.update({ password: hashedPassword }, { where: { id: req.user.id } });
        res.status(200).json({ message: 'password has been changed' });
    } catch (err) {
        next(err);
    }
};

exports.updateProfilePic = async (req, res, next) => {
    try {
        const url = req.user.profileImg;
        const publicId = `${url.split('/')[7]}/${url.split('/')[8]}/${(url.split('/')[9]).split('.')[0]}`;
        cloudinary.uploader.destroy(publicId, async (err, result) => { if (err) return next(err); });
        await User.update({ profileImg: req.imgUrl }, { where: { id: req.user.id } });
        res.status(200).json({ message: 'profile updated' });
    } catch (err) {
        next(err);
    }
};

exports.deleteProfilePic = async (req, res, next) => {
    try {
        const url = req.user.profileImg;
        const publicId = `${url.split('/')[7]}/${url.split('/')[8]}/${(url.split('/')[9]).split('.')[0]}`;
        cloudinary.uploader.destroy(publicId, async (err, result) => { if (err) return next(err); });
        await User.update({ profileImg: '' }, { where: { id: req.user.id } });
        res.status(200).json({ message: 'profile picture deleted' });
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { currentPassword, description, address, phoneNumber } = req.body;
        const isMatch = await bcrypt.compare(currentPassword, req.user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });
        await User.update({ description, address, phoneNumber }, { where: { id: req.user.id } });
        res.status(200).json({ message: 'update user success' });
    } catch (err) {
        next(err);
    }
};

exports.getFollowList = async (req, res, next) => {
    try {
        const followList = await Follow.findAll({ where: { followerId: req.user.id }, include: { model: User, as: 'Following', attribute: ['id', 'username'] } });
        const followLists = followList.map(item => { return { username: item.Following.username, profileImg: item.Following.profileImg, unFollowUserId: item.Following.id }; });
        res.status(200).json({ followLists });
    } catch (err) {
        next(err);
    }
};

exports.follow = async (req, res, next) => {
    try {
        const { followingId } = req.params;
        const followList = await Follow.findOne({ where: { [Op.and]: [{ followingId }, { followerId: req.user.id }] } });
        if (followList) return res.status(400).json({ message: 'already follow' });
        const follow = await Follow.create({ followerId: req.user.id, followingId });
        res.status(200).json({ follow });
    } catch (err) {
        next(err);
    }
};

exports.unfollow = async (req, res, next) => {
    try {
        const { followingId } = req.params;
        await Follow.destroy({ where: { [Op.and]: [{ followingId }, { followerId: req.user.id }] } });
        res.status(200).json({ message: 'unfollow' });
    } catch (err) {
        next(err);
    }
};

exports.getFollowNovelList = async (req, res, next) => {
    try {
        const novelList = await FollowNovel.findAll({ where: { userId: req.user.id }, include: { model: Novel, include: { model: User } }, order: [[Novel, 'title']] });
        const novelLists = novelList.map(item => { return { title: item.Novel.title, description: item.Novel.description, novelType: item.Novel.novelType, cover: item.Novel.cover, writer: item.Novel.User.username, id: item.id, novelId: item.Novel.id }; });
        res.status(200).json({ novelLists });
    } catch (err) {
        next(err);
    }
};

exports.getAllFollowNovelList = async (req, res, next) => {
    try {
        const follow = await FollowNovel.findAll();
        res.status(200).json({ follow });
    } catch (err) {
        next(err);
    }
};

exports.followNovel = async (req, res, next) => {
    try {
        const { novelId } = req.params;
        const novelList = await FollowNovel.findOne({ where: { [Op.and]: [{ novelId }, { userId: req.user.id }] } });
        if (novelList) return res.status(400).json({ message: 'already follow' });
        const follow = await FollowNovel.create({ userId: req.user.id, novelId });
        res.status(200).json({ follow });
    } catch (err) {
        next(err);
    }
};

exports.unfollowNovel = async (req, res, next) => {
    try {
        const { novelId } = req.params;
        await FollowNovel.destroy({ where: { novelId } });
        res.status(200).json({ message: 'unfollow' });
    } catch (err) {
        next(err);
    }
};

exports.getReadNovelList = async (req, res, next) => {
    try {
        const readList = await ReadHistory.findAll({ include: { model: Episode } });
        const novelList = readList.map(item => { return { novelId: item.Episode.novelId, episodeId: item.episodeId, userId: item.userId }; });
        res.status(200).json({ novelList });
    } catch (err) {
        next(err);
    }
};

exports.viewHistory = async (req, res, next) => {
    try {
        const history = await ReadHistory.findAll({
            where: { userId: req.user.id },
            order: [['updatedAt', 'DESC']],
            include: { model: Episode, include: Novel }
        });
        const histories = history.map(item => { return { novelId: item.Episode.Novel.id, novel: item.Episode.Novel.title, episodeId: item.Episode.id, episodeTitle: item.Episode.episodeTitle, episodeNumber: item.Episode.episodeNumber, updatedAt: item.updatedAt, removeId: item.id }; });
        res.status(200).json({ histories });
    } catch (err) {
        next(err);
    }
};

exports.historySave = async (req, res, next) => {
    try {
        const { episodeId } = req.params;
        const history = await ReadHistory.findOne({ where: { [Op.and]: [{ episodeId }, { userId: req.user.id }] } });
        if (history) {
            await ReadHistory.update({ userId: req.user.id }, { where: { [Op.and]: [{ episodeId }, { userId: req.user.id }] } });
            return res.status(400).json({ message: 'update time' });
        }
        const readHistory = await ReadHistory.create({ userId: req.user.id, episodeId });
        res.status(200).json({ readHistory });
    } catch (err) {
        next(err);
    }
};

exports.removeHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await ReadHistory.destroy({ where: { id } });
        res.status(200).json({ message: 'delete success' });
    } catch (err) {
        next(err);
    }
};