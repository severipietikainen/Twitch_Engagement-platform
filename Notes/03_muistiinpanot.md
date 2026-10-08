# Kehityspäiväkirja / muistiinpanot

Tämä dokumentti kerää projektin aikana tehdyt merkittävät päätökset perusteluineen — käytetään lähdeaineistona opinnäytetyön menetelmä- ja toteutuslukuja kirjoitettaessa. Jokainen merkintä kirjataan heti päätöksen yhteydessä, ei jälkikäteen muistista.

**Merkinnän rakenne:** Päivämäärä · Aihe · Päätös · Perustelu · Hylätyt vaihtoehdot · (Lähde/todiste jos on)

---

### 3.9.2026 — Baseline-datan keräystapa

**Päätös:** Twitchin Tekijäpaneelin "Stream Summary" -CSV-vienti kattaa suurimman osan baseline-datan tarpeesta; erillistä reaaliaikaista tmi.js-pohjaista chat-lokitusskriptiä ei rakenneta baseline-vaihetta varten.

**Perustelu:** Ladattu CSV (3.9.2026 lähetys, 206 riviä, 17:12–20:37) sisältää valmiiksi minuuttikohtaisen datan katsojamäärästä, chattaajista ja chattiviesteistä. Tarkistettu laskemalla: chattiviestejä yhteensä 279, "Katsojia keskimäärin" ka. ~5,7 täsmää dashboardin ilmoittamaan lukuun.

**Hylätty vaihtoehto:** oma reaaliaikainen chat-kuuntelija (tmi.js) baseline-datan keräämiseen — tarpeeton, koska Twitch tarjoaa saman datan valmiiksi jäsenneltynä.

**Rajoite kirjattava:** ainutkertaiset luvut (erilliset katsojat, erilliset chattaajat) eivät sisälly CSV:hen, vain dashboardin yhteenvetonäkymään — kerätään käsin per stream.

---

### 4.9.2026 — Lokitus-/analyysiskriptin kieli ja työkalut

**Päätös:** CSV-jäsennys- ja aggregointiskripti toteutetaan Node.js:llä (JavaScript), samalla teknologialla kuin MVP-järjestelmä. Editori VS Code.

**Perustelu:** Koko tekninen toteutus (lokitus + MVP) nojaa yhteen teknologiaan, mikä yksinkertaistaa perusteluja opinnäytetyön toteutusluvussa ja hyödyntää jo opittua tmi.js/Node-osaamista. CSV-data on rakenteeltaan yksinkertainen (ei sisäkkäisiä erikoismerkkejä), joten Node.js:n sisäänrakennettu `fs`-moduuli riittää ilman ulkopuolisia kirjastoja.

**Hylätty vaihtoehto:** Python + pandas — teknisesti toimiva ja CSV-analyysissä yleinen valinta, mutta olisi tuonut projektiin toisen kieliekosysteemin ilman selkeää hyötyä, koska data on yksinkertaista eikä vaadi pandasin raskaampia työkaluja.

---

### 4.9.2026 — Master-taulukon rakenne ja skriptin toimivuuden varmistus

**Päätös:** `csv_apuri.js` (moduuli) + `kokoa_taulukko.js` (pääskripti) toteutettu ja testattu. Skripti käy läpi kansiollisen CSV-tiedostoja, purkaa pelin/vaiheen/päivämäärän tiedostonimestä (muoto `pvm_peli_vaihe.csv`) ja kokoaa yhden master-taulukon.

**Varmistus:** Ajettiin skripti sekä itse että käyttäjän toimesta samalla oikealla datalla (4 baseline-streamia, 31.8.–3.9.2026) — tulokset täsmäsivät rivilleen. Ensimmäiset baseline-luvut: Geoguesser ka. katsojat 11,4–14,2 (huippu 19–22), Minecraft ka. katsojat 5,7–7,0 (huippu 11–14). Chattiviestejä/katsoja/min vaihteli 0,159–0,300 välillä jo pelkässä baseline-datassa — antaa käsityksen luonnollisesta vaihteluvälistä ennen interventiota.

**Havainto joka pitää huomioida analyysissä:** Geoguesser vetää selvästi enemmän katsojia kuin Minecraft tässä vaiheessa — pelin vaihto ei siis ole neutraali muuttuja, korostaa pelikohtaisen erittelyn tärkeyttä (ks. 01_suunnitelma.md kohta 2).

---

### 7.9.2026 — Baseline/interventio-ikkunan tarkennus: arkistodatan hyödyntäminen

**Päätös:** Baseline-ikkunaksi määritellään **4 viikkoa välittömästi ennen** pelillistetyn järjestelmän käyttöönottoa, ja interventioikkunaksi **4 viikkoa käyttöönoton jälkeen** — molemmat pelikohtaisesti eriteltyinä. Baseline-data haetaan tarvittaessa retroaktiivisesti Twitchin CSV-arkistosta, ei vain eteenpäin kerättynä.

