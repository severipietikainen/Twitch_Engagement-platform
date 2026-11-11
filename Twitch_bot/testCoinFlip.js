const coinFlip = require('./games/coinFlip');

let wins = 0;

const N = 100000;

for (let i = 0; i < N; i++) {

const playedGame = coinFlip.coinFlip(10)

 if (playedGame.result === 'win') {
    wins++;
 }

}
const winRate = wins / N * 100;

console.log(coinFlip.coinFlip(1))

console.log('N =', N, 'wins =', wins);
console.log(`Win Rate: ${winRate.toFixed(1)}%`);

