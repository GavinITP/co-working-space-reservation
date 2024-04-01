const CoworkingSpace = require("../models/coWorkingSpace");

const createCoWorkingSpace = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      res
        .status(403)
        .json({ success: false, message: "You're not administrator." });
      return;
    }

    const coWorkingSpace = await CoworkingSpace.create(req.body);
    res.status(201).json({ success: true, data: coWorkingSpace });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { createCoWorkingSpace };
