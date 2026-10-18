const {C, Controls, Title, Para, wrap} = window.AlgLib;

// Reduksjonstreet fra bokas figur 34.13, pluss de to NP-harde problemene fra F14.
// Hver node: [id, navn, x, y, forelder, stiplet]
const NODES = [
  ['circ', 'CIRCUIT-SAT', 330, 150, null],
  ['sat', 'SAT', 330, 205, 'circ'],
  ['cnf', '3-CNF-SAT', 330, 260, 'sat'],
  ['clique', 'CLIQUE', 210, 315, 'cnf'],
  ['subset', 'SUBSET-SUM', 470, 315, 'cnf'],
  ['vc', 'VERTEX-COVER', 210, 370, 'clique'],
  ['knap', 'Binær ryggsekk', 470, 370, 'subset', true],
  ['ham', 'HAM-CYCLE', 210, 425, 'vc'],
  ['tsp', 'TSP', 110, 480, 'ham'],
  ['lsp', 'Lengste enkle vei', 320, 480, 'ham', true],
];

const INFO = {
  circ: {d: 'Gitt en boolsk krets med AND-, OR- og NOT-porter og én utgang: finnes det en input som gir utgangen 1?',
    np: 'Sertifikat: verdiene på inputene. Simuler kretsen i polynomisk tid.',
    red: 'NP-hard direkte (lemma 34.6): for et vilkårlig L i NP bygges en krets som simulerer verifikasjonsalgoritmen A(x, y) for fast x. Kretsen er tilfredsstillbar hvis og bare hvis det finnes et sertifikat y. Dette er «roten»: alle andre bevis reduserer fra den.'},
  sat: {d: 'Gitt en boolsk formel φ med variabler, ∧, ∨, ¬, → og ↔: finnes det en tilordning som gjør φ sann?',
    np: 'Sertifikat: en tilordning. Evaluer formelen i polynomisk tid.',
    red: 'CIRCUIT-SAT ≤p SAT: gi hver ledning i kretsen en variabel, og skriv hver port som en liten formel, f.eks. x₁₀ ↔ (x₇ ∧ x₈ ∧ x₉). φ er utgangsvariabelen AND-et med alle portformlene. Rett fram innsetting kunne gitt eksponentielt store formler, så det er derfor vi innfører variabler for ledningene.'},
  cnf: {d: 'Er en formel på 3-CNF-form (AND av klausuler, hver en OR av nøyaktig tre literaler) tilfredsstillbar?',
    np: 'Sertifikat: en tilordning, som for SAT.',
    red: 'SAT ≤p 3-CNF-SAT: bygg et binært parsetre for formelen og gi hver indre node en variabel (som for kretsen). Skriv hver liten delformel om til CNF med sannhetstabell og De Morgan, og fyll på med hjelpevariabler til nøyaktig tre literaler per klausul.'},
  clique: {d: 'Har grafen G en klikk (komplett delgraf) med k noder?',
    np: 'Sertifikat: de k nodene. Sjekk at alle par er naboer, O(k²).',
    red: '3-CNF-SAT ≤p CLIQUE: én node per literal i hver klausul. Kant mellom to literaler hvis de er i ulike klausuler og ikke er hverandres negasjon. φ med k klausuler er tilfredsstillbar hvis og bare hvis G har en klikk av størrelse k. Se figuren under.'},
  subset: {d: 'Gitt en mengde S av positive heltall og et mål t: finnes det en delmengde med sum nøyaktig t?',
    np: 'Sertifikat: delmengden. Summer og sammenlign.',
    red: '3-CNF-SAT ≤p SUBSET-SUM: lag tall med ett siffer per variabel og per klausul (i base 10). For hver variabel to tall (xᵢ og ¬xᵢ), for hver klausul to «slakk»-tall. Målet t har 1 i variabelsifrene (velg nøyaktig én av xᵢ og ¬xᵢ) og 4 i klausulsifrene (minst én sann literal pluss slakk).'},
  vc: {d: 'Har grafen G et nodedekke med k noder, altså k noder slik at hver kant har minst én ende i mengden?',
    np: 'Sertifikat: de k nodene. Sjekk hver kant.',
    red: 'CLIQUE ≤p VERTEX-COVER: bruk komplementgrafen Ḡ (kant der G ikke har kant). G har en klikk av størrelse k hvis og bare hvis Ḡ har et nodedekke av størrelse |V| − k: nodene utenfor klikken dekker alle kantene i Ḡ.'},
  knap: {d: 'Beslutningsversjonen av binær ryggsekk: finnes et utvalg med vekt ≤ W og verdi ≥ V?',
    np: 'I NP: sertifikatet er utvalget. Optimeringsversjonen er NP-hard.',
    red: 'SUBSET-SUM ≤p ryggsekk: la hvert tall være både vekt og verdi, og sett W = V = t. Et utvalg med vekt ≤ t og verdi ≥ t har sum nøyaktig t. Θ(nW)-algoritmen (appendiks E) er bare pseudopolynomisk, så den motbeviser ikke dette.'},
  ham: {d: 'Har grafen G en Hamilton-sykel, altså en enkel sykel som går gjennom alle nodene?',
    np: 'Sertifikat: rekkefølgen av nodene. Sjekk at de er distinkte og at nabopar er kanter.',
    red: 'VERTEX-COVER ≤p HAM-CYCLE: én «dings» (widget) med 12 noder per kant i G, og k velgernoder. Dingsen for (u, v) kan bare krysses på tre måter, som tilsvarer at u, v eller begge er i dekket. En Hamilton-sykel finnes hvis og bare hvis G har et nodedekke med k noder.'},
  tsp: {d: 'Gitt en komplett graf med heltallskostnader og et tall k: finnes det en rundtur innom alle byene med kostnad ≤ k?',
    np: 'Sertifikat: rundturen. Sjekk at den er en permutasjon og summer kostnadene.',
    red: 'HAM-CYCLE ≤p TSP: lag den komplette grafen med kostnad 0 på kantene som finnes i G og 1 på de andre, og k = 0. En tur med kostnad 0 bruker bare kanter fra G, altså er den en Hamilton-sykel.'},
  lsp: {d: 'Finnes det en enkel sti fra u til v med minst k kanter? (Optimering: finn lengste enkle vei.)',
    np: 'Sertifikat: stien. Optimeringsversjonen er NP-hard.',
    red: 'HAM-PATH (variant av HAM-CYCLE) ≤p lengste enkle vei: en enkel sti med |V| − 1 kanter går gjennom alle nodene. Kontrast: korteste vei kan finnes i polynomisk tid, fordi den har optimal delstruktur; lengste enkle vei har ikke det.'},
};

