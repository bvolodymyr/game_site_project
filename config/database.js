const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Create a Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite'),
  logging: false // Set to console.log to see SQL queries
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('SQLite database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Export the Sequelize instance and connection test function
module.exports = {
  sequelize,
  testConnection
};