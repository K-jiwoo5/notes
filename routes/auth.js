const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err, result) => {
            if(err) return res.status(400).json(err);
            res.json({ message: "User registered successfully" });
        }
    );
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if(err) return res.status(400).json(err);
        if(result.length === 0) return res.status(400).json({ message: "User not found" });

        const user = result[0];
        const validPass = await bcrypt.compare(password, user.password);
        if(!validPass) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

module.exports = router;
