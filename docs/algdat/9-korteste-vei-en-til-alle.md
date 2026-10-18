# 9. Korteste vei fra én til alle

BFS finner stier med færrest mulig kanter, men hva om kantene har ulik lengde? Det generelle problemet er uløst, men vi kan løse det med gradvis bedre kjøretid for grafer (1) uten negative sykler (Bellman-Ford), (2) uten sykler (Dag-Shortest-Paths) og (3) uten negative kanter (Dijkstra). Alle tre bruker samme prinsipp: start med for høye estimater og senk dem med **Relax**.

**Læringsmål fra F10 som gjelder hele kategorien**

- [J1] Forstå ulike varianter av korteste-vei-problemet (single-source, single-destination, single-pair, all-pairs)
- [J2] Forstå strukturen til korteste-vei-problemet
- [J3] Forstå at korteste enkle vei kan eksistere selv om en negativ sykel hindrer at korteste vei gjør det
- [J4] Forstå reduksjoner mellom korteste enkle vei og lengste enkle vei
- [J5] Forstå hvordan man kan representere et korteste-vei-tre
- [J6] Forstå kant-oppdatering (edge relaxation) og Relax
- [J7] Forstå egenskapene ved korteste veier og oppdatering

**Pensum:** kap. 22, innledning og 22.1–22.3.

!!! tip "Ukens snubletråd"
    Anta at det finnes en sti fra s til t. Den korteste stien er alltid enkel, om den finnes, og kan finnes i polynomisk tid. Den korteste *enkle* stien finnes alltid, men vi kan ikke finne den i polynomisk tid (med mindre P = NP).

## Grunnbegreper (J1–J5)

**Vekter og avstand.** I en rettet graf med vektfunksjon w : E → ℝ er vekten til en sti p = ⟨v₀, v₁, …, vₖ⟩ summen w(p) = Σ w(vᵢ₋₁, vᵢ). Den korteste avstanden er

δ(u, v) = min{w(p) : p er en sti fra u til v}, eller ∞ hvis det ikke finnes noen sti.

**Varianter (J1).**

| Variant | Spørsmål | Løsning |
| --- | --- | --- |
| Single-source | Fra s til alle noder | Dette kapitlet |
| Single-destination | Fra alle noder til t | Snu alle kantene og løs single-source fra t |
| Single-pair | Fra u til v | Ingen kjent algoritme er asymptotisk raskere enn single-source |
| All-pairs | Mellom alle par | Kategori 10 (Floyd-Warshall), eller single-source fra hver node |

**Optimal delstruktur (J2).** Delstier av korteste stier er korteste stier (Lemma 22.1). Hvis en delsti kunne vært kortere, kunne vi byttet den inn og fått en kortere sti totalt. Derfor passer både grådighet (Dijkstra) og dynamisk programmering (Dag-Shortest-Paths, Floyd-Warshall).

**Negative kanter og sykler (J3).**

- Negative kanter er greit, så lenge det ikke finnes en **negativ sykel** som kan nås fra s. Går det an å gå rundt en negativ sykel, kan stien bli vilkårlig kort, og δ(s, v) = −∞ for alle v som kan nås via sykelen.
- En korteste sti har aldri en sykel: en positiv sykel kan fjernes for å gjøre stien kortere, en sykel med vekt 0 kan fjernes uten å endre vekten, og en negativ sykel gjør at ingen korteste sti finnes. Korteste stier har derfor høyst |V| − 1 kanter.
- Den korteste **enkle** stien (uten gjentatte noder) finnes alltid når det finnes en sti, siden det er endelig mange enkle stier. Men den er NP-hard å finne.

**Korteste og lengste enkle vei (J4).** Ved å snu fortegnet på alle vektene blir lengste enkle vei til korteste enkle vei, og omvendt. Problemene er altså like vanskelige. Lengste enkle vei er NP-hard (kategori 12), så det er også korteste enkle vei i grafer med negative sykler. Korteste vei uten negative sykler er lett fordi en korteste vei da automatisk er enkel.

**Korteste-vei-treet (J5).** Hver node har en forgjenger v.π. Forgjengerdelgrafen G_π har kantene {(v.π, v) : v.π ≠ NIL}. Når algoritmene er ferdige, er G_π et **korteste-vei-tre** med rot s: det inneholder alle nodene som kan nås fra s, og den unike stien fra s til v i treet er en korteste vei. Stien finnes ved å følge π bakover, som med Print-Path fra BFS.

## Relax og egenskapene (J6, J7)

