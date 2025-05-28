const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // or actual db

module.exports = {
  run: db.run.bind(db),
  get: db.get.bind(db),
  all: db.all.bind(db),
};
