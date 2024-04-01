const express = require("express");
const { createCoWorkingSpace } = require("../controllers/coWorkingSpace");
const protect = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createCoWorkingSpace);

module.exports = router;
