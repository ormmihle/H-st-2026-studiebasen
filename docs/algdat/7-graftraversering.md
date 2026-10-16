# 7. Graftraversering


Å traversere en graf betyr å besøke nodene vi kan nå. Vi kjenner bare startnoden i utgangspunktet, og oppdager naboene til nodene vi besøker. Hvilken oppdaget node vi besøker neste gang, avgjør hvilken algoritme vi får: BFS tar den eldste, DFS den nyeste. Traversering er nyttig i seg selv og er ryggraden i mer avanserte algoritmer som Prim og Dijkstra.

**Læringsmål fra F8 som gjelder hele kategorien**

- [H1] Forstå hvordan grafer kan implementeres
- [H8] Forstå hva traverseringstrær (som bredde-først- og dybde-først-trær) er
- [H9] Forstå traversering med vilkårlig prioritetskø

## Representasjon av grafer (H1)

En graf G = (V, E) har en nodemengde V og en kantmengde E. Kjøretider skrives med |V| og |E|, ofte forkortet til V og E. To vanlige representasjoner:

|  | Nabolister | Nabomatrise |
| --- | --- | --- |
| Struktur | G.Adj[u] er en liste over naboene til u | A[i, j] = 1 hvis (i, j) ∈ E, ellers 0 |
| Plass | Θ(V + E) | Θ(V²) |
| Er (u, v) en kant? | O(utgraden til u) | Θ(1) |
| Gå gjennom alle naboer til u | Θ(utgraden til u) | Θ(V) |
| Passer for | Tynne grafer (E mye mindre enn V²) | Tette grafer, eller når rask kantoppslag trengs |

I en urettet graf står hver kant to ganger i nabolistene (v i Adj[u] og u i Adj[v]), og matrisen er symmetrisk. Vekter lagres sammen med kanten i listen, eller som verdien i matrisen. Ekstra informasjon om nodene, som farge, avstand og forgjenger, lagres som attributter: v.color, v.d og v.π. Alle algoritmene i denne kategorien bruker nabolister.

## Generell traversering og traverseringstrær (H8, H9)

Appendiks F i pensumheftet beskriver BFS og DFS som varianter av én generell traversering:

- Vi har en samling Q med noder som er **oppdaget**, men ikke **besøkt**. Fargene sporer dette: hvit (ikke oppdaget), grå (i Q) og svart (ferdig).
- I hver iterasjon tas en node u ut av Q og besøkes. Hvite naboer til u oppdages og legges i Q.
- Velger vi vilkårlige noder fra Q, traverserer vi likevel alt som kan nås fra startnoden.

Hvilken node som tas ut, avgjør algoritmen:

| Prioritering i Q | Algoritme |
| --- | --- |
| Eldste først (FIFO-kø) | BFS |
| Nyeste først (LIFO-stakk) | DFS-Visit (samme oppførsel som rekursjonen) |
| Lavest avstandsestimat v.d | Dijkstra (F10) |
| Lettest kant til de besøkte nodene | MST-Prim (F9) |

Prioritetene oppdateres underveis. Andre prioriteringer gir andre algoritmer, som A\* (ikke pensum). Boka setter alle nodene i Q fra starten i Prim og Dijkstra, men ideen er den samme.

**Traverseringstrær (H8).** Når v oppdages fra u, settes v.π = u. Kantene (v.π, v) danner et tre med startnoden som rot: et bredde-først-tre for BFS. DFS, som starter på nytt fra flere noder, gir en dybde-først-skog. Treet er lagret implisitt gjennom π-attributtene, og en sti fra roten til v finnes ved å følge π bakover.

## Bredde-først-søk, BFS (F8)

BFS utforsker grafen lagvis fra startnoden s: først alle noder på avstand 1, så alle på avstand 2, og så videre. Derfor finner den korteste vei, målt i antall kanter, fra s til alle noder den når. Kjøretiden er O(V + E).

**Læringsmål:** [H2] Forstå BFS, også for å finne korteste vei uten vekter (inkludert Print-Path).

### Problemet (Z1)

