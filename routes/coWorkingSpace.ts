import express, { Router } from "express";
import {
  createCoWorkingSpace,
  getCoWorkingSpaces,
  getCoWorkingSpaceById,
  updateCoWorkingSpace,
  deleteCoWorkingSpace,
} from "../controllers/coWorkingSpace";
import { protect, authorize } from "../middleware/auth";
import feedBack from "./feedBack";

const router: Router = express.Router();

// Re-route into other resource router
router.use("/:coWorkingSpaceId/feedbacks/", feedBack);

router.get("/", getCoWorkingSpaces);
router.get("/:id", getCoWorkingSpaceById);
router.post("/", protect, authorize(["admin"]), createCoWorkingSpace);
router.put("/:id", protect, authorize(["admin"]), updateCoWorkingSpace);
router.delete("/:id", protect, authorize(["admin"]), deleteCoWorkingSpace);

export default router;
