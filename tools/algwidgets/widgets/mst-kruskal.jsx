const {C, PALETTE, Controls, Title, Explain, Node, Edge} = window.AlgLib;

// Grafen fra bokas figur 21.1
const V = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
const P = new Map([['a', [50, 250]], ['b', [140, 170]], ['c', [270, 170]], ['d', [400, 170]], ['e', [490, 250]], ['f', [400, 330]], ['g', [270, 330]], ['h', [140, 330]], ['i', [205, 250]]]);
// Kantene i den rekkefølgen boka behandler dem (sortert på vekt)
const SORTED = [['h', 'g', 1], ['i', 'c', 2], ['g', 'f', 2], ['a', 'b', 4], ['c', 'f', 4], ['i', 'g', 6], ['c', 'd', 7], ['h', 'i', 7], ['a', 'h', 8], ['b', 'c', 8], ['d', 'e', 9], ['e', 'f', 10], ['b', 'h', 11], ['d', 'f', 14]];

function buildSteps() {
  const rep = new Map(V.map(v => [v, v]));
  const find = v => (rep.get(v) === v ? v : find(rep.get(v)));
  const A = [], status = new Map(), out = [];
  let total = 0;
  const snap = o => {
    const comp = new Map(V.map(v => [v, find(v)]));
    out.push({cur: -1, ...o, A: A.slice(), status: new Map(status), comp, total});
  };
  snap({a: 'Linje 1–5: A = ∅, og hver node er sin egen mengde (MAKE-SET). Kantene sorteres etter vekt.', b: 'Fargene viser mengdene, altså trærne i skogen A. Lista til høyre er kantene i sortert rekkefølge.'});
  SORTED.forEach((e, k) => {
    const [u, v, w] = e, ru = find(u), rv = find(v);
    if (ru !== rv) {
      A.push(k); rep.set(ru, rv); status.set(k, 'ok'); total += w;
      snap({cur: k, a: `Linje 7–9: (${u}, ${v}) med vekt ${w}. FIND-SET(${u}) ≠ FIND-SET(${v}), så kanten legges i A og mengdene slås sammen med UNION.`,
        b: `Kanten er lettest blant dem som krysser snittet mellom treet til ${u} og resten, så den er trygg (korollar 21.2). Vekt så langt: ${total}.`});
    } else {
      status.set(k, 'no');
      snap({cur: k, a: `Linje 7: (${u}, ${v}) med vekt ${w}. ${u} og ${v} er allerede i samme mengde, så kanten hoppes over.`, b: 'Den ville laget en sykel i A.'});
    }
  });
  out.at(-1).b += ` Ferdig: A er et minimalt spenntre med vekt ${total}.`;
  return out;
}

const STEPS = buildSteps();

export default () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const roots = [...new Set(V.map(v => st.comp.get(v)))];
  const colorOf = v => {
    const r = st.comp.get(v);
    const size = V.filter(x => st.comp.get(x) === r).length;
    return size > 1 ? PALETTE[roots.indexOf(r) % PALETTE.length] : null;
  };
  return <svg viewBox='0 0 760 520' role='img' aria-label='MST-Kruskal steg for steg' fontSize='13'>
    <Title title='MST-Kruskal steg for steg' subtitle='Grafen fra bokas figur 21.1; kantene behandles i sortert rekkefølge'/>
    <Controls s={s} N={N} setS={setS}/>
    {SORTED.map((e, k) => {
      const inA = st.A.includes(k), cur = k === st.cur;
      return <Edge key={k} p={P.get(e[0])} q={P.get(e[1])} label={e[2]} color={cur ? C.cmp : (inA ? C.accent : C.edge)} width={cur || inA ? 3.5 : 1.25}
        dash={st.status.get(k) === 'no' && !cur ? '4 4' : undefined}/>;
    })}
    {V.map(v => {
      const [x, y] = P.get(v), col = colorOf(v);
      return <Node key={v} x={x} y={y} label={v} fill={col || 'none'} fillOpacity={col ? 0.28 : 0}/>;
    })}
    <text x='560' y='140' fontSize='12' fill={C.quiet}>Sortert kantliste</text>
    {SORTED.map((e, k) => {
      const stt = st.status.get(k), cur = k === st.cur, y = 160 + k * 19;
      return <g key={`r${k}`}>
        {cur ? <rect x='554' y={y - 13} width='180' height='18' rx='3' fill={C.cmp} fillOpacity='0.16'/> : null}
        <text x='562' y={y} fontSize='12' fill={stt === 'no' ? C.quiet : C.ink} textDecoration={stt === 'no' ? 'line-through' : undefined}>{`(${e[0]}, ${e[1]})`}</text>
        <text x='630' y={y} fontSize='12' fill={C.quiet}>{`w = ${e[2]}`}</text>
        <text x='700' y={y} fontSize='13' fontWeight='600' fill={stt === 'ok' ? C.good : C.bad}>{stt === 'ok' ? '✓' : (stt === 'no' ? '✗' : '')}</text>
      </g>;
    })}
    <text x='24' y='410' fontSize='12' fill={C.quiet}>{`Kanter i A: ${st.A.length} av ${V.length - 1}  ·  vekt ${st.total}  ·  stiplet = forkastet (ville gitt sykel)`}</text>
    <Explain y={452} a={st.a} b={st.b}/>
  </svg>;
};
