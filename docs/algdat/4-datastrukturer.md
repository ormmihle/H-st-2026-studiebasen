# 4. Datastrukturer


Begge datastrukturene i F5 er rotfaste trær. En haug holder bare orden langs stiene fra roten (alt er mindre enn roten), og gir rask tilgang til det største elementet. Et binært søketre holder orden mellom venstre og høyre deltre, og støtter søk og sortert gjennomgang. Disjunkte mengder (F9) kommer senere.

## Hauger, prioritetskøer og Heapsort (F5)

En max-haug er et nesten komplett binært tre, lagret i en tabell, der hver node er minst like stor som barna sine. Den gir en prioritetskø der største element kan hentes i Θ(1) og fjernes eller settes inn i O(lg n), og den gir Heapsort, som sorterer på stedet i O(n lg n).

**Læringsmål fra F5 som gjelder her**

- [E1] Forstå hvordan hauger fungerer, inkludert haugegenskapen (the heap property), og hvordan de kan brukes som prioritetskøer (Parent, Left, Right, Max-Heapify, Build-Max-Heap, Heapsort, Max-Heap-Insert, Max-Heap-Extract-Max, Max-Heap-Increase-Key, Max-Heap-Maximum, og tilsvarende for min-hauger)
- [E2] Forstå Heapsort
- Ukens snubletråd: Build-Max-Heap er ikke det samme som gjentatt bruk av Max-Heap-Insert, og gir ikke samme kjøretid.

### Representasjon i minnet (Z8)

Haugen lagres i en tabell A[1 : n], der bare A[1 : A.heap-size] er en del av haugen. Roten er A[1], og treet fylles nivå for nivå, fra venstre. Det trengs ingen pekere, fordi foreldre og barn kan regnes ut:

```text
PARENT(i)          LEFT(i)            RIGHT(i)
1  return ⌊i/2⌋      1  return 2i         1  return 2i + 1
```

- **Max-haugegenskapen:** A[PARENT(i)] ≥ A[i] for alle i > 1. Dermed er det største elementet i roten, og hvert deltre er selv en max-haug.
- **Min-haugegenskapen:** A[PARENT(i)] ≤ A[i]. Min-hauger brukes for eksempel i Dijkstra og Prim.
- **Høyde:** En haug med n elementer har høyde ⌊lg n⌋ = Θ(lg n), fordi treet er nesten komplett.
- **Løvnoder:** A[⌊n/2⌋ + 1 : n] er løvnoder, siden LEFT(i) = 2i > n for disse.

### Operasjonene: problem og krav (Z1, Z2)

| Operasjon | Krav (input) | Hva den gjør | Tid |
| --- | --- | --- | --- |
| Max-Heapify(A, i) | Deltrærne under LEFT(i) og RIGHT(i) er max-hauger | Lar A[i] synke ned til haugegenskapen holder i deltreet med rot i | O(lg n) |
| Build-Max-Heap(A, n) | Vilkårlig tabell | Gjør A til en max-haug | O(n) |
| Heapsort(A, n) | Vilkårlig tabell | Sorterer A på stedet | O(n lg n) |
| Max-Heap-Maximum(A) | Ikke-tom max-haug | Returnerer største element | Θ(1) |
| Max-Heap-Extract-Max(A) | Ikke-tom max-haug | Fjerner og returnerer største element | O(lg n) |
| Max-Heap-Increase-Key(A, i, k) | k ≥ nåværende nøkkel | Øker nøkkelen og lar elementet stige opp | O(lg n) |
| Max-Heap-Insert(A, k, n) | heap-size < n | Setter inn et nytt element | O(lg n) |

For min-hauger finnes de tilsvarende operasjonene Min-Heapify, Build-Min-Heap, Min-Heap-Minimum, Min-Heap-Extract-Min, Min-Heap-Decrease-Key og Min-Heap-Insert, med alle ulikheter snudd.

### Pseudokode