- **Input:** En graf G = (V, E), rettet eller urettet, representert med nabolister, og en startnode s ∈ V.
- **Output:** For hver node v: v.d = δ(s, v), det minste antall kanter på en sti fra s til v (∞ hvis ingen sti finnes), og v.π, forgjengeren på en slik korteste sti. π-kantene danner et bredde-først-tre.

### Krav og forutsetninger (Z2)

- Grafen er uvektet, eller alle kanter teller like mye. Med vekter trengs Dijkstra eller Bellman-Ford.
- Q må være en FIFO-kø. Det er køen som gir lagvis utforskning og dermed korteste veier.

### Pseudokode

```text
BFS(G, s)
1   for each vertex u ∈ G.V − {s}
2       u.color = WHITE
3       u.d = ∞
4       u.π = NIL
5   s.color = GRAY
6   s.d = 0
7   s.π = NIL
8   Q = ∅
9   ENQUEUE(Q, s)
10  while Q ≠ ∅
11      u = DEQUEUE(Q)
12      for each vertex v in G.Adj[u]     // undersøk naboene til u
13          if v.color == WHITE           // oppdages v nå?
14              v.color = GRAY
15              v.d = u.d + 1
16              v.π = u
17              ENQUEUE(Q, v)             // v er nå på fronten
18      u.color = BLACK                   // u er nå bak fronten

PRINT-PATH(G, s, v)
1  if v == s
2      skriv ut s
3  elseif v.π == NIL
4      skriv ut "ingen sti fra" s "til" v
5  else PRINT-PATH(G, s, v.π)
6      skriv ut v
```

### Trinn for trinn (Z3)

Hver iterasjon av while-løkken tar ut noden som har ventet lengst i Q, og oppdager alle dens hvite naboer. De nye nodene får d én større enn u. Siden køen er FIFO, behandles alle noder på avstand k før noen på avstand k + 1.

<div class="algwidget" data-widget="bfs"></div>
<p class="algwidget-caption">BFS fra s på bokas figur 20.3 · interaktiv</p>
### Korrekthet (Z4)

Boka viser korrektheten i flere steg (avsnitt 20.2). Hovedpunktene:

1. **v.d er aldri for liten:** Ved induksjon på antall Enqueue er v.d ≥ δ(s, v) hele tiden, fordi v.d = u.d + 1 og (u, v) er en kant.
2. **Køen er ordnet:** Hvis Q = ⟨v₁, …, vᵣ⟩, er vᵣ.d ≤ v₁.d + 1 og vᵢ.d ≤ vᵢ₊₁.d. Nodene i køen har altså høyst to forskjellige d-verdier, i stigende rekkefølge.
3. **v.d er riktig (Teorem 20.5):** Anta for selvmotsigelse at v er noden med minst δ(s, v) som får feil d, og la u være forgjengeren på en korteste sti. Da er u.d riktig. Når u tas ut av køen, er v enten hvit (og får v.d = u.d + 1 = δ(s, v)), svart eller grå (og ble da oppdaget fra en node med d ≤ u.d, så v.d ≤ δ(s, v)). Alle tilfellene gir en motsigelse.
4. **π gir korteste stier:** Siden v.d = v.π.d + 1 for hver oppdaget v, er stien fra s til v i bredde-først-treet en korteste sti. Print-Path skriver den ut ved å følge π bakover rekursivt og skrive ut på vei tilbake.

### Styrker og svakheter (Z5)

- **Styrker:** Lineær tid. Finner korteste veier i uvektede grafer, og kan avgjøre om en node kan nås.
- **Svakheter:** Gir ikke korteste vei når kantene har ulik vekt. Når bare nodene som kan nås fra s; for hele grafen må den startes på nytt fra uoppdagede noder.
- **Mot DFS:** BFS gir korteste stier; DFS gir tidsstempler og kantklassifisering, som brukes til topologisk sortering og sterke komponenter.

### Kjøretid (Z6)

Vi bruker aggregert analyse:

- Initialiseringen tar O(V).
- Hver node legges i køen høyst én gang, fordi den bare legges inn når den er hvit og straks blir grå. Enqueue og Dequeue tar O(1), så køoperasjonene tar O(V) til sammen.
- Nabolisten til hver node gjennomgås bare når noden tas ut av køen, altså høyst én gang. Summen av lengdene er Θ(E).

