const express = require('express')
const router = express.Router()

const user = require('./user')
const account =require('./account')

router.use('/user', user)
router.use('/account', account)

module.exports = router