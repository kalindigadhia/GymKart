const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return sendResponse(res, 401, false, 'User not found');
      }

      req.user = user;

      return next();
    } catch (error) {
      return sendResponse(res, 401, false, 'Not authorized, token failed');
    }
  }

  return sendResponse(res, 401, false, 'Not authorized, no token');
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendResponse(
        res,
        403,
        false,
        `User role ${req.user?.role || 'unknown'} is not authorized`
      );
    }
    next();
  };
};

module.exports = { protect, authorize };