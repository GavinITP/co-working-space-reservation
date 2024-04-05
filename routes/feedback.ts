import express from "express";
import {
  getFeedback,
  getFeedbacks,
  updateFeedback,
  addFeedback,
  deleteFeedback,
} from "../controllers/feedBack";
import { protect } from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router.get("/", protect, getFeedbacks);
router.get("/:id", protect, getFeedback);
router.post("/", protect, addFeedback);
router.put("/:id", protect, updateFeedback);
router.delete("/:id", protect, deleteFeedback);

export default router;
