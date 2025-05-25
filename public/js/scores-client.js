// Function to save a score
async function saveScore(game, score) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('User not logged in, score not saved');
      return null;
    }
    
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ game, score })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save score');
    }
    
    return data;
  } catch (error) {
    console.error('Save score error:', error);
    throw error;
  }
}

// Function to get user's high score for a game
async function getUserHighScore(game) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('User not logged in, cannot get high score');
      return null;
    }
    
    const response = await fetch(`/api/scores/highscore/${game}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get high score');
    }
    
    return data.score;
  } catch (error) {
    console.error('Get high score error:', error);
    return 0;
  }
}

// Function to get leaderboard for a game
async function getLeaderboard(game) {
  try {
    const response = await fetch(`/api/scores/leaderboard/${game}`, {
      method: 'GET'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get leaderboard');
    }
    
    return data;
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return [];
  }
}

// Function to get all available games
async function getGames() {
  try {
    const response = await fetch('/api/scores/games', {
      method: 'GET'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get games');
    }
    
    return data;
  } catch (error) {
    console.error('Get games error:', error);
    return [];
  }
}