```text
MAX-HEAPIFY(A, i)
1   l = LEFT(i)
2   r = RIGHT(i)
3   if l ≤ A.heap-size and A[l] > A[i]
4       largest = l
5   else largest = i
6   if r ≤ A.heap-size and A[r] > A[largest]
7       largest = r
8   if largest ≠ i
9       bytt A[i] og A[largest]
10      MAX-HEAPIFY(A, largest)

BUILD-MAX-HEAP(A, n)
1  A.heap-size = n
2  for i = ⌊n/2⌋ downto 1
3      MAX-HEAPIFY(A, i)

HEAPSORT(A, n)
1  BUILD-MAX-HEAP(A, n)
2  for i = n downto 2
3      bytt A[1] og A[i]
4      A.heap-size = A.heap-size − 1
5      MAX-HEAPIFY(A, 1)

MAX-HEAP-MAXIMUM(A)
1  if A.heap-size < 1
2      error "heap underflow"
3  return A[1]

MAX-HEAP-EXTRACT-MAX(A)
1  max = MAX-HEAP-MAXIMUM(A)
2  A[1] = A[A.heap-size]
3  A.heap-size = A.heap-size − 1
4  MAX-HEAPIFY(A, 1)
5  return max

MAX-HEAP-INCREASE-KEY(A, i, key)
1  if key < A[i]
2      error "ny nøkkel er mindre enn den gamle"
3  A[i] = key
4  while i > 1 and A[PARENT(i)] < A[i]
5      bytt A[i] og A[PARENT(i)]
6      i = PARENT(i)

MAX-HEAP-INSERT(A, key, n)
1  if A.heap-size == n
2      error "heap overflow"
3  A.heap-size = A.heap-size + 1
4  A[A.heap-size] = −∞
5  MAX-HEAP-INCREASE-KEY(A, A.heap-size, key)
```

I 4. utgave lagrer haugen objekter x med en nøkkel x.key, og Increase-Key og Insert må i tillegg holde orden på hvilken indeks hvert objekt har. Versjonene over bruker bare nøkler og indekser, men ideen er den samme.

### Trinn for trinn (Z3)

- **Max-Heapify** sammenligner A[i] med barna, bytter med det største barnet hvis det er større, og fortsetter nedover der byttet skjedde.
- **Build-Max-Heap** går nedenfra og opp, fra den siste noden som har barn. Når Max-Heapify kalles på node i, er deltrærne under allerede hauger.
- **Heapsort** bytter roten (det største) med det siste elementet i haugen, krymper haugen med 1 og reparerer roten.
- **Extract-Max** gjør det samme som ett Heapsort-steg, men returnerer roten.
- **Increase-Key og Insert** går motsatt vei: elementet stiger oppover så lenge forelderen er mindre.

<div class="algwidget" data-widget="heapsort"></div>
<p class="algwidget-caption">Build-Max-Heap og Heapsort på ⟨4, 1, 3, 2, 16, 9, 10, 14, 8, 7⟩ · interaktiv</p>
Eksempelet er bokas figur 6.3 (Build-Max-Heap) og 6.4 (Heapsort). Tallene ved siden av nodene er indeksene i A. Elementene til høyre for heap-size er ferdig sortert og ikke lenger med i haugen.

### Korrekthet (Z4)

**Max-Heapify.** Induksjon på høyden til node i. Linje 3–7 finner det største av A[i] og barna. Er det A[i], er deltreet allerede en haug, fordi barnas deltrær er hauger. Ellers byttes A[i] med det største barnet. Da er den nye A[i] størst av de tre, og det andre barnets deltre er urørt. Bare deltreet der byttet skjedde kan ha fått brudd i roten, og det har lavere høyde, så det rekursive kallet reparerer det (induksjonshypotesen).

**Build-Max-Heap.** Invariant for for-løkken:

> **Invariant:** Ved starten av hver iterasjon er hver av nodene i + 1, i + 2, …, n roten i en max-haug.

- **Initialisering:** i = ⌊n/2⌋, og nodene ⌊n/2⌋ + 1, …, n er løvnoder, som trivielt er hauger.
- **Vedlikehold:** Barna til node i har høyere indeks enn i, så de er røtter i hauger. Kravet til Max-Heapify(A, i) er oppfylt, og etterpå er i roten i en haug. Nodene med høyere indeks er fortsatt røtter i hauger. Når i reduseres, holder invarianten igjen.
- **Terminering:** Ved i = 0 er node 1 roten i en max-haug, altså er hele A en haug.

