const mongoose = require("mongoose");

const CoworkingSpaceSchema = new mongoose.Schema({
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
    type: Date,
    required: [true, "Please add the opening time for the co-working space"],
  },
  closingTime: {
    type: Date,
    required: [true, "Please add the closing time for the co-working space"],
  },
});

module.exports = mongoose.model("CoworkingSpace", CoworkingSpaceSchema);
