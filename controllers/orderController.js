const { Op } = require('sequelize');
const { Order, OrderItem, User, Novel, Episode, Purchased } = require('../models');

exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findAll({ include: [{ model: OrderItem, include: { model: Episode, include: { model: Novel, include: { model: User } } } }, { model: User }], where: { userId: req.user.id } });
        const orders = order.map(({ id, address, createdAt, userId, OrderItems, User, discount }) => {
            return {
                id, address, createdAt, userId, email: User.email, username: User.username, phoneNumber: User.phoneNumber, discount,
                orderItems: OrderItems.map(item => {
                    return {
                        novelId: item.Episode.Novel.id,
                        novelTitle: item.Episode.Novel.title,
                        cover: item.Episode.Novel.cover,
                        novelPrice: item.Episode.Novel.price,
                        writer: item.Episode.Novel.User.username,
                        episodeId: item.Episode.id,
                        episodeTitle: item.Episode.episodeTitle,
                        episodePrice: item.Episode.price,
                    };
                })
            };
        });
        res.status(200).json({ orders });
    } catch (err) {
        next(err);
    }
};

exports.createOrder = async (req, res, next) => {
    try {
        const { address, discount } = req.body;
        const order = await Order.create({ address, userId: req.user.id, discount });
        res.status(201).json({ order });
    } catch (err) {
        next(err);
    }
};

exports.createOrderItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amount, episodeId } = req.body;
        const orderItem = await OrderItem.create({ amount, episodeId, orderId: id });
        res.status(201).json({ orderItem });
    } catch (err) {
        next(err);
    }
};

exports.purchaseList = async (req, res, next) => {
    try {
        const { id } = req.user;
        const purchaseList = await Purchased.findAll({ where: { userId: id } });
        res.status(200).json({ purchaseList });
    } catch (err) {
        next(err);
    }
};

exports.buyNovel = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { novelId } = req.params;
        const novel = await Episode.findAll({ where: { novelId } });
        const info = novel.map((item) => ({ userId: id, episodeId: item.id }));
        await Purchased.bulkCreate(info);
        const purchaseList = await Purchased.findAll({ where: { userId: id } });
        res.status(200).json({ purchaseList });
    } catch (err) {
        next(err);
    }
};

exports.buyEpisode = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { episodeId } = req.params;
        await Purchased.create({ userId: id, episodeId });
        const purchaseList = await Purchased.findAll({ where: { userId: id } });
        res.status(200).json({ purchaseList });
    } catch (err) {
        next(err);
    }
};