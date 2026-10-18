# 11. Maksimal flyt

Et flytnett er en rettet graf der hver kant har en kapasitet, og vi vil sende mest mulig «stoff» fra en kilde s til et sluk t. Vi ser på to tilsynelatende ulike problemer, maksimal flyt og minimalt snitt, som viser seg å være duale: verdien av den største flyten er lik kapasiteten til det minste snittet. Ford-Fulkerson-metoden øker flyten langs forøkende stier i restnettet til det ikke finnes flere. Det er et stort skritt mot generell lineær programmering.

**Læringsmål fra F12**

- [L1] Kunne definere flytnett, flyt og maks-flyt-problemet
- [L2] Kunne håndtere antiparallelle kanter og flere kilder og sluk
- [L3] Kunne definere restnettet til et flytnett med en gitt flyt
- [L4] Forstå hvordan man kan oppheve (cancel) flyt
- [L5] Forstå hva en forøkende sti (augmenting path) er
- [L6] Forstå hva snitt, snitt-kapasitet og minimalt snitt er
- [L7] Forstå maks-flyt/min-snitt-teoremet
- [L8] Forstå Ford-Fulkerson-Method og Ford-Fulkerson
- [L9] Forstå Edmonds-Karp-algoritmen (Ford-Fulkerson med BFS)
- [L10] Forstå hvordan Ford-Fulkerson kan finne et minimalt snitt
- [L11] Forstå hvordan maks-flyt kan finne en maksimum bipartitt matching
- [L12] Forstå heltallsteoremet (integrality theorem)
- [L13] Være i stand til å konstruere reduksjoner til maks-flyt-problemet

**Pensum:** kap. 24.

!!! tip "Ukens snubletråd: ligning 24.2"
    Restkapasiteten til et par (u, v) er

    c_f(u, v) = c(u, v) − f(u, v) hvis (u, v) ∈ E,
    c_f(u, v) = f(v, u) hvis (v, u) ∈ E, og
    c_f(u, v) = 0 ellers.

    Den første linjen er hvor mye mer vi kan sende forlengs. Den andre er hvor mye flyt vi kan oppheve ved å sende baklengs. Forstår du denne ligningen, forstår du restnettet, og da forstår du Ford-Fulkerson.

## Flytnett og flyt (L1, L2)

Et **flytnett** G = (V, E) er en rettet graf der hver kant har en ikke-negativ **kapasitet** c(u, v) ≥ 0, med en **kilde** s og et **sluk** t. Hvis (u, v) ∉ E, er c(u, v) = 0. Vi krever at det ikke finnes antiparallelle kanter (har vi (u, v), har vi ikke (v, u)) og ingen løkker. Vi antar også at hver node ligger på en sti s ⇝ v ⇝ t, så |E| ≥ |V| − 1.

En **flyt** er en funksjon f : V × V → ℝ som oppfyller:

| Krav | Formel | Betydning |
| --- | --- | --- |
| Kapasitetsbegrensning | 0 ≤ f(u, v) ≤ c(u, v) | Aldri mer enn kanten tåler |
| Flytbevaring | Σᵥ f(v, u) = Σᵥ f(u, v) for alle u ∈ V − {s, t} | Det som går inn i en node, går ut igjen |

**Verdien** av flyten er |f| = Σᵥ f(s, v) − Σᵥ f(v, s) (24.1), altså netto flyt ut av kilden. **Maks-flyt-problemet:** finn en flyt med størst mulig verdi.

**Spesialtilfeller (L2).**

- **Antiparallelle kanter:** har vi både (u, v) og (v, u), del en av dem med en ny node v′: erstatt (v, u) med (v, v′) og (v′, u), begge med kapasitet c(v, u). Nettet blir ekvivalent og lovlig.
- **Flere kilder og sluk:** legg til en superkilde s med kanter (s, sᵢ) og et supersluk t med kanter (tⱼ, t), alle med kapasitet ∞.

## Restnett, oppheving og forøkende stier (L3–L5)

**Restnettet (L3).** For en flyt f har restnettet G_f = (V, E_f) de samme nodene og kantene E_f = {(u, v) : c_f(u, v) > 0}, med restkapasitet c_f fra ligning 24.2. Hver kant i G kan gi opptil to kanter i G_f: én forlengs med det som er igjen av kapasiteten, og én baklengs med flyten som går der nå. Derfor er |E_f| ≤ 2|E|. Restnettet er et flytnett, bortsett fra at det kan ha antiparallelle kanter.

