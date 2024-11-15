// const jwt = require('jsonwebtoken');
// const User = require('../modal/user.modal');  

// module.exports = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', ''); 

//   if (!token) {
//     return res.status(401).json({ status: false, message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; 
//     next(); 
//   } catch (error) {
//     return res.status(401).json({ status: false, message: 'Invalid or expired token' });
//   }
// };

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // Get the token from the 'Authorization' header
  if (!token) {
    return res.status(404).json({ status: false, message: 'token not found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decode : ", decoded)
    req.user = { userId: decoded.id }; // Attach decoded token payload to req.user
    next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({ status: false, message: 'User not authenticated' });
  }
};