**Perustelu:** Twitch säilyttää "Lähetyskerta"-CSV:t 180 päivän ajan (n. 6 kk) — havaittu n. 100 striimin arkisto tällä säilytysikkunalla. Tämä mahdollistaa ajallisesti tarkasti symmetrisen ennen/jälkeen-asetelman ilman alkuperäisen suunnitelman aikakuilua (baseline kerätty hyvissä ajoin ennen MVP:n valmistumista, interventio vasta viikkoja myöhemmin). Tiukasti 4+4 viikon ikkuna vähentää kausivaihtelun ja muun ajan myötä tapahtuvan muutoksen vaikutusta verrattuna löyhempään asetelmaan.

**Rajattu käyttö:** n. 180 päivän arkistodataa käytetään vain kontekstina/taustana (esim. osoittamaan nykyisten katsojalukujen tyypillisyys), ei pääasiallisena vertailudatana — päävertailu pysyy tiukasti 4+4 viikon ikkunoissa, jotta analyysin scope ei kasva hallitsemattomasti.

**Poikkeavat striimit:** IRL-erikoisstriimi (18.–20.9.2026, risteily) suljetaan pois pää-datasetistä (ei geo eikä mc -sisältöä). Dokumentoidaan erikseen; jos vastaava erikoisstriimi osuu interventiojaksolle, käsitellään erillisenä täydentävänä havaintona, ei osana päävertailua.

**Avoin riski:** 1 geo / 3 mc -aikataulusiirtymän tarkkaa ajankohtaa ei tiedetä (riippuu striimaajan omasta arviosta MC-sisällön valmiudesta) — varmistettu vain että seuraavat 2 viikkoa (n. 21.9. asti) pysytään 2x2-jaossa. Koska master-taulukko on jo rakenteeltaan per-stream eikä per-viikko, mahdollinen siirtymä kesken interventiojakson ei vaadi rakenteellisia muutoksia — se vain näkyy Geoguesser-rivien vähenemisenä siitä pisteestä eteenpäin, ja kirjataan tarkalla päivämäärällä sitten kun se tapahtuu.

**Aikataulun sivuvaikutus huomioitava:** interventioikkuna pidentyi alkuperäisestä 3 viikosta 4 viikkoon → 02_aikataulu.md vaiheiden 3–4 rajapäivät tarkistettava kun MVP:n valmistumispäivä (käyttöönottopäivä) tarkentuu.

---

### 8.9.2026 — Ensimmäinen onnistunut päästä-päähän-testi botilla

**Vahvistettu:** Botti muodosti onnistuneesti yhteyden Twitch-chattiin oikealla OAuth-tokenilla livestriimin aikana (7.9.2026) ja vastasi testikomentoon ("Hi") reaaliajassa katsojalle näkyvästi.

**Merkitys:** Tämä vahvistaa että koko tekninen perusketju toimii tuotanto-olosuhteissa, ei vain paikallisessa testauksessa: autentikointi (OAuth-token) → tmi.js-yhteys → tapahtumankuuntelu (`client.on('message')`) → viestin lähetys takaisin (`client.say`). Tälle ketjulle rakennetaan jatkossa varsinainen minipeli ja pistesysteemi.

**Itsenäisesti lisätty ominaisuus:** PID-pohjainen lukitusmekanismi (`.bot.lock`-tiedosto + `stop-bot.js`-apuskripti), joka estää useamman bottiprosessin jäämisen päällekkäin ajoon taustalle. Tarkistaa `process.kill(pid, 0)`-kutsulla onko aiempi PID yhä elossa ennen uuden lukon kirjoittamista; siivoaa jämähtäneen lukon automaattisesti jos prosessi ei enää ole käynnissä. Toteutettu kokonaan itsenäisesti (ei tekoälyn tuottamaa) — ks. 04_tekoalyn_kaytto_loki.md, ei kirjattava sinne koska ei tekoälyavusteista.

**Datapäivitys:** 7.9.2026 striimin data lisätty master-taulukkoon (baseline jatkuu).

---

### 8.9.2026 — Versionhallinnan käyttöönotto (Git, komentorivi)

**Päätös:** Molemmat tekniset osat (lokitusskripti + botti) yhdistettiin yhteen Git-repositorioon (`Twitch_Ecosystem`) erillisten repositorioiden sijaan, koska ne kuuluvat saman opinnäytetyön samaan tekniseen toteutukseen.

