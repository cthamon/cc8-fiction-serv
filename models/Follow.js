module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define(
        'Follow', {},
        {
            underscored: true,
            timestamps: false
        }
    );

    Follow.associate = models => {
        Follow.belongsTo(models.User, {
            as: 'Following',
            foreignKey: {
                name: 'followingId',
                allowNull: false
            },
            onUpdate: 'RESTRICT',
            onDelete: 'RESTRICT'
        });
        Follow.belongsTo(models.User, {
            as: 'Follower',
            foreignKey: {
                name: 'followerId',
                allowNull: false
            },
            onUpdate: 'RESTRICT',
            onDelete: 'RESTRICT'
        });
    };

    return Follow;
};