Alle algoritmene i kapitlet holder et **estimat** v.d ≥ δ(s, v) og senker det med kant-oppdatering.

```text
INITIALIZE-SINGLE-SOURCE(G, s)
1  for each vertex v ∈ G.V
2      v.d = ∞
3      v.π = NIL
4  s.d = 0

RELAX(u, v, w)
1  if v.d > u.d + w(u, v)
2      v.d = u.d + w(u, v)
3      v.π = u
```

Relax spør: blir veien til v kortere hvis vi går via u? I så fall oppdateres estimatet og forgjengeren. Algoritmene skiller seg bare i **hvor mange ganger og i hvilken rekkefølge** kantene relakseres: Bellman-Ford relakserer hver kant |V| − 1 ganger, Dag-Shortest-Paths og Dijkstra hver kant nøyaktig én gang.

**Egenskapene (J7).** Alle forutsetter at grafen er initialisert med Initialize-Single-Source og bare endres med Relax.

| Egenskap | Innhold |
| --- | --- |
| Trekantulikheten (Lemma 22.10) | δ(s, v) ≤ δ(s, u) + w(u, v) for hver kant (u, v) |
| Øvre grense (Lemma 22.11) | v.d ≥ δ(s, v) hele tiden. Når v.d = δ(s, v), endres den aldri mer |
| Ingen sti (Korollar 22.12) | Finnes det ingen sti fra s til v, er v.d = δ(s, v) = ∞ hele tiden |
| Konvergens (Lemma 22.14) | Hvis s ⇝ u → v er en korteste vei og u.d = δ(s, u) før (u, v) relakseres, er v.d = δ(s, v) etterpå |
| Sti-relaksering (Lemma 22.15) | Hvis p = ⟨v₀, …, vₖ⟩ er en korteste vei fra s = v₀, og kantene på p relakseres i rekkefølge (gjerne med andre relakseringer innimellom), er vₖ.d = δ(s, vₖ) etterpå |
| Forgjengerdelgraf (Lemma 22.17) | Når v.d = δ(s, v) for alle v, er G_π et korteste-vei-tre med rot s |

Sti-relaksering er nøkkelen i alle tre korrekthetsbevisene: algoritmene sørger, hver på sin måte, for at kantene på enhver korteste vei blir relaksert i riktig rekkefølge.

### Sjekk deg selv

1. Hvorfor har en korteste vei høyst |V| − 1 kanter når det ikke finnes negative sykler?
2. Hvordan løser du single-destination med en single-source-algoritme?
3. Hva sier sti-relakseringsegenskapen?
4. Hvorfor er det lett å finne korteste vei, men vanskelig å finne korteste *enkle* vei, når det finnes negative sykler?

??? success "Fasit"

    1. En korteste vei kan velges uten sykler, og en enkel sti gjennom |V| noder har høyst |V| − 1 kanter.
    2. Snu alle kantene og kjør fra målnoden t.
    3. Hvis kantene på en korteste vei relakseres i rekkefølge fra s, er estimatet til siste node riktig etterpå, uansett hvilke andre kanter som relakseres innimellom.
    4. Med negative sykler finnes ingen korteste vei (den kan bli −∞), og det å finne korteste enkle vei er like vanskelig som lengste enkle vei (snu fortegnet), som er NP-hard.

## Bellman-Ford (F10)

Bellman-Ford løser det generelle tilfellet der vekter kan være negative. Den relakserer alle kantene |V| − 1 ganger, og sjekker til slutt om noen kant fortsatt kan forbedres. Gjør en det, finnes en negativ sykel som kan nås fra s. Kjøretiden er Θ(VE).

**Læringsmål:** [J8] Forstå Bellman-Ford.

### Problemet (Z1)

- **Input:** en rettet graf G = (V, E), vektfunksjon w : E → ℝ og en kilde s.
- **Output:** TRUE og v.d = δ(s, v), v.π for alle v hvis ingen negativ sykel kan nås fra s. Ellers FALSE.

### Krav og forutsetninger (Z2)

- Ingen krav til vektene. Algoritmen *oppdager* negative sykler som kan nås fra s, i stedet for å forutsette at de ikke finnes.
- Negative sykler som ikke kan nås fra s, påvirker ikke resultatet.

### Pseudokode

```text
BELLMAN-FORD(G, w, s)
1  INITIALIZE-SINGLE-SOURCE(G, s)
2  for i = 1 to |G.V| − 1
3      for each edge (u, v) ∈ G.E
4          RELAX(u, v, w)
5  for each edge (u, v) ∈ G.E
6      if v.d > u.d + w(u, v)
7          return FALSE
8  return TRUE
```

