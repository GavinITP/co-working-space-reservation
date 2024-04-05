import { Router } from "express";
import {
  getFeedback,
  getFeedbacks,
  updateFeedback,
  addFeedback,
  deleteFeedback,
} from "../controllers/feedBack";

const router: Router = Router({ mergeParams: true });

const protect = require("../middleware/auth");

router.route("/").get(protect, getFeedbacks).post(protect, addFeedback);

router
  .route("/:id")
  .get(protect, getFeedback)
  .post(protect, addFeedback)
  .put(protect, updateFeedback)
  .delete(protect, deleteFeedback);

export default router;
