# 5. Dynamisk programmering


Dynamisk programmering (DP) løser et problem ved å dekomponere det i delinstanser, som splitt og hersk, men der delinstansene overlapper. I stedet for å løse samme delinstans mange ganger løser vi hver én gang og lagrer svaret. Det gjør ofte en eksponentiell rekursjon om til en polynomisk algoritme.

**Læringsmål fra F6 som gjelder hele kategorien**

- [F1] Forstå ideen om en delinstansgraf
- [F2] Forstå designmetoden dynamisk programmering
- [F3] Forstå løsning ved memoisering (top-down)
- [F4] Forstå løsning ved iterasjon (bottom-up)
- [F5] Forstå hvordan man rekonstruerer en løsning fra lagrede beslutninger
- [F6] Forstå hva optimal delstruktur er
- [F7] Forstå hva overlappende delinstanser er

## Grunnbegrepene (F1–F7)

**Designmetoden (F2).** Boka beskriver fire trinn:

1. Beskriv strukturen til en optimal løsning: hvilket valg gjør vi først, og hvilke delinstanser står vi igjen med?
2. Definer verdien til en optimal løsning rekursivt, som en rekurrens.
3. Regn ut verdien, som regel bottom-up eller med memoisering.
4. Konstruer en optimal løsning fra informasjonen som ble lagret underveis.

**Optimal delstruktur (F6).** Et problem har optimal delstruktur hvis en optimal løsning inneholder optimale løsninger på delinstansene. Det vises typisk med et *klipp og lim*-argument: hvis delløsningen ikke var optimal, kunne vi klippet den ut og limt inn en bedre, og fått en bedre løsning på hele problemet. Det er en selvmotsigelse.

**Overlappende delinstanser (F7).** Delinstansene overlapper hvis flere delinstanser (direkte eller indirekte) bygger på den samme delinstansen. Skjer det på flere nivåer, vil en naiv rekursiv løsning løse den samme delinstansen om og om igjen og få eksponentiell kjøretid. I splitt og hersk er delinstansene derimot disjunkte (som de to halvdelene i Merge-Sort), så der er det ingenting å spare på lagring. Ukens snubletråd understreker dette: forstår du overlappende delinstanser ordentlig, forstår du hvorfor DP virker.

**Delinstansgrafen (F1).** Delinstansgrafen har én node per distinkt delinstans og en kant fra x til y hvis løsningen på x bruker løsningen på y direkte. For splitt og hersk er den et tre. For DP er den en rettet asyklisk graf (DAG), fordi flere noder deler barn. Grafen forklarer to ting:

- **Rekkefølge:** en delinstans kan bare løses etter alle den peker på. Bottom-up løser delinstansene i omvendt topologisk rekkefølge, og memoisering gjør implisitt det samme via rekursjonen. (Dette er koblingen til Topological-Sort i F8.)
- **Kjøretid:** som regel proporsjonal med antall noder pluss antall kanter, siden hver delinstans løses én gang og arbeidet er proporsjonalt med antall valg (utgrad).

**Memoisering (F3) mot bottom-up (F4).**

|  | Memoisering (top-down) | Bottom-up (iterasjon) |
| --- | --- | --- |
| Idé | Skriv rekursjonen naturlig, men slå opp i en tabell før du regner, og lagre svaret etterpå | Fyll tabellen i en rekkefølge der alt en delinstans trenger, allerede er regnet ut |
| Løser | Bare delinstansene som faktisk trengs | Alle delinstansene |
| Overhead | Funksjonskall og rekursjonsstakk | Løkker, ofte bedre konstanter |
| Rekkefølge | Fås automatisk av rekursjonen | Må velges eksplisitt |

Begge har samme asymptotiske kjøretid i de fleste tilfeller.

**Rekonstruksjon (F5).** Tabellen med verdier sier bare hvor god den beste løsningen er. For å finne selve løsningen lagrer vi i tillegg hvilket valg som ga optimum i hver delinstans (s[j] i stavkapping, pilene b[i, j] i LCS). Etterpå følger vi valgene fra hele instansen og ned, i O(lengden av løsningen).

## Stavkapping (F6)

Stavkapping er bokas første DP-eksempel: kutt en stang i biter for å maksimere salgsinntekten. Den naive rekursjonen tar Θ(2ⁿ), mens memoisering og bottom-up tar Θ(n²).

**Læringsmål:** [F8] Forstå eksemplene stavkapping og LCS.

