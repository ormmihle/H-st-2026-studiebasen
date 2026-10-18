const {C, Controls, Title, Explain, Node, Edge, Pseudo, fmt} = window.AlgLib;

// Grafen fra bokas figur 22.4
const V = ['s', 't', 'x', 'y', 'z'];
const P = new Map([['s', [70, 250]], ['t', [220, 160]], ['x', [420, 160]], ['y', [220, 340]], ['z', [420, 340]]]);
// Kantene i den rekkefølgen boka relakserer dem i hver runde. bend > 0 for buede kanter.
// Femte felt: hvor langs kanten vekten skrives (0–1)
const E = [['t', 'x', 5, 14], ['t', 'y', 8, 0], ['t', 'z', -4, 0, 0.25], ['x', 't', -2, 14], ['y', 'x', -3, 0, 0.25], ['y', 'z', 9, 0], ['z', 'x', 7, 0], ['z', 's', 2, 40], ['s', 't', 6, 0], ['s', 'y', 7, 0]];

const CODE = [
  'BELLMAN-FORD(G, w, s)',
  '1  INITIALIZE-SINGLE-SOURCE(G, s)',
  '2  for i = 1 to |G.V| − 1',
  '3    for each edge (u, v) ∈ G.E',
  '4      RELAX(u, v, w)',
  '5  for each edge (u, v) ∈ G.E',
  '6    if v.d > u.d + w(u, v)',
  '7      return FALSE',
  '8  return TRUE',
];

function buildSteps() {
  const d = new Map(V.map(v => [v, Infinity])), pi = new Map(V.map(v => [v, null])), out = [];
  d.set('s', 0);
  const snap = o => out.push({cur: -1, pass: 0, changed: null, endPass: false, ...o, d: new Map(d), pi: new Map(pi)});
  snap({code: [1], a: 'Linje 1: INITIALIZE-SINGLE-SOURCE gir s.d = 0 og v.d = ∞, v.π = NIL for alle andre.', b: 'Kantene relakseres i rekkefølgen (t,x), (t,y), (t,z), (x,t), (y,x), (y,z), (z,x), (z,s), (s,t), (s,y), som i boka.'});
  for (let i = 1; i <= V.length - 1; i += 1) {
    E.forEach(([u, v, w], k) => {
      const before = d.get(v), cand = d.get(u) + w;
      let a, b, changed = null;
      if (cand < before) {
        d.set(v, cand); pi.set(v, u); changed = v;
        a = `Runde ${i}: RELAX(${u}, ${v}): ${v}.d = ${fmt(before)} > ${u}.d + w = ${fmt(d.get(u))} + ${fmt(w)} = ${fmt(cand)}, så ${v}.d = ${fmt(cand)} og ${v}.π = ${u}.`;
        b = 'Estimatet blir bedre. Det er aldri lavere enn den sanne avstanden δ(s, v) (øvre grense-egenskapen).';
      } else {
        a = `Runde ${i}: RELAX(${u}, ${v}): ${v}.d = ${fmt(before)} ≤ ${u}.d + w = ${fmt(d.get(u))} + ${fmt(w)} = ${fmt(cand)}, ingen endring.`;
        b = d.get(u) === Infinity ? `${u}.d er ∞, så kanten kan ikke forbedre noe ennå.` : 'Kanten gir ingen kortere vei til v.';
      }
      const endPass = k === E.length - 1;
      if (endPass) b += ` Etter runde ${i} er alle korteste veier med høyst ${i} kanter funnet.`;
      snap({cur: k, pass: i, changed, endPass, code: changed ? [2, 3, 4] : [2, 3, 4], a, b});
    });
  }
  snap({code: [5, 6, 8], end: true, a: 'Linje 5–8: ingen kant har v.d > u.d + w(u, v), så det finnes ingen negativ sykel som kan nås fra s. Returnerer TRUE.',
    b: 'd-verdiene er de korteste avstandene: s 0, t 2, x 4, y 7, z −2. De blå kantene er korteste-vei-treet.'});
  return out;
}

const STEPS = buildSteps();

export default () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  return <svg viewBox='0 0 760 520' role='img' aria-label='Bellman-Ford steg for steg' fontSize='13'>
    <Title title='Bellman-Ford steg for steg' subtitle='Grafen fra bokas figur 22.4 med kilde s; tallet i noden er v.d'/>
    <Controls s={s} N={N} setS={setS} steps={STEPS} jump={x => x.endPass || x.end}/>
    {E.map(([u, v, w, bend, lt], k) => {
      const cur = k === st.cur, tree = st.pi.get(v) === u;
      return <Edge key={k} p={P.get(u)} q={P.get(v)} directed bend={bend} r={24} label={fmt(w)} labelT={lt || 0.5}
        color={cur ? C.cmp : (tree ? C.accent : C.edge)} width={cur || tree ? 3 : 1.25}/>;
    })}
    {V.map(v => {
      const [x, y] = P.get(v), ch = v === st.changed;
      return <g key={v}>
        <Node x={x} y={y} r={24} label={fmt(st.d.get(v))} stroke={ch ? C.good : C.edge} strokeWidth={ch ? 3 : 1.25} fill={ch ? C.good : 'none'} fillOpacity={ch ? 0.15 : 0}/>
        <text x={x} y={y + (y < 200 ? -32 : 44)} textAnchor='middle' fontSize='13' fontWeight='600' fill={C.quiet}>{v}</text>
      </g>;
    })}
    <Pseudo x={500} y={150} lines={CODE} active={st.code} w={252}/>
    <text x='500' y='330' fontSize='12' fill={C.quiet}>{st.pass > 0 ? `Runde i = ${st.pass} av ${V.length - 1}` : (st.end ? 'Sjekk for negative sykler' : 'Initialisering')}</text>
    <text x='500' y='352' fontSize='12' fill={C.quiet}>{`π: ${V.filter(v => st.pi.get(v)).map(v => `${v}.π = ${st.pi.get(v)}`).join(', ') || 'alle NIL'}`}</text>
    <Explain y={430} a={st.a} b={st.b}/>
  </svg>;
};
