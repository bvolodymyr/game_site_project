const express = require('express');
const router = express.Router();
const { Score, User } = require('../models');
const auth = require('../middleware/auth');
const validGames = ['snake', 'pong', 'invaders', 'pacman'];

// Save a new score
router.post('/', auth, async (req, res) => {
  try {
    const { game, score } = req.body;

    // Validate game type
    if (!validGames.includes(game)) {
      return res.status(400).json({ message: 'Invalid game type' });
    }

    // Find existing score for user and game
    const existingScore = await Score.findOne({
      where: { userId: req.user.id, game }
    });

    if (existingScore) {
      // Update only if new score is higher
      if (score > existingScore.score) {
        existingScore.score = score;
        await existingScore.save();
        return res.status(200).json(existingScore);
      } else {
        // No update needed, return existing score
        return res.status(200).json(existingScore);
      }
    } else {
      // No existing score, create new
      const newScore = await Score.create({
        userId: req.user.id,
        game,
        score
      });
      return res.status(201).json(newScore);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Get user's high score for a specific game
router.get('/highscore/:game', auth, async (req, res) => {
  try {
    const { game } = req.params;

    // Validate game type
    if (!validGames.includes(game)) {
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
    if (!validGames.includes(game)) {
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

if (!leaderboard || leaderboard.length === 0) {
  return res.json([]);
}

res.json(leaderboard.map(entry => ({
  username: entry.User.username,
  score: entry.score
})));

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all available games
router.get('/games', async (req, res) => {
  try {
    res.json(validGames);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get global leaderboard across all games (newly added)
router.get('/global-leaderboard', async (req, res) => {
  try {
    const leaderboard = await Score.findAll({
      include: [{
        model: User,
        attributes: ['username']
      }],
      order: [['score', 'DESC']],
      limit: 50 // Adjust as needed
    });

    res.json(leaderboard.map(entry => ({
      username: entry.User.username,
      score: entry.score,
      game: entry.game,
      date: entry.createdAt
    })));
  } catch (error) {
    console.error('Error getting global leaderboard:', error);
    res.status(500).json({ message: 'Server error while fetching global leaderboard' });
  }
});

// Get all available games
router.get('/games', async (req, res) => {
  try {
    res.json(validGames);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



module.exports = router;
