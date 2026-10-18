# 8. Minimale spenntrær

Vi har en sammenhengende, urettet graf med vekter på kantene, og vil beholde akkurat de kantene som trengs for å koble sammen alle nodene, med så lav vektsum som mulig. Det er erke-eksempelet på grådighet: velg én kant om gangen, alltid den billigste lovlige. Kruskal og Prim er to måter å avgjøre hva «lovlig» betyr. Kruskal trenger en datastruktur for disjunkte mengder, så den kommer først.

**Læringsmål fra F9**

- [I1] Forstå skog-implementasjonen av disjunkte mengder (Connected-Components, Same-Component, Make-Set, Union, Link, Find-Set)
- [I2] Vite hva spenntrær og minimale spenntrær er
- [I3] Forstå Generic-MST
- [I4] Forstå når og hvorfor lette kanter er trygge kanter
- [I5] Forstå MST-Kruskal
- [I6] Forstå MST-Prim, inkludert kjøretid med Fibonacci-haug (hvordan Fibonacci-hauger virker, kreves ikke)

**Pensum:** kap. 19 (innledning, 19.1 og 19.3) og kap. 21.

!!! tip "Ukens snubletråd"
    Hvis du forstår hvorfor det er trygt å velge den letteste kanten over et snitt som respekterer løsningen du har bygget så langt, har du grunnlaget for resten av stoffet denne uken.

## Disjunkte mengder (F9)

En datastruktur for disjunkte mengder holder styr på en samling mengder som ikke overlapper. Hver mengde har en **representant**, et av elementene i mengden. Vi trenger tre operasjoner: lage en ny mengde, slå sammen to mengder og finne representanten for et element. Kjøretiden for m operasjoner, der n er Make-Set, blir O(m α(n)), som i praksis er lineært.

**Læringsmål:** [I1] Forstå skog-implementasjonen av disjunkte mengder.

### Problemet (Z1)

Datastrukturen skal støtte:

- **Make-Set(x):** lag en ny mengde {x}. x er ikke med i noen annen mengde.
- **Union(x, y):** slå sammen mengdene som inneholder x og y til én.
- **Find-Set(x):** returner representanten for mengden som inneholder x. To elementer er i samme mengde hvis og bare hvis Find-Set gir samme svar for begge.

### Krav og forutsetninger (Z2)

- Mengdene må være disjunkte. Union fjerner de to gamle mengdene.
- Representanten kan være hvilket som helst element, men den må være den samme så lenge mengden ikke endres.

### Pseudokode

Hver mengde er et **tre** der hver node har en foreldrepeker x.p. Roten er representanten og peker på seg selv. x.rank er en øvre grense for høyden til x.

```text
MAKE-SET(x)
1  x.p = x
2  x.rank = 0

UNION(x, y)
1  LINK(FIND-SET(x), FIND-SET(y))

LINK(x, y)                     // x og y er røtter
1  if x.rank > y.rank
2      y.p = x
3  else x.p = y
4      if x.rank == y.rank
5          y.rank = y.rank + 1

FIND-SET(x)
1  if x ≠ x.p                 // ikke roten?
2      x.p = FIND-SET(x.p)    // roten blir forelder
3  return x.p                 // returner roten
```

To heuristikker gjør treet flatt:

- **Union by rank (Link):** roten med lavest rang henges under den med høyest. Rangen øker bare når to like høye trær slås sammen. Uten stikomprimering er rang lik høyden, og høyden blir høyst lg n.
- **Stikomprimering (Find-Set):** Find-Set er rekursiv. På vei tilbake fra rekursjonen settes alle nodene på stien til å peke rett på roten. Rangen oppdateres ikke, så den blir bare en øvre grense for høyden.

**Sammenhengende komponenter (19.1).** Mengdene kan brukes til å finne komponentene i en graf, også når nye kanter dukker opp over tid. Det er også en oppvarming til Kruskal:

```text
CONNECTED-COMPONENTS(G)
1  for each vertex v ∈ G.V
2      MAKE-SET(v)
3  for each edge (u, v) ∈ G.E
4      if FIND-SET(u) ≠ FIND-SET(v)
5          UNION(u, v)

SAME-COMPONENT(u, v)
1  if FIND-SET(u) == FIND-SET(v)
2      return TRUE
3  else return FALSE
```

