const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /talents - list all talents
router.get('/talents', (req, res) => {
  db.all(`SELECT t.id, t.user_id, u.username, u.email, t.technologies, t.description, t.location, t.created_at, t.updated_at
          FROM talents t
          JOIN users u ON t.user_id = u.id
          ORDER BY t.created_at DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      res.json(rows || []);
    });
});

// GET /talents/:id - get a specific talent profile
router.get('/talents/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT t.id, t.user_id, u.username, u.email, u.first_name, u.last_name, t.technologies, t.description, t.location, t.created_at, t.updated_at
          FROM talents t
          JOIN users u ON t.user_id = u.id
          WHERE t.id = ?`,
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!row) return res.status(404).json({ error: 'Talent profile not found' });
      res.json(row);
    });
});

// GET /talents/user/:userId - get talent profile for a specific user
router.get('/talents/user/:userId', (req, res) => {
  const userId = req.params.userId;
  db.get(`SELECT t.id, t.user_id, u.username, u.email, u.first_name, u.last_name, t.technologies, t.description, t.location, t.created_at, t.updated_at
          FROM talents t
          JOIN users u ON t.user_id = u.id
          WHERE t.user_id = ?`,
    [userId],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!row) return res.status(404).json({ error: 'Talent profile not found for this user' });
      res.json(row);
    });
});

// POST /talents - create a talent profile
router.post('/talents', (req, res) => {
  const { user_id, technologies, description, location } = req.body || {};

  if (!user_id || !technologies) {
    return res.status(400).json({ error: 'Missing required fields: user_id, technologies' });
  }

  // Verify that user exists
  db.get('SELECT id FROM users WHERE id = ?', [user_id], (userErr, user) => {
    if (userErr) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'User not found' });

    db.run(`INSERT INTO talents (user_id, technologies, description, location)
            VALUES (?, ?, ?, ?)`,
      [user_id, technologies, description || null, location || null],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Talent profile already exists for this user' });
          }
          return res.status(500).json({ error: 'Database error', details: err.message });
        }

        db.get(`SELECT t.id, t.user_id, u.username, u.email, u.first_name, u.last_name, t.technologies, t.description, t.location, t.created_at, t.updated_at
                FROM talents t
                JOIN users u ON t.user_id = u.id
                WHERE t.id = ?`,
          [this.lastID],
          (e, row) => {
            if (e) return res.status(500).json({ error: 'Database error' });
            res.status(201).json(row);
          });
      });
  });
});

// PUT /talents/:id - update a talent profile
router.put('/talents/:id', (req, res) => {
  const id = req.params.id;
  const { technologies, description, location } = req.body || {};

  // Build dynamic update query
  const updates = [];
  const values = [];

  if (technologies !== undefined) { updates.push('technologies = ?'); values.push(technologies); }
  if (description !== undefined) { updates.push('description = ?'); values.push(description); }
  if (location !== undefined) { updates.push('location = ?'); values.push(location); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  db.run(`UPDATE talents SET ${updates.join(', ')} WHERE id = ?`, values, function(err) {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Talent profile not found' });

    db.get(`SELECT t.id, t.user_id, u.username, u.email, u.first_name, u.last_name, t.technologies, t.description, t.location, t.created_at, t.updated_at
            FROM talents t
            JOIN users u ON t.user_id = u.id
            WHERE t.id = ?`,
      [id],
      (e, row) => {
        if (e) return res.status(500).json({ error: 'Database error' });
        res.json(row);
      });
  });
});

// DELETE /talents/:id - delete a talent profile
router.delete('/talents/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM talents WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Talent profile not found' });
    res.json({ deleted: id });
  });
});

// DELETE /talents/user/:userId - delete a user's talent profile
router.delete('/talents/user/:userId', (req, res) => {
  const userId = req.params.userId;

  db.run('DELETE FROM talents WHERE user_id = ?', [userId], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Talent profile not found for this user' });
    res.json({ deleted: `talent profile for user ${userId}` });
  });
});

module.exports = router;
