module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define(
        'OrderItem',
        {
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            underscored: true,
            timestamps: false
        }
    );

    OrderItem.associate = models => {
        OrderItem.belongsTo(models.Order, {
            foreignKey: {
                name: 'orderId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        OrderItem.belongsTo(models.Episode, {
            foreignKey: {
                name: 'episodeId',
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return OrderItem;
};