**Heapsort.** Invariant for for-løkken i linje 2–5:

> **Invariant:** Ved starten av hver iterasjon er A[1 : i] en max-haug med de i minste elementene, og A[i + 1 : n] inneholder de n − i største elementene, sortert.

Roten A[1] er det største i A[1 : i], og ikke større enn noe i A[i + 1 : n]. Byttet i linje 3 setter det på plass i, så den sorterte delen vokser med ett. Barna til roten er fortsatt røtter i hauger, så Max-Heapify(A, 1) gjør A[1 : i − 1] til en haug igjen. Ved terminering er i = 1, og hele A er sortert.

**Increase-Key.** Etter linje 3 er A en max-haug bortsett fra at A[i] kan være større enn forelderen. Hvert bytte flytter dette mulige bruddet ett nivå opp, og løkken stopper når det ikke er noe brudd eller i er roten.

### Styrker og svakheter (Z5)

- **Heapsort:** Θ(n lg n) i verste tilfelle og sorterer på stedet, som verken Merge-Sort eller Quicksort klarer begge av. Den er ikke stabil, og har dårlig cache-lokalitet, så Quicksort er ofte raskere i praksis.
- **Prioritetskø med haug** mot alternativene: En usortert liste gir rask innsetting, men Θ(n) for å finne maksimum. En sortert liste gir Θ(1) for maksimum, men Θ(n) for innsetting. Haugen gir O(lg n) for begge.
- **Haug mot binært søketre:** En haug kan ikke søke etter en vilkårlig verdi raskt (O(n)), men er billigere å bygge (O(n)) og alltid balansert. Den svakere ordenen gjør den billigere å vedlikeholde.
- Prioritetskøer brukes i Huffman (F7), traversering med prioritetskø (F8), Prim (F9) og Dijkstra (F10).

### Kjøretid (Z6)

**Max-Heapify: O(lg n).** Arbeidet per nivå er konstant, og elementet kan høyst synke til et løv, altså O(h) for en node med høyde h. Boka uttrykker det også med en rekurrens: et barns deltre har høyst 2n/3 noder, så T(n) ≤ T(2n/3) + Θ(1), som masterteoremet (tilfelle 2) løser til O(lg n). Beste tilfelle er Θ(1), når ingen bytte trengs.

**Build-Max-Heap: O(n).** En enkel analyse gir O(n lg n): n/2 kall à O(lg n). Men de fleste nodene er lavt i treet, der Max-Heapify er billig. Det finnes høyst ⌈n/2ʰ⁺¹⌉ noder med høyde h, og Max-Heapify på en slik node koster O(h):

$$
\sum_{h=0}^{\lfloor \lg n \rfloor} \left\lceil \frac{n}{2^{h+1}} \right\rceil O(h) = O\!\left(n \sum_{h=0}^{\infty} \frac{h}{2^h}\right) = O(n \cdot 2) = O(n)
$$

**Snubletråden: gjentatt Insert er Θ(n lg n).** Bygger vi haugen med n kall til Max-Heap-Insert, koster hvert kall O(lg n). På stigende input må hvert nytt element stige helt til roten, og summen av lg i for i = 1, …, n er Θ(n lg n). Forskjellen er hvor arbeidet skjer: Build-Max-Heap lar elementer synke, og de fleste nodene er nær bunnen der det er kort vei ned. Insert lar elementer stige, og de fleste nodene er nær bunnen der det er lang vei opp.

**Heapsort: O(n lg n).** Build-Max-Heap koster O(n), og hver av de n − 1 iterasjonene koster O(lg n). Verste tilfelle er Θ(n lg n). Er alle elementene like, stopper hvert Max-Heapify med en gang, og Heapsort tar Θ(n).

**Prioritetskøoperasjonene:** Maximum er Θ(1). Extract-Max er O(lg n) på grunn av Max-Heapify. Increase-Key og Insert er O(lg n), fordi elementet stiger høyst ⌊lg n⌋ nivåer.

