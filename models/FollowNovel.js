module.exports = (sequelize, DataTypes) => {
    const FollowNovel = sequelize.define(
        'FollowNovel', {},
        {
            underscored: true,
            timestamps: false
        }
    );

    FollowNovel.associate = models => {
        FollowNovel.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        FollowNovel.belongsTo(models.Novel, {
            foreignKey: {
                name: 'novelId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return FollowNovel;
};
