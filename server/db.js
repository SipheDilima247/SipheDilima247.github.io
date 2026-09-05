const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'subscribers.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      confirmed INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Subscribers table ready');
    }
  });
}

// Helper functions
const addSubscriber = (email) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO subscribers (email) VALUES (?)',
      [email],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, email });
        }
      }
    );
  });
};

const getSubscriber = (email) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM subscribers WHERE email = ?',
      [email],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

const getAllSubscribers = () => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT email FROM subscribers ORDER BY subscribed_at DESC',
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

module.exports = {
  db,
  addSubscriber,
  getSubscriber,
  getAllSubscribers
};
