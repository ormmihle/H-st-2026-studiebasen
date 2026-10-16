# Gjesteforelesninger

Fire gjesteforelesninger høsten 2026, sortert etter dato.

## Nkom: sikre og robuste ekomnett (31.08)

[PDF](pdf/2026_NKom.pdf) · Bjørn Erik Eskedal, fagdirektør i sikkerhetsavdelingen

**Nkom** (Nasjonal kommunikasjonsmyndighet) er en statlig etat under Digitaliserings- og forvaltningsdepartementet med rundt 210 ansatte og hovedkontor i Lillesand. Nkom følger opp ekomloven, forvalter frekvenser, regulerer markedet, stiller og følger opp krav til robusthet og sikkerhet, driver EkomCERT, har ansvar for nytt nødnett og er koordinerende tilsyn for KI-loven.

**Hvorfor økt fokus nå:** mer ekstremvær, skjerpet sikkerhetspolitisk situasjon (sabotasje, cyberangrep), ekomnettene bærer stadig mer kritisk samfunnsverdi, og Forsvaret er avhengig av kommersielle nett. Spredtbygde strøk trenger mer redundans og reservestrøm; tettbygde strøk må redusere konsentrasjonsrisiko.

**Sikkerhet på alle nivåer:** fra individ til stat, fra fred til krig, fysisk og logisk, og både K, I og T.

**Nkoms ROS-analyse peker på:** avhengigheter og konsentrasjon i verdikjeder, cyberangrep, ekstremvær, feil ved planlagt arbeid, innsidetrusler, sabotasje og sjøfiberkabler.

**Konkrete tiltak:**

- **Forsterket ekom:** sikrer mobildekning for kommunens kriseledelse i minst 72 timer ved strømbrudd, med reserveforbindelse
- **Reservestrøm, mål 2030:** 72 timer i 200 sårbare kommuner, 12–24 timer i 100 prioriterte tettsteder
- **Robuste transmisjonsnett (ROBIN 2):** flere fysisk adskilte traséer, redundans i hvert nett, flere autonome landsdekkende nett. Mobiltrafikken til tettsteder over 10 000 innbyggere skal fordeles over minst tre autonome nett.
- **To uavhengige bredbåndstilknytninger** for husstander og virksomheter (ofte fast + mobil, eventuelt satellitt)
- **Nytt nødnett** innen 2031, med data og video i tillegg til tale

**GNSS-forstyrrelser:** *jamming* (tjenestenekt), *spoofing* og *meaconing* (begge bedrag). Særlig aktuelt i Finnmark.

!!! tip "Til eksamen"
    «Ikke legg alle eggene i samme kurv» er kjernen i Nkoms robusthetsarbeid: adskilte traséer, flere autonome nett og reservestrøm.

## Aidon: sikkerhet i AMS (06.09)

[PDF](pdf/2026-Aidon-1.pdf)

**AMS** (avanserte måle- og styringssystemer) i Norge: rundt 3,2 millioner målere, ca. 80 nettselskap, 3 leverandører, ferdig utrullet 2019.

**Hvem bruker AMS-data:** strømkunden (eget forbruk og produksjon), strømleverandøren (fakturering) og nettselskapet (åpne og stenge abonnement, hendelser i nettet).

**Nettverkslagene:**

| Lag | Hva | Sikring |
|---|---|---|
| **HAN** (Home Area Network) | Måler → kundens utstyr | Enveis, ingen innebygd kryptering, må aktiveres fra HES |
| **NAN** (Neighborhood Area Network) | Radionett mellom målere (master/slave) | AES med forhåndsdelt radionettverksnøkkel, all RF-trafikk kryptert |
| **WAN** | Mobilnett (2G/4G/LTE-M/NB-IoT) | Privat APN, SIM-filtrering, operatørens brannmur, VPN til HES |
| **LAN** | Nettselskapets innsamlingssystem (HES) | Brannmur, hvitelisting, adskilt fra kontornett, fysisk sikring |

