module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define(
        'OrderItem',
        {
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            discount: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            underscored: true,
            // timestamps: false
        }
    );

    OrderItem.associate = models => {
        OrderItem.belongsTo(models.OrderItem, {
            foreignKey: {
                name: 'orderId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        OrderItem.belongsTo(models.NovelContent, {
            foreignKey: {
                name: 'novelContentId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return OrderItem;
};
