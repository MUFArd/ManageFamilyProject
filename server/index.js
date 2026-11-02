require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 3000
const app = express()
const router = require('./src/routes')

app.use(express.json({limit:'10mb'}))
app.use('/', router)

app.listen(PORT, ()=> console.log('Terhubung dengan database'))