// lue_csv.js
// Toinen askel: numeroiksi muunto + yhteenvetoluvut (summat, keskiarvot, kesto).
 
const fs = require('fs');
 
const tiedostopolku = process.argv[2];
 
if (!tiedostopolku) {
  console.error('Anna CSV-tiedoston polku parametrina, esim: node lue_csv.js data.csv');
  process.exit(1);
}
 
const sisalto = fs.readFileSync(tiedostopolku, 'utf-8');
const rivit = sisalto.split('\n').filter(rivi => rivi.trim() !== '');
const otsikot = rivit[0].split(',');
 
// Rakennetaan taulukko olioita, JOSSA luvut ovat oikeasti numeroita (Number),
// ei tekstiä ('1' !== 1 JavaScriptissä laskutoimituksissa).
const data = [];
for (let i = 1; i < rivit.length; i++) {
  const arvot = rivit[i].split(',');
  const rivi = {};
  otsikot.forEach((otsikko, index) => {
    const arvo = arvot[index];
    if (otsikko === 'Aikaleima') {
      rivi[otsikko] = arvo; // aikaleima jätetään tekstiksi (esim. "17.12")
    } else {
      rivi[otsikko] = Number(arvo); // muut sarakkeet muunnetaan numeroiksi
    }
  });
  data.push(rivi);
}
 
// --- Yhteenvetolukujen laskenta ---
 
// reduce() käy taulukon läpi ja kasaa yhden arvon (tässä: summan).
// Aloitusarvo on 0, ja joka kierroksella lisätään nykyisen rivin arvo summaan.
function summaa(sarake) {
  return data.reduce((summa, rivi) => summa + rivi[sarake], 0);
}
 
function keskiarvo(sarake) {
  return summaa(sarake) / data.length;
}
 
const chattiviestitYhteensa = summaa('Chattiviestit');
const katsojatKeskiarvo = keskiarvo('Katsojia keskimäärin');
const katsojatHuippu = Math.max(...data.map(rivi => rivi['Katsojia keskimäärin']));
const uudetSeuraajatYhteensa = summaa('Uudet seuraajat');
const uudetTilauksetYhteensa = summaa('Uudet tilaukset');
 
// Streamin kesto: ensimmäinen ja viimeinen aikaleima, esim. "17.12" -> tunnit.minuutit
function aikaleimaMinuutteina(aikaleima) {
  const [tunnit, minuutit] = aikaleima.split('.').map(Number);
  return tunnit * 60 + minuutit;
}
const alkuMin = aikaleimaMinuutteina(data[0]['Aikaleima']);
const loppuMin = aikaleimaMinuutteina(data[data.length - 1]['Aikaleima']);
const kestoMinuutteina = loppuMin - alkuMin;
 
// Normalisoitu mittari: chattiviestejä / katsoja / minuutti
// Tämä on se mittari jota suunnitelmassa käytetään, koska se ei vääristy katsojamäärän mukana.
const viestitPerKatsojaPerMin = chattiviestitYhteensa / (katsojatKeskiarvo * kestoMinuutteina);
 
console.log('--- Yhteenveto ---');
console.log('Rivejä (minuutteja):', data.length);
console.log('Streamin kesto (min):', kestoMinuutteina, `(${Math.floor(kestoMinuutteina / 60)}h ${kestoMinuutteina % 60}min)`);
console.log('Chattiviestejä yhteensä:', chattiviestitYhteensa);
console.log('Katsojia keskimäärin:', katsojatKeskiarvo.toFixed(2));
console.log('Katsojia enimmillään (per minuutti):', katsojatHuippu);
console.log('Uusia seuraajia:', uudetSeuraajatYhteensa);
console.log('Uusia tilauksia:', uudetTilauksetYhteensa);
console.log('Chattiviestejä / katsoja / min:', viestitPerKatsojaPerMin.toFixed(4));