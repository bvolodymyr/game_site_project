const { sequelize } = require('../config/database');
const User = require('./User');
const Score = require('./Score');

// Define associations
User.hasMany(Score, { foreignKey: 'userId' });
Score.belongsTo(User, { foreignKey: 'userId' });

// Function to initialize the database
async function initializeDatabase() {
  try {
    // Sync all models with the database
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}

module.exports = {
  User,
  Score,
  initializeDatabase
};