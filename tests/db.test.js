jest.mock('../Db_Logic/db');

const db = require('../Db_Logic/db');
const data = require('../Db_Logic/dbFunctions');

describe('Database functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('addUser - success', (done) => {
    db.run.mockImplementation((query, params, callback) => {
      callback.call({ lastID: 42 }, null);
    });

    data.addUser('Alice', 'alice@example.com', '123', (err, id) => {
      expect(err).toBeNull();
      expect(id).toBe(42);
      done();
    });
  });

  test('setUserScore - success', (done) => {
    db.run.mockImplementation((query, params, callback) => {
      callback(null);
    });

    data.setUserScore(1, 'Pong', 200, (err) => {
      expect(err).toBeNull();
      done();
    });
  });

  test('getUserScores - returns scores', (done) => {
    db.all.mockImplementation((query, params, callback) => {
      callback(null, [
        { game: 'Pac-Man', score: 100 },
        { game: 'Pong', score: 200 }
      ]);
    });

    data.getUserScores(1, (err, scores) => {
      expect(err).toBeNull();
      expect(scores).toEqual({ 'Pac-Man': 100, Pong: 200 });
      done();
    });
  });

  test('findUser - user found', (done) => {
    db.get.mockImplementation((query, params, callback) => {
      callback(null, { id: 1, name: 'Alice', password: '123' });
    });

    data.findUser('Alice', '123', (err, user) => {
      expect(err).toBeNull();
      expect(user).toEqual({ id: 1, name: 'Alice', password: '123' });
      done();
    });
  });

  test('getLeaderboard - returns leaderboard', (done) => {
    db.all.mockImplementation((query, params, callback) => {
      callback(null, [{ username: 'Bob', score: 100 }]);
    });

    data.getLeaderboard('Pac-Man', (err, leaderboard) => {
      expect(err).toBeNull();
      expect(leaderboard).toEqual([{ username: 'Bob', score: 100 }]);
      done();
    });
  });

  test('getGlobalLeaderboard - returns global leaderboard', (done) => {
    db.all.mockImplementation((query, callback) => {
      callback(null, [{ username: 'Eve', game: 'Pong', score: 300 }]);
    });

    data.getGlobalLeaderboard((err, leaderboard) => {
      expect(err).toBeNull();
      expect(leaderboard).toEqual([{ username: 'Eve', game: 'Pong', score: 300 }]);
      done();
    });
  });
  test('findUser - user not found', (done) => {
  db.get.mockImplementation((query, params, callback) => {
    callback(null, null); // імітуємо, що користувача не знайдено
  });

  data.findUser('Nonexistent', 'wrongpass', (err, user) => {
    expect(err).toBeNull();
    expect(user).toBeNull(); // користувач не знайдений
    done();
  });
});

});
