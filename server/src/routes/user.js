const express = require('express')
const router = express.Router()

const {
    createUser,
    updateUser,
    getAllUser,
    getUserById,
    deleteUser,
    Login
} = require('../controllers/user')

const Auth = require('../middlewares/Auth')

router.post('/login', Login)
router.get('/', Auth, getAllUser)
router.get('/:id', Auth, getUserById)
router.post('/', Auth, createUser)
router.put('/:id', Auth, updateUser)
router.delete('/:id', Auth, deleteUser)

module.exports = router