**Oppheving (L4).** En baklengs kant i G_f gjør det mulig å angre flyt. Sender vi x enheter langs (v, u) i G_f, betyr det at flyten på (u, v) i G minker med x. Det gjør at algoritmen kan rette opp tidligere valg som viste seg å være dårlige. Formelt er økningen f ↑ f′ (24.4):

(f ↑ f′)(u, v) = f(u, v) + f′(u, v) − f′(v, u) hvis (u, v) ∈ E, og 0 ellers.

**Lemma 24.1:** f ↑ f′ er en flyt i G med verdi |f| + |f′|.

**Forøkende sti (L5).** En enkel sti p fra s til t i G_f. Restkapasiteten til stien er c_f(p) = min{c_f(u, v) : (u, v) er på p}, flaskehalsen. Å sende c_f(p) langs p gir en flyt f_p i G_f, og **Korollar 24.3:** f ↑ f_p er en flyt i G med verdi |f| + c_f(p) > |f|.

## Snitt og maks-flyt/min-snitt-teoremet (L6, L7)

**Snitt (L6).** Et snitt (S, T) deler V i to, med s ∈ S og t ∈ T = V − S.

- **Netto flyt** over snittet: f(S, T) = Σ f(u, v) over u ∈ S, v ∈ T, minus Σ f(v, u) over v ∈ T, u ∈ S (24.8). Flyt baklengs teller negativt.
- **Kapasiteten** til snittet: c(S, T) = Σ c(u, v) over u ∈ S, v ∈ T. Bare kanter fra S til T teller, ikke kanter tilbake.
- Et **minimalt snitt** er et snitt med minst kapasitet.

**Lemma 24.4:** netto flyt over ethvert snitt er f(S, T) = |f|. (Flytbevaring: alt som forlater s, må krysse snittet.)

**Korollar 24.5:** |f| ≤ c(S, T) for enhver flyt og ethvert snitt. Altså er maks flyt ≤ min snitt.

**Teorem 24.6 (maks-flyt/min-snitt, L7).** For en flyt f er følgende ekvivalent:

1. f er en maksimal flyt.
2. Restnettet G_f har ingen forøkende sti.
3. |f| = c(S, T) for et snitt (S, T).

*Bevis:*

- (1 ⇒ 2): Hvis G_f hadde en forøkende sti, kunne vi øke f (korollar 24.3), så f var ikke maksimal.
- (2 ⇒ 3): La S være nodene som kan nås fra s i G_f, og T = V − S. t ∉ S, siden det ikke finnes noen sti. For u ∈ S og v ∈ T: er (u, v) ∈ E, må f(u, v) = c(u, v) (ellers var (u, v) i G_f, og v kunne nås). Er (v, u) ∈ E, må f(v, u) = 0 (ellers var (u, v) en baklengs kant i G_f). Da er f(S, T) = c(S, T), og etter Lemma 24.4 er |f| = c(S, T).
- (3 ⇒ 1): |f| ≤ c(S, T) for alle snitt (korollar 24.5). Når |f| = c(S, T), kan ingen flyt være større.

### Sjekk deg selv

1. Hvilke to krav må en flyt oppfylle?
2. Hvorfor kan restnettet ha antiparallelle kanter selv om flytnettet ikke har det?
3. Hva er forskjellen på netto flyt over et snitt og kapasiteten til snittet?
4. Hvorfor er |f| ≤ c(S, T) for alle flyter og snitt?

??? success "Fasit"

    1. Kapasitetsbegrensning (0 ≤ f(u, v) ≤ c(u, v)) og flytbevaring (inn = ut for alle noder unntatt s og t).
    2. En kant (u, v) med 0 < f(u, v) < c(u, v) gir både en forlengs restkant (u, v) og en baklengs restkant (v, u).
    3. Netto flyt trekker fra flyten som går fra T tilbake til S. Kapasiteten teller bare kantene fra S til T, og bruker kapasiteten, ikke flyten.
    4. |f| = f(S, T) (Lemma 24.4), og f(S, T) ≤ summen av flyt fra S til T ≤ summen av kapasitetene fra S til T = c(S, T), fordi flyten baklengs er ikke-negativ.

## Ford-Fulkerson (F12)

Ford-Fulkerson-metoden starter med flyt 0 og øker flyten langs forøkende stier i restnettet så lenge det finnes noen. Når det ikke finnes flere, er flyten maksimal etter maks-flyt/min-snitt-teoremet. Det kalles en *metode* fordi den ikke sier hvordan stien skal finnes. Med heltallige kapasiteter er kjøretiden O(E |f*|).

**Læringsmål fra F12 som gjelder her**

