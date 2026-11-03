'use strict'
const {Model, DataTypes} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class transaction extends Model {
        static associate(models) {
         transaction.belongsTo(models.user, {
                foreignKey: 'user_id',
                as:'user_transaction'
            })
            transaction.belongsTo(models.transaction_room, {
                foreignKey: 'trasaction_room_id',
                as:'room_transaction'
            })
            transaction.belongsTo(models.account, {
                foreignKey:'account_id',
                as:'account_transaction'
            })   
        }
    }

    transaction.init({
        amount: {
            type: DataTypes.DECIMAL(20,2),
            defaultValue: '0.00',
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('Income','Expense'),
            allowNull: false
        },
        description:{
            type: DataTypes.STRING,
            allowNull: true
        },
        transaction_room_id:{
            type:DataTypes.INTEGER,
            allowNull: false
        },
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id:{
            type:DataTypes.INTEGER,
            allowNull: false
        },
        
    },{
        sequelize,
        timestamps:true,
        paranoid:true,
        freezeTableName:true,
        tableName:'transaction'
    })

    const dataset = (sequelize) => ({
        include: [
            {
                model: sequelize.models.transaction_room,
                as:'room_transaction',
                attributes: ['name']
            },
            {
                model: sequelize.models.account,
                as:'account_transaction',
                attributes: ['name','type', 'balance']
            },
            {
                model: sequelize.models.user,
                as:'user_transaction',
                attributes: ['name', 'email']
            }
        ], attributes: {
            exclude:['deletedAt']
        }
    })

    transaction.getAllData = async (query)=> {
        return await transaction.findAll({
            ...query,
            ...dataset(sequelize)
        })
    }
    transaction.getOneData = async (query)=> {
        return await transaction.findOne({
            ...query,
            ...dataset(sequelize)
        })
    }
    transaction.totalData = async (query)=> {
        return await transaction.count({
            ...query,
            ...dataset(sequelize)
        })
    }
    return transaction

}