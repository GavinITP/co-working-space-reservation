import mongoose from "mongoose";

import feedback from "./feedback";

const CoWorkingSpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name for the co-working space"],
  },
  address: {
    type: String,
    required: [true, "Please add an address for the co-working space"],
  },
  telephone: {
    type: String,
    match: [/^[0-9]{10}$/, "Please add a valid 10-digit phone number"],
    required: [true, "Please add a telephone number for the co-working space"],
  },
  openingTime: {
    type: String,
    match: [
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
      "Please use a valid time format (HH:mm:ss)",
    ],
    required: [true, "Please add the opening time for the co-working space"],
  },
  closingTime: {
    type: String,
    match: [
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
      "Please use a valid time format (HH:mm:ss)",
    ],
    required: [true, "Please add the closing time for the co-working space"],
  },
});

// Cascade Delete feedback when a Co-working space is deleted
CoWorkingSpaceSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Feedbacks being remove from co-working space ${this._id}`);
    await feedback.deleteMany({ coWorkingSpace: this._id });
    next();
  }
);

// Reverse populate with virtuals
CoWorkingSpaceSchema.virtual("appointments", {
  ref: "Feedback",
  localField: "_id",
  foreignField: "coWorkingSpace",
  justOne: false,
});

export default mongoose.model("CoWorkingSpace", CoWorkingSpaceSchema);
