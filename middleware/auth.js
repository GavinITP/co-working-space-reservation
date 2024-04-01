const jwt = require("jsonwebtoken");

// verify token
const protect = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided." });
    return;
  }

  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = protect;
