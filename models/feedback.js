const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    coWorkingSpace: {
        type: mongoose.Schema.ObjectId,
        ref: 'CoworkingSpace',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref:'User',
        requried : true
    },

    feedBack: {
    type: String,
    // required: [true, "Please add some feedback"],
    },

    rating: {
        type: Number, // Change to Number type
        required: [true, "Please provide a rating score between 0 - 5"],
        min: 0, // Minimum value
        max: 5, // Maximum value
        validate: {
            validator: Number.isInteger, // Ensure it's an integer
            message: 'Rating must be an integer'
        }
    },
    cretedAt: {
        type: Date,
        default : Date.now 
    }
});

module.exports = mongoose.model('FeedBack' , FeedbackSchema);