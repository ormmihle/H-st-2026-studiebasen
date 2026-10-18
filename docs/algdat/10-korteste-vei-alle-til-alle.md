# 10. Korteste vei fra alle til alle

Vi vil ha den korteste avstanden δ(i, j) mellom alle par av noder. Vi kunne kjørt en single-source-algoritme fra hver node, men mange delinstanser overlapper. Har grafen mange kanter, lønner det seg med dynamisk programmering. Floyd-Warshall dekomponerer etter hvilke noder som får være mellomnoder på stien, og bruker Θ(V³) tid.

**Læringsmål fra F11**

- [K1] Forstå forgjengerstrukturen for alle-til-alle-varianten av korteste-vei-problemet (Print-All-Pairs-Shortest-Path)
- [K2] Forstå Floyd-Warshall
- [K3] Forstå Transitive-Closure

**Pensum:** kap. 23, innledning og 23.2.

!!! tip "Ukens snubletråd"
    d⁽ᵏ⁾ᵢⱼ = d⁽ᵏ⁻¹⁾ᵢₖ + d⁽ᵏ⁻¹⁾ₖⱼ ⟹ π⁽ᵏ⁾ᵢⱼ = π⁽ᵏ⁻¹⁾ₖⱼ

    Hvis den beste veien fra i til j går via k, er forgjengeren til j den samme som på den beste veien fra k til j.

## Oppsett og forgjengermatrisen (K1)

**Alternativer.** Kjører vi en single-source-algoritme fra hver av de |V| nodene, får vi:

| Algoritme fra hver node | Krav | Totalt |
| --- | --- | --- |
| Dijkstra med tabell | Ingen negative kanter | O(V³) |
| Dijkstra med Fibonacci-haug | Ingen negative kanter | O(V² lg V + VE) |
| Bellman-Ford | Ingen negative sykler | O(V²E), som er O(V⁴) for tette grafer |
| Floyd-Warshall | Ingen negative sykler | Θ(V³) |

Floyd-Warshall tåler negative kanter og har små konstanter, så den er god for tette grafer.

**Representasjon.** Nodene er nummerert 1, …, n, og grafen er gitt som en n × n vektmatrise W:

wᵢⱼ = 0 hvis i = j, w(i, j) hvis (i, j) ∈ E, og ∞ ellers.

Resultatet er en avstandsmatrise D = (dᵢⱼ) med dᵢⱼ = δ(i, j).

**Forgjengermatrisen Π (K1).** πᵢⱼ er NIL hvis i = j eller det ikke finnes noen sti fra i til j. Ellers er πᵢⱼ forgjengeren til j på en korteste vei fra i. Rad i i Π beskriver et korteste-vei-tre med rot i, akkurat som π-attributtene fra én kilde. Stien skrives ut rekursivt:

```text
PRINT-ALL-PAIRS-SHORTEST-PATH(Π, i, j)
1  if i == j
2      skriv ut i
3  elseif πᵢⱼ == NIL
4      skriv ut "ingen sti fra" i "til" j
5  else PRINT-ALL-PAIRS-SHORTEST-PATH(Π, i, πᵢⱼ)
6      skriv ut j
```

Prosedyren er Print-Path fra BFS med π-attributtet byttet ut med rad i i Π. Den tar tid proporsjonal med antall kanter på stien.

## Floyd-Warshall (F11)

Floyd-Warshall løser alle-til-alle-problemet med dynamisk programmering. Delproblemet d⁽ᵏ⁾ᵢⱼ er lengden av korteste vei fra i til j der alle **mellomnodene** er i {1, …, k}. For hver k avgjør vi om node k skal være med, og løser med tre nestede løkker i Θ(n³) tid.

**Læringsmål:** [K2] Forstå Floyd-Warshall.

### Problemet (Z1)

- **Input:** en n × n vektmatrise W for en rettet graf, uten negative sykler.
- **Output:** D⁽ⁿ⁾ = (δ(i, j)), og eventuelt forgjengermatrisen Π.

### Krav og forutsetninger (Z2)

- Negative kanter er lov, men ingen negative sykler. En negativ sykel avsløres ved at et diagonalelement blir negativt: d⁽ⁿ⁾ᵢᵢ < 0.
- Grafen er gitt som matrise. Med nabolister må vi først bygge W, Θ(V²).

### Dekomponering

Se på en korteste vei p fra i til j der alle mellomnodene er i {1, …, k}, og still ja-nei-spørsmålet: er k en mellomnode på p?

