# 1. Sortering ved sammenligning


Disse algoritmene ser på elementene bare gjennom sammenligninger (x ≤ y). Ingen av dem kan derfor ha bedre verste tilfelle enn Ω(n lg n), som vises i F4.

## Insertion-Sort (F1)

Insertion-Sort bygger opp en sortert del fra venstre, ett element om gangen: hvert nytt element settes inn på riktig plass blant dem som allerede er sortert. Kjøretiden er Θ(n) i beste tilfelle og Θ(n²) i verste og gjennomsnittlige tilfelle.

**Læringsmål fra F1 som gjelder her**

- [A8] Forstå Insertion-Sort
- [A7] Forstå løkkeinvarianter og induksjon (Insertion-Sort er bokas første eksempel)
- [A5] Kunne definere best-case, average-case og worst-case
- [A6] Forstå at alle av O, Ω, Θ, o og ω kan beskrive best-, worst- og average-case
- [A1] Forstå bokas pseudokode-konvensjoner, og [A2] kjenne egenskapene til RAM-modellen (brukes i kjøretidsanalysen)

**Intuisjon.** Tenk deg at du sorterer kort på hånda. Venstre hånd holder kortene du allerede har sortert. Du tar ett nytt kort fra bordet og sammenligner det med kortene på hånda fra høyre mot venstre, til du finner plassen der det hører hjemme. Kortene som er større, skyves ett hakk til høyre for å gi plass.

### Problemet (Z1, Z9, Z10)

Sorteringsproblemet:

- **Input:** En sekvens av n tall ⟨a₁, a₂, …, aₙ⟩, gitt som en tabell A[1 : n].
- **Output:** En permutasjon (omordning) ⟨a′₁, a′₂, …, a′ₙ⟩ av input slik at a′₁ ≤ a′₂ ≤ ⋯ ≤ a′ₙ.

Begge kravene til output er viktige: elementene skal stå i stigende rekkefølge, og det skal være nøyaktig de samme elementene som i input. En instans er én konkret input, for eksempel ⟨5, 2, 4, 6, 1, 3⟩, og problemstørrelsen er n, antall elementer.

### Krav og forutsetninger (Z2)

- Elementene må kunne sammenlignes med ≤ (en total ordning). Algoritmen ser bare på elementene gjennom sammenligninger, så den virker like godt for tall, strenger eller poster med en nøkkel.
- Utover det stilles ingen krav: input kan stå i hvilken som helst rekkefølge og kan inneholde like verdier.
- Algoritmen sorterer på stedet (in place): A endres direkte, og output er A etter at prosedyren er ferdig.

### Pseudokode

```text
INSERTION-SORT(A, n)
1  for i = 2 to n
2      key = A[i]
3      // Sett inn A[i] i den sorterte deltabellen A[1 : i − 1].
4      j = i − 1
5      while j > 0 and A[j] > key
6          A[j + 1] = A[j]
7          j = j − 1
8      A[j + 1] = key
```

Noen konvensjoner (A1) som betyr noe her:

- Tabeller indekseres fra 1, og A[1 : i − 1] betyr elementene A[1], …, A[i − 1], begge ender inkludert.
- Innrykk viser blokkstrukturen: linje 2–8 er kroppen til for-løkken, linje 6–7 kroppen til while-løkken.
- `and` kortslutter: er j = 0, evalueres ikke A[j], så vi leser aldri utenfor tabellen.
- Når en for-løkke er ferdig, har telleren verdien én mer enn grensen, her i = n + 1. Det bruker vi i korrekthetsbeviset.

### Trinn for trinn (Z3)

Hver iterasjon av for-løkken gjør tre ting:

1. Lagre A[i] i key. Plassen A[i] er nå et «hull» vi kan skrive over.
2. Gå mot venstre med j. Så lenge A[j] > key, flytt A[j] ett hakk til høyre (inn i hullet), slik at hullet flytter seg ett hakk til venstre.
3. Når A[j] ≤ key eller j = 0, stopper vi. Hullet står da på plass j + 1, og key settes inn der.

Figuren kjører algoritmen på input ⟨5, 2, 4, 6, 1, 3⟩ (bokas eksempel i figur 2.2). Trykk Neste og Tilbake for å gå ett steg om gangen: hvert steg er én linje eller én test i while-løkken, og linjen som utføres er markert i pseudokoden.

<div class="algwidget" data-widget="insertion-sort"></div>
<p class="algwidget-caption">Insertion-Sort på ⟨5, 2, 4, 6, 1, 3⟩ · 26 steg, interaktiv</p>
De skraverte cellene er den sorterte delen A[1 : i − 1] (invarianten), den stiplede cellen er hullet der key kan settes inn, og cellen med farget kant er A[j], som sammenlignes med key i linje 5.

Slik går while-løkken i iterasjonen i = 5, der key = 1 må helt fremst:

