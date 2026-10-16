# Del I: Komplekse IKT-systemer

[PDF del 1](pdf/2026_lectures_part_I%20Intro%20and%20complex%20systems-21-101-1.pdf) · [2](pdf/2026_lectures_part_I%20Intro%20and%20complex%20systems-21-101-2.pdf) · [3](pdf/2026_lectures_part_I%20Intro%20and%20complex%20systems-21-101-3.pdf) · [4](pdf/2026_lectures_part_I%20Intro%20and%20complex%20systems-21-101-4.pdf) · [5](pdf/2026_lectures_part_I%20Intro%20and%20complex%20systems-21-101-5.pdf)

## Hvorfor emnet finnes: CrowdStrike 2024

CrowdStrike-hendelsen var **ikke et angrep**, men en sikkerhetsoppdatering som gikk galt. En feil i verifikasjonsverktøyet gjorde at en feilaktig patch ble godkjent og rullet ut til millioner av maskiner. Feilen måtte rettes manuelt på hver maskin, og den rammet kritiske tjenester som sykehus, apotek, finans og flyplasser.

!!! tip "Lærdommen"
    Systemet som skal beskytte mot angrep må selv være robust og pålitelig. Det er like farlig å bare tenke på tilfeldige feil som å bare tenke på ondsinnede angrep. Fokuser på **konsekvensene**, og husk at trusler kan avhenge av hverandre eller skje samtidig.

ENISA-tall for telekom-hendelser i EU (2019) viser hvorfor: over halvparten var systemfeil, rundt en fjerdedel menneskelige feil, 13 % naturfenomener og bare 5 % ondsinnede handlinger.

## Hva er et IKT-system?

Et IKT-system består av informasjon, tjenester, nett, programvare, maskinvare, databaser og komponenter. Til sammen kalles dette **IKT-infrastrukturen**:

- **Fysisk infrastruktur**: nett, regnekraft og lagring (f.eks. 5G-kjernenett, Azure)
- **Informasjonsinfrastruktur**: data og informasjon (f.eks. kart, databaser, matrikkel)
- **Tjenester**: det brukeren faktisk bruker (f.eks. navigasjon, chatbot, YouTube)

**Data vs. informasjon:** data er rådata, informasjon er data satt i en sammenheng. Tallet 1939 er data; «andre verdenskrig startet» er informasjon.

### MTO-perspektivet

**Menneske – Teknologi – Organisasjon.** Et sikkert og robust system avhenger av alle tre. Brukere og organisasjoner er like mye en del av systemet som teknologien.

### System, komponenter, struktur og tjeneste

Et **system** består av:

- **Komponenter**: informasjon, innhold, utstyr, programvare, delsystemer (en komponent kan selv være et system)
- **Struktur**: hvordan komponentene henger sammen (topologi, protokollag, hierarki)
- **Tjeneste**: funksjonene systemet tilbyr brukeren over et grensesnitt

??? example "Eksempel: Netflix"
    - **System:** verdikjeden for levering av Netflix-video
    - **Komponenter:** videoinnhold, cache-server hos ISP-en, aksess- og kjerneruter, brukerterminaler, brukerdata
    - **Struktur:** nettverkstopologi, metadata-merket videoarkiv
    - **Tjeneste:** videostrømming
    - **Verdier:** personvern, høy videokvalitet, innhold, cache-server
    - **Uønskede hendelser:** ingen forbindelse, forstyrret avspilling, uautorisert kontotilgang, ødelagt innhold

## Bruker og tilbyder

En tjeneste tilbys alltid av en **tilbyder** og brukes av en **bruker**. Avtalen mellom dem er en **SLA** (Service Level Agreement). Én aktør kan ha begge rollene: YouTube er tilbyder for deg, men bruker av ISP-en din. Dette gir lange kjeder av tillit, og **digital forsyningskjedesikkerhet** er derfor et hett tema.

