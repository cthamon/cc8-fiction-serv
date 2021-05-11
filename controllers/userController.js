const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');
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
    const { email, username, password, profileImg, description, address, phoneNumber } = req.user;
    res.status(200).json({
        user: {
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
        const { description } = req.body;
        await User.update({ description }, { where: { id: req.user.id } });
        res.status(200).json({ message: 'update user success' });
    } catch (err) {
        next(err);
    }
};

exports.updateSecureUser = async () => {
    try {
        const { currentPassword, description, address, phoneNumber } = req.body;
        const isMatch = await bcrypt.compare(currentPassword, req.user.password);
        if (!isMatch) return res.status(400).json({ message: 'incorrect current password' });
        await User.update({ description, address, phoneNumber }, { where: { id: req.user.id } });
        res.status(200).json({ message: 'update user success' });
    } catch (err) {
        next(err);
    }
};