| j | Test i linje 5 | Handling | A etterpå |
| --- | --- | --- | --- |
| 4 | A[4] = 6 > 1: sann | A[5] = 6, j = 3 | 2 4 5 6 6 3 |
| 3 | A[3] = 5 > 1: sann | A[4] = 5, j = 2 | 2 4 5 5 6 3 |
| 2 | A[2] = 4 > 1: sann | A[3] = 4, j = 1 | 2 4 4 5 6 3 |
| 1 | A[1] = 2 > 1: sann | A[2] = 2, j = 0 | 2 2 4 5 6 3 |
| 0 | j > 0: usann, stopp | linje 8: A[1] = key = 1 | 1 2 4 5 6 3 |

Tabellen inneholder midlertidig duplikater (for eksempel 6 6). Det er helt i orden: den opprinnelige verdien til A[i] er trygt lagret i key, og hver kopiering skriver bare over en verdi som allerede finnes ett hakk til høyre. Testen i linje 5 ble utført 5 ganger her, altså t₅ = 5 = i, det høyeste mulige for denne i.

### Korrekthet (Z4, A7)

Vi beviser korrektheten med en **løkkeinvariant**, en påstand som er sann ved starten av hver iterasjon:

> **Invariant:** Ved starten av hver iterasjon av for-løkken (linje 1–8) består deltabellen A[1 : i − 1] av de elementene som opprinnelig lå i A[1 : i − 1], men i sortert rekkefølge.

Et invariantbevis har tre deler:

1. **Initialisering:** invarianten er sann før første iterasjon. Da er i = 2, og A[1 : 1] er bare elementet A[1]. Det er det opprinnelige elementet, og én verdi alene er trivielt sortert.
2. **Vedlikehold:** er invarianten sann før en iterasjon, er den sann før neste. Anta at A[1 : i − 1] er sortert. While-løkken flytter A[i − 1], A[i − 2], … ett hakk til høyre, nøyaktig de elementene som er større enn key, og stopper ved den første j der A[j] ≤ key (eller j = 0). Siden A[1 : i − 1] var sortert, er alle elementer til venstre for j også ≤ key. Key settes i A[j + 1], og alt til høyre for den er > key. Dermed består A[1 : i] av de opprinnelige elementene i A[1 : i], sortert. Når i økes med 1, gjelder invarianten igjen.
3. **Terminering:** løkken stopper, og invarianten gir oss det vi vil vise. For-løkken stopper når i > n, altså ved i = n + 1, siden hver iterasjon øker i med 1. Setter vi i = n + 1 inn i invarianten, får vi at A[1 : n] består av de opprinnelige elementene i A[1 : n], i sortert rekkefølge. Det er hele tabellen, sortert. While-løkken terminerer også alltid, siden j minker med 1 hver gang og løkken senest stopper ved j = 0.

**Kobling til induksjon (A7).** Initialisering tilsvarer basistilfellet, og vedlikehold tilsvarer induksjonstrinnet. Forskjellen er at vanlig induksjon fortsetter i det uendelige, mens vi her stopper når løkken terminerer og bruker invarianten for den siste verdien av i til å trekke konklusjonen.

Strengt tatt trenger vedlikeholdssteget en egen invariant for while-løkken (at A[j + 2 : i] inneholder de opprinnelige A[j + 1 : i − 1], alle større enn key). Boka argumenterer uformelt for denne delen, og det samme holder på eksamen.

### Styrker og svakheter (Z5)

| Egenskap | Insertion-Sort | Kommentar |
| --- | --- | --- |
| På stedet (in place) | Ja | Bare Θ(1) ekstra minne: variablene key, i og j |
| Stabil | Ja | Like verdier beholder innbyrdes rekkefølge, fordi testen i linje 5 er streng (A[j] > key) |
| Adaptiv | Ja | Nesten sortert input går raskt: antall flyttinger i linje 6 er lik antall inversjoner, altså par (k, l) med k < l og A[k] > A[l] |
| Online | Ja | Kan sortere elementene etter hvert som de kommer inn |
| Verste tilfelle | Θ(n²) | Dårligere enn Merge-Sort og Heapsort, som har Θ(n lg n) |

**Hvorfor stabil?** Anta input ⟨3ᵃ, 1, 3ᵇ⟩, der de to tretallene er like. Når key = 3ᵇ, stopper while-løkken ved 3ᵃ, fordi 3ᵃ > 3ᵇ er usann. Dermed havner 3ᵇ til høyre for 3ᵃ, som i input. Med testen A[j] ≥ key ville 3ᵇ ha passert 3ᵃ, og algoritmen ville ikke lenger vært stabil.

**Sammenlignet med de andre sorteringsalgoritmene:**

- **Merge-Sort** har Θ(n lg n) i alle tilfeller, men trenger Θ(n) ekstra minne til flettingen.
- **Heapsort** har Θ(n lg n) og sorterer på stedet, men er ikke stabil.
- **Quicksort** har Θ(n lg n) forventet, men Θ(n²) i verste tilfelle.

Insertion-Sort har lite overhead og er derfor rask for små n. Derfor brukes den ofte som subrutine; et pensumeksempel er Bucket-Sort (F4), som sorterer hver bøtte med Insertion-Sort.

