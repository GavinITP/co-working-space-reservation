import Reservation from "../models/reservation";
import validateReservationTime from "../helpers/reservation";
import { Request, Response } from "express";
import CoWorkingSpace from "../models/coWorkingSpace";

/**
 * @desc    Get all reservations
 * @route   GET /api/v1/reservation
 * @access  Private
 */
const getReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await Reservation.find(
      req.user.role === "admin" ? {} : { user: req.user.id }
    );
    res.status(200).json({ success: true, data: reservations });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

/**
 * @desc    Get reservation by id
 * @route   GET /api/v1/reservation
 * @access  Private
 */
const getReservationById = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.find(
      req.user.role === "admin"
        ? { _id: req.params.id }
        : { user: req.user.id, _id: req.params.id }
    );
    res.status(200).json({ success: true, data: reservation });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Reservation ID is not valid" });
  }
};

/**
 * @desc    Create a new reservation
 * @route   POST /api/v1/reservation
 * @access  Private (only user, not admin)
 */
const createReservation = async (req: Request, res: Response) => {
  try {
    const cwsid = req.params.coWorkingSpaceId;

    req.body.coWorkingSpace = cwsid;

    // const { coWorkingSpaceId, date, startTime, endTime } = req.body;
    const { date, startTime, endTime } = req.body;

    const coWorkingSpace = await CoWorkingSpace.findById(cwsid);
    if (!coWorkingSpace) {
      return res
        .status(404)
        .json({ success: false, error: "Co-working space not found" });
    }

    // Check if user already has three reservations
    const userReservationCount = await Reservation.countDocuments({
      user: req.user.id,
    });
    if (userReservationCount >= 3) {
      return res.status(400).json({
        success: false,
        error: "User has reached the maximum reservation limit (3)",
      });
    }

    if (!validateReservationTime(coWorkingSpace, startTime, endTime)) {
      return res.status(400).json({
        success: false,
        error: "Your time reservation is not available or not valid",
      });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      coWorkingSpace: cwsid,
      date,
      startTime,
      endTime,
    });

    res.status(200).json({ success: true, data: reservation });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

/**
 * @desc    Update a reservation by ID
 * @route   PUT /api/v1/reservation/:id
 * @access  Private
 */
const updateReservation = async (req: Request, res: Response) => {
  try {
    const { date, startTime, endTime } = req.body;
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

    const coWorkingSpace = await CoWorkingSpace.findById(
      reservation.coWorkingSpace
    );
    if (!coWorkingSpace) {
      return res
        .status(404)
        .json({ success: false, error: "Co-working space not found" });
    }

    if (!validateReservationTime(coWorkingSpace, startTime, endTime)) {
      return res.status(400).json({
        success: false,
        error: "Reservation time isn't within range of opening hours",
      });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        date,
        startTime,
        endTime,
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedReservation });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

/**
 * @desc    Delete a reservation by ID
 * @route   DELETE /api/v1/reservation/:id
 * @access  Private
 */
const deleteReservation = async (req: Request, res: Response) => {
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

    res.status(200).json({
      success: true,
      data: {},
      massage: `Reservation with id ${req.params.id} is now deleted.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
};
