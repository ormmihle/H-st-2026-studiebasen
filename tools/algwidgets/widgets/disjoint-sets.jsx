const {C, Controls, Title, Explain, Node, Pseudo, Edge} = window.AlgLib;

const ELEMS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const LINK_CODE = [
  'LINK(x, y)',
  '1  if x.rank > y.rank',
  '2      y.p = x',
  '3  else x.p = y',
  '4      if x.rank == y.rank',
  '5          y.rank = y.rank + 1',
];
const FIND_CODE = [
  'FIND-SET(x)',
  '1  if x ≠ x.p',
  '2      x.p = FIND-SET(x.p)',
  '3  return x.p',
];
// Linjer i FIND-SET lagres som 11, 12, 13 for å skille dem fra LINK.
const FIND = n => n + 10;

function buildSteps() {
  const p = new Map(), rank = new Map(), out = [];
  const snap = o => out.push({hl: [], path: [], code: [], ...o, p: new Map(p), rank: new Map(rank)});
  ELEMS.forEach(x => { p.set(x, x); rank.set(x, 0); });
  snap({a: 'MAKE-SET for hver av a–h: hvert element er sin egen mengde, med x.p = x og x.rank = 0.', b: 'Hver mengde er et tre. Roten er representanten og peker på seg selv.'});
  const findPath = x => { const path = [x]; while (p.get(path.at(-1)) !== path.at(-1)) path.push(p.get(path.at(-1))); return path; };
  const find = (x, label) => {
    const path = findPath(x), root = path.at(-1);
    const changed = path.slice(0, -1).filter(v => p.get(v) !== root);
    path.slice(0, -1).forEach(v => p.set(v, root));
    snap({hl: [x, root], path, code: [FIND(1), FIND(2), FIND(3)], a: `${label}FIND-SET(${x}) går stien ${path.join(' → ')} og returnerer roten ${root}.`,
      b: changed.length > 0 ? `Stikomprimering: ${changed.join(', ')} peker nå rett på ${root}. Rangene endres ikke, så rang er bare en øvre grense for høyden.` : 'Ingen noder å komprimere: alle på stien peker allerede på roten.'});
    return root;
  };
  const link = (x, y) => {
    if (rank.get(x) > rank.get(y)) {
      p.set(y, x);
      snap({hl: [x, y], code: [1, 2], a: `LINK(${x}, ${y}): ${x}.rank = ${rank.get(x)} > ${y}.rank = ${rank.get(y)}, så ${y} henges under ${x}.`, b: 'Union by rank: roten med lavest rang blir barn. Da vokser ikke høyden.'});
    } else {
      p.set(x, y);
      const eq = rank.get(x) === rank.get(y);
      if (eq) rank.set(y, rank.get(y) + 1);
      snap({hl: [x, y], code: eq ? [1, 3, 4, 5] : [1, 3], a: `LINK(${x}, ${y}): ${x}.rank = ${rank.get(x)} ${eq ? '=' : '<'} ${y}.rank${eq ? ' før økningen' : ` = ${rank.get(y)}`}, så ${x} henges under ${y}${eq ? `, og ${y}.rank øker til ${rank.get(y)}` : ''}.`,
        b: eq ? 'Like ranger: det nye treet kan bli én høyere, så rangen til den nye roten økes.' : 'Den laveste rangen henges under, så rangen til roten er uendret.'});
    }
  };
  const union = (x, y, simple) => {
    if (simple) {
      // Begge er røtter; FIND-SET returnerer dem selv uten arbeid.
      link(x, y);
      out.at(-1).a = `UNION(${x}, ${y}) = LINK(FIND-SET(${x}), FIND-SET(${y})) = ${out.at(-1).a}`;
      return;
    }
    const rx = find(x, `UNION(${x}, ${y}), del 1: `);
    const ry = find(y, `UNION(${x}, ${y}), del 2: `);
    link(rx, ry);
  };
  union('a', 'b', true);
  union('c', 'd', true);
  union('a', 'c');
  union('e', 'f', true);
  union('g', 'h', true);
  union('e', 'g');
  union('a', 'e');
  find('b', '');
  out.at(-1).b += ' Neste FIND-SET(b) tar bare ett steg.';
  find('c', '');
  return out;
}

// Plasserer skogen: hvert tre får bredde etter antall løvnoder.
function layout(p) {
  const kids = new Map(ELEMS.map(x => [x, []]));
  const roots = [];
  ELEMS.forEach(x => { if (p.get(x) === x) roots.push(x); else kids.get(p.get(x)).push(x); });
  const width = x => (kids.get(x).length === 0 ? 1 : kids.get(x).reduce((s, c) => s + width(c), 0));
  const pos = new Map();
  const place = (x, left, depth) => {
    const w = width(x);
    pos.set(x, [left + (w * 54) / 2, 200 + depth * 64]);
    let l = left;
    kids.get(x).forEach(c => { place(c, l, depth + 1); l += width(c) * 54; });
  };
  let left = 30;
  roots.forEach(r => { place(r, left, 0); left += width(r) * 54 + 6; });
  return pos;
}

const STEPS = buildSteps();

export default () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const pos = layout(st.p);
  return <svg viewBox='0 0 760 520' role='img' aria-label='Disjunkte mengder steg for steg' fontSize='13'>
    <Title title='Disjunkte mengder som skog' subtitle='Union by rank og stikomprimering; tallet ved hver node er rangen'/>
    <Controls s={s} N={N} setS={setS}/>
    <text x='24' y='140' fontSize='12' fill={C.quiet}>Pilene er foreldrepekere x.p. Røttene (med løkke) er representantene.</text>
    {ELEMS.filter(x => st.p.get(x) !== x).map(x => {
      const onPath = st.path.includes(x);
      return <Edge key={`e${x}`} p={pos.get(x)} q={pos.get(st.p.get(x))} directed color={onPath ? C.cmp : C.edge} width={onPath ? 2.5 : 1.25}/>;
    })}
    {ELEMS.filter(x => st.p.get(x) === x).map(x => {
      const [cx, cy] = pos.get(x);
      return <path key={`l${x}`} d={`M${cx - 8},${cy - 18} C${cx - 16},${cy - 48} ${cx + 16},${cy - 48} ${cx + 8},${cy - 18}`} fill='none' stroke={C.edge} strokeWidth='1.25'/>;
    })}
    {ELEMS.map(x => {
      const [cx, cy] = pos.get(x), on = st.hl.includes(x), root = st.p.get(x) === x;
      return <g key={x}>
        <Node x={cx} y={cy} label={x} fill={root ? C.accent : 'none'} fillOpacity={root ? 0.15 : 0} stroke={on ? C.cmp : C.edge} strokeWidth={on ? 3 : 1.25}/>
        <text x={cx + 23} y={cy + 4} fontSize='11' fill={C.quiet}>{st.rank.get(x)}</text>
      </g>;
    })}
    <Pseudo x={500} y={140} lines={LINK_CODE} active={st.code.filter(n => n < 10)} w={250}/>
    <Pseudo x={500} y={260} lines={FIND_CODE} active={st.code.filter(n => n > 10).map(n => n - 10)} w={250}/>
    <Explain y={450} a={st.a} b={st.b}/>
  </svg>;
};