### Trinn for trinn (Z3)

Figuren gjør Make-Set på a–h, så en rekke Union-kall, og til slutt to Find-Set-kall som viser stikomprimering. Legg merke til at Union bruker Find-Set først, så Link bare kobler røtter.

<div class="algwidget" data-widget="disjoint-sets"></div>
<p class="algwidget-caption">Disjunkte mengder med union by rank og stikomprimering · interaktiv</p>

### Korrekthet (Z4)

- **Invarianter:** hver mengde er nøyaktig nodene i ett tre, og roten peker på seg selv. Make-Set lager et tre med én node. Link henger én rot under en annen, så to trær blir ett. Find-Set følger foreldrepekere til roten og endrer bare hvor nodene på stien peker, ikke hvilket tre de er i.
- **Rang:** x.rank < x.p.rank for alle x som ikke er røtter. Link henger den laveste under, og øker rangen ved likhet. Derfor er rang en øvre grense for høyden, også etter stikomprimering (som bare gjør trærne lavere).
- **Connected-Components:** etter løkken er u og v i samme mengde hvis og bare hvis det finnes en sti mellom dem. Hver kant slår sammen endepunktenes mengder, og mengder slås bare sammen langs kanter.

### Styrker og svakheter (Z5)

- **Styrker:** nesten konstant tid per operasjon, og svært enkel å implementere. Passer når kanter kommer til underveis (dynamisk sammenheng).
- **Svakheter:** kan ikke dele mengder opp igjen eller fjerne elementer. For en fast graf finner DFS eller BFS komponentene i Θ(V + E) like greit.

### Kjøretid (Z6)

| Variant | m operasjoner, n Make-Set |
| --- | --- |
| Ingen heuristikker | O(mn) i verste fall (trærne kan bli lange lenker) |
| Bare union by rank | O(m lg n) |
| Begge heuristikkene | O(m α(n)) (Teorem 19.14) |

α(n) er den inverse av Ackermann-funksjonen og vokser ekstremt sakte: α(n) ≤ 4 for alle n ≤ 16 512 og i praksis for alle tenkelige n. Connected-Components bruker V Make-Set og O(E) Find-Set og Union, altså O((V + E) α(V)).

### Sjekk deg selv

1. Hvorfor er rangen bare en øvre grense for høyden, og ikke høyden selv?
2. Hva gjør Link hvis de to røttene har samme rang?
3. Hvorfor kaller Union Find-Set før Link?
4. Når er Connected-Components å foretrekke framfor DFS?

??? success "Fasit"

    1. Stikomprimering gjør trærne lavere, men Find-Set oppdaterer ikke rangene. Rangen er høyden treet ville hatt uten komprimering.
    2. Den første roten henges under den andre (x.p = y), og rangen til den andre øker med 1.
    3. Link forutsetter at argumentene er røtter. Find-Set finner røttene, altså representantene.
    4. Når kantene kommer til over tid, slik at komponentene må oppdateres underveis. For en fast graf er DFS like rask.

## Spenntrær og Generic-MST (F9)

Et **spenntre** for en sammenhengende, urettet graf G = (V, E) er en delmengde T ⊆ E som kobler sammen alle nodene og ikke har sykler. Det har nøyaktig |V| − 1 kanter. Et **minimalt spenntre** (MST) har minst mulig totalvekt w(T) = Σ w(u, v) over (u, v) ∈ T. Generic-MST bygger et MST grådig ved å legge til én **trygg** kant om gangen.

**Læringsmål fra F9 som gjelder her**

- [I2] Vite hva spenntrær og minimale spenntrær er
- [I3] Forstå Generic-MST
- [I4] Forstå når og hvorfor lette kanter er trygge kanter

### Problemet (Z1)

- **Input:** en sammenhengende, urettet graf G = (V, E) og en vektfunksjon w : E → ℝ.
- **Output:** en asyklisk delmengde T ⊆ E som kobler sammen alle nodene i V, og som minimerer w(T).

