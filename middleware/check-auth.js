const jwt = require('jsonwebtoken');
console.log("hello from middleware")

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader)
    if(typeof bearerHeader !== 'undefined'){
    console.log(bearerHeader)
    const bearer = bearerHeader.split(' ')
    req.token = bearer[1]
  
    jwt.verify(req.token, process.env.JWT_KEY, (err, data) => {
      if(err){
        res.send("token not found")
      }
      if(data){
        next()
      }
    })
    
  }
  else{
    res.send({"msg" : "token not provided"})
  }
  
  }
  
  module.exports = verifyToken;