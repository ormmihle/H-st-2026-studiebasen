# 3. Søk og utvalg


Algoritmene her finner ett bestemt element uten å sortere alt: binærsøk finner en verdi i en sortert tabell i Θ(lg n), og Randomized-Select og Select finner det k-te minste elementet i en usortert tabell i lineær tid.

## Bisect og Bisect′ (F3)

Binærsøk sammenligner verdien v med midtelementet i et sortert intervall og fortsetter i den halvdelen der v må ligge. Intervallet halveres for hver sammenligning, så kjøretiden er Θ(lg n) i verste tilfelle. Bisect er den rekursive versjonen, Bisect′ den iterative.

**Læringsmål:** [C3] Forstå Bisect og Bisect′ (se appendiks D i pensumheftet).

### Problemet (Z1)

- **Input:** En sortert tabell A[1 : n], indekser p og r, og en verdi v.
- **Output:** En indeks i med A[i] = v, hvis v finnes i A[p : r]; ellers nil.

### Krav og forutsetninger (Z2)

- A må være sortert i stigende rekkefølge. På en usortert tabell gir binærsøk feil svar.
- Vi trenger direkte tilgang til A[q] i konstant tid (en tabell, ikke en lenket liste).
- Finnes v flere ganger, returneres en av forekomstene, ikke nødvendigvis den første.

### Pseudokode

```text
BISECT(A, p, r, v)
1  if p ≤ r
2      q = ⌊(p + r)/2⌋
3      if v == A[q]
4          return q
5      else if v < A[q]
6          return BISECT(A, p, q − 1, v)
7      else return BISECT(A, q + 1, r, v)
8  else return nil

BISECT′(A, p, r, v)
1  while p ≤ r
2      q = ⌊(p + r)/2⌋
3      if v == A[q]
4          return q
5      else if v < A[q]
6          r = q − 1
7      else p = q + 1
8  return nil
```

Det rekursive kallet i Bisect kommer helt til slutt, og returverdien sendes rett videre (et *tail call*). Derfor kan det oversettes direkte til en løkke, som gir Bisect′ (se appendiks G).

### Trinn for trinn (Z3)

I hvert steg regnes midtpunktet q ut. Er A[q] = v, er vi ferdige. Er v mindre, kan v bare ligge til venstre for q, så r flyttes til q − 1. Er v større, flyttes p til q + 1. Når p > r, er intervallet tomt og v finnes ikke.

<div class="algwidget" data-widget="bisect"></div>
<p class="algwidget-caption">Bisect′ på de 15 første primtallene · interaktiv</p>
### Korrekthet (Z4)

**Bisect (rekursiv):** Induksjon på lengden til A[p : r].

- **Basis:** Er p > r, er intervallet tomt, og nil er riktig svar. Er p = r, er q = p, og vi returnerer q hvis A[q] = v. Ellers går vi til et tomt intervall og får nil, som også er riktig.
- **Induksjonstrinn:** Anta p < r, og at Bisect gir riktig svar for alle kortere intervaller. Er A[q] = v, er svaret riktig. Er v < A[q], er alt i A[q : r] større enn v siden A er sortert, så v kan bare ligge i A[p : q − 1]. Det er et kortere intervall, og induksjonshypotesen gir riktig svar. Tilfellet v > A[q] er symmetrisk.

**Bisect′ (iterativ):** Samme argument som en løkkeinvariant.

> **Invariant:** Ved starten av hver iterasjon gjelder: hvis v finnes i den opprinnelige A[p : r], så finnes v i den nåværende A[p : r].

Invarianten holder før første iterasjon. Linje 6 og 7 kaster bare bort deler av intervallet der v ikke kan være, så den holder videre. Løkken terminerer fordi intervallet blir minst ett element kortere hver gang. Stopper den med p > r, er intervallet tomt, så invarianten sier at v ikke fantes, og nil er riktig.

### Styrker og svakheter (Z5)

- **Styrker:** Θ(lg n) mot Θ(n) for lineært søk. Enkel, og trenger ingen ekstra plass (Bisect′).
- **Svakheter:** Krever en sortert tabell. Det koster Ω(n lg n) å sortere først, så det lønner seg bare når man søker mange ganger. Innsetting i en sortert tabell koster Θ(n), så for data som endres er et balansert binært søketre bedre.
- **Bisect mot Bisect′:** Samme asymptotiske kjøretid, men Bisect′ slipper kostnaden ved funksjonskall og bruker konstant ekstra minne.

