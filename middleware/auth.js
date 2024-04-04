const jwt = require("jsonwebtoken");
const User = require("../models/user");

// verify token
const protect = async (req, res, next) => {
  const bearerToken = req.header("Authorization");
  const token = bearerToken?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided." });
    return;
  }

  try {
    // user only have field id
    let { user } = jwt.verify(token, process.env.JWT_SECRET);

    // so we have to use id to search all fields in DB
    user = await User.findById(user.id);

    // inject the user object into the request
    // for global access in controllers
    req.user = user;

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

//Grant access to specific roles
const authorize = (...roles)=>{
  return (req,res,next)=>{
      if(!roles.includes(req.user.role)){
          return res.status(403).json({success:false , massage: `User role ${req.user.role} is not authorized to access this route`});
      }
      next();
  }
}

module.exports = protect;
// module.exports = authorize;