# Eksamen

| År | Format | Oppgaver | Løsningsforslag |
|---|---|---|---|
| 2021 | Åpen bok, bygd rundt en vitenskapelig artikkel om ADS-B | [PDF](pdf/TTM4185%20exam%202021.pdf) | [PDF](pdf/TTM4185%20exam%202021%20-%20losningsfoslag.pdf) |
| 2022 | 14 oppgaver på tvers av pensum, to case fra øving 1 | [PDF](pdf/TTM4185%20exam%202022.pdf) | [PDF](pdf/TTM4185%20exam%202022%20-%20losningsforslag.pdf) |

## Hva går igjen

| Tema | 2021 | 2022 | Se notater |
|---|---|---|---|
| Verdier og risikovurdering | Oppg. 1–2 | Oppg. 2, 7a | [Del V](del-5-risikostyring.md) |
| CIA og sikkerhetsattributter | Oppg. 3–5, 10 | Oppg. 3c | [Del II](del-2-taksonomi.md#sikkerhetsattributter) |
| Safety mot security | Oppg. 3, 17 | | [Del II](del-2-taksonomi.md#safety) |
| Trusler mot et system | Oppg. 8–9 | Oppg. 3 (man-in-the-middle) | [Del III](del-3-trusler.md), [Del IV](del-4-trusler-og-trender.md) |
| Symmetrisk og asymmetrisk kryptografi | Oppg. 10–16 | Oppg. 6 | *Ikke i opplastet materiale* |
| Fault–error–failure, feiltoleranse | Oppg. 20 | Oppg. 4 (TCP) | [Del III](del-3-trusler.md#palitelighetsblikket-fault-error-failure) |
| Pålitelighetsattributter | Oppg. 21 | Oppg. 8–9 | [Del II](del-2-taksonomi.md#dependability) |
| Asymptotisk og momentan tilgjengelighet | | Oppg. 10 | [Del II](del-2-taksonomi.md#tre-mater-a-male-tilgjengelighet) |
| Tilgjengelighet i serie og parallell | Oppg. 22 | Oppg. 14 | [Formler](formler.md) |
| Nedetid fra prosent | | Oppg. 7c | [Formler](formler.md#nedetid) |
| Grafer og sentralitet | | Oppg. 11–13 | [Del I](del-1-komplekse-systemer.md#sentralitet) |
| Tjenesteutsetting og SLA | | Oppg. 7 | [Del V](del-5-risikostyring.md#tjenesteutsetting-sla-og-avtaler) |
| Gode krav | | Oppg. 1b, 5 | [Del II](del-2-taksonomi.md#funksjonelle-og-ikke-funksjonelle-krav) |
| Nkom og EkomROS | | Oppg. 14c | [Del III](del-3-trusler.md#uonskede-hendelser-i-ekom) |

## 2021: ADS-B

Eksamen bygget på artikkelen *Can Cryptography Secure Next Generation Air Traffic Surveillance?* (Wesson, Humphreys og Evans). ADS-B er systemet der fly kringkaster posisjon og fart hvert sekund, uten kryptering eller signatur.

**Det du må kunne om artikkelen:**

- ADS-B ble designet for **interoperabilitet** og lave kostnader på 1980–90-tallet, ikke for sikkerhet.
- Meldingene har en **CRC** som oppdager tilfeldige bitfeil (safety-blikk: «integritetsbeskyttet»), men ingen kryptografisk beskyttelse mot forfalskning (security-blikk: «ikke integritetsbeskyttet»).
- **Angrep:** avlytting, jamming, falske meldinger (injeksjon) og GPS-spoofing eller -jamming.
- **Symmetrisk kryptering** gir konfidensialitet; **MAC** gir integritet og autentisitet men ikke konfidensialitet. Ingen av dem gir ikke-benekting, fordi alle med nøkkelen kan lage gyldige meldinger.
- **Problemet med symmetriske nøkler:** én lekket nøkkel kompromitterer hele systemet.
- **Asymmetrisk kryptering** blir lengre meldinger og krever egen melding per mottaker (\(n^2 - n\) sendinger).
- **Digitale signaturer med ECDSA** er det eneste realistiske alternativet ifølge forfatterne, fordi ECDSA gir korteste signatur for gitt styrke. Men en 448-bits signatur er fire ganger så lang som en ADS-B-melding, og kapasiteten faller fra om lag 350 fly til 80 eller 190 avhengig av scenario.
- **Safety-argumentet mot kryptering:** legitime meldinger som ikke kan dekrypteres øker risikoen for kollisjon.
- **Redundans:** radar (PSR og SSR) beholdes som backup og kryssjekk.

## 2022: bredt over pensum

Oppgavene brukte to case fra øving 1 (dynamiske iskart fra Kystverket og prediktivt vedlikehold med skylagring) og en modell av **Tampnetts fibernett** i Nordsjøen for grafteori og tilgjengelighetsberegning.

## Sjekkliste før eksamen

- [ ] Kan forklare fault, error og failure med et eget eksempel
- [ ] Kan alle seks sikkerhetsattributtene og hva som gir hvilke (kryptering, MAC, signatur)
- [ ] Kan regne tilgjengelighet i serie og parallell og finne single points of failure
- [ ] Kan regne om fra prosent tilgjengelighet til nedetid per år
- [ ] Kan regne grad, closeness og betweenness på en liten graf
- [ ] Kan de fem stegene i risikovurdering og de fire håndteringsstrategiene
- [ ] Kan forklare forskjellen på safety og security med et eksempel
- [ ] Kan forklare hva en SLA, ToU og DPA er, og når de trengs
