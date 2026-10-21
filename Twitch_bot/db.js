const path = require('path');

const dbPath = path.join(__dirname, 'data', 'bot.sqlite');

const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(dbPath);


const createUser = db.prepare(
    ` INSERT OR IGNORE INTO users (username) VALUES (?)`
);

const getUser = db.prepare(
    `SELECT * FROM users WHERE username = ?`
);

const addPoints = db.prepare(    
       `UPDATE users SET total_points = total_points + ?  WHERE username = ?`
);


function createOrGetUser(username) {
    const user = username.trim().toLowerCase();
    createUser.run(user);
    return getUser.get(user);
}




module.exports = { createOrGetUser };