### Problemet (Z1)

- **Input:** En lengde n og en pristabell p[1 : n], der p[i] er prisen for en bit med lengde i.
- **Output:** Den maksimale inntekten rₙ man kan få ved å kutte stangen i heltallige biter (eller la være å kutte), og gjerne kuttene som gir den.

### Krav og forutsetninger (Z2)

- Kutting er gratis, og bitlengdene er heltall.
- Inputstørrelsen er n (pristabellen har n tall), så Θ(n²) er her en ekte polynomisk kjøretid. Sammenlign med ryggsekkproblemet nedenfor.

### Rekurrensen og optimal delstruktur

Se på lengden i av den første biten (den lengst til venstre). Den gir p[i], og resten av stangen, med lengde n − i, må kuttes optimalt. Var resten ikke optimalt kuttet, kunne vi byttet det ut med en bedre kutting og fått mer totalt (klipp og lim). Vi prøver alle mulige første biter:

$$
r_0 = 0, \qquad r_n = \max_{1 \le i \le n} \left( p_i + r_{n-i} \right)
$$

### Pseudokode

```text
CUT-ROD(p, n)                          // naiv rekursjon
1  if n == 0
2      return 0
3  q = −∞
4  for i = 1 to n
5      q = max{q, p[i] + CUT-ROD(p, n − i)}
6  return q

MEMOIZED-CUT-ROD(p, n)
1  la r[0 : n] være en ny tabell        // her huskes svarene
2  for i = 0 to n
3      r[i] = −∞
4  return MEMOIZED-CUT-ROD-AUX(p, n, r)

MEMOIZED-CUT-ROD-AUX(p, n, r)
1  if r[n] ≥ 0                         // allerede løst?
2      return r[n]
3  if n == 0
4      q = 0
5  else q = −∞
6      for i = 1 to n                  // i er lengden på første bit
7          q = max{q, p[i] + MEMOIZED-CUT-ROD-AUX(p, n − i, r)}
8  r[n] = q                            // husk svaret
9  return q

BOTTOM-UP-CUT-ROD(p, n)
1  la r[0 : n] være en ny tabell
2  r[0] = 0
3  for j = 1 to n                      // stigende lengde
4      q = −∞
5      for i = 1 to j                  // lengden på første bit
6          q = max{q, p[i] + r[j − i]}
7      r[j] = q
8  return r[n]

EXTENDED-BOTTOM-UP-CUT-ROD(p, n)
1   la r[0 : n] og s[1 : n] være nye tabeller
2   r[0] = 0
3   for j = 1 to n
4       q = −∞
5       for i = 1 to j
6           if q < p[i] + r[j − i]
7               q = p[i] + r[j − i]
8               s[j] = i              // beste første bit så langt
9       r[j] = q
10  return r og s

PRINT-CUT-ROD-SOLUTION(p, n)
1  (r, s) = EXTENDED-BOTTOM-UP-CUT-ROD(p, n)
2  while n > 0
3      skriv ut s[n]                   // lengden på første bit
4      n = n − s[n]                    // lengden på resten
```

### Trinn for trinn (Z3)

For hver lengde j prøver bottom-up alle lengder i på første bit og slår opp den allerede beregnede verdien r[j − i] for resten. Buene i figuren er kantene i delinstansgrafen fra j: r[j] avhenger av alle r[0], …, r[j − 1].

<div class="algwidget" data-widget="rod-cutting"></div>
<p class="algwidget-caption">Stavkapping bottom-up for n = 8 · interaktiv</p>
### Korrekthet (Z4)

Bottom-up-versjonen har denne invarianten for den ytre løkken:

> **Invariant:** Ved starten av iterasjonen for j inneholder r[0 : j − 1] de optimale inntektene for lengdene 0, …, j − 1.

Initialiseringen er r[0] = 0. I iterasjon j er alle r[j − i] med 1 ≤ i ≤ j allerede riktige, så den indre løkken regner ut nettopp rekurrensen, og r[j] blir riktig. Rekurrensen selv er riktig på grunn av den optimale delstrukturen: vi prøver alle mulige første biter, og for hver av dem er det optimalt å kutte resten optimalt. Memoisering regner ut den samme rekurrensen og er korrekt av samme grunn.

### Styrker og svakheter (Z5)