### Kjøretid (Z6, A2, A5, A6)

I RAM-modellen (A2) tar hver linje konstant tid, kalt cₖ for linje k. La tᵢ være antall ganger testen i linje 5 utføres for en gitt i. Testen utføres én gang mer enn kroppen i linje 6–7, fordi den siste testen er den som feiler.

| Linje | Kostnad | Antall ganger |
| --- | --- | --- |
| 1 | c₁ | n |
| 2 | c₂ | n − 1 |
| 3 (kommentar) | 0 | n − 1 |
| 4 | c₄ | n − 1 |
| 5 | c₅ | t₂ + t₃ + ⋯ + tₙ |
| 6 | c₆ | (t₂ − 1) + ⋯ + (tₙ − 1) |
| 7 | c₇ | (t₂ − 1) + ⋯ + (tₙ − 1) |
| 8 | c₈ | n − 1 |

Linje 1 utføres n ganger, ikke n − 1, fordi testen som avslutter løkken (med i = n + 1) også teller. Summen av kostnad ganger antall gir

$$
T(n) = c_1 n + c_2(n-1) + c_4(n-1) + c_5\sum_{i=2}^{n} t_i + (c_6 + c_7)\sum_{i=2}^{n}(t_i - 1) + c_8(n-1)
$$

**Beste tilfelle, allerede sortert: Θ(n).** Da er A[i − 1] ≤ key hver gang, så testen feiler med en gang: tᵢ = 1 for alle i. Leddene med (tᵢ − 1) forsvinner, og T(n) = an + b for konstanter a og b. Kjøretiden er lineær, Θ(n).

**Verste tilfelle, omvendt sortert: Θ(n²).** Da er key mindre enn alle elementene i A[1 : i − 1], så j går helt ned til 0: tᵢ = i. Med håndtrykksformelen (appendiks A) får vi

$$
\sum_{i=2}^{n} i = \frac{n(n+1)}{2} - 1, \qquad \sum_{i=2}^{n} (i-1) = \frac{n(n-1)}{2}
$$

Innsatt gir dette T(n) = an² + bn + c, altså Θ(n²).

**Gjennomsnittlig tilfelle: Θ(n²).** Er input tilfeldig ordnet, er i snitt halvparten av elementene i A[1 : i − 1] større enn key, så tᵢ ≈ i/2. Det halverer omtrent n²-leddet, men kjøretiden er fortsatt kvadratisk.

**Et direkte argument for Ω(n²) i verste tilfelle** (bok 3.1). Anta at n er delelig med 3, og at de n/3 største verdiene ligger i de første n/3 posisjonene. I sortert output må hver av dem havne i de siste n/3 posisjonene, så hver av dem må passere alle de n/3 midterste posisjonene, ett hakk av gangen, i linje 6. Det gir minst (n/3) · (n/3) = n²/9 flyttinger, altså Ω(n²). Siden de to løkkene gir høyst (n − 1)(n − 1) iterasjoner, er kjøretiden også O(n²). Til sammen er verste tilfelle Θ(n²).

**Riktig bruk av notasjonen (A5, A6).** Beste, verste og gjennomsnittlige tilfelle er tre ulike funksjoner av n, og hver av dem kan beskrives med O, Ω, Θ, o og ω.

| Påstand | Riktig? | Hvorfor |
| --- | --- | --- |
| Verste tilfelle er Θ(n²) | Ja | Både O(n²) og Ω(n²), se over |
| Beste tilfelle er Θ(n) | Ja | T(n) = an + b |
| Kjøretiden er O(n²) | Ja | Gjelder all input, siden selv verste tilfelle er O(n²) |
| Kjøretiden er Ω(n) | Ja | Gjelder all input, siden selv beste tilfelle er Ω(n) |
| Kjøretiden er Θ(n²) | Nei | Feil for sortert input, som tar Θ(n) |
| Verste tilfelle er Ω(n) | Ja, men svakt | En nedre grense for maksimum, som «den høyeste i klassen er minst 1 m» |
| Beste tilfelle er O(n²) | Ja, men svakt | En øvre grense som ikke er tett |

### Sjekk deg selv

1. Hvorfor blir Insertion-Sort ustabil hvis testen i linje 5 endres til A[j] ≥ key?
2. Hva er kjøretiden hvis alle n elementene er like?
3. Hva blir tᵢ for hver i med input ⟨2, 1, 4, 3, 6, 5⟩, og hva sier det om kjøretiden for nesten sortert input?
4. Hvilken del av invariantbeviset bruker at telleren i har verdien n + 1 etter for-løkken?

??? success "Fasit"

    1. Med ≥ ville key passere like elementer til venstre for seg, så like verdier byttet innbyrdes rekkefølge.
    2. Θ(n). Testen A[j] > key er usann med en gang hver gang, så tᵢ = 1, som i beste tilfelle.
    3. tᵢ er 2 for i = 2, 4, 6 og 1 for i = 3, 5. Hvert element flyttes høyst ett hakk, så kjøretiden er Θ(n). Generelt er kjøretiden Θ(n + I), der I er antall inversjoner.
    4. Termineringen: der setter vi i = n + 1 inn i invarianten og får at hele A[1 : n] er sortert.

