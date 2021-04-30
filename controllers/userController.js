const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');

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
    const { email, username, password, imgUrl, description, address, phoneNumber } = req.user;
    res.status(200).json({
        user: {
            email,
            username,
            password,
            imgUrl,
            description,
            address,
            phoneNumber
        }
    });
};

exports.register = async (req, res, next) => {
    try {
        const { email, username, password, confirmPassword, imgUrl, description, address, phoneNumber } = req.body;
        if (password !== confirmPassword) return res.status(400).json({ message: 'password not match' });
        const hashedPassword = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            imgUrl,
            description,
            address,
            phoneNumber
        });

        const payload = { id: user.id, email, username, imgUrl, description, address, phoneNumber };
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

exports.updateUser = async (req, res, next) => {
    try {
        const { firstName, lastName, motto, location } = req.body;

        // req.user.idfirstName = firstName;
        // req.user.lastName = lastName;
        // req.user.motto = motto;
        // req.user.location = location;
        // await req.user.save();

        await User.update({ firstName, lastName, motto, location }, { where: { id: req.user.id } });
        res.status(200).json({ message: 'update user success' });
    } catch (err) {
        next(err);
    }
};
