const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /projects - list all projects
router.get('/projects', (req, res) => {
  db.all(`SELECT id, name, description, technologies, responsible_id, expected_members, location, status, created_at, updated_at FROM projects ORDER BY created_at DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      res.json(rows || []);
    });
});

// GET /projects/:id - get a specific project
router.get('/projects/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT id, name, description, technologies, responsible_id, expected_members, location, status, created_at, updated_at FROM projects WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!row) return res.status(404).json({ error: 'Project not found' });
      res.json(row);
    });
});

// GET /projects/:id/members - get members of a project
router.get('/projects/:id/members', (req, res) => {
  const projectId = req.params.id;
  db.all(`SELECT u.id, u.username, u.email, u.first_name, u.last_name, p.joined_at
           FROM participations p
           JOIN users u ON p.user_id = u.id
           WHERE p.project_id = ?`,
    [projectId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      res.json(rows || []);
    });
});

// POST /projects - create a new project
router.post('/projects', (req, res) => {
  const { name, description, technologies, responsible_id, expected_members, location, status } = req.body || {};

  if (!name || !responsible_id || !technologies) {
    return res.status(400).json({ error: 'Missing required fields: name, responsible_id, technologies' });
  }

  // Verify that responsible_id exists
  db.get('SELECT id FROM users WHERE id = ?', [responsible_id], (checkErr, user) => {
    if (checkErr) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'Responsible user not found' });

    db.run(`INSERT INTO projects (name, description, technologies, responsible_id, expected_members, location, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description || null, technologies, responsible_id, expected_members || 0, location || null, status || 'en_cours'],
      function(err) {
        if (err) return res.status(500).json({ error: 'Database error', details: err.message });
        db.get('SELECT id, name, description, technologies, responsible_id, expected_members, location, status, created_at, updated_at FROM projects WHERE id = ?',
          [this.lastID],
          (e, row) => {
            if (e) return res.status(500).json({ error: 'Database error' });
            res.status(201).json(row);
          });
      });
  });
});

// PUT /projects/:id - update a project
router.put('/projects/:id', (req, res) => {
  const id = req.params.id;
  const { name, description, technologies, responsible_id, expected_members, location, status } = req.body || {};

  // Build dynamic update query
  const updates = [];
  const values = [];

  if (name !== undefined) { updates.push('name = ?'); values.push(name); }
  if (description !== undefined) { updates.push('description = ?'); values.push(description); }
  if (technologies !== undefined) { updates.push('technologies = ?'); values.push(technologies); }
  if (responsible_id !== undefined) { updates.push('responsible_id = ?'); values.push(responsible_id); }
  if (expected_members !== undefined) { updates.push('expected_members = ?'); values.push(expected_members); }
  if (location !== undefined) { updates.push('location = ?'); values.push(location); }
  if (status !== undefined) { updates.push('status = ?'); values.push(status); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  db.run(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`, values, function(err) {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Project not found' });

    db.get('SELECT id, name, description, technologies, responsible_id, expected_members, location, status, created_at, updated_at FROM projects WHERE id = ?',
      [id],
      (e, row) => {
        if (e) return res.status(500).json({ error: 'Database error' });
        res.json(row);
      });
  });
});

// DELETE /projects/:id - delete a project
router.delete('/projects/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM projects WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ deleted: id });
  });
});

module.exports = router;
