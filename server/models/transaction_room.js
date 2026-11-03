'use strict'

const {Model, DataTypes} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class transaction_room extends Model {
        static associate(models) {
            transaction_room.belongsTo(models.user, {
                foreignKey: 'creator_id',
                as:'creator_room'
            })
        }
    }

    transaction_room.init({
        name:{
            type:DataTypes.STRING,
            allowNull: false
        },
        creator_id:{
            type:DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps:true,
        paranoid:true,
        freezeTableName:true,
        tableName:'transaction_room'
    })

    const dataset = (sequelize) => ({
        include: [
            {
                model: sequelize.models.user,
                as:'creator_room',
                attribute: ['name', 'email']
            }
        ],
        attribute: {
            exclude: ['deletedAt']
        }
    })

    transaction_room.getAllData = async (query) => {
        await transaction_room.findAll({
            ...query,
            ...dataset(sequelize)
        })
    }

    transaction_room.getOneData = async (query) => {
        await transaction_room.findOne({
            ...query,
            ...dataset(sequelize)
        })
    }
    transaction_room.totalData = async (query) => {
        await transaction_room.count({
            ...query,
            ...dataset(sequelize)
        })
    }
    return transaction_room
}