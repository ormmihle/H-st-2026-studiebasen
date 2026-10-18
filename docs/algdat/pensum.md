# Pensum og forelesninger

Alle algoritmene i pensumheftet er standardstoff fra Cormen mfl. (4. utg.) pluss heftets appendikser. For hver av dem gjelder Z1–Z6: problemdefinisjon, krav, kunne utføre den trinn for trinn, korrekthetsbevis, styrker og svakheter, og kjøretider.

## Forelesning 1–8

| F | Tema | Algoritmer | Notater |
|---|---|---|---|
| 1 | Innledning | Insertion-Sort | [Kategori 1](1-sortering-sammenligning.md#insertion-sort-f1) |
| 3 | Splitt og hersk | Bisect og Bisect′ (app. D), Merge-Sort, Quicksort, Randomized-Quicksort. Rekurrensløsning: substitusjon, rekursjonstrær, masterteoremet og iterasjonsmetoden | [Kategori 1](1-sortering-sammenligning.md), [3](3-sok-og-utvalg.md) |
| 4 | Rangering i lineær tid | Counting-Sort, Radix-Sort, Bucket-Sort, Randomized-Select, Select (bare kjenne til). Nedre grense Ω(n lg n) for sammenligningsbasert sortering | [Kategori 2](2-sortering-lineaer-tid.md), [3](3-sok-og-utvalg.md) |
| 5 | Hauger og søketrær | Max-Heapify, Build-Max-Heap, Heapsort, Max-Heap-Insert, -Extract-Max, -Increase-Key, -Maximum og min-varianter. Inorder-Tree-Walk, Tree-Search (også iterativ), Tree-Minimum/Maximum, Tree-Successor/Predecessor, Tree-Insert, Transplant og Tree-Delete (de to siste ikke i detalj) | [Kategori 4](4-datastrukturer.md) |
| 6 | Dynamisk programmering | Cut-Rod (memoisert og bottom-up), LCS-Length og Print-LCS, Knapsack og Knapsack′ (binær ryggsekk, app. E) | [Kategori 5](5-dynamisk-programmering.md) |
| 7 | Grådighet | Recursive-/Greedy-Activity-Selector, kontinuerlig ryggsekk, Huffman | [Kategori 6](6-gradige-algoritmer.md) |
| 8 | Graftraversering | BFS og Print-Path, DFS og DFS-Visit (også med stakk), Topological-Sort, Strongly-Connected-Components, generell traversering med vilkårlig prioritetskø (app. F) | [Kategori 7](7-graftraversering.md) |

Stoffet fra forelesning 2a/2b (hashtabeller, lenkede lister, tabelldobling, reduksjonstyper) er støttelitteratur og blir ikke testet direkte.

## Forelesning 9–14

| F | Tema | Algoritmer og stoff | Notater |
|---|---|---|---|
| 9 | Minimale spenntrær | Disjunkte mengder: Make-Set, Union, Link, Find-Set, Connected-Components, Same-Component. Generic-MST, MST-Kruskal, MST-Prim | [Kategori 8](8-minimale-spenntraer.md) |
| 10 | Korteste vei fra én til alle | Relax og Initialize-Single-Source, Bellman-Ford, Dag-Shortest-Paths, Dijkstra | [Kategori 9](9-korteste-vei-en-til-alle.md) |
| 11 | Korteste vei fra alle til alle | Floyd-Warshall, Transitive-Closure, Print-All-Pairs-Shortest-Path | [Kategori 10](10-korteste-vei-alle-til-alle.md) |
| 12 | Maksimal flyt | Ford-Fulkerson-Method, Ford-Fulkerson, Edmonds-Karp. Bruke maks flyt til å finne minimalt snitt og maksimum bipartitt matching | [Kategori 11](11-maksimal-flyt.md) |
| 13–14 | NP-kompletthet | Problemer og reduksjoner: CIRCUIT-SAT, SAT, 3-CNF-SAT, CLIQUE, VERTEX-COVER, HAM-CYCLE, TSP, SUBSET-SUM, og hvorfor binær ryggsekk og lengste enkle vei er NP-harde | [Kategori 12](12-np-kompletthet.md) |

## Fremdrift

- [x] F1 Insertion-Sort
- [x] F3 Splitt og hersk
- [x] F4 Rangering i lineær tid
- [x] F5 Hauger og søketrær
- [x] F6 Dynamisk programmering
- [x] F7 Grådighet
- [x] F8 Graftraversering
- [x] F9 Minimale spenntrær
- [x] F10 Korteste vei fra én til alle
- [x] F11 Korteste vei fra alle til alle
- [x] F12 Maksimal flyt
- [x] F13–14 NP-kompletthet