Totalt O(V + E), altså lineært i størrelsen på nabolisterepresentasjonen. Med nabomatrise blir det O(V²). Print-Path tar O(lengden av stien).

### Sjekk deg selv

1. Hva skjer med BFS hvis Q byttes ut med en stakk?
2. Hvorfor kan v.d aldri bli mindre enn δ(s, v)?
3. Hva er kjøretiden til BFS med nabomatrise, og hvorfor?
4. Hvordan finner du korteste vei fra s til y etter at BFS er kjørt?

??? success "Fasit"

    1. Traverseringen blir dybde-først-aktig, og d-verdiene er ikke lenger korteste avstander.
    2. v.d settes til u.d + 1 der (u, v) er en kant, og med induksjon er u.d ≥ δ(s, u), så v.d ≥ δ(s, u) + 1 ≥ δ(s, v).
    3. O(V²), fordi å finne naboene til hver node krever å lese en hel rad i matrisen.
    4. Kall Print-Path(G, s, y), som følger π-pekerne fra y tilbake til s.

## Dybde-først-søk, DFS (F8)

DFS går så dypt som mulig før den snur: fra hver node følger den første uutforskede kant, og går tilbake først når alle naboene er utforsket. Underveis får hver node et oppdagelsestidspunkt d og et ferdigtidspunkt f. Tidsstemplene gir parentesstruktur, kantklassifisering og grunnlaget for topologisk sortering og sterke komponenter. Kjøretiden er Θ(V + E).

**Læringsmål fra F8 som gjelder her**

- [H3] Forstå DFS, parentesteoremet og hvit-sti-teoremet
- [H4] Forstå hvordan DFS klassifiserer kanter
- [H7] Forstå hvordan DFS kan implementeres med en stakk

### Problemet (Z1)

DFS løser ikke ett bestemt problem, men utforsker hele grafen og produserer nyttig informasjon:

- **Input:** En graf G = (V, E), rettet eller urettet, representert med nabolister.
- **Output:** For hver node v: v.d (oppdaget), v.f (ferdig) og v.π (forelder i dybde-først-skogen). Implisitt også en klassifisering av alle kantene.

### Krav og forutsetninger (Z2)

- Ingen krav til grafen. Den kan ha sykler og løkker.
- Prosedyren DFS har ingen startnode: den starter DFS-Visit fra hver hvite node etter tur, til hele grafen er utforsket. Begrepet «dybde-først-søk» brukes både om DFS og om DFS-Visit fra én node (appendiks F).
- Resultatet avhenger av rekkefølgen på nodene og i nabolistene. Teoremene gjelder uansett rekkefølge.

### Pseudokode

```text
DFS(G)
1  for each vertex u ∈ G.V
2      u.color = WHITE
3      u.π = NIL
4  time = 0
5  for each vertex u ∈ G.V
6      if u.color == WHITE
7          DFS-VISIT(G, u)

DFS-VISIT(G, u)
1   time = time + 1              // den hvite noden u er nettopp oppdaget
2   u.d = time
3   u.color = GRAY
4   for each vertex v in G.Adj[u] // utforsk hver kant (u, v)
5       if v.color == WHITE
6           v.π = u
7           DFS-VISIT(G, v)
8   time = time + 1
9   u.f = time
10  u.color = BLACK              // u er ferdig
```

**DFS med stakk (H7).** Rekursjonen kan erstattes med en eksplisitt LIFO-stakk, slik maskinen selv gjør med kallstakken (appendiks F og G). En enkel versjon som besøker nodene i dybde-først-rekkefølge:

```text
DFS-STACK(G, s)
1  S = tom stakk
2  PUSH(S, s)
3  while S ≠ ∅
4      u = POP(S)
5      if u.color == WHITE
6          u.color = GRAY            // u besøkes nå
7          for each v in G.Adj[u], i omvendt rekkefølge
8              if v.color == WHITE
9                  v.π = u
10                 PUSH(S, v)
```

