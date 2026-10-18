const {C, Controls, Title, Explain, Node, Edge, Pseudo, fmt} = window.AlgLib;

// Grafen fra bokas figur 22.5, nodene i topologisk sortert rekkefølge
const V = ['r', 's', 't', 'x', 'y', 'z'];
const P = new Map(V.map((v, i) => [v, [50 + i * 86, 250]]));
// bend < 0 bøyer kanten oppover, > 0 nedover
const E = [['r', 's', 5, 0], ['r', 't', 3, -110], ['s', 't', 2, 0], ['s', 'x', 6, 110], ['t', 'x', 7, 0], ['t', 'y', 4, -110], ['t', 'z', 2, 150], ['x', 'y', -1, 0], ['x', 'z', 1, -110], ['y', 'z', -2, 0]];
const Adj = new Map(V.map(v => [v, E.filter(e => e[0] === v)]));

const CODE = [
  'DAG-SHORTEST-PATHS(G, w, s)',
  '1  sorter G topologisk',
  '2  INIT-SINGLE-SOURCE(G, s)',
  '3  for hver u, topologisk',
  '4    for each v in G.Adj[u]',
  '5      RELAX(u, v, w)',
];

function buildSteps() {
  const d = new Map(V.map(v => [v, Infinity])), pi = new Map(V.map(v => [v, null])), out = [];
  d.set('s', 0);
  const snap = o => out.push({u: null, upd: [], ...o, d: new Map(d), pi: new Map(pi)});
  snap({code: [1, 2], a: 'Linje 1–2: nodene er topologisk sortert fra venstre mot høyre. s.d = 0, alle andre har d = ∞.', b: 'Alle kanter går mot høyre, så når vi kommer til en node, er alle kanter inn til den allerede relaksert.'});
  V.forEach(u => {
    const upd = [];
    Adj.get(u).forEach(([, v, w]) => {
      if (d.get(u) + w < d.get(v)) { upd.push(`${v}.d = ${fmt(d.get(u) + w)}`); d.set(v, d.get(u) + w); pi.set(v, u); }
    });
    const none = Adj.get(u).length === 0;
    snap({u, upd: upd.map(x => x.at(0)), code: [3, 4, 5],
      a: `Linje 3–5: u = ${u} (${u}.d = ${fmt(d.get(u))}). ${none ? 'Ingen utkanter.' : `Kantene ut fra ${u} relakseres.`}`,
      b: upd.length ? `Forbedret: ${upd.join(', ')}.` : (d.get(u) === Infinity ? `${u} kan ikke nås fra s, så ingenting endres.` : 'Ingen forbedringer.')});
  });
  out.at(-1).b += ' Ferdig: r ∞, s 0, t 2, x 6, y 5, z 3. Hver kant ble relaksert nøyaktig én gang.';
  return out;
}

const STEPS = buildSteps();

export default () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const done = v => st.u !== null && V.indexOf(v) <= V.indexOf(st.u);
  return <svg viewBox='0 0 760 520' role='img' aria-label='Dag-Shortest-Paths steg for steg' fontSize='13'>
    <Title title='Dag-Shortest-Paths steg for steg' subtitle='Grafen fra bokas figur 22.5 med kilde s; tallet i noden er v.d'/>
    <Controls s={s} N={N} setS={setS}/>
    {E.map(([u, v, w, bend], k) => {
      const tree = st.pi.get(v) === u, out = u === st.u;
      return <Edge key={k} p={P.get(u)} q={P.get(v)} directed bend={bend} r={24} label={fmt(w)}
        color={tree ? C.accent : (out ? C.cmp : C.edge)} width={tree ? 3 : (out ? 2 : 1.25)}/>;
    })}
    {V.map(v => {
      const [x, y] = P.get(v), cur = v === st.u, up = st.upd.includes(v), dn = done(v);
      return <g key={v}>
        <Node x={x} y={y} r={24} label={fmt(st.d.get(v))} fill={dn ? C.ink : 'none'} fillOpacity={dn ? 0.75 : 0} textFill={dn ? 'var(--cds-chart-reference-tint)' : C.ink}
          stroke={cur ? C.accent : (up ? C.good : C.edge)} strokeWidth={cur || up ? 3 : 1.25}/>
        <text x={x} y={y - 32} textAnchor='middle' fontSize='13' fontWeight='600' fill={C.quiet}>{v}</text>
      </g>;
    })}
    <Pseudo x={540} y={150} lines={CODE} active={st.code} w={214} size={11}/>
    <text x='24' y='410' fontSize='12' fill={C.quiet}>Svart node = behandlet. Blå kant = korteste-vei-treet (v.π, v). Oransje = kantene som relakseres nå.</text>
    <Explain y={446} a={st.a} b={st.b}/>
  </svg>;
};