- Naiv rekursjon er enkel, men eksponentiell fordi delinstansene overlapper: Cut-Rod(p, n − 2) kalles både fra n og fra n − 1, og så videre nedover.
- Memoisering beholder den rekursive strukturen og løser bare det som trengs, men har kall-overhead.
- Bottom-up har små konstanter og ingen rekursjon, men må kjenne riktig rekkefølge.
- En grådig strategi (alltid ta biten med høyest pris per lengde) gir ikke alltid optimum, så DP trengs her.

### Kjøretid (Z6)

**Naiv rekursjon: Θ(2ⁿ).** La T(n) være antall kall. Da er T(0) = 1 og

$$
T(n) = 1 + \sum_{j=0}^{n-1} T(j) = 2^n
$$

(vis med induksjon: 1 + (2⁰ + 2¹ + ⋯ + 2ⁿ⁻¹) = 1 + 2ⁿ − 1 = 2ⁿ). Rekursjonstreet har 2ⁿ⁻¹ løvnoder, én for hver måte å kutte på.

**Memoisering og bottom-up: Θ(n²).** Bottom-up har to nøstede løkker der den indre kjører j ganger, totalt 1 + 2 + ⋯ + n = n(n + 1)/2 iterasjoner. Med delinstansgrafen: det er n + 1 noder, og noden j har j utkanter, så det er Θ(n²) kanter. Memoisering løser hver delinstans én gang og gjør det samme arbeidet. Rekonstruksjonen tar O(n).

### Sjekk deg selv

1. Hvorfor tar naiv Cut-Rod eksponentiell tid?
2. Hva lagres i s, og hvordan brukes det til å finne kuttene?
3. I hvilken rekkefølge må bottom-up løse delinstansene, og hvorfor?
4. Hvor mange noder og kanter har delinstansgrafen for stavkapping med lengde n?

??? success "Fasit"

    1. Delinstansene overlapper: samme lengde løses på nytt fra mange kall, og antall kall blir 2ⁿ.
    2. s[j] er lengden på den første biten i en optimal løsning for lengde j. Skriv ut s[n], sett n = n − s[n], og gjenta til n = 0.
    3. Stigende lengde j, fordi r[j] avhenger av alle kortere lengder.
    4. n + 1 noder (lengdene 0, …, n) og n(n + 1)/2 kanter.

## Lengste felles delsekvens, LCS (F6)

LCS finner den lengste sekvensen som forekommer, ikke nødvendigvis sammenhengende, i begge av to sekvenser. Det finnes 2ᵐ delsekvenser av X, så rå kraft er eksponentiell, men DP løser problemet i Θ(mn) med en tabell over alle par av prefikser.

**Læringsmål:** [F8] Forstå eksemplene stavkapping og LCS.

### Problemet (Z1)

Z = ⟨z₁, …, zₖ⟩ er en **delsekvens** av X = ⟨x₁, …, xₘ⟩ hvis det finnes strengt økende indekser i₁ < i₂ < ⋯ < iₖ slik at x(iⱼ) = zⱼ for alle j. Rekkefølgen beholdes, men elementer kan hoppes over.

- **Input:** To sekvenser X = ⟨x₁, …, xₘ⟩ og Y = ⟨y₁, …, yₙ⟩.
- **Output:** En felles delsekvens av X og Y med størst mulig lengde.

Notasjon: Xᵢ = ⟨x₁, …, xᵢ⟩ er prefikset med de i første elementene, og X₀ er tom.

### Krav og forutsetninger (Z2)

- Elementene må kunne sammenlignes for likhet.
- Det kan finnes flere LCS-er med samme lengde; algoritmen finner én av dem.

### Optimal delstruktur og rekurrensen

**Teorem 14.1.** La Z = ⟨z₁, …, zₖ⟩ være en LCS av X og Y.

1. Hvis xₘ = yₙ, er zₖ = xₘ = yₙ, og Zₖ₋₁ er en LCS av Xₘ₋₁ og Yₙ₋₁.
2. Hvis xₘ ≠ yₙ og zₖ ≠ xₘ, er Z en LCS av Xₘ₋₁ og Y.
3. Hvis xₘ ≠ yₙ og zₖ ≠ yₙ, er Z en LCS av X og Yₙ₋₁.

Beviset er klipp og lim: fantes en lengre felles delsekvens av prefiksene, kunne vi bygget en lengre LCS av hele X og Y. Teoremet gir rekurrensen for c[i, j], lengden av en LCS av Xᵢ og Yⱼ:

