import mongoose from "mongoose";

import feedback from "./feedback";
import reservation from "./reservation";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})$/,
      "Please add a valid email",
    ],
  },
  phone: {
    type: String,
    required: [true, "Please add a phone number"],
    match: [/^[0-9]{10}$/, "Please add a valid 10-digit phone number"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 8,
    select: false,
  },
});

// Cascade Delete feedbacks and reservartions when a user is deleted
UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    // Delete feedbacks
    console.log(`Feedbacks of user ${this._id} is being delete`);
    await feedback.deleteMany({ user: this._id });
    // Delete reservations
    console.log(`Reservations of user ${this._id} is being delete`);
    await reservation.deleteMany({ user: this._id });
    next();
  }
);

export default mongoose.model("User", UserSchema);
