# 6. Grådige algoritmer


En grådig algoritme bygger løsningen gjennom en serie valg, der hvert valg tas lokalt: det som ser best ut her og nå, uten å se på konsekvensene senere. Algoritmene blir enkle og raske, men det krever et bevis at de gir optimal løsning, og for mange problemer gjør de det ikke.

**Læringsmål fra F7 som gjelder hele kategorien**

- [G1] Forstå designmetoden grådighet
- [G2] Forstå grådighetsegenskapen (the greedy-choice property)
- [G3] Forstå eksemplene aktivitetsutvelgelse og det kontinuerlige ryggsekkproblemet

## Grådighet som designmetode (G1, G2)

Boka beskriver tre trinn:

1. Formuler problemet slik at vi gjør ett valg og står igjen med én delinstans.
2. Vis at det finnes en optimal løsning som inneholder det grådige valget (**grådighetsegenskapen**).
3. Vis at det grådige valget pluss en optimal løsning på den gjenværende delinstansen gir en optimal løsning (**optimal delstruktur**).

Med begge egenskapene får vi korrekthet med induksjon: hvert grådige valg holder muligheten for en optimal løsning åpen, og resten løses (grådig) optimalt.

**Ukens snubletråd.** Det er lett å tro at grådighetsegenskapen alene betyr at grådige valg gir en optimal løsning. Men egenskapen sier bare at vi kan gjøre *ett* grådig valg og fortsatt ha mulighet til å nå en optimal løsning, hvis vi fortsetter riktig. At gjentatte grådige valg gir optimum, følger først når vi også har optimal delstruktur.

**Grådighet mot DP.** I DP løser vi delinstansene først og velger så det beste alternativet. I grådighet velger vi først, uten å løse noen delinstanser, og står da igjen med bare én. Grådige algoritmer jobber derfor ovenfra og ned og er ofte mye raskere.

**Hvordan vise grådighetsegenskapen:** Det vanlige er et *bytteargument*. Ta en vilkårlig optimal løsning. Hvis den ikke inneholder det grådige valget, bytt ut et av elementene med det grådige valget, og vis at løsningen fortsatt er gyldig og minst like god.

## Aktivitetsutvelgelse (F7)

Vi skal velge flest mulig aktiviteter som ikke overlapper i tid, for eksempel møter i ett rom. Den grådige strategien er å alltid velge aktiviteten som slutter tidligst blant dem som fortsatt er mulige. Med aktivitetene sortert på sluttid tar det Θ(n).

### Problemet (Z1)

- **Input:** En mengde S = {a₁, …, aₙ} av aktiviteter, der aktivitet aᵢ har starttid sᵢ og sluttid fᵢ, med 0 ≤ sᵢ < fᵢ < ∞. Aktiviteten opptar det halvåpne intervallet [sᵢ, fᵢ).
- **Output:** En størst mulig delmengde av aktiviteter som er parvis kompatible. To aktiviteter er kompatible hvis intervallene ikke overlapper, altså hvis sᵢ ≥ fⱼ eller sⱼ ≥ fᵢ.

### Krav og forutsetninger (Z2)

- Aktivitetene må være sortert etter stigende sluttid: f₁ ≤ f₂ ≤ ⋯ ≤ fₙ. Er de ikke det, sorteres de først i O(n lg n).
- Vi maksimerer **antall** aktiviteter. Har aktivitetene vekter (verdier), virker ikke denne grådige strategien, og man trenger DP.

### Pseudokode

```text
RECURSIVE-ACTIVITY-SELECTOR(s, f, k, n)
1  m = k + 1
2  while m ≤ n and s[m] < f[k]     // finn første aktivitet i Sₖ som slutter
3      m = m + 1
4  if m ≤ n
5      return {aₘ} ∪ RECURSIVE-ACTIVITY-SELECTOR(s, f, m, n)
6  else return ∅

GREEDY-ACTIVITY-SELECTOR(s, f, n)
1  A = {a₁}
2  k = 1
3  for m = 2 to n
4      if s[m] ≥ f[k]                // er aₘ i Sₖ?
5          A = A ∪ {aₘ}             // ja, velg den
6          k = m                     // og fortsett derfra
7  return A
```

