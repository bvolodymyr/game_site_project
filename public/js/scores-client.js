// Save the user's current score for a game
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
    if (!response.ok) throw new Error(data.message || 'Failed to save score');

    return data;
  } catch (error) {
    console.error('Save score error:', error);
    throw error;
  }
}

// Get user's high score for a specific game
async function getUserHighScore(game) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('User not logged in, cannot get high score');
      return 0;
    }

    const response = await fetch(`/api/scores/highscore/${encodeURIComponent(game)}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get high score');

    return data.score;
  } catch (error) {
    console.error('Get high score error:', error);
    return 0;
  }
}

// Fetch leaderboard for a specific game
async function getLeaderboard(game) {
  try {
    const response = await fetch(`/api/scores/leaderboard/${encodeURIComponent(game)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `Failed to get leaderboard for game: ${game}`);

    return data; // Should be an array of leaderboard entries
  } catch (error) {
    console.error(`Get leaderboard error for game "${game}":`, error);
    return [];
  }
}

// Fetch the global leaderboard (across all games)
async function getGlobalLeaderboard() {
  try {
    const response = await fetch('/api/scores/global-leaderboard/', { method: 'GET' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get global leaderboard');

    return data; // Should be an array of leaderboard entries
  } catch (error) {
    console.error('Get global leaderboard error:', error);
    return [];
  }
}

// Update leaderboard for a specific game
async function updateLeaderboard(gameName) {
  const currentScore = parseInt(document.getElementById('score').textContent);
  if (!isUserLoggedIn || currentScore <= 0) return;

  try {
    // Save current score
    await saveScore(gameName, currentScore);

    // Update high score
    const highScore = await getUserHighScore(gameName);
    document.getElementById('highScore').textContent = highScore;

    // Update leaderboard table
    const leaderboard = await getLeaderboard(gameName);
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';

    leaderboard.forEach((entry, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.username}</td>
        <td>${entry.score}</td>
      `;
      leaderboardBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
}

// Update the global leaderboard
async function updateGlobalLeaderboard() {
  try {
    const leaderboard = await getGlobalLeaderboard();

    // Sort descending by score (if not already sorted by the server)
    leaderboard.sort((a, b) => b.score - a.score);

    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';

    leaderboard.forEach((entry, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.username}</td>
        <td>${entry.score}</td>
        <td>${entry.game}</td>
      `;
      leaderboardBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error updating global leaderboard:', error);
  }
}

async function populateLeaderboardOnLoad(game) {
  try {
    const leaderboard = await getLeaderboard(game);
    const leaderboardBody = document.getElementById('leaderboardBody');

    if (!leaderboardBody) {
      console.warn('Leaderboard table not found in the DOM.');
      return;
    }

    leaderboardBody.innerHTML = '';

    leaderboard.forEach((entry, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.username}</td>
        <td>${entry.score}</td>
      `;
      leaderboardBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error populating leaderboard:', error);
  }
}
