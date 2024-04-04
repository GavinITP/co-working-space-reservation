const express = require("express");
const {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservation");
const protect = require("../middleware/auth");

const router = express.Router();

router.get("/reservations", protect, getReservations);
router.post("/reservations", protect, createReservation);
router.put("/reservations/:id", protect, updateReservation);
router.delete("/reservations/:id", protect, deleteReservation);

module.exports = router;
