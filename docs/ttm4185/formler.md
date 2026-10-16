# Formler og tall

## Nedetid

Nedetid per år er andelen nedetid ganget med antall timer i et år:

\[
\text{nedetid} = (1 - A) \cdot 8760 \text{ timer}
\]

| Tilgjengelighet | Nedetid per år |
|---|---|
| 90 % (én nier) | 36,5 døgn |
| 99 % (to niere) | 3,65 døgn |
| 99,5 % | 43,8 timer |
| 99,8 % | 17,5 timer |
| 99,9 % (tre niere) | 8,76 timer |
| 99,95 % (typisk skytjeneste) | 4,38 timer |
| 99,99 % (fire niere) | 52,6 minutter |
| 99,999 % (fem niere, «carrier grade») | 5,26 minutter |

!!! warning "Feil i foilene"
    Foilen «The 9s of availability» oppgir 7,76 timer for tre niere. Riktig er \(0{,}001 \cdot 8760 = 8{,}76\) timer.

**Per måned** (Microsoft regner SLA månedlig): 99,9 % av en måned på 31 dager gir \(0{,}001 \cdot 44\,640 \approx 45\) minutter nedetid.

!!! tip "Tenk på tallet bak prosenten"
    Prosenten sier ingenting om hvordan nedetiden er fordelt. Én lang stans og mange korte stans kan gi samme tilgjengelighet, men svært ulik opplevelse. SLA-er unntar også ofte planlagt nedetid.

## Tilgjengelighet i serie og parallell

Forutsetter at komponentene feiler uavhengig av hverandre.

=== "Serie"
    Alle komponentene må virke:

    \[
    A_{\text{serie}} = A_1 \cdot A_2 \cdots A_n = \prod_{i=1}^{n} A_i
    \]

    Seriekoblinger blir alltid **dårligere** enn den svakeste komponenten.

=== "Parallell"
    Minst én komponent må virke:

    \[
    A_{\text{parallell}} = 1 - (1 - A_1)(1 - A_2) \cdots (1 - A_n) = 1 - \prod_{i=1}^{n} (1 - A_i)
    \]

    Parallellkoblinger (redundans) blir alltid **bedre** enn den beste komponenten.

### Regneeksempel: serie

Tre delsystemer i serie med tilgjengelighet 0,95, 0,999 og 0,99:

\[
A = 0{,}95 \cdot 0{,}999 \cdot 0{,}99 \approx 0{,}94
\]

### Regneeksempel: to like veier i parallell

En vei består av ruter (0,99) – kabel (0,999) – ruter (0,99) i serie. To slike veier i parallell:

\[
A_{\text{vei}} = 0{,}99 \cdot 0{,}999 \cdot 0{,}99 \approx 0{,}9791
\]
\[
A = 1 - (1 - 0{,}9791)^2 \approx 0{,}9996
\]

!!! note "Single point of failure"
    En komponent som ligger i serie med *alle* veiene (for eksempel endepunktsruterne) er et single point of failure. Ta dem ut av parallelldelen og gang dem inn i serie til slutt.

## Grafer

| Mål | Formel eller fremgangsmåte |
|---|---|
| Grad til node \(v\) | Antall kanter ut fra \(v\) |
| Gjennomsnittlig grad | \( \bar{k} = \dfrac{2|E|}{|V|} \) |
| Closeness | Summen av korteste avstand til alle andre noder. Lav sum = sentral. Noen ganger gitt som \( 1 / \sum d(v,u) \). |
| Betweenness | Andelen av alle korteste stier mellom andre par som går gjennom \(v\) |

**Skalafritt nettverk:** noen få noder har svært høy grad, de fleste har lav (gradfordelingen følger en potenslov). Slike nett tåler tilfeldige feil godt, men er sårbare for målrettede angrep mot knutepunktene.
