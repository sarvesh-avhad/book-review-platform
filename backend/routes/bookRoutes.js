// backend/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createBook, getBooks, getBookById, updateBook, deleteBook
} = require('../controllers/bookController');

router.get('/', getBooks); // public, supports ?page=1 & ?search=xxx & ?user=me
router.post('/', auth, createBook);
router.get('/:id', getBookById);
router.put('/:id', auth, updateBook);
router.delete('/:id', auth, deleteBook);

module.exports = router;
