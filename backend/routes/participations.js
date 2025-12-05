const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /participations - list all participations
router.get('/participations', (req, res) => {
  db.all(`SELECT id, user_id, project_id, joined_at FROM participations ORDER BY joined_at DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      res.json(rows || []);
    });
});

// GET /participations/:id - get a specific participation
router.get('/participations/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT id, user_id, project_id, joined_at FROM participations WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!row) return res.status(404).json({ error: 'Participation not found' });
      res.json(row);
    });
});

// GET /users/:userId/participations - get all projects for a user
router.get('/users/:userId/participations', (req, res) => {
  const userId = req.params.userId;
  db.all(`SELECT p.id, p.user_id, p.project_id, p.joined_at,
           pr.name as project_name, pr.status, pr.location
           FROM participations p
           JOIN projects pr ON p.project_id = pr.id
           WHERE p.user_id = ?
           ORDER BY p.joined_at DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      res.json(rows || []);
    });
});

// POST /participations - add a user to a project
router.post('/participations', (req, res) => {
  const { user_id, project_id } = req.body || {};

  if (!user_id || !project_id) {
    return res.status(400).json({ error: 'Missing required fields: user_id, project_id' });
  }

  // Verify that both user and project exist
  db.get('SELECT id FROM users WHERE id = ?', [user_id], (userErr, user) => {
    if (userErr) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'User not found' });

    db.get('SELECT id FROM projects WHERE id = ?', [project_id], (projErr, project) => {
      if (projErr) return res.status(500).json({ error: 'Database error' });
      if (!project) return res.status(400).json({ error: 'Project not found' });

      db.run(`INSERT INTO participations (user_id, project_id) VALUES (?, ?)`,
        [user_id, project_id],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              return res.status(400).json({ error: 'User is already participating in this project' });
            }
            return res.status(500).json({ error: 'Database error', details: err.message });
          }

          db.get('SELECT id, user_id, project_id, joined_at FROM participations WHERE id = ?',
            [this.lastID],
            (e, row) => {
              if (e) return res.status(500).json({ error: 'Database error' });
              res.status(201).json(row);
            });
        });
    });
  });
});

// DELETE /participations/:id - remove a participation
router.delete('/participations/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM participations WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Participation not found' });
    res.json({ deleted: id });
  });
});

// DELETE /participations/user/:userId/project/:projectId - remove a user from a project
router.delete('/participations/user/:userId/project/:projectId', (req, res) => {
  const { userId, projectId } = req.params;

  db.run('DELETE FROM participations WHERE user_id = ? AND project_id = ?', [userId, projectId], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Participation not found' });
    res.json({ deleted: `user ${userId} from project ${projectId}` });
  });
});

module.exports = router;
