const express = require('express');
const router = express.Router();
const { Score, User } = require('../models');
const auth = require('../middleware/auth');

// Save a new score
router.post('/', auth, async (req, res) => {
  try {
    const { game, score } = req.body;

    // Validate game type
    if (!['snake', 'pong', 'invaders', 'pacman'].includes(game)) {
      return res.status(400).json({ message: 'Invalid game type' });
    }

    // Create new score
    const newScore = await Score.create({
      userId: req.user.id,
      game,
      score
    });

    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's high score for a specific game
router.get('/highscore/:game', auth, async (req, res) => {
  try {
    const { game } = req.params;

    // Validate game type
    if (!['snake', 'pong', 'invaders', 'pacman'].includes(game)) {
      return res.status(400).json({ message: 'Invalid game type' });
    }

    // Find user's highest score for the game
    const highScore = await Score.findOne({
      where: {
        userId: req.user.id,
        game
      },
      order: [['score', 'DESC']]
    });

    if (!highScore) {
      return res.json({ score: 0 });
    }

    res.json({ score: highScore.score });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get global high scores for a specific game
router.get('/leaderboard/:game', async (req, res) => {
  try {
    const { game } = req.params;

    // Validate game type
    if (!['snake', 'pong', 'invaders', 'pacman'].includes(game)) {
      return res.status(400).json({ message: 'Invalid game type' });
    }

    // Find top 10 scores for the game
    const leaderboard = await Score.findAll({
      where: { game },
      order: [['score', 'DESC']],
      limit: 10,
      include: [{
        model: User,
        attributes: ['username']
      }]
    });

    res.json(leaderboard.map(entry => ({
      username: entry.User.username,
      score: entry.score,
      date: entry.createdAt
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all available games
router.get('/games', async (req, res) => {
  try {
    res.json(['snake', 'pong', 'invaders', 'pacman']);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