Dette er BFS med køen byttet ut med en stakk. For å få riktige ferdigtidspunkter f må u bli liggende på stakken til alle naboene er behandlet, for eksempel ved å legge (u, neste nabo-indeks) på stakken og fortsette der man slapp, akkurat som en kallstakk husker hvor i løkken hvert kall var.

### Trinn for trinn (Z3)

Når DFS-Visit(G, u) kalles, blir u grå og får d. Så utforskes kantene ut fra u én etter én. En hvit nabo gir et rekursivt kall, så algoritmen går dypere før den ser på resten av u sine kanter. Når alle kantene er utforsket, blir u svart og får f.

<div class="algwidget" data-widget="dfs"></div>
<p class="algwidget-caption">DFS på bokas figur 20.4 · interaktiv</p>
Til høyre i figuren vises intervallene [d, f] på en tidslinje. Legg merke til at to intervaller enten er disjunkte eller det ene ligger helt inne i det andre. Det er parentesteoremet.

### Korrekthet og teoremer (Z4, H3, H4)

**Parentesteoremet (Teorem 20.7).** For to noder u og v gjelder nøyaktig ett av disse:

- intervallene [u.d, u.f] og [v.d, v.f] er disjunkte, og ingen av nodene er etterkommer av den andre,
- [u.d, u.f] ligger helt inne i [v.d, v.f], og u er en etterkommer av v, eller
- [v.d, v.f] ligger helt inne i [u.d, u.f], og v er en etterkommer av u.

*Hvorfor:* oppdages v mens u er grå, skjer det inne i det rekursive kallet for u, og kallet for v må bli ferdig før kallet for u. Skriver vi «(u» ved oppdagelse og «u)» ved ferdig, blir uttrykket korrekt nestet.

**Hvit-sti-teoremet (Teorem 20.9).** I en dybde-først-skog er v en etterkommer av u hvis og bare hvis det på tidspunktet u.d finnes en sti fra u til v som bare består av hvite noder.

*Bevisidé:* Er v en etterkommer, er alle nodene på tre-stien fra u til v oppdaget etter u, så de var hvite ved u.d. Omvendt: anta at det finnes en hvit sti, men at en node på den ikke blir etterkommer. Ta den første slike noden v, med forgjenger w på stien. w er en etterkommer, så w.f ≤ u.f. v må oppdages før w er ferdig (v er hvit og nabo til w), og etter u.d, så [v.d, v.f] ligger inne i [u.d, u.f] etter parentesteoremet. Da er v en etterkommer likevel, en selvmotsigelse.

**Kantklassifisering (H4).** Når kanten (u, v) utforskes, avgjør fargen på v hvilken type den er:

| Farge på v | Kanttype | Betydning |
| --- | --- | --- |
| Hvit | Trekant (T) | v oppdages via (u, v) og blir barn av u |
| Grå | Bakoverkant (B) | v er en forfar til u (eller u selv, ved løkker) |
| Svart, og u.d < v.d | Foroverkant (F) | v er en etterkommer av u, men ikke via en trekant |
| Svart, og u.d > v.d | Krysskant (C) | Ingen er forfar til den andre (annet deltre eller annet tre) |

I en **urettet** graf finnes bare trekanter og bakoverkanter. En rettet graf er asyklisk hvis og bare hvis DFS ikke finner noen bakoverkanter (Lemma 20.11).

### Styrker og svakheter (Z5)

- **Styrker:** Lineær tid. Tidsstemplene og kantklassene gir syklusdeteksjon, topologisk sortering og sterke komponenter.
- **Svakheter:** Gir ikke korteste veier. Den rekursive versjonen kan få dyp rekursjon (opptil V kall) på lange stier.
- **Kobling til DP (Ukens snubletråd):** Memoisering løser delinstansene i samme rekkefølge som DFS ferdigstiller noder i delinstansgrafen: en delinstans er ferdig først når alle den avhenger av, er ferdige. Det er akkurat topologisk sortering.

### Kjøretid (Z6)

- Løkkene i DFS tar Θ(V), i tillegg til kallene.
- DFS-Visit kalles nøyaktig én gang per node, fordi den bare kalles på hvite noder og noden straks blir grå.
- I kallet for v kjører løkken |Adj[v]| ganger. Summen over alle noder er Θ(E).

