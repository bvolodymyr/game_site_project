const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database configuration and models
const { testConnection } = require('./config/database');
const { initializeDatabase } = require('./models');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Test database connection
testConnection();

// Initialize database (sync models)
initializeDatabase();

// Import routes
const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/scores');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);

// Serve the main HTML file for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'main.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
