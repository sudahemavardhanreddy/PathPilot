const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get User Profile
router.get('/profile', auth, async (req, res) => {
    try {
        const userResult = await db.query('SELECT id, name, email, current_class, gender, primary_interest, xp, missions_completed FROM users WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(userResult.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Profile
router.put('/profile', auth, async (req, res) => {
    const { current_class, gender, primary_interest, xp, missions_completed } = req.body;
    try {
        const updatedUser = await db.query(
            `UPDATE users SET 
                current_class = COALESCE($1, current_class), 
                gender = COALESCE($2, gender), 
                primary_interest = COALESCE($3, primary_interest),
                xp = COALESCE($4, xp),
                missions_completed = COALESCE($5, missions_completed)
            WHERE id = $6 RETURNING *`,
            [current_class, gender, primary_interest, xp, missions_completed, req.user.id]
        );
        res.json(updatedUser.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error updating profile' });
    }
});

// Save Roadmap
router.post('/roadmaps', auth, async (req, res) => {
    const { title, category, content } = req.body;
    try {
        const newRoadmap = await db.query(
            'INSERT INTO roadmaps (user_id, title, category, content) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, title, category, JSON.stringify(content)]
        );
        res.json(newRoadmap.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error saving roadmap' });
    }
});

// Get User Roadmaps
router.get('/roadmaps', auth, async (req, res) => {
    try {
        const roadmaps = await db.query('SELECT * FROM roadmaps WHERE user_id = $1', [req.user.id]);
        res.json(roadmaps.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching roadmaps' });
    }
});

// Get Community Messages
router.get('/community/:id', async (req, res) => {
    try {
        const messages = await db.query('SELECT * FROM community_messages WHERE community_id = $1 ORDER BY timestamp DESC LIMIT 50', [req.params.id]);
        res.json(messages.rows.reverse());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Post Community Message
router.post('/community', auth, async (req, res) => {
    const { community_id, message } = req.body;
    try {
        const user = await db.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
        const newMessage = await db.query(
            'INSERT INTO community_messages (community_id, user_name, message) VALUES ($1, $2, $3) RETURNING *',
            [community_id, user.rows[0].name, message]
        );
        res.json(newMessage.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
