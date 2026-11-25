




const C = 80;

const MAX_LEVEL = 99;


function levelFromXp(xp) {


    const level = Math.floor(Math.sqrt(xp / C));

    return Math.min(Math.max(level, 1), MAX_LEVEL);
}

function xpForLevel(level) {
    if (level <= 1) return 0;
    if (level > MAX_LEVEL) level = MAX_LEVEL;
    return C * level * level;
}

function levelUpBonus(level) {
    return 50 + 10 * level;
}


module.exports = { levelFromXp, xpForLevel, levelUpBonus, MAX_LEVEL };