module.exports = (sequelize, DataTypes) => {
    const Episode = sequelize.define(
        'Episode',
        {
            episodeNumber: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            episodeTitle: {
                type: DataTypes.STRING,
                allowNull: false,
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

    Episode.associate = models => {
        Episode.belongsTo(models.Novel, {
            foreignKey: {
                name: 'novelId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        Episode.hasMany(models.Comment, {
            foreignKey: {
                name: 'episodeId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        Episode.hasMany(models.OrderItem, {
            foreignKey: {
                name: 'episodeId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        Episode.hasMany(models.ReadHistory, {
            foreignKey: {
                name: 'episodeId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        Episode.hasMany(models.Paragraph, {
            foreignKey: {
                name: 'episodeId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return Episode;
};
