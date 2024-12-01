const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    bookId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    review: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    status:{
        type: String,
        enum: ['published', 'hidden', 'flagged'],
        default: 'published'
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;