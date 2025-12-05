const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open sqlite database', err);
  } else {
    console.log('Connected to sqlite database:', dbPath);
  }
});

db.run('PRAGMA foreign_keys = ON');

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT 0
  )`, (err) => { if (err) console.error('Error creating users table:', err); });

  // Projects table
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    technologies TEXT NOT NULL,
    responsible_id INTEGER NOT NULL,
    expected_members INTEGER DEFAULT 0,
    location TEXT,
    status TEXT DEFAULT 'en_cours',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(responsible_id) REFERENCES users(id) ON DELETE CASCADE
  )`, (err) => { if (err) console.error('Error creating projects table:', err); });

  // Participations table (liaison between users and projects)
  db.run(`CREATE TABLE IF NOT EXISTS participations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE(user_id, project_id)
  )`, (err) => { if (err) console.error('Error creating participations table:', err); });

  // Talents table
  db.run(`CREATE TABLE IF NOT EXISTS talents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    technologies TEXT NOT NULL,
    description TEXT,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`, (err) => { if (err) console.error('Error creating talents table:', err); });



});

db.all("PRAGMA table_info('users')", (err, rows) => {
  if (err) {
    console.error('Failed to read table_info for users', err);
  } else {
    const hasUsername = rows.some(r => r.name === 'username');
    if (hasUsername) {
      db.run("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username)", (idxErr) => {
        if (idxErr) console.error('Error creating username index:', idxErr);
      });
    }
  }
});

module.exports = db;
