module.exports = (sequelize, DataTypes) => {
    const ReadHistory = sequelize.define(
        'ReadHistory', {},
        {
            underscored: true,
        }
    );

    ReadHistory.associate = models => {
        ReadHistory.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        ReadHistory.belongsTo(models.Episode, {
            foreignKey: {
                name: 'episodeId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return ReadHistory;
};
