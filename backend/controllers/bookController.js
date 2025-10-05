// backend/controllers/bookController.js
const Book = require('../models/Book');
const Review = require('../models/Review');
const mongoose = require('mongoose');

exports.createBook = async (req, res, next) => {
  try {
    const { title, author, description, genre, year } = req.body;
    if (!title || !author) return res.status(400).json({ message: 'Title and author required' });

    const book = new Book({
      title, author, description, genre, year, addedBy: req.user.id
    });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

exports.getBooks = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = 5;
    const skip = (page - 1) * limit;

    const filter = {};
    // optional filtering (search)
    if (req.query.search) {
      const q = req.query.search;
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { author: new RegExp(q, 'i') },
        { genre: new RegExp(q, 'i') }
      ];
    }
    if (req.query.user === 'me' && req.user) {
      filter.addedBy = req.user.id;
    } else if (req.query.user) {
      // allow ?user=userId to filter by a specific user
      if (mongoose.Types.ObjectId.isValid(req.query.user)) filter.addedBy = req.query.user;
    }

    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('addedBy', 'name');

    res.json({
      books,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId).populate('addedBy', 'name email');
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // fetch reviews and average rating
    const reviews = await Review.find({ book: bookId }).populate('user', 'name');
    const agg = await Review.aggregate([
      { $match: { book: book._id } },
      { $group: { _id: '$book', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    const avgRating = agg.length ? Number(agg[0].avgRating.toFixed(2)) : null;
    const reviewsCount = agg.length ? agg[0].count : 0;

    res.json({ book, reviews, avgRating, reviewsCount });
  } catch (err) {
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const updates = (({ title, author, description, genre, year }) => ({ title, author, description, genre, year }))(req.body);
    Object.keys(updates).forEach(k => { if (updates[k] !== undefined) book[k] = updates[k]; });
    await book.save();
    res.json(book);
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    // delete reviews first
    await Review.deleteMany({ book: book._id });
    await book.deleteOne();
    res.json({ message: 'Book and its reviews deleted' });
  } catch (err) {
    next(err);
  }
};
