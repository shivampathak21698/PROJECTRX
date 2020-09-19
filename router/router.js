const express = require('express');
const router = express.Router();

const db = require('../connection/db');
const userSchema = require('../connection/schema')

const mongoose = require('mongoose')
const DBuserSL = mongoose.model('userSL') //userSL db name

var bodyParser = require("body-parser"); //for parsing data from input
var encoder = bodyParser.urlencoded({ extended: true });
router.use(encoder);

const { render } = require('ejs'); //for ejs file

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken');

const verifyToken = require('../middleware/check-auth')

/////// Routers API
router.get('/', (req, res) => {
    res.send("hello from routes")
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', encoder, (req, res) => {
    var err;
    var { userName, email, password, confirmPassword } = req.body;
    console.log(userName, email, password)
    if (!userName || !email || !password || !confirmPassword) {
        err = "fill all feild";
        res.render('signup', ({ 'err': err }));
    }
    else if (password != confirmPassword) {
        err = "password not matched";
        res.render('signup', ({ 'err': err }))

    }

    if (typeof err == 'undefined') {
        DBuserSL.findOne({ email: email }).then(flag => {
            if (flag) {
                console.log('user exists')
                err = "user exists"
                res.render('signup', ({ 'err': err }))
            }



            else {

                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    else {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err;
                            else {
                                password = hash;
                                console.log(password)

                                const data = new userSchema({
                                    name: userName,
                                    email: email,
                                    password: password
                                })
                                data.save().then((flag) => {
                                    if (flag) {
                                        res.redirect('/login') //redirecting on page login
                                    }
                                }).catch(err => {
                                    console.log(err)
                                })
                            }
                        })
                    }
                })

            }

        })

    }
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    var err;
    var { email, password } = req.body; //taking email and pass from client side
    console.log(email, password)
    if (!email || !password) { //this is validation yes
        err = "fill all feilds"
        res.render('login', ({ 'err': err })) //login is ejs file. same as html but we can display data
    }

    else {


        DBuserSL.findOne({ email: email }).then((data) => {
            if (data) {
                // console.log(data.password)
                bcrypt.compare(password, data.password, (err, result) => {
                    if (err) throw err;
                    if (result) {
                        const token = jwt.sign({
                            email: data.email,
                            userID: data._id
                        },
                            process.env.JWT_key,
                            {
                                expiresIn: "1h"
                            }
                        );
                        
                        
                        console.log('token is ',token)
                        // res.render('login', ({ 'err': token }))
                        res.redirect('/welcome')
                        // res.json({msg : 'password matched',token})
                    }
                    else {
                        res.send("password not matched")
                    }
                })
            }
            else {
                err = `User with email ${email} is not found`
                res.render('login', ({ 'err': err }))
            }
        })
    }
})



router.get('/welcome', verifyToken, function(req, res, next) {
    res.render('welcome')  
  });


module.exports = router;