### Kjøretid (Z6)

Vi teller sammenligninger med midtelementer. Anta n = 2ᵏ og at v er A[n], slik at søket alltid går til høyre og halverer intervallet nøyaktig. Da er T(1) = 1 og T(n) = T(n/2) + 1. Med iterasjonsmetoden (appendiks C):

$$
\begin{aligned} T(n) &= T(n/2) + 1 = T(n/4) + 2 = T(n/8) + 3 \\ &= T(n/2^i) + i \\ &= T(n/n) + \lg n = \lg n + 1 \qquad (i = \lg n) \end{aligned}
$$

Masterteoremet gir det samme: a = 1, b = 2, n^(log₂ 1) = n⁰ = 1, og f(n) = Θ(1) gir tilfelle 2, altså Θ(lg n).

- **Verste tilfelle:** Θ(lg n), for eksempel når v ikke finnes.
- **Beste tilfelle:** Θ(1), når v er det første midtelementet.

### Sjekk deg selv

1. Hvorfor er binærsøk ikke effektivt på en lenket liste?
2. Hva er det største antallet sammenligninger med midtelementer for n = 15?
3. Formuler løkkeinvarianten for Bisect′.
4. Hva returnerer Bisect hvis v finnes flere ganger i A?

??? success "Fasit"

    1. Det tar Θ(n) å komme til midtelementet i en lenket liste, så vi mister hele gevinsten.
    2. 4, siden ⌊lg 15⌋ + 1 = 4. Figuren viser at det mislykkede søket etter 8 bruker 4.
    3. Hvis v finnes i den opprinnelige A[p : r], finnes den i den nåværende A[p : r].
    4. En indeks til en av forekomstene, avhengig av hvilken som treffes som midtelement først.

## Randomized-Select og Select (F4)

Randomized-Select finner det i-te minste elementet ved å partisjonere som i Quicksort, men fortsetter bare på den siden der svaret ligger. Det gir forventet kjøretid Θ(n), mot Θ(n lg n) om vi sorterte først. Select bruker en nøye valgt pivot (medianen av medianer) og får Θ(n) også i verste tilfelle.

**Læringsmål fra F4**

- [D6] Forstå Randomized-Select
- [D7] Kjenne til Select, inkludert at den kan brukes til å finne de k minste elementene i O(n). Grundig forståelse av virkemåten kreves ikke.

### Problemet (Z1)

Utvalgsproblemet (the selection problem):

- **Input:** En mengde A med n (forskjellige) tall og et heltall i med 1 ≤ i ≤ n.
- **Output:** Elementet x i A som er større enn nøyaktig i − 1 andre elementer i A, altså den i-te ordensstatistikken.

Spesialtilfeller er minimum (i = 1), maksimum (i = n) og medianen. For n elementer er den nedre medianen i = ⌊(n + 1)/2⌋.

### Krav og forutsetninger (Z2)

- Elementene må kunne sammenlignes. Boka antar forskjellige verdier for enkelhets skyld, men algoritmene virker også med like verdier.
- 1 ≤ i ≤ r − p + 1 for kallet på A[p : r].
- Randomized-Select trenger en tilfeldighetsgenerator, som Randomized-Quicksort.

### Pseudokode

```text
RANDOMIZED-SELECT(A, p, r, i)
1  if p == r
2      return A[p]               // da må i = 1
3  q = RANDOMIZED-PARTITION(A, p, r)
4  k = q − p + 1                 // pivoten er det k-te minste i A[p : r]
5  if i == k
6      return A[q]               // pivoten er svaret
7  elseif i < k
8      return RANDOMIZED-SELECT(A, p, q − 1, i)
9  else return RANDOMIZED-SELECT(A, q + 1, r, i − k)
```

Randomized-Partition er den samme som i Randomized-Quicksort.

### Trinn for trinn (Z3)

Etter Partition vet vi nøyaktig hvor mange elementer som er mindre enn pivoten, nemlig k − 1. Det avgjør hvilken side svaret er på. Går vi til høyre side, har vi kastet bort k elementer som alle er mindre enn svaret, så vi leter etter det (i − k)-te minste der.

<div class="algwidget" data-widget="randomized-select"></div>
<p class="algwidget-caption">Randomized-Select finner det 5. minste av ti elementer · interaktiv</p>
Legg merke til at hvert kall bare jobber på én av sidene. Quicksort må sortere begge, og det er hele forskjellen på Θ(n lg n) og Θ(n).

### Korrekthet (Z4)