- **Nei:** da er alle mellomnodene i {1, …, k − 1}, og lengden er d⁽ᵏ⁻¹⁾ᵢⱼ.
- **Ja:** da deler k stien i i ⇝ k og k ⇝ j. Siden p er enkel, forekommer k bare én gang, så begge delstiene har mellomnoder i {1, …, k − 1}. Lengden er d⁽ᵏ⁻¹⁾ᵢₖ + d⁽ᵏ⁻¹⁾ₖⱼ (delstier av korteste veier er korteste veier).

Det gir rekurrensen (23.6):

d⁽ᵏ⁾ᵢⱼ = wᵢⱼ hvis k = 0, og min(d⁽ᵏ⁻¹⁾ᵢⱼ, d⁽ᵏ⁻¹⁾ᵢₖ + d⁽ᵏ⁻¹⁾ₖⱼ) hvis k ≥ 1.

Forgjengerne følger samme valg:

π⁽⁰⁾ᵢⱼ = NIL hvis i = j eller wᵢⱼ = ∞, ellers i.

π⁽ᵏ⁾ᵢⱼ = π⁽ᵏ⁻¹⁾ᵢⱼ hvis d⁽ᵏ⁻¹⁾ᵢⱼ ≤ d⁽ᵏ⁻¹⁾ᵢₖ + d⁽ᵏ⁻¹⁾ₖⱼ, ellers π⁽ᵏ⁻¹⁾ₖⱼ.

### Pseudokode

```text
FLOYD-WARSHALL(W, n)
1  D⁽⁰⁾ = W
2  for k = 1 to n
3      la D⁽ᵏ⁾ = (d⁽ᵏ⁾ᵢⱼ) være en ny n × n-matrise
4      for i = 1 to n
5          for j = 1 to n
6              d⁽ᵏ⁾ᵢⱼ = min(d⁽ᵏ⁻¹⁾ᵢⱼ, d⁽ᵏ⁻¹⁾ᵢₖ + d⁽ᵏ⁻¹⁾ₖⱼ)
7  return D⁽ⁿ⁾
```

### Trinn for trinn (Z3)

Hvert steg i figuren er én verdi av k. De grønne cellene er forbedret i den runden. Rad k og kolonne k (blå) brukes i formelen og endres ikke i runde k, fordi d⁽ᵏ⁻¹⁾ₖₖ = 0. Det siste steget skriver ut en sti med Print-All-Pairs-Shortest-Path.

<div class="algwidget" data-widget="floyd-warshall"></div>
<p class="algwidget-caption">Floyd-Warshall på bokas figur 23.1, med matrisene fra figur 23.4 · interaktiv</p>

### Korrekthet (Z4)

Ved induksjon på k: anta at D⁽ᵏ⁻¹⁾ inneholder korteste avstander med mellomnoder i {1, …, k − 1}. En korteste vei med mellomnoder i {1, …, k} bruker enten ikke k (lengde d⁽ᵏ⁻¹⁾ᵢⱼ) eller bruker k nøyaktig én gang (lengde d⁽ᵏ⁻¹⁾ᵢₖ + d⁽ᵏ⁻¹⁾ₖⱼ, siden det ikke finnes negative sykler og veien kan velges enkel). Minimum av de to er riktig. For k = n er alle noder tillatt, så D⁽ⁿ⁾ = (δ(i, j)).

### Styrker og svakheter (Z5)

- **Styrker:** enkel kode med små konstanter. Tåler negative kanter. Kan gjøres med én matrise i Θ(n²) minne, fordi oppdateringer i runde k ikke endrer rad eller kolonne k.
- **Svakheter:** Θ(V³) uansett hvor mange kanter grafen har. For tynne grafer uten negative kanter er Dijkstra fra hver node raskere.

### Kjøretid (Z6)

Tre nestede løkker med n iterasjoner hver og Θ(1) arbeid i linje 6: **Θ(n³)**. Minnet er Θ(n³) som skrevet (n + 1 matriser), men Θ(n²) hvis vi bare holder én eller to matriser. Print-All-Pairs-Shortest-Path tar O(n) per sti.

### Sjekk deg selv

1. Hva betyr d⁽ᵏ⁾ᵢⱼ?
2. Hvorfor brukes k høyst én gang på en korteste vei med mellomnoder i {1, …, k}?
3. Hvordan oppdager du en negativ sykel med Floyd-Warshall?
4. Hva skjer med πᵢⱼ når veien via k er bedre, og hvorfor?