**Turvallisuusongelma ja korjaus:** Ensimmäisessä commit-yrityksessä `.env`-tiedosto (sisältää Twitch-botin OAuth-tokenin) ja koko `node_modules`-kansio päätyivät vahingossa versionhallintaan. Juurisyy: `.gitignore`-tiedosto oli tallentunut nimellä `gitignore` (piste puuttui alusta), jolloin Git ei tunnistanut sitä ohitussäännöksi. Koska mitään ei ollut vielä pushattu GitHubiin, korjaus tehtiin poistamalla paikallinen `.git`-historia kokonaan (`Remove-Item -Recurse -Force .git`), korjaamalla tiedostonimi, ja alustamalla repo uudelleen puhtaalta pöydältä. Jälkikäteen `git status` tarkistettiin ennen uutta committia, jottei sama virhe toistuisi.

**Opittu asia:** Tiedostopäätteiden piilottaminen Windowsin Resurssienhallinnassa on riskitekijä juuri tämäntyyppisille pisteellä alkaville tiedostoille (`.gitignore`, `.env`) — tiedostopääte kannattaa aina näyttää näkyviin kun tällaisia tiedostoja luodaan.

**GitHub-autentikointi:** `git push` epäonnistui aluksi virheeseen "Password authentication is not supported" — GitHub ei ole hyväksynyt salasanapohjaista autentikointia vuodesta 2021 lähtien. Ratkaisu: Personal Access Token (PAT) luotiin GitHubin Developer Settings -valikosta `repo`-oikeuksin, ja sitä käytettiin salasanan sijaan push-komennon yhteydessä. Push onnistui tämän jälkeen (`Twitch_Engagement-platform`-repositorio GitHubissa).

---

### 8.9.2026 — Nimeämiskäytäntö: siirtymä englanninkielisiin tunnisteisiin

**Päätös:** Koodin muuttuja-, funktio-, tiedosto- ja kansionimet siirretään suomesta englantiin (esim. `lueJaJasenna` → `parseCSV`), vaikka itse opinnäytetyöteksti pysyy suomeksi.

**Perustelu:** Yleinen käytäntö ohjelmistokehityksessä kielestä riippumatta; kirjastojen (tmi.js ym.) API on englanniksi, mikä sekoittuu huonosti suomenkielisiin tunnisteisiin ("Finglish"). Ei-ASCII-merkit (ä, ö) olivat jo aiheuttaneet käytännön ongelmia (esim. Twitch-CSV-tiedostonimien lainausmerkkitarve terminaalissa). Englanninkieliset tunnisteet ovat myös ymmärrettävämpiä mahdollisessa portfoliokäytössä.

**Poikkeus:** Kehityspäiväkirja, tekoälyn käytön loki ja itse opinnäytetyöteksti pysyvät suomeksi. Twitchin CSV-sarakeotsikot (esim. "Katsojia keskimäärin") pysyvät sellaisenaan lähdedatan mukaisina, mutta niihin viittaavat muuttujanimet koodissa kirjoitetaan englanniksi.

---

### 8.9.2026 — Nimeämiskäytännön toteutus + Metropolian ohjeiden tarkistus

**Vahvistus:** Ennen uudelleennimeämistä tarkistettiin ettei Metropolian opinnäytetyöohjeissa ole erillistä vaatimusta koodin kielestä — muodollinen suomenkielisyysvaatimus koskee vain itse opinnäytetyötekstiä ja tiivistelmää, ei teknistä toteutusta. Koodin kieli on siis vapaasti valittavissa ammattikäytännön mukaan.

**Toteutus:** Lokitusskriptit käännetty: `csv_apuri.js` → `csvHelper.js`, `kokoa_taulukko.js` → `buildMasterTable.js`, `lue_csv.js` → `readCsv.js`. Kaikki funktiot, muuttujat ja kommentit englanniksi. Master-taulukon sarakeotsikot käännetty (esim. `Katsojat_ka` → `AvgViewers`). Testattu samalla oikealla datalla kuin alkuperäiset versiot — tulokset täsmäävät täydellisesti, kääntäminen ei muuttanut logiikkaa. Kansio nimetty `data-logging`, botti-kansiossa `index.js`:n kommentit ja muuttuja (`virhe`→`error`) käännetty samalla periaatteella.

**Huomio:** Botin `index.js`:ssä käyttäjän itse kirjoittamat funktiot (`isProcessRunning`, `releaseLock`, `acquireLock`) olivat jo valmiiksi englanniksi — ei vaatinut muutosta.

**Poikkeus säilyy:** Twitchin CSV-lähdedatan sarakeotsikot (`Aikaleima`, `Katsojia keskimäärin` jne.) pysyvät suomeksi koodissa, koska ne tulevat suoraan ulkoisesta lähteestä eikä niitä voi/kannata muuttaa — vain niihin viittaavat omat muuttujanimet käännettiin.

