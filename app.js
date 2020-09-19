const express = require('express');
const app = express();
const router = require('./router/router')
const path = require('path');
app.set("view engine", "ejs");
app.set('views',path.join(__dirname, 'views'))
app.use(express.json())

require('dotenv').config() //for usage of env file

app.get('/', router)

app.get('/signup', router)
app.post('/signup', router)

app.get('/login', router)
app.post('/login', router)

app.get('/welcome', router)

app.listen(process.env.PORT)