Sterk induksjon på n = r − p + 1.

- **Basis:** n = 1. Da må i = 1, og det eneste elementet er svaret.
- **Induksjonstrinn:** Etter Partition står pivoten på plass q, med de k − 1 elementene som er mindre, i A[p : q − 1] og de større i A[q + 1 : r]. Pivoten er altså det k-te minste. Er i = k, er pivoten svaret. Er i < k, er svaret blant de k − 1 minste og er det i-te minste i A[p : q − 1]. Er i > k, er svaret i A[q + 1 : r], og der er det det (i − k)-te minste, siden k mindre elementer er fjernet. Begge deltabellene er mindre enn n, så induksjonshypotesen gir riktig svar.

### Styrker og svakheter (Z5)

|  | Randomized-Select | Select | Sortere først |
| --- | --- | --- | --- |
| Forventet tid | Θ(n) | Θ(n) | Θ(n lg n) |
| Verste tilfelle | Θ(n²) | Θ(n) | Θ(n lg n) |
| Praktisk | Enkel, små konstanter | Store konstanter | Gir alle ordensstatistikker på én gang |

Randomized-Select er det praktiske valget for én ordensstatistikk. Select er mest interessant teoretisk, fordi den viser at utvalg kan gjøres i lineær tid i verste tilfelle.

### Kjøretid (Z6)

**Verste tilfelle: Θ(n²).** Hvis pivoten hver gang er det største (eller minste) gjenværende elementet, blir intervallet bare én kortere for hver Partition, og T(n) = T(n − 1) + Θ(n) = Θ(n²).

**Forventet tid: Θ(n).** Kall en Partition *nyttig* hvis den gjør det gjenværende intervallet til høyst 3/4 av størrelsen. Det skjer hvis pivoten er blant den midterste halvdelen av elementene, altså med sannsynlighet minst 1/2. Forventet antall Partition-kall mellom to nyttige er derfor høyst 2. Etter k nyttige kall er størrelsen høyst (3/4)ᵏ n, og hvert Partition-kall på størrelse m koster O(m). Forventet totalt arbeid blir

$$
E[T(n)] \le \sum_{k=0}^{\infty} 2c\left(\tfrac{3}{4}\right)^{k} n = 8cn = O(n)
$$

Sammen med den opplagte nedre grensen Ω(n) (alle elementene må ses på) blir forventet tid Θ(n). Den geometriske rekken fra appendiks A er nøkkelen: arbeidet domineres av første kall.

### Select (D7, bare kjenne til)

Select unngår dårlige pivoter ved å velge pivoten med omhu:

1. Del de n elementene i grupper på 5.
2. Finn medianen i hver gruppe (for eksempel med Insertion-Sort, konstant tid per gruppe).
3. Finn rekursivt medianen x av de ⌈n/5⌉ gruppemedianene.
4. Partisjoner rundt x, og fortsett rekursivt på én side som i Randomized-Select.

Minst omtrent 3n/10 av elementene er garantert mindre enn x, og like mange større. Det rekursive kallet i trinn 4 får derfor høyst omtrent 7n/10 elementer, og

$$
T(n) \le T(n/5) + T(7n/10) + O(n) = O(n)
$$

fordi 1/5 + 7/10 = 9/10 < 1, så arbeidet per nivå i rekursjonstreet avtar geometrisk.

**De k minste elementene i O(n):** Bruk Select til å finne det k-te minste elementet x, og partisjoner rundt x. Da står de k minste elementene i A[1 : k], usortert. Trenger man dem sortert, sorterer man etterpå for O(k lg k) i tillegg.

### Sjekk deg selv

1. Når får Randomized-Select kjøretid Θ(n²)?
2. Hvorfor har Randomized-Select forventet lineær tid, mens Randomized-Quicksort har Θ(n lg n)?
3. Hvordan finner du de 10 minste av n elementer i O(n)?
4. Hva blir i hvis du vil finne den nedre medianen av 10 elementer?

??? success "Fasit"

    1. Når pivoten hver gang er størst eller minst i intervallet, så det bare krymper med ett element.
    2. Randomized-Select fortsetter bare på én side, så arbeidet blir en avtagende geometrisk rekke. Quicksort må behandle begge sidene, og hvert nivå i rekursjonstreet koster Θ(n).
    3. Finn det 10. minste med Select og partisjoner rundt det. De 10 minste står da først.
    4. i = ⌊(10 + 1)/2⌋ = 5, som i figuren.

