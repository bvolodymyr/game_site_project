document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent actual form submission

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const message = document.getElementById('message');

  // Basic validation
  const express = require('express');
const { addUser } = require('./db/userService');
const router = express.Router();

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  // Add to DB
  addUser(username, email, password, (err, userId) => {
    if (err) {
      console.error('Register error:', err.message);
      return res.status(500).json({ message: 'Registration failed.' });
    }

    res.json({ message: 'Registration successful!', userId });
    setTimeout(() => {
    window.location.href = '../pages/main.html';  // or '/' or your main page URL
  }, 1000); 
  });
});

module.exports = router;


  // Reset form (optional)
  document.getElementById('registerForm').reset();
});
