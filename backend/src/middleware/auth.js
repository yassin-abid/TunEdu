const jwt = require('jsonwebtoken');
const { get } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/**
 * Middleware to verify JWT token and attach user to request
 */
function isAuthenticated(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        data: null,
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch user from database
    const user = get('SELECT id, email, first_name, last_name, role FROM users WHERE id = ?', [decoded.userId]);
    
    if (!user) {
      return res.status(401).json({
        data: null,
        error: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      data: null,
      error: 'Invalid or expired token'
    });
  }
}

/**
 * Middleware to check if user is an admin
 * Must be used after isAuthenticated
 */
function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      data: null,
      error: 'Authentication required'
    });
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'TEACHER') {
    return res.status(403).json({
      data: null,
      error: 'Admin access required'
    });
  }

  next();
}

/**
 * Generate JWT token for a user
 */
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = {
  isAuthenticated,
  isAdmin,
  generateToken,
  JWT_SECRET
};
