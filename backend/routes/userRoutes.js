// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const Review = require('../models/Review');

// GET /api/users/me -> basic profile
router.get('/me', auth, async (req, res, next) => {
  try {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  } catch (err) { next(err); }
});

// GET /api/users/me/books -> user's added books
router.get('/me/books', auth, async (req, res, next) => {
  try {
    const books = await Book.find({ addedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) { next(err); }
});

// GET /api/users/me/reviews -> user's reviews
router.get('/me/reviews', auth, async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user.id }).populate('book', 'title author');
    res.json(reviews);
  } catch (err) { next(err); }
});

module.exports = router;
