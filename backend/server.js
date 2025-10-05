// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// connect to DB
connectDB(process.env.MONGO_URI);

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api', require('./routes/reviewRoutes')); // contains /books/:bookId/reviews and /reviews/:id
app.use('/api/users', require('./routes/userRoutes'));

// health
app.get('/', (req, res) => res.send('Book Review API is running'));

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
