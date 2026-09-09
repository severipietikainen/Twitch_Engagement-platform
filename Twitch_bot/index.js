// index.js
// First step: connect to Twitch chat and print incoming messages.

const fs = require('fs');
const path = require('path');

const lockFile = path.join(__dirname, '.bot.lock');

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return false;
  }
}

function releaseLock() {
  try {
    if (fs.existsSync(lockFile)) {
      const currentPid = Number(fs.readFileSync(lockFile, 'utf8').trim());
      if (currentPid === process.pid) {
        fs.unlinkSync(lockFile);
      }
    }
  } catch (error) {
    // Ignore cleanup errors; the lock file is only a safety mechanism.
  }
}

function acquireLock() {
  try {
    if (fs.existsSync(lockFile)) {
      const existingPid = Number(fs.readFileSync(lockFile, 'utf8').trim());
      if (existingPid && existingPid !== process.pid && isProcessRunning(existingPid)) {
        console.error(`Bot already running with PID ${existingPid}. Only one instance is allowed.`);
        process.exit(1);
      }

      fs.unlinkSync(lockFile);
    }

    fs.writeFileSync(lockFile, String(process.pid), 'utf8');
  } catch (error) {
    console.error('Unable to create bot lock file:', error.message);
    process.exit(1);
  }
}

acquireLock();
process.on('exit', releaseLock);
process.on('SIGINT', () => {
  releaseLock();
  process.exit(0);
});
process.on('SIGTERM', () => {
  releaseLock();
  process.exit(0);
});

require('dotenv').config(); // reads the .env file and adds its values to process.env
const tmi = require('tmi.js'); // Twitch chat library

// Create a tmi client using the credentials read from .env.
const client = new tmi.Client({
  options: { debug: true }, // prints connection status to the console (handy during development)
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN, // must start with the "oauth:" prefix
  },
  channels: [process.env.TWITCH_CHANNEL], // which channel(s) to join
});

// connect() returns a Promise - .catch() catches it if the connection fails
// (e.g. wrong token or username) and prints a clear error instead of crashing.
client.connect().catch(error => {
  console.error('Failed to establish connection:', error);
});

// client.on('message', ...) registers an event listener.
// This function runs EVERY TIME a new message arrives in chat.
client.on('message', (channel, tags, message, self) => {
  // self is true if the bot itself sent the message - these are ignored,
  // otherwise the bot could end up reacting to its own messages endlessly.
  if (self) return;

  const text = message.trim().toLowerCase();

  // tags contains metadata about the message, e.g. the sender's display name.
  console.log(`[${channel}] ${tags['display-name']}: ${message}`);

  if (text === 'hi') {
    client.say(channel, `Hi ${tags['display-name']}!`);
  }
});