const WIN_CHANCE = 0.475;
const PAYOUT_MULTIPLIER = 2;
const XP_PER_GAME = 100;

function coinFlip(bet){

    const result = Math.random() < WIN_CHANCE ? 'win' : 'lose';
    const payout = result === 'win' ? bet * PAYOUT_MULTIPLIER : 0;
    return { result, payout, bet, xp : XP_PER_GAME};
}



module.exports = { coinFlip };