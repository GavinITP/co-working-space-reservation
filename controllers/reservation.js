const Reservation = require("./reservation");
const CoworkingSpace = require("./coWorkingSpace");

/**
 * @desc    Get all reservations
 * @route   GET /api/v1/reservation
 * @access  Private
 */
const getReservations = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { user: req.user.id };
    const reservations = await Reservation.find(query);
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
  const { coWorkingSpaceId, reservationDate } = req.body;

  try {
    // Check if user is authorized to make a reservation
    if (req.user.role !== "user") {
      return res
        .status(401)
        .json({ success: false, error: "Only users can make reservations" });
    }

    // If coworking space not found, return an error
    const coWorkingSpace = await CoworkingSpace.findById(coWorkingSpaceId);
    if (!coWorkingSpace) {
      return res
        .status(404)
        .json({ success: false, error: "Co-working space not found" });
    }

    // Check if reservation date is within coworking space opening hours
    const openingTime = coWorkingSpace.openingTime;
    const closingTime = coWorkingSpace.closingTime;
    if (reservationDate < openingTime || reservationDate > closingTime) {
      return res.status(400).json({
        success: false,
        error: "Reservation date is outside of co-working space opening hours",
      });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      coWorkingSpace: coWorkingSpaceId,
      date: reservationDate,
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
  const { coworkingSpaceId, reservationDate } = req.body;

  try {
    const reservation = await Reservation.findById(req.params.id);

    // If reservation not found, return an error
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, error: "Reservation not found" });
    }

    // Check if user is authorized to update the reservation
    if (
      req.user.role === "user" &&
      reservation.user.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized: You are not allowed to update this reservation",
      });
    }

    const coWorkingSpace = await CoworkingSpace.findById(coworkingSpaceId);

    // If coworking space not found, return an error
    if (!coWorkingSpace) {
      return res
        .status(404)
        .json({ success: false, error: "Co-working space not found" });
    }

    // Check if reservation date is within coworking space opening hours
    const openingTime = coWorkingSpace.openingTime;
    const closingTime = coWorkingSpace.closingTime;
    if (reservationDate < openingTime || reservationDate > closingTime) {
      return res.status(400).json({
        success: false,
        error: "Reservation date is outside of co-working space opening hours",
      });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        date: reservationDate,
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedReservation });
  } catch (error) {
    // Handle errors
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

    // If reservation not found, return an error
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, error: "Reservation not found" });
    }

    // Check if user is authorized to delete the reservation
    if (
      req.user.role === "user" &&
      reservation.user.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized: You are not allowed to delete this reservation",
      });
    }

    // Delete the reservation
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
