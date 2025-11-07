const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

// Get all notes for user
router.get('/', authenticateToken, (req, res) => {
    db.query('SELECT * FROM notes WHERE user_id = ?', [req.user.id], (err, results) => {
        if(err) return res.status(400).json(err);
        res.json(results);
    });
});

// Add note
router.post('/', authenticateToken, (req, res) => {
    const { title, content } = req.body;
    db.query('INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)', 
        [req.user.id, title, content], (err, result) => {
            if(err) return res.status(400).json(err);
            res.json({ message: "Note added" });
        });
});

// Update note
router.put('/:id', authenticateToken, (req, res) => {
    const { title, content } = req.body;
    const noteId = req.params.id;

    db.query('UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
        [title, content, noteId, req.user.id], (err, result) => {
            if(err) return res.status(400).json(err);
            res.json({ message: "Note updated" });
        });
});

// Delete note
router.delete('/:id', authenticateToken, (req, res) => {
    const noteId = req.params.id;

    db.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [noteId, req.user.id], (err, result) => {
        if(err) return res.status(400).json(err);
        res.json({ message: "Note deleted" });
    });
});

module.exports = router;
