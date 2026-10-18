const {C, Controls, Title, Explain, Node, Edge} = window.AlgLib;

// Flytnettet fra bokas figur 24.1
const V = ['s', 'v1', 'v2', 'v3', 'v4', 't'];
const LBL = {s: 's', v1: 'v₁', v2: 'v₂', v3: 'v₃', v4: 'v₄', t: 't'};
const Q = {s: [20, 95], v1: [110, 25], v2: [110, 165], v3: [225, 25], v4: [225, 165], t: [315, 95]};
const E = [['s', 'v1', 16], ['s', 'v2', 13], ['v1', 'v3', 12], ['v2', 'v1', 4], ['v3', 'v2', 9], ['v2', 'v4', 14], ['v4', 'v3', 7], ['v3', 't', 20], ['v4', 't', 4]];
const cap = new Map(E.map(([u, v, c]) => [`${u}|${v}`, c]));

function residual(f) {
  // Restkapasitet: c − f for kanter i E, f for den motsatte retningen
  const r = [];
  E.forEach(([u, v, c]) => {
    const fl = f.get(`${u}|${v}`);
    if (c - fl > 0) r.push([u, v, c - fl, false]);
    if (fl > 0) r.push([v, u, fl, true]);
  });
  return r;
}

function bfs(res) {
  const pi = new Map([['s', null]]), queue = ['s'];
  while (queue.length) {
    const u = queue.shift();
    V.forEach(v => {
      const e = res.find(x => x[0] === u && x[1] === v);
      if (e && !pi.has(v)) { pi.set(v, u); queue.push(v); }
    });
  }
  if (!pi.has('t')) return {path: null, reach: new Set(pi.keys())};
  const path = ['t'];
  while (path.at(0) !== 's') path.unshift(pi.get(path.at(0)));
  return {path, reach: new Set(pi.keys())};
}

function buildSteps() {
  const f = new Map(E.map(([u, v]) => [`${u}|${v}`, 0])), out = [];
  let value = 0, it = 0;
  out.push({res: residual(f), f: new Map(f), path: [], value, cut: null,
    a: 'Linje 1–2: flyten er 0 på alle kanter. Restnettet G_f er da det samme som G.', b: 'Edmonds-Karp er Ford-Fulkerson der den forøkende stien finnes med BFS, altså en sti med færrest mulig kanter.'});
  for (;;) {
    const res = residual(f), {path, reach} = bfs(res);
    if (!path) {
      const cut = E.filter(([u, v]) => reach.has(u) && !reach.has(v));
      const cc = cut.reduce((s, e) => s + e[2], 0);
      out.push({res, f: new Map(f), path: [], value, cut: {S: reach, edges: cut.map(([u, v]) => `${u}|${v}`), cap: cc},
        a: `BFS finner ingen sti fra s til t i G_f, så flyten er maksimal: |f| = ${value}.`,
        b: `Nodene som kan nås fra s i G_f, S = {${[...reach].map(x => LBL[x]).join(', ')}}, gir et minimalt snitt. Kantene ut av S er fulle, og c(S, T) = ${cut.map(e => e[2]).join(' + ')} = ${cc} = |f|.`});
      break;
    }
    it += 1;
    const edges = path.slice(1).map((v, i) => res.find(x => x[0] === path[i] && x[1] === v));
    const cf = Math.min(...edges.map(e => e[2]));
    const back = edges.filter(e => e[3]);
    edges.forEach(([u, v, , isBack]) => {
      if (!isBack) f.set(`${u}|${v}`, f.get(`${u}|${v}`) + cf);
      else f.set(`${v}|${u}`, f.get(`${v}|${u}`) - cf);
    });
    value += cf;
    out.push({res, f: new Map(f), path, value, cut: null,
      a: `Iterasjon ${it}: BFS finner p = ${path.map(x => LBL[x]).join(' → ')} med c_f(p) = min(${edges.map(e => e[2]).join(', ')}) = ${cf}. Flyten økes med ${cf}, til |f| = ${value}.`,
      b: back.length ? `Stien bruker ${back.map(e => `(${LBL[e[0]]}, ${LBL[e[1]]})`).join(', ')} baklengs, så flyt på den opprinnelige kanten oppheves (linje 8).` : 'Venstre: restnettet før økningen, med stien uthevet. Høyre: flyten etterpå.'});
  }
  return out;
}

