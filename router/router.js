const express = require('express')
const router = express.Router();
const verifyToken = require('../middleware/authCheck')

const controller = require('../controller/controller')

var bodyParser = require("body-parser"); //for parsing data from input
var encoder = bodyParser.urlencoded({ extended: true });
router.use(encoder);

router.post('/signup', controller.signup)

router.post('/login', controller.login)

router.get('/welcome',verifyToken, (req, res) => {
    
})


module.exports = router