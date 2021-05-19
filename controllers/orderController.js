const { Op } = require('sequelize');
const { Order, OrderItem } = require('../models');

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
        const orderItem = await Order.create({ amount, discount, novelContentId, orderId: id });
        res.status(201).json({ orderItem });
    } catch (err) {
        next(err);
    }
};