## Nettverk som grafer

Et nettverk kan modelleres som en graf \( G = (V, E) \), der \( V \) er noder og \( E \) er kanter mellom par av noder.

- **H2H, H2M, M2M:** menneske–menneske, menneske–maskin, maskin–maskin (IoT)
- **Logisk vs. fysisk topologi:** en logisk forbindelse (f.eks. en VPN) går over en fysisk sti. To logiske forbindelser kan dele samme fysiske lenke, og da tar én feil ut begge.
- **Kjernenett** er typisk *mesh* (mange lenker per node), **metro/aksessnett** er ofte *ringer*.
- **Isomorfe grafer** har samme struktur selv om de er tegnet ulikt.

### Sentralitet

Sentralitet måler hvor viktig en node er strukturelt:

| Mål | Hva det måler |
|---|---|
| **Degree** (grad) | Antall naboer |
| **Closeness** (nærhet) | Total avstand til alle andre noder (kort = sentral) |
| **Betweenness** (mellomliggende) | Hvor mange korteste stier mellom andre par som går gjennom noden |

En node med høy sentralitet er ofte et **single point of failure** eller en flaskehals.

## Digitalt økosystem

Internett er «nett av nett» med mange operatører (ISP-er og autonome systemer) som både samarbeider og konkurrerer. Internett ble bygget på tillit, uten et felles design for sikkerhet eller pålitelighet. Koordinering skjer i dag gjennom SLA-er og BGP-ruting mellom domener, med begrenset informasjonsdeling.

Nettverk er heller ikke statiske. Lenker feiler, noder går ned, last endrer seg, og automatisert drift kan selv introdusere feil.

## Kritisk infrastruktur og avhengigheter

IKT er en grunnleggende muliggjørende teknologi for energi, transport, vann, helse og finans, og avhenger samtidig av dem (f.eks. trenger ruteren strøm, og strømnettet trenger ruteren for styring).

Typer avhengigheter:

- **Fysisk**: én infrastruktur trenger noe fysisk fra en annen
- **Logisk / cyber**: tilstanden avhenger av informasjon fra en annen (f.eks. SCADA)
- **Geografisk**: ting ligger fysisk nær hverandre (strøm- og fiberkabel under samme bro)

Typer feilutvikling:

- **Eskalerende feil**: en feil avslører andre, sovende feil
- **Kaskadefeil**: feil i ett system gir feil i et annet via avhengighet
- **Feilforplantning**: feil sprer seg mellom delsystemer
- **Common mode-feil**: én årsak gir feil i mange delsystemer samtidig

### Risikokurven: når IKT-støtte gjør det verre

Ny IKT-støtte til drift reduserer de hyppige, små hendelsene. Men den øker kompleksiteten og avhengighetene, og kan dermed gjøre de sjeldne, store hendelsene mer sannsynlige og langvarige («vi har ikke sett denne feilen før», «hvem skal gjøre hva?»). Derfor trengs både flere folk på de store hendelsene og høyere kompetanse.

### Ekom i Norge

Ekominfrastrukturen består av **kjernenett**, **regionalnett**, **aksessnett**, **tjenestenett** og **drifts- og støttesystemer**. Transportnettet er kjernenett + regionalnett. Drifts- og støttesystemene er kritiske og ofte felles for mange funksjoner.

## Repetisjon

??? question "Hvilken fysisk feil kan ta ned to logiske forbindelser samtidig, og hva koster det å unngå det?"
    En felles fysisk lenke eller node som begge forbindelsene går gjennom. Løsningen er fysisk adskilte stier, men det koster mer kabel og utstyr. Vurder kost mot nytte.

??? question "Hvorfor kan mer automatisering gi større risiko for de alvorligste hendelsene?"
    Fordi det øker kompleksitet og avhengigheter. Hyppige, små feil håndteres bedre, men sjeldne feil kan bli større og vanskeligere å forstå og rette.
