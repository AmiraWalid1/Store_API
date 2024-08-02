const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if(!token) {
    return res.status(401).send("no token provided");
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.SECRETKEY);
    req.user = tokenDecode;
    next();
  }
  catch(err){
    next(err);
  }
  
};


module.exports = {authenticate};
