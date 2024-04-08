import express, { Router } from "express";
import {
  createCoWorkingSpace,
  getCoWorkingSpaces,
  getCoWorkingSpaceById,
  updateCoWorkingSpace,
  deleteCoWorkingSpace,
} from "../controllers/coWorkingSpace";
import { protect, authorize } from "../middleware/auth";
import feedBackRouter from "./feedback";
import reservationRouter from "./reservation";

const router: Router = express.Router();

// Re-route into other resource router
router.use("/:coWorkingSpaceId/feedbacks/", feedBackRouter);
router.use("/:coWorkingSpaceId/reservations/", reservationRouter);

router.get("/", getCoWorkingSpaces);
router.get("/:id", getCoWorkingSpaceById);
router.post("/", protect, authorize(["admin"]), createCoWorkingSpace);
router.put("/:id", protect, authorize(["admin"]), updateCoWorkingSpace);
router.delete("/:id", protect, authorize(["admin"]), deleteCoWorkingSpace);

export default router;