**Hva kan gå galt:** masseutkobling (blackout via fjernstyrt bryter), manipulering av forbruksdata, datatyveri for utpressing, spionasje og kartlegging for sabotasje. Konsekvensene blir større jo høyere opp i kjeden angriperen kommer.

**Nøkkelhåndtering:** unike nøkler per måler (én hacket måler gir ikke kontroll over andre), nøklene byttes ved installasjon, egne nøkler for daglig drift, firmware-oppdatering og nøkkeloppdatering. Måleren godtar aldri firmware eller kommandoer uten gyldig sertifikat. Integritet sikres med HMAC eller CRC16.

**Fysisk sikring:** forsegling fra fabrikk og hærverksalarm som sendes som «last gasp» selv uten strøm.

## Telenor Cyberdefence: trusler og trender (08.09)

[PDF](pdf/2026-Telenor%20Cyberpdf.pdf)

### Sårbarheter

- **Teknisk alvorlighetsgrad ≠ risiko.** Alvorlighetsgrad (CVSS, 0–10) sier hva sårbarheten gir og hvor lett den er å utnytte. Risiko avhenger i tillegg av verdien til systemet og sannsynligheten for utnyttelse.
- **Kjente sårbarheter** får et CVE-nummer (f.eks. CVE-2017-0144 / MS17-010). Når de er kjent, er de lette å finne, derfor er patching viktig.
- **Ukjente (zero-day)** er svært vanskelige å beskytte seg mot: sikkerhetstesting, vulnerability disclosure-program, gode patcherutiner og sikkerhet i lag.
- Kjente zero-days: Heartbleed (2014), EternalBlue (2017, brukt i WannaCry og NotPetya), Log4Shell (2021), Ivanti EPMM (brukt mot DSS 2023).
- **AI** gjør det raskere og enklere både å finne og å utnytte sårbarheter.

**Markedet for sårbarheter:**

| Marked | Eksempel | Mål |
|---|---|---|
| Hvitt | Bug bounty, responsible disclosure | Feilen fikses |
| Svart | Lukkede forum, dark web | Innbrudd og tyveri |
| Grått | Sårbarhetsmeglere, ofte med myndigheter som kunder | Overvåking, offensive operasjoner |

### Angrep

|  | Målrettet | Opportunistisk |
|---|---|---|
| **Teknisk** | Vanskelig mot oppdaterte systemer; utnytter feilkonfigurasjon, svak autentisering eller zero-days | Automatiske skannere (f.eks. Shodan) finner sårbare systemer; kryptering, defacement, kryptomining |
| **Social engineering** | Spear phishing | Phishing |

### Trusselaktører

| Aktør | Motiv | Eksempel |
|---|---|---|
| Innsidere | Fordel, hevn | Misfornøyde eller tidligere ansatte |
| Thrill seekers | Omdømme, nysgjerrighet | «Script kiddies», bruker nå mye AI |
| Hacktivister | Ideologi | Anonymous, Server Killers (DDoS mot Norge 2026) |
| Cyberkriminelle | Vinning | FIN7 (spear phishing, ransomware) |
| Statlige aktører | Politikk, spionasje | Lazarus (WannaCry, Sony), APT28 (Stortinget 2020, demning i Norge 2025) |

## Eivind Høydal: risikovurdering i praksis (28.09)

[PDF](pdf/2026-09-28%20NTNU%20TTM4185%20-%20Risk%20Assessment%20in%20Practice%20-%20Eivind%20H%C3%B8ydal.pdf) · O3 Cyber

### Hvorfor cyberrisiko er annerledes

- **Safety:** tilfeldige hendelser som følger statistikk (en «hundreårsflom» har 1 % sjanse hvert år). Historikk gir god indikasjon.
- **Security:** en angriper velger mål, tid og metode og tilpasser seg. Historikk gir dårlig indikasjon.
- Derfor deles sannsynlighet opp: **Risiko = (Trussel × Sårbarhet) × Konsekvens**, der trussel bestemmes av angriperens hensikt og evne.
- Cybermiljøer er dynamiske og komplekse (tusenvis av enheter, endres daglig), i motsetning til f.eks. et bankhvelv.