### Sjekk deg selv

1. Hvilke indekser er løvnoder i en haug med n elementer?
2. Hvorfor går løkken i Build-Max-Heap fra ⌊n/2⌋ og nedover, ikke oppover?
3. Hva er kjøretiden for å bygge en haug med n gjentatte Max-Heap-Insert på stigende input?
4. Er en synkende sortert tabell en max-haug?

??? success "Fasit"

    1. ⌊n/2⌋ + 1, …, n.
    2. Max-Heapify(A, i) krever at deltrærne under i allerede er hauger. Når vi går nedenfra, er barna alltid behandlet før forelderen.
    3. Θ(n lg n), fordi hvert element må stige helt til roten.
    4. Ja. Forelderen har alltid lavere indeks enn barnet, og har dermed en større eller like stor verdi.

## Binære søketrær og rotfaste trær (F5)

Et binært søketre lagrer nøkler i noder med pekere, slik at alt i venstre deltre er mindre enn eller lik noden og alt i høyre deltre er større enn eller lik. Det støtter søk, innsetting, sletting, minimum, maksimum, forgjenger og etterfølger i O(h) tid, der h er høyden. Er treet balansert, er h = Θ(lg n); i verste fall er h = n − 1.

**Læringsmål fra F5 som gjelder her**

- [E3] Forstå hvordan rotfaste trær kan implementeres med noder og pekere (inkludert med pekere til første barn og neste søsken)
- [E4] Forstå hvordan binære søketrær fungerer, inkludert binær-søketre-egenskapen (Inorder-Tree-Walk, Tree-Search, Iterative-Tree-Search, Tree-Minimum, Tree-Maximum, Tree-Successor, Tree-Predecessor, Tree-Insert, Transplant, Tree-Delete)
- [E5] Vite at forventet høyde for et tilfeldig binært søketre er Θ(lg n)
- [E6] Vite at det finnes søketrær med garantert høyde Θ(lg n)
- Merk: Grundig forståelse av Transplant og Tree-Delete kreves ikke.

### Representasjon i minnet (Z8, E3)

Hver node er et objekt med en nøkkel (key), eventuelle satellittdata og pekere. Treet T har en peker T.root til roten. En peker som ikke peker på noe, er NIL.

- **Binære trær:** hver node x har x.p (forelder), x.left og x.right. Roten har x.p = NIL.
- **Trær med vilkårlig mange barn:** man kan ikke ha én peker per barn når antallet er ubegrenset. Representasjonen *venstre barn, høyre søsken* gir hver node x pekerne x.p, x.left-child (første barn) og x.right-sibling (neste søsken). Barna til en node blir da en lenket liste. Dette bruker O(n) plass uansett hvor mange barn nodene har.

**Binær-søketre-egenskapen:** For hver node x gjelder: hvis y er i venstre deltre av x, er y.key ≤ x.key. Hvis y er i høyre deltre av x, er y.key ≥ x.key. Merk at egenskapen gjelder hele deltrær, ikke bare barna.

### Operasjonene: problem og krav (Z1, Z2)

Et binært søketre implementerer en dynamisk mengde. Alle operasjonene krever at treet oppfyller binær-søketre-egenskapen, og at den fortsatt holder etterpå.

| Operasjon | Input | Output / effekt | Tid |
| --- | --- | --- | --- |
| Inorder-Tree-Walk(x) | Node x | Skriver ut nøklene i deltreet til x, sortert | Θ(n) |
| Tree-Search(x, k) | Node x, nøkkel k | En node med nøkkel k i deltreet, eller NIL | O(h) |
| Tree-Minimum(x) / Tree-Maximum(x) | Node x ≠ NIL | Noden med minst / størst nøkkel i deltreet | O(h) |
| Tree-Successor(x) / Tree-Predecessor(x) | Node x | Neste / forrige node i sortert rekkefølge, eller NIL | O(h) |
| Tree-Insert(T, z) | Tre T, ny node z med z.left = z.right = NIL | Setter z inn som et løv | O(h) |
| Tree-Delete(T, z) | Tre T, node z i T | Fjerner z | O(h) |