Totalt Θ(V + E) med nabolister, i alle tilfeller.

### Sjekk deg selv

1. Hvilke kanttyper kan forekomme i en urettet graf, og hvorfor?
2. Hvordan kan du avgjøre med DFS om en rettet graf har en sykel?
3. Hvis u.d < v.d < v.f < u.f, hva er forholdet mellom u og v?
4. Hva er forskjellen på en foroverkant og en krysskant?

??? success "Fasit"

    1. Bare trekanter og bakoverkanter. En urettet kant utforskes først fra den noden som oppdages først; da er den andre enten hvit (trekant) eller grå (bakoverkant).
    2. Grafen har en sykel hvis og bare hvis DFS finner en bakoverkant.
    3. v er en etterkommer av u (intervallet til v ligger inne i intervallet til u).
    4. Begge går til en svart node. Ved en foroverkant er v en etterkommer av u (u.d < v.d); ved en krysskant er v oppdaget før u og ikke en forfar (u.d > v.d).

## Topologisk sortering (F8)

En topologisk sortering av en rettet asyklisk graf (DAG) er en rekkefølge av nodene der hver kant går fra en tidligere til en senere node. Topological-Sort kjører DFS og setter hver node inn foran i en liste når den blir ferdig. Resultatet er nodene i synkende rekkefølge av ferdigtid, og kjøretiden er Θ(V + E).

**Læringsmål:** [H5] Forstå Topological-Sort.

### Problemet (Z1)

- **Input:** En rettet asyklisk graf G = (V, E).
- **Output:** En lineær ordning av alle nodene i V slik at u kommer før v for hver kant (u, v) ∈ E.

Kantene uttrykker avhengigheter: u må gjøres før v. Typiske eksempler er rekkefølgen på påkledning, emner med forkunnskapskrav og delinstanser i DP.

### Krav og forutsetninger (Z2)

- Grafen må være **asyklisk**. Har den en sykel, finnes ingen topologisk ordning, fordi nodene på sykelen måtte komme før hverandre.
- En DAG kan ha flere gyldige ordninger. Algoritmen finner én, avhengig av rekkefølgen i DFS.

### Pseudokode

```text
TOPOLOGICAL-SORT(G)
1  kall DFS(G) for å regne ut ferdigtidspunktet v.f for hver node v
2  når hver node blir ferdig, sett den inn foran i en lenket liste
3  return den lenkede listen
```

I praksis legges linje 2 inn i DFS-Visit rett etter at u.f er satt.

### Trinn for trinn (Z3)

En node blir ferdig først når alt den har kanter til, er ferdig. Derfor havner den foran alle disse i listen. Noder uten utkanter blir ferdige først og ender bakerst.

<div class="algwidget" data-widget="topological-sort"></div>
<p class="algwidget-caption">Topological-Sort på påkledningseksempelet · interaktiv</p>
Resultatet er sokker, underbukse, bukse, sko, klokke, skjorte, belte, slips, jakke, det samme som i boka. Tallene ved nodene er d/f.

### Korrekthet (Z4)

**Lemma 20.11.** En rettet graf er asyklisk hvis og bare hvis DFS ikke gir noen bakoverkanter. (En bakoverkant (u, v) pluss tre-stien fra v til u er en sykel. Omvendt: finnes en sykel, la v være den første noden på sykelen som oppdages; da er det en hvit sti fra v til forgjengeren u på sykelen, så u blir en etterkommer av v etter hvit-sti-teoremet, og (u, v) blir en bakoverkant.)

**Teorem 20.12.** Topological-Sort gir en topologisk ordning av en DAG.

*Bevis:* Det holder å vise at v.f < u.f for hver kant (u, v), fordi listen er sortert synkende på f. Når (u, v) utforskes, er u grå. Se på fargen til v:

- **Grå:** umulig, for da ville (u, v) vært en bakoverkant, og grafen har ingen sykler (Lemma 20.11).
- **Hvit:** v blir en etterkommer av u, så v blir ferdig før u: v.f < u.f.
- **Svart:** v er allerede ferdig, mens u ikke er det: v.f < u.f.