Den rekursive versjonen kalles med en fiktiv aktivitet a₀ med f₀ = 0: Recursive-Activity-Selector(s, f, 0, n). Sₖ er mengden av aktiviteter som starter etter at aₖ er ferdig.

### Trinn for trinn (Z3)

Variabelen k er den sist valgte aktiviteten. Siden aktivitetene er sortert på sluttid, er den første aₘ med sₘ ≥ fₖ automatisk den som slutter tidligst blant de kompatible.

<div class="algwidget" data-widget="activity-selection"></div>
<p class="algwidget-caption">Greedy-Activity-Selector på elleve aktiviteter · interaktiv</p>
Resultatet er {a₁, a₄, a₈, a₁₁}. Det finnes andre optimale løsninger, for eksempel {a₂, a₄, a₉, a₁₁}, men ingen med fem aktiviteter.

### Korrekthet (Z4)

**Grådighetsegenskapen (Teorem 15.1).** La Sₖ være en ikke-tom delinstans, og la aₘ være aktiviteten i Sₖ som slutter tidligst. Da er aₘ med i en størst mulig mengde kompatible aktiviteter i Sₖ.

*Bevis (bytteargument):* La Aₖ være en størst mulig kompatibel mengde i Sₖ, og la aⱼ være aktiviteten i Aₖ som slutter tidligst. Er aⱼ = aₘ, er vi ferdige. Ellers lager vi A′ₖ = (Aₖ − {aⱼ}) ∪ {aₘ}. Siden fₘ ≤ fⱼ, overlapper aₘ ingen av de andre aktivitetene i Aₖ, som alle starter etter at aⱼ slutter. A′ₖ er altså kompatibel og like stor som Aₖ, og inneholder aₘ.

**Optimal delstruktur.** Når aₘ er valgt, er de gjenværende mulige aktivitetene akkurat Sₘ. En optimal løsning for Sₖ som inneholder aₘ, består av aₘ og en optimal løsning for Sₘ; ellers kunne vi byttet ut resten med en større mengde.

Med induksjon på antall valg gir de to egenskapene at Greedy-Activity-Selector finner en optimal mengde. Den iterative versjonen har invarianten at A er en delmengde av en optimal løsning, og at aₖ er det sist valgte elementet.

**Andre grådige valg virker ikke.** Å velge den korteste aktiviteten feiler: med [0, 5), [4, 6) og [5, 10) velges [4, 6), som overlapper begge de andre, mens optimum er de to andre. Å velge den som starter tidligst feiler: én lang aktivitet [0, 100) kan blokkere mange korte.

### Styrker og svakheter (Z5)

- **Styrker:** Lineær tid etter sortering, mot Θ(n³) for den naive DP-løsningen med delinstanser Sᵢⱼ som boka viser først. Ingen tabeller.
- **Svakheter:** Virker bare for det uvektede problemet. Med vekter må man bruke DP.

### Kjøretid (Z6)

Begge versjonene ser på hver aktivitet én gang, så de tar Θ(n) gitt at aktivitetene er sortert på sluttid. Med sortering blir totalen O(n lg n). Kjøretiden er den samme for all input.

## Kontinuerlig ryggsekk (F7)

I den kontinuerlige varianten av ryggsekkproblemet kan vi ta med en vilkårlig andel av hver gjenstand, som om gjenstandene var gullstøv. Da virker den grådige strategien: ta så mye som mulig av gjenstanden med høyest verdi per vektenhet, og fortsett nedover.

**Problemet (Z1):** Input er som for den binære varianten: verdier vᵢ, vekter wᵢ og kapasitet W. Output er andeler xᵢ ∈ [0, 1] slik at summen av xᵢwᵢ er høyst W og summen av xᵢvᵢ er størst mulig.

**Algoritmen (Z3):**

1. Regn ut verditettheten vᵢ/wᵢ for hver gjenstand, og sorter synkende på den.
2. Gå gjennom gjenstandene i den rekkefølgen. Ta med hele gjenstanden hvis den får plass.
3. Den første gjenstanden som ikke får plass helt, tas med så mye som det er plass til. Da er sekken full.

**Eksempel (bokas figur 15.3):** W = 50.

