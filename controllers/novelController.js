const { Novel } = require('../models');

exports.createNovel = async (req, res, next) => {
    try {
        const { title, description, novelType, cover } = req.body;
        const { id } = (req.user);
        // if (password !== confirmPassword) return res.status(400).json({ message: 'password not match' });
        const novel = await Novel.create({
            userId: id,
            title,
            description,
            novelType,
            cover
        });
        res.status(201).json({ novel });
    } catch (err) {
        next(err);
    }
};

