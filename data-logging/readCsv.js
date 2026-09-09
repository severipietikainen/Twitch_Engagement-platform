// readCsv.js
// First step, kept as a simple standalone example: read one CSV file,
// convert values to numbers, and print summary statistics.

const fs = require('fs');

const filePath = process.argv[2];

if (!filePath) {
  console.error('Provide a CSV file path as an argument, e.g.: node readCsv.js data.csv');
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n').filter(line => line.trim() !== '');
const headers = lines[0].split(',');

const data = [];
for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',');
  const row = {};
  headers.forEach((header, index) => {
    const value = values[index];
    row[header] = header === 'Aikaleima' ? value : Number(value);
  });
  data.push(row);
}

function sum(column) {
  return data.reduce((total, row) => total + row[column], 0);
}

const totalChatMessages = sum('Chattiviestit');
const avgViewers = sum('Katsojia keskimäärin') / data.length;
const peakViewers = Math.max(...data.map(row => row['Katsojia keskimäärin']));
const newFollowers = sum('Uudet seuraajat');
const newSubs = sum('Uudet tilaukset');

function timestampToMinutes(timestamp) {
  const [hours, minutes] = timestamp.split('.').map(Number);
  return hours * 60 + minutes;
}
const startMin = timestampToMinutes(data[0]['Aikaleima']);
const endMin = timestampToMinutes(data[data.length - 1]['Aikaleima']);
const durationMinutes = endMin - startMin;

const messagesPerViewerPerMin = totalChatMessages / (avgViewers * durationMinutes);

console.log('--- Summary ---');
console.log('Rows (minutes):', data.length);
console.log('Stream duration (min):', durationMinutes, `(${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}min)`);
console.log('Total chat messages:', totalChatMessages);
console.log('Average viewers:', avgViewers.toFixed(2));
console.log('Peak viewers (per minute):', peakViewers);
console.log('New followers:', newFollowers);
console.log('New subs:', newSubs);
console.log('Messages / viewer / min:', messagesPerViewerPerMin.toFixed(4));