module.exports = (sequelize, DataTypes) => {
    const Purchased = sequelize.define(
        'Purchased', {},
        {
            underscored: true,
            timestamps: false
        }
    );

    Purchased.associate = models => {
        Purchased.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onUpdate: 'RESTRICT',
            onDelete: 'RESTRICT'
        });
        Purchased.belongsTo(models.Episode, {
            foreignKey: {
                name: 'episodeId',
                allowNull: false
            },
            onUpdate: 'RESTRICT',
            onDelete: 'RESTRICT'
        });
    };

    return Purchased;
};
