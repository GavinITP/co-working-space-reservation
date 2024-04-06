import { Request, Response } from "express";
import CoWorkingSpace from "../models/coWorkingSpace";
import feedback from "../models/feedback";

/**
 * @route GET /api/v1/co-working-space
 * @desc Get all co-working spaces.
 * @access Public
 */
const getCoWorkingSpaces = async (_req: Request, res: Response) => {
  try {
    const coWorkingSpaces = await CoWorkingSpace.find();
    res.status(200).json({ success: true, data: coWorkingSpaces });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

/**
 * @route GET /api/v1/co-working-space:id
 * @desc Get a co-working space by ID.
 * @access Public
 */
const getCoWorkingSpaceById = async (req: Request, res: Response) => {
  try {
    const coWorkingSpace = await CoWorkingSpace.findById(req.params.id);
    if (!coWorkingSpace) {
      return res
        .status(404)
        .json({ success: false, message: "Co-working space not found." });
    }
    res.status(200).json({ success: true, data: coWorkingSpace });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

/**
 * @route POST /api/v1/co-working-space
 * @desc Create a new co-working space.
 * @access Private (Admin)
 */
const createCoWorkingSpace = async (req: Request, res: Response) => {
  try {
    const coWorkingSpace = await CoWorkingSpace.create(req.body);
    res.status(201).json({ success: true, data: coWorkingSpace });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

/**
 * @route PUT /api/v1/co-working-space/:id
 * @desc Update a co-working space by ID.
 * @access Private (Admin)
 */
const updateCoWorkingSpace = async (req: Request, res: Response) => {
  try {
    const coWorkingSpace = await CoWorkingSpace.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!coWorkingSpace) {
      return res
        .status(404)
        .json({ success: false, message: "Co-working space not found." });
    }
    res.status(200).json({ success: true, data: coWorkingSpace });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

/**
 * @route DELETE /api/v1/co-working-space/:id
 * @desc Delete a co-working space by ID.
 * @access Private (Admin)
 */
const deleteCoWorkingSpace = async (req: Request, res: Response) => {
  try {
    const coWorkingSpace = await CoWorkingSpace.findById(req.params.id);
    let cwsid = req.params.id;
    if (!coWorkingSpace) {
      res
        .status(404)
        .json({ success: false, message: "Co-working space not found." });
      return;
    }

    await coWorkingSpace.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
      massage: `Co-working space ${cwsid} is now deleted.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

export {
  createCoWorkingSpace,
  getCoWorkingSpaces,
  getCoWorkingSpaceById,
  updateCoWorkingSpace,
  deleteCoWorkingSpace,
};
