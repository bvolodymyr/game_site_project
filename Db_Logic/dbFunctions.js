const db = require('./db');

function addUser(name, email, password, callback) {
  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(query, [name, email, password], function (err) {
    if (err) return callback(err);
    callback(null, this.lastID);
  });
}


function setUserScore(userId, game, score, callback) {
  const query = `
    INSERT INTO scores (user_id, game, score)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, game) DO UPDATE SET score = excluded.score
  `;
  db.run(query, [userId, game, score], function (err) {
    if (err) return callback(err);
    callback(null);
  });
}

function getUserScores(userId, callback) {
  const query = `SELECT game, score FROM scores WHERE user_id = ?`;
  db.all(query, [userId], (err, rows) => {
    if (err) return callback(err);
    const scores = {};
    rows.forEach(row => {
      scores[row.game] = row.score;
    });
    callback(null, scores);
  });
}

function findUser(name, password, callback) {
  const query = `SELECT * FROM users WHERE name = ? AND password = ?`;
  db.get(query, [name, password], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null); // not found
    callback(null, row);
  });
}

module.exports = {
  addUser,
  setUserScore,
  getUserScores,
  findUser
};