### Trinn for trinn (Z3)

Hver runde relakserer alle kantene i samme rekkefølge. Etter runde i er alle korteste veier med høyst i kanter funnet. Bruk **Hele runden** for å hoppe fram én runde om gangen.

<div class="algwidget" data-widget="bellman-ford"></div>
<p class="algwidget-caption">Bellman-Ford på bokas figur 22.4 · interaktiv</p>

### Korrekthet (Z4)

**Lemma 22.2.** Finnes det ingen negativ sykel som kan nås fra s, er v.d = δ(s, v) for alle v som kan nås fra s etter |V| − 1 runder.

*Bevis:* La p = ⟨v₀, v₁, …, vₖ⟩ være en korteste vei fra s = v₀ til v = vₖ, med k ≤ |V| − 1 kanter. I runde i relakseres blant annet kanten (vᵢ₋₁, vᵢ). Kantene på p blir altså relaksert i rekkefølge, én per runde, og sti-relakseringsegenskapen gir vₖ.d = δ(s, vₖ).

**Teorem 22.4.**

- *Ingen negativ sykel:* d-verdiene er riktige, og etter trekantulikheten er v.d = δ(s, v) ≤ δ(s, u) + w(u, v) = u.d + w(u, v) for alle kanter. Testen i linje 6 slår aldri til, og algoritmen returnerer TRUE.
- *Negativ sykel c = ⟨v₀, …, vₖ⟩ med v₀ = vₖ som kan nås:* anta at algoritmen returnerer TRUE. Da er vᵢ.d ≤ vᵢ₋₁.d + w(vᵢ₋₁, vᵢ) for alle i. Summerer vi rundt sykelen, forekommer hver node én gang på hver side, så d-leddene kansellerer, og vi får 0 ≤ Σ w(vᵢ₋₁, vᵢ). Det motsier at sykelen er negativ.

### Styrker og svakheter (Z5)

- **Styrker:** håndterer negative vekter og oppdager negative sykler. Enkel. Kan brukes til systemer av differanseulikheter.
- **Svakheter:** Θ(VE) er tregt sammenlignet med Dijkstra og Dag-Shortest-Paths.
- **Forbedring:** kan stoppe tidlig hvis en hel runde ikke endrer noe.

### Kjøretid (Z6)

Initialisering Θ(V). Linje 2–4: |V| − 1 runder med |E| relakseringer à Θ(1), altså Θ(VE). Linje 5–7: Θ(E). Totalt **Θ(VE)** med nabolister.

### Sjekk deg selv

1. Hvorfor holder det med |V| − 1 runder?
2. Hvordan oppdager Bellman-Ford en negativ sykel?
3. Hva skjer med en negativ sykel som ikke kan nås fra s?
4. Hvorfor kansellerer d-leddene i beviset for den negative sykelen?

??? success "Fasit"

    1. En korteste vei har høyst |V| − 1 kanter, og hver runde relakserer neste kant på veien (sti-relaksering).
    2. Kan en kant fortsatt forbedres etter |V| − 1 runder (v.d > u.d + w(u, v)), finnes en negativ sykel som kan nås fra s.
    3. Ingenting. Nodene på den har d = ∞, og ∞ > ∞ + w er usant, så testen slår ikke til.
    4. Hver node på sykelen forekommer én gang som vᵢ og én gang som vᵢ₋₁, så Σ vᵢ.d = Σ vᵢ₋₁.d.

## Dag-Shortest-Paths (F10)

I en rettet asyklisk graf (DAG) kan vi sortere nodene topologisk og så relaksere kantene ut fra hver node i den rekkefølgen. Da blir kantene på enhver sti relaksert i riktig rekkefølge, og vi trenger bare én gjennomgang. Negative vekter er greit, siden det ikke finnes sykler. Kjøretiden er Θ(V + E).

**Læringsmål fra F10 som gjelder her**

- [J9] Forstå Dag-Shortest-Paths
- [J10] Forstå koblingen mellom Dag-Shortest-Paths og dynamisk programmering

### Problemet (Z1)

- **Input:** en vektet DAG G = (V, E), vektfunksjon w : E → ℝ og en kilde s.
- **Output:** v.d = δ(s, v) og v.π for alle v.

### Krav og forutsetninger (Z2)

- Grafen må være asyklisk. Vektene kan være negative.

### Pseudokode

