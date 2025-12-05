const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /users - list
router.get('/users', (req, res) => {
  db.all('SELECT id, username, email, first_name, last_name, created_at, is_admin FROM users', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    res.json(rows || []);
  });
});

// GET /users-with-talents - all users with their talents
router.get('/users-with-talents', (req, res) => {
  db.all(`
    SELECT 
      u.id, u.username, u.email, u.first_name, u.last_name, u.created_at, u.is_admin,
      t.id as talent_id, t.technologies, t.description, t.location, t.created_at as talent_created_at
    FROM users u
    LEFT JOIN talents t ON u.id = t.user_id
    ORDER BY u.id
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    
    // Group talents by user
    const users = {};
    (rows || []).forEach(row => {
      if (!users[row.id]) {
        users[row.id] = {
          id: row.id,
          username: row.username,
          email: row.email,
          first_name: row.first_name,
          last_name: row.last_name,
          created_at: row.created_at,
          is_admin: row.is_admin,
          talent: null
        };
      }
      if (row.talent_id) {
        users[row.id].talent = {
          id: row.talent_id,
          technologies: row.technologies,
          description: row.description,
          location: row.location,
          created_at: row.talent_created_at
        };
      }
    });
    
    res.json(Object.values(users));
  });
});

// GET /users/:id
router.get('/users/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT id, username, email, first_name, last_name, created_at, is_admin FROM users WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json(row);
  });
});

// GET /users/:id/with-talent - user with associated talent
router.get('/users/:id/with-talent', (req, res) => {
  const id = req.params.id;
  db.get(`
    SELECT 
      u.id, u.username, u.email, u.first_name, u.last_name, u.created_at, u.is_admin,
      t.id as talent_id, t.technologies, t.description, t.location, t.created_at as talent_created_at
    FROM users u
    LEFT JOIN talents t ON u.id = t.user_id
    WHERE u.id = ?
  `, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'User not found' });
    
    // Format response with nested talent object
    const response = {
      id: row.id,
      username: row.username,
      email: row.email,
      first_name: row.first_name,
      last_name: row.last_name,
      created_at: row.created_at,
      is_admin: row.is_admin,
      talent: row.talent_id ? {
        id: row.talent_id,
        technologies: row.technologies,
        description: row.description,
        location: row.location,
        created_at: row.talent_created_at
      } : null
    };
    res.json(response);
  });
});

// POST /users
router.post('/users', (req, res) => {
  const { username, email, password_hash, first_name, last_name, is_admin } = req.body || {};
  if (!username || !email || !password_hash) return res.status(400).json({ error: 'Missing required fields: username, email, password_hash' });

  db.run('INSERT INTO users (username, email, password_hash, first_name, last_name, is_admin) VALUES (?, ?, ?, ?, ?, ?)',
    [username, email, password_hash, first_name || null, last_name || null, is_admin ? 1 : 0],
    function(err){
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      db.get('SELECT id, username, email, first_name, last_name, created_at, is_admin FROM users WHERE id = ?', [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ error: 'Database error' });
        res.status(201).json(row);
      });
    });
});

// PUT /users/:id
router.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const { username, email, password_hash, first_name, last_name, is_admin } = req.body || {};

  db.run('UPDATE users SET username = COALESCE(?, username), email = COALESCE(?, email), password_hash = COALESCE(?, password_hash), first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name), is_admin = COALESCE(?, is_admin) WHERE id = ?',
    [username || null, email || null, password_hash || null, first_name || null, last_name || null, typeof is_admin === 'boolean' ? (is_admin ? 1 : 0) : null, id],
    function(err){
      if (err) return res.status(500).json({ error: 'Database error' });
      if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
      db.get('SELECT id, username, email, first_name, last_name, created_at, is_admin FROM users WHERE id = ?', [id], (e, row) => {
        if (e) return res.status(500).json({ error: 'Database error' });
        res.json(row);
      });
    });
});

// DELETE /users/:id
router.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM users WHERE id = ?', [id], function(err){
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ deleted: id });
  });
});

module.exports = router;
