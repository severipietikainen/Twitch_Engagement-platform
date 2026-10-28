const path = require('path');

const dbPath = path.join(__dirname, 'data', 'bot.sqlite');

const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(dbPath);

const STARTING_POINTS = 100;


const createUser = db.prepare(
    ` INSERT OR IGNORE INTO users (username, total_points) VALUES (?, ?)`
);

const getUser = db.prepare(
    `SELECT * FROM users WHERE username = ?`
);

const addPoints = db.prepare(    
       `UPDATE users SET total_points = total_points + ?  WHERE username = ?`
);

const trySpendPoints = db.prepare(
    `UPDATE users SET total_points = total_points - ? WHERE username = ? AND total_points >= ?`
);

function normalizeUsername(username) {
    return username.trim().toLowerCase();
}

function createOrGetUser(username) {
    const user = normalizeUsername(username);
    createUser.run(user, STARTING_POINTS);
    return getUser.get(user);
}

function addUserPoints(username, points) {
    const user = normalizeUsername(username);
    const result = addPoints.run(points, user);
    if (result.changes === 0) {
        console.error(`User ${user} not found in the database.`);

        return null;
    }
    return getUser.get(user);
}

function spendUserPoints(username, points) {

    const user = normalizeUsername(username);

    if (!Number.isInteger(points) || points <= 0) {
        throw new Error('Points to spend must be a positive integer.');
    }
    const result = trySpendPoints.run(points, user, points);

    if (result.changes === 0) {
        
        return null;
    }
    
        return getUser.get(user);
    
}


module.exports = { createOrGetUser, addUserPoints, spendUserPoints };
