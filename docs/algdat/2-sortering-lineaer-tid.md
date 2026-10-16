# 2. Sortering i lineær tid


Enhver sammenligningsbasert sortering bruker Ω(n lg n) sammenligninger i verste tilfelle. Algoritmene i denne kategorien kommer under grensen ved å anta mer om input: heltall i et lite intervall (Counting-Sort), tall med få sifre (Radix-Sort) eller jevnt fordelte verdier (Bucket-Sort). Dette er et eksempel på hovedideen i F4: sterkere krav til input kan gi bedre løsninger.

**Læringsmål fra F4 som gjelder hele kategorien**

- [D1] Forstå hvorfor sammenligningsbasert sortering har en worst-case på Ω(n lg n)
- [D2] Vite hva en stabil sorteringsalgoritme er

## Nedre grense for sammenligningsbasert sortering (D1)

En sammenligningsbasert algoritme får bare informasjon om input gjennom sammenligninger som aᵢ ≤ aⱼ. Den kan derfor modelleres som et **beslutningstre**: hver indre node er en sammenligning, hver gren er et utfall (ja eller nei), og hver løvnode er en permutasjon, altså en ferdig sortert rekkefølge. Å kjøre algoritmen på en input tilsvarer å følge én sti fra roten til en løvnode.

Argumentet har tre steg:

1. Hver av de n! mulige rekkefølgene av input trenger sin egen løvnode, ellers ville to forskjellige input få samme omordning, og minst en av dem ble feil sortert. Treet har altså minst n! løvnoder.
2. Et binært tre med høyde h har høyst 2ʰ løvnoder. Dermed er 2ʰ ≥ n!, altså h ≥ lg(n!).
3. Halvparten av faktorene i n! er minst n/2, så n! ≥ (n/2)^(n/2), og lg(n!) ≥ (n/2) lg(n/2) = Ω(n lg n).

Høyden h er antall sammenligninger på den lengste stien, altså i verste tilfelle. Derfor bruker enhver sammenligningsbasert sortering Ω(n lg n) sammenligninger i verste tilfelle, og Merge-Sort og Heapsort er asymptotisk optimale.

To poenger fra Ukens snubletråd: For det første er dette en nedre grense for verste tilfelle; i beste tilfelle kan en algoritme gjøre det bedre (Insertion-Sort bruker Θ(n) på sortert input). For det andre: for at grensen skal «smitte over» på et annet problem X, må vi redusere fra sortering til X med en reduksjon som tar o(n lg n) tid. Kunne X løses raskere, ville vi da fått en for rask sortering.

## Stabilitet (D2)

En sorteringsalgoritme er **stabil** hvis elementer med like nøkler står i samme innbyrdes rekkefølge i output som i input. Det betyr noe når elementene har satellittdata, for eksempel når man sorterer personer først etter navn og så etter alder. Det er også nødvendig for Radix-Sort.

| Algoritme | Stabil? |
| --- | --- |
| Insertion-Sort | Ja |
| Merge-Sort | Ja |
| Counting-Sort | Ja |
| Quicksort | Nei |
| Heapsort | Nei |

## Counting-Sort (F4)

Counting-Sort teller hvor mange elementer som har hver verdi, og bruker tellingene til å regne ut hvor hvert element skal stå i output. Den sammenligner aldri elementer og bruker Θ(n + k) tid, altså Θ(n) når k = O(n).

**Læringsmål:** [D3] Forstå Counting-Sort, og hvorfor den er stabil.

### Problemet (Z1)

- **Input:** En tabell A[1 : n] med heltall i intervallet 0, 1, …, k, og grensen k.
- **Output:** En tabell B[1 : n] med de samme elementene i sortert rekkefølge.

### Krav og forutsetninger (Z2)

- Nøklene må være heltall i [0, k] (eller kunne gjøres om til det), fordi de brukes direkte som indekser i C.
- For lineær tid må k = O(n).
- Algoritmen sorterer ikke på stedet: B og C bruker Θ(n + k) ekstra minne.

### Pseudokode

