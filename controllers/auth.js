const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Generate JWT token for user authentication.
 * @param {Object} user - User object containing user ID.
 * @returns {string} JWT token.
 */
const generateToken = (user) => {
  const payload = {
    user: {
      id: user._id,
    },
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * Hash the user password securely using bcrypt.
 * @param {string} password - User password to be hashed.
 * @returns {Promise<string>} Hashed password.
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const hashedPassword = await hashPassword(password);
    user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user);
    res.json({ success: true, name, email, phone, role, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc Get current logged-in user
 * @route GET /api/v1/auth/me
 * @access Public
 */
const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

module.exports = {
  register,
  login,
  getMe,
};