- [L8] Forstå Ford-Fulkerson-Method og Ford-Fulkerson
- [L12] Forstå heltallsteoremet

### Problemet (Z1)

- **Input:** et flytnett G = (V, E) med kapasiteter c, kilde s og sluk t.
- **Output:** en maksimal flyt f, gitt som (u, v).f for hver kant.

### Krav og forutsetninger (Z2)

- Kapasitetene bør være heltall (eller rasjonale tall). Med irrasjonale kapasiteter kan metoden i verste fall aldri terminere, og flyten trenger ikke engang konvergere mot maks.
- Ingen antiparallelle kanter (se L2).

### Pseudokode

```text
FORD-FULKERSON-METHOD(G, s, t)
1  initialiser flyten f til 0
2  while det finnes en forøkende sti p i restnettet G_f
3      øk flyten f langs p
4  return f

FORD-FULKERSON(G, s, t)
1  for each edge (u, v) ∈ G.E
2      (u, v).f = 0
3  while det finnes en sti p fra s til t i restnettet G_f
4      c_f(p) = min{c_f(u, v) : (u, v) er på p}
5      for each edge (u, v) in p
6          if (u, v) ∈ G.E
7              (u, v).f = (u, v).f + c_f(p)     // forlengs: øk flyten
8          else (v, u).f = (v, u).f − c_f(p)    // baklengs: opphev flyt
9  return f
```

### Trinn for trinn (Z3)

Se figuren under Edmonds-Karp. Den viser restnettet med den forøkende stien til venstre og flyten etter økningen til høyre, akkurat som bokas figur 24.6.

### Korrekthet (Z4)

- **Invariant:** f er en lovlig flyt. Linje 7 holder seg under kapasiteten fordi c_f(p) ≤ c(u, v) − f(u, v), og linje 8 går ikke under 0 fordi c_f(p) ≤ f(v, u). Flytbevaring holder fordi hver indre node på p får like mye inn som ut (korollar 24.3).
- **Terminering:** med heltallige kapasiteter er c_f(p) ≥ 1, så |f| øker med minst 1 per iterasjon. |f| er begrenset av c({s}, V − {s}), så løkken stopper.
- **Optimalitet:** når løkken stopper, har G_f ingen forøkende sti, og etter teorem 24.6 er f maksimal.

**Heltallsteoremet (Teorem 24.10, L12).** Hvis alle kapasitetene er heltall, er den maksimale flyten Ford-Fulkerson finner heltallig: |f| og alle f(u, v) er heltall. (Ved induksjon: startflyten er 0, og hver c_f(p) er minimum av heltall.) Dette er det som gjør at flyt kan brukes på kombinatoriske problemer som matching.

### Styrker og svakheter (Z5)

- **Styrker:** enkel og generell. Gir både maks flyt og et minimalt snitt. Heltallige løsninger med heltallige kapasiteter.
- **Svakheter:** kjøretiden avhenger av verdien til flyten, ikke bare størrelsen på grafen. Et dårlig valg av stier kan gi svært mange iterasjoner: i et nett med kapasitet 1 000 000 på fire kanter og 1 på en «tverrkant» kan metoden bruke 2 000 000 iterasjoner hvis den hver gang velger en sti via tverrkanten.

### Kjøretid (Z6)

Med heltallige kapasiteter og maks flyt f*: høyst |f*| iterasjoner. Hver iterasjon finner en sti med BFS eller DFS i O(V + E′) = O(E) (restnettet har høyst 2|E| kanter, og |E| ≥ |V| − 1). Totalt **O(E |f*|)**. Det er pseudopolynomisk (se kategori 12): eksponentielt i antall bits i kapasitetene.

## Edmonds-Karp (F12)

Edmonds-Karp er Ford-Fulkerson der den forøkende stien alltid er en **korteste** sti (færrest kanter) i restnettet, funnet med BFS. Da blir antall iterasjoner O(VE) uansett kapasiteter, og kjøretiden O(VE²). Den er polynomisk også for store eller irrasjonale kapasiteter.

**Læringsmål fra F12 som gjelder her**

- [L9] Forstå Edmonds-Karp-algoritmen
- [L10] Forstå hvordan Ford-Fulkerson kan finne et minimalt snitt

### Problemet (Z1)

Som Ford-Fulkerson: finn en maksimal flyt i et flytnett.

### Krav og forutsetninger (Z2)

- Ingen krav til kapasitetene utover c ≥ 0. Edmonds-Karp terminerer alltid.
- Linje 3 i Ford-Fulkerson må bruke BFS fra s i G_f.

