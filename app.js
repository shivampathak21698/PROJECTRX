const express = require('express')
const app = express()
const router = require('./router/router')

app.use(express.json())
require('dotenv').config()

app.use('/', router)

PORT = process.env.PORT || 4000
app.listen(PORT)