```text
DAG-SHORTEST-PATHS(G, w, s)
1  sorter nodene i G topologisk
2  INITIALIZE-SINGLE-SOURCE(G, s)
3  for each vertex u ∈ G.V, i topologisk sortert rekkefølge
4      for each vertex v in G.Adj[u]
5          RELAX(u, v, w)
```

### Trinn for trinn (Z3)

Nodene står i topologisk rekkefølge fra venstre mot høyre. Alle kanter går mot høyre, så når vi kommer til en node, er alle kantene inn til den allerede relaksert, og estimatet er endelig.

<div class="algwidget" data-widget="dag-shortest-paths"></div>
<p class="algwidget-caption">Dag-Shortest-Paths på bokas figur 22.5 med kilde s · interaktiv</p>

### Korrekthet (Z4)

**Teorem 22.5.** Kan v ikke nås fra s, er v.d = ∞ = δ(s, v) (ingen sti-egenskapen). Ellers, la p = ⟨v₀, …, vₖ⟩ være en korteste vei fra s. Siden nodene behandles i topologisk rekkefølge, relakseres (v₀, v₁), (v₁, v₂), …, (vₖ₋₁, vₖ) i den rekkefølgen. Sti-relaksering gir vᵢ.d = δ(s, vᵢ). Forgjengerdelgraf-egenskapen gir at G_π er et korteste-vei-tre.

### Kobling til dynamisk programmering (J10)

Dag-Shortest-Paths **er** dynamisk programmering. Delproblemene er δ(s, v) for hver node v, og rekursjonen er

δ(s, v) = min{δ(s, u) + w(u, v) : (u, v) ∈ E}, med δ(s, s) = 0.

Delinstansgrafen er selve grafen. Bottom-up DP må løse delinstansene i topologisk rekkefølge, slik at alt v avhenger av er løst først, og det er nøyaktig det algoritmen gjør. Den eneste forskjellen er at algoritmen «dytter» verdien videre fra u til naboene (Relax) i stedet for å «trekke» fra forgjengerne. Omvendt kan mange DP-problemer, som stavkapping og LCS, sees som korteste eller lengste vei i delinstansgrafen. I en DAG er også *lengste* vei lett: snu fortegnet på vektene.

### Styrker og svakheter (Z5)

- **Styrker:** lineær tid, og håndterer negative vekter. Brukes til kritisk sti i PERT-diagrammer (lengste vei i en DAG).
- **Svakheter:** virker bare på DAG-er.

### Kjøretid (Z6)

Topologisk sortering Θ(V + E). Initialisering Θ(V). Løkken i linje 3–5 relakserer hver kant nøyaktig én gang: Θ(E) (aggregert analyse). Totalt **Θ(V + E)**.

### Sjekk deg selv

1. Hvorfor holder det å relaksere hver kant én gang i en DAG?
2. Hvorfor kan Dag-Shortest-Paths håndtere negative kanter?
3. Hva er delproblemene hvis vi ser algoritmen som DP?
4. Hvordan finner du lengste vei i en DAG?

??? success "Fasit"

    1. Den topologiske rekkefølgen sørger for at kantene på enhver sti relakseres i rekkefølge, så sti-relaksering gir riktige estimater.
    2. Problemet med negative kanter er negative sykler, og en DAG har ingen sykler.
    3. δ(s, v) for hver node v, med δ(s, v) = min over kanter (u, v) av δ(s, u) + w(u, v).
    4. Snu fortegnet på alle vektene og finn korteste vei, eller bytt min med max i Relax.

## Dijkstra (F10)

Dijkstra generaliserer BFS til vektede grafer uten negative kanter. Den holder en mengde S av noder med endelig avstand, og tar hele tiden ut noden utenfor S med minst estimat. Den noden får endelig avstand, og kantene ut fra den relakseres. Kjøretiden er O((V + E) lg V) med binærhaug og O(V lg V + E) med Fibonacci-haug.

**Læringsmål:** [J11] Forstå Dijkstra, inkludert kjøretid med Fibonacci-haug (hvordan Fibonacci-hauger virker, kreves ikke).

### Problemet (Z1)

- **Input:** en rettet graf G = (V, E), vektfunksjon w med w(u, v) ≥ 0 for alle kanter, og en kilde s.
- **Output:** v.d = δ(s, v) og v.π for alle v.

### Krav og forutsetninger (Z2)

- **Ingen negative kanter.** Beviset bruker at en sti ikke kan bli kortere av å bli lengre. Med negative kanter kan Dijkstra gi feil svar.
- Q må være en min-prioritetskø med Decrease-Key.

