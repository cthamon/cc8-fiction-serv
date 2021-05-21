module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define(
        'Order',
        {
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            underscored: true
        }
    );

    Order.associate = models => {
        Order.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        Order.hasMany(models.OrderItem, {
            foreignKey: {
                name: 'orderId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return Order;
};
