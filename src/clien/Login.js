document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const message = document.getElementById('message');

  if (!username || !password) {
    message.textContent = 'Please enter both username and password.';
    message.style.color = 'red';
    return;
  }

  // Dummy check (in a real app, validate with a backend)
  const express = require('express');
const { findUser, getUserScores } = require('./db/userService');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  findUser(username, password, (err, user) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Optional: fetch scores
    getUserScores(user.id, (err, scores) => {
      if (err) return res.status(500).json({ message: 'Error retrieving scores' });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          scores: scores
        }
      });
    });
  });
});

module.exports = router;
setTimeout(() => {
    window.location.href = '../pages/main.html';  // or '/' or your main page URL
  }, 1000); 

  // Optional: Reset form
  document.getElementById('loginForm').reset();
});