### Pseudokode

Som Ford-Fulkerson, men linje 3 blir:

```text
3  while BFS fra s i G_f finner en sti p til t (med færrest mulig kanter)
```

### Trinn for trinn (Z3)

Hver iterasjon finner en korteste sti i restnettet (venstre) og øker flyten (høyre). Lilla stiplede kanter er baklengs restkanter som kan oppheve flyt. Etter siste iterasjon viser figuren det minimale snittet.

<div class="algwidget" data-widget="edmonds-karp"></div>
<p class="algwidget-caption">Edmonds-Karp på flytnettet fra bokas figur 24.1 · interaktiv</p>

Maks flyt er 23, som i boka. Stiene er andre enn i figur 24.6, fordi boka der velger stier vilkårlig, mens Edmonds-Karp alltid tar en korteste.

### Korrekthet (Z4)

Korrekthet følger av Ford-Fulkerson. Det nye er at antall iterasjoner er begrenset:

- **Lemma 24.7:** for hver node v ≠ s, t øker korteste-vei-avstanden δ_f(s, v) i restnettet aldri underveis. (Nye kanter i G_f er alltid baklengs kanter langs en korteste sti, og de går «bakover» i avstand.)
- **Teorem 24.8:** antall økninger er O(VE). En kant på stien med c_f(u, v) = c_f(p) er **kritisk** og forsvinner fra G_f. Før den kan komme tilbake, må (v, u) være på en forøkende sti, og da har δ_f(s, u) økt med minst 2. Avstanden er høyst |V| − 2, så hver kant er kritisk høyst O(V) ganger. Det er O(E) kanter i G_f, og minst én kritisk kant per økning, så O(VE) økninger totalt.

### Minimalt snitt fra Ford-Fulkerson (L10)

Når algoritmen er ferdig: kjør BFS eller DFS fra s i G_f, og la S være nodene som kan nås. (S, V − S) er et minimalt snitt, med kapasitet |f|. Det er nøyaktig konstruksjonen i beviset for (2 ⇒ 3) i teorem 24.6: alle kanter fra S til T er fulle, og alle kanter fra T til S er tomme. Ekstra tid: O(E).

### Styrker og svakheter (Z5)

- **Styrker:** polynomisk tid uavhengig av kapasitetene. Like enkel å implementere som Ford-Fulkerson.
- **Svakheter:** O(VE²) er ikke det raskeste som finnes (push-relabel og nyere algoritmer er raskere), men det er pensum.
- **Mot generell Ford-Fulkerson:** bedre når kapasitetene er store. Med små heltallsverdier, som i matching, er O(E |f*|) ofte like bra eller bedre.

### Kjøretid (Z6)

O(VE) økninger, og hver tar O(E) med BFS. Totalt **O(VE²)**.

### Sjekk deg selv

1. Hva er restkapasiteten til en baklengs kant, og hva betyr det å sende flyt langs den?
2. Hvordan finner du et minimalt snitt etter at Ford-Fulkerson er ferdig?
3. Hvorfor kan Ford-Fulkerson bruke svært mange iterasjoner, og hvordan løser Edmonds-Karp det?
4. Hva sier heltallsteoremet, og hvorfor er det viktig?

??? success "Fasit"

    1. c_f(v, u) = f(u, v), flyten som går forlengs nå. Å sende x langs (v, u) i G_f betyr å redusere f(u, v) med x, altså å oppheve flyt.
    2. Finn nodene S som kan nås fra s i restnettet. (S, V − S) er et minimalt snitt, og kapasiteten er lik |f|.
    3. Med dårlige stivalg kan hver iterasjon bare øke flyten med 1, så antall iterasjoner blir |f*|, som kan være eksponentielt i inputstørrelsen. Edmonds-Karp velger korteste stier med BFS, som gir O(VE) iterasjoner uansett kapasiteter.
    4. Med heltallige kapasiteter finner Ford-Fulkerson en maks flyt der alle f(u, v) er heltall. Det gjør at vi kan tolke flyt 0/1 som valg, for eksempel i matching.

## Maksimum bipartitt matching (F12)

En **matching** i en urettet graf er en mengde kanter der ingen to deler en node. I en **bipartitt** graf er nodene delt i L og R, og alle kanter går mellom L og R. Vi vil finne en matching med flest mulig kanter, for eksempel maskiner (L) som skal tildeles oppgaver (R). Ved å gjøre grafen om til et flytnett med kapasitet 1 og finne maks flyt, får vi matchingen i O(VE).

**Læringsmål fra F12 som gjelder her**

