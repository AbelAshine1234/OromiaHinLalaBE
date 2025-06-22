const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user still exists
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware to check if user has specific role
exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Convert roles to array if it's a string
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Middleware to check if user is admin
exports.requireAdmin = (req, res, next) => {
  return exports.requireRole('admin')(req, res, next);
};

// Middleware to check if user is guide
exports.requireGuide = (req, res, next) => {
  return exports.requireRole(['admin', 'guide'])(req, res, next);
};

// Middleware to check if user is employee
exports.requireEmployee = (req, res, next) => {
  return exports.requireRole(['admin', 'employee'])(req, res, next);
};

// Middleware to check if user is tourist
exports.requireTourist = (req, res, next) => {
  return exports.requireRole(['admin', 'tourist'])(req, res, next);
};

// Optional authentication middleware (doesn't fail if no token)
exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findByPk(decoded.userId);
      if (user) {
        req.user = decoded;
      }
    }
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
}; 