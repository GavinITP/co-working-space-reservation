const jwt = require("jsonwebtoken");
const User = require("../models/user");

// verify token
const protect = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided." });
    return;
  }

  try {
    let { user } = jwt.verify(token, process.env.JWT_SECRET);
    user = await User.findById(user.id);
    req.user = user;

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = protect;
