const { levelFromXp, xpForLevel, MAX_LEVEL } = require('./levelConfig');

let failures = 0;

// Prints OK/FAIL. Pass verbose = false to print only failures.
function check(label, actual, expected, verbose = true) {
  const ok = actual === expected;
  if (!ok) failures++;
  if (verbose || !ok) {
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${label}: expected ${expected}, got ${actual}`);
  }
}

// 1. Anchor values: [xp, expected level]
const cases = [
  [0, 1], [319, 1], [320, 2], [719, 2], [720, 3],
  [3920, 7], [8000, 10], [784080, 99], [10000000, 99],
];
for (const [xp, expected] of cases) {
  check(`levelFromXp(${xp})`, levelFromXp(xp), expected);
}

// 2. Round trip: every level threshold maps back to its own level,
//    and one XP below the threshold maps to the previous level.
for (let level = 1; level <= MAX_LEVEL; level++) {
  const threshold = xpForLevel(level);
  check(`levelFromXp(xpForLevel(${level}))`, levelFromXp(threshold), level, false);
  if (level >= 2) {
    check(`levelFromXp(xpForLevel(${level}) - 1)`, levelFromXp(threshold - 1), level - 1, false);
  }
}

console.log(failures === 0 ? '\nAll tests passed' : `\n${failures} test(s) FAILED`);