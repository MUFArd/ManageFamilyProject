const express = require('express')
const router = express.Router()

const { 
    getAllAccount,
    getAccountById,
    createAccount,
    addAccountMember
 } = require('../controllers/account')
const Auth = require('../middlewares/Auth')

router.get('/', Auth, getAllAccount)
router.get('/:id', Auth, getAccountById)
router.post('/', Auth, createAccount)
router.post('/add-account-member/:id', Auth, addAccountMember)

module.exports = router

