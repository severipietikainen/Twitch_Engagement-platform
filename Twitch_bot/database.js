const {DatabaseSync} = require ('node:sqlite')

const db = new DatabaseSync('./data/bot.sqlite');

db.exec(

    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        total_xp INTEGER,
        total_points INTEGER
    )`
);

db.exec(

    `CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY,
        name TEXT
        )`
);

db.exec(

    `CREATE TABLE IF NOT EXISTS game_events (
        id INTEGER PRIMARY KEY,
        user_id INTEGER FOREIGN KEY REFERENCES users(id),
        game_id INTEGER FOREIGN KEY REFERENCES games(id),
        timestamp TEXT,
        result TEXT,
        points_earned INTEGER,
        xp_earned INTEGER,
        metadata TEXT
        )`
    );



console.log("it worked");