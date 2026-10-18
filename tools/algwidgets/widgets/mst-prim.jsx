const {C, Controls, Title, Explain, Node, Edge, Pseudo, fmt} = window.AlgLib;

const V = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
const P = new Map([['a', [50, 250]], ['b', [140, 170]], ['c', [270, 170]], ['d', [400, 170]], ['e', [490, 250]], ['f', [400, 330]], ['g', [270, 330]], ['h', [140, 330]], ['i', [205, 250]]]);
const E = [['a', 'b', 4], ['a', 'h', 8], ['b', 'c', 8], ['b', 'h', 11], ['c', 'd', 7], ['c', 'f', 4], ['c', 'i', 2], ['d', 'e', 9], ['d', 'f', 14], ['e', 'f', 10], ['f', 'g', 2], ['g', 'h', 1], ['g', 'i', 6], ['h', 'i', 7]];
const W = new Map();
E.forEach(([u, v, w]) => { W.set(`${u}${v}`, w); W.set(`${v}${u}`, w); });
const Adj = new Map(V.map(v => [v, V.filter(x => W.has(`${v}${x}`))]));

const CODE = [
  'MST-PRIM(G, w, r)',
  ' 8  while Q ≠ ∅',
  ' 9    u = EXTRACT-MIN(Q)',
  '10    for each v in G.Adj[u]',
  '11      if v∈Q and w(u,v)<v.key',
  '12        v.π = u',
  '13        v.key = w(u,v)',
  '14        DECREASE-KEY(Q,v,w(u,v))',
];

function buildSteps() {
  const key = new Map(V.map(v => [v, Infinity])), pi = new Map(V.map(v => [v, null]));
  const inQ = new Set(V), out = [];
  key.set('a', 0);
  const snap = o => out.push({u: null, upd: [], code: [], ...o, key: new Map(key), pi: new Map(pi), inQ: new Set(inQ)});
  snap({a: 'Linje 1–7: alle noder får key = ∞ og π = NIL, unntatt roten a, som får key = 0. Alle legges i min-prioritetskøen Q.', b: 'v.key er vekten på den letteste kanten fra v til treet så langt.'});
  while (inQ.size > 0) {
    // EXTRACT-MIN; likhet brytes alfabetisk, som i boka
    const u = [...inQ].sort((x, y) => key.get(x) - key.get(y) || x.localeCompare(y)).at(0);
    inQ.delete(u);
    const upd = [];
    Adj.get(u).forEach(v => {
      if (inQ.has(v) && W.get(`${u}${v}`) < key.get(v)) {
        upd.push(`${v}: ${fmt(key.get(v))} → ${W.get(`${u}${v}`)}`);
        pi.set(v, u); key.set(v, W.get(`${u}${v}`));
      }
    });
    const added = pi.get(u) ? `Kanten (${pi.get(u)}, ${u}) med vekt ${key.get(u)} blir en del av treet. ` : 'Roten blir første node i treet. ';
    snap({u, upd: upd.map(x => x.at(0)), code: upd.length ? [9, 10, 11, 12, 13, 14] : [9, 10, 11],
      a: `Linje 9: EXTRACT-MIN gir ${u} (key = ${key.get(u)}). ${added}`,
      b: upd.length ? `Linje 10–14: naboer i Q får lavere key: ${upd.join(', ')}.` : 'Linje 10–14: ingen naboer i Q får lavere key.'});
  }
  const total = V.reduce((s, v) => s + (pi.get(v) ? key.get(v) : 0), 0);
  out.at(-1).b += ` Q er tom. Treet {(v, v.π)} har vekt ${total}.`;
  return out;
}

const STEPS = buildSteps();

export default () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const isTree = (u, v) => (st.pi.get(v) === u && !st.inQ.has(v)) || (st.pi.get(u) === v && !st.inQ.has(u));
  const isCand = (u, v) => (st.pi.get(v) === u && st.inQ.has(v)) || (st.pi.get(u) === v && st.inQ.has(u));
  const Qs = [...st.inQ].sort((x, y) => st.key.get(x) - st.key.get(y) || x.localeCompare(y));
  return <svg viewBox='0 0 760 520' role='img' aria-label='MST-Prim steg for steg' fontSize='13'>
    <Title title='MST-Prim steg for steg' subtitle='Grafen fra bokas figur 21.1 med rot a; tallet over hver node er v.key'/>
    <Controls s={s} N={N} setS={setS}/>
    {E.map(([u, v, w]) => {
      const t = isTree(u, v), c = isCand(u, v);
      return <Edge key={`${u}${v}`} p={P.get(u)} q={P.get(v)} label={w} color={t ? C.accent : (c ? C.cmp : C.edge)} width={t ? 3.5 : (c ? 2 : 1.25)} dash={c ? '5 4' : undefined}/>;
    })}
    {V.map(v => {
      const [x, y] = P.get(v), inTree = !st.inQ.has(v), cur = v === st.u, up = st.upd.includes(v);
      return <Node key={v} x={x} y={y} label={v} fill={inTree ? C.accent : 'none'} fillOpacity={inTree ? 0.22 : 0}
        stroke={cur ? C.accent : (up ? C.cmp : C.edge)} strokeWidth={cur || up ? 3 : 1.25}
        sub={inTree ? null : fmt(st.key.get(v))} subDy={y < 200 ? -28 : (y > 300 ? 38 : -28)} subFill={up ? C.cmp : C.quiet}/>;
    })}
    <Pseudo x={530} y={140} lines={CODE} active={st.code} w={226} size={11}/>
    <text x='530' y='300' fontSize='12' fill={C.quiet}>Q sortert på key (minst først)</text>
    {Qs.map((v, k) => <g key={`q${k}`}>
      <rect x={530 + (k % 5) * 44} y={310 + Math.floor(k / 5) * 34} width='40' height='28' rx='4' fill='none' stroke={C.edge}/>
      <text x={550 + (k % 5) * 44} y={329 + Math.floor(k / 5) * 34} textAnchor='middle' fontSize='12' fill={C.ink}>{`${v}:${fmt(st.key.get(v))}`}</text>
    </g>)}
    <text x='24' y='410' fontSize='12' fill={C.quiet}>Fylt node = i treet (V − Q). Blå kant = i treet. Oransje stiplet = (v, v.π) for v i Q, letteste kant over snittet fra v.</text>
    <Explain y={452} a={st.a} b={st.b}/>
  </svg>;
};
