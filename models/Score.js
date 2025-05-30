const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Score extends Model {}

Score.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  game: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['snake', 'pong', 'invaders', 'pacman']] // List of available games
    }
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Score',
  timestamps: true,
  indexes: [
    {
      fields: ['game', 'score'],
      order: [['score', 'DESC']]
    },
    {
      fields: ['userId', 'game']
    }
  ]
});

module.exports = Score;
