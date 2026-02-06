const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Authentication Middleware
 * Supports JWT verification and role-based access control.
 */
class AuthMiddleware {
  /**
   * Verify JWT Token and attach user to request
   */
  static async verifyUser(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  /**
   * Verify User has Admin privileges
   */
  static async verifyAdmin(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
}

module.exports = AuthMiddleware;
