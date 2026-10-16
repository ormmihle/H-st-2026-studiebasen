# Del II: Taksonomi for sikkerhet og robusthet

[PDF](pdf/2026_lectures_part_II%20Taxonomy-1.pdf)

Vi trenger et felles språk. Utover funksjonalitet har et system en rekke **ikke-funksjonelle krav**, og emnet samler dem i fem egenskaper:

| Egenskap | Kort definisjon |
|---|---|
| **Security** (sikkerhet) | Evne til å beskytte mot uønskede hendelser |
| **Privacy** (personvern) | Evne til å beskytte mot uønsket tilgang til personopplysninger |
| **Dependability** (pålitelighet) | Tjenesten kan med rette stoles på |
| **Safety** (sikkerhet for liv og miljø) | Ingen katastrofale konsekvenser for brukere og omgivelser |
| **Performance** (ytelse) | Systemet har ressursene som trengs for å levere tjenesten |

## Security

Mange ord betyr nesten det samme, men ikke helt:

- **Datasikkerhet**: beskytte rådata (bits og bytes)
- **Informasjonssikkerhet**: beskytte informasjon, uansett om den er digital
- **IKT-sikkerhet**: informasjonen *og* programvaren, maskinvaren og nettet som behandler den
- **Cybersikkerhet**: beskytte systemer mot digitale angrep, ofte brukt om alt som er sårbart gjennom IKT

I emnet betyr *security* rett og slett **beskyttelse av IKT-infrastrukturen mot uønskede hendelser**.

### Sikkerhetsattributter

| Attributt | Betyr | Gjelder mest |
|---|---|---|
| **Confidentiality** (konfidensialitet) | Bare autoriserte får tilgang | Informasjon |
| **Integrity** (integritet) | Beskyttet mot uautorisert endring eller sletting | Informasjon og tjenester |
| **Availability** (tilgjengelighet) | Beskyttet mot uautorisert avbrudd | Informasjon, tjenester og systemer |
| **Authenticity** (autentisitet) | Ekte og etterprøvbar; vi vet hvem avsenderen er | |
| **Non-repudiation** (ikke-benekting) | Ingen kan nekte for å ha sendt eller mottatt | |
| **Accountability** (sporbarhet) | Handlinger kan spores entydig til den som gjorde dem | |

De tre første er **CIA**. Et brudd på konfidensialitet kan nesten aldri repareres digitalt.

!!! example "Nettbank"
    Banken har autorisert deg, dere autentiserer hverandre, informasjonen holdes konfidensiell og korrekt, ingen kan nekte for det som ble sendt, og tjenesten er tilgjengelig når du trenger den. Mangler noe av dette, åpner det for **man-in-the-middle**.

### Fra verdier til krav

Start med **verdiene** (assets): informasjon, tjenester, programvare, maskinvare, nett, databaser, omdømme, kunnskap. Først når du vet hva som skal beskyttes, kan du lage gode krav. Eksempler for Teams:

- «Det skal ikke være mulig å avlytte samtaler» → konfidensialitet
- «Chatmeldinger skal ikke kunne endres underveis» → integritet
- «Brukere kan ikke slette meldinger de har sendt» → ikke-benekting

### Hvorfor sikkerhet er vanskelig

