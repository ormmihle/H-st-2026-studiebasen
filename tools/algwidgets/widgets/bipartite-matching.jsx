const {C, Controls, Title, Explain, Node, Edge} = window.AlgLib;

// En bipartitt graf som ligner bokas figur 24.8, gjort om til et flytnett med kapasitet 1
const L = ['l1', 'l2', 'l3', 'l4', 'l5'], R = ['r1', 'r2', 'r3', 'r4'];
const LBL = {s: 's', t: 't', l1: 'l₁', l2: 'l₂', l3: 'l₃', l4: 'l₄', l5: 'l₅', r1: 'r₁', r2: 'r₂', r3: 'r₃', r4: 'r₄'};
const P = {s: [50, 270], t: [500, 270]};
L.forEach((v, i) => { P[v] = [190, 170 + i * 50]; });
R.forEach((v, i) => { P[v] = [360, 195 + i * 50]; });
const G = [['l1', 'r1'], ['l1', 'r2'], ['l2', 'r1'], ['l3', 'r2'], ['l3', 'r3'], ['l3', 'r4'], ['l4', 'r3'], ['l5', 'r3']];
const E = L.map(l => ['s', l]).concat(G, R.map(r => [r, 't']));
const ORDER = ['s', ...L, ...R, 't'];

function buildSteps() {
  const f = new Map(E.map(([u, v]) => [`${u}|${v}`, 0])), out = [];
  const res = () => {
    const r = [];
    E.forEach(([u, v]) => { if (f.get(`${u}|${v}`) === 0) r.push([u, v, false]); else r.push([v, u, true]); });
    return r;
  };
  out.push({f: new Map(f), path: [], a: 'Flytnettet G′: en kilde s med kant til hver node i L, en kant fra hver node i R til sluket t, og kantene i G rettet fra L til R. Alle kapasiteter er 1.',
    b: 'Heltallsteoremet: Ford-Fulkerson gir en heltallig maks flyt, så hver kant får flyt 0 eller 1. Kantene fra L til R med flyt 1 er en matching.'});
  let it = 0;
  for (;;) {
    const r = res(), pi = new Map([['s', null]]), queue = ['s'];
    while (queue.length) {
      const u = queue.shift();
      ORDER.forEach(v => { if (!pi.has(v) && r.some(e => e[0] === u && e[1] === v)) { pi.set(v, u); queue.push(v); } });
    }
    if (!pi.has('t')) {
      const m = G.filter(([u, v]) => f.get(`${u}|${v}`) === 1);
      out.push({f: new Map(f), path: [], done: true, a: `Ingen forøkende sti finnes. Maks flyt er ${m.length}, og matchingen er {${m.map(([u, v]) => `(${LBL[u]}, ${LBL[v]})`).join(', ')}}.`,
        b: 'l₄ og l₅ har bare r₃ som nabo, så de kan ikke begge matches. En matching med 5 kanter er umulig.'});
      break;
    }
    const path = ['t'];
    while (path.at(0) !== 's') path.unshift(pi.get(path.at(0)));
    it += 1;
    const back = [];
    path.slice(1).forEach((v, i) => {
      const u = path[i];
      if (f.has(`${u}|${v}`) && f.get(`${u}|${v}`) === 0) f.set(`${u}|${v}`, 1);
      else { f.set(`${v}|${u}`, 0); back.push(`(${LBL[v]}, ${LBL[u]})`); }
    });
    out.push({f: new Map(f), path, a: `Iterasjon ${it}: BFS finner ${path.map(x => LBL[x]).join(' → ')}, og flyten øker med 1.`,
      b: back.length ? `Stien går baklengs langs ${back.join(' og ')}, så de kantene tas ut av matchingen, mens nye kanter legges inn. Matchingen vokser likevel med én.` : 'Stien går bare forlengs, så én ny kant fra L til R kommer med i matchingen.'});
  }
  return out;
}

const STEPS = buildSteps();

export default () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const onPath = (u, v) => { const i = st.path.indexOf(u); return i >= 0 && (st.path.at(i + 1) === v || st.path.at(i - 1) === v && i > 0); };
  const matched = G.filter(([u, v]) => st.f.get(`${u}|${v}`) === 1);
  return <svg viewBox='0 0 760 520' role='img' aria-label='Maksimum bipartitt matching med maks flyt' fontSize='13'>
    <Title title='Maksimum bipartitt matching med maks flyt' subtitle='Edmonds-Karp på flytnettet G′; alle kanter har kapasitet 1'/>
    <Controls s={s} N={N} setS={setS}/>
    {E.map(([u, v], k) => {
      const fl = st.f.get(`${u}|${v}`), pth = onPath(u, v);
      return <Edge key={k} p={P[u]} q={P[v]} directed r={17} color={pth ? C.cmp : (fl ? C.accent : C.edge)} width={pth ? 3 : (fl ? 3 : 1.1)} dash={pth && !fl ? '6 4' : undefined}/>;
    })}
    {Object.keys(P).map(v => <Node key={v} x={P[v][0]} y={P[v][1]} r={17} label={LBL[v]} stroke={st.path.includes(v) ? C.cmp : C.edge} strokeWidth={st.path.includes(v) ? 2.5 : 1.25}/>)}
    <text x='190' y='140' textAnchor='middle' fontSize='12' fill={C.quiet}>L</text>
    <text x='360' y='140' textAnchor='middle' fontSize='12' fill={C.quiet}>R</text>
    <text x='560' y='170' fontSize='12' fontWeight='600' fill={C.ink}>{`Matching (${matched.length} kanter)`}</text>
    {matched.map(([u, v], k) => <text key={k} x='560' y={194 + k * 20} fontSize='13' fill={C.accent} fontWeight='600'>{`${LBL[u]} – ${LBL[v]}`}</text>)}
    <text x='24' y='414' fontSize='12' fill={C.quiet}>Blå = flyt 1 (i matchingen eller brukt av s/t). Oransje = forøkende sti; stiplet oransje = kanten ble gått baklengs og er tatt ut.</text>
    <Explain y={448} a={st.a} b={st.b}/>
  </svg>;
};
