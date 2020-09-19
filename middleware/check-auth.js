const jwt = require('jsonwebtoken');
console.log("hello from middleware")

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader)

    console.log(req.body.token,req.headers.token)
    console.log("hello from middleware token function")
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log(token)
    if (!token) 
      return res.status(403).send({ auth: false, message: 'No token provided.' });
  
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {      
      if (err) 
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });    
  
      // if everything is good, save to request for use in other routes
      req.userId = decoded.id;
      next();
    });
  
  }
  
  module.exports = verifyToken;