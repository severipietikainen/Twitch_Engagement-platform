

const database = require('./db');

const user = database.createOrGetUser('testuser')

console.log(database.recordGameResult({ userId: user.id, gameName: 'coin_flip', result: 'win', stake: 100, payout: 200, xp: 10 }));

console.log (database.recordGameResult({userId: user.id, gameName: 'coin_flip', result: 'lose', stake: 100, payout: 0, xp: 10 }));

