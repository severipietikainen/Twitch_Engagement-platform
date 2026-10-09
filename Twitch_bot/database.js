const {DatabaseSync} = require ('node:sqlite')

const db = new DatabaseSync('./data/bot.sqlite');



db.exec(

    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        total_xp INTEGER NOT NULL DEFAULT 0,
        total_points INTEGER NOT NULL DEFAULT 0
    )`
);

db.exec(

    `CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE
        )`
)

db.exec(

    `CREATE TABLE IF NOT EXISTS game_events (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,       
        game_id INTEGER,        
        timestamp TEXT,
        result TEXT,
        points_earned INTEGER,
        xp_earned INTEGER,
        metadata TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(game_id) REFERENCES games(id)
        )`
    )

    db.exec(

    `INSERT OR IGNORE INTO games (name) VALUES ('slots'), ('duel'), ('coin_flip')`
     
    );
    



console.log("it worked");