const fs = require('fs');
const path = require('path');

const lockFile = path.join(process.cwd(), '.bot.lock');

function main() {
  try {
    const raw = fs.readFileSync(lockFile, 'utf8').trim();
    const pid = Number(raw);

    if (!raw || !pid || Number.isNaN(pid)) {
      console.log('No active bot lock found.');
      return;
    }

    try {
      process.kill(pid);
      console.log('Bot stopped.');
    } catch {
      console.log('Bot lock found, but no running instance was active.');
    }

    fs.unlinkSync(lockFile);
  } catch {
    console.log('No active bot lock found.');
  }
}

main();