### Pseudokode

```text
INORDER-TREE-WALK(x)
1  if x ≠ NIL
2      INORDER-TREE-WALK(x.left)
3      skriv ut x.key
4      INORDER-TREE-WALK(x.right)

TREE-SEARCH(x, k)
1  if x == NIL or k == x.key
2      return x
3  if k < x.key
4      return TREE-SEARCH(x.left, k)
5  else return TREE-SEARCH(x.right, k)

ITERATIVE-TREE-SEARCH(x, k)
1  while x ≠ NIL and k ≠ x.key
2      if k < x.key
3          x = x.left
4      else x = x.right
5  return x

TREE-MINIMUM(x)                  TREE-MAXIMUM(x)
1  while x.left ≠ NIL             1  while x.right ≠ NIL
2      x = x.left                 2      x = x.right
3  return x                       3  return x

TREE-SUCCESSOR(x)
1  if x.right ≠ NIL
2      return TREE-MINIMUM(x.right)   // lengst til venstre i høyre deltre
3  else // finn laveste forfar y der x ligger i y sitt venstre deltre
4      y = x.p
5      while y ≠ NIL and x == y.right
6          x = y
7          y = y.p
8      return y

TREE-INSERT(T, z)
1   x = T.root                    // noden vi sammenligner med
2   y = NIL                       // blir forelderen til z
3   while x ≠ NIL                 // gå ned til vi faller ut av treet
4       y = x
5       if z.key < x.key
6           x = x.left
7       else x = x.right
8   z.p = y
9   if y == NIL
10      T.root = z                // treet var tomt
11  elseif z.key < y.key
12      y.left = z
13  else y.right = z

TRANSPLANT(T, u, v)               // erstatt deltreet med rot u med deltreet med rot v
1  if u.p == NIL
2      T.root = v
3  elseif u == u.p.left
4      u.p.left = v
5  else u.p.right = v
6  if v ≠ NIL
7      v.p = u.p

TREE-DELETE(T, z)
1   if z.left == NIL
2       TRANSPLANT(T, z, z.right)        // erstatt z med høyre barn
3   elseif z.right == NIL
4       TRANSPLANT(T, z, z.left)         // erstatt z med venstre barn
5   else y = TREE-MINIMUM(z.right)       // y er etterfølgeren til z
6       if y ≠ z.right                   // ligger y lenger ned?
7           TRANSPLANT(T, y, y.right)    // erstatt y med høyre barn
8           y.right = z.right
9           y.right.p = y
10      TRANSPLANT(T, z, y)              // erstatt z med y
11      y.left = z.left
12      y.left.p = y
```

Tree-Predecessor er symmetrisk med Tree-Successor (bytt left og right, og Minimum med Maximum).

### Trinn for trinn (Z3)

- **Søk og innsetting** følger én sti fra roten: til venstre hvis nøkkelen er mindre, ellers til høyre. Innsetting setter den nye noden der søket faller ut av treet.
- **Minimum** følger venstre-pekere så langt det går; **maksimum** høyre-pekere.
- **Etterfølger** har to tilfeller: har x et høyre barn, er svaret minimum i høyre deltre. Ellers går vi opp til vi kommer til en forelder fra venstre side.

<div class="algwidget" data-widget="bst"></div>
<p class="algwidget-caption">Binært søketre med nøklene fra bokas figur 12.2 · interaktiv</p>
**Sletting (bare kjenne til).** Tree-Delete har tre tilfeller. Har z ingen venstre barn, erstattes z av sitt høyre deltre (dekker også løvnoder). Har z bare venstre barn, erstattes z av det. Har z to barn, finner vi etterfølgeren y, som er minimum i høyre deltre og derfor ikke har venstre barn. Y tar plassen til z, og hvis y lå lenger ned, erstattes y først av sitt eget høyre barn. Transplant er hjelpeprosedyren som henger et deltre inn der et annet satt.

### Korrekthet (Z4)

