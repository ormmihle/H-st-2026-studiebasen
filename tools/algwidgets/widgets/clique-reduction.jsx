const {C, Controls, Title, Explain, Node, PALETTE} = window.AlgLib;

// 3-CNF-SAT ≤p CLIQUE for formelen i bokas figur 34.14:
// φ = (x₁ ∨ ¬x₂ ∨ ¬x₃) ∧ (¬x₁ ∨ x₂ ∨ x₃) ∧ (x₁ ∨ x₂ ∨ x₃)
// Hver node: [klausul, variabel, negert, x, y]
const VS = [
  [1, 1, false, 230, 170], [1, 2, true, 310, 170], [1, 3, true, 390, 170],
  [2, 1, true, 120, 240], [2, 2, false, 120, 300], [2, 3, false, 120, 360],
  [3, 1, false, 500, 240], [3, 2, false, 500, 300], [3, 3, false, 500, 360],
];
const SUB = ['', '₁', '₂', '₃'];
const lit = v => `${v[2] ? '¬' : ''}x${SUB[v[1]]}`;
const EDGES = [];
VS.forEach((a, i) => VS.forEach((b, j) => {
  if (i < j && a[0] !== b[0] && !(a[1] === b[1] && a[2] !== b[2])) EDGES.push([i, j]);
}));
const CLIQUE = [1, 5, 8]; // ¬x₂ fra C₁, x₃ fra C₂, x₃ fra C₃

const STEPS = [
  {show: 'nodes', a: 'Formelen φ har k = 3 klausuler. Lag én node per literal i hver klausul, gruppert per klausul (C₁ øverst, C₂ til venstre, C₃ til høyre).',
    b: 'Målet er en graf G og et tall k slik at φ er tilfredsstillbar hvis og bare hvis G har en klikk med k noder.'},
  {show: 'edges', a: `Legg inn en kant mellom to noder hvis de er i ulike klausuler og literalene er konsistente, altså ikke x og ¬x. Her gir det ${EDGES.length} kanter.`,
    b: 'Ingen kanter innenfor en klausul, og ingen mellom en variabel og dens negasjon. Konstruksjonen tar polynomisk tid.'},
  {show: 'edges', missing: [0, 3], a: 'Eksempel på en manglende kant: x₁ i C₁ og ¬x₁ i C₂. Begge kan ikke være sanne samtidig.',
    b: 'Derfor beskriver enhver klikk en tilordning uten selvmotsigelser.'},
  {show: 'clique', a: 'φ er tilfredsstillbar med x₂ = 0 og x₃ = 1 (x₁ kan være hva som helst). Velg én sann literal per klausul: ¬x₂ fra C₁, x₃ fra C₂ og x₃ fra C₃.',
    b: 'De tre nodene er i ulike klausuler og er alle sanne, så ingen par er hverandres negasjon. Alle tre kantene finnes: en klikk med k = 3 noder.'},
  {show: 'clique', a: 'Motsatt: en klikk med k noder må ha én node fra hver klausul (ingen kanter innenfor en klausul). Sett hver valgt literal sann.',
    b: 'Det går, fordi klikken ikke inneholder både x og ¬x. Da har hver klausul en sann literal, så φ er sann. Dermed er CLIQUE NP-hard, og siden den er i NP, NP-komplett.'},
];

export default () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS[s];
  const inC = i => st.show === 'clique' && CLIQUE.includes(i);
  return <svg viewBox='0 0 760 520' role='img' aria-label='Reduksjon fra 3-CNF-SAT til CLIQUE' fontSize='13'>
    <Title title='3-CNF-SAT ≤p CLIQUE' subtitle='φ = (x₁ ∨ ¬x₂ ∨ ¬x₃) ∧ (¬x₁ ∨ x₂ ∨ x₃) ∧ (x₁ ∨ x₂ ∨ x₃), som i bokas figur 34.14'/>
    <Controls s={s} N={N} setS={setS}/>
    {st.show !== 'nodes' ? EDGES.map(([i, j], k) => {
      const a = VS[i], b = VS[j], on = inC(i) && inC(j);
      return <line key={k} x1={a[3]} y1={a[4]} x2={b[3]} y2={b[4]} stroke={on ? C.good : C.edge} strokeWidth={on ? 3.5 : 0.9} opacity={st.show === 'clique' && !on ? 0.35 : 1}/>;
    }) : null}
    {st.missing ? <line x1={VS[st.missing[0]][3]} y1={VS[st.missing[0]][4]} x2={VS[st.missing[1]][3]} y2={VS[st.missing[1]][4]} stroke={C.bad} strokeWidth='2.5' strokeDasharray='6 5'/> : null}
    {VS.map((v, i) => {
      const col = PALETTE[v[0] - 1], on = inC(i) || (st.missing && st.missing.includes(i));
      return <g key={i}>
        <circle cx={v[3]} cy={v[4]} r='22' fill='var(--cds-chart-background)'/>
        <Node x={v[3]} y={v[4]} r={22} label={lit(v)} fill={col} fillOpacity={inC(i) ? 0.45 : 0.15}
          stroke={on ? (inC(i) ? C.good : C.bad) : col} strokeWidth={on ? 3 : 1.5}/>
      </g>;
    })}
    <text x='310' y='132' textAnchor='middle' fontSize='12' fontWeight='600' fill={PALETTE[0]}>C₁</text>
    <text x='72' y='305' textAnchor='middle' fontSize='12' fontWeight='600' fill={PALETTE[1]}>C₂</text>
    <text x='548' y='305' textAnchor='middle' fontSize='12' fontWeight='600' fill={PALETTE[2]}>C₃</text>
    <text x='600' y='180' fontSize='12' fill={C.quiet}>Kantregel:</text>
    <text x='600' y='200' fontSize='12' fill={C.quiet}>ulike klausuler og</text>
    <text x='600' y='218' fontSize='12' fill={C.quiet}>ikke x mot ¬x</text>
    <text x='600' y='256' fontSize='12' fill={C.quiet}>k = antall klausuler</text>
    <Explain y={440} a={st.a} b={st.b}/>
  </svg>;
};