- **Krav kan kollidere:** *need to know* (konfidensialitet) mot *need to share* (tilgjengelighet). Ulike interessenter vil også ha ulike ting.
- **Mekanismene er komplekse:** selv «bare registrerte brukere» krever valg om passordgenerering, utløp, glemt passord og lagring (hashing og salting).
- **Sikkerhet hviler ofte på en hemmelighet** (en nøkkel), og angriperen leter etter det svakeste punktet.
- **Brukervennlighet:** er sikkerhet tungvint, finner folk snarveier («Why Johnny Can't Encrypt»).

## Privacy

Personvern er retten til å kontrollere hva som skjer med egne personopplysninger. **Personopplysninger** er all informasjon som kan knyttes til en identifiserbar person, direkte eller indirekte (GDPR art. 4), for eksempel IP-adresse eller en kombinasjon av opplysninger.

**Roller:**

- **Den registrerte** (data subject): personen opplysningene gjelder
- **Behandlingsansvarlig** (data controller): bestemmer formål og midler
- **Databehandler** (data processor): behandler opplysningene på vegne av den behandlingsansvarlige

**Sju prinsipper:** lovlighet, rettferdighet og åpenhet · formålsbegrensning · dataminimering · riktighet · lagringsbegrensning · integritet og konfidensialitet · ansvarlighet.

!!! note "Personvern ≠ sikkerhet"
    Personvern beskytter personopplysninger, sikkerhet beskytter alt. Personvern trenger sikkerhetsmekanismer, men noen sikkerhetstiltak kan svekke personvernet (f.eks. omfattende logging).

## Dependability

Pålitelighet er et **operasjonelt begrep**: det handler om hvordan systemet oppfører seg i drift, der det enten er *oppe* (leverer tjenesten etter spesifikasjon) eller *nede*.

Tre kjerneattributter i emnet:

| Attributt | Betyr | Måles som |
|---|---|---|
| **Availability** (tilgjengelighet) | Klar til bruk på et tidspunkt eller i et intervall | Sannsynlighet for at tjenesten leveres |
| **Reliability** (pålitelighet) | Leverer uten avbrudd | Sannsynlighet for avbruddsfri drift i et intervall |
| **Maintainability** (vedlikeholdbarhet) | Kan gjenopprettes etter feil | Tid til reparasjon |

**Systemtider:** \(T_{FF}\) tid til første feil, \(T_{BF}\) tid mellom feil, \(T_U\) oppetid, \(T_D\) nedetid. Vanlige mål er MUT (gjennomsnittlig oppetid) og MTTF (forventet tid til feil).

### Tre måter å måle tilgjengelighet

- **Asymptotisk:** sannsynligheten for å finne systemet oppe på et tilfeldig tidspunkt i stabil drift. Mest brukt.
- **Momentan (punktvis):** sannsynligheten for at systemet er oppe akkurat på et gitt tidspunkt.
- **Intervall (gjennomsnittlig):** gjennomsnittlig tilgjengelighet over en periode.

| Tilfelle | Mest relevant |
|---|---|
| Tilgjengelig for spørsmål under en hjemmeeksamen | Intervall |
| Kjøpe konsertbilletter som slippes kl. 09.00 | Momentan |
| Telefonsamtaler når som helst i året | Asymptotisk |

Se [Formler og tall](formler.md) for nedetid og «nierne».

### Security- og dependability-blikket på tilgjengelighet

Sikkerhetseksperten tenker på tilgjengelighet som *beskyttelse mot uautorisert avbrudd*. Pålitelighetseksperten tenker på det som *en sannsynlighet som kan måles*. Begge trengs: ser du bare på det ene, overser du enten angrepene eller de tilfeldige feilene.

## Safety

**Safety** er beskyttelse mot *utilsiktede* hendelser med katastrofale følger. **Security** er beskyttelse mot *tilsiktede* hendelser. **Safe = safety + security.** På norsk heter begge «sikkerhet», noe som skaper forvirring.

- Et **pålitelig** system slutter sjelden å virke. Et **trygt** system gir sjelden katastrofale følger.
- Safety oppnås med **barrierer** som hindrer at en feil blir en ulykke, og med **fail-safe**: systemet stenger ned til en trygg tilstand.
- Sertifisert safety antar at systemet er uendret. Trusselbildet for security endrer seg hele tiden, så en sikkerhetsanalyse går fort ut på dato.

## Performance

Ytelse er evnen til å skaffe ressursene som trengs for å levere tjenesten:

- **Capacity** (kapasitet): maks last per tidsenhet (egenskap ved systemet)
- **Throughput** (gjennomstrømning): andelen av kapasiteten brukerne faktisk bruker
- **Delay** (forsinkelse): tiden det tar å fullføre tjenesten; ende-til-ende er summen gjennom alle ledd

Pålitelighet og ytelse henger sammen: en tjeneste med for høy forsinkelse regnes ofte som nede. **QoS** (ITU E.800) beskriver samlet kvalitet fra terminal via aksessnett og kjernenett.

## Funksjonelle og ikke-funksjonelle krav

- **Funksjonelt krav:** hva systemet skal *gjøre* («legg til ny kunde»)
- **Ikke-funksjonelt krav:** hvordan systemet skal *oppføre seg* (tilgjengelighet, sikkerhet, ytelse)

Målbare egenskaper (tilgjengelighet, pålitelighet, vedlikeholdbarhet, kapasitet, gjennomstrømning, forsinkelse) skal ha **konkrete tall** i kravet. «Skal ha høy tilgjengelighet» er et dårlig krav. Ikke-funksjonelle krav må komme tidlig, fordi det er dyrt å fikse dem i ettertid.

## Repetisjon

??? question "Når er pålitelighet (reliability) viktigere enn tilgjengelighet (availability)?"
    Når et avbrudd i seg selv er skadelig, selv om det er kort. For eksempel en lang filoverføring eller en kirurgisk operasjon som styres digitalt: høy tilgjengelighet hjelper lite hvis tjenesten avbrytes underveis.

??? question "Hvorfor er «Brukere kan ikke slette meldinger de har sendt» et tvilsomt krav?"
    Det kan komme i konflikt med personvern (retten til sletting) og er ikke knyttet til en tydelig verdi. Et godt krav er begrunnet i verdiene, entydig og etterprøvbart.
