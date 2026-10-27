// index.js
// First step: connect to Twitch chat and print incoming messages.

const fs = require('fs');
const path = require('path');

const lockFile = path.join(__dirname, '.bot.lock');
const database = require('./db'); // Import the database module

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

  
  const commands = new Map(); 
  commands.set('hello', handleHello);
  commands.set('points', handlePoints);
  commands.set('givepoints', handleGivePoints);

  function handlePoints(channel, tags, args) {
    const username = tags.username;
    const user = database.createOrGetUser(username);
    client.say(channel, `${username}, you have ${user.total_points} points and ${user.total_xp} XP.`);
  }

  function handleGivePoints(channel, tags, args) {
    const username = tags.username;
    const [target, amountText] = args;
    const amount = Number(amountText);    
    
    if (username.toLowerCase() !== process.env.TWITCH_CHANNEL.toLowerCase()) {
      
      return;
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      client.say(channel, `${username}, please provide a valid positive integer for the points.`);
      return;
    }

    const cleantarget = target.replace('@', ''); // Remove @ if the user mentioned someone
    const updatedUser = database.addUserPoints(cleantarget, amount);

    if (updatedUser === null) {
      client.say(channel, `${username}, user ${cleantarget} not found in the database.`);
      return;
    }
    client.say(channel, `${cleantarget} has been given ${amount} points. They now have ${updatedUser.total_points} points`);
  }

  function handleHello(channel, tags, args) {
    
      client.say(channel, `Hello, ${tags['display-name']}! You have set a command`);
    
  }






// client.on('message', ...) registers an event listener.
// This function runs EVERY TIME a new message arrives in chat.
client.on('message', (channel, tags, message, self) => {
  // self is true if the bot itself sent the message - these are ignored,
  // otherwise the bot could end up reacting to its own messages endlessly.
  if (self) return;

  const text = message.trim().toLowerCase();
  const command = text.startsWith('!') ? text.split(' ')[0] : null; // the first word is the command, the rest are arguments
  console.log(`[${channel}] ${tags['display-name']}: ${message}`);


  if (!command) {
    return; // not a command, ignore it
  }

  const [word, ...args] = text.split(/\s+/);
  const name = word.slice(1);
  const handler = commands.get(name);  
  

  if (!handler) {
    return; // no handler for this command, ignore it
  }

  try {
  handler(channel, tags, args);
  } catch (error) {
  console.error('Command failed:', name, error);
  }


});

client.connect().catch(error => {
  console.error('Failed to establish connection:', error);
});






 


  

 
  
  