| Gjenstand | Vekt | Verdi | Verdi per kg | Tatt med |
| --- | --- | --- | --- | --- |
| 1 | 10 | 60 | 6 | hele, verdi 60 |
| 2 | 20 | 100 | 5 | hele, verdi 100 |
| 3 | 30 | 120 | 4 | 20 av 30 kg, verdi 80 |

Totalverdien blir 240. I den binære varianten er beste løsning 220 (gjenstand 2 og 3), og den grådige strategien ville gitt bare 160.

**Korrekthet (Z4):** Grådighetsegenskapen vises med et bytteargument. Inneholder en optimal løsning mindre enn mulig av gjenstanden med høyest tetthet, kan vi bytte ut like mye vekt av en gjenstand med lavere tetthet med den. Totalvekten er den samme og verdien blir ikke lavere. Etter det grådige valget er resten et mindre kontinuerlig ryggsekkproblem (optimal delstruktur).

**Hvorfor feiler grådighet for den binære varianten (Z5)?** Der kan vi ikke ta deler av en gjenstand. Et grådig valg kan etterlate ubrukt plass som en annen kombinasjon kunne utnyttet bedre, så bytteargumentet virker ikke. Derfor trengs DP der.

**Kjøretid (Z6):** Sorteringen dominerer: O(n lg n). Selve gjennomgangen tar Θ(n).

### Sjekk deg selv

1. Hva sier grådighetsegenskapen, og hvorfor er den ikke nok alene?
2. Gi et eksempel der «velg den korteste aktiviteten» gir feil svar.
3. Hvorfor trenger Greedy-Activity-Selector bare å sammenligne sₘ med fₖ?
4. Hvorfor virker grådighet for kontinuerlig, men ikke for binær ryggsekk?

??? success "Fasit"

    1. At det finnes en optimal løsning som inneholder det grådige valget. For at gjentatte grådige valg skal gi optimum, trengs også optimal delstruktur.
    2. [0, 5), [4, 6) og [5, 10): den korteste overlapper begge de andre, så vi får 1 i stedet for 2.
    3. Alle valgte aktiviteter slutter senest ved fₖ, så aₘ er kompatibel med alle dem hvis og bare hvis sₘ ≥ fₖ.
    4. I den kontinuerlige kan vi alltid fylle sekken helt med den beste tettheten, så bytteargumentet virker. I den binære kan det bli ubrukt plass.

## Huffman-koder (F7)

Huffman lager en optimal prefikskode for et alfabet der tegnene har kjente frekvenser. Algoritmen slår grådig sammen de to minst hyppige trærne, igjen og igjen, til det er ett tre igjen. Med en min-haug som prioritetskø tar det O(n lg n).

**Læringsmål:** [G4] Forstå Huffman og Huffman-koder.

### Bakgrunn: prefikskoder

Vi vil kode hvert tegn som en bitstreng, slik at teksten blir kortest mulig. Med **fast lengde** får alle tegn like mange bits (3 bits for 6 tegn). Med **variabel lengde** får hyppige tegn korte kodeord.

En **prefikskode** er en kode der ingen kodeord er et prefiks av et annet. Da kan en bitstreng dekodes entydig fra venstre: les bits til de utgjør et kodeord, skriv ut tegnet og start på nytt. En prefikskode kan representeres som et binært tre der tegnene er løvnoder, og kodeordet for et tegn er stien fra roten (0 = venstre, 1 = høyre). En optimal kode svarer alltid til et *fullt* binært tre, der hver indre node har to barn.

**Kostnaden** til et tre T er antall bits som trengs for å kode filen:

$$
B(T) = \sum_{c \in C} c.\mathit{freq} \cdot d_T(c)
$$

der d\_T(c) er dybden til c i treet, altså lengden av kodeordet.

### Problemet (Z1)

- **Input:** Et alfabet C med n tegn, der hvert tegn c har en frekvens c.freq.
- **Output:** En prefikskode (et fullt binært tre T med tegnene som løvnoder) med minst mulig kostnad B(T).

### Krav og forutsetninger (Z2)

- Frekvensene må være kjent på forhånd. I praksis krever det en ekstra gjennomgang av filen.
- n ≥ 2, slik at det blir n − 1 sammenslåinger.
- Q er en min-prioritetskø med frekvens som nøkkel, typisk en min-haug.

### Pseudokode