### Pseudokode

```text
DIJKSTRA(G, w, s)
1   INITIALIZE-SINGLE-SOURCE(G, s)
2   S = ∅
3   Q = ∅
4   for each vertex u ∈ G.V
5       INSERT(Q, u)
6   while Q ≠ ∅
7       u = EXTRACT-MIN(Q)
8       S = S ∪ {u}
9       for each vertex v in G.Adj[u]
10          RELAX(u, v, w)
11          if kallet på RELAX senket v.d
12              DECREASE-KEY(Q, v, v.d)
```

### Trinn for trinn (Z3)

Svarte noder er i S og har endelig avstand. Hver iterasjon tar ut noden i Q med minst d, som en bølge som brer seg fra s og når nodene i rekkefølge etter avstand.

<div class="algwidget" data-widget="dijkstra"></div>
<p class="algwidget-caption">Dijkstra på bokas figur 22.6 med kilde s · interaktiv</p>

### Korrekthet (Z4)

**Invariant:** ved starten av hver iterasjon er v.d = δ(s, v) for alle v ∈ S (og Q = V − S).

**Teorem 22.6.** Det holder å vise at u.d = δ(s, u) når u legges i S. Anta for selvmotsigelse at u er den første noden der u.d ≠ δ(s, u) når den legges i S. u ≠ s, og det finnes en sti fra s til u (ellers er u.d = ∞ = δ). Se på en korteste vei p fra s til u, og la y være den første noden på p som ikke er i S, med forgjenger x ∈ S.

1. x ble lagt i S med riktig d, og kanten (x, y) ble relaksert da. Konvergens gir y.d = δ(s, y).
2. y kommer før u på en korteste vei, og vektene er ikke-negative, så δ(s, y) ≤ δ(s, u).
3. Både u og y var i Q da u ble valgt, så u.d ≤ y.d.

Sammen: u.d ≤ y.d = δ(s, y) ≤ δ(s, u) ≤ u.d (øvre grense). Altså er u.d = δ(s, u), en selvmotsigelse.

Punkt 2 er der ikke-negative vekter brukes.

### Styrker og svakheter (Z5)

- **Styrker:** raskere enn Bellman-Ford. Med Fibonacci-haug O(V lg V + E). Kan stoppe så snart målnoden tas ut, hvis vi bare trenger single-pair.
- **Svakheter:** tåler ikke negative kanter. Trenger en prioritetskø med Decrease-Key.
- **Mot BFS:** BFS er Dijkstra der alle kanter har vekt 1, og da kan køen være FIFO.
- **Mot Prim:** samme struktur, men nøkkelen er u.d + w(u, v), ikke w(u, v).

### Kjøretid (Z6)

Hver node legges inn og tas ut av Q én gang, og hver kant relakseres én gang, så Decrease-Key kalles høyst |E| ganger.

| Q implementert som | Extract-Min | Decrease-Key | Totalt |
| --- | --- | --- | --- |
| Tabell indeksert på node | O(V) | O(1) | O(V² + E) = O(V²) |
| Binær min-haug | O(lg V) | O(lg V) | O((V + E) lg V), som er O(E lg V) når alle noder kan nås |
| Fibonacci-haug | O(lg V) amortisert | O(1) amortisert | **O(V lg V + E)** |

Tabellen er best for tette grafer (E = Θ(V²)), binærhaugen for tynne.

### Sjekk deg selv

1. Hvor i korrekthetsbeviset trengs det at vektene er ikke-negative?
2. Gi et eksempel der Dijkstra gir feil svar med en negativ kant.
3. Hva er kjøretiden med Fibonacci-haug, og hvorfor?
4. Hvorfor kan Dijkstra stoppe når målnoden t tas ut av Q?

??? success "Fasit"

    1. I steget δ(s, y) ≤ δ(s, u): resten av veien fra y til u kan ikke ha negativ vekt.
    2. Kanter s → a (2), s → b (3), b → a (−2) og a → c (1). Dijkstra tar ut a med d = 2 og gir c d = 3. Senere senker b a.d til 1, men a er allerede behandlet, så kanten (a, c) relakseres ikke på nytt. c.d blir stående på 3, selv om δ(s, c) = 2.
    3. O(V lg V + E): V Extract-Min til O(lg V) amortisert og høyst E Decrease-Key til O(1) amortisert.
    4. Når en node tas ut, er avstanden dens endelig (invarianten), så t.d = δ(s, t) allerede da.
