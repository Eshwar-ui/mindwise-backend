const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

class AuthController {
  static async signup(req, res) {
    try {
      const { email, password, fullName } = req.body;
      
      // Validation with helpful messages
      if (!email || !password || !fullName) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          message: 'Please provide your name, email, and password to create an account.'
        });
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: 'Invalid email format',
          message: 'Please enter a valid email address (e.g., user@example.com).'
        });
      }
      
      // Password strength validation
      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'Password too short',
          message: 'Password must be at least 6 characters long for security.'
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Account already exists',
          message: 'An account with this email already exists. Please login or use a different email.'
        });
      }

      const user = new User({
        email,
        password,
        fullName
      });

      await user.save();

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        },
        token
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Registration failed',
        message: 'Unable to create your account. Please try again later.'
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validation
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Missing credentials',
          message: 'Please provide both email and password to login.'
        });
      }

      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ 
          error: 'Login failed',
          message: 'Invalid email or password. Please check your credentials and try again.'
        });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      res.json({
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        },
        token
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Login failed',
        message: 'Unable to login. Please try again later.'
      });
    }
  }

  static async me(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          message: 'Your account could not be found. Please login again.'
        });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ 
        error: 'Unable to fetch user data',
        message: 'Failed to retrieve your account information. Please try again.'
      });
    }
  }
}

module.exports = AuthController;
