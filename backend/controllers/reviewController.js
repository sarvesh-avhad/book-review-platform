// backend/controllers/reviewController.js
const Review = require('../models/Review');
const Book = require('../models/Book');

exports.addReview = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    const { rating, reviewText } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating 1-5 required' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // enforce unique per user per book via model index: try create and catch duplicate key
    const review = new Review({ book: bookId, user: req.user.id, rating, reviewText });
    await review.save();

    res.status(201).json(await review.populate('user', 'name'));
  } catch (err) {
    // handle duplicate key error (user already reviewed this book)
    if (err.code === 11000) return res.status(400).json({ message: 'You already reviewed this book; edit your review instead' });
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const { rating, reviewText } = req.body;
    if (rating) review.rating = rating;
    if (reviewText !== undefined) review.reviewText = reviewText;
    await review.save();
    res.json(await review.populate('user', 'name'));
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};
