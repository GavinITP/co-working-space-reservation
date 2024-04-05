import mongoose from "mongoose";

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
    type: String,
    match: [
      /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/,
      "Please use a valid date format (DD-MM-YYYY)",
    ],
    required: [true, "Please add the date for the reservation"],
  },
  startTime: {
    type: String,
    match: [
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
      "Please use a valid time format (HH:mm:ss)",
    ],
    required: [true, "Please add the start time for the reservation"],
  },
  endTime: {
    type: String,
    match: [
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
      "Please use a valid time format (HH:mm:ss)",
    ],
    required: [true, "Please add the end time for the reservation"],
  },
});

export default mongoose.model("Reservation", reservationSchema);