```text
COUNTING-SORT(A, n, k)
1   la B[1 : n] og C[0 : k] være nye tabeller
2   for i = 0 to k
3       C[i] = 0
4   for j = 1 to n
5       C[A[j]] = C[A[j]] + 1
6   // C[i] er nå antall elementer lik i.
7   for i = 1 to k
8       C[i] = C[i] + C[i − 1]
9   // C[i] er nå antall elementer mindre enn eller lik i.
10  // Kopier A til B, bakfra.
11  for j = n downto 1
12      B[C[A[j]]] = A[j]
13      C[A[j]] = C[A[j]] − 1     // for å håndtere like verdier
14  return B
```

### Trinn for trinn (Z3)

Algoritmen har tre faser: tell, akkumuler og plasser. Etter tellingen er C[i] antall elementer lik i. Etter prefikssummene er C[i] antall elementer ≤ i, som er nettopp den siste posisjonen et element med verdi i kan ha i sortert output. I plasseringsfasen settes hvert element på den posisjonen C peker på, og C reduseres slik at neste like element havner rett foran.

<div class="algwidget" data-widget="counting-sort"></div>
<p class="algwidget-caption">Counting-Sort på ⟨2, 5, 3, 0, 2, 3, 0, 3⟩ med k = 5 · interaktiv</p>
Eksempelet er bokas figur 8.2. Under hver celle i B står hvilken posisjon i A elementet kom fra. Følg for eksempel de tre tretallene: de kommer fra A[3], A[6] og A[8] og havner i den rekkefølgen i B.

### Korrekthet (Z4)

Etter løkken i linje 4–5 er C[i] antall elementer lik i, siden hvert element øker telleren for sin egen verdi nøyaktig én gang. Løkken i linje 7–8 regner ut prefikssummer: ved starten av iterasjon i er C[i − 1] antall elementer ≤ i − 1, så etter linje 8 er C[i] antall elementer ≤ i.

For løkken i linje 11–13 holder følgende invariant:

> **Invariant:** Ved starten av iterasjonen for j er C[v], for hver verdi v, lik antall elementer i A som er mindre enn v, pluss antall elementer lik v blant A[1 : j].

- **Initialisering:** Ved j = n er A[1 : j] hele A, så C[v] er antall elementer ≤ v, som linje 7–8 regnet ut.
- **Vedlikehold:** La v = A[j]. Elementet hører hjemme etter alle mindre elementer og etter de andre v-ene i A[1 : j − 1], altså på posisjon C[v]. Linje 12 setter det der, og linje 13 reduserer C[v] med 1 fordi A[j] ikke lenger er blant de uplasserte. Da holder invarianten for j − 1.
- **Terminering:** Etter j = 1 er alle n elementene plassert på hver sin riktige posisjon, så B er sortert.

**Hvorfor stabil (D3)?** Siste løkke går baklengs. Det siste av flere like elementer i A plasseres først og får den bakerste ledige plassen for sin verdi, det nest siste havner rett foran, og så videre. Dermed beholder like elementer rekkefølgen fra A. Gikk løkken forlengs med samme nedtelling, ville like elementer få omvendt rekkefølge.

### Styrker og svakheter (Z5)

- **Styrker:** Lineær tid når k = O(n), og stabil. Den er derfor godt egnet som subrutine i Radix-Sort.
- **Svakheter:** Fungerer bare for heltallsnøkler i et kjent, lite intervall. Bruker Θ(n + k) ekstra minne, og blir treg når k er stor i forhold til n (for eksempel k = n²).
- **Hvorfor ikke Ω(n lg n)?** Counting-Sort sammenligner aldri elementer. Den bruker verdiene som indekser, noe RAM-modellen tillater i konstant tid, så beslutningstre-argumentet gjelder ikke.

### Kjøretid (Z6)

| Linjer | Arbeid | Tid |
| --- | --- | --- |
| 2–3 | nullstill C | Θ(k) |
| 4–5 | tell | Θ(n) |
| 7–8 | prefikssummer | Θ(k) |
| 11–13 | plasser | Θ(n) |

