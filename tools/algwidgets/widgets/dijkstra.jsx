const {C, Controls, Title, Explain, Node, Edge, Pseudo, fmt} = window.AlgLib;

// Grafen fra bokas figur 22.6
const V = ['s', 't', 'x', 'y', 'z'];
const P = new Map([['s', [70, 250]], ['t', [220, 160]], ['x', [420, 160]], ['y', [220, 340]], ['z', [420, 340]]]);
const E = [['s', 't', 10, 0], ['s', 'y', 5, 0], ['t', 'x', 1, 0], ['t', 'y', 2, 14], ['y', 't', 3, 14], ['x', 'z', 4, 14], ['z', 'x', 6, 14], ['y', 'x', 9, 0], ['y', 'z', 2, 0], ['z', 's', 7, 40]];
const Adj = new Map(V.map(v => [v, E.filter(e => e[0] === v)]));

const CODE = [
  'DIJKSTRA(G, w, s)',
  ' 6  while Q ≠ ∅',
  ' 7    u = EXTRACT-MIN(Q)',
  ' 8    S = S ∪ {u}',
  ' 9    for each v in G.Adj[u]',
  '10      RELAX(u, v, w)',
  '11      if RELAX senket v.d',
  '12        DECREASE-KEY(Q, v, v.d)',
];

function buildSteps() {
  const d = new Map(V.map(v => [v, Infinity])), pi = new Map(V.map(v => [v, null])), S = new Set(), out = [];
  d.set('s', 0);
  const snap = o => out.push({u: null, upd: [], ...o, d: new Map(d), pi: new Map(pi), S: new Set(S)});
  snap({code: [], a: 'Linje 1–5: s.d = 0, alle andre har d = ∞. S = ∅, og alle nodene legges i min-prioritetskøen Q med d som nøkkel.', b: 'S er nodene der d allerede er riktig. Krever at ingen kanter har negativ vekt.'});
  while (S.size < V.length) {
    const u = V.filter(v => !S.has(v)).sort((a, b) => d.get(a) - d.get(b) || a.localeCompare(b)).at(0);
    S.add(u);
    const upd = [];
    Adj.get(u).forEach(([, v, w]) => {
      if (d.get(u) + w < d.get(v)) { upd.push(`${v}: ${fmt(d.get(v))} → ${d.get(u) + w}`); d.set(v, d.get(u) + w); pi.set(v, u); }
    });
    snap({u, upd: upd.map(x => x.at(0)), code: [7, 8, 9, 10].concat(upd.length ? [11, 12] : []),
      a: `Linje 7–8: EXTRACT-MIN gir ${u} med ${u}.d = ${d.get(u)}, som legges i S. ${u}.d er nå endelig.`,
      b: upd.length ? `Linje 9–12: kantene ut fra ${u} relakseres, og ${upd.join(', ')}.` : `Linje 9–12: kantene ut fra ${u} relakseres, men ingen gir kortere vei.`});
  }
  out.at(-1).b += ' Ferdig: s 0, t 8, x 9, y 5, z 7.';
  return out;
}

const STEPS = buildSteps();

export default () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const Qs = V.filter(v => !st.S.has(v)).sort((a, b) => st.d.get(a) - st.d.get(b) || a.localeCompare(b));
  return <svg viewBox='0 0 760 520' role='img' aria-label='Dijkstra steg for steg' fontSize='13'>
    <Title title='Dijkstra steg for steg' subtitle='Grafen fra bokas figur 22.6 med kilde s; tallet i noden er v.d'/>
    <Controls s={s} N={N} setS={setS}/>
    {E.map(([u, v, w, bend], k) => {
      const tree = st.pi.get(v) === u, out = u === st.u;
      return <Edge key={k} p={P.get(u)} q={P.get(v)} directed bend={bend} r={24} label={w}
        color={tree ? C.accent : (out ? C.cmp : C.edge)} width={tree ? 3 : (out ? 2 : 1.25)}/>;
    })}
    {V.map(v => {
      const [x, y] = P.get(v), inS = st.S.has(v), cur = v === st.u, up = st.upd.includes(v);
      return <g key={v}>
        <Node x={x} y={y} r={24} label={fmt(st.d.get(v))} fill={inS ? C.ink : 'none'} fillOpacity={inS ? 0.75 : 0} textFill={inS ? 'var(--cds-chart-reference-tint)' : C.ink}
          stroke={cur ? C.accent : (up ? C.good : C.edge)} strokeWidth={cur || up ? 3 : 1.25}/>
        <text x={x} y={y + (y < 200 ? -32 : 44)} textAnchor='middle' fontSize='13' fontWeight='600' fill={C.quiet}>{v}</text>
      </g>;
    })}
    <Pseudo x={500} y={150} lines={CODE} active={st.code} w={252}/>
    <text x='500' y='312' fontSize='12' fill={C.quiet}>Q sortert på d (minst først)</text>
    {Qs.map((v, k) => <g key={`q${k}`}>
      <rect x={500 + k * 50} y='322' width='46' height='28' rx='4' fill='none' stroke={C.edge}/>
      <text x={523 + k * 50} y='341' textAnchor='middle' fontSize='12' fill={C.ink}>{`${v}:${fmt(st.d.get(v))}`}</text>
    </g>)}
    <text x='500' y='372' fontSize='12' fill={C.quiet}>{`S = {${[...st.S].join(', ')}}  (svarte noder)`}</text>
    <Explain y={430} a={st.a} b={st.b}/>
  </svg>;
};
