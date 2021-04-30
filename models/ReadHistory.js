module.exports = (sequelize, DataTypes) => {
    const ReadHistory = sequelize.define(
        'ReadHistory', {},
        {
            underscored: true,
            timestamps: false
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
        ReadHistory.belongsTo(models.NovelContent, {
            foreignKey: {
                name: 'novelContentId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return ReadHistory;
};
