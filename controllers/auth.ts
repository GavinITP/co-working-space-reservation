import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserType } from "../types";
import { Request, Response } from "express";

/**
 * Generate JWT token for user authentication.
 * @param {Object} user - User object containing user ID.
 * @returns {string} JWT token.
 */
const generateToken = (user: UserType) => {
  const payload = {
    user: {
      id: user._id,
    },
  };

  return jwt.sign(payload, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * Hash the user password securely using bcrypt.
 * @param {string} password - User password to be hashed.
 * @returns {Promise<string>} Hashed password.
 */
const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    // Check if the email is in a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res
        .status(400)
        .json({ message: "Please provide a valid email address." });
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
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 24 hours
    });

    res.json({ success: true, name, email, phone, role, token });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send((err as Error).message);
  }
};

/**
 * @desc Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
const login = async (req: Request, res: Response) => {
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
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 24 hours
    });

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token,
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc Get current logged-in user
 * @route GET /api/v1/auth/me
 * @access Public
 */
const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

//@desc     Delete a user
//@route    DELETE api/v1/auth/:uid
//@access   Private

const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    let uid = req.params.id;
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    await user.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
      massage: `User ${uid} is now deleted.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

/**
 * @desc Logout user
 * @route GET /api/v1/auth/logout
 * @access Private
 */
const logout = async (_req: Request, res: Response) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
};

export { register, login, getMe, logout, deleteUser };
