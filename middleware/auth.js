const jwt = require("jsonwebtoken");

// verify token
const protect = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ message: "No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = protect;
