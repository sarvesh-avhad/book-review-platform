// backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addReview, updateReview, deleteReview } = require('../controllers/reviewController');

// add review to a book
router.post('/books/:bookId/reviews', auth, addReview);

// edit/delete a review by id
router.put('/reviews/:id', auth, updateReview);
router.delete('/reviews/:id', auth, deleteReview);

module.exports = router;
