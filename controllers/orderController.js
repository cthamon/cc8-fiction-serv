const { Op } = require('sequelize');
const { Order, OrderItem, User, Novel, NovelContent } = require('../models');

exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findAll({ include: [{ model: OrderItem, include: { model: NovelContent, include: { model: Novel, include: { model: User } } } }, { model: User }], where: { userId: req.user.id } });
        const orders = order.map(({ id, address, createdAt, userId, OrderItems, User }) => {
            return {
                id, address, createdAt, userId, email: User.email, username: User.username, phoneNumber: User.phoneNumber,
                orderItems: OrderItems.map(item => {
                    return {
                        novelId: item.NovelContent.Novel.id,
                        novelTitle: item.NovelContent.Novel.title,
                        cover: item.NovelContent.Novel.cover,
                        novelPrice: item.NovelContent.Novel.price,
                        writer: item.NovelContent.Novel.User.username,
                        episodeId: item.NovelContent.id,
                        episodeTitle: item.NovelContent.episodeTitle,
                        episodePrice: item.NovelContent.price,
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
