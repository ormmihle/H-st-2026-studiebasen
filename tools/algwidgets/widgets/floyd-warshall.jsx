const {C, Controls, Title, Explain, Node, Edge, Matrix, fmt} = window.AlgLib;

// Grafen fra bokas figur 23.1
const n = 5;
const P = [[60, 250], [150, 170], [250, 250], [210, 345], [100, 345]];
// Fjerde felt: hvor langs kanten vekten skrives (0–1)
const E = [[1, 2, 3], [1, 3, 8, 0.2], [1, 5, -4], [2, 4, 1, 0.72], [2, 5, 7, 0.72], [3, 2, 4], [4, 1, 2, 0.3], [4, 3, -5], [5, 4, 6]];
const LBL = [1, 2, 3, 4, 5];

function buildSteps() {
  let D = [...Array(n)].map((_, i) => [...Array(n)].map((__, j) => (i === j ? 0 : Infinity)));
  let Pi = [...Array(n)].map(() => [...Array(n)].map(() => null));
  E.forEach(([u, v, w]) => { D[u - 1][v - 1] = w; Pi[u - 1][v - 1] = u; });
  const out = [];
  out.push({k: 0, D: D.map(r => r.slice()), Pi: Pi.map(r => r.slice()), changed: [], path: [],
    a: 'D⁽⁰⁾ = W: kantvektene, 0 på diagonalen og ∞ der det ikke er noen kant. π⁽⁰⁾ᵢⱼ = i hvis (i, j) er en kant, ellers NIL.',
    b: 'D⁽ᵏ⁾ᵢⱼ er lengden av korteste vei fra i til j der alle mellomnodene er i {1, …, k}.'});
  for (let k = 1; k <= n; k += 1) {
    const ND = D.map(r => r.slice()), NP = Pi.map(r => r.slice()), changed = [];
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) {
        const via = D[i][k - 1] + D[k - 1][j];
        if (via < D[i][j]) { ND[i][j] = via; NP[i][j] = Pi[k - 1][j]; changed.push([i, j, D[i][j], via]); }
      }
    }
    D = ND; Pi = NP;
    const ex = changed.slice(0, 3).map(([i, j, o, nw]) => `d${i + 1}${j + 1}: ${fmt(o)} → ${fmt(nw)}`).join(', ');
    out.push({k, D: D.map(r => r.slice()), Pi: Pi.map(r => r.slice()), changed, path: [],
      a: `k = ${k}: nå kan node ${k} brukes som mellomnode. For hver (i, j): dᵢⱼ = min(dᵢⱼ, dᵢₖ + dₖⱼ). ${changed.length} celler blir bedre${changed.length ? `, f.eks. ${ex}` : ''}.`,
      b: `Når en celle blir bedre, settes πᵢⱼ = πₖⱼ: forgjengeren til j på den beste veien fra ${k} til j. Rad og kolonne ${k} (markert) endres aldri i runde k.`});
  }
  // PRINT-ALL-PAIRS-SHORTEST-PATH(Π, 1, 2)
  const path = [];
  const rec = (i, j) => { if (i === j) { path.push(i); return; } rec(i, Pi[i - 1][j - 1]); path.push(j); };
  rec(1, 2);
  out.push({k: n, D, Pi, changed: [], path, print: true,
    a: `PRINT-ALL-PAIRS-SHORTEST-PATH(Π, 1, 2): π₁₂ = 3, π₁₃ = 4, π₁₄ = 5, π₁₅ = 1. Utskrift på vei tilbake fra rekursjonen: ${path.join(' → ')}.`,
    b: `Lengden er d₁₂ = ${D[0][1]}: (−4) + 6 + (−5) + 4. Rad i i Π er et korteste-vei-tre med rot i.`});
  return out;
}

const STEPS = buildSteps();

export default () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const hlD = new Map(), hlP = new Map();
  st.changed.forEach(([i, j]) => { hlD.set(`${i},${j}`, C.good); hlP.set(`${i},${j}`, C.good); });
  if (st.k > 0 && !st.print) {
    for (let t = 0; t < n; t += 1) {
      [`${st.k - 1},${t}`, `${t},${st.k - 1}`].forEach(key => { if (!hlD.has(key)) hlD.set(key, C.accent); });
    }
  }
  if (st.print) st.path.slice(1).forEach(j => hlP.set(`0,${j - 1}`, C.cmp));
  const onPath = (u, v) => { const i = st.path.indexOf(u); return i >= 0 && st.path.at(i + 1) === v; };
  return <svg viewBox='0 0 760 520' role='img' aria-label='Floyd-Warshall steg for steg' fontSize='13'>
    <Title title='Floyd-Warshall steg for steg' subtitle='Grafen fra bokas figur 23.1; ett steg per verdi av k (bokas figur 23.4)'/>
    <Controls s={s} N={N} setS={setS}/>
    {E.map(([u, v, w, lt], idx) => {
      const pth = onPath(u, v), viaK = st.k > 0 && !st.print && (u === st.k || v === st.k);
      return <Edge key={idx} p={P[u - 1]} q={P[v - 1]} directed label={fmt(w)} labelT={lt || 0.5} r={18}
        color={pth ? C.cmp : (viaK ? C.accent : C.edge)} width={pth ? 3 : (viaK ? 2 : 1.25)}/>;
    })}
    {LBL.map((v, i) => <Node key={v} x={P[i][0]} y={P[i][1]} r={18} label={v}
      fill={st.k === v && !st.print ? C.accent : 'none'} fillOpacity={st.k === v && !st.print ? 0.25 : 0}/>)}
    <Matrix x={290} y={160} label={`D⁽${'⁰¹²³⁴⁵'.charAt(st.k)}⁾`} data={st.D.map(r => r.map(fmt))} hl={hlD} rowLabels={LBL} colLabels={LBL}/>
    <Matrix x={520} y={160} label={`Π⁽${'⁰¹²³⁴⁵'.charAt(st.k)}⁾`} data={st.Pi.map(r => r.map(v => (v === null ? 'NIL' : v)))} hl={hlP} rowLabels={LBL} colLabels={LBL} size={11}/>
    <text x='290' y='310' fontSize='12' fill={C.quiet}>Grønn = forbedret i denne runden. Blå = rad og kolonne k, som brukes i formelen.</text>
    <text x='290' y='330' fontSize='12' fill={C.quiet}>{st.print ? 'Oransje i Π: forgjengerne som følges i rad 1.' : `dᵢⱼ⁽ᵏ⁾ = min(dᵢⱼ⁽ᵏ⁻¹⁾, dᵢₖ⁽ᵏ⁻¹⁾ + dₖⱼ⁽ᵏ⁻¹⁾)`}</text>
    <Explain y={410} a={st.a} b={st.b}/>
  </svg>;
};
