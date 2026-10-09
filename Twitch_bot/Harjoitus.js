const {DatabaseSync} = require ('node:sqlite')

const db = new DatabaseSync('./data/bot.sqlite_harjoitus');



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

   const insertUser = db.prepare(
    `INSERT OR IGNORE INTO users (username) VALUES (?)`

    );


    const addxpPoints = db.prepare(
    
        `UPDATE users SET total_xp = total_xp + ?, total_points = total_points + ?  WHERE username = ?`
    );

    const getUser = db.prepare(
        `SELECT * FROM users WHERE username = ?`
    );

    const getAllUsers = db.prepare("SELECT * FROM users ORDER BY total_xp DESC, total_points DESC LIMIT 10");

    insertUser.run('test_user');
    insertUser.run('ghost_user');
    insertUser.run('test_user2');
    insertUser.run('test_user3');
    addxpPoints.run(100, 10, 'test_user');
    addxpPoints.run(50, 5, 'test_user2');
    addxpPoints.run(75, 7, 'test_user3');
    const testUser = getUser.get('test_user');

    getAllUsers.all().forEach(user => {
        console.log(`Username: ${user.username}, Total XP: ${user.total_xp}, Total Points: ${user.total_points}`);
    });

    console.log(testUser);

console.log("it worked");