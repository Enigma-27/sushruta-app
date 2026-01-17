const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the "Authorization" header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (it looks like "Bearer eyJhbGciOi...")
      token = req.headers.authorization.split(' ')[1];

      // Decode token to get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user in DB and attach to the request object (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next step (the Controller)
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };