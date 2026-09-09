// csv_apuri.js
// Tämä on "moduuli": tiedosto joka sisältää uudelleenkäytettäviä funktioita.
// Sama koodi kuin edellisessä vaiheessa (lue_csv.js), mutta pakattu funktioiksi
// jotta useampi skripti voi käyttää samaa logiikkaa kopioimatta koodia.

const fs = require('fs');

// Lukee yhden CSV-tiedoston ja palauttaa taulukon olioita (numerot oikeina lukuina).
function lueJaJasenna(tiedostopolku) {
  const sisalto = fs.readFileSync(tiedostopolku, 'utf-8');
  const rivit = sisalto.split('\n').filter(rivi => rivi.trim() !== '');
  const otsikot = rivit[0].split(',');

  const data = [];
  for (let i = 1; i < rivit.length; i++) {
    const arvot = rivit[i].split(',');
    const rivi = {};
    otsikot.forEach((otsikko, index) => {
      const arvo = arvot[index];
      rivi[otsikko] = otsikko === 'Aikaleima' ? arvo : Number(arvo);
    });
    data.push(rivi);
  }
  return data;
}

function aikaleimaMinuutteina(aikaleima) {
  const [tunnit, minuutit] = aikaleima.split('.').map(Number);
  return tunnit * 60 + minuutit;
}

// Laskee yhteenvetoluvut yhdestä jäsennetystä datataulukosta.
function laskeYhteenveto(data) {
  function summaa(sarake) {
    return data.reduce((summa, rivi) => summa + rivi[sarake], 0);
  }

  const chattiviestitYhteensa = summaa('Chattiviestit');
  const katsojatKeskiarvo = summaa('Katsojia keskimäärin') / data.length;
  const katsojatHuippu = Math.max(...data.map(rivi => rivi['Katsojia keskimäärin']));
  const uudetSeuraajatYhteensa = summaa('Uudet seuraajat');
  const uudetTilauksetYhteensa = summaa('Uudet tilaukset');

  const alkuMin = aikaleimaMinuutteina(data[0]['Aikaleima']);
  const loppuMin = aikaleimaMinuutteina(data[data.length - 1]['Aikaleima']);
  const kestoMinuutteina = loppuMin - alkuMin;

  const viestitPerKatsojaPerMin = chattiviestitYhteensa / (katsojatKeskiarvo * kestoMinuutteina);

  return {
    rivienMaara: data.length,
    kestoMinuutteina,
    chattiviestitYhteensa,
    katsojatKeskiarvo: Number(katsojatKeskiarvo.toFixed(2)),
    katsojatHuippu,
    uudetSeuraajatYhteensa,
    uudetTilauksetYhteensa,
    viestitPerKatsojaPerMin: Number(viestitPerKatsojaPerMin.toFixed(4)),
  };
}

// module.exports kertoo mitkä funktiot tästä tiedostosta ovat muiden käytettävissä
// require()-komennolla. Ilman tätä muut tiedostot eivät pääsisi käsiksi näihin.
module.exports = { lueJaJasenna, laskeYhteenveto };