Til sammen er kjøretiden Θ(n + k) i alle tilfeller, siden ingen av løkkene avhenger av rekkefølgen på elementene. Når k = O(n), er kjøretiden Θ(n).

### Sjekk deg selv

1. Hvorfor går den siste løkken baklengs?
2. Hva er kjøretiden hvis k = n²?
3. Hva inneholder C etter linje 8 for A = ⟨1, 0, 1⟩ med k = 1?
4. Hvorfor gjelder ikke Ω(n lg n)-grensen for Counting-Sort?

??? success "Fasit"

    1. For at sorteringen skal bli stabil: det bakerste av like elementer får den bakerste plassen.
    2. Θ(n + n²) = Θ(n²), som er dårligere enn Merge-Sort.
    3. C[0] = 1 og C[1] = 3: ett element er ≤ 0, og tre er ≤ 1.
    4. Grensen gjelder bare algoritmer som får informasjon gjennom sammenligninger. Counting-Sort bruker verdiene som indekser.

## Radix-Sort (F4)

Radix-Sort sorterer tall siffer for siffer, fra det minst signifikante (enerplassen) til det mest signifikante, med en stabil sortering i hvert pass. Med Counting-Sort som subrutine tar den Θ(d(n + k)) tid for n tall med d sifre i base k, altså lineær tid når d er konstant og k = O(n).

**Læringsmål:** [D4] Forstå Radix-Sort, og hvorfor den trenger en stabil subrutine.

### Problemet (Z1)

- **Input:** En tabell A[1 : n] der hvert element har d sifre, og hvert siffer er et heltall i [0, k − 1]. Siffer 1 er det minst signifikante, siffer d det mest signifikante.
- **Output:** A med de samme elementene i sortert rekkefølge.

Sifrene trenger ikke være desimale sifre. Det kan være felt i en sammensatt nøkkel, for eksempel dag, måned og år i en dato.

### Krav og forutsetninger (Z2)

- Subrutinen som sorterer på ett siffer, **må være stabil**. Ellers blir resultatet feil.
- Sifrene må behandles fra minst til mest signifikant.
- For lineær tid må d være konstant og k = O(n), med Counting-Sort som subrutine.

### Pseudokode

```text
RADIX-SORT(A, n, d)
1  for i = 1 to d
2      bruk en stabil sortering til å sortere A[1 : n] på siffer i
```

### Trinn for trinn (Z3)

Hvert pass sorterer hele tabellen på ett siffer og ignorerer de andre. Det virker bakvendt at det minst signifikante sifferet sorteres først, men stabiliteten gjør at rekkefølgen fra tidligere pass bevares som «uavgjort-regel» i senere pass.

<div class="algwidget" data-widget="radix-sort"></div>
<p class="algwidget-caption">Radix-Sort på sju tresifrede tall · interaktiv</p>
Eksempelet er bokas figur 8.3. Se for eksempel på pass 3: 436 og 457 har begge 4 på hundrerplassen, og de havner i samme rekkefølge som etter pass 2, der de allerede var sortert på de to siste sifrene.

### Korrekthet (Z4)

Vi viser med induksjon på i at:

> **Invariant:** Etter pass i er A sortert på de i minst signifikante sifrene, det vil si på tallene man får ved å se bare på siffer 1 til i.

- **Basis:** Etter pass 1 er A sortert på siffer 1, siden subrutinen sorterer korrekt.
- **Induksjonstrinn:** Anta at A er sortert på de i − 1 siste sifrene før pass i. Se på to elementer a og b. Har de forskjellig siffer i, er det sifferet som avgjør rekkefølgen på de i siste sifrene, og pass i setter dem riktig. Har de likt siffer i, avgjøres rekkefølgen av de i − 1 siste sifrene. Da var de allerede i riktig rekkefølge før passet (induksjonshypotesen), og en stabil sortering beholder den.
- **Terminering:** Etter pass d er A sortert på alle d sifrene, altså helt sortert.

**Hvorfor stabil (D4)?** Induksjonstrinnet bruker stabiliteten direkte i tilfellet med likt siffer. Se på 23 og 21: etter pass 1 står 21 før 23. I pass 2 har begge siffer 2. En ustabil sortering kan bytte dem og gi ⟨23, 21⟩, som er feil.

