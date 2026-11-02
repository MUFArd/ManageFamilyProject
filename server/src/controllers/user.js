const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { user } = require('../../models')

class User {
    static async Login(req, res) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required().messages({
                    'string.empty': 'Email  tidak boleh kosong',
                    'any.required': 'Kolom email wajib diisi',
                    'string.email': 'Format email tidak valid (contoh: user@mail.com)'
                }),
                password: Joi.string().required().messages({
                    'string.empty': 'password tidak boleh kosong',
                    'any.required': 'Kolom password wajib diisi',
                })
            })

            const options = {
                abortEarly: true,
                stripUnknown: true
            }

            const { error, value } = schema.validate(req.body, options)

            if (error) {
                return res.status(400).json({
                    status: 'Gagal',
                    message: error.details[0].message
                })
            }

            const userData = await user.getOneData({
                where: {
                    email: value.email,
                    is_active: 'Y' 
                },
                raw: true
            })
            if (!userData) {
                return res.status(404).json({
                    status: 'Gagal',
                    message: 'Email atau Password salah'
                });
            }

            const validPass = await bcrypt.compare(value.password, userData.password)
            if (!validPass) {
                return res.status(404).json({
                    status: 'Gagal',
                    message: 'Email atau Password salah'
                });
            }

            const token = jwt.sign(
                {
                    id: userData.id,
                    email: userData.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '7d'
                }
            )

            const responseData = {
                name: userData.name,
                email: userData.email
            }

            res.status(200).json({
                status: 'Berhasil',
                message: 'Berhasil Login',
                data: responseData,
                token: token
            })
        } catch (error) {
            console.error(error)
            res.status(400).json({
                status: 'Gagal',
                message: 'Gagal Login'
            })
        }
    }
    static async getAllUser(req, res) {
        try {
            const data = await user.getAllData({
                order: [['createdAt', 'DESC']],
                raw: true
            })

            res.status(200).json({
                status: 'Berhasil',
                message: 'Berhasil mengambil seluruh data user',
                data: data
            })

        } catch (error) {
            console.error(error)
            res.status(400).json({
                status: 'Gagal',
                message: 'Gagal mengambil seluruh data user'
            })
        }
    }
    static async getUserById(req, res) {
        try {
            const { id } = req.params
            const data = await user.getOneData({
                where: { id },
                raw: true
            })

            if (!data) {
                return res.status(404).json({
                    status: 'Gagal',
                    message: 'Data user tidak di temukan'
                })
            }

            res.status(200).json({
                status: 'Berhasil',
                message: 'Berhasil mengambil data user',
                data: data
            })

        } catch (error) {
            console.error(error)
            res.status(400).json({
                status: 'Gagal',
                message: 'Gagal mengambil data user'
            })
        }
    }
    static async createUser(req, res) {
        try {
            const schema = Joi.object({
                name: Joi.string().required().messages({ 'string.empty': 'Nama Wajib Diisi' }),
                email: Joi.string().required().email(),
                password: Joi.string().required(),
                role: Joi.string().valid('Admin', 'User'),
                is_active: Joi.string().valid('Y', 'N'),
            })

            const options = {
                abortEarly: true,
                stripUnknown: true
            }

            const { error, value } = schema.validate(req.body, options)
            if (error) {
                return res.status(400).json({
                    status: 'Gagal',
                    message: error.details[0].message
                });
            }
            const salt = await bcrypt.genSalt(10)
            value.password = await bcrypt.hash(value.password, salt)
            const data = await user.create(value)

            res.status(201).json({
                status: 'Success',
                Message: 'Berhasil Menambahkan User',
                data: data.toJSON()
            })
        } catch (error) {
            console.error(error)

            res.status(500).json({
                message: "Gagal Menambahkan User"
            })
        }
    }
    static async updateUser(req, res) {
        try {

            const { id } = req.params

            const checkId = await user.getOneData({
                where: { id }
            })

            if (!checkId) {
                return res.status(404).json({
                    status: 'Gagal',
                    message: 'Data tidak ditemukan'
                })
            }
            const schema = Joi.object({
                name: Joi.string(),
                email: Joi.string().email(),
                password: Joi.string().allow('').optional(),
                role: Joi.string().valid('Admin', 'User'),
                is_active: Joi.string().valid('Y', 'N'),
            })

            const options = {
                abortEarly: true,
                stripUnknown: true
            }

            const { error, value } = schema.validate(req.body, options)
            if (error) {
                return res.status(400).json({
                    status: 'Gagal',
                    message: error.details[0].message
                });
            }
            if (value.password && value.password.trim() != '') {
                const salt = await bcrypt.genSalt(10)
                value.password = await bcrypt.hash(value.password, salt)
            } else {
                delete value.password
            }
            const data = await checkId.update(value)

            res.status(201).json({
                status: 'Success',
                message: 'Berhasil mengubah data user',
                data: data.toJSON()
            })
        } catch (error) {
            console.error(error)
            res.status(400).json({
                status: 'Gagal',
                message: 'Gagal mengubah data user'

            })
        }
    }
    static async deleteUser(req, res) {
        try {
            const { id } = req.params
            const checkId = await user.getOneData({
                where: { id }
            })

            if (!checkId) {
                return res.status(404).json({
                    status: 'Gagal',
                    message: 'Data user tidak ditemukan'
                })
            }
            const data = await user.destroy({
                where: { id }
            })

            res.status(200).json({
                status: 'Berhasil',
                message: 'Berhasil menghapus data user',
            })

        } catch (error) {
            console.error(error)
            res.status(400).json({
                status: 'Gagal',
                message: 'Gagal menghapus data user',
            })
        }
    }

}

module.exports = User