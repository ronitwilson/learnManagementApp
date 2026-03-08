/**
 * Simple in-memory user store.
 * Replace with a real database for production.
 */

const users = [];
let nextId = 1;

function findUserByUsername(username) {
    return users.find((u) => u.username === username);
}

function findUserById(id) {
    return users.find((u) => u.id === id);
}

function findUserByGoogleId(googleId) {
    return users.find((u) => u.googleId === googleId);
}

function createLocalUser({ username, hashedPassword }) {
    const user = { id: nextId++, username, password: hashedPassword, provider: 'local' };
    users.push(user);
    return user;
}

function createGoogleUser({ googleId, username }) {
    const user = { id: nextId++, username, googleId, provider: 'google' };
    users.push(user);
    return user;
}

module.exports = {
    users,
    findUserByUsername,
    findUserById,
    findUserByGoogleId,
    createLocalUser,
    createGoogleUser,
};