Med positive vekter blir en billigste sammenkoblende delmengde automatisk asyklisk (en sykel kunne miste en kant). Negative vekter er lov, men da må vi kreve at T er asyklisk.

### Begreper

| Begrep | Betydning |
| --- | --- |
| Snitt (S, V − S) | En todeling av nodene |
| Kanten (u, v) **krysser** snittet | u og v er på hver sin side |
| Snittet **respekterer** A | Ingen kant i A krysser snittet |
| **Lett kant** over et snitt | En kant som krysser snittet og har minst vekt av alle kantene som krysser det (det kan være flere) |
| **Trygg kant** for A | En kant (u, v) slik at A ∪ {(u, v)} fortsatt er en delmengde av et MST |

### Pseudokode

```text
GENERIC-MST(G, w)
1  A = ∅
2  while A ikke er et spenntre
3      finn en kant (u, v) som er trygg for A
4      A = A ∪ {(u, v)}
5  return A
```

**Invariant:** før hver iterasjon er A en delmengde av et MST. Initielt er A = ∅, som er en delmengde av ethvert MST. Siden vi bare legger til trygge kanter, holder invarianten. Løkken går |V| − 1 ganger, og da er A et spenntre og en delmengde av et MST, altså et MST.

### Korrekthet: lette kanter er trygge (Z4, I4)

**Teorem 21.1.** La A være en delmengde av et MST, la (S, V − S) være et snitt som respekterer A, og la (u, v) være en lett kant over snittet. Da er (u, v) trygg for A.

*Bevis (klipp og lim):* La T være et MST som inneholder A. Hvis (u, v) ∈ T, er vi ferdige. Ellers danner (u, v) en sykel med den enkle stien p fra u til v i T. Siden u og v er på hver sin side av snittet, må minst én kant (x, y) på p også krysse snittet. (x, y) er ikke i A, fordi snittet respekterer A. Fjern (x, y) og legg til (u, v): T′ = T − {(x, y)} ∪ {(u, v)} er et spenntre. Siden (u, v) er lett, er w(u, v) ≤ w(x, y), så w(T′) ≤ w(T). Altså er T′ også et MST, og det inneholder A ∪ {(u, v)}.

**Korollar 21.2.** Hvis C er en sammenhengende komponent (et tre) i skogen (V, A), og (u, v) er en lett kant som kobler C til en annen komponent, er (u, v) trygg for A. (Bruk snittet (C, V − C).)

!!! note "Trygg er ikke det samme som lett"
    En trygg kant trenger ikke være lett over et gitt snitt (oppgave 21.1-2). Teoremet sier bare at lette kanter over et respekterende snitt alltid er trygge.

### Sjekk deg selv

1. Hvor mange kanter har et spenntre for en graf med n noder?
2. Hva betyr det at et snitt respekterer A?
3. Hvorfor må det finnes en kant (x, y) på stien p som krysser snittet?
4. Hvorfor kan ikke (x, y) være i A?

??? success "Fasit"

    1. n − 1.
    2. Ingen kant i A krysser snittet.
    3. Stien går fra u på den ene siden til v på den andre, så den må krysse snittet minst én gang.
    4. Snittet respekterer A, så ingen kant i A krysser det.

## MST-Kruskal (F9)

Kruskal sorterer kantene etter vekt og går gjennom dem fra den letteste. En kant tas med hvis den kobler sammen to ulike trær i skogen A, og forkastes hvis den ville gitt en sykel. Mengdene i en disjunkt-mengde-struktur er trærne. Kjøretiden er O(E lg V).

**Læringsmål:** [I5] Forstå MST-Kruskal.

### Problemet (Z1)

Som for Generic-MST: finn et minimalt spenntre for en sammenhengende, urettet, vektet graf.

### Krav og forutsetninger (Z2)

- Grafen må være sammenhengende for å få et spenntre. Ellers gir Kruskal en minimal spennskog, ett tre per komponent.
- Vekter kan være negative. Like vekter er greit; da kan det finnes flere MST-er.

### Pseudokode

```text
MST-KRUSKAL(G, w)
1   A = ∅
2   for each vertex v ∈ G.V
3       MAKE-SET(v)
4   lag én liste over kantene i G.E
5   sorter listen stigende etter vekt w
6   for each edge (u, v) i sortert rekkefølge
7       if FIND-SET(u) ≠ FIND-SET(v)
8           A = A ∪ {(u, v)}
9           UNION(u, v)
10  return A
```

