module.exports = (sequelize, DataTypes) => {
    const Paragraph = sequelize.define(
        'Paragraph',
        {
            paragraph: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            underscored: true,
            timestamps: false
        }
    );

    Paragraph.associate = models => {
        Paragraph.belongsTo(models.Episode, {
            foreignKey: {
                name: 'episodeId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return Paragraph;
};
