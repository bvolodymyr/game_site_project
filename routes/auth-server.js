const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({ username, email, password });

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.delete('/delete', async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'No user IDs provided' });
    }

    // Optional: prevent deleting self or enforce admin role here
    // Example:
    // if (userIds.includes(req.user.id)) {
    //   return res.status(400).json({ message: 'Cannot delete own user' });
    // }

    // Delete users with IDs in the array
    const deletedCount = await User.destroy({
      where: {
        id: {
          [Op.in]: userIds
        }
      }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'No users deleted. Check user IDs.' });
    }

    res.json({ message: `Deleted ${deletedCount} user(s)` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ user: { id: req.user.id, username: req.user.username, email: req.user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
