const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { findUserByUsername, createLocalUser } = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const enableGoogle = process.env.ENABLE_GOOGLE_OAUTH === 'true';

// ─── Helper ──────────────────────────────────────────────
function signToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// ─── POST /api/auth/register ─────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        if (password.length < 4) {
            return res.status(400).json({ error: 'Password must be at least 4 characters' });
        }
        if (findUserByUsername(username)) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = createLocalUser({ username, hashedPassword });

        const token = signToken(user);
        res.status(201).json({ token, user: { id: user.id, username: user.username } });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ─── POST /api/auth/login ────────────────────────────────
router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ error: info?.message || 'Invalid credentials' });
        }
        const token = signToken(user);
        res.json({ token, user: { id: user.id, username: user.username } });
    })(req, res, next);
});

// ─── Google OAuth (only registered when enabled) ─────────
if (enableGoogle) {
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get(
        '/google/callback',
        passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=google_failed` }),
        (req, res) => {
            const token = signToken(req.user);
            // Redirect back to the frontend with the token in the URL
            res.redirect(`${FRONTEND_URL}/login?token=${token}&username=${encodeURIComponent(req.user.username)}`);
        }
    );
}

module.exports = router;
