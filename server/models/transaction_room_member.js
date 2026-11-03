'use strict'

const {Model, DataTypes} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class transaction_room_member extends Model {
        static associate(models) {
            transaction_room_member.belongsTo(models.user, {
                foreignKey: 'user_id',
                as:'room_members'
            })
            transaction_room_member.belongsTo(models.transaction_room, {
                foreignKey: 'trasaction_room_id',
                as:'room_transaction'
            })
        }
    }

    transaction_room_member.init({
        transaction_room_id:{
            type:DataTypes.INTEGER,
            allowNull: false
        },
        user_id:{
            type:DataTypes.INTEGER,
            allowNull: false
        },
        role: {
            type:DataTypes.ENUM('Viewer','Editor','Admin'),
            allowNull:false,
            defaultValue:'Viewer'
        }
    }, {
        sequelize,
        timestamps:true,
        paranoid:true,
        freezeTableName:true,
        tableName:'transaction_room_member'
    })

    const dataset = (sequelize) => ({
        include: [
            {
                model: sequelize.models.user,
                as:'room_members',
                attributes: ['name', 'email']
            },
            {
                model: sequelize.models.transaction_room,
                as:'room_transaction',
                attributes: ['name'],
                include: [
                    {
                        model: sequelize.models.user,
                        as: 'creator_room', 
                        attributes: [ 'name', 'email']
                    }
                ]
            }
        ],
        attributes: {
            exclude: ['deletedAt']
        }
    })

    transaction_room_member.getAllData = async (query) => {
        return await transaction_room_member.findAll({
            ...query,
            ...dataset(sequelize)
        })
    }

    transaction_room_member.getOneData = async (query) => {
        return await transaction_room_member.findOne({
            ...query,
            ...dataset(sequelize)
        })
    }
    transaction_room_member.totalData = async (query) => {
        return await transaction_room_member.count({
            ...query,
            ...dataset(sequelize)
        })
    }
    return transaction_room_member
}