**Hvorfor fra minst signifikant?** Sorterte vi på det mest signifikante sifferet først, ville siste pass (på enerplassen) omorganisere hele tabellen etter enerplassen og ødelegge alt det tidligere passene gjorde.

### Styrker og svakheter (Z5)

- **Styrker:** Lineær tid for nøkler med fast lengde. Nyttig for sammensatte nøkler (datoer, strenger med fast lengde) og store heltall.
- **Svakheter:** Krever nøkler som kan deles i sifre. Med Counting-Sort som subrutine sorterer den ikke på stedet. Konstantene er større enn for Quicksort, så Quicksort kan være raskere i praksis selv om Radix-Sort er asymptotisk bedre.

### Kjøretid (Z6)

Hvert av de d passene er en Counting-Sort med verdier i [0, k − 1], som tar Θ(n + k). Totalt er kjøretiden Θ(d(n + k)), i alle tilfeller. Når d er konstant og k = O(n), er det Θ(n).

**Valg av sifferstørrelse (Lemma 8.4).** Har vi n tall på b bits, kan vi dele hvert tall i b/r sifre på r bits hver, så hvert siffer er i [0, 2ʳ − 1]. Kjøretiden blir Θ((b/r)(n + 2ʳ)). Velger vi r = lg n (når b ≥ lg n), blir den Θ(bn/lg n). For eksempel kan n heltall i [0, n³ − 1] sees som tresifrede tall i base n og sorteres i Θ(3(n + n)) = Θ(n).

### Sjekk deg selv

1. Hva går galt hvis subrutinen ikke er stabil? Gi et eksempel.
2. Hvor lang tid tar det å sortere n heltall i [0, n³ − 1]?
3. Hva skjer hvis vi sorterer på det mest signifikante sifferet først, med stabile pass?
4. Hva er invarianten etter pass i?

??? success "Fasit"

    1. Tall med likt siffer i passet kan bytte plass og ødelegge sorteringen fra tidligere pass, for eksempel 21 og 23 i pass 2.
    2. Θ(n): tallene har 3 sifre i base n, så d = 3 og k = n.
    3. Det siste passet sorterer på enerplassen og gir en tabell som bare er sortert på det sifferet.
    4. A er sortert på de i minst signifikante sifrene.

## Bucket-Sort (F4)

Bucket-Sort deler intervallet [0, 1) i n like store bøtter, legger hvert element i sin bøtte, sorterer hver bøtte med Insertion-Sort og setter bøttene sammen. Når input er jevnt fordelt, er den gjennomsnittlige kjøretiden Θ(n), men verste tilfelle er Θ(n²).

**Læringsmål:** [D5] Forstå Bucket-Sort.

### Problemet (Z1)

- **Input:** En tabell A[1 : n] med reelle tall i intervallet [0, 1).
- **Output:** De samme tallene i sortert rekkefølge.

### Krav og forutsetninger (Z2)

- Verdiene må ligge i [0, 1). Andre kjente intervaller kan skaleres dit.
- For korrekthet trengs ingen flere krav.
- For lineær gjennomsnittlig tid antar vi at verdiene er trukket uavhengig og jevnt fordelt fra [0, 1). Er de ikke det, kan mange havne i samme bøtte.

### Pseudokode

```text
BUCKET-SORT(A, n)
1  la B[0 : n − 1] være en ny tabell
2  for i = 0 to n − 1
3      la B[i] være en tom liste
4  for i = 1 to n
5      sett A[i] inn i listen B[⌊n · A[i]⌋]
6  for i = 0 to n − 1
7      sorter listen B[i] med Insertion-Sort
8  sett sammen listene B[0], B[1], …, B[n − 1] i rekkefølge
9  return de sammensatte listene
```

### Trinn for trinn (Z3)

Bøtte B[i] tar verdiene i [i/n, (i + 1)/n). Med n = 10 betyr det at bøtten bestemmes av første desimal: 0,78 havner i B[7].

