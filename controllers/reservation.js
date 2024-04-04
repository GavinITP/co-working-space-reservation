const Reservation = require("../models/reservation");
const {
  findCoWorkingSpace,
  validateReservationTime,
} = require("../helpers/reservation");

/**
 * @desc    Get all reservations
 * @route   GET /api/v1/reservation
 * @access  Private
 */
const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find(
      req.user.role === "admin" ? {} : { user: req.user.id }
    );
    res.status(200).json({ success: true, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Create a new reservation
 * @route   POST /api/v1/reservation
 * @access  Private (only user, not admin)
 */
const createReservation = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res
        .status(401)
        .json({ success: false, error: "Only users can make reservations" });
    }

    const { coWorkingSpaceId, date, startTime, endTime } = req.body;
    const coWorkingSpace = await findCoWorkingSpace(coWorkingSpaceId);

    if (!validateReservationTime(coWorkingSpace, date, startTime, endTime)) {
      return res.status(400).json({
        success: false,
        error: "Reservation time is outside of co-working space opening hours",
      });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      coWorkingSpace: coWorkingSpaceId,
      date: new Date(`${date}T${startTime}`),
      startTime,
      endTime,
    });

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update a reservation by ID
 * @route   PUT /api/v1/reservation/:id
 * @access  Private
 */
const updateReservation = async (req, res) => {
  try {
    const { coWorkingSpaceId, startDate, startTime, endTime } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, error: "Reservation not found" });
    }

    if (
      req.user.role === "user" &&
      reservation.user.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized: You are not allowed to update this reservation",
      });
    }

    const coWorkingSpace = await findCoWorkingSpace(coWorkingSpaceId);

    if (
      !validateReservationTime(coWorkingSpace, startDate, startTime, endTime)
    ) {
      return res.status(400).json({
        success: false,
        error: "Reservation time is outside of co-working space opening hours",
      });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        date: new Date(`${startDate}T${startTime}`),
        startTime,
        endTime,
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedReservation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete a reservation by ID
 * @route   DELETE /api/v1/reservation/:id
 * @access  Private
 */
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, error: "Reservation not found" });
    }

    if (
      req.user.role === "user" &&
      reservation.user.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized: You are not allowed to delete this reservation",
      });
    }

    await Reservation.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
};