$$
c[i, j] = \begin{cases} 0 & \text{hvis } i = 0 \text{ eller } j = 0 \\ c[i-1, j-1] + 1 & \text{hvis } i, j > 0 \text{ og } x_i = y_j \\ \max(c[i, j-1],\, c[i-1, j]) & \text{hvis } i, j > 0 \text{ og } x_i \ne y_j \end{cases}
$$

Delinstansene overlapper: både c[i − 1, j] og c[i, j − 1] trenger c[i − 1, j − 1]. Det finnes bare (m + 1)(n + 1) forskjellige delinstanser.

### Pseudokode

```text
LCS-LENGTH(X, Y, m, n)
1   la b[1 : m, 1 : n] og c[0 : m, 0 : n] være nye tabeller
2   for i = 1 to m
3       c[i, 0] = 0
4   for j = 0 to n
5       c[0, j] = 0
6   for i = 1 to m                   // rad for rad
7       for j = 1 to n
8           if xᵢ == yⱼ
9               c[i, j] = c[i − 1, j − 1] + 1
10              b[i, j] = "↖"
11          elseif c[i − 1, j] ≥ c[i, j − 1]
12              c[i, j] = c[i − 1, j]
13              b[i, j] = "↑"
14          else c[i, j] = c[i, j − 1]
15              b[i, j] = "←"
16  return c og b

PRINT-LCS(b, X, i, j)
1  if i == 0 or j == 0
2      return                        // LCS-en har lengde 0
3  if b[i, j] == "↖"
4      PRINT-LCS(b, X, i − 1, j − 1)
5      skriv ut xᵢ                   // samme som yⱼ
6  elseif b[i, j] == "↑"
7      PRINT-LCS(b, X, i − 1, j)
8  else PRINT-LCS(b, X, i, j − 1)
```

Print-LCS kalles med Print-LCS(b, X, m, n).

### Trinn for trinn (Z3)

Hver celle c[i, j] trenger cellen diagonalt opp til venstre, cellen over og cellen til venstre. Rad for rad er en rekkefølge der alle tre alltid er ferdige. Etterpå følger Print-LCS pilene fra nederste høyre hjørne; hver ↖-pil gir en bokstav i LCS-en.

<div class="algwidget" data-widget="lcs"></div>
<p class="algwidget-caption">LCS av ABCBDAB og BDCABA · interaktiv</p>
I figuren markerer den fargede cellen ved siden av den nåværende hvilken celle verdien ble hentet fra. Knappen «Hele raden» hopper til slutten av raden. LCS-en blir BCBA. BDAB er en annen LCS med samme lengde, men pilreglene (↑ ved likhet) velger BCBA.

### Korrekthet (Z4)

Rekurrensen er riktig etter Teorem 14.1: er xᵢ = yⱼ, finnes en LCS som slutter med dette tegnet (tilfelle 1). Ellers mangler en LCS enten xᵢ eller yⱼ som siste tegn, og vi tar den beste av de to mulighetene (tilfelle 2 og 3). LCS-Length regner ut rekurrensen i en rekkefølge der hver celle bare leser ferdige celler, så hver c[i, j] blir riktig (induksjon i rad-for-rad-rekkefølgen). Pilen b[i, j] lagrer hvilket tilfelle som ga verdien, så Print-LCS rekonstruerer en delsekvens med nøyaktig c[m, n] tegn som også er felles for X og Y.

### Styrker og svakheter (Z5)

- **Styrker:** Θ(mn) i stedet for Θ(n · 2ᵐ) for rå kraft. Enkel tabellfylling.
- **Svakheter:** Bruker Θ(mn) minne. Trenger man bare lengden, holder det med to rader (eller én rad pluss litt), altså O(min(m, n)) minne, men da kan man ikke rekonstruere med pilene.
- Tabellen b kan sløyfes: Print-LCS kan finne ut hvilket av de tre tilfellene som gjaldt ved å se på c og xᵢ, yⱼ direkte, i O(1) per celle.

### Kjøretid (Z6)

- **LCS-Length:** Θ(mn). Det er mn celler, og hver fylles i konstant tid. Delinstansgrafen har (m + 1)(n + 1) noder og høyst tre utkanter per node.
- **Print-LCS:** O(m + n). Hvert kall minker i, j eller begge med 1.
- Uavhengig av input: alle cellene fylles alltid.

### Sjekk deg selv