**Hvorfor gjøre risikovurderinger:** for å *prioritere* (ikke alt skal være grønt), for å *etterleve* (digitalsikkerhetsloven fra 1. okt 2025, Havtil), og for *ansvarlighet* (en eier aksepterer restrisiko skriftlig).

### Caset: Nordlys A (fiktiv olje- og gassplattform)

Plattformen skal fjernstyres fra et kontrollrom på land. OT-utstyret var tidligere «air-gapped» og har kjente sårbarheter.

**IT vs. OT:** IT prioriterer konfidensialitet, lever 3–5 år og patches månedlig. OT prioriterer **tilgjengelighet og safety**, lever 10–20 år og patches bare ved planlagte stopp.

**Fire uønskede hendelser fra workshopen:**

| ID | Hendelse | Attributt | Resultat |
|---|---|---|---|
| E1 | Løsepengevirus i kontor-IT når kontrollrommet og tvinger fram nedstengning | Tilgjengelighet | **Rød** |
| E2 | Leverandørens fjerntilgang misbrukes til å endre prosessverdier | Integritet | Gul–rød |
| E3 | Angriper slår ut eller manipulerer sikkerhetssystemet (SIS) | Integritet | **Rød** |
| E4 | Fiberen til land kuttes og fjernstyring går tapt | Tilgjengelighet | Gul |

**Håndtering:** E1 reduseres (soner og conduits etter IEC 62443, egen OT-identitet, testet manuell drift). E3 unngås (SIS kan aldri skrives eksternt, fysisk nøkkelbryter). E2 reduseres (tidsbegrenset leverandørtilgang med MFA og opptak). E4 aksepteres med radio- og satellittbackup, men aksepten utløper etter 12 måneder.

!!! tip "Oppgi kunnskapsstyrke"
    Merk hver vurdering som sterk, middels eller svak kunnskap. E1 har sterk kunnskap (mange lignende saker), E3 svak, og bør vurderes på nytt når trusselbildet endres.

### Organisasjonen rundt

- **Ledelsen eier cyberrisiko**, ikke sikkerhetsavdelingen. Sikkerhet støtter og utfordrer.
- **Fire roller i rommet:** risikoeier, systemeksperter, sikkerhet og fasilitator. Mangler eieren, feiler det oftest.
- **Når:** ved innkjøp, ved endring, når det har gått over 12 måneder, og etter en hendelse.
- **Tre forsvarslinjer:** 1. linje eier risikoen, 2. linje (risiko og compliance) utfordrer, 3. linje (internrevisjon) gir uavhengig bekreftelse.
- **Aggreger, ikke ta gjennomsnitt:** 400 risikoer → 40 temaer → 10 for styret. Én rød på en kritisk verdi veier tyngre enn ti grønne.

### Fire måter risikovurderinger feiler

1. **Rapporten i skuffen:** god analyse, ingen oppfølging
2. **ROS-fabrikken:** vurderinger på samlebånd for å oppfylle et krav
3. **Vannmelonen:** grønn utenpå, rød inni, fordi ledelsen ikke vil se realistisk risiko
4. **Alt er akseptabelt:** deltakerne mangler mandat og budsjett, og vurderingene forhandles

### I stor skala

Modne selskaper håndhever en **baseline** overalt (NSMs grunnprinsipper, CIS Controls, IEC 62443), gjør **raske** vurderinger på 60 minutter som ender i en beslutning, bygger «paved roads» der bare avvik må risikovurderes, og kjører risiko fra **live data** i en graf.

### Fem råd til øvingen

| Utfordring | Gjør dette |
|---|---|
| Ingen reell eier | Navngi en eier per risiko |
| Kriterier satt av analytikeren | Bruk alltid de gitte skalaene, og si hva som er uakseptabelt |
| For bredt eller smalt omfang | Si tydelig hva som er innenfor og utenfor |
| Gjetting ser presist ut | Oppgi kunnskapsstyrke |
| Ingenting skjer etterpå | Gi hver risiko en håndtering med eier og dato |
