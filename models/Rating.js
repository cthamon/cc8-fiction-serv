module.exports = (sequelize, DataTypes) => {
    const Rating = sequelize.define(
        'Rating',
        {
            score: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            comment: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            underscored: true
        }
    );

    Rating.associate = models => {
        Rating.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false,
                unique: true
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        Rating.belongsTo(models.Novel, {
            foreignKey: {
                name: 'novelId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return Rating;
};
