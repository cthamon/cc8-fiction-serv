module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        'Comment',
        {
            comment: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            underscored: true
        }
    );

    Comment.associate = models => {
        Comment.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        Comment.belongsTo(models.NovelContent, {
            foreignKey: {
                name: 'novelContentId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return Comment;
};