- [L11] Forstå hvordan maks-flyt kan finne en maksimum bipartitt matching
- [L13] Være i stand til å konstruere reduksjoner til maks-flyt-problemet

### Problemet (Z1)

- **Input:** en bipartitt graf G = (V, E) med V = L ∪ R.
- **Output:** en matching M ⊆ E med størst mulig |M|.

### Krav og forutsetninger (Z2)

- Grafen må være bipartitt, og vi må kjenne todelingen L og R (den kan finnes med BFS).

### Reduksjonen

Det **tilhørende flytnettet** G′ = (V′, E′) har V′ = V ∪ {s, t} og

E′ = {(s, u) : u ∈ L} ∪ {(u, v) : u ∈ L, v ∈ R, (u, v) ∈ E} ∪ {(v, t) : v ∈ R},

alle med kapasitet 1. |E′| = |E| + |V| = Θ(E).

1. Bygg G′ (lineær tid).
2. Kjør Ford-Fulkerson på G′.
3. Matchingen er kantene (u, v) med u ∈ L, v ∈ R og f(u, v) = 1.

### Trinn for trinn (Z3)

Den fjerde iterasjonen i figuren går baklengs langs to kanter. Da tas to kanter ut av matchingen og tre nye kommer inn, så matchingen vokser likevel med én. Det er oppheving i praksis.

<div class="algwidget" data-widget="bipartite-matching"></div>
<p class="algwidget-caption">Maksimum bipartitt matching med Edmonds-Karp · interaktiv</p>

### Korrekthet (Z4)

- **Lemma 24.9:** en matching M i G gir en heltallig flyt f i G′ med |f| = |M|, og omvendt. (Send 1 langs s → u → v → t for hver (u, v) ∈ M. Omvendt: hver u ∈ L får høyst 1 inn fra s, så høyst én kant ut av u har flyt 1, og tilsvarende for v ∈ R.)
- **Heltallsteoremet** gir at Ford-Fulkerson finner en heltallig flyt, altså 0 eller 1 på hver kant.
- **Korollar 24.11:** størrelsen på en maksimum matching er lik verdien av en maks flyt i G′.

### Styrker og svakheter (Z5)

- **Styrker:** gjenbruker en generell algoritme. Viser kraften i reduksjoner (L13).
- **Svakheter:** spesialiserte algoritmer (Hopcroft-Karp, avsnitt 25.1) er raskere: O(√V · E).

### Kjøretid (Z6)

En matching har høyst min(|L|, |R|) = O(V) kanter, så |f*| = O(V). Ford-Fulkerson bruker O(E′ |f*|) = **O(VE)**.

### Reduksjoner til maks flyt (L13)

Oppskriften er alltid den samme:

1. **Modeller** problemet som et flytnett: hva er noder, kanter og kapasiteter, og hva er s og t?
2. **Vis begge veier:** en løsning på problemet gir en flyt med tilsvarende verdi, og en (heltallig) flyt gir en løsning.
3. **Bruk heltallsteoremet** når løsningen må være heltallig.

Nyttige triks:

- **Nodekapasiteter:** del noden v i v_inn og v_ut med en kant (v_inn, v_ut) med kapasitet lik nodekapasiteten.
- **Flere kilder eller sluk:** superkilde og supersluk (L2).
- **Kantdisjunkte stier fra s til t:** kapasitet 1 på alle kanter. Maks flyt er antall kantdisjunkte stier.
- **Tildelingsproblemer** (personer til vakter, studenter til prosjekter): kilde → personer (kapasitet = hvor mange hver kan ta), personer → oppgaver (1 der det er lov), oppgaver → sluk (kapasitet = hvor mange hver trenger).

### Sjekk deg selv

1. Hvordan bygges flytnettet for bipartitt matching?
2. Hvorfor er flyten på hver kant 0 eller 1?
3. Hva er kjøretiden, og hvorfor?
4. Hvordan håndterer du kapasitet på nodene i stedet for kantene?

??? success "Fasit"

    1. Legg til s med kant til hver node i L, t med kant fra hver node i R, og rett kantene fra L til R. Alle kapasiteter er 1.
    2. Alle kapasiteter er heltall (1), så heltallsteoremet gir en heltallig maks flyt, og 0 ≤ f ≤ 1.
    3. O(VE): maks flyt er høyst O(V), og hver iterasjon tar O(E).
    4. Del hver node v i v_inn og v_ut med kanten (v_inn, v_ut) med nodens kapasitet. Kanter inn går til v_inn, kanter ut går fra v_ut.