### Trinn for trinn (Z3)

Kantene behandles i sortert rekkefølge. Fargene viser hvilke noder som er i samme tre. En kant mellom to noder med samme farge forkastes.

<div class="algwidget" data-widget="mst-kruskal"></div>
<p class="algwidget-caption">MST-Kruskal på bokas figur 21.1 og 21.4 · interaktiv</p>

Kruskal tar med (a, h) og forkaster (b, c), mens figur 21.1 viser treet med (b, c). Begge har vekt 37. Like vekter gir altså flere minimale spenntrær.

### Korrekthet (Z4)

Kruskal er Generic-MST der A er en skog. Når (u, v) tas med, ligger u og v i ulike trær C₁ og C₂. Alle lettere kanter er allerede behandlet: enten er de med i A, eller de lå innenfor ett tre. Ingen lettere kant forbinder altså C₁ med et annet tre, så (u, v) er en lett kant som kobler C₁ til en annen komponent. Etter korollar 21.2 er den trygg.

### Styrker og svakheter (Z5)

- **Styrker:** enkel. Rask på tynne grafer, og trenger bare en kantliste. Gir en minimal spennskog også for usammenhengende grafer.
- **Svakheter:** sorteringen dominerer kjøretiden. På tette grafer er Prim med Fibonacci-haug (eller tabell) bedre.
- **Mot Prim:** Kruskal vokser en skog av mange trær som slås sammen. Prim vokser ett tre fra en rot.

### Kjøretid (Z6)

- Linje 1–3: O(1) + V Make-Set.
- Linje 4–5: sortering, O(E lg E).
- Linje 6–9: O(E) Find-Set og Union. Med begge heuristikkene tar alle mengdeoperasjonene O((V + E) α(V)) = O(E α(V)), siden E ≥ V − 1 i en sammenhengende graf.

Totalt O(E lg E). Siden E < V², er lg E = O(lg V), så kjøretiden er O(E lg V). Er kantene allerede sortert, eller kan de sorteres i lineær tid, blir den O(E α(V)).

### Sjekk deg selv

1. Hvorfor brukes disjunkte mengder i Kruskal?
2. Hva er flaskehalsen i kjøretiden?
3. Hvorfor er kanten Kruskal velger alltid trygg?
4. Hva gir Kruskal hvis grafen ikke er sammenhengende?

??? success "Fasit"

    1. For å avgjøre raskt om u og v allerede er i samme tre (Find-Set), og for å slå sammen trær (Union).
    2. Sorteringen av kantene, O(E lg E) = O(E lg V).
    3. Alle lettere kanter er behandlet, så kanten er lett blant kantene som kobler treet til u med resten. Korollar 21.2 gir at den er trygg.
    4. En minimal spennskog: ett minimalt spenntre per sammenhengende komponent.

## MST-Prim (F9)

Prim vokser ett tre fra en vilkårlig rot r. I hvert steg legges den letteste kanten mellom treet og en node utenfor til. En min-prioritetskø Q holder nodene utenfor treet, med nøkkelen v.key: vekten på den letteste kanten fra v til treet. Algoritmen ligner Dijkstra og er traversering med prioritetskø (appendiks F). Kjøretiden er O(E lg V) med binærhaug og O(E + V lg V) med Fibonacci-haug.

**Læringsmål:** [I6] Forstå MST-Prim, inkludert kjøretid med Fibonacci-haug.

### Problemet (Z1)

- **Input:** en sammenhengende, urettet graf G = (V, E), vektfunksjon w og en rot r ∈ V.
- **Output:** v.π for hver node. Kantene A = {(v, v.π) : v ∈ V − {r}} er et minimalt spenntre.

### Krav og forutsetninger (Z2)

- Grafen må være sammenhengende. Ellers når treet bare komponenten til r.
- Q må støtte Insert, Extract-Min og Decrease-Key. For å sjekke v ∈ Q i konstant tid holder vi et flagg per node.

### Pseudokode