## Merge-Sort (F3)

Merge-Sort deler tabellen i to halvdeler, sorterer hver halvdel rekursivt og fletter (merger) de to sorterte halvdelene sammen. Kjøretiden er Θ(n lg n) i alle tilfeller, men algoritmen trenger Θ(n) ekstra minne.

**Læringsmål fra F3 som gjelder her**

- [C4] Forstå Merge-Sort
- [C1] Forstå rekursiv dekomponering og induksjon over delinstanser
- [C2] Forstå designmetoden divide-and-conquer (splitt og hersk)
- [C6] Kunne løse rekurrenser med substitusjon, rekursjonstrær og masterteoremet
- [C7] Kunne løse rekurrenser med iterasjonsmetoden (appendiks C)

**Splitt og hersk (C2).** Designmetoden har tre trinn:

1. **Splitt** (divide): del instansen i mindre delinstanser av samme problem. Her deler midtpunktet q = ⌊(p + r)/2⌋ tabellen A[p : r] i A[p : q] og A[q + 1 : r].
2. **Hersk** (conquer): løs delinstansene rekursivt. Små nok delinstanser (grunntilfellet) løses direkte; en tabell med 0 eller 1 element er allerede sortert.
3. **Kombiner** (combine): sett sammen delløsningene. Her fletter Merge to sorterte halvdeler til én sortert tabell.

I Merge-Sort er splittingen triviell, Θ(1), og alt arbeidet ligger i kombineringen. Quicksort er motsatt: arbeidet ligger i splittingen (Partition), og kombineringen er gratis.

### Problemet (Z1)

Merge-Sort løser det samme sorteringsproblemet som Insertion-Sort. Hjelpeprosedyren Merge løser et eget delproblem:

- **Input:** En tabell A og indekser p ≤ q < r slik at A[p : q] og A[q + 1 : r] hver for seg er sortert.
- **Output:** A[p : r] inneholder de samme elementene som før, i sortert rekkefølge.

### Krav og forutsetninger (Z2)

- Elementene må kunne sammenlignes med ≤.
- Merge krever at begge halvdelene allerede er sortert. Det er rekursjonen som sørger for det.
- Merge bruker hjelpetabellene L og R, altså Θ(n) ekstra minne. Merge-Sort sorterer derfor ikke på stedet.

### Pseudokode

```text
MERGE(A, p, q, r)
1   nL = q − p + 1                 // lengden til A[p : q]
2   nR = r − q                     // lengden til A[q + 1 : r]
3   la L[0 : nL − 1] og R[0 : nR − 1] være nye tabeller
4   for i = 0 to nL − 1            // kopier A[p : q] til L
5       L[i] = A[p + i]
6   for j = 0 to nR − 1            // kopier A[q + 1 : r] til R
7       R[j] = A[q + j + 1]
8   i = 0                          // indeks for minste gjenværende i L
9   j = 0                          // indeks for minste gjenværende i R
10  k = p                          // neste plass i A som skal fylles
11  // Så lenge både L og R har uflettede elementer:
12  while i < nL and j < nR
13      if L[i] ≤ R[j]
14          A[k] = L[i]
15          i = i + 1
16      else A[k] = R[j]
17          j = j + 1
18      k = k + 1
19  // Den ene er tom; kopier resten av den andre.
20  while i < nL
21      A[k] = L[i]
22      i = i + 1
23      k = k + 1
24  while j < nR
25      A[k] = R[j]
26      j = j + 1
27      k = k + 1

MERGE-SORT(A, p, r)
1   if p ≥ r                       // null eller ett element?
2       return
3   q = ⌊(p + r)/2⌋                // midtpunktet
4   MERGE-SORT(A, p, q)            // sorter venstre halvdel
5   MERGE-SORT(A, q + 1, r)        // sorter høyre halvdel
6   MERGE(A, p, q, r)              // flett dem sammen
```

Hele tabellen sorteres med kallet Merge-Sort(A, 1, n). L og R indekseres fra 0 i 4. utgave. Den forrige utgaven brukte i stedet vaktposter (∞) bakerst i L og R, men pensum er 4. utgave.

### Trinn for trinn (Z3)

Rekursjonen går alltid helt ned til venstre først. For n = 8 skjer de sju Merge-kallene i denne rekkefølgen: [1 : 2], [3 : 4], [1 : 4], [5 : 6], [7 : 8], [5 : 8] og til slutt [1 : 8]. En deltabell flettes altså først når begge barna i rekursjonstreet er ferdige.

