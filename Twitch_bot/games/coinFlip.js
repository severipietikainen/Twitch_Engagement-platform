const WIN_CHANCE = 0.5;
const PAYOUT_MULTIPLIER = 2;

function coinFlip(bet){

    const result = Math.random() < WIN_CHANCE ? 'win' : 'lose';
    const payout = result === 'win' ? bet * PAYOUT_MULTIPLIER : 0;
    return { result, payout, bet};
}

module.exports = { coinFlip };