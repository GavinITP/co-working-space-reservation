import express from "express";
import {
  getFeedback,
  getFeedbackById,
  updateFeedback,
  addFeedback,
  deleteFeedback,
} from "../controllers/feedback";
import { protect, authorize } from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router.get("/", protect, authorize(["admin", "user"]), getFeedback);
router.get("/:id", protect, authorize(["admin", "user"]), getFeedbackById);
router.post("/", protect, authorize(["admin", "user"]), addFeedback);
router.put("/:id", protect, authorize(["user"]), updateFeedback);
router.delete("/:id", protect, authorize(["admin", "user"]), deleteFeedback);

export default router;
