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

const getUserById = db.prepare (
    `SELECT * FROM users WHERE id = ?`
)

const addPoints = db.prepare(    
       `UPDATE users SET total_points = total_points + ?  WHERE username = ?`
);

const trySpendPoints = db.prepare(
    `UPDATE users SET total_points = total_points - ? WHERE username = ? AND total_points >= ?`
);

const getGame = db.prepare(
    `SELECT id FROM games WHERE name = ?`
)

const updatePlayer = db.prepare(
    `UPDATE users SET total_points = total_points + ?, total_xp = total_xp + ? WHERE id = ?`
)

const insertGameEvent = db.prepare(
    `INSERT INTO game_events
        (user_id, game_id, timestamp, result, points_earned, xp_earned, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
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

function recordGameResult({ userId, gameName, result, stake, payout, xp }) {
    
     const gameRow = getGame.get(gameName)

     if (!gameRow){

        throw new Error('Game not found')

     }
     
    db.exec('BEGIN');

    try {

    updatePlayer.run(payout, xp, userId)

    
    insertGameEvent.run(userId, gameRow.id, new Date().toISOString(), result, payout - stake, xp, JSON.stringify({stake, payout}));

    db.exec('COMMIT');
    
        }
        
        catch (error)

        {

    db.exec('ROLLBACK');

        throw error;

        }


    return getUserById.get(userId);

}




module.exports = { createOrGetUser, addUserPoints, spendUserPoints, recordGameResult };
