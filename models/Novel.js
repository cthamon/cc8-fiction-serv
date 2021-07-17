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
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
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
        Novel.hasMany(models.Episode, {
            foreignKey: {
                name: 'novelId',
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
                name: 'novelId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return Novel;
};
