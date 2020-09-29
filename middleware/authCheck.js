const mongoose = require('mongoose')
const schema = require('../model/model')
const Users = mongoose.model("Users")

const jwt = require("jsonwebtoken")
require("dotenv").config()

async function verifyToken(req, res, next){
const {authorization} = req.headers

if(!authorization){
    return res.json({"msg" : "you must login"})
}
const token = authorization.replace("Bearer ","")

jwt.verify(token, process.env.JWT_KEY,(err, payload) => {
    if(err){
        return res.json({"msg" : "you must login"})
    }
    const {userID} = payload
    Users.findById(userID).then((data) => {
        if(data){
            res.json(data)
        }
        if(!data){
            res.json("data not found")
        }
    })

})
}

module.exports = verifyToken