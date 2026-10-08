# Aikataulu (14.8.2026 → viikko 26.10.–1.11.2026)

Lähtökohdat: ~3h/pv, striimit 4 pv/vko (2-4h), siirtymä 2 geo/2 mc → 1 geo/3 mc lähiviikkoina.

## Vaihe 1 — Lokitus + baseline käynnistys (vko 17.–30.8., 2 vko)
- Rakennetaan kevyt lokitusskripti (katsojamäärä, chat-viestit/min) — ei vaadi vielä pelillistettyä järjestelmää
- **Kiireellistä:** Geoguesser-baseline kerätään NYT nykyisellä 2 pv/vko -tahdilla, ennen kuin aikataulu siirtyy 1 pv/vko:hon
- Minecraft-baseline kerätään rinnalla
- MVP-järjestelmän koodaus alkaa (Node.js-runko, tmi.js-integraatio)

## Vaihe 2 — Baseline jatkuu + MVP valmis (vko 31.8.–13.9., 2 vko)
- Aikataulusiirtymä 1 geo / 3 mc tapahtuu tässä ikkunassa — huomioidaan datan aikaleimoissa
- MVP: yksi minipeli + piste/taso-systeemi + WebSocket-näyttö valmiiksi ja testattu OBS:ssä

## Vaihe 3 — Interventio, datan keruu (vko 14.9.–4.10., 3 vko)
- Järjestelmä käyttöön molemmissa peleissä
- Minecraft: 3 pv/vko × 3 vko ≈ 9 streamia (pääasiallinen datasetti)
- Geoguesser: 1 pv/vko × 3 vko ≈ 3 streamia (täydentävä, tulkitaan varovaisesti)
- Poikkeavat streamit (esim. turnaukset) merkitään erikseen

## Vaihe 4 — Analyysi ja kirjoitus (vko 5.10.–25.10., 3 vko)
- Datan puhdistus ja kuvaileva analyysi (trendit, %-muutokset, visualisoinnit)
- Opinnäytetyön runko-osien kirjoitus: johdanto, teoria, menetelmä, tekninen toteutus, tulokset

## Vaihe 5 — Viimeistely ja puskuri (vko 26.10.–1.11., 1 vko)
- Oikoluku, viimeistely, ohjaajan kommenttien käsittely
- Puskuri viivästyksille

**Kriittiset riskikohdat:**
1. Jos MVP viivästyy vaiheessa 2, interventio lyhenee suoraan → varmista ydintoiminnallisuus (chat-komento → minipeli → pisteet) ensin, badge-visuaalit vasta jos aikaa jää
2. Geoguesser-baseline pitää kerätä TÄLLÄ VIIKOLLA/ensi viikolla ennen aikataulusiirtymää — muuten baseline ja interventio eivät ole vertailukelpoisia edes karkeasti
