// kokoa_taulukko.js
// Käy läpi kaikki CSV-tiedostot data-kansiossa ja kokoaa niistä yhden master-taulukon.
//
// TIEDOSTONIMEN PITÄÄ NOUDATTAA MUOTOA: pvm_peli_vaihe.csv
// esim. 2026-09-03_geo_baseline.csv  tai  2026-09-14_mc_interventio.csv
// (peli: geo/mc, vaihe: baseline/interventio — nimeä tiedostot uudelleen Twitchistä ladattuasi)
//
// Käyttö: node kokoa_taulukko.js data master_taulukko.csv

const fs = require('fs');
const path = require('path'); // path-moduuli yhdistää kansio- ja tiedostopolkuja käyttöjärjestelmästä riippumattomasti
const { lueJaJasenna, laskeYhteenveto } = require('./csv_apuri.js'); // tuodaan omat funktiot edellisestä tiedostosta

const dataKansio = process.argv[2] || './data'; // jos ei annettu, oletetaan "data"-kansio
const tulostiedosto = process.argv[3] || 'master_taulukko.csv';

// readdirSync listaa kaikki tiedostot kansiosta, filter jättää vain .csv-päätteiset
const tiedostot = fs.readdirSync(dataKansio).filter(nimi => nimi.endsWith('.csv'));

if (tiedostot.length === 0) {
  console.error(`Ei löytynyt .csv-tiedostoja kansiosta: ${dataKansio}`);
  process.exit(1);
}

const rivit = [];

for (const tiedostonNimi of tiedostot) {
  // Puretaan tiedostonimestä päivämäärä, peli ja vaihe.
  // "2026-09-03_geo_baseline.csv" -> replace poistaa ".csv", split('_') pilkkoo osiin
  const osat = tiedostonNimi.replace('.csv', '').split('_');
  let pvm = 'TUNTEMATON', peli = 'TUNTEMATON', vaihe = 'TUNTEMATON';
  if (osat.length === 3) {
    [pvm, peli, vaihe] = osat; // destrukturointi: 3 osaa 3 muuttujaan kerralla
  } else {
    console.warn(`Varoitus: "${tiedostonNimi}" ei noudata muotoa pvm_peli_vaihe.csv — täytä Peli/Vaihe käsin taulukkoon.`);
  }

  const kokoPolku = path.join(dataKansio, tiedostonNimi);
  const data = lueJaJasenna(kokoPolku);
  const yhteenveto = laskeYhteenveto(data);

  rivit.push({
    Paivamaara: pvm,
    Peli: peli,
    Vaihe: vaihe,
    Kesto_min: yhteenveto.kestoMinuutteina,
    Katsojat_ka: yhteenveto.katsojatKeskiarvo,
    Katsojat_huippu_permin: yhteenveto.katsojatHuippu,
    Chattiviestit: yhteenveto.chattiviestitYhteensa,
    Viestit_per_katsoja_per_min: yhteenveto.viestitPerKatsojaPerMin,
    Uudet_seuraajat_csv: yhteenveto.uudetSeuraajatYhteensa,
    Uudet_tilaukset_csv: yhteenveto.uudetTilauksetYhteensa,
    // Nämä EIVÄT sisälly Twitchin CSV-vientiin - täytettävä käsin dashboardin
    // yhteenvetonäkymästä jokaisen streamin jälkeen (ks. 01_suunnitelma.md, kohta 3.1):
    Erilliset_katsojat: '',
    Erilliset_chattaajat: '',
    Lahdetiedosto: tiedostonNimi,
  });
}

// Kirjoitetaan kaikki rivit yhdeksi CSV-tiedostoksi.
const sarakeOtsikot = Object.keys(rivit[0]); // ottaa ensimmäisen rivin avaimet otsikoiksi
const csvRivit = [sarakeOtsikot.join(',')]; // ensimmäinen rivi = otsikot
for (const rivi of rivit) {
  csvRivit.push(sarakeOtsikot.map(otsikko => rivi[otsikko]).join(','));
}
fs.writeFileSync(tulostiedosto, csvRivit.join('\n'), 'utf-8');

console.log(`Valmis! ${rivit.length} streamia käsitelty -> ${tulostiedosto}`);
console.log('Muista täyttää käsin: Erilliset_katsojat ja Erilliset_chattaajat -sarakkeet Twitchin dashboardilta.');