**Tekninen huomio Git-historian kannalta:** uudelleennimeäminen tehtiin `git mv`-komennolla suoran poisto+uudelleenluonnin sijaan, jotta Git tunnistaa muutoksen nimenvaihdoksi eikä kokonaan uudeksi tiedostoksi — säilyttää tiedostokohtaisen historian jäljitettävyyden. Git-repositorio: `Twitch_Ecosystem` (`severipietikainen/Twitch_Engagement-platform` GitHubissa), kansiot `data-logging/` + botti-kansio.

---

### 24.9.2026 — Tietokantateknologian valinta: SQLite vs. MySQL/PostgreSQL, mitattu vertailu

**Päätös:** `node:sqlite` (Node.js:n sisäänrakennettu SQLite-tuki) valitaan botin tietokantaratkaisuksi PostgreSQL/MySQL:n sijaan.

**Perustelu:** Projektin arkkitehtuuri on yksi kanava, yksi Node.js-prosessi yhdellä koneella — ei useita samanaikaisia kirjoittajia eri palvelimilta, mikä on se skenaario jota varten asiakas-palvelin-tietokannat (MySQL/PostgreSQL, kuten esim. StreamElementsin kaltaiset monikanavaiset SaaS-palvelut todennäköisesti käyttävät satojentuhansien kanavien palvelemiseen) on suunniteltu.

**Mitattu näyttö (benchmark, in-memory SQLite, node:sqlite):** Simuloitiin käyttäjän oman kanavan nykyinen StreamElements-leaderboard-koko (995 erillistä pisteiden haltijaa):
- 995 käyttäjän lisäys tietokantaan: 2,60 ms yhteensä
- Leaderboard-kysely (top 10 / 995 käyttäjästä, `ORDER BY total_points DESC LIMIT 10`): 0,12 ms
- Yhden käyttäjän XP-päivitys (vastaa yhtä minipelikierrosta): 0,06 ms

**Tulkinta:** Kaikki operaatiot mikrosekuntiluokkaa — käyttäjämäärän kymmenkertaistuminen ei tuottaisi havaittavaa viivettä. Pullonkaulaksi ei muodostu tietokanta vaan Twitchin oma chat-viestirajoitus.

**Milloin SQLite ei enää riittäisi (ei koske nykyistä projektia):** useampi erillinen prosessi/palvelin kirjoittamassa samaan tietokantaan yhtä aikaa (esim. erikseen isännöity web-dashboard + botti eri koneilla), tarve replikoinnille/vaakaskaalaukselle, tai monikanavainen SaaS-mittakaava (StreamElementsin kaltainen palvelu monelle eri striimaajalle samanaikaisesti).

**Hylätty vaihtoehto:** PostgreSQL/MySQL — teknisesti toimiva mutta ylimitoitettu: toisi mukanaan palvelinprosessin asennuksen/ylläpidon ja verkkoyhteyksien hallinnan ilman mitattavaa hyötyä tässä mittakaavassa. Sama ylimitoituksen välttämisen periaate kuin Unity-RPG-vision rajaamisessa MVP:n ulkopuolelle.

---

### 24.9.2026 — Jatkokehitysidea: Twitch Bits/Subs → kiinteät pisteet (ei toteuteta nyt)

**Idea (ei osa nykyistä toteutusta):** Twitch EventSub -integraatio, joka kuuntelisi Bits-lahjoituksia ja tilauksia (subs) ja palkitsisi niistä kiinteän, ennalta määrätyn pistemäärän (esim. 1 bitti = 1 piste, 1 sub = 1000 pistettä).

**Tärkeä rajaus:** Nämä pisteet olisivat **erillään** minipelien tuurista riippuvista palkinnoista (esim. kolikkopelin jackpot) — kiinteä muunnossuhde, ei satunnaisuutta. Tämä erottaa mekaniikan selkeästi uhkapelaamisen kaltaisesta "maksa saadaksesi mahdollisuuden voittaa" -asetelmasta, koska maksusta seuraa aina sama, ennalta tiedetty pistemäärä.

**Ei toteuteta:** PayPal/Stripe-integraatiota ei haeta — Twitchin oma EventSub hoitaisi koko maksuprosessin ja sääntely-yhteensopivuuden, botti vain kuuntelisi webhookia eikä koskaan käsittelisi maksudataa suoraan.

**Status:** Mainitaan opinnäytetyön jatkokehitysehdotukset-osiossa, ei sisällytetä nykyiseen MVP:hen (rajattu pois aikataulusyistä, kuten aiemmin Unity-RPG-visio).

---

*Seuraava merkintä lisätään kun SQLite-skeema ja pelimoottori on tuotu käyttäjän omalle koneelle ja testattu siellä.*