<div class="algwidget" data-widget="merge-sort"></div>
<p class="algwidget-caption">Merge-Sort på ⟨12, 3, 7, 9, 14, 6, 11, 2⟩ · interaktiv</p>
I figuren er de skraverte cellene i A den delen av A[p : r] som allerede er flettet. De stiplede cellene har gamle verdier som ennå ikke er overskrevet; de ligger trygt i L og R. Cellen med farget kant i L og R er L[i] og R[j], de to minste gjenværende elementene, og det minste av dem kopieres til A[k].

### Korrekthet (Z4, C1)

**Merge.** Vi bruker en løkkeinvariant for while-løkken i linje 12–18:

> **Invariant:** Ved starten av hver iterasjon inneholder A[p : k − 1] de k − p minste elementene fra L og R, i sortert rekkefølge. Dessuten er L[i] og R[j] de minste elementene i hver sin tabell som ennå ikke er kopiert tilbake til A.

1. **Initialisering:** Før første iterasjon er k = p, så A[p : k − 1] er tom og inneholder trivielt de 0 minste elementene. Siden i = j = 0 og L og R er sortert, er L[0] og R[0] de minste i hver sin tabell.
2. **Vedlikehold:** Anta at L[i] ≤ R[j]. L[i] er det minste ukopierte elementet i L, og R[j] er det minste i R, så L[i] er det minste ukopierte elementet totalt. Linje 14 kopierer det til A[k], så A[p : k] inneholder de k − p + 1 minste, sortert. Når i og k økes, holder invarianten igjen. Tilfellet L[i] > R[j] er symmetrisk.
3. **Terminering:** Løkken stopper når en av L og R er tom. Elementene som er igjen i den andre, er sortert og er alle større enn eller lik alt som er kopiert, så løkkene i linje 20–27 setter dem riktig bakerst. Til slutt er k = r + 1, og A[p : r] inneholder alle r − p + 1 elementene, sortert.

**Merge-Sort.** Vi bruker sterk induksjon på n = r − p + 1, antall elementer:

- **Basis:** For n ≤ 1 er A[p : r] allerede sortert, og linje 1–2 returnerer uten å gjøre noe.
- **Induksjonstrinn:** Anta n ≥ 2, og at Merge-Sort sorterer alle tabeller med færre enn n elementer. De to halvdelene har ⌈n/2⌉ og ⌊n/2⌋ elementer, begge færre enn n. Ved induksjonshypotesen sorterer linje 4 og 5 dem, og siden Merge er korrekt, blir A[p : r] sortert.

Dette er **induksjon over delinstanser** (C1): vi antar at de rekursive kallene på mindre delinstanser gir rett svar, og trenger bare å sjekke at kombineringen er riktig. Det er den samme tankegangen som gjør at man kan skrive rekursive algoritmer uten å følge hvert kall i hodet.

### Styrker og svakheter (Z5)

| Egenskap | Merge-Sort | Kommentar |
| --- | --- | --- |
| Kjøretid | Θ(n lg n) i alle tilfeller | Asymptotisk optimal blant sammenligningsbaserte algoritmer (F4) |
| På stedet | Nei | Θ(n) ekstra minne til L og R |
| Stabil | Ja | Ved likhet velger linje 13 elementet fra L, som kom først i input |
| Adaptiv | Nei | Sortert input tar også Θ(n lg n) |

- **Mot Insertion-Sort:** Merge-Sort er langt raskere for store n, men har mer overhead, så Insertion-Sort vinner for små n.
- **Mot Heapsort:** samme kjøretid, men Heapsort sorterer på stedet og er ikke stabil.
- **Mot Quicksort:** Quicksort sorterer på stedet og er ofte raskere i praksis, men har Θ(n²) i verste tilfelle.

### Kjøretid (Z6, C6, C7)

**Merge tar Θ(n)** for n = r − p + 1. Linje 4–7 kopierer n elementer ut, og hver iterasjon av de tre while-løkkene kopierer ett element tilbake, så det blir nøyaktig n iterasjoner til sammen. Dette gjelder uansett rekkefølgen på elementene.

**Rekurrensen.** Merge-Sort gjør to rekursive kall på halve størrelsen pluss Θ(n) arbeid i Merge. Vi antar at n er en toerpotens; avrunding endrer ikke den asymptotiske løsningen.

$$
T(n) = \begin{cases} \Theta(1) & \text{hvis } n = 1 \\ 2T(n/2) + \Theta(n) & \text{hvis } n > 1 \end{cases}
$$

Vi løser den med alle de fire metodene i pensum. Skriv cn for Θ(n)-leddet.

**1. Rekursjonstre (C6).** Hvert kall av størrelse m bidrar med cm, og hvert nivå dobler antall kall mens størrelsen halveres:

| Nivå | Antall kall | Størrelse per kall | Kostnad på nivået |
| --- | --- | --- | --- |
| 0 | 1 | n | cn |
| 1 | 2 | n/2 | cn |
| 2 | 4 | n/4 | cn |
| i | 2ⁱ | n/2ⁱ | cn |
| lg n | n | 1 | cn |

Det er lg n + 1 nivåer, hvert med kostnad cn, så T(n) = cn(lg n + 1) = Θ(n lg n).