### Styrker og svakheter (Z5)

- **Styrker:** Lineær tid, enkel å implementere med DFS. Oppdager samtidig om grafen har en sykel (bakoverkant).
- **Svakheter:** Virker bare for DAG-er. Gir én av mange mulige ordninger.
- **Kobling til DP (Ukens snubletråd):** Delinstansene i en memoisert algoritme løses i samme rekkefølge som DFS ferdigstiller noder i delinstansgrafen. En delinstans returnerer først når alle delinstansene den avhenger av, er løst, akkurat som en node blir ferdig først når alle etterfølgerne er ferdige. Bottom-up løser i omvendt topologisk rekkefølge av delinstansgrafen. Det samme prinsippet brukes i Dag-Shortest-Paths (F10).

### Kjøretid (Z6)

DFS tar Θ(V + E), og hver innsetting foran i en lenket liste tar O(1). Totalt Θ(V + E).

### Sjekk deg selv

1. Hvorfor settes nodene inn *foran* i listen?
2. Hva skjer hvis grafen har en sykel?
3. Er topologisk ordning entydig? Gi et eksempel fra figuren.
4. Hvorfor er v.f < u.f for alle kanter (u, v) i en DAG?

??? success "Fasit"

    1. Da står nodene i synkende rekkefølge av f, og den som blir ferdig sist, kommer først.
    2. DFS finner en bakoverkant, og det finnes ingen topologisk ordning.
    3. Nei. Klokke kan stå hvor som helst, og sokker kan byttes med underbukse.
    4. Når (u, v) utforskes, er v enten hvit (blir etterkommer og ferdig først) eller svart (allerede ferdig). Grå er umulig, for det ville gitt en sykel.

## Sterkt sammenhengende komponenter (F8)

En sterk komponent er en maksimal mengde noder der alle kan nå alle. Strongly-Connected-Components finner alle komponentene med to DFS-er: først på G for å få ferdigtider, så på den transponerte grafen Gᵀ med nodene i synkende ferdigtid. Hvert tre i den andre DFS-skogen er én komponent. Kjøretiden er Θ(V + E).

**Læringsmål:** [H6] Forstå Strongly-Connected-Components.

### Problemet (Z1)

- **Input:** En rettet graf G = (V, E).
- **Output:** Partisjonen av V i sterkt sammenhengende komponenter: maksimale mengder C ⊆ V slik at for alle u, v ∈ C finnes både en sti fra u til v og en sti fra v til u.

**Definisjoner:**

- **Den transponerte grafen** Gᵀ = (V, Eᵀ) har de samme nodene og alle kantene snudd: Eᵀ = {(u, v) : (v, u) ∈ E}. G og Gᵀ har nøyaktig de samme sterke komponentene, fordi u og v når hverandre i G hvis og bare hvis de gjør det i Gᵀ.
- **Komponentgrafen** G^SCC har én node per komponent og en kant fra C til C′ hvis G har en kant fra en node i C til en node i C′. Den er alltid en DAG (Lemma 20.13): en sykel mellom komponenter ville slått dem sammen til én.

### Krav og forutsetninger (Z2)

- Grafen må være rettet. (I en urettet graf er komponentene bare de vanlige sammenhengende komponentene.)
- Den andre DFS-en må ta nodene i synkende rekkefølge av ferdigtid fra den første. Med en annen rekkefølge kan et tre spenne over flere komponenter.

### Pseudokode

```text
STRONGLY-CONNECTED-COMPONENTS(G)
1  kall DFS(G) for å regne ut ferdigtidspunktet u.f for hver node u
2  lag Gᵀ
3  kall DFS(Gᵀ), men ta nodene i hovedløkken i synkende rekkefølge av u.f
   (fra linje 1)
4  skriv ut nodene i hvert tre i dybde-først-skogen fra linje 3 som en egen
   sterkt sammenhengende komponent
```

Rekkefølgen i linje 3 krever ingen sortering: sett hver node inn foran i en liste når den blir ferdig i linje 1, som i Topological-Sort.

### Trinn for trinn (Z3)

