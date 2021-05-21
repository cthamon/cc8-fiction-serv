const { Op } = require('sequelize');
const { Order, OrderItem, User, Novel, NovelContent } = require('../models');

exports.getOrder = async (req, res, next) => {
    try {
        const order = await OrderItem.findAll({ include: [{ model: Order, where: { userId: req.user.id }, include: { model: User } }, { model: NovelContent, include: { model: Novel } }] });
        const orders = order.map(({ orderId, Order, NovelContent }) => {
            return { orderId, address: Order.address, createAt: Order.createdAt, novel: NovelContent.Novel.title, episode: NovelContent.episodeNumber, episodeTitle: NovelContent.episodeTitle, novelPrice: NovelContent.Novel.price, episodePrice: NovelContent.price, cover: NovelContent.Novel.cover, username: Order.User.username, email: Order.User.email, phoneNumber: Order.User.phoneNumber };
        });
        res.status(200).json({ orders });
    } catch (err) {
        next(err);
    }
};

exports.createOrder = async (req, res, next) => {
    try {
        const { address } = req.body;
        const order = await Order.create({ address, userId: req.user.id });
        res.status(201).json({ order });
    } catch (err) {
        next(err);
    }
};

exports.createOrderItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amount, discount, novelContentId } = req.body;
        const orderItem = await OrderItem.create({ amount, discount, novelContentId, orderId: id });
        res.status(201).json({ orderItem });
    } catch (err) {
        next(err);
    }
};
