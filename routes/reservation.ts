import express from "express";
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  getReservationById,
} from "../controllers/reservation";
import { protect, authorize } from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router.get("/", protect, getReservations);
router.get("/:id", protect, getReservationById);
router.post("/", protect, authorize(["user"]), createReservation);
router.put("/:id", protect, updateReservation);
router.delete("/:id", protect, deleteReservation);
router.get("/:id", protect, getReservationById);

export default router;
