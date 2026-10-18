# Algoritmer og datastrukturer

Alle algoritmene i pensumheftet, forklart opp mot læringsmålene, med pseudokode, korrekthetsbevis, kjøretid og en interaktiv figur du kan bla gjennom steg for steg. Pensum er Cormen mfl., *Introduction to Algorithms* (4. utg.), pluss pensumheftets appendikser.

!!! abstract "Status"
    Hele pensum, forelesning 1–14, er gjennomgått i tolv kategorier med 31 interaktive figurer.

## Kategorier

| # | Kategori | Algoritmer | Forelesning |
|---|---|---|---|
| 1 | [Sortering ved sammenligning](1-sortering-sammenligning.md) | Insertion-Sort, Merge-Sort, Quicksort, Randomized-Quicksort | F1, F3 |
| 2 | [Sortering i lineær tid](2-sortering-lineaer-tid.md) | Counting-Sort, Radix-Sort, Bucket-Sort, nedre grense Ω(n lg n) | F4 |
| 3 | [Søk og utvalg](3-sok-og-utvalg.md) | Bisect og Bisect′, Randomized-Select, Select | F3, F4 |
| 4 | [Datastrukturer](4-datastrukturer.md) | Hauger, prioritetskøer, Heapsort, binære søketrær | F5 |
| 5 | [Dynamisk programmering](5-dynamisk-programmering.md) | Stavkapping, LCS, binær ryggsekk | F6 |
| 6 | [Grådige algoritmer](6-gradige-algoritmer.md) | Aktivitetsutvelgelse, kontinuerlig ryggsekk, Huffman | F7 |
| 7 | [Graftraversering](7-graftraversering.md) | BFS, DFS, Topological-Sort, sterke komponenter | F8 |
| 8 | [Minimale spenntrær](8-minimale-spenntraer.md) | Disjunkte mengder, Generic-MST, MST-Kruskal, MST-Prim | F9 |
| 9 | [Korteste vei fra én til alle](9-korteste-vei-en-til-alle.md) | Relax, Bellman-Ford, Dag-Shortest-Paths, Dijkstra | F10 |
| 10 | [Korteste vei fra alle til alle](10-korteste-vei-alle-til-alle.md) | Print-All-Pairs-Shortest-Path, Floyd-Warshall, Transitive-Closure | F11 |
| 11 | [Maksimal flyt](11-maksimal-flyt.md) | Ford-Fulkerson, Edmonds-Karp, minimalt snitt, bipartitt matching | F12 |
| 12 | [NP-kompletthet](12-np-kompletthet.md) | P, NP, reduksjoner, CIRCUIT-SAT og de NP-komplette problemene | F13–F14 |

## Slik er hver algoritme bygget opp

Hver algoritme gjennomgås opp mot pensumheftets generelle læringsmål Z1–Z6, i tillegg til de forelesningsspesifikke målene (A1, A2, …), som gjengis først.

| Mål | Hva du skal kunne | Seksjon i hver algoritme |
| --- | --- | --- |
| Z1 | Den formelle definisjonen av problemet algoritmen løser | Problemet |
| Z2 | Eventuelle tilleggskrav for at den skal være korrekt | Krav og forutsetninger |
| Z3 | Hvordan den oppfører seg, og utføre den trinn for trinn | Trinn for trinn |
| Z4 | Korrekthetsbeviset: hvordan og hvorfor den virker | Korrekthet |
| Z5 | Styrker og svakheter sammenlignet med andre | Styrker og svakheter |
| Z6 | Kjøretider under ulike omstendigheter, og utregningen | Kjøretid |

Etter hver algoritme kommer **Sjekk deg selv** med fire spørsmål. Fasiten ligger skjult under, og du åpner den ved å klikke.

!!! tip "Figurene"
    Hver algoritme har en interaktiv figur. Klikk **Neste** og **Tilbake** for å gå ett steg om gangen, og **Til start** for å begynne på nytt. Linjen som kjøres er markert i pseudokoden der den vises.

## Pensum

Se [Pensum og forelesninger](pensum.md) for hele listen over algoritmer per forelesning.

## Kilder

| Hva | Fil |
|---|---|
| Boka (Cormen mfl., 4. utg.) | [AlgDat.pdf](pdf/AlgDat.pdf) |
| Pensumheftet | [Pensumhefte.pdf](pdf/Pensumhefte.pdf) |
| Lysark F9 (kortversjon) | [forelesn09_kort.pdf](pdf/forelesn09_kort.pdf) |

!!! note "PDF-ene"
    Legg PDF-ene i mappen `docs/algdat/pdf/` med navnene over, så virker lenkene. Mappen holdes utenfor Git.
