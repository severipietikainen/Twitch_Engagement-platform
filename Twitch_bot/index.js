// index.js
// Ensimmäinen askel: yhdistetään Twitch-chattiin ja tulostetaan saapuvat viestit.

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

require('dotenv').config(); // lukee .env-tiedoston ja lisää sen arvot process.env-olioon
const tmi = require('tmi.js'); // Twitch-chat-kirjasto
 
// Luodaan tmi-asiakas (client) käyttäen .env:stä luettuja tunnistetietoja.
const client = new tmi.Client({
  options: { debug: true }, // tulostaa yhteyden tilan konsoliin (kätevä kehityksessä)
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN, // pitää alkaa "oauth:"-etuliitteellä
  },
  channels: [process.env.TWITCH_CHANNEL], // mihin kanavaan/kanaviin liitytään
});
 
// connect() palauttaa Promisen - .catch() napsii kiinni jos yhteys epäonnistuu
// (esim. väärä token tai käyttäjänimi) ja tulostaa selkeän virheen kaatumisen sijaan.
client.connect().catch(virhe => {
  console.error('Yhteyden muodostaminen epäonnistui:', virhe);
});
 
// client.on('message', ...) rekisteröi tapahtumankuuntelijan.
// Tämä funktio suoritetaan AINA kun chattiin tulee uusi viesti.
client.on('message', (channel, tags, message, self) => {
  // self on true jos viestin lähetti botti itse - ohitetaan nämä,
  // muuten botti voisi reagoida omiin viesteihinsä loputtomasti.
  if (self) return;

  const text = message.trim().toLowerCase();

  // tags sisältää metadataa viestistä, esim. lähettäjän näyttönimen.
  console.log(`[${channel}] ${tags['display-name']}: ${message}`);

  if (text === 'hi') {
    client.say(channel, `Hi ${tags['display-name']}!`);
  }
});