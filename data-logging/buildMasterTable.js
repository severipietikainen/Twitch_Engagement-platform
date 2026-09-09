// buildMasterTable.js
// Walks through every CSV file in a data folder and combines them into one
// master table.
//
// FILENAME MUST FOLLOW THE PATTERN: date_game_phase.csv
// e.g. 2026-09-03_geo_baseline.csv   or   2026-09-14_mc_intervention.csv
//
// Usage: node buildMasterTable.js data master_table.csv

const fs = require('fs');
const path = require('path');
const { parseCsv, calculateSummary } = require('./csvHelper.js');

const dataFolder = process.argv[2] || './data';
const outputFile = process.argv[3] || 'master_table.csv';

const files = fs.readdirSync(dataFolder).filter(name => name.endsWith('.csv'));

if (files.length === 0) {
  console.error(`No .csv files found in folder: ${dataFolder}`);
  process.exit(1);
}

const rows = [];

for (const fileName of files) {
  // Parse date, game and phase out of the filename.
  // "2026-09-03_geo_baseline.csv" -> replace strips ".csv", split('_') breaks it into parts
  const parts = fileName.replace('.csv', '').split('_');
  let date = 'UNKNOWN', game = 'UNKNOWN', phase = 'UNKNOWN';
  if (parts.length === 3) {
    [date, game, phase] = parts;
  } else {
    console.warn(`Warning: "${fileName}" doesn't match the pattern date_game_phase.csv — fill in Game/Phase manually in the table.`);
  }

  const fullPath = path.join(dataFolder, fileName);
  const data = parseCsv(fullPath);
  const summary = calculateSummary(data);

  rows.push({
    Date: date,
    Game: game,
    Phase: phase,
    DurationMin: summary.durationMinutes,
    AvgViewers: summary.avgViewers,
    PeakViewersPerMin: summary.peakViewers,
    ChatMessages: summary.totalChatMessages,
    MessagesPerViewerPerMin: summary.messagesPerViewerPerMin,
    NewFollowersCsv: summary.newFollowers,
    NewSubsCsv: summary.newSubs,
    // These are NOT included in Twitch's CSV export - fill in manually from
    // the dashboard summary view (see 01_suunnitelma.md, section 3.1):
    UniqueViewers: '',
    UniqueChatters: '',
    SourceFile: fileName,
  });
}

// Write all rows out as one CSV file.
const columnHeaders = Object.keys(rows[0]);
const csvLines = [columnHeaders.join(',')];
for (const row of rows) {
  csvLines.push(columnHeaders.map(header => row[header]).join(','));
}
fs.writeFileSync(outputFile, csvLines.join('\n'), 'utf-8');

console.log(`Done! ${rows.length} streams processed -> ${outputFile}`);
console.log('Remember to fill in manually: UniqueViewers and UniqueChatters columns from the Twitch dashboard.');
