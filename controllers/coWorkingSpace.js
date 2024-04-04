const CoworkingSpace = require("../models/coWorkingSpace");

/**
 * @route GET /api/v1/co-working-space
 * @desc Get all co-working spaces.
 * @access Public
 */
const getCoWorkingSpaces = async (_req, res) => {
  try {
    const coWorkingSpaces = await CoworkingSpace.find();
    res.status(200).json({ success: true, data: coWorkingSpaces });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route GET /api/v1/co-working-space:id
 * @desc Get a co-working space by ID.
 * @access Public
 */
const getCoWorkingSpaceById = async (req, res) => {
  try {
    const coWorkingSpace = await CoworkingSpace.findById(req.params.id);
    if (!coWorkingSpace) {
      return res
        .status(404)
        .json({ success: false, message: "Co-working space not found." });
    }
    res.status(200).json({ success: true, data: coWorkingSpace });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route POST /api/v1/co-working-space
 * @desc Create a new co-working space.
 * @access Private (Admin)
 */
const createCoWorkingSpace = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "You're not an administrator." });
    }

    const coWorkingSpace = await CoworkingSpace.create(req.body);
    res.status(201).json({ success: true, data: coWorkingSpace });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route PUT /api/v1/co-working-space/:id
 * @desc Update a co-working space by ID.
 * @access Private (Admin)
 */
const updateCoWorkingSpace = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "You're not an administrator." });
    }

    const coWorkingSpace = await CoworkingSpace.findByIdAndUpdate(
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
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route DELETE /api/v1/co-working-space/:id
 * @desc Delete a co-working space by ID.
 * @access Private (Admin)
 */
const deleteCoWorkingSpace = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      res
        .status(403)
        .json({ success: false, message: "You're not an administrator." });
      return;
    }

    const coWorkingSpace = await CoworkingSpace.findByIdAndDelete(
      req.params.id
    );
    if (!coWorkingSpace) {
      res
        .status(404)
        .json({ success: false, message: "Co-working space not found." });
      return;
    }
    res.status(200).json({ success: true, data: coWorkingSpace });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createCoWorkingSpace,
  getCoWorkingSpaces,
  getCoWorkingSpaceById,
  updateCoWorkingSpace,
  deleteCoWorkingSpace,
};