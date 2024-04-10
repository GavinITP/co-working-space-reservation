import express from "express";
import {
  register,
  login,
  getMe,
  deleteUser,
  logout,
} from "../controllers/auth";
import { protect, authorize } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.delete("/:id", protect, authorize(["admin"]), deleteUser);
router.get("/logout", protect, logout);

export default router;