<div class="algwidget" data-widget="bucket-sort"></div>
<p class="algwidget-caption">Bucket-Sort på ti verdier i [0, 1) · interaktiv</p>
Eksempelet er bokas figur 8.4. Legg merke til at de fleste bøttene har 0, 1 eller 2 elementer. Det er nettopp det som gjør Insertion-Sort billig her.

### Korrekthet (Z4)

Se på to elementer a ≤ b. Funksjonen x ↦ ⌊nx⌋ er ikke-synkende, så a havner i samme bøtte som b eller i en bøtte med lavere indeks.

- **Ulike bøtter:** Linje 8 setter bøttene sammen i stigende rekkefølge, så a kommer før b.
- **Samme bøtte:** Insertion-Sort i linje 7 setter a før b.

Alle par er altså i riktig rekkefølge, og output er sortert. Argumentet bruker ingen antagelse om fordelingen: Bucket-Sort er korrekt for all input i [0, 1). Fordelingen påvirker bare kjøretiden.

### Styrker og svakheter (Z5)

- **Styrker:** Lineær gjennomsnittlig tid for jevnt fordelt input. Den holder også for andre fordelinger, så lenge summen av kvadratene av bøttestørrelsene er lineær i n.
- **Svakheter:** Verste tilfelle er Θ(n²), når alle elementene havner i samme bøtte og Insertion-Sort må gjøre hele jobben. Trenger Θ(n) ekstra minne til listene. Bruker man Merge-Sort i bøttene, blir verste tilfelle O(n lg n).
- **Forskjell fra de andre i kategorien:** Counting-Sort og Radix-Sort har lineær tid i verste tilfelle under sine antagelser. Bucket-Sort har lineær tid bare i gjennomsnitt, fordi antagelsen er om sannsynlighetsfordelingen til input.

### Kjøretid (Z6)

Alle linjene unntatt linje 7 tar Θ(n). La nᵢ være antall elementer i bøtte i. Insertion-Sort på bøtte i tar O(nᵢ²), så

$$
T(n) = \Theta(n) + \sum_{i=0}^{n-1} O(n_i^2)
$$

**Gjennomsnittlig tilfelle: Θ(n).** Hvert element havner i bøtte i med sannsynlighet 1/n, uavhengig av de andre, så nᵢ er binomisk fordelt med E[nᵢ] = 1 og Var[nᵢ] = 1 − 1/n. Dermed er E[nᵢ²] = Var[nᵢ] + E[nᵢ]² = 2 − 1/n. Forventningens linearitet gir

$$
E[T(n)] = \Theta(n) + \sum_{i=0}^{n-1} O(2 - 1/n) = \Theta(n) + n \cdot O(1) = \Theta(n)
$$

**Verste tilfelle: Θ(n²).** Havner alle elementene i samme bøtte, er summen n².

**Beste tilfelle: Θ(n).** For eksempel når hvert element havner i sin egen bøtte.

Merk at dette er en *gjennomsnittlig* kjøretid over tilfeldig input, ikke en forventet kjøretid over tilfeldige valg i algoritmen, som for Randomized-Quicksort.

### Sjekk deg selv

1. Når inntreffer verste tilfelle, og hva er kjøretiden da?
2. Hvorfor avhenger ikke korrektheten av at input er jevnt fordelt?
3. Hva er E[nᵢ²], og hvorfor er det ikke bare E[nᵢ]² = 1?
4. Hvordan tilpasser du algoritmen til verdier i [0, 100)?

??? success "Fasit"

    1. Når alle elementene havner i samme bøtte. Da tar Insertion-Sort Θ(n²).
    2. Korrektheten bygger bare på at ⌊nx⌋ er ikke-synkende og at hver bøtte sorteres. Fordelingen påvirker kun hvor store bøttene blir.
    3. E[nᵢ²] = 2 − 1/n. Kvadratet av forventningen er ikke forventningen av kvadratet; differansen er variansen 1 − 1/n.
    4. Del verdiene på 100 først, eller bruk bøtte ⌊n · A[i] / 100⌋.

