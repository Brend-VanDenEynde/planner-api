const Database = require('better-sqlite3');
const path = require('path');

// Database pad - in data folder
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'planner.db');
const db = new Database(DB_PATH);

// Schakel foreign keys in
db.pragma('foreign_keys = ON');

// Initialiseer database tabellen
const initDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS opdrachten (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('open', 'in_progress', 'done')) DEFAULT 'open',
      user_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log('Database geïnitialiseerd:', DB_PATH);
};

// Initialiseer bij opstarten
initDatabase();

module.exports = db;
