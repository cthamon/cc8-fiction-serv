module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            profileImg: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.STRING,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
        {
            underscored: true
        }
    );

    User.associate = models => {
        User.hasMany(models.Comment, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        User.hasMany(models.Follow, {
            as: 'Follower',
            foreignKey: {
                name: 'followerId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        User.hasMany(models.Follow, {
            as: 'Following',
            foreignKey: {
                name: 'followingId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        User.hasMany(models.Novel, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        User.hasMany(models.Order, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        User.hasMany(models.Rating, {
            as: 'requestTo',
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        User.hasMany(models.ReadHistory, {
            as: 'requestFrom',
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return User;
};