- **Inorder-Tree-Walk** skriver ut sortert. Induksjon på størrelsen til deltreet: venstre deltre skrives ut sortert (induksjonshypotesen), alle de nøklene er ≤ x.key, så kommer x.key, og så høyre deltre sortert, der alt er ≥ x.key.
- **Tree-Search:** Er k < x.key, kan k ikke ligge i høyre deltre (der er alt ≥ x.key), så det holder å lete til venstre. Invarianten for den iterative versjonen er: hvis k finnes i treet, finnes den i deltreet til x.
- **Tree-Minimum:** Alt i venstre deltre av x er ≤ x.key, så minimum ligger der hvis det finnes. Uten venstre barn er x selv minimum i sitt deltre.
- **Tree-Successor:** Har x et høyre barn, er de neste nøklene i sortert rekkefølge i høyre deltre, og den minste av dem kommer først. Ellers er x størst i deltreet som har x som høyreste node. Etterfølgeren er da den laveste forfaren y der x ligger i y sitt venstre deltre.
- **Tree-Insert:** Den nye noden havner der et søk etter z.key ville endt. På hver node langs veien gikk vi til den siden som egenskapen krever, så egenskapen holder etterpå.

### Styrker og svakheter (Z5)

| Struktur | Søk | Innsetting | Min / etterfølger | Sortert utskrift |
| --- | --- | --- | --- | --- |
| Binært søketre | O(h) | O(h) | O(h) | Θ(n) |
| Sortert tabell | O(lg n) | O(n) | O(1) | Θ(n) |
| Max-haug | O(n) | O(lg n) | Bare maks: O(1) | O(n lg n) |
| Hashtabell | O(1) forventet | O(1) forventet | O(n) | O(n lg n) |

Søketreet er det eneste som er raskt både for endringer og for spørsmål om rekkefølge, så lenge h er liten. Svakheten er at h kan bli n − 1: setter man inn nøklene i sortert rekkefølge, blir treet en lang kjede, og alle operasjonene blir lineære.

### Kjøretid (Z6, E5, E6)

- **Alle operasjonene unntatt Inorder-Tree-Walk** følger én sti nedover (og eventuelt oppover) i treet og gjør konstant arbeid per node. De tar derfor O(h).
- **Inorder-Tree-Walk** besøker hver node én gang og tar Θ(n). Med substitusjon: T(0) = c og T(n) = T(k) + T(n − k − 1) + d, som gir T(n) = (c + d)n + c.
- **Høyden** ligger mellom ⌊lg n⌋ (balansert) og n − 1 (kjede). Beste tilfelle for operasjonene er altså O(lg n), verste tilfelle Θ(n).
- **[E5]** Bygges treet ved å sette inn n forskjellige nøkler i tilfeldig rekkefølge, er forventet høyde Θ(lg n).
- **[E6]** Det finnes balanserte søketrær, for eksempel rød-svarte trær (kapittel 13, ikke pensum), som garanterer høyde Θ(lg n) ved å omstrukturere treet ved innsetting og sletting. Da tar alle operasjonene O(lg n) i verste tilfelle.

### Sjekk deg selv

1. Hva blir høyden hvis du setter inn 1, 2, 3, …, n i den rekkefølgen, og hva koster det totalt?
2. Hvor finner du etterfølgeren til en node som har høyre barn?
3. Hvorfor gir inorder-gjennomgang sortert rekkefølge?
4. Kan en min-haug skrive ut nøklene sortert i O(n) tid, slik et søketre kan?

??? success "Fasit"

    1. Høyden blir n − 1. Den i-te innsettingen går gjennom i − 1 noder, så totalt Θ(n²).
    2. Det er minimum i høyre deltre: gå én gang til høyre og så så langt til venstre som mulig.
    3. Binær-søketre-egenskapen gir at alt til venstre er mindre og alt til høyre er større, så «venstre, rot, høyre» skriver ut i stigende rekkefølge.
    4. Nei. Haugegenskapen sier ingenting om rekkefølgen mellom søsken. Å skrive ut en haug sortert krever Ω(n lg n), ellers kunne vi sortert raskere enn den nedre grensen (bygg haugen i O(n) først).

