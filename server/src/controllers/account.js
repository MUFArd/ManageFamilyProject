const { sequelize ,account, account_member } = require('../../models')
const Joi = require('joi')

class Account {
    static async getAllAccount(req, res) {
        try {
            const data = await account.getAllData({
                order: [['createdAt', 'DESC']],
                raw: true
            })

            res.status(200).json({
                status: 'Berhasil',
                message: 'Berhasil mengambil seluruh data account',
                data: data
            })
        } catch (error) {
            console.error(error)
            res.status(400).json({
                status: 'Gagal',
                message: 'Gagal mengambil seluruh data account',
            })
        }
    }
    static async getAccountById(req, res) {
        try {
            const { id } = req.params

            const data = await account.getOneData({
                where: { id },
                raw: true
            })

            if (!data) {
                res.status(404).json({
                    status: 'Gagal',
                    message: 'Data account tidak di temukan'
                })
            }

            res.status(200).json({
                status: 'Berhasi;',
                message: 'Berhasil mengambil data account',
                data: data
            })

        } catch (error) {
            console.error(error)
            res.status(400).json({
                status: 'Gagal',
                message: 'Gagal Mengambil data account'
            })
        }
    }
    static async createAccount(req, res) {
        try {
            const userId = req.user.id
            if (!userId) {
                return res.status(404).json({
                    status: 'Gagal',
                    message: 'User tidak di temukan'
                })
            }

            const schema = Joi.object({
                name: Joi.string().required(),
                type: Joi.string().valid('Asset', 'Liability'),
                balance: Joi.number().precision(2).min(0).required(),
                user_id: Joi.number()
            })

            const options = ({
                abortEarly: true,
                stripUnknown: true
            })

            const { error, value } = schema.validate(req.body, options)

            if (error) {
                return res.status(400).json({
                    status: 'Gagal',
                    message: error.details[0].message
                })
            }

            value.user_id = userId

            const data = await account.create(value)

            res.status(401).json({
                status: 'Berhasil',
                message: 'Berhasil menambahkan account',
                data: data
            })

        } catch (error) {
            console.error(error)
            res.status(400).json({
                status: 'Gagal',
                message: 'Gagal menambahkan account',
            })
        }
    }
    static async addAccountMember(req, res) {
        try {
            const { id } = req.params

            const checkAccount = await account.getOneData({
                where: { id }
            })

            if (!checkAccount) {
                return res.status(404).json({
                    status: 'Gagal',
                    message: 'Data account tidak di temukan'
                })
            }

            const data = req.body

            data.account_id = id 

            const newMember = await account_member.create(data)

            await newMember.reload({
            include: [
                {
                    model: sequelize.models.user,
                    as: 'access_account',
                    attributes: ['name', 'email'] 
                },
                {
                    model: sequelize.models.account,
                    as: 'account_details',
                    attributes: ['name', 'type', 'balance']
                }
            ]
        });
            res.status(201).json({
                status: 'Berhasil',
                message: 'Berhasil menambahkan account member',
                data: newMember
            })

        } catch (error) {
            console.error(error)
            res.status(400).json({
                status: 'Gagal',
                message: 'Gagal menambahkan account member',
            })
        }
    }
}
module.exports = Account