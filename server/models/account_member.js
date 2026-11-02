'use strict'

const {Model, DataTypes} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class account_member extends Model {
        static associate(models) {
            account_member.belongsTo(models.user, {
                foreignKey:'user_id',
                as: 'access_account'
            })
            account_member.belongsTo(models.account, {
                foreignKey:'account_id',
                as: 'account_details'
            })
        }
    }

    account_member.init({
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        sequelize,
        paranoid: true,
        timestamps: true,
        freezeTableName: true,
        modelName: 'account_member'
    })

    const dataset = (sequelize) => ({
        include: [
            {
                model: sequelize.models.user,
                as:'access_account',
                attributes: ['name', 'email']
            },
            {
                model: sequelize.models.account,
                as:'account_details',
                attributes: ['name', 'type', 'balance' , 'user_id']
            }
        ],
        attributes: {
            exclude: ['deletedAt']
        }
    })
    account_member.getByAccountId = async (accountId) => {
        return await account_member.findAll({
            where: { account_id: accountId },
            ...dataset(sequelize)
        })
    }
    account_member.getAllData = async (query)=> {
        return await account_member.findAll({
            ...query,
            ...dataset(sequelize)
        })
    }
    account_member.getOneData = async (query)=> {
        return await account_member.findOne({
            ...query,
            ...dataset(sequelize)
        })
    }
    account_member.totalData = async (query)=> {
        return await account_member.count({
            ...query,
            ...dataset(sequelize)
        })
    }    
    return account_member
}