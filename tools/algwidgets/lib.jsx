// Felles byggeklosser for figurene fra F9 og utover. Bygges inn først i
// algwidgets.js og er tilgjengelig som window.AlgLib i hver figur.

const C = {
  ink: 'var(--cds-text-primary)',
  quiet: 'var(--cds-text-secondary)',
  edge: 'var(--cds-chart-axis)',
  tint: 'var(--cds-chart-reference-tint)',
  accent: 'var(--cds-chart-categorical-1)',
  cmp: 'var(--cds-chart-categorical-2)',
  purple: 'var(--cds-chart-categorical-3)',
  olive: 'var(--cds-chart-categorical-4)',
  pink: 'var(--cds-chart-categorical-5)',
  good: 'var(--cds-chart-status-good)',
  bad: 'var(--cds-chart-status-critical)',
};

// Farger til å skille komponenter/mengder fra hverandre.
const PALETTE = [C.accent, C.cmp, C.purple, C.olive, C.pink, C.good, C.bad];

// Bryter en lang tekst i linjer på maks `max` tegn.
function wrap(text, max) {
  const words = String(text).split(' ');
  const lines = [];
  let cur = '';
  words.forEach(w => {
    if (cur.length > 0 && cur.length + 1 + w.length > max) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cur.length > 0 ? `${cur} ${w}` : w;
    }
  });
  if (cur.length > 0) lines.push(cur);
  return lines;
}

// Tekst som brytes over flere linjer.
function Para({x, y, text, max = 112, fill = C.ink, size = 13, lh = 18, weight}) {
  const lines = wrap(text, max);
  return <text x={x} y={y} fill={fill} fontSize={size} fontWeight={weight}>
    {lines.map((l, i) => <tspan key={i} x={x} dy={i === 0 ? 0 : lh}>{l}</tspan>)}
  </text>;
}

function Button({x, y, w, label, onClick, disabled, primary}) {
  return <g onClick={disabled ? undefined : onClick} cursor={disabled ? 'default' : 'pointer'} opacity={disabled ? 0.4 : 1}>
    <rect x={x} y={y} width={w} height='32' rx='8' fill={primary ? C.accent : 'none'} fillOpacity={primary ? 0.12 : 0}
      stroke={primary ? C.accent : C.edge} strokeWidth={primary ? 2 : 1.25}/>
    <text x={x + w / 2} y={y + 21} textAnchor='middle' fontWeight={primary ? 600 : 400} fill={C.ink}>{label}</text>
  </g>;
}

// Stegkontroller. `jump` (valgfri) gir en ekstra knapp som hopper til neste steg der
// jump(st) er sann, for eksempel slutten på en runde.
function Controls({s, N, setS, y = 68, jump, jumpLabel = 'Hele runden ⏭', steps}) {
  const go = d => setS(Math.max(0, Math.min(N - 1, s + d)));
  const doJump = () => {
    let t = Math.min(s + 1, N - 1);
    while (t < N - 1 && !jump(steps.at(t))) t += 1;
    setS(t);
  };
  let x = 24;
  const out = [];
  out.push(<Button key='b' x={x} y={y} w={104} label='◀ Tilbake' onClick={() => go(-1)} disabled={s === 0}/>);
  x += 112;
  out.push(<Button key='n' x={x} y={y} w={104} label='Neste ▶' onClick={() => go(1)} disabled={s === N - 1} primary/>);
  x += 112;
  if (jump) {
    out.push(<Button key='j' x={x} y={y} w={124} label={jumpLabel} onClick={doJump} disabled={s === N - 1}/>);
    x += 132;
  }
  out.push(<Button key='r' x={x} y={y} w={86} label='Til start' onClick={() => setS(0)}/>);
  x += 100;
  out.push(<text key='t' x={x} y={y + 21} fontSize='12' fill={C.quiet}>{`Steg ${s + 1} av ${N}`}</text>);
  return <g>{out}</g>;
}

function Title({title, subtitle}) {
  return <g>
    <text x='24' y='30' fontSize='15' fontWeight='600' fill={C.ink}>{title}</text>
    <text x='24' y='50' fontSize='12' fill={C.quiet}>{subtitle}</text>
  </g>;
}

// Forklaringen nederst: a (hva skjer) og b (hvorfor), hver brutt over to linjer.
function Explain({y, a, b, max = 112}) {
  const la = wrap(a || '', max), lb = wrap(b || '', max);
  return <g>
    <text x='24' y={y} fill={C.ink} fontSize='13'>
      {la.map((l, i) => <tspan key={i} x='24' dy={i === 0 ? 0 : 18}>{l}</tspan>)}
    </text>
    <text x='24' y={y + la.length * 18 + 4} fill={C.quiet} fontSize='13'>
      {lb.map((l, i) => <tspan key={i} x='24' dy={i === 0 ? 0 : 18}>{l}</tspan>)}
    </text>
  </g>;
}

// Forkorter linjestykket mellom to punkter med r i hver ende.
function seg(p, q, r1 = 20, r2 = 20) {
  const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  return [p[0] + ux * r1, p[1] + uy * r1, q[0] - ux * r2, q[1] - uy * r2];
}

// En kant. `bend` > 0 bøyer kanten (brukes for antiparallelle kanter).
function Edge({p, q, directed, label, color = C.edge, width = 1.25, bend = 0, r = 20, dash, labelColor, labelWeight, labelOffset = 0, labelT = 0.5}) {
  const g = seg(p, q, r, r + (directed ? 2 : 0));
  const mx = (g[0] + g[2]) / 2, my = (g[1] + g[3]) / 2;
  const tx0 = g[0] + (g[2] - g[0]) * labelT, ty0 = g[1] + (g[3] - g[1]) * labelT;
  const dx = g[2] - g[0], dy = g[3] - g[1], L = Math.hypot(dx, dy);
  const nx = -dy / L, ny = dx / L;
  const cx = mx + nx * bend, cy = my + ny * bend;
  const d = bend === 0 ? `M${g[0]},${g[1]} L${g[2]},${g[3]}` : `M${g[0]},${g[1]} Q${cx},${cy} ${g[2]},${g[3]}`;
  // Pilspiss
  let head = null;
  if (directed) {
    const tx = bend === 0 ? dx / L : (g[2] - cx), ty = bend === 0 ? dy / L : (g[3] - cy);
    const tl = Math.hypot(tx, ty), ax = tx / tl, ay = ty / tl;
    const hx = g[2], hy = g[3], s = 9;
    head = <path d={`M${hx},${hy} L${hx - ax * s - ay * s * 0.5},${hy - ay * s + ax * s * 0.5} L${hx - ax * s + ay * s * 0.5},${hy - ay * s - ax * s * 0.5} Z`} fill={color}/>;
  }
  const lx = bend === 0 ? tx0 + nx * (12 + labelOffset) : mx + nx * (bend * 0.5 + 12 * Math.sign(bend) + labelOffset);
  const ly = bend === 0 ? ty0 + ny * (12 + labelOffset) : my + ny * (bend * 0.5 + 12 * Math.sign(bend) + labelOffset);
  return <g>
    <path d={d} fill='none' stroke={color} strokeWidth={width} strokeDasharray={dash}/>
    {head}
    {label !== undefined && label !== null ? <g>
      <rect x={lx - 4 - String(label).length * 3.6} y={ly - 9} width={8 + String(label).length * 7.2} height='16' rx='3' fill='var(--cds-chart-background)' fillOpacity='0.85'/>
      <text x={lx} y={ly + 4} textAnchor='middle' fontSize='12' fill={labelColor || C.ink} fontWeight={labelWeight}>{label}</text>
    </g> : null}
  </g>;
}

function Node({x, y, label, r = 20, fill = 'none', fillOpacity = 0, stroke = C.edge, strokeWidth = 1.25, textFill = C.ink, sub, subDy = -28, subFill = C.quiet}) {
  return <g>
    <circle cx={x} cy={y} r={r} fill={fill} fillOpacity={fillOpacity} stroke={stroke} strokeWidth={strokeWidth}/>
    <text x={x} y={y + 5} textAnchor='middle' fontSize='14' fontWeight='600' fill={textFill}>{label}</text>
    {sub !== undefined && sub !== null ? <text x={x} y={y + subDy} textAnchor='middle' fontSize='12' fill={subFill}>{sub}</text> : null}
  </g>;
}

// Pseudokode med markert linje. lines = ['MST-PRIM(G, w, r)', '1  for ...', ...]
function Pseudo({x, y, lines, active = [], lh = 17, w = 300, size = 12}) {
  return <g>
    {lines.map((l, i) => {
      const n = parseInt(l, 10);
      const on = !Number.isNaN(n) && active.includes(n);
      return <g key={i}>
        {on ? <rect x={x - 4} y={y + i * lh - 12} width={w} height={lh} rx='3' fill={C.accent} fillOpacity='0.16'/> : null}
        <text x={x} y={y + i * lh} fontSize={size} fill={i === 0 ? C.ink : (on ? C.ink : C.quiet)} fontWeight={i === 0 || on ? 600 : 400}
          fontFamily='var(--md-code-font-family, monospace)' style={{whiteSpace: 'pre'}}>{l}</text>
      </g>;
    })}
  </g>;
}

// Matrise med overskrift. hl: Map fra 'i,j' til farge.
function Matrix({x, y, data, label, hl = new Map(), cw = 34, ch = 22, rowLabels, colLabels, size = 12}) {
  const n = data.length, m = data[0].length;
  return <g>
    <text x={x} y={y - 10} fontSize='12' fontWeight='600' fill={C.ink}>{label}</text>
    {colLabels ? colLabels.map((c, j) => <text key={`c${j}`} x={x + 22 + j * cw + cw / 2} y={y + 4} textAnchor='middle' fontSize='11' fill={C.quiet}>{c}</text>) : null}
    {data.map((row, i) => <g key={i}>
      {rowLabels ? <text x={x + 10} y={y + 10 + (i + 1) * ch - 6} textAnchor='middle' fontSize='11' fill={C.quiet}>{rowLabels[i]}</text> : null}
      {row.map((v, j) => {
        const k = `${i},${j}`, c = hl.get(k);
        return <g key={j}>
          <rect x={x + 22 + j * cw} y={y + 10 + i * ch} width={cw} height={ch} fill={c || 'none'} fillOpacity={c ? 0.2 : 0} stroke={C.edge} strokeWidth='0.75'/>
          <text x={x + 22 + j * cw + cw / 2} y={y + 10 + i * ch + 15} textAnchor='middle' fontSize={size} fill={C.ink} fontWeight={c ? 600 : 400}>{v}</text>
        </g>;
      })}
    </g>)}
  </g>;
}

function Legend({x, y, items}) {
  let cx = x;
  return <g>{items.map((it, i) => {
    const el = <g key={i}>
      {it.line ? <line x1={cx} y1={y - 4} x2={cx + 18} y2={y - 4} stroke={it.color} strokeWidth={it.width || 3} strokeDasharray={it.dash}/>
        : <circle cx={cx + 7} cy={y - 4} r='7' fill={it.color} fillOpacity={it.opacity === undefined ? 0.25 : it.opacity} stroke={it.stroke || C.edge}/>}
      <text x={cx + 24} y={y} fontSize='12' fill={C.quiet}>{it.label}</text>
    </g>;
    cx += 30 + it.label.length * 6.6;
    return el;
  })}</g>;
}

const INF = '∞';
const fmt = v => (v === Infinity ? INF : (v === -Infinity ? '−∞' : String(v).replace('-', '−')));

return {C, PALETTE, wrap, Para, Button, Controls, Title, Explain, seg, Edge, Node, Pseudo, Matrix, Legend, INF, fmt};
