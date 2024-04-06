import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  coWorkingSpace: {
    type: mongoose.Schema.ObjectId,
    ref: "coWorkingSpace",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  feedbackString: {
    type: String,
    default: "",
  },

  rating: {
    type: Number,
    required: [true, "Please provide a rating score between 0 - 5"],
    min: 0,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: "Rating must be an integer",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Feedback", FeedbackSchema);