```text
HUFFMAN(C)
1   n = |C|
2   Q = C                         // min-prioritetskø med freq som nøkkel
3   for i = 1 to n − 1
4       lag en ny node z
5       x = EXTRACT-MIN(Q)
6       y = EXTRACT-MIN(Q)
7       z.left = x
8       z.right = y
9       z.freq = x.freq + y.freq
10      INSERT(Q, z)
11  return EXTRACT-MIN(Q)         // roten, den eneste noden som er igjen
```

### Trinn for trinn (Z3)

I starten er hvert tegn sitt eget tre i Q. Hver iterasjon tar ut de to trærne med lavest frekvens, henger dem under en ny node med summen som frekvens, og setter den nye noden inn i Q. Antall trær i Q minker med 1 per iterasjon.

<div class="algwidget" data-widget="huffman"></div>
<p class="algwidget-caption">Huffman på seks tegn · interaktiv</p>
Eksempelet er bokas figur 15.5, med frekvensene i tusen. Kodene blir a = 0, c = 100, b = 101, d = 111, f = 1100 og e = 1101. Den totale kostnaden er 224 000 bits, mot 300 000 med fast lengde, en besparelse på omtrent 25 %.

### Korrekthet (Z4)

Beviset følger det grådige mønsteret med to lemmaer.

**Lemma 15.2 (grådighetsegenskapen).** La x og y være de to tegnene med lavest frekvens. Da finnes en optimal prefikskode der x og y har kodeord med samme lengde som bare skiller seg i siste bit, altså der de er søsken på det dypeste nivået i treet.

*Bevisidé (bytteargument):* Ta et optimalt tre T, og la a og b være to søsken på størst dybde. Bytt x med a og y med b. Siden x og y har lavest frekvens og a og b har størst dybde, flytter vi lave frekvenser dypere og høye frekvenser grunnere. Kostnaden kan ikke øke, så det nye treet er også optimalt.

**Lemma 15.3 (optimal delstruktur).** La C′ være C der x og y er erstattet med et nytt tegn z med z.freq = x.freq + y.freq. Hvis T′ er et optimalt tre for C′, får vi et optimalt tre T for C ved å erstatte løvnoden z med en indre node med barna x og y. Kostnadene henger sammen som B(T) = B(T′) + x.freq + y.freq.

**Teorem 15.4.** Huffman produserer en optimal prefikskode. Det følger med induksjon på n av de to lemmaene: det første valget er trygt (Lemma 15.2), og resten er Huffman på et alfabet med ett tegn færre (Lemma 15.3).

### Styrker og svakheter (Z5)

- **Styrker:** Optimal blant alle prefikskoder som koder ett tegn om gangen. Enkel å implementere med en haug.
- **Svakheter:** Krever kjente frekvenser, altså to gjennomganger av dataene, og at kodetreet sendes med. Koder som ser på grupper av tegn eller tilpasser seg underveis, kan komprimere bedre.
- **Kobling til hauger (F5):** Huffman er et typisk eksempel på bruk av en min-prioritetskø.

### Kjøretid (Z6)

Med Q som en binær min-haug:

- Linje 2 bygger haugen med Build-Min-Heap i O(n).
- For-løkken har n − 1 iterasjoner, og hver gjør to Extract-Min og én Insert, hver O(lg n).

Totalt O(n lg n). Kjøretiden avhenger ikke av frekvensene.

### Sjekk deg selv

1. Hvorfor må koden være en prefikskode?
2. Regn ut kostnaden for treet i figuren.
3. Hvorfor kan vi anta at de to minst hyppige tegnene er søsken på dypeste nivå?
4. Hvilken datastruktur gir O(n lg n), og hva ville kjøretiden blitt med en usortert liste som Q?

??? success "Fasit"

    1. Ellers kan en bitstreng tolkes på flere måter, og dekodingen blir tvetydig.
    2. 45·1 + 12·3 + 13·3 + 16·3 + 5·4 + 9·4 = 224 (tusen bits).
    3. Bytteargumentet i Lemma 15.2: å bytte dem med de dypeste søsknene kan ikke øke kostnaden.
    4. En binær min-haug. Med en usortert liste tar Extract-Min Θ(n), og totalen blir Θ(n²).