```text
MST-PRIM(G, w, r)
1   for each vertex u ∈ G.V
2       u.key = ∞
3       u.π = NIL
4   r.key = 0
5   Q = ∅
6   for each vertex u ∈ G.V
7       INSERT(Q, u)
8   while Q ≠ ∅
9       u = EXTRACT-MIN(Q)          // legg u til treet
10      for each vertex v in G.Adj[u] // oppdater naboene utenfor treet
11          if v ∈ Q and w(u, v) < v.key
12              v.π = u
13              v.key = w(u, v)
14              DECREASE-KEY(Q, v, w(u, v))
```

### Trinn for trinn (Z3)

Roten a har key 0 og tas ut først. Hver gang en node u tas ut, får naboene utenfor treet kanskje lavere key, fordi u gir dem en lettere kant inn i treet. Den neste noden som tas ut er alltid den som har den letteste kanten over snittet mellom treet og resten.

<div class="algwidget" data-widget="mst-prim"></div>
<p class="algwidget-caption">MST-Prim på bokas figur 21.1 og 21.5 med rot a · interaktiv</p>

Ved likhet (c og h har begge key 8 etter at b er tatt ut) velger figuren alfabetisk, som boka.

### Korrekthet (Z4)

**Invariant** (før hver iterasjon av while-løkken):

1. A = {(v, v.π) : v ∈ V − {r} − Q}.
2. Nodene som er i treet, er V − Q.
3. For hver v ∈ Q med v.π ≠ NIL er v.key < ∞ vekten på en lett kant (v, v.π) fra v til en node i treet.

Linje 9 tar ut noden u med minst key, som altså har den letteste kanten over snittet (V − Q, Q). Snittet respekterer A, fordi alle kantene i A ligger innenfor treet. Etter korollar 21.2 er (u, u.π) trygg. Linje 10–14 vedlikeholder del 3 for naboene til u. Når Q er tom, er A et MST.

### Styrker og svakheter (Z5)

- **Styrker:** god på tette grafer, særlig med Fibonacci-haug eller med en tabell som Q (O(V²), som er optimalt når E = Θ(V²)).
- **Svakheter:** trenger en prioritetskø med Decrease-Key. Gir bare treet for komponenten til r.
- **Mot Kruskal:** samme asymptotiske tid med binærhaug. Prim er bedre for tette grafer, Kruskal er enklere og bra for tynne.
- **Mot Dijkstra:** samme struktur, men nøkkelen er vekten på én kant, ikke avstanden fra roten.

### Kjøretid (Z6)

While-løkken går |V| ganger, og løkken i linje 10–14 går totalt 2|E| ganger (summen av lengdene på nabolistene).

| Q implementert som | Insert (V ganger) | Extract-Min (V ganger) | Decrease-Key (O(E) ganger) | Totalt |
| --- | --- | --- | --- | --- |
| Binær min-haug | O(V) samlet med Build-Min-Heap | O(lg V) | O(lg V) | O(E lg V) |
| Fibonacci-haug | O(1) amortisert | O(lg V) amortisert | O(1) amortisert | **O(E + V lg V)** |
| Usortert tabell | O(1) | O(V) | O(1) | O(V²) |

Med Fibonacci-haug: V · O(lg V) for Extract-Min pluss E · O(1) for Decrease-Key gir O(E + V lg V).

### Sjekk deg selv

1. Hva betyr v.key i Prim?
2. Hvorfor er kanten (u, u.π) trygg når u tas ut av Q?
3. Hva blir kjøretiden med Fibonacci-haug, og hvorfor?
4. Hva er forskjellen på Prim og Dijkstra?

??? success "Fasit"

    1. Vekten på den letteste kanten fra v til en node som allerede er i treet (∞ hvis ingen).
    2. u har minst key, så (u, u.π) er en lett kant over snittet (V − Q, Q), som respekterer A. Korollar 21.2 gir at den er trygg.
    3. O(E + V lg V): V Extract-Min til O(lg V) amortisert og O(E) Decrease-Key til O(1) amortisert.
    4. Prim bruker vekten på én kant som nøkkel (w(u, v)); Dijkstra bruker avstanden fra kilden (u.d + w(u, v)).
