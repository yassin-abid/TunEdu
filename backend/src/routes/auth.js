const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { run, get } = require('../db');
const { generateToken } = require('../middleware/auth');
const { isAuthenticated } = require('../middleware/auth');

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        data: null,
        error: 'Email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({
        data: null,
        error: 'User already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = run(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
      [email, passwordHash, firstName || null, lastName || null, 'STUDENT']
    );

    const accessToken = generateToken(result.lastInsertRowid);

    res.status(201).json({
      data: {
        accessToken,
        user: {
          id: result.lastInsertRowid,
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          role: 'STUDENT'
        }
      },
      error: null
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      data: null,
      error: 'Registration failed'
    });
  }
});

/**
 * POST /api/v1/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        data: null,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({
        data: null,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        data: null,
        error: 'Invalid credentials'
      });
    }

    const accessToken = generateToken(user.id);

    res.json({
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        }
      },
      error: null
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      data: null,
      error: 'Login failed'
    });
  }
});

/**
 * GET /api/v1/auth/me
 * Get current user
 */
router.get('/me', isAuthenticated, (req, res) => {
  res.json({
    data: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      role: req.user.role
    },
    error: null
  });
});

/**
 * POST /api/v1/auth/logout
 * Logout (handled on frontend by clearing tokens)
 */
router.post('/logout', (req, res) => {
  res.json({
    data: { message: 'Logged out successfully' },
    error: null
  });
});

module.exports = router;
