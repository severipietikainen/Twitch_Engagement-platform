// csvHelper.js
// Reusable helper functions for reading a CSV file and calculating summary
// statistics from it. Other scripts import these via require() instead of
// duplicating the parsing logic.

const fs = require('fs');

// Reads one CSV file and returns an array of row objects (numbers as real Numbers).
function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',');

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((header, index) => {
      const value = values[index];
      // 'Aikaleima' (timestamp) is Twitch's own column name and stays as-is,
      // since it comes directly from the source CSV - only our own variable
      // names are translated, not the source data itself.
      row[header] = header === 'Aikaleima' ? value : Number(value);
    });
    rows.push(row);
  }
  return rows;
}

function timestampToMinutes(timestamp) {
  const [hours, minutes] = timestamp.split('.').map(Number);
  return hours * 60 + minutes;
}

// Calculates summary statistics from one parsed data array.
function calculateSummary(rows) {
  function sum(column) {
    return rows.reduce((total, row) => total + row[column], 0);
  }

  const totalChatMessages = sum('Chattiviestit');
  const avgViewers = sum('Katsojia keskimäärin') / rows.length;
  const peakViewers = Math.max(...rows.map(row => row['Katsojia keskimäärin']));
  const newFollowers = sum('Uudet seuraajat');
  const newSubs = sum('Uudet tilaukset');

  const startMin = timestampToMinutes(rows[0]['Aikaleima']);
  const endMin = timestampToMinutes(rows[rows.length - 1]['Aikaleima']);
  const durationMinutes = endMin - startMin;

  const messagesPerViewerPerMin = totalChatMessages / (avgViewers * durationMinutes);

  return {
    rowCount: rows.length,
    durationMinutes,
    totalChatMessages,
    avgViewers: Number(avgViewers.toFixed(2)),
    peakViewers,
    newFollowers,
    newSubs,
    messagesPerViewerPerMin: Number(messagesPerViewerPerMin.toFixed(4)),
  };
}

module.exports = { parseCsv, calculateSummary };