**2. Iterasjonsmetoden (C7, appendiks C).** Vi ekspanderer rekurrensen til vi ser et mønster:

$$
\begin{aligned} T(n) &= 2T(n/2) + cn \\ &= 2\bigl(2T(n/4) + cn/2\bigr) + cn = 4T(n/4) + 2cn \\ &= 8T(n/8) + 3cn \\ &= 2^i\,T(n/2^i) + i \cdot cn \\ &= n\,T(1) + cn \lg n \qquad (i = \lg n) \end{aligned}
$$

Vi valgte i = lg n fordi da er n/2ⁱ = 1, altså grunntilfellet. Resultatet er Θ(n lg n).

**3. Masterteoremet (C6).** For T(n) = aT(n/b) + f(n) med a > 0 og b > 1 sammenligner vi f(n) med vannskillefunksjonen n^(log\_b a):

| Tilfelle | Betingelse | Løsning |
| --- | --- | --- |
| 1 | f(n) = O(n^(log\_b a − ε)) for en ε > 0 | T(n) = Θ(n^(log\_b a)) |
| 2 | f(n) = Θ(n^(log\_b a) lgᵏ n) for en k ≥ 0 | T(n) = Θ(n^(log\_b a) lgᵏ⁺¹ n) |
| 3 | f(n) = Ω(n^(log\_b a + ε)) for en ε > 0, og a·f(n/b) ≤ c·f(n) for en c < 1 | T(n) = Θ(f(n)) |

For Merge-Sort er a = 2 og b = 2, så n^(log\_2 2) = n. Siden f(n) = Θ(n) = Θ(n lg⁰ n), er vi i tilfelle 2 med k = 0, og T(n) = Θ(n lg n).

**4. Substitusjon (C6).** Vi gjetter T(n) ≤ dn lg n og viser det med induksjon. Anta at gjetningen holder for n/2. Da er

$$
T(n) \le 2d\,\frac{n}{2}\lg\frac{n}{2} + cn = dn\lg n - dn + cn \le dn \lg n \quad \text{når } d \ge c
$$

Grunntilfellene (for eksempel n = 2 og 3) ordnes ved å velge d stor nok. Det samme argumentet med ≥ gir nedre grense, så T(n) = Θ(n lg n). Merk at substitusjon krever at du har en gjetning; den kommer ofte fra et rekursjonstre.

**Beste, verste og gjennomsnittlige tilfelle** er alle Θ(n lg n), fordi Merge alltid kopierer alle elementene uansett rekkefølge. Antall sammenligninger varierer litt, men ikke asymptotisk.

### Sjekk deg selv

1. Hvilken linje gjør Merge-Sort stabil, og hva skjer med stabiliteten om testen endres til L[i] < R[j]?
2. Hva er kjøretiden til Merge-Sort på en allerede sortert tabell?
3. Løs T(n) = 2T(n/2) + Θ(1) med masterteoremet.
4. Hvorfor kan vi i induksjonstrinnet anta at linje 4 og 5 sorterer halvdelene riktig?

??? success "Fasit"

    1. Linje 13 (L[i] ≤ R[j]). Med < ville like elementer bli tatt fra R først, og stabiliteten går tapt.
    2. Θ(n lg n). Merge kopierer alltid alle n elementer på hvert nivå.
    3. a = 2, b = 2, n^(log\_b a) = n, og f(n) = Θ(1) = O(n^(1 − ε)). Tilfelle 1 gir Θ(n).
    4. Fordi begge halvdelene har færre enn n elementer, og induksjonshypotesen dekker alle mindre størrelser (sterk induksjon).

## Quicksort og Randomized-Quicksort (F3)

Quicksort velger et pivotelement, deler tabellen slik at alt til venstre er ≤ pivoten og alt til høyre er større, og sorterer de to sidene rekursivt. Den sorterer på stedet og er ofte raskest i praksis, men verste tilfelle er Θ(n²). Randomized-Quicksort velger pivoten tilfeldig og har forventet kjøretid Θ(n lg n) for all input.

**Læringsmål fra F3 som gjelder her**

- [C5] Forstå Quicksort og Randomized-Quicksort
- [C2] Forstå designmetoden splitt og hersk
- [C6] Kunne løse rekurrenser (her rekursjonstrær for skjeve delinger)

**Splitt og hersk i Quicksort.** Splitt: Partition deler A[p : r] rundt pivoten x i A[p : q − 1] (alt ≤ x), A[q] = x og A[q + 1 : r] (alt > x). Hersk: sorter de to sidene rekursivt. Kombiner: ingenting å gjøre, siden pivoten allerede står på riktig plass og sidene sorteres på stedet.

### Problemet (Z1)

Quicksort løser sorteringsproblemet. Partition løser et eget delproblem:

- **Input:** En tabell A og indekser p ≤ r.
- **Output:** En indeks q og en omordning av A[p : r] slik at A[q] er den opprinnelige A[r] (pivoten x), alle elementer i A[p : q − 1] er ≤ x, og alle i A[q + 1 : r] er > x.