export default () => {
  const [s, setS] = React.useState(0);
  const N = NODES.length;
  const cur = NODES[s];
  const pos = new Map(NODES.map(n => [n[0], n]));
  const ancestors = new Set();
  for (let p = cur; p; p = p[4] ? pos.get(p[4]) : null) ancestors.add(p[0]);
  const info = INFO[cur[0]];
  const parent = cur[4] ? pos.get(cur[4])[1] : null;
  const t1 = `Problemet: ${info.d}`, t2 = `Hvorfor i NP: ${info.np}`, t3 = parent ? `Reduksjon fra ${parent}: ${info.red}` : `Hvorfor NP-hard: ${info.red}`;
  const y1 = 562, y2 = y1 + wrap(t1, 110).length * 18 + 8, y3 = y2 + wrap(t2, 110).length * 18 + 8;
  return <svg viewBox='0 0 760 720' role='img' aria-label='Reduksjonstreet for NP-komplette problemer' fontSize='13'>
    <Title title='NP-komplette problemer og reduksjonene mellom dem' subtitle='Bokas figur 34.13 pluss ryggsekk og lengste enkle vei. Klikk på et problem, eller bla med knappene.'/>
    <Controls s={s} N={N} setS={setS}/>
    {NODES.filter(n => n[4]).map(n => {
      const p = pos.get(n[4]), on = ancestors.has(n[0]) && ancestors.has(p[0]);
      return <g key={`e${n[0]}`}>
        <line x1={p[2]} y1={p[3] + 13} x2={n[2]} y2={n[3] - 15} stroke={on ? C.cmp : C.edge} strokeWidth={on ? 2.5 : 1.25} strokeDasharray={n[5] ? '5 4' : undefined}/>
        <path d={`M${n[2]},${n[3] - 13} l-5,-9 l10,0 Z`} fill={on ? C.cmp : C.edge}/>
      </g>;
    })}
    {NODES.map((n, i) => {
      const sel = i === s, w = n[1].length * 8 + 24;
      return <g key={n[0]} onClick={() => setS(i)} cursor='pointer'>
        <rect x={n[2] - w / 2} y={n[3] - 13} width={w} height='26' rx='6' fill={sel ? C.accent : 'var(--cds-chart-background)'} fillOpacity={sel ? 0.18 : 1}
          stroke={sel ? C.accent : (ancestors.has(n[0]) ? C.cmp : C.edge)} strokeWidth={sel ? 2.5 : 1.25} strokeDasharray={n[5] ? '5 3' : undefined}/>
        <text x={n[2]} y={n[3] + 5} textAnchor='middle' fontSize='12' fontWeight='600' fill={C.ink}>{n[1]}</text>
      </g>;
    })}
    <text x='560' y='160' fontSize='12' fill={C.quiet}>Pil fra A til B: A ≤p B,</text>
    <text x='560' y='178' fontSize='12' fill={C.quiet}>B vises NP-hard ved å</text>
    <text x='560' y='196' fontSize='12' fill={C.quiet}>redusere fra A til B.</text>
    <text x='560' y='224' fontSize='12' fill={C.quiet}>Stiplet: NP-hard (F14),</text>
    <text x='560' y='242' fontSize='12' fill={C.quiet}>ikke i bokas figur.</text>
    <line x1='24' y1='512' x2='736' y2='512' stroke={C.edge} strokeWidth='0.75'/>
    <text x='24' y='538' fontSize='14' fontWeight='600' fill={C.ink}>{cur[1]}</text>
    <Para x={24} y={y1} text={t1} max={110}/>
    <Para x={24} y={y2} text={t2} max={110} fill={C.quiet}/>
    <Para x={24} y={y3} text={t3} max={110}/>
  </svg>;
};
