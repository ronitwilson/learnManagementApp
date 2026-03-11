require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// --------------- Middleware ---------------
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:3010', 'http://127.0.0.1:3010'].filter(Boolean),
    credentials: true,
}));
app.use(express.json());
app.use(passport.initialize());

// --------------- Passport strategies ---------------
// Local strategy is always available
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { users, findUserByUsername } = require('./store');

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = findUserByUsername(username);
        if (!user) return done(null, false, { message: 'User not found' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Google OAuth — only initialised when enabled
const enableGoogle = process.env.ENABLE_GOOGLE_OAUTH === 'true';
if (enableGoogle) {
    const GoogleStrategy = require('passport-google-oauth20').Strategy;
    const { findUserByGoogleId, createGoogleUser } = require('./store');

    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
        },
        (_accessToken, _refreshToken, profile, done) => {
            let user = findUserByGoogleId(profile.id);
            if (!user) {
                user = createGoogleUser({
                    googleId: profile.id,
                    username: profile.displayName || profile.emails?.[0]?.value || `google_${profile.id}`,
                });
            }
            return done(null, user);
        }
    ));
}

// --------------- Routes ---------------
// Expose a config endpoint so the frontend knows if Google is enabled
app.get('/api/config', (_req, res) => {
    res.json({ googleOAuthEnabled: enableGoogle });
});

app.use('/api/auth', authRoutes);

// --------------- Start ---------------
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`✔  Backend running on http://localhost:${PORT}`);
        console.log(`   Google OAuth: ${enableGoogle ? 'ENABLED' : 'DISABLED'}`);
    });
}

module.exports = app;
