const database = require('./db');

const user = database.createOrGetUser('leveluptester');
console.log('Before:', user.total_points, 'points,', user.total_xp, 'XP');

const after = database.recordLevelUp({ userId: user.id, fromLevel: 1, toLevel: 2, bonus: 70 });
console.log('After valid call:', after.total_points, 'points,', after.total_xp, 'XP (expected +70 points, XP unchanged)');

try {
  database.recordLevelUp({ userId: 9999, fromLevel: 1, toLevel: 2, bonus: 70 });
  console.log('FAIL: unknown user did not throw');
} catch (error) {
  console.log('OK, unknown user:', error.message);
}

try {
  database.recordLevelUp({ userId: user.id, fromLevel: 1, toLevel: 2, bonus: -5 });
  console.log('FAIL: bad bonus did not throw');
} catch (error) {
  console.log('OK, bad bonus:', error.message);
}