1. Hva betyr c[i, j] med ord?
2. Hvorfor fungerer det å fylle tabellen rad for rad?
3. Er LCS-en entydig? Gi et eksempel fra figuren.
4. Hvor lang tid tar Print-LCS, og hvorfor?

??? success "Fasit"

    1. Lengden av en lengste felles delsekvens av prefiksene Xᵢ og Yⱼ.
    2. c[i, j] trenger bare c[i − 1, j − 1], c[i − 1, j] og c[i, j − 1], som alle ligger i en tidligere rad eller lenger til venstre i samme rad.
    3. Nei. BCBA og BDAB er begge LCS-er av lengde 4.
    4. O(m + n), fordi hvert rekursive kall minker i eller j (eller begge) med 1.

## Binær ryggsekk: Knapsack og Knapsack′ (F6)

I det binære ryggsekkproblemet (0-1 knapsack) må hver gjenstand enten tas med helt eller ligge igjen. DP-løsningen spør for hver gjenstand «skal den være med?» og får kjøretid Θ(nW). Det ser polynomisk ut, men er det ikke: kjøretiden er pseudopolynomisk, og problemet er NP-hardt.

**Læringsmål:** [F9] Forstå løsningen på det binære ryggsekkproblemet (appendiks E i pensumheftet). Se også [M2] i F13: forstå hvorfor løsningen ikke er polynomisk.

### Problemet (Z1)

- **Input:** To sekvenser med n positive heltall, verdier ⟨v₁, …, vₙ⟩ og vekter ⟨w₁, …, wₙ⟩, og et positivt heltall W, kapasiteten.
- **Output:** En mengde gjenstander der totalverdien (summen av vᵢ) er størst mulig, mens totalvekten (summen av wᵢ) er høyst W.

Algoritmene nedenfor finner bare totalverdien. Hvilke gjenstander som er med, finner man ved å lagre eller rekonstruere valgene.

### Krav og forutsetninger (Z2)

- Vektene og kapasiteten må være heltall, fordi de brukes som indekser i tabellen.
- I den kontinuerlige varianten (F7) kan man ta med deler av en gjenstand. Den løses grådig. Den binære løses ikke grådig.

### Dekomponering og rekurrens

Som i Floyd-Warshall bygger dekomponeringen på et ja-nei-spørsmål: skal vi ta med gjenstand i? La K[i, j] være beste verdi med gjenstand 1, …, i tilgjengelig og kapasitet j.

- **Nei:** løs problemet for gjenstand 1, …, i − 1 med hele kapasiteten j. Verdien er x = K[i − 1, j].
- **Ja (hvis wᵢ ≤ j):** løs problemet for gjenstand 1, …, i − 1 med kapasitet j − wᵢ, og legg til vᵢ. Verdien er y = K[i − 1, j − wᵢ] + vᵢ.

$$
K[i, j] = \begin{cases} 0 & \text{hvis } i = 0 \\ K[i-1, j] & \text{hvis } w_i > j \\ \max\bigl(K[i-1, j],\; K[i-1, j - w_i] + v_i\bigr) & \text{ellers} \end{cases}
$$

**Optimal delstruktur:** Er gjenstand i med i en optimal løsning, må resten være en optimal løsning for gjenstand 1, …, i − 1 med kapasitet j − wᵢ; ellers kunne vi byttet resten ut med noe bedre. Er den ikke med, må løsningen være optimal for 1, …, i − 1 med kapasitet j.

### Pseudokode

```text
KNAPSACK(n, W)                    // rekursiv, eksponentiell
1  if n == 0
2      return 0
3  x = KNAPSACK(n − 1, W)
4  if wₙ > W
5      return x
6  else y = KNAPSACK(n − 1, W − wₙ) + vₙ
7      return max(x, y)

KNAPSACK′(n, W)                   // bottom-up
1   la K[0 : n, 0 : W] være en ny tabell
2   for j = 0 to W
3       K[0, j] = 0
4   for i = 1 to n
5       for j = 0 to W
6           x = K[i − 1, j]
7           if j < wᵢ
8               K[i, j] = x
9           else y = K[i − 1, j − wᵢ] + vᵢ
10              K[i, j] = max(x, y)
11  return K[n, W]
```

Tabellen K har samme rolle i Knapsack′ som det rekursive kallet har i Knapsack. Forskjellen er at for-løkkene går gjennom delinstansene eksplisitt i stedet for implisitt med rekursjon. Vekter og verdier antas å være globale variabler.

For å finne gjenstandene kan vi gå tilbake gjennom tabellen (denne prosedyren er ikke fra pensumheftet, men følger ideen fra F5):

```text
KNAPSACK-ITEMS(K, n, W)
1  j = W
2  for i = n downto 1
3      if K[i, j] ≠ K[i − 1, j]     // verdien endret seg med gjenstand i
4          skriv ut i
5          j = j − wᵢ
```

### Trinn for trinn (Z3)

Tabellen fylles rad for rad. Hver celle ser på to celler i raden over: rett over (x, uten gjenstanden) og wᵢ kolonner til venstre (y, med gjenstanden).

<div class="algwidget" data-widget="knapsack"></div>
<p class="algwidget-caption">Knapsack′ med fire gjenstander og W = 5 · interaktiv</p>
Gjenstandene er (w, v) = (2, 3), (3, 4), (4, 5) og (5, 6). Den beste løsningen er gjenstand 1 og 2, med vekt 5 og verdi 7. Legg merke til at gjenstand 4 alene også veier 5, men bare er verdt 6.

### Korrekthet (Z4)

Rekurrensen er riktig fordi den optimale løsningen enten bruker gjenstand i eller ikke, og i begge tilfeller er resten optimal (optimal delstruktur). Knapsack′ fyller tabellen rad for rad, og hver celle bruker bare celler fra raden over, som er ferdige. Med induksjon på i er da hver K[i, j] riktig. Knapsack-Items er riktig fordi K[i, j] ≠ K[i − 1, j] betyr at den optimale verdien ikke kan oppnås uten gjenstand i.

### Styrker og svakheter (Z5)

- **Mot rå kraft:** Det finnes 2ⁿ delmengder; Knapsack uten memoisering har eksponentiell kjøretid. DP gir Θ(nW).
- **Grådighet virker ikke:** Bokas eksempel med W = 50 og gjenstandene (10 kg, 60), (20 kg, 100), (30 kg, 120): å ta gjenstandene med høyest verdi per kilo først gir 60 + 100 = 160, mens optimum er 100 + 120 = 220.
- **Svakhet:** Kjøretiden og minnet vokser med W. Er W stor (for eksempel 10¹⁸), er tabellen umulig å fylle.

### Kjøretid (Z6, M2)

Både memoisert Knapsack og Knapsack′ har Θ(nW) delinstanser med konstant arbeid hver, altså Θ(nW) tid. Det er en polynomisk funksjon av n og W, men **ikke** av inputstørrelsen.

Når vi spør om noe har polynomisk kjøretid, måler vi kjøretiden som funksjon av antall bits i input. Tallet W tar bare Θ(lg W) bits å skrive ned. La m = antall bits i W. Da er W ≈ 2ᵐ, og

$$
T(n, m) = \Theta(n \cdot 2^m)
$$

som er eksponentielt i m. Kjøretider som er polynomiske når et tall fra input (her W) er med som parameter, kalles **pseudopolynomiske**. Det binære ryggsekkproblemet er NP-hardt, og ingen kjenner en polynomisk algoritme for det.

**Forbehold fra appendiks E:** RAM-modellen krever at tall vi regner med i konstant tid, har O(lg n) bits. Holder vi oss innenfor det, er W ≤ nᶜ og Θ(nW) = Θ(nᶜ⁺¹), som faktisk er polynomisk. Poenget er at vi også er interessert i større W, og der er algoritmen ikke lenger polynomisk.

Sammenlign med stavkapping: der er n både lengden og antall priser i input, så Θ(n²) er ekte polynomisk.

### Sjekk deg selv

1. Hvorfor er Θ(nW) ikke polynomisk kjøretid?
2. Hva betyr K[i, j] med ord?
3. Gi et eksempel der det grådige valget (høyest verdi per kilo først) gir feil svar for det binære problemet.
4. Hvordan finner du ut fra tabellen om gjenstand i er med i løsningen?

??? success "Fasit"

    1. Inputstørrelsen er proporsjonal med lg W, ikke W. Kjøretiden er derfor eksponentiell i antall bits som trengs for å skrive W.
    2. Den høyeste totalverdien man kan oppnå med gjenstand 1, …, i og kapasitet j.
    3. W = 50 og (10 kg, 60), (20 kg, 100), (30 kg, 120): grådig gir 160, optimum er 220.
    4. Er K[i, j] ≠ K[i − 1, j] (med j = gjenværende kapasitet), er gjenstand i med, og j reduseres med wᵢ.