### Krav og forutsetninger (Z2)

- Elementene må kunne sammenlignes med ≤.
- Randomized-Quicksort krever en generator RANDOM(p, r) som returnerer et heltall i [p, r], med lik sannsynlighet for hver verdi.
- Ingen krav til input. Men kjøretiden til vanlig Quicksort avhenger sterkt av input: sortert input er verste tilfelle.

### Pseudokode

```text
QUICKSORT(A, p, r)
1  if p < r
2      // Del deltabellen rundt pivoten, som havner i A[q].
3      q = PARTITION(A, p, r)
4      QUICKSORT(A, p, q − 1)      // sorter lav side
5      QUICKSORT(A, q + 1, r)      // sorter høy side

PARTITION(A, p, r)
1  x = A[r]                       // pivoten
2  i = p − 1                      // høyeste indeks på lav side
3  for j = p to r − 1             // behandle hvert element unntatt pivoten
4      if A[j] ≤ x                // hører elementet til på lav side?
5          i = i + 1              // ny plass på lav side
6          bytt A[i] og A[j]      // legg elementet der
7  bytt A[i + 1] og A[r]          // pivoten rett til høyre for lav side
8  return i + 1                   // pivotens nye indeks

RANDOMIZED-PARTITION(A, p, r)
1  i = RANDOM(p, r)
2  bytt A[r] og A[i]
3  return PARTITION(A, p, r)

RANDOMIZED-QUICKSORT(A, p, r)
1  if p < r
2      q = RANDOMIZED-PARTITION(A, p, r)
3      RANDOMIZED-QUICKSORT(A, p, q − 1)
4      RANDOMIZED-QUICKSORT(A, q + 1, r)
```

Randomized-Quicksort er altså vanlig Quicksort der et tilfeldig valgt element byttes inn som pivot før hver Partition.

### Trinn for trinn (Z3)

Under Partition er A[p : r] delt i fire områder: lav side A[p : i] (≤ x), høy side A[i + 1 : j − 1] (> x), ubehandlet A[j : r − 1] og pivoten A[r]. Hver iterasjon flytter grensen j ett hakk. Er A[j] ≤ x, utvides lav side ved at A[j] byttes med det første elementet på høy side. Ellers utvides høy side bare ved at j går videre.

<div class="algwidget" data-widget="quicksort"></div>
<p class="algwidget-caption">Quicksort på ⟨2, 8, 7, 1, 3, 5, 6, 4⟩ · interaktiv</p>
Eksempelet er bokas figur 7.1. Elementer som ikke er med i det nåværende kallet, er nedtonet, og hver pivot blir stående fast etter sitt kall.

### Korrekthet (Z4)

**Partition.** Invarianten gjelder ved starten av hver iterasjon av for-løkken i linje 3–6, for hver indeks k:

> **Invariant:** (1) Hvis p ≤ k ≤ i, er A[k] ≤ x. (2) Hvis i + 1 ≤ k ≤ j − 1, er A[k] > x. (3) Hvis k = r, er A[k] = x.

1. **Initialisering:** Før første iterasjon er i = p − 1 og j = p. Det finnes ingen k mellom p og i, og ingen mellom i + 1 og j − 1, så (1) og (2) holder trivielt. Linje 1 gir (3).
2. **Vedlikehold:** Hvis A[j] > x, økes bare j, og A[j − 1] > x, så (2) holder. Hvis A[j] ≤ x, økes i, og A[i] byttes med A[j]. Da er A[i] ≤ x, som gir (1). Elementet som ble flyttet til A[j], var før på høy side og er > x, så (2) holder også.
3. **Terminering:** Løkken stopper ved j = r. Da er hvert element i A[p : r − 1] på lav eller høy side. Linje 7 bytter pivoten med det første elementet på høy side, så den havner mellom de to sidene, og linje 8 returnerer posisjonen.

**Quicksort.** Sterk induksjon på n = r − p + 1. For n ≤ 1 er tabellen sortert. For n ≥ 2 står pivoten etter Partition på plass q, med alt mindre eller likt til venstre og alt større til høyre. Begge sidene har færre enn n elementer, så de rekursive kallene sorterer dem (induksjonshypotesen). Da er hele A[p : r] sortert.

### Styrker og svakheter (Z5)

| Egenskap | Quicksort | Kommentar |
| --- | --- | --- |
| Verste tilfelle | Θ(n²) | Også for Randomized-Quicksort, men med svært liten sannsynlighet |
| Forventet / gjennomsnitt | Θ(n lg n) | Små konstanter, ofte raskest i praksis |
| På stedet | Ja | Bare byttene i A; rekursjonsstakken kommer i tillegg |
| Stabil | Nei | Byttene flytter elementer langt, forbi like elementer |

**Hvorfor ikke stabil?** Med A = ⟨2ᵃ, 2ᵇ, 1⟩ er x = 1, og begge totallene havner på høy side. Linje 7 bytter A[1] = 2ᵃ med A[3] = 1, og resultatet er ⟨1, 2ᵇ, 2ᵃ⟩: de like elementene har byttet rekkefølge.

