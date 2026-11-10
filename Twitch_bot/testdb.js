const database = require('./db');

const user = database.createOrGetUser('testuser');
console.log('Before:', user);

// Test 1: wrong user (foreign key fails, nothing to roll back)
try {
    database.recordGameResult({ userId: 9999, gameName: 'coin_flip', result: 'win', stake: 10, payout: 20, xp: 5 });
    console.log('Test 1 FAILED: no error thrown');
} catch (error) {
    console.log('Test 1 error:', error.message);
}

// Test 2: wrong game name (thrown before the transaction starts)
try {
    database.recordGameResult({ userId: user.id, gameName: 'coinflip', result: 'win', stake: 10, payout: 20, xp: 5 });
    console.log('Test 2 FAILED: no error thrown');
} catch (error) {
    console.log('Test 2 error:', error.message);
}

// Test 3: the update succeeds but the insert fails (result is missing) -> ROLLBACK must undo the update
try {
    database.recordGameResult({ userId: user.id, gameName: 'coin_flip', stake: 10, payout: 20, xp: 5 });
    console.log('Test 3 FAILED: no error thrown');
} catch (error) {
    console.log('Test 3 error:', error.message);
}

console.log('After:', database.createOrGetUser('testuser'));

// Final check: a valid call still works, so no transaction was left open
console.log('Valid call:', database.recordGameResult({ userId: user.id, gameName: 'coin_flip', result: 'win', stake: 10, payout: 20, xp: 5 }));

