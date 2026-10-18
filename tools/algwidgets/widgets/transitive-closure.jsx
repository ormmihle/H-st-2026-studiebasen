const {C, Controls, Title, Explain, Node, Edge, Matrix} = window.AlgLib;

// Grafen fra bokas figur 23.5
const n = 4;
const P = [[80, 170], [240, 170], [240, 320], [80, 320]];
const E = [[2, 3, 14], [3, 2, 14], [2, 4, 0], [4, 1, 0], [4, 3, 0]];
const LBL = [1, 2, 3, 4];

function buildSteps() {
  let T = [...Array(n)].map((_, i) => [...Array(n)].map((__, j) => (i === j ? 1 : 0)));
  E.forEach(([u, v]) => { T[u - 1][v - 1] = 1; });
  const out = [{k: 0, T: T.map(r => r.slice()), changed: [], a: 'Linje 1–6: t⁽⁰⁾ᵢⱼ = 1 hvis i = j eller (i, j) er en kant, ellers 0.', b: 't⁽ᵏ⁾ᵢⱼ = 1 betyr at det finnes en sti fra i til j der alle mellomnodene er i {1, …, k}.'}];
  for (let k = 1; k <= n; k += 1) {
    const NT = T.map(r => r.slice()), changed = [];
    for (let i = 0; i < n; i += 1) for (let j = 0; j < n; j += 1) {
      if (!T[i][j] && T[i][k - 1] && T[k - 1][j]) { NT[i][j] = 1; changed.push([i, j]); }
    }
    T = NT;
    out.push({k, T: T.map(r => r.slice()), changed,
      a: `k = ${k}: tᵢⱼ = tᵢⱼ ∨ (tᵢₖ ∧ tₖⱼ). ${changed.length ? `Nye stier via ${k}: ${changed.map(([i, j]) => `${i + 1} → ${j + 1}`).join(', ')}.` : `Node ${k} gir ingen nye stier.`}`,
      b: k === n ? 'T⁽⁴⁾ er den transitive tillukningen: tᵢⱼ = 1 hvis og bare hvis j kan nås fra i. Node 1 når bare seg selv.' : 'Samme struktur som Floyd-Warshall, men med ∨ og ∧ i stedet for min og +.'});
  }
  return out;
}

const STEPS = buildSteps();

export default () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const hl = new Map();
  st.changed.forEach(([i, j]) => hl.set(`${i},${j}`, C.good));
  return <svg viewBox='0 0 760 470' role='img' aria-label='Transitive-Closure steg for steg' fontSize='13'>
    <Title title='Transitive-Closure steg for steg' subtitle='Grafen fra bokas figur 23.5; ett steg per verdi av k'/>
    <Controls s={s} N={N} setS={setS}/>
    {E.map(([u, v, bend], idx) => <Edge key={idx} p={P[u - 1]} q={P[v - 1]} directed bend={bend} r={20}
      color={st.k === u || st.k === v ? C.accent : C.edge} width={st.k === u || st.k === v ? 2 : 1.25}/>)}
    {st.changed.map(([i, j], idx) => (i === j ? null : <Edge key={`n${idx}`} p={P[i]} q={P[j]} directed bend={-30} r={20} color={C.good} width={2} dash='5 4'/>))}
    {LBL.map((v, i) => <Node key={v} x={P[i][0]} y={P[i][1]} label={v} fill={st.k === v ? C.accent : 'none'} fillOpacity={st.k === v ? 0.25 : 0}/>)}
    <Matrix x={400} y={170} label={`T⁽${'⁰¹²³⁴'.charAt(st.k)}⁾`} data={st.T} hl={hl} rowLabels={LBL} colLabels={LBL} cw={40} ch={26}/>
    <text x='400' y='310' fontSize='12' fill={C.quiet}>Grønn celle og stiplet pil = ny sti funnet i denne runden.</text>
    <Explain y={390} a={st.a} b={st.b}/>
  </svg>;
};
