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
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Create a new reservation
 * @route   POST /api/v1/reservation
 * @access  Private (only user, not admin)
 */
const createReservation = async (req: Request, res: Response) => {
  try {
    const { coWorkingSpaceId, date, startTime, endTime } = req.body;

    const coWorkingSpace = await CoWorkingSpace.findById(coWorkingSpaceId);
    if (!coWorkingSpace) {
      return res
        .status(404)
        .json({ success: false, error: "Co-working space not found" });
    }

    if (!validateReservationTime(coWorkingSpace, startTime, endTime)) {
      return res.status(400).json({
        success: false,
        error: "Reservation time is outside of co-working space opening hours",
      });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      coWorkingSpace: coWorkingSpaceId,
      date,
      startTime,
      endTime,
    });

    res.status(200).json({ success: true, data: reservation });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
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
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
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

    res.status(200).json({ success: true, data: reservation });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
};
