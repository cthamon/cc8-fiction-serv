module.exports = (sequelize, DataTypes) => {
    const NovelContent = sequelize.define(
        'NovelContent',
        {
            episodeTitle: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            underscored: true
        }
    );

    NovelContent.associate = models => {
        NovelContent.belongsTo(models.Novel, {
            foreignKey: {
                name: 'novelId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        NovelContent.hasMany(models.Comment, {
            foreignKey: {
                name: 'novelContentId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        NovelContent.hasMany(models.OrderItem, {
            foreignKey: {
                name: 'novelContentId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        NovelContent.hasMany(models.ReadHistory, {
            foreignKey: {
                name: 'novelContentId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return NovelContent;
};
