import express from "express";
import {
  getFeedback,
  getFeedbacks,
  updateFeedback,
  addFeedback,
  deleteFeedback,
} from "../controllers/feedback";
import { protect, authorize } from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router.get("/", protect, getFeedbacks);
router.get("/:id", protect, getFeedback);
router.post("/", protect, authorize(["admin", "user"]), addFeedback);
router.put("/:id", protect, authorize(["admin", "user"]), updateFeedback);
router.delete("/:id", protect, authorize(["admin"]), deleteFeedback);

export default router;
