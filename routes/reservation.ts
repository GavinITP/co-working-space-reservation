import { authorize } from "../middleware/auth";

import express from "express";
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
} from "../controllers/reservation";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/", protect, getReservations);
router.get("/:id", protect, getReservationById);
router.post("/", protect, authorize(["user"]), createReservation);
router.put("/:id", protect, updateReservation);
router.delete("/:id", protect, deleteReservation);

export default router;