Den første DFS-en gir hver node en ferdigtid. Noden med størst ferdigtid ligger i en komponent som er en «kilde» i komponentgrafen. Når kantene snus, blir den komponenten et «sluk», så DFS på Gᵀ fra den noden kommer ikke ut av komponenten. Neste start er den gjenværende noden med størst f, og kanter ut av den komponenten i Gᵀ fører bare til komponenter som allerede er ferdige.

<div class="algwidget" data-widget="scc"></div>
<p class="algwidget-caption">Strongly-Connected-Components på bokas figur 20.9 · interaktiv</p>
Komponentene er {a, b, e}, {c, d}, {f, g} og {h}, som i boka.

### Korrekthet (Z4)

For en mengde noder C, la f(C) være den største ferdigtiden og d(C) den minste oppdagelsestiden fra linje 1.

**Lemma 20.14.** Hvis det finnes en kant (u, v) i G med u ∈ C og v ∈ C′, der C ≠ C′ er komponenter, er f(C) > f(C′).

*Bevis:* To tilfeller.

- **d(C) < d(C′):** La x være den første noden som oppdages i C. På tidspunktet x.d er alle nodene i C og C′ hvite, og det finnes hvite stier fra x til alle sammen (via kanten (u, v)). Etter hvit-sti-teoremet blir alle etterkommere av x, så f(C) = x.f > f(C′).
- **d(C) > d(C′):** La y være den første noden som oppdages i C′. Alle nodene i C′ blir etterkommere av y, og blir ferdige ved y.f = f(C′). Det finnes ingen sti fra C′ til C (ellers ville komponentgrafen hatt en sykel), så ingen node i C er oppdaget når y blir ferdig. Dermed er f(C) > d(C) > f(C′).

**Korollar 20.15.** I Gᵀ går alle kanter mellom komponenter fra en komponent med lavere f til en med høyere f.

**Teorem 20.16.** Algoritmen finner komponentene riktig. Induksjon på antall trær funnet i linje 3: anta at de k første trærne er komponenter. Det neste treet starter i en node u med størst f blant de gjenværende, i en komponent C. Alle nodene i C er hvite og nås fra u, så de blir med i treet (hvit-sti-teoremet). Kanter i Gᵀ ut av C går etter korollaret til komponenter med større f, som alle er ferdige (svarte) fordi de startet tidligere. Treet blir derfor nøyaktig C.

### Styrker og svakheter (Z5)

- **Styrker:** Lineær tid, og bruker bare DFS som byggestein. Komponentene kommer ut i topologisk rekkefølge av komponentgrafen.
- **Svakheter:** Trenger to gjennomganger av grafen og en kopi av den med snudde kanter (Θ(V + E) ekstra minne).
- **Bruk:** Mange problemer på rettede grafer løses ved å først slå sammen hver komponent til én node, og så jobbe på DAG-en som står igjen.

### Kjøretid (Z6)

- Linje 1: DFS tar Θ(V + E).
- Linje 2: å lage Gᵀ med nabolister tar Θ(V + E): gå gjennom alle kantene og legg dem inn snudd.
- Linje 3: DFS tar Θ(V + E), og rekkefølgen fås gratis fra linje 1.

Totalt Θ(V + E).

### Sjekk deg selv

1. Hvorfor kjøres den andre DFS-en på Gᵀ og ikke på G?
2. Hvorfor er komponentgrafen alltid asyklisk?
3. Hva kan gå galt hvis den andre DFS-en tar nodene i stigende rekkefølge av f?
4. Hvordan får du nodene i synkende ferdigtid uten å sortere?

??? success "Fasit"

    1. I G kunne DFS fra kildekomponenten nå ut i andre komponenter. I Gᵀ er den et sluk, så treet blir nøyaktig komponenten.
    2. En sykel i komponentgrafen ville bety at nodene i komponentene på sykelen når hverandre, og da var de én komponent.
    3. Treet kan da starte i en komponent som har kanter i Gᵀ til hvite noder i andre komponenter, og slå flere komponenter sammen i ett tre.
    4. Sett hver node inn foran i en liste når den blir ferdig i den første DFS-en.
