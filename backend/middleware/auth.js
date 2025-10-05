// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ message: 'Authorization header missing' });

    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    // Optionally load user data:
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token - user not found' });

    req.user = { id: user._id.toString(), name: user.name, email: user.email };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;
