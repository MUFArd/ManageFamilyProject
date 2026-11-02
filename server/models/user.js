'use strict'

const { Model, DataTypes } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        static associate(models) {
            user.hasMany(models.account, {
                foreignKey: 'user_id',
                as: 'my_account'
            })

            user.hasMany(models.account_member, {
                foreignKey: 'user_id',
                as: 'access_account'
            })
        }
    }

    user.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('Admin', 'User'),
            allowNull: false,
            defaultValue:'User'
        },
        is_active: {
            type: DataTypes.ENUM('Y', 'N'),
            allowNull: false,
            defaultValue: 'Y'
        }

    }, {
        sequelize,
        paranoid: true,
        timestamps: true,
        freezeTableName: true,
        modelName: 'user',
    });

    user.getAllData = async (query) => {
        return await user.findAll({
            ...query,
        });
    }

    user.getOneData = async (query) => {
        return await user.findOne({
            ...query,
        });
    }

    user.totalData = async (query) => {
        return await user.count({
            ...query,
            col: 'id',
        });
    }
    return user
}