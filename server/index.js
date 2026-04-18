const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'PathPilot Server is Running!', database: 'Connected' });
});

// Temp DB Check
app.get('/api/dbcheck', async (req, res) => {
    try {
        const users = await db.query('SELECT COUNT(*) FROM users');
        const roadmaps = await db.query('SELECT COUNT(*) FROM roadmaps');
        const messages = await db.query('SELECT COUNT(*) FROM community_messages');
        res.json({
            users: parseInt(users.rows[0].count),
            roadmaps: parseInt(roadmaps.rows[0].count),
            community_messages: parseInt(messages.rows[0].count),
        });
    } catch (err) {
        res.status(500).json({ error: err.message, detail: err.detail || null, code: err.code || null });
    }
});

// Import Routes
const authRoutes = require('./routes/auth');
const userDataRoutes = require('./routes/userData');

app.use('/api/auth', authRoutes);
app.use('/api/user', userDataRoutes);

app.listen(PORT, () => {
    console.log(`PathPilot Backend running on port ${PORT}`);
});