??? success "Fasit"

    1. Lengden av korteste vei fra i til j der alle mellomnodene er i {1, …, k}.
    2. Det finnes ingen negative sykler, så en korteste vei kan velges enkel, og da forekommer k bare én gang.
    3. Et diagonalelement blir negativt: d⁽ⁿ⁾ᵢᵢ < 0 for en node i på sykelen.
    4. πᵢⱼ settes til πₖⱼ. Siste del av veien er den beste veien fra k til j, så forgjengeren til j er den samme som der.

## Transitive-Closure (F11)

Den transitive tillukningen av en rettet graf G er grafen G* = (V, E*) der (i, j) ∈ E* hvis det finnes en sti fra i til j. Transitive-Closure regner den ut med samme løkkestruktur som Floyd-Warshall, men med logiske operasjoner i stedet for min og +.

**Læringsmål:** [K3] Forstå Transitive-Closure.

### Problemet (Z1)

- **Input:** en rettet graf G = (V, E) med nodene 1, …, n.
- **Output:** en n × n-matrise T med tᵢⱼ = 1 hvis det finnes en sti fra i til j, ellers 0.

### Krav og forutsetninger (Z2)

- Ingen krav til grafen. Vekter er uten betydning.
- En node når alltid seg selv (stien med null kanter), så tᵢᵢ = 1.

### Pseudokode

t⁽ᵏ⁾ᵢⱼ = 1 hvis det finnes en sti fra i til j med alle mellomnodene i {1, …, k}. Da er t⁽ᵏ⁾ᵢⱼ = t⁽ᵏ⁻¹⁾ᵢⱼ ∨ (t⁽ᵏ⁻¹⁾ᵢₖ ∧ t⁽ᵏ⁻¹⁾ₖⱼ) (23.9).

```text
TRANSITIVE-CLOSURE(G, n)
1   la T⁽⁰⁾ = (t⁽⁰⁾ᵢⱼ) være en ny n × n-matrise
2   for i = 1 to n
3       for j = 1 to n
4           if i == j or (i, j) ∈ G.E
5               t⁽⁰⁾ᵢⱼ = 1
6           else t⁽⁰⁾ᵢⱼ = 0
7   for k = 1 to n
8       la T⁽ᵏ⁾ = (t⁽ᵏ⁾ᵢⱼ) være en ny n × n-matrise
9       for i = 1 to n
10          for j = 1 to n
11              t⁽ᵏ⁾ᵢⱼ = t⁽ᵏ⁻¹⁾ᵢⱼ ∨ (t⁽ᵏ⁻¹⁾ᵢₖ ∧ t⁽ᵏ⁻¹⁾ₖⱼ)
12  return T⁽ⁿ⁾
```

### Trinn for trinn (Z3)

<div class="algwidget" data-widget="transitive-closure"></div>
<p class="algwidget-caption">Transitive-Closure på bokas figur 23.5 · interaktiv</p>

### Korrekthet (Z4)

Samme argument som for Floyd-Warshall: en sti fra i til j med mellomnoder i {1, …, k} bruker enten ikke k, eller den går fra i til k og fra k til j med mellomnoder i {1, …, k − 1}. For k = n er alle mellomnoder tillatt.

### Styrker og svakheter (Z5)

- **Styrker:** enkel. Bitoperasjoner er ofte raskere enn heltallsaritmetikk, og bits tar mindre plass enn heltall.
- **Svakheter:** Θ(n³). Alternativt kan man kjøre Floyd-Warshall med vekt 1 på alle kanter (tᵢⱼ = 1 hvis dᵢⱼ < ∞), eller BFS/DFS fra hver node i Θ(V(V + E)), som er raskere for tynne grafer.

### Kjøretid (Z6)

Initialiseringen tar Θ(n²) og trippelløkken Θ(n³). Totalt **Θ(n³)**.

### Sjekk deg selv

1. Hva er forskjellen på formelen i Transitive-Closure og Floyd-Warshall?
2. Hvorfor er tᵢᵢ = 1?
3. Hvordan kan Floyd-Warshall brukes til å finne den transitive tillukningen?
4. Når er BFS fra hver node bedre?

??? success "Fasit"

    1. min erstattes med ∨ (eller), og + erstattes med ∧ (og).
    2. Hver node når seg selv via stien med null kanter.
    3. Gi alle kanter vekt 1 og kjør Floyd-Warshall. Da er tᵢⱼ = 1 hvis og bare hvis dᵢⱼ < ∞.
    4. For tynne grafer: V ganger BFS tar Θ(V(V + E)), som er mindre enn Θ(V³) når E er mye mindre enn V².