**Vanlig mot randomisert.** Vanlig Quicksort har dårlig input som alltid gir Θ(n²), for eksempel sortert eller omvendt sortert input. Randomized-Quicksort har ingen slik dårlig input: kjøretiden avhenger bare av de tilfeldige valgene, og forventet kjøretid er Θ(n lg n) for hver input. En viktig fallgruve: hvis alle elementene er like, gir begge versjonene Θ(n²), fordi alt havner på lav side uansett pivot.

**Mot de andre:** Merge-Sort har Θ(n lg n) garantert og er stabil, men trenger Θ(n) ekstra minne. Heapsort har Θ(n lg n) garantert og sorterer på stedet, men er i praksis ofte tregere enn Quicksort.

### Kjøretid (Z6, C6)

**Partition tar Θ(n)** for n = r − p + 1: for-løkken har n − 1 iterasjoner med konstant arbeid hver.

**Verste tilfelle: Θ(n²).** Det skjer når Partition hver gang gir en side med n − 1 elementer og en tom side, for eksempel når input er sortert og pivoten A[r] alltid er størst. Da er

$$
T(n) = T(n-1) + T(0) + \Theta(n) = \sum_{k=1}^{n} \Theta(k) = \Theta(n^2)
$$

Summen er den aritmetiske rekken fra appendiks A. Ironisk nok tar Insertion-Sort bare Θ(n) på samme input.

**Beste tilfelle: Θ(n lg n).** Hvis pivoten hver gang deler i to like store halvdeler, får vi T(n) = 2T(n/2) + Θ(n), som er Merge-Sort-rekurrensen med løsning Θ(n lg n).

**Balanserte, men skjeve delinger gir også O(n lg n).** Anta at delingen alltid er 9 : 1, så T(n) = T(9n/10) + T(n/10) + cn. I rekursjonstreet koster hvert nivå høyst cn, og den lengste stien fra roten (alltid 9/10) har lengde log med grunntall 10/9 av n, som er Θ(lg n). Dermed er T(n) = O(n lg n). Det samme gjelder enhver fast proporsjon, uansett hvor skjev. Det er derfor Quicksort er rask i gjennomsnitt: selv middels dårlige pivoter er gode nok.

**Forventet kjøretid for Randomized-Quicksort: Θ(n lg n).** Kjøretiden domineres av antall sammenligninger i linje 4 i Partition. Kall elementene z₁ < z₂ < ⋯ < zₙ i sortert rekkefølge. To elementer zᵢ og zⱼ sammenlignes bare hvis det ene av dem er pivot, og det skjer akkurat når det første elementet som velges som pivot blant {zᵢ, …, zⱼ}, er zᵢ eller zⱼ. Velges noe mellom dem først, havner de på hver sin side og sammenlignes aldri. Med tilfeldig pivot er sannsynligheten 2/(j − i + 1). Med indikatorvariabler får vi forventet antall sammenligninger:

$$
E[X] = \sum_{i=1}^{n-1}\sum_{j=i+1}^{n} \frac{2}{j-i+1} < \sum_{i=1}^{n-1}\sum_{k=1}^{n} \frac{2}{k} = \sum_{i=1}^{n-1} O(\lg n) = O(n \lg n)
$$

Den indre summen er den harmoniske rekken, som er O(lg n).

**Forventet mot gjennomsnittlig (A5).** Gjennomsnittlig kjøretid for vanlig Quicksort er et snitt over alle mulige input, under antagelsen at alle rekkefølger er like sannsynlige. Forventet kjøretid for Randomized-Quicksort er et snitt over algoritmens egne tilfeldige valg, for en fast input, og gjelder dermed for hver eneste input. Begge er Θ(n lg n), men den forventede kjøretiden krever ingen antagelse om input.

### Sjekk deg selv

1. Hva blir kjøretiden til Quicksort når alle elementene er like?
2. Hvorfor gir en fast 99 : 1-deling fortsatt O(n lg n)?
3. Hva er forskjellen på forventet kjøretid for Randomized-Quicksort og gjennomsnittlig kjøretid for Quicksort?
4. Hvilken input gir verste tilfelle for vanlig Quicksort, og hvorfor hjelper randomisering?

??? success "Fasit"

    1. Θ(n²). Alle elementene er ≤ x, så Partition gir alltid en tom høy side, også med tilfeldig pivot.
    2. Hvert nivå i rekursjonstreet koster høyst cn, og dybden er log med grunntall 100/99 av n, som er Θ(lg n) fordi grunntallet er en konstant større enn 1.
    3. Gjennomsnittet tas over tilfeldig input. Forventningen tas over algoritmens tilfeldige valg og gjelder for hver input.
    4. Sortert eller omvendt sortert input, der A[r] alltid er størst eller minst. Med tilfeldig pivot finnes ingen fast dårlig input; dårlige delinger skjer bare ved uflaks.

