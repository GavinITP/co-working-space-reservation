const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coWorkingSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CoworkingSpace",
    required: true,
  },
  date: {
    type: Date,
    required: [true, "Please add the date for the reservation"],
  },
  numberOfRooms: {
    type: Number,
    required: [true, "Please add the number of rooms to reserve"],
    min: 1,
    max: 3,
  },
});

module.exports = mongoose.model("RoomReservation", reservationSchema);
