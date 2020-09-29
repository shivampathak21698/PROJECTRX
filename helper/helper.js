const mongoose = require('mongoose')
const { Mongoose } = require('mongoose')
const db = require('../connection/connection')
const schema = require('../model/model')
const Users = mongoose.model('Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const helper = {}

helper.signup = async (reqBody) => {
    var { name, email, password, confirmPassword } = reqBody
    if (!name || !email || !password || !confirmPassword) {
        return "fill all feild"
    }

    if (password != confirmPassword) {
        return "password not matched"
    }

    return new Promise((resolve, reject) => {

        Users.findOne({ email: email }, (err, data) => {
            if (err) throw err
            if (data) {
                console.log(data)
                return reject("user exists")
            }
            if (!data) {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err
                    if (salt) {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err
                            else {
                                password = hash

                                const data = new Users({
                                    name: name,
                                    email: email,
                                    password: password
                                })

                                data.save()
                                    .then((data) => {
                                        var msg;
                                        if (!data) {
                                            msg = "problem with saving data"
                                        }
                                        if (data) {
                                            msg = "Data is saved"
                                            console.log(data)
                                        }
                                        return resolve(msg)
                                    })
                            }
                        })
                    }

                })
            }

        })


    })
}

helper.login = async (reqBody) => {
    const { email, password } = reqBody

    return new Promise((resolve, reject) => {

        Users.findOne({ email: email }, (err, data) => {
            if (err) {
                return reject(err)
            }
            if (data) {
                console.log("found")
                bcrypt.compare(password, data.password, (err, flag) => {
                    if (err) {
                        return reject(err)
                    }
                    if (flag) {
                        
                            const token = jwt.sign(
                                {
                                    userID: data._id
                                },
                                process.env.JWT_KEY,
                                {
                                    expiresIn: "6h"
                                }
                            )
                            if (token) {
                                console.log(token)
                                return resolve("password matched and token is "+token)
                            }
                            if (!token) {
                                return reject("token not generated ")
                            }

                        




                    }
                    if (!flag) {
                        return reject("wrong password")
                    }
                })
            }
            if (!data) {
                console.log("not found")
                return reject("not found")
            }
        })
    })





}

module.exports = helper