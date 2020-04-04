const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
 //Get token from the header
 const token = req.header('x-auth-token');

 //Check if there is no token
 if(!token) {
   return res.status(401).json({ msg: 'No token found. Not authorized'}) 
 }

 //Verify token if there is
 try { 
  const decoded = jwt.verify(token, config.get('jwtSecret'))

  //Set decoded token as the new token for the req.user
  req.user = decoded.user;
  next();
 } catch(err) {
  res.status(401).json({ msg: 'Token is not valid'})
 }
}