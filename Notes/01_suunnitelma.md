# Opinnäytetyön suunnitteludokumentti

**Työn nimi:** Pelillistetyn järjestelmän toteutus ja vaikutus katsojien sitoutumiseen vuorovaikutteisessa suoratoistossa
**Tekijä:** Severi Pietikäinen
**Päivitetty:** 14.8.2026
**Tavoiteltu palautus:** lokakuun puoliväli – marraskuun alku 2026

---

## 1. Tutkimuksen kehys: tapaustutkimuksellinen pilotti

Alkuperäinen suunnitelma kuvasi kokeellisen ennen–jälkeen-asetelman, mutta pienen ja vaihtelevan katsojamäärän (5–35, keskimäärin ~5–20) sekä pelisisällön vaihtumisen vuoksi tilastollinen päättely ei ole mielekästä. Työ kehystetään sen sijaan **tapaustutkimukselliseksi piloitiksi**.

**Mitä tämä tarkoittaa käytännössä:**

- Tutkimuskysymykset muotoillaan kuvailevasti, ei kausaalisesti.
  - *Ei:* "Miten pelillistäminen vaikuttaa katsojien sitoutumiseen?"
  - *Kyllä:* "Millaisia muutoksia katsojien aktiivisuudessa ja osallistumisessa havaitaan pelillistetyn järjestelmän käyttöönoton yhteydessä omalla Twitch-kanavalla?"
- Analyysi on kuvailevaa: trendit, prosentuaaliset muutokset, visualisoinnit. Ei tilastollisia merkitsevyystestejä (t-testi, p-arvot) — otoskoko ei riitä niiden tulkintaan luotettavasti.
- Data rikastetaan laadullisesti: omat havainnot striimaajana, katsojien spontaanit kommentit, mahdollinen kevyt palautekysely.
- Rajoitukset-luku käsittelee avoimesti: pieni/vaihteleva otos, ei satunnaisotantaa, pelisisällön vaihtuminen kesken tutkimuksen, kausivaihtelu. Tämä on odotettu ja hyväksytty osa metodologiaa AMK-tasolla, ei heikkous jota pitää piilotella.

## 2. Tutkimusasetelma: kaksi rinnakkaista tapausta

Data kerätään ja analysoidaan **pelikohtaisesti eriteltynä** (Geoguesser ja Minecraft omina osioinaan saman case-tutkimuksen sisällä). Jos samansuuntainen muutos havaitaan molemmissa peleissä, se on vahvempi havainto kuin yhden pelin tulos — vaikka tilastollista yleistettävyyttä ei silti haeta.

**Aikaikkuna (päivitetty 7.9.2026):** Twitchin CSV-arkisto ulottuu 180 päivän (n. 6 kk) taakse, mikä mahdollistaa ajallisesti symmetrisen asetelman:
- **Baseline** = 4 viikkoa välittömästi ennen pelillistetyn järjestelmän käyttöönottoa (haetaan tarvittaessa arkistosta retroaktiivisesti)
- **Interventio** = 4 viikkoa käyttöönoton jälkeen
- Molemmat eritellään pelikohtaisesti (Peli-sarake master-taulukossa)

Tämä on vahvempi asetelma kuin alun perin suunniteltu löyhempi aikataulu, koska ajallinen kuilu baseline- ja interventiodatan välillä on minimoitu.

**Mahdollinen aikataulusiirtymä kesken tutkimuksen:** Striimiaikataulu on tällä hetkellä 2 pv/vko geo + 2 pv/vko mc, ja pysyy näin ainakin 21.9.2026 asti. Siirtymä kohti 1 geo / 3 mc voi tapahtua myöhemmin, tarkkaa ajankohtaa ei tiedetä etukäteen (riippuu MC-sisällön kypsymisestä). Koska data kerätään per-stream, ei per-viikko, mahdollinen siirtymä ei vaadi rakenteellisia muutoksia — se näkyy Geoguesser-rivien vähenemisenä ja kirjataan tarkalla päivämäärällä toteutuessaan. Jos siirtymä osuu interventiojaksolle, Geoguesser-otos voi jäädä ohuemmaksi loppupäästä — käsitellään tällöin täydentävänä havaintona pääasiallisen datasetin (Minecraft ja/tai symmetrinen alkuosa) rinnalla.

**Poikkeavat striimit:** Sisällöltään poikkeavat striimit (esim. IRL-erikoisstriimi 18.–20.9.2026) suljetaan pois pää-datasetistä, koska ne eivät edusta kumpaakaan tutkittavaa peliä. Dokumentoidaan erikseen kehityspäiväkirjassa.

**Arkistodatan rooli:** n. 180 päivän / ~100 striimin arkisto toimii kontekstina/taustana (esim. nykyisten lukujen tyypillisyyden arviointiin), ei pääasiallisena vertailuaineistona — päävertailu rajataan tiukasti 4+4 viikon ikkunoihin scopen hallitsemiseksi.

**Mitattavat muuttujat (kevennetty, 2–3 mittaria):**
1. Chat-aktiivisuus suhteutettuna katsojamäärään (viestiä / katsoja / minuutti) — normalisoitu, jotta katsojamäärän vaihtelu ei vääristä vertailua
2. Keskimääräinen katseluaika
3. Osallistumisaste pelitoimintoihin (komentojen käyttäjät / kokonaiskatsojat)

## 3. Tekninen scope (kevennetty MVP)

- **Yksi** chat-komennolla käynnistettävä minipeli (ei useita erillisiä pelejä/kilpailuja)
- Yksinkertainen piste- ja tasosysteemi
- Visuaaliset badge-tunnisteet: kevyin mahdollinen toteutus tai jätetään pois, jos aika ei riitä
- Pino ennallaan: Node.js, tmi.js (Twitch-chat), WebSocket (reaaliaikainen näyttö), SQLite (tallennus), selainpohjainen UI + OBS-selainlähde, Git

### 3.1 Havainto: Twitchin oma data kattaa suuren osan baseline-tarpeesta

Twitchin Tekijäpaneeli (Analytics → Stream Summary) tarjoaa jokaiselle lähetykselle ladattavan CSV:n ("Lähetyskerta_[pvm].csv"), joka sisältää **minuuttikohtaisen** datan: katsojamäärä, chattaajat/min, chattiviestit/min, uudet seuraajat, mainoskatkot, uudet tilaukset. Tarkistettu 3.9.2026 lähetyksen datalla (206 riviä, 17:12–20:37).

**Seuraus:** erillistä reaaliaikaista chat-lokitusskriptiä ei tarvita baseline- tai perusaktiivisuusdatalle. Tämä yksinkertaistaa scopea merkittävästi.

**Tärkeä tulkintahuomio:** "Live-katsojat"-sarake ei ole samanaikaisten katsojien määrä, vaan kertyvä luku — CSV:n rivien summa täsmää dashboardin yhteenvetolukuun (esim. 102). Ei pidä sekoittaa "Katsojia keskimäärin" -sarakkeeseen, joka on todellinen per-minuutti-arvo.

**Rajoitus:** Ainutkertaiset (deduplikoidut) luvut — erilliset katsojat, erilliset chattaajat — näkyvät vain dashboardin yhteenvetonäkymässä, eivät CSV:ssä. Ne pitää kopioida käsin jokaisen streamin jälkeen.

**Käytännön datankeruuprosessi (baseline + interventio, molemmat pelit):**
1. Jokaisen streamin jälkeen: lataa "Lähetyskerta"-CSV Tekijäpaneelista, nimeä `PVM_peli_vaihe.csv` (esim. `2026-09-03_geo_baseline.csv`)
2. Kopioi dashboardin yhteenvetonäkymästä käsin: erilliset katsojat, erilliset chattaajat, huippukatsojat, uudet seuraajat, uudet tilaukset → pieni master-loki (yksi rivi per stream)
3. Interventiovaiheessa: minipelin komentojen käyttödata tulee suoraan MVP-järjestelmän omasta SQLite-tietokannasta, ei vaadi erillistä lokitusta

## 4. Rajaukset ja tiedostetut riskit

- Geoguesser-interventiodata jää suppeaksi (~3 streamia, 1 pv/vko x 3 vko) → tulkitaan varovaisesti, ei vahvoja johtopäätöksiä pelkän Geoguesser-datan perusteella
- Katsojamäärän luonnollinen vaihtelu (esim. turnaukset) voi näkyä datassa riippumatta järjestelmästä → dokumentoidaan poikkeavat streamit (esim. turnauspäivät) erikseen, jotta ne voidaan tarvittaessa rajata pois analyysistä tai käsitellä omana huomiona
- Sisältöstrategian muutos (peli, aikataulu) on itsessään sekoittava tekijä → raportoidaan läpinäkyvästi rajoituksena

---

*Tämä dokumentti päivittyy projektin edetessä. Seuraava osio: aikataulu (02_aikataulu.md).*
