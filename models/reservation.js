const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please add the user ID for the reservation"],
  },
  coWorkingSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CoworkingSpace",
    required: [true, "Please add the co-working space ID for the reservation"],
  },
  date: {
    type: Date,
    required: [true, "Please add the date for the reservation"],
  },
});

module.exports = mongoose.model("reservation", reservationSchema);
