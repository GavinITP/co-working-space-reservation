import express from "express";
import {
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  addFeedback,
  deleteFeedback,
} from "../controllers/feedback";
import { protect, authorize } from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router.get("/", protect, authorize(["admin", "user"]), getFeedbacks);
router.get("/:id", protect, authorize(["admin", "user"]), getFeedbackById);
router.post("/", protect, authorize(["user"]), addFeedback);
router.put("/:id", protect, authorize(["user"]), updateFeedback);
router.delete("/:id", protect, authorize(["admin", "user"]), deleteFeedback);

export default router;