const STEPS = buildSteps();

function Panel({x0, y0, title, children}) {
  return <g>
    <text x={x0} y={y0 - 20} fontSize='12' fontWeight='600' fill={C.quiet}>{title}</text>
    <g transform={`translate(${x0 + 15}, ${y0})`}>{children}</g>
  </g>;
}

export default () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const onPath = (u, v) => { const i = st.path.indexOf(u); return i >= 0 && st.path.at(i + 1) === v; };
  const both = (u, v) => st.res.some(e => e[0] === u && e[1] === v) && st.res.some(e => e[0] === v && e[1] === u);
  const inS = v => st.cut && st.cut.S.has(v);
  return <svg viewBox='0 0 760 530' role='img' aria-label='Edmonds-Karp steg for steg' fontSize='13'>
    <Title title='Edmonds-Karp (Ford-Fulkerson med BFS) steg for steg' subtitle='Flytnettet fra bokas figur 24.1; venstre er restnettet G_f, høyre er flyten f/c'/>
    <Controls s={s} N={N} setS={setS}/>
    <Panel x0={20} y0={170} title={st.cut ? 'Restnett G_f (ingen sti til t)' : 'Restnett G_f med forøkende sti'}>
      {st.res.map(([u, v, rc, isBack], k) => {
        const pth = onPath(u, v);
        return <Edge key={k} p={Q[u]} q={Q[v]} directed r={18} bend={both(u, v) ? 12 : 0} label={rc}
          color={pth ? C.cmp : (isBack ? C.purple : C.edge)} width={pth ? 3 : 1.25} dash={isBack && !pth ? '4 3' : undefined}/>;
      })}
      {V.map(v => <Node key={v} x={Q[v][0]} y={Q[v][1]} r={18} label={LBL[v]} fill={inS(v) ? C.accent : 'none'} fillOpacity={inS(v) ? 0.25 : 0}
        stroke={st.path.includes(v) ? C.cmp : C.edge} strokeWidth={st.path.includes(v) ? 2.5 : 1.25}/>)}
    </Panel>
    <Panel x0={395} y0={170} title={`Flyt f, |f| = ${st.value}`}>
      {E.map(([u, v, c], k) => {
        const fl = st.f.get(`${u}|${v}`), cutE = st.cut && st.cut.edges.includes(`${u}|${v}`);
        return <Edge key={k} p={Q[u]} q={Q[v]} directed r={18} label={`${fl}/${c}`}
          color={cutE ? C.bad : (fl > 0 ? C.accent : C.edge)} width={cutE ? 3 : (fl > 0 ? 1 + (fl / c) * 2.5 : 1.25)}/>;
      })}
      {V.map(v => <Node key={v} x={Q[v][0]} y={Q[v][1]} r={18} label={LBL[v]} fill={inS(v) ? C.accent : 'none'} fillOpacity={inS(v) ? 0.25 : 0}/>)}
    </Panel>
    <text x='24' y='400' fontSize='12' fill={C.quiet}>Restnett: grå = c − f på kanter i G, lilla stiplet = f baklengs (kan oppheves), oransje = forøkende sti.</text>
    <text x='24' y='418' fontSize='12' fill={C.quiet}>{st.cut ? 'Fylte noder = S. Røde kanter = snittkantene fra S til T, alle fulle.' : 'Flyt: blå kanter har flyt, tykkere jo fullere de er.'}</text>
    <Explain y={452} a={st.a} b={st.b}/>
  </svg>;
};
