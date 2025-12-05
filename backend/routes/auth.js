const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const TOKEN_EXP = '7d';

function getUserByEmail(email){
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function getUserByIdentifier(identifier){
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [identifier, identifier], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function createUser({ email, username, password }){
  return new Promise(async (resolve, reject) => {
    try {
      db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, row) => {
        if (err) return reject(err);
        if (row) return reject(new Error('exists'));

        const hash = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)', [email, username, hash], function(insertErr){
          if (insertErr) return reject(insertErr);
          const id = this.lastID;
          resolve({ id, email, username });
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}

function authenticate(identifier, password){
  return new Promise(async (resolve, reject) => {
    try {
      const user = await getUserByIdentifier(identifier);
      if (!user) return resolve(null);
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return resolve(null);
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
}

// Signup: POST /api/auth/signup
router.post('/auth/signup', async (req, res) => {
  const { email, username, password } = req.body || {};
  if (!email || !password || !username) return res.status(400).json({ error: 'Missing email, username or password' });

  try {
    const created = await createUser({ email, username, password });
    const token = jwt.sign({ id: created.id, email: created.email, username: created.username }, JWT_SECRET, { expiresIn: TOKEN_EXP });
    res.status(201).json({ id: created.id, email: created.email, username: created.username, token });
  } catch (err) {
    if (err && err.message === 'exists') return res.status(409).json({ error: 'Email or username already registered' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login: POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  const { identifier, email, username, password } = req.body || {};
  const id = identifier || email || username;
  if (!id || !password) return res.status(400).json({ error: 'Missing identifier or password' });

  try {
    const user = await authenticate(id, password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: TOKEN_EXP });
    res.json({ id: user.id, email: user.email, username: user.username, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', (req, res) => {
  res.json({ api: 'shokobons', routes: ['/api/auth/signup', '/api/auth/login'] });
});

module.exports = router;
router.authUtils = {
  getUserByEmail,
  getUserByIdentifier,
  createUser,
  authenticate
};
