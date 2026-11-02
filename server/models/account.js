'use strict'

const {Model, DataTypes} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class account extends Model {
        static associate(models) {
            account.belongsTo(models.user, {
                foreignKey:'user_id',
                as: 'owner_account'
            })
            account.hasMany(models.account_member, {
                foreignKey: 'account_id',
                as: 'account_members'
            })
        }
        
    }

    account.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('Asset','Liability'),
            allowNull: false
        },
        balance: {
            type: DataTypes.DECIMAL(20,2),
            defaultValue: '0.00',
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
        modelName: 'account'
    })

    const dataset = (sequelize) => ({
        include: [
            {
                model: sequelize.models.user,
                as:'owner_account',
                attributes: ['name', 'email']
            },
            {
                model: sequelize.models.account_member,
                as:'account_members',
                attributes: ['account_id','user_id']
            }
        ],
        attributes: {
            exclude: ['deletedAt']
        }
    })

    account.getAllData = async (query)=> {
        return await account.findAll({
            ...query,
            ...dataset(sequelize)
        })
    }
    account.getOneData = async (query)=> {
        return await account.findOne({
            ...query,
            ...dataset(sequelize)
        })
    }
    account.totalData = async (query)=> {
        return await account.count({
            ...query,
            ...dataset(sequelize)
        })
    }    
    return account
}