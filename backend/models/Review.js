// backend/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, default: '' },
}, { timestamps: true });

reviewSchema.index({ book: 1, user: 1 }, { unique: true }); // one review per user per book

module.exports = mongoose.model('Review', reviewSchema);
