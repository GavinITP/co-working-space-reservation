const express = require("express");
const {
  createCoWorkingSpace,
  getCoWorkingSpaces,
  getCoWorkingSpaceById,
  updateCoWorkingSpace,
  deleteCoWorkingSpace,
} = require("../controllers/coWorkingSpace");
const protect = require("../middleware/auth");

const router = express.Router();

router.get("/", getCoWorkingSpaces);
router.get("/:id", getCoWorkingSpaceById);
router.post("/", protect, createCoWorkingSpace);
router.put("/:id", protect, updateCoWorkingSpace);
router.delete("/:id", protect, deleteCoWorkingSpace);

module.exports = router;
