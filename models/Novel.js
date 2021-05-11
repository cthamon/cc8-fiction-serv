module.exports = (sequelize, DataTypes) => {
    const Novel = sequelize.define(
        'Novel',
        {
            title: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
            },
            novelType: {
                type: DataTypes.STRING,
                allowNull: false
            },
            cover: {
                type: DataTypes.STRING
            }
        },
        {
            underscored: true
        }
    );

    Novel.associate = models => {
        Novel.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        Novel.hasMany(models.NovelContent, {
            foreignKey: {
                name: 'novelContentId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        Novel.hasMany(models.FollowNovel, {
            foreignKey: {
                name: 'novelId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        Novel.hasMany(models.Rating, {
            foreignKey: {
                name: 'Rating',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return Novel;
};
