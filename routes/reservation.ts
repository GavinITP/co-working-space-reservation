import express from "express";
import {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  getReservationById,
} from "../controllers/reservation";
import { protect, authorize } from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router.get("/", getReservations);
router.get("/:id", protect, authorize(["user", "admin"]), getReservationById);
router.post("/", protect, authorize(["user", "admin"]), createReservation);
router.put("/:id", protect, authorize(["user", "admin"]), updateReservation);
router.delete("/:id", protect, authorize(["user", "admin"]), deleteReservation);
// router.get("/:id", protect, getReservationById);

export default router;
