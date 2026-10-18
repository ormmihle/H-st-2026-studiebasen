window.AlgWidgets = window.AlgWidgets || {};
window.AlgLib = (function(){ const C = {
  ink: "var(--cds-text-primary)",
  quiet: "var(--cds-text-secondary)",
  edge: "var(--cds-chart-axis)",
  tint: "var(--cds-chart-reference-tint)",
  accent: "var(--cds-chart-categorical-1)",
  cmp: "var(--cds-chart-categorical-2)",
  purple: "var(--cds-chart-categorical-3)",
  olive: "var(--cds-chart-categorical-4)",
  pink: "var(--cds-chart-categorical-5)",
  good: "var(--cds-chart-status-good)",
  bad: "var(--cds-chart-status-critical)"
};
const PALETTE = [C.accent, C.cmp, C.purple, C.olive, C.pink, C.good, C.bad];
function wrap(text, max) {
  const words = String(text).split(" ");
  const lines = [];
  let cur = "";
  words.forEach((w) => {
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
function Para({ x, y, text, max = 112, fill = C.ink, size = 13, lh = 18, weight }) {
  const lines = wrap(text, max);
  return /* @__PURE__ */ React.createElement("text", { x, y, fill, fontSize: size, fontWeight: weight }, lines.map((l, i) => /* @__PURE__ */ React.createElement("tspan", { key: i, x, dy: i === 0 ? 0 : lh }, l)));
}
function Button({ x, y, w, label, onClick, disabled, primary }) {
  return /* @__PURE__ */ React.createElement("g", { onClick: disabled ? void 0 : onClick, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1 }, /* @__PURE__ */ React.createElement(
    "rect",
    {
      x,
      y,
      width: w,
      height: "32",
      rx: "8",
      fill: primary ? C.accent : "none",
      fillOpacity: primary ? 0.12 : 0,
      stroke: primary ? C.accent : C.edge,
      strokeWidth: primary ? 2 : 1.25
    }
  ), /* @__PURE__ */ React.createElement("text", { x: x + w / 2, y: y + 21, textAnchor: "middle", fontWeight: primary ? 600 : 400, fill: C.ink }, label));
}
function Controls({ s, N, setS, y = 68, jump, jumpLabel = "Hele runden \u23ED", steps }) {
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const doJump = () => {
    let t = Math.min(s + 1, N - 1);
    while (t < N - 1 && !jump(steps.at(t))) t += 1;
    setS(t);
  };
  let x = 24;
  const out = [];
  out.push(/* @__PURE__ */ React.createElement(Button, { key: "b", x, y, w: 104, label: "\u25C0 Tilbake", onClick: () => go(-1), disabled: s === 0 }));
  x += 112;
  out.push(/* @__PURE__ */ React.createElement(Button, { key: "n", x, y, w: 104, label: "Neste \u25B6", onClick: () => go(1), disabled: s === N - 1, primary: true }));
  x += 112;
  if (jump) {
    out.push(/* @__PURE__ */ React.createElement(Button, { key: "j", x, y, w: 124, label: jumpLabel, onClick: doJump, disabled: s === N - 1 }));
    x += 132;
  }
  out.push(/* @__PURE__ */ React.createElement(Button, { key: "r", x, y, w: 86, label: "Til start", onClick: () => setS(0) }));
  x += 100;
  out.push(/* @__PURE__ */ React.createElement("text", { key: "t", x, y: y + 21, fontSize: "12", fill: C.quiet }, `Steg ${s + 1} av ${N}`));
  return /* @__PURE__ */ React.createElement("g", null, out);
}
function Title({ title, subtitle }) {
  return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("text", { x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: C.ink }, title), /* @__PURE__ */ React.createElement("text", { x: "24", y: "50", fontSize: "12", fill: C.quiet }, subtitle));
}
function Explain({ y, a, b, max = 112 }) {
  const la = wrap(a || "", max), lb = wrap(b || "", max);
  return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("text", { x: "24", y, fill: C.ink, fontSize: "13" }, la.map((l, i) => /* @__PURE__ */ React.createElement("tspan", { key: i, x: "24", dy: i === 0 ? 0 : 18 }, l))), /* @__PURE__ */ React.createElement("text", { x: "24", y: y + la.length * 18 + 4, fill: C.quiet, fontSize: "13" }, lb.map((l, i) => /* @__PURE__ */ React.createElement("tspan", { key: i, x: "24", dy: i === 0 ? 0 : 18 }, l))));
}
function seg(p, q, r1 = 20, r2 = 20) {
  const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  return [p[0] + ux * r1, p[1] + uy * r1, q[0] - ux * r2, q[1] - uy * r2];
}
function Edge({ p, q, directed, label, color = C.edge, width = 1.25, bend = 0, r = 20, dash, labelColor, labelWeight, labelOffset = 0, labelT = 0.5 }) {
  const g = seg(p, q, r, r + (directed ? 2 : 0));
  const mx = (g[0] + g[2]) / 2, my = (g[1] + g[3]) / 2;
  const tx0 = g[0] + (g[2] - g[0]) * labelT, ty0 = g[1] + (g[3] - g[1]) * labelT;
  const dx = g[2] - g[0], dy = g[3] - g[1], L = Math.hypot(dx, dy);
  const nx = -dy / L, ny = dx / L;
  const cx = mx + nx * bend, cy = my + ny * bend;
  const d = bend === 0 ? `M${g[0]},${g[1]} L${g[2]},${g[3]}` : `M${g[0]},${g[1]} Q${cx},${cy} ${g[2]},${g[3]}`;
  let head = null;
  if (directed) {
    const tx = bend === 0 ? dx / L : g[2] - cx, ty = bend === 0 ? dy / L : g[3] - cy;
    const tl = Math.hypot(tx, ty), ax = tx / tl, ay = ty / tl;
    const hx = g[2], hy = g[3], s = 9;
    head = /* @__PURE__ */ React.createElement("path", { d: `M${hx},${hy} L${hx - ax * s - ay * s * 0.5},${hy - ay * s + ax * s * 0.5} L${hx - ax * s + ay * s * 0.5},${hy - ay * s - ax * s * 0.5} Z`, fill: color });
  }
  const lx = bend === 0 ? tx0 + nx * (12 + labelOffset) : mx + nx * (bend * 0.5 + 12 * Math.sign(bend) + labelOffset);
  const ly = bend === 0 ? ty0 + ny * (12 + labelOffset) : my + ny * (bend * 0.5 + 12 * Math.sign(bend) + labelOffset);
  return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("path", { d, fill: "none", stroke: color, strokeWidth: width, strokeDasharray: dash }), head, label !== void 0 && label !== null ? /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("rect", { x: lx - 4 - String(label).length * 3.6, y: ly - 9, width: 8 + String(label).length * 7.2, height: "16", rx: "3", fill: "var(--cds-chart-background)", fillOpacity: "0.85" }), /* @__PURE__ */ React.createElement("text", { x: lx, y: ly + 4, textAnchor: "middle", fontSize: "12", fill: labelColor || C.ink, fontWeight: labelWeight }, label)) : null);
}
function Node({ x, y, label, r = 20, fill = "none", fillOpacity = 0, stroke = C.edge, strokeWidth = 1.25, textFill = C.ink, sub, subDy = -28, subFill = C.quiet }) {
  return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y, r, fill, fillOpacity, stroke, strokeWidth }), /* @__PURE__ */ React.createElement("text", { x, y: y + 5, textAnchor: "middle", fontSize: "14", fontWeight: "600", fill: textFill }, label), sub !== void 0 && sub !== null ? /* @__PURE__ */ React.createElement("text", { x, y: y + subDy, textAnchor: "middle", fontSize: "12", fill: subFill }, sub) : null);
}
function Pseudo({ x, y, lines, active = [], lh = 17, w = 300, size = 12 }) {
  return /* @__PURE__ */ React.createElement("g", null, lines.map((l, i) => {
    const n = parseInt(l, 10);
    const on = !Number.isNaN(n) && active.includes(n);
    return /* @__PURE__ */ React.createElement("g", { key: i }, on ? /* @__PURE__ */ React.createElement("rect", { x: x - 4, y: y + i * lh - 12, width: w, height: lh, rx: "3", fill: C.accent, fillOpacity: "0.16" }) : null, /* @__PURE__ */ React.createElement(
      "text",
      {
        x,
        y: y + i * lh,
        fontSize: size,
        fill: i === 0 ? C.ink : on ? C.ink : C.quiet,
        fontWeight: i === 0 || on ? 600 : 400,
        fontFamily: "var(--md-code-font-family, monospace)",
        style: { whiteSpace: "pre" }
      },
      l
    ));
  }));
}
function Matrix({ x, y, data, label, hl = /* @__PURE__ */ new Map(), cw = 34, ch = 22, rowLabels, colLabels, size = 12 }) {
  const n = data.length, m = data[0].length;
  return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("text", { x, y: y - 10, fontSize: "12", fontWeight: "600", fill: C.ink }, label), colLabels ? colLabels.map((c, j) => /* @__PURE__ */ React.createElement("text", { key: `c${j}`, x: x + 22 + j * cw + cw / 2, y: y + 4, textAnchor: "middle", fontSize: "11", fill: C.quiet }, c)) : null, data.map((row, i) => /* @__PURE__ */ React.createElement("g", { key: i }, rowLabels ? /* @__PURE__ */ React.createElement("text", { x: x + 10, y: y + 10 + (i + 1) * ch - 6, textAnchor: "middle", fontSize: "11", fill: C.quiet }, rowLabels[i]) : null, row.map((v, j) => {
    const k = `${i},${j}`, c = hl.get(k);
    return /* @__PURE__ */ React.createElement("g", { key: j }, /* @__PURE__ */ React.createElement("rect", { x: x + 22 + j * cw, y: y + 10 + i * ch, width: cw, height: ch, fill: c || "none", fillOpacity: c ? 0.2 : 0, stroke: C.edge, strokeWidth: "0.75" }), /* @__PURE__ */ React.createElement("text", { x: x + 22 + j * cw + cw / 2, y: y + 10 + i * ch + 15, textAnchor: "middle", fontSize: size, fill: C.ink, fontWeight: c ? 600 : 400 }, v));
  }))));
}
function Legend({ x, y, items }) {
  let cx = x;
  return /* @__PURE__ */ React.createElement("g", null, items.map((it, i) => {
    const el = /* @__PURE__ */ React.createElement("g", { key: i }, it.line ? /* @__PURE__ */ React.createElement("line", { x1: cx, y1: y - 4, x2: cx + 18, y2: y - 4, stroke: it.color, strokeWidth: it.width || 3, strokeDasharray: it.dash }) : /* @__PURE__ */ React.createElement("circle", { cx: cx + 7, cy: y - 4, r: "7", fill: it.color, fillOpacity: it.opacity === void 0 ? 0.25 : it.opacity, stroke: it.stroke || C.edge }), /* @__PURE__ */ React.createElement("text", { x: cx + 24, y, fontSize: "12", fill: C.quiet }, it.label));
    cx += 30 + it.label.length * 6.6;
    return el;
  }));
}
const INF = "\u221E";
const fmt = (v) => v === Infinity ? INF : v === -Infinity ? "\u2212\u221E" : String(v).replace("-", "\u2212");
return { C, PALETTE, wrap, Para, Button, Controls, Title, Explain, seg, Edge, Node, Pseudo, Matrix, Legend, INF, fmt };
 })();
window.AlgWidgets["activity-selection"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", grid = "var(--cds-chart-grid)", accent = "var(--cds-chart-categorical-1)", cmpc = "var(--cds-chart-categorical-2)", good = "var(--cds-chart-status-good)", bad = "var(--cds-chart-status-critical)";
  const S = [1, 3, 0, 5, 3, 5, 6, 7, 8, 2, 12], F = [4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16];
  const steps = (() => {
    const out = [], chosen = [1], rej = [];
    let k = 1;
    out.push({ m: 1, k, chosen: chosen.slice(), rej: rej.slice(), a: "Linje 1\u20132: aktivitetene er sortert p\xE5 sluttid. a1 slutter f\xF8rst og velges alltid: A = {a1}, k = 1.", b: "Gr\xE5dig valg: aktiviteten som slutter tidligst, etterlater mest tid til resten." });
    for (let m = 2; m <= 11; m += 1) {
      const sm = S.at(m - 1), fk = F.at(k - 1);
      if (sm >= fk) {
        chosen.push(m);
        out.push({ m, k, chosen: chosen.slice(), rej: rej.slice(), a: `m = ${m}: s${m} = ${sm} \u2265 f${k} = ${fk}, s\xE5 a${m} er kompatibel og velges. k = ${m}.`, b: `a${m} er den f\xF8rste ledige aktiviteten etter a${k} som slutter tidligst, fordi listen er sortert p\xE5 sluttid.` });
        k = m;
      } else {
        rej.push(m);
        out.push({ m, k, chosen: chosen.slice(), rej: rej.slice(), a: `m = ${m}: s${m} = ${sm} < f${k} = ${fk}, s\xE5 a${m} overlapper a${k} og forkastes.`, b: "Linje 4: bare starttiden til a\u2098 og sluttiden til sist valgte aktivitet sammenlignes." });
      }
    }
    out.push({ m: 12, k, chosen: chosen.slice(), rej: rej.slice(), a: `Ferdig: A = {${chosen.map((i) => "a" + i).join(", ")}}, med ${chosen.length} aktiviteter.`, b: "Hver aktivitet ble sett p\xE5 \xE9n gang: \u0398(n) n\xE5r input er sortert." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const tx = (t) => 140 + t * 35, ry = (i) => 128 + (i - 1) * 22;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const ticks = [0, 2, 4, 6, 8, 10, 12, 14, 16];
  const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 470", role: "img", "aria-label": "Aktivitetsutvelgelse steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Greedy-Activity-Selector steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Elleve aktiviteter fra bokas figur 15.1, sortert p\xE5 sluttid"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "time-axis" }, ticks.map((t) => /* @__PURE__ */ React.createElement("g", { key: `t${t}` }, /* @__PURE__ */ React.createElement("line", { x1: tx(t), x2: tx(t), y1: "116", y2: "370", stroke: grid }), /* @__PURE__ */ React.createElement("text", { x: tx(t), y: "388", textAnchor: "middle", fontSize: "11.5", fill: quiet }, t))), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "axis-title", x: "718", y: "388", fontSize: "11.5", fill: quiet }, "tid")), /* @__PURE__ */ React.createElement("line", { x1: tx(F.at(st.k - 1)), x2: tx(F.at(st.k - 1)), y1: "116", y2: "370", stroke: accent, strokeWidth: "1.5", strokeDasharray: "4 4" }), /* @__PURE__ */ React.createElement("text", { x: tx(F.at(st.k - 1)) + 4, y: "112", fontSize: "11.5", fill: accent }, `f${st.k} = ${F.at(st.k - 1)}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "activities" }, ids.map((i) => {
    const ch = st.chosen.includes(i), rj = st.rej.includes(i), cur = i === st.m, fut = i > st.m;
    const col = ch ? good : cur ? cmpc : rj ? bad : edge;
    return /* @__PURE__ */ React.createElement("g", { key: `a${i}` }, /* @__PURE__ */ React.createElement("text", { x: "24", y: ry(i) + 14, fontSize: "12", fontWeight: cur ? 600 : 400, fill: ink }, `a${i}`), /* @__PURE__ */ React.createElement("text", { x: "60", y: ry(i) + 14, fontSize: "11.5", fill: quiet }, `[${S.at(i - 1)}, ${F.at(i - 1)})`), /* @__PURE__ */ React.createElement("rect", { x: tx(S.at(i - 1)), y: ry(i) + 2, width: (F.at(i - 1) - S.at(i - 1)) * 35, height: "16", rx: "4", fill: col, fillOpacity: fut ? 0.06 : rj ? 0.12 : 0.25, stroke: col, strokeWidth: cur || ch ? 2 : 1, strokeDasharray: rj ? "3 3" : "none" }));
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "legend" }, /* @__PURE__ */ React.createElement("rect", { x: "140", y: "398", width: "16", height: "12", fill: good, fillOpacity: "0.25", stroke: good, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-chosen", x: "162", y: "408", fontSize: "12", fill: quiet }, "valgt"), /* @__PURE__ */ React.createElement("rect", { x: "220", y: "398", width: "16", height: "12", fill: bad, fillOpacity: "0.12", stroke: bad, strokeWidth: "1", strokeDasharray: "3 3" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-rej", x: "242", y: "408", fontSize: "12", fill: quiet }, "forkastet"), /* @__PURE__ */ React.createElement("rect", { x: "316", y: "398", width: "16", height: "12", fill: cmpc, fillOpacity: "0.25", stroke: cmpc, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-cur", x: "338", y: "408", fontSize: "12", fill: quiet }, "vurderes n\xE5"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-line", x: "440", y: "408", fontSize: "12", fill: quiet }, "stiplet linje: sluttid for sist valgte")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "438", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "460", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["bellman-ford"] = (function(){ const { C, Controls, Title, Explain, Node, Edge, Pseudo, fmt } = window.AlgLib;
const V = ["s", "t", "x", "y", "z"];
const P = /* @__PURE__ */ new Map([["s", [70, 250]], ["t", [220, 160]], ["x", [420, 160]], ["y", [220, 340]], ["z", [420, 340]]]);
const E = [["t", "x", 5, 14], ["t", "y", 8, 0], ["t", "z", -4, 0, 0.25], ["x", "t", -2, 14], ["y", "x", -3, 0, 0.25], ["y", "z", 9, 0], ["z", "x", 7, 0], ["z", "s", 2, 40], ["s", "t", 6, 0], ["s", "y", 7, 0]];
const CODE = [
  "BELLMAN-FORD(G, w, s)",
  "1  INITIALIZE-SINGLE-SOURCE(G, s)",
  "2  for i = 1 to |G.V| \u2212 1",
  "3    for each edge (u, v) \u2208 G.E",
  "4      RELAX(u, v, w)",
  "5  for each edge (u, v) \u2208 G.E",
  "6    if v.d > u.d + w(u, v)",
  "7      return FALSE",
  "8  return TRUE"
];
function buildSteps() {
  const d = new Map(V.map((v) => [v, Infinity])), pi = new Map(V.map((v) => [v, null])), out = [];
  d.set("s", 0);
  const snap = (o) => out.push({ cur: -1, pass: 0, changed: null, endPass: false, ...o, d: new Map(d), pi: new Map(pi) });
  snap({ code: [1], a: "Linje 1: INITIALIZE-SINGLE-SOURCE gir s.d = 0 og v.d = \u221E, v.\u03C0 = NIL for alle andre.", b: "Kantene relakseres i rekkef\xF8lgen (t,x), (t,y), (t,z), (x,t), (y,x), (y,z), (z,x), (z,s), (s,t), (s,y), som i boka." });
  for (let i = 1; i <= V.length - 1; i += 1) {
    E.forEach(([u, v, w], k) => {
      const before = d.get(v), cand = d.get(u) + w;
      let a, b, changed = null;
      if (cand < before) {
        d.set(v, cand);
        pi.set(v, u);
        changed = v;
        a = `Runde ${i}: RELAX(${u}, ${v}): ${v}.d = ${fmt(before)} > ${u}.d + w = ${fmt(d.get(u))} + ${fmt(w)} = ${fmt(cand)}, s\xE5 ${v}.d = ${fmt(cand)} og ${v}.\u03C0 = ${u}.`;
        b = "Estimatet blir bedre. Det er aldri lavere enn den sanne avstanden \u03B4(s, v) (\xF8vre grense-egenskapen).";
      } else {
        a = `Runde ${i}: RELAX(${u}, ${v}): ${v}.d = ${fmt(before)} \u2264 ${u}.d + w = ${fmt(d.get(u))} + ${fmt(w)} = ${fmt(cand)}, ingen endring.`;
        b = d.get(u) === Infinity ? `${u}.d er \u221E, s\xE5 kanten kan ikke forbedre noe enn\xE5.` : "Kanten gir ingen kortere vei til v.";
      }
      const endPass = k === E.length - 1;
      if (endPass) b += ` Etter runde ${i} er alle korteste veier med h\xF8yst ${i} kanter funnet.`;
      snap({ cur: k, pass: i, changed, endPass, code: changed ? [2, 3, 4] : [2, 3, 4], a, b });
    });
  }
  snap({
    code: [5, 6, 8],
    end: true,
    a: "Linje 5\u20138: ingen kant har v.d > u.d + w(u, v), s\xE5 det finnes ingen negativ sykel som kan n\xE5s fra s. Returnerer TRUE.",
    b: "d-verdiene er de korteste avstandene: s 0, t 2, x 4, y 7, z \u22122. De bl\xE5 kantene er korteste-vei-treet."
  });
  return out;
}
const STEPS = buildSteps();
return () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 520", role: "img", "aria-label": "Bellman-Ford steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement(Title, { title: "Bellman-Ford steg for steg", subtitle: "Grafen fra bokas figur 22.4 med kilde s; tallet i noden er v.d" }), /* @__PURE__ */ React.createElement(Controls, { s, N, setS, steps: STEPS, jump: (x) => x.endPass || x.end }), E.map(([u, v, w, bend, lt], k) => {
    const cur = k === st.cur, tree = st.pi.get(v) === u;
    return /* @__PURE__ */ React.createElement(
      Edge,
      {
        key: k,
        p: P.get(u),
        q: P.get(v),
        directed: true,
        bend,
        r: 24,
        label: fmt(w),
        labelT: lt || 0.5,
        color: cur ? C.cmp : tree ? C.accent : C.edge,
        width: cur || tree ? 3 : 1.25
      }
    );
  }), V.map((v) => {
    const [x, y] = P.get(v), ch = v === st.changed;
    return /* @__PURE__ */ React.createElement("g", { key: v }, /* @__PURE__ */ React.createElement(Node, { x, y, r: 24, label: fmt(st.d.get(v)), stroke: ch ? C.good : C.edge, strokeWidth: ch ? 3 : 1.25, fill: ch ? C.good : "none", fillOpacity: ch ? 0.15 : 0 }), /* @__PURE__ */ React.createElement("text", { x, y: y + (y < 200 ? -32 : 44), textAnchor: "middle", fontSize: "13", fontWeight: "600", fill: C.quiet }, v));
  }), /* @__PURE__ */ React.createElement(Pseudo, { x: 500, y: 150, lines: CODE, active: st.code, w: 252 }), /* @__PURE__ */ React.createElement("text", { x: "500", y: "330", fontSize: "12", fill: C.quiet }, st.pass > 0 ? `Runde i = ${st.pass} av ${V.length - 1}` : st.end ? "Sjekk for negative sykler" : "Initialisering"), /* @__PURE__ */ React.createElement("text", { x: "500", y: "352", fontSize: "12", fill: C.quiet }, `\u03C0: ${V.filter((v) => st.pi.get(v)).map((v) => `${v}.\u03C0 = ${st.pi.get(v)}`).join(", ") || "alle NIL"}`), /* @__PURE__ */ React.createElement(Explain, { y: 430, a: st.a, b: st.b }));
};
 })();
window.AlgWidgets["bfs"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", accent = "var(--cds-chart-categorical-1)", grayc = "var(--cds-chart-categorical-4)", good = "var(--cds-chart-status-good)";
  const V = ["r", "s", "t", "u", "v", "w", "x", "y"];
  const P = /* @__PURE__ */ new Map([["r", [150, 170]], ["s", [290, 170]], ["t", [430, 170]], ["u", [570, 170]], ["v", [150, 290]], ["w", [290, 290]], ["x", [430, 290]], ["y", [570, 290]]]);
  const Adj = /* @__PURE__ */ new Map([["r", ["s", "v"]], ["s", ["r", "w"]], ["t", ["u", "w", "x"]], ["u", ["t", "x", "y"]], ["v", ["r"]], ["w", ["s", "t", "x"]], ["x", ["t", "u", "w", "y"]], ["y", ["u", "x"]]]);
  const E = [["r", "s"], ["r", "v"], ["s", "w"], ["t", "w"], ["t", "x"], ["t", "u"], ["w", "x"], ["x", "u"], ["x", "y"], ["u", "y"]];
  const steps = (() => {
    const col = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), pi = /* @__PURE__ */ new Map(), out = [];
    V.forEach((v) => {
      col.set(v, "w");
      d.set(v, -1);
      pi.set(v, null);
    });
    const Q = [];
    const snap = (o) => out.push({ u: null, disc: [], path: [], ...o, col: new Map(col), d: new Map(d), pi: new Map(pi), Q: Q.slice() });
    col.set("s", "g");
    d.set("s", 0);
    Q.push("s");
    snap({ a: "Linje 1\u20139: alle noder er hvite med d = \u221E, unntatt s, som er gr\xE5 med s.d = 0. Q = \u27E8s\u27E9.", b: "Hvit: ikke oppdaget. Gr\xE5: oppdaget, ligger i Q. Svart: ferdig behandlet." });
    while (Q.length > 0) {
      const u = Q.shift();
      const disc = [];
      Adj.get(u).forEach((v) => {
        if (col.get(v) === "w") {
          col.set(v, "g");
          d.set(v, d.get(u) + 1);
          pi.set(v, u);
          Q.push(v);
          disc.push(v);
        }
      });
      col.set(u, "b");
      snap({ u, disc, a: `Dequeue ${u} (d = ${d.get(u)}). ${disc.length > 0 ? `Hvite naboer oppdages med d = ${d.get(u) + 1} og \u03C0 = ${u}: ${disc.join(", ")}.` : "Ingen hvite naboer."}`, b: `${u} blir svart. Q = \u27E8${Q.join(", ")}\u27E9. Nodene i Q har d-verdier som skiller seg med h\xF8yst 1.` });
    }
    snap({ path: ["s", "w", "x", "y"], a: "Print-Path(G, s, y): f\xF8lg \u03C0 bakover fra y: y.\u03C0 = x, x.\u03C0 = w, w.\u03C0 = s. Utskrift: s w x y.", b: "De uthevede kantene er bredde-f\xF8rst-treet. Stien i treet er en korteste vei, med y.d = 3 kanter." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const seg = (a, b) => {
    const p = P.get(a), q = P.get(b), L = Math.hypot(q.at(0) - p.at(0), q.at(1) - p.at(1)), ux = (q.at(0) - p.at(0)) / L, uy = (q.at(1) - p.at(1)) / L;
    return [p.at(0) + ux * 22, p.at(1) + uy * 22, q.at(0) - ux * 22, q.at(1) - uy * 22];
  };
  const isTree = (a, b) => st.pi.get(b) === a || st.pi.get(a) === b;
  const onPath = (a, b) => {
    const i = st.path.indexOf(a), j = st.path.indexOf(b);
    return i >= 0 && j >= 0 && Math.abs(i - j) === 1;
  };
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 470", role: "img", "aria-label": "BFS steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "BFS steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Urettet graf fra bokas figur 20.3, startnode s; naboer i alfabetisk rekkef\xF8lge"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "edges" }, E.map((e) => {
    const a = e.at(0), b = e.at(1), g = seg(a, b), pth = onPath(a, b), tr = isTree(a, b);
    return /* @__PURE__ */ React.createElement("line", { key: `${a}${b}`, x1: g.at(0), y1: g.at(1), x2: g.at(2), y2: g.at(3), stroke: pth ? good : tr ? accent : edge, strokeWidth: pth || tr ? 3 : 1.25 });
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "nodes" }, V.map((v) => {
    const p = P.get(v), c = st.col.get(v), cur = v === st.u, nw = st.disc.includes(v), dv = st.d.get(v);
    return /* @__PURE__ */ React.createElement("g", { key: v }, /* @__PURE__ */ React.createElement("circle", { cx: p.at(0), cy: p.at(1), r: "22", fill: c === "b" ? ink : c === "g" ? grayc : "none", fillOpacity: c === "b" ? 0.75 : c === "g" ? 0.28 : 0, stroke: cur ? accent : nw ? good : edge, strokeWidth: cur || nw ? 3 : 1.25 }), /* @__PURE__ */ React.createElement("text", { x: p.at(0), y: p.at(1) + 5, textAnchor: "middle", fontSize: "14", fontWeight: "600", fill: c === "b" ? "var(--cds-chart-reference-tint)" : ink }, v), /* @__PURE__ */ React.createElement("text", { x: p.at(0), y: p.at(1) + (p.at(1) < 200 ? -30 : 40), textAnchor: "middle", fontSize: "12", fill: quiet }, dv >= 0 ? `d = ${dv}` : "d = \u221E"));
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "queue" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "q-label", x: "24", y: "372", fontSize: "12", fill: quiet }, "Q (FIFO-k\xF8), hodet f\xF8rst:"), st.Q.map((q, k) => /* @__PURE__ */ React.createElement("g", { key: `q${k}` }, /* @__PURE__ */ React.createElement("rect", { x: 190 + k * 46, y: "354", width: "40", height: "28", rx: "4", fill: grayc, fillOpacity: "0.28", stroke: edge, strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: 210 + k * 46, y: "373", textAnchor: "middle", fontWeight: "600", fill: ink }, q))), /* @__PURE__ */ React.createElement("circle", { cx: "520", cy: "368", r: "7", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-white", x: "532", y: "372", fontSize: "12", fill: quiet }, "hvit"), /* @__PURE__ */ React.createElement("circle", { cx: "580", cy: "368", r: "7", fill: grayc, fillOpacity: "0.28", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-gray", x: "592", y: "372", fontSize: "12", fill: quiet }, "gr\xE5"), /* @__PURE__ */ React.createElement("circle", { cx: "636", cy: "368", r: "7", fill: ink, fillOpacity: "0.75", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-black", x: "648", y: "372", fontSize: "12", fill: quiet }, "svart")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "426", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "448", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["bipartite-matching"] = (function(){ const { C, Controls, Title, Explain, Node, Edge } = window.AlgLib;
const L = ["l1", "l2", "l3", "l4", "l5"], R = ["r1", "r2", "r3", "r4"];
const LBL = { s: "s", t: "t", l1: "l\u2081", l2: "l\u2082", l3: "l\u2083", l4: "l\u2084", l5: "l\u2085", r1: "r\u2081", r2: "r\u2082", r3: "r\u2083", r4: "r\u2084" };
const P = { s: [50, 270], t: [500, 270] };
L.forEach((v, i) => {
  P[v] = [190, 170 + i * 50];
});
R.forEach((v, i) => {
  P[v] = [360, 195 + i * 50];
});
const G = [["l1", "r1"], ["l1", "r2"], ["l2", "r1"], ["l3", "r2"], ["l3", "r3"], ["l3", "r4"], ["l4", "r3"], ["l5", "r3"]];
const E = L.map((l) => ["s", l]).concat(G, R.map((r) => [r, "t"]));
const ORDER = ["s", ...L, ...R, "t"];
function buildSteps() {
  const f = new Map(E.map(([u, v]) => [`${u}|${v}`, 0])), out = [];
  const res = () => {
    const r = [];
    E.forEach(([u, v]) => {
      if (f.get(`${u}|${v}`) === 0) r.push([u, v, false]);
      else r.push([v, u, true]);
    });
    return r;
  };
  out.push({
    f: new Map(f),
    path: [],
    a: "Flytnettet G\u2032: en kilde s med kant til hver node i L, en kant fra hver node i R til sluket t, og kantene i G rettet fra L til R. Alle kapasiteter er 1.",
    b: "Heltallsteoremet: Ford-Fulkerson gir en heltallig maks flyt, s\xE5 hver kant f\xE5r flyt 0 eller 1. Kantene fra L til R med flyt 1 er en matching."
  });
  let it = 0;
  for (; ; ) {
    const r = res(), pi = /* @__PURE__ */ new Map([["s", null]]), queue = ["s"];
    while (queue.length) {
      const u = queue.shift();
      ORDER.forEach((v) => {
        if (!pi.has(v) && r.some((e) => e[0] === u && e[1] === v)) {
          pi.set(v, u);
          queue.push(v);
        }
      });
    }
    if (!pi.has("t")) {
      const m = G.filter(([u, v]) => f.get(`${u}|${v}`) === 1);
      out.push({
        f: new Map(f),
        path: [],
        done: true,
        a: `Ingen for\xF8kende sti finnes. Maks flyt er ${m.length}, og matchingen er {${m.map(([u, v]) => `(${LBL[u]}, ${LBL[v]})`).join(", ")}}.`,
        b: "l\u2084 og l\u2085 har bare r\u2083 som nabo, s\xE5 de kan ikke begge matches. En matching med 5 kanter er umulig."
      });
      break;
    }
    const path = ["t"];
    while (path.at(0) !== "s") path.unshift(pi.get(path.at(0)));
    it += 1;
    const back = [];
    path.slice(1).forEach((v, i) => {
      const u = path[i];
      if (f.has(`${u}|${v}`) && f.get(`${u}|${v}`) === 0) f.set(`${u}|${v}`, 1);
      else {
        f.set(`${v}|${u}`, 0);
        back.push(`(${LBL[v]}, ${LBL[u]})`);
      }
    });
    out.push({
      f: new Map(f),
      path,
      a: `Iterasjon ${it}: BFS finner ${path.map((x) => LBL[x]).join(" \u2192 ")}, og flyten \xF8ker med 1.`,
      b: back.length ? `Stien g\xE5r baklengs langs ${back.join(" og ")}, s\xE5 de kantene tas ut av matchingen, mens nye kanter legges inn. Matchingen vokser likevel med \xE9n.` : "Stien g\xE5r bare forlengs, s\xE5 \xE9n ny kant fra L til R kommer med i matchingen."
    });
  }
  return out;
}
const STEPS = buildSteps();
return () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const onPath = (u, v) => {
    const i = st.path.indexOf(u);
    return i >= 0 && (st.path.at(i + 1) === v || st.path.at(i - 1) === v && i > 0);
  };
  const matched = G.filter(([u, v]) => st.f.get(`${u}|${v}`) === 1);
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 520", role: "img", "aria-label": "Maksimum bipartitt matching med maks flyt", fontSize: "13" }, /* @__PURE__ */ React.createElement(Title, { title: "Maksimum bipartitt matching med maks flyt", subtitle: "Edmonds-Karp p\xE5 flytnettet G\u2032; alle kanter har kapasitet 1" }), /* @__PURE__ */ React.createElement(Controls, { s, N, setS }), E.map(([u, v], k) => {
    const fl = st.f.get(`${u}|${v}`), pth = onPath(u, v);
    return /* @__PURE__ */ React.createElement(Edge, { key: k, p: P[u], q: P[v], directed: true, r: 17, color: pth ? C.cmp : fl ? C.accent : C.edge, width: pth ? 3 : fl ? 3 : 1.1, dash: pth && !fl ? "6 4" : void 0 });
  }), Object.keys(P).map((v) => /* @__PURE__ */ React.createElement(Node, { key: v, x: P[v][0], y: P[v][1], r: 17, label: LBL[v], stroke: st.path.includes(v) ? C.cmp : C.edge, strokeWidth: st.path.includes(v) ? 2.5 : 1.25 })), /* @__PURE__ */ React.createElement("text", { x: "190", y: "140", textAnchor: "middle", fontSize: "12", fill: C.quiet }, "L"), /* @__PURE__ */ React.createElement("text", { x: "360", y: "140", textAnchor: "middle", fontSize: "12", fill: C.quiet }, "R"), /* @__PURE__ */ React.createElement("text", { x: "560", y: "170", fontSize: "12", fontWeight: "600", fill: C.ink }, `Matching (${matched.length} kanter)`), matched.map(([u, v], k) => /* @__PURE__ */ React.createElement("text", { key: k, x: "560", y: 194 + k * 20, fontSize: "13", fill: C.accent, fontWeight: "600" }, `${LBL[u]} \u2013 ${LBL[v]}`)), /* @__PURE__ */ React.createElement("text", { x: "24", y: "414", fontSize: "12", fill: C.quiet }, "Bl\xE5 = flyt 1 (i matchingen eller brukt av s/t). Oransje = for\xF8kende sti; stiplet oransje = kanten ble g\xE5tt baklengs og er tatt ut."), /* @__PURE__ */ React.createElement(Explain, { y: 448, a: st.a, b: st.b }));
};
 })();
window.AlgWidgets["bisect"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", tint = "var(--cds-chart-reference-tint)", accent = "var(--cds-chart-categorical-1)", good = "var(--cds-chart-status-good)", bad = "var(--cds-chart-status-critical)";
  const A = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  const steps = (() => {
    const out = [];
    const run = (v) => {
      let p = 1, r = 15;
      const hist = ["[1 : 15]"];
      out.push({ v, p, r, q: -1, line: 1, res: 0, hist: hist.slice(), a: `S\xF8k etter v = ${v} med Bisect\u2032(A, 1, 15, ${v}).`, b: "Hele tabellen er kandidat: hvis v finnes i A, finnes den i A[p : r]." });
      while (p <= r) {
        const q = Math.floor((p + r) / 2), aq = A.at(q - 1);
        if (v === aq) {
          out.push({ v, p, r, q, line: 4, res: 1, hist: hist.slice(), a: `q = \u230A(${p} + ${r})/2\u230B = ${q}, og A[${q}] = ${aq} = v.`, b: `Funnet: Bisect\u2032 returnerer ${q} etter ${hist.length} sammenligninger med midtelementer.` });
          return;
        }
        if (v < aq) {
          const op = p, or = r;
          r = q - 1;
          hist.push(`[${p} : ${r}]`);
          out.push({ v, p: op, r: or, q, line: 6, res: 0, hist: hist.slice(), a: `q = \u230A(${op} + ${or})/2\u230B = ${q}, og v = ${v} < A[${q}] = ${aq}.`, b: `Alt fra A[${q}] og ut er st\xF8rre enn v, s\xE5 r = q \u2212 1 = ${r}.` });
        } else {
          const op = p, or = r;
          p = q + 1;
          hist.push(`[${p} : ${r}]`);
          out.push({ v, p: op, r: or, q, line: 7, res: 0, hist: hist.slice(), a: `q = \u230A(${op} + ${or})/2\u230B = ${q}, og v = ${v} > A[${q}] = ${aq}.`, b: `Alt til og med A[${q}] er mindre enn v, s\xE5 p = q + 1 = ${p}.` });
        }
      }
      out.push({ v, p, r, q: -1, line: 8, res: -1, hist: hist.slice(), a: `p = ${p} > r = ${r}: intervallet er tomt, og l\xF8kken stopper.`, b: `Bisect\u2032 returnerer nil: ${v} finnes ikke i A.` });
    };
    run(23);
    run(8);
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const cx = (c) => 46 + c * 44, lineY = (k) => 296 + 22 * k;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 540", role: "img", "aria-label": "Bin\xE6rs\xF8k steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Bin\xE6rs\xF8k steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Ett vellykket s\xF8k (v = 23) og ett mislykket (v = 8) med Bisect\u2032"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "array" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "128", fontWeight: "600", fill: ink }, `A, s\xF8ker etter v = ${st.v}`), A.map((x, c) => {
    const i = c + 1, inR = i >= st.p && i <= st.r, isQ = i === st.q;
    const col = isQ ? st.res === 1 ? good : accent : edge;
    return /* @__PURE__ */ React.createElement("g", { key: c }, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 20, y: "140", width: "40", height: "40", fill: isQ ? col : inR ? tint : "none", fillOpacity: isQ ? 0.15 : 1, stroke: col, strokeWidth: isQ ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "165", textAnchor: "middle", fontWeight: isQ ? 600 : 400, fill: ink, fillOpacity: inR ? 1 : 0.4 }, x), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "196", textAnchor: "middle", fontSize: "11.5", fill: quiet }, i));
  }), st.p <= 15 && st.p >= 1 ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "p-mark", x: cx(st.p - 1), y: "216", textAnchor: "middle", fontWeight: "600", fill: ink }, "\u2191 p") : null, st.q >= 1 ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "q-mark", x: cx(st.q - 1), y: "234", textAnchor: "middle", fontWeight: "600", fill: st.res === 1 ? good : accent }, "\u2191 q") : null, st.r >= 1 && st.r <= 15 ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "r-mark", x: cx(st.r - 1), y: "252", textAnchor: "middle", fontWeight: "600", fill: ink }, "\u2191 r") : null), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "history" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "hist-title", x: "24", y: "290", fontSize: "12", fill: quiet }, "Kandidatintervallet halveres:"), st.hist.map((h, k) => /* @__PURE__ */ React.createElement("text", { key: k, x: "24", y: 314 + k * 22, fill: ink }, `${k === 0 ? "" : "\u2192 "}${h}`)), st.res === -1 ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "res-nil", x: "24", y: 314 + st.hist.length * 22, fontWeight: "600", fill: bad }, "tomt: return nil") : null, st.res === 1 ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "res-found", x: "24", y: 314 + st.hist.length * 22, fontWeight: "600", fill: good }, "funnet: return q") : null), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "pseudocode", fontSize: "12" }, /* @__PURE__ */ React.createElement("rect", { x: "400", y: "274", width: "336", height: "206", rx: "8", fill: "none", stroke: edge, strokeWidth: "1" }), st.line > 0 ? /* @__PURE__ */ React.createElement("rect", { x: "404", y: lineY(st.line) - 15, width: "328", height: "21", rx: "4", fill: accent, fillOpacity: "0.18" }) : null, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-head", x: "412", y: lineY(0), fontWeight: "600", fill: ink }, "BISECT\u2032(A, p, r, v)"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n1", x: "412", y: lineY(1), fill: quiet }, "1"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-1", x: "436", y: lineY(1), fill: ink }, "while p \u2264 r"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n2", x: "412", y: lineY(2), fill: quiet }, "2"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-2", x: "456", y: lineY(2), fill: ink }, "q = \u230A(p + r)/2\u230B"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n3", x: "412", y: lineY(3), fill: quiet }, "3"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-3", x: "456", y: lineY(3), fill: ink }, "if v == A[q]"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n4", x: "412", y: lineY(4), fill: quiet }, "4"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-4", x: "476", y: lineY(4), fill: ink }, "return q"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n5", x: "412", y: lineY(5), fill: quiet }, "5"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-5", x: "456", y: lineY(5), fill: ink }, "else if v < A[q]"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n6", x: "412", y: lineY(6), fill: quiet }, "6"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-6", x: "476", y: lineY(6), fill: ink }, "r = q \u2212 1"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n7", x: "412", y: lineY(7), fill: quiet }, "7"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-7", x: "456", y: lineY(7), fill: ink }, "else p = q + 1"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n8", x: "412", y: lineY(8), fill: quiet }, "8"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-8", x: "436", y: lineY(8), fill: ink }, "return nil")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "508", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "530", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["bst"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", tint = "var(--cds-chart-reference-tint)", accent = "var(--cds-chart-categorical-1)", cmpc = "var(--cds-chart-categorical-2)", good = "var(--cds-chart-status-good)";
  const keys = [15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9];
  const sorted = keys.slice().sort((a, b) => a - b);
  const Lc = /* @__PURE__ */ new Map(), Rc = /* @__PURE__ */ new Map(), Pa = /* @__PURE__ */ new Map(), Dp = /* @__PURE__ */ new Map();
  const steps = (() => {
    const out = [], present = [];
    let root = null;
    const snap = (o) => out.push({ path: [], cur: null, res: null, order: [], ...o, present: present.slice() });
    snap({ a: "Start: et tomt bin\xE6rt s\xF8ketre. N\xF8klene settes inn \xE9n etter \xE9n med Tree-Insert.", b: "Rekkef\xF8lge: 15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9 (bokas figur 12.2)." });
    keys.forEach((k) => {
      const path = [];
      let x2 = root, y = null;
      while (x2 !== null) {
        path.push(x2);
        y = x2;
        x2 = k < x2 ? Lc.has(x2) ? Lc.get(x2) : null : Rc.has(x2) ? Rc.get(x2) : null;
      }
      Pa.set(k, y);
      Dp.set(k, y === null ? 0 : Dp.get(y) + 1);
      if (y === null) {
        root = k;
      } else if (k < y) {
        Lc.set(y, k);
      } else {
        Rc.set(y, k);
      }
      present.push(k);
      snap({ path, cur: k, a: y === null ? `Tree-Insert(${k}): treet er tomt, s\xE5 ${k} blir roten.` : `Tree-Insert(${k}): f\xF8lger stien ${path.join(" \u2192 ")} og blir ${k < y ? "venstre" : "h\xF8yre"} barn av ${y}.`, b: y === null ? "Den nye noden settes alltid inn som et l\xF8v." : `Ved hver node g\xE5r vi til venstre hvis ${k} er mindre, ellers til h\xF8yre.` });
    });
    const sp = [];
    let x = root;
    while (x !== null) {
      sp.push(x);
      if (x === 13) {
        snap({ path: sp.slice(), cur: 13, res: 13, a: "Tree-Search(13): x.key = 13 = k, s\xE5 noden er funnet.", b: `S\xF8ket fulgte \xE9n sti fra roten og brukte ${sp.length} sammenligninger: O(h).` });
        x = null;
      } else {
        const nx2 = 13 < x ? Lc.get(x) : Rc.get(x);
        snap({ path: sp.slice(), cur: x, a: `Tree-Search(13): x.key = ${x}, og 13 ${13 < x ? "<" : ">"} ${x}, s\xE5 vi g\xE5r til ${13 < x ? "venstre" : "h\xF8yre"}.`, b: `Bin\xE6r-s\xF8ketre-egenskapen sier at 13 bare kan ligge i ${13 < x ? "venstre" : "h\xF8yre"} deltre av ${x}.` });
        x = nx2;
      }
    }
    const mp = [15, 6, 3, 2];
    snap({ path: mp, cur: 2, res: 2, a: "Tree-Minimum(rot): f\xF8lg venstre-pekere 15 \u2192 6 \u2192 3 \u2192 2 til det ikke finnes flere.", b: "Minimum er noden lengst til venstre, her 2." });
    snap({ path: [13], cur: 13, a: "Tree-Successor(13): 13 har ikke h\xF8yre barn, s\xE5 vi m\xE5 g\xE5 oppover.", b: "Vi leter etter den laveste forfaren der vi kommer fra venstre." });
    snap({ path: [13, 7, 6], cur: 6, a: "13 er h\xF8yre barn av 7, og 7 er h\xF8yre barn av 6, s\xE5 vi fortsetter opp.", b: "Alt vi passerer fra h\xF8yre side, er mindre enn 13." });
    snap({ path: [13, 7, 6, 15], cur: 15, res: 15, a: "6 er venstre barn av 15, s\xE5 l\xF8kken stopper. Etterf\xF8lgeren til 13 er 15.", b: "Hele venstre deltre av 15 (der 13 ligger) er mindre enn 15." });
    snap({ order: sorted, a: `Inorder-Tree-Walk(rot): ${sorted.join(", ")}.`, b: "Venstre deltre, roten, h\xF8yre deltre, rekursivt: n\xF8klene kommer ut sortert, i \u0398(n) tid." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const nx = (k) => 60 + sorted.indexOf(k) * 62, ny = (k) => 136 + Dp.get(k) * 52;
  const seg = (k) => {
    const p = Pa.get(k), px = nx(p), py = ny(p), qx = nx(k), qy = ny(k), L = Math.hypot(qx - px, qy - py), ux = (qx - px) / L, uy = (qy - py) / L;
    return [px + ux * 17, py + uy * 17, qx - ux * 17, qy - uy * 17];
  };
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 470", role: "img", "aria-label": "Bin\xE6rt s\xF8ketre steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Bin\xE6rt s\xF8ketre steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Innsetting, s\xF8k, minimum, etterf\xF8lger og inorder-gjennomgang"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "tree" }, st.present.filter((k) => Pa.get(k) !== null).map((k) => {
    const g = seg(k), on = st.path.includes(k) && st.path.includes(Pa.get(k));
    return /* @__PURE__ */ React.createElement("line", { key: `e${k}`, x1: g.at(0), y1: g.at(1), x2: g.at(2), y2: g.at(3), stroke: on ? cmpc : edge, strokeWidth: on ? 2 : 1 });
  }), st.present.map((k) => {
    const onP = st.path.includes(k), isC = k === st.cur, isR = k === st.res, rk = st.order.indexOf(k);
    return /* @__PURE__ */ React.createElement("g", { key: `n${k}` }, /* @__PURE__ */ React.createElement("circle", { cx: nx(k), cy: ny(k), r: "17", fill: isR ? good : isC ? accent : onP ? cmpc : "none", fillOpacity: isR || isC || onP ? 0.16 : 0, stroke: isR ? good : isC ? accent : onP ? cmpc : edge, strokeWidth: isR || isC || onP ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: nx(k), y: ny(k) + 4.5, textAnchor: "middle", fontWeight: isC || isR ? 600 : 400, fill: ink }, k), rk >= 0 ? /* @__PURE__ */ React.createElement("text", { x: nx(k), y: ny(k) + 32, textAnchor: "middle", fontSize: "10.5", fill: good }, `#${rk + 1}`) : null);
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "output" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "out-label", x: "24", y: "408", fontSize: "12", fill: quiet }, "Inorder:"), st.order.map((k, c) => /* @__PURE__ */ React.createElement("g", { key: `o${c}` }, /* @__PURE__ */ React.createElement("rect", { x: 84 + c * 52, y: "390", width: "44", height: "26", rx: "4", fill: tint, stroke: good, strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: 106 + c * 52, y: "408", textAnchor: "middle", fill: ink }, k)))), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "442", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "462", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["bucket-sort"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", tint = "var(--cds-chart-reference-tint)", accent = "var(--cds-chart-categorical-1)", cmpc = "var(--cds-chart-categorical-2)";
  const A = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68];
  const f = (v) => v.toFixed(2).slice(1);
  const steps = (() => {
    const B = [[], [], [], [], [], [], [], [], [], []], out = [];
    let res = [];
    const snap = (o) => out.push({ phase: 0, ia: -1, bi: -1, ...o, B: B.map((l) => l.slice()), res: res.slice() });
    snap({ phase: 1, a: "Linje 1\u20133: lag n = 10 tomme lister B[0], \u2026, B[9].", b: "B[i] skal holde verdiene i intervallet [i/10, (i + 1)/10)." });
    A.forEach((v, i) => {
      const bi = Math.floor(10 * v);
      B.at(bi).push(v);
      snap({ phase: 2, ia: i, bi, a: `A[${i + 1}] = ${f(v)} legges i B[\u230A10 \xB7 ${f(v)}\u230B] = B[${bi}].`, b: "Linje 4\u20135: hvert element havner i b\xF8tten for sitt tiendedels-intervall." });
    });
    B.forEach((l, i) => {
      if (l.length > 0) {
        l.sort((x, y) => x - y);
        snap({ phase: 3, bi: i, a: `B[${i}] sorteres med Insertion-Sort: ${l.map(f).join(", ")}.`, b: l.length > 1 ? `B\xF8tten har ${l.length} elementer. Forventet st\xF8rrelse er 1, s\xE5 hver sortering er rask.` : "Bare ett element: ingenting \xE5 gj\xF8re." });
      }
    });
    res = B.flat();
    snap({ phase: 4, a: `Linje 8: listene settes sammen i rekkef\xF8lge: ${res.map(f).join(", ")}.`, b: "Alt i B[i] er mindre enn alt i B[i + 1], s\xE5 sammensettingen er sortert." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const cx = (c) => 74 + c * 58, by = (i) => 190 + i * 24;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 520", role: "img", "aria-label": "Bucket-Sort steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Bucket-Sort steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Fordel i b\xF8tter, sorter hver b\xF8tte, sett sammen"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "array-a" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "a-label", x: "24", y: "141", fontWeight: "600", fill: ink }, "A"), A.map((v, c) => /* @__PURE__ */ React.createElement("g", { key: `a${c}` }, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 26, y: "120", width: "52", height: "32", fill: st.phase >= 2 && (c < st.ia || st.phase > 2) ? tint : "none", stroke: c === st.ia ? cmpc : edge, strokeWidth: c === st.ia ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "141", textAnchor: "middle", fontWeight: c === st.ia ? 600 : 400, fill: ink }, f(v)), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "168", textAnchor: "middle", fontSize: "11.5", fill: quiet }, c + 1)))), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "buckets" }, st.B.map((l, i) => /* @__PURE__ */ React.createElement("g", { key: `b${i}` }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: by(i) - 15, width: "712", height: "21", rx: "4", fill: i === st.bi ? accent : "none", fillOpacity: i === st.bi ? 0.12 : 0 }), /* @__PURE__ */ React.createElement("text", { x: "30", y: by(i), fontSize: "12", fontWeight: "600", fill: ink }, `B[${i}]`), /* @__PURE__ */ React.createElement("text", { x: "72", y: by(i), fontSize: "11.5", fill: quiet }, `[.${i}, ${i === 9 ? "1" : "." + (i + 1)})`), l.map((v, t) => /* @__PURE__ */ React.createElement("g", { key: t }, /* @__PURE__ */ React.createElement("rect", { x: 140 + t * 60, y: by(i) - 14, width: "52", height: "19", rx: "9", fill: tint, stroke: edge, strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: 166 + t * 60, y: by(i), textAnchor: "middle", fontSize: "12", fill: ink }, f(v))))))), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "output" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "out-label", x: "24", y: "452", fontWeight: "600", fill: ink }, "Ut"), st.res.map((v, c) => /* @__PURE__ */ React.createElement("g", { key: `o${c}` }, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 26, y: "431", width: "52", height: "32", fill: tint, stroke: accent, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "452", textAnchor: "middle", fill: ink }, f(v))))), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "490", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "510", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["clique-reduction"] = (function(){ const { C, Controls, Title, Explain, Node, PALETTE } = window.AlgLib;
const VS = [
  [1, 1, false, 230, 170],
  [1, 2, true, 310, 170],
  [1, 3, true, 390, 170],
  [2, 1, true, 120, 240],
  [2, 2, false, 120, 300],
  [2, 3, false, 120, 360],
  [3, 1, false, 500, 240],
  [3, 2, false, 500, 300],
  [3, 3, false, 500, 360]
];
const SUB = ["", "\u2081", "\u2082", "\u2083"];
const lit = (v) => `${v[2] ? "\xAC" : ""}x${SUB[v[1]]}`;
const EDGES = [];
VS.forEach((a, i) => VS.forEach((b, j) => {
  if (i < j && a[0] !== b[0] && !(a[1] === b[1] && a[2] !== b[2])) EDGES.push([i, j]);
}));
const CLIQUE = [1, 5, 8];
const STEPS = [
  {
    show: "nodes",
    a: "Formelen \u03C6 har k = 3 klausuler. Lag \xE9n node per literal i hver klausul, gruppert per klausul (C\u2081 \xF8verst, C\u2082 til venstre, C\u2083 til h\xF8yre).",
    b: "M\xE5let er en graf G og et tall k slik at \u03C6 er tilfredsstillbar hvis og bare hvis G har en klikk med k noder."
  },
  {
    show: "edges",
    a: `Legg inn en kant mellom to noder hvis de er i ulike klausuler og literalene er konsistente, alts\xE5 ikke x og \xACx. Her gir det ${EDGES.length} kanter.`,
    b: "Ingen kanter innenfor en klausul, og ingen mellom en variabel og dens negasjon. Konstruksjonen tar polynomisk tid."
  },
  {
    show: "edges",
    missing: [0, 3],
    a: "Eksempel p\xE5 en manglende kant: x\u2081 i C\u2081 og \xACx\u2081 i C\u2082. Begge kan ikke v\xE6re sanne samtidig.",
    b: "Derfor beskriver enhver klikk en tilordning uten selvmotsigelser."
  },
  {
    show: "clique",
    a: "\u03C6 er tilfredsstillbar med x\u2082 = 0 og x\u2083 = 1 (x\u2081 kan v\xE6re hva som helst). Velg \xE9n sann literal per klausul: \xACx\u2082 fra C\u2081, x\u2083 fra C\u2082 og x\u2083 fra C\u2083.",
    b: "De tre nodene er i ulike klausuler og er alle sanne, s\xE5 ingen par er hverandres negasjon. Alle tre kantene finnes: en klikk med k = 3 noder."
  },
  {
    show: "clique",
    a: "Motsatt: en klikk med k noder m\xE5 ha \xE9n node fra hver klausul (ingen kanter innenfor en klausul). Sett hver valgt literal sann.",
    b: "Det g\xE5r, fordi klikken ikke inneholder b\xE5de x og \xACx. Da har hver klausul en sann literal, s\xE5 \u03C6 er sann. Dermed er CLIQUE NP-hard, og siden den er i NP, NP-komplett."
  }
];
return () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS[s];
  const inC = (i) => st.show === "clique" && CLIQUE.includes(i);
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 520", role: "img", "aria-label": "Reduksjon fra 3-CNF-SAT til CLIQUE", fontSize: "13" }, /* @__PURE__ */ React.createElement(Title, { title: "3-CNF-SAT \u2264p CLIQUE", subtitle: "\u03C6 = (x\u2081 \u2228 \xACx\u2082 \u2228 \xACx\u2083) \u2227 (\xACx\u2081 \u2228 x\u2082 \u2228 x\u2083) \u2227 (x\u2081 \u2228 x\u2082 \u2228 x\u2083), som i bokas figur 34.14" }), /* @__PURE__ */ React.createElement(Controls, { s, N, setS }), st.show !== "nodes" ? EDGES.map(([i, j], k) => {
    const a = VS[i], b = VS[j], on = inC(i) && inC(j);
    return /* @__PURE__ */ React.createElement("line", { key: k, x1: a[3], y1: a[4], x2: b[3], y2: b[4], stroke: on ? C.good : C.edge, strokeWidth: on ? 3.5 : 0.9, opacity: st.show === "clique" && !on ? 0.35 : 1 });
  }) : null, st.missing ? /* @__PURE__ */ React.createElement("line", { x1: VS[st.missing[0]][3], y1: VS[st.missing[0]][4], x2: VS[st.missing[1]][3], y2: VS[st.missing[1]][4], stroke: C.bad, strokeWidth: "2.5", strokeDasharray: "6 5" }) : null, VS.map((v, i) => {
    const col = PALETTE[v[0] - 1], on = inC(i) || st.missing && st.missing.includes(i);
    return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("circle", { cx: v[3], cy: v[4], r: "22", fill: "var(--cds-chart-background)" }), /* @__PURE__ */ React.createElement(
      Node,
      {
        x: v[3],
        y: v[4],
        r: 22,
        label: lit(v),
        fill: col,
        fillOpacity: inC(i) ? 0.45 : 0.15,
        stroke: on ? inC(i) ? C.good : C.bad : col,
        strokeWidth: on ? 3 : 1.5
      }
    ));
  }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "132", textAnchor: "middle", fontSize: "12", fontWeight: "600", fill: PALETTE[0] }, "C\u2081"), /* @__PURE__ */ React.createElement("text", { x: "72", y: "305", textAnchor: "middle", fontSize: "12", fontWeight: "600", fill: PALETTE[1] }, "C\u2082"), /* @__PURE__ */ React.createElement("text", { x: "548", y: "305", textAnchor: "middle", fontSize: "12", fontWeight: "600", fill: PALETTE[2] }, "C\u2083"), /* @__PURE__ */ React.createElement("text", { x: "600", y: "180", fontSize: "12", fill: C.quiet }, "Kantregel:"), /* @__PURE__ */ React.createElement("text", { x: "600", y: "200", fontSize: "12", fill: C.quiet }, "ulike klausuler og"), /* @__PURE__ */ React.createElement("text", { x: "600", y: "218", fontSize: "12", fill: C.quiet }, "ikke x mot \xACx"), /* @__PURE__ */ React.createElement("text", { x: "600", y: "256", fontSize: "12", fill: C.quiet }, "k = antall klausuler"), /* @__PURE__ */ React.createElement(Explain, { y: 440, a: st.a, b: st.b }));
};
 })();
window.AlgWidgets["counting-sort"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", tint = "var(--cds-chart-reference-tint)", accent = "var(--cds-chart-categorical-1)", cmpc = "var(--cds-chart-categorical-2)";
  const A = [2, 5, 3, 0, 2, 3, 0, 3];
  const steps = (() => {
    const C = [0, 0, 0, 0, 0, 0], B = [null, null, null, null, null, null, null, null], src = [null, null, null, null, null, null, null, null], out = [];
    const snap = (o) => out.push({ phase: 0, ja: -1, ci: -1, bw: -1, ...o, C: C.slice(), B: B.slice(), src: src.slice() });
    snap({ phase: 1, a: "Linje 1\u20133: C[0 : 5] nullstilles. Her er n = 8 og k = 5.", b: "C[i] skal f\xF8rst telle hvor mange elementer i A som er lik i." });
    for (let j = 0; j < 8; j += 1) {
      const v = A.at(j);
      C.splice(v, 1, C.at(v) + 1);
      snap({ phase: 2, ja: j, ci: v, a: `j = ${j + 1}: A[${j + 1}] = ${v}, s\xE5 C[${v}] \xF8ker til ${C.at(v)}.`, b: "Linje 4\u20135: \xE9n gjennomgang av A teller forekomstene av hver verdi." });
    }
    for (let i = 1; i <= 5; i += 1) {
      C.splice(i, 1, C.at(i) + C.at(i - 1));
      snap({ phase: 3, ci: i, a: `i = ${i}: C[${i}] = C[${i}] + C[${i - 1}] = ${C.at(i)}.`, b: `Linje 7\u20138: n\xE5 er C[${i}] antall elementer som er \u2264 ${i}.` });
    }
    for (let j = 7; j >= 0; j -= 1) {
      const v = A.at(j), pos = C.at(v);
      B.splice(pos - 1, 1, v);
      src.splice(pos - 1, 1, j + 1);
      C.splice(v, 1, pos - 1);
      snap({ phase: 4, ja: j, ci: v, bw: pos - 1, a: `j = ${j + 1}: A[${j + 1}] = ${v} og C[${v}] = ${pos}, s\xE5 B[${pos}] = ${v}, og C[${v}] minker til ${pos - 1}.`, b: `Linje 11\u201313: ${pos} av de gjenv\xE6rende elementene er \u2264 ${v}, s\xE5 dette elementet h\xF8rer hjemme p\xE5 plass ${pos}.` });
    }
    snap({ phase: 5, a: "Ferdig: B = \u27E80, 0, 2, 2, 3, 3, 3, 5\u27E9.", b: "Like verdier st\xE5r i samme rekkef\xF8lge som i A (se A[j] i hver celle): sorteringen er stabil." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const cx = (c) => 104 + c * 48;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const ph = (k) => /* @__PURE__ */ React.createElement("rect", { x: "496", y: 110 + k * 30, width: "240", height: "24", rx: "4", fill: accent, fillOpacity: st.phase === k ? 0.18 : 0 });
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 414", role: "img", "aria-label": "Counting-Sort steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Counting-Sort steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Hvert trykk p\xE5 Neste utf\xF8rer \xE9n iterasjon av en av l\xF8kkene"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "array-a" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "a-label", x: "24", y: "157", fontWeight: "600", fill: ink }, "A"), A.map((v, c) => /* @__PURE__ */ React.createElement("g", { key: `a${c}` }, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 22, y: "132", width: "44", height: "40", fill: "none", stroke: c === st.ja ? cmpc : edge, strokeWidth: c === st.ja ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "157", textAnchor: "middle", fontWeight: c === st.ja ? 600 : 400, fill: ink }, v), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "188", textAnchor: "middle", fontSize: "11.5", fill: quiet }, c + 1)))), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "array-c" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "c-label", x: "24", y: "233", fontWeight: "600", fill: ink }, "C"), st.C.map((v, c) => /* @__PURE__ */ React.createElement("g", { key: `c${c}` }, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 22, y: "208", width: "44", height: "40", fill: c === st.ci ? accent : "none", fillOpacity: c === st.ci ? 0.15 : 1, stroke: c === st.ci ? accent : edge, strokeWidth: c === st.ci ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "233", textAnchor: "middle", fontWeight: c === st.ci ? 600 : 400, fill: ink }, v), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "264", textAnchor: "middle", fontSize: "11.5", fill: quiet }, c)))), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "array-b" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "b-label", x: "24", y: "309", fontWeight: "600", fill: ink }, "B"), st.B.map((v, c) => /* @__PURE__ */ React.createElement("g", { key: `b${c}` }, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 22, y: "284", width: "44", height: "40", fill: v !== null ? tint : "none", stroke: c === st.bw ? accent : edge, strokeWidth: c === st.bw ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "303", textAnchor: "middle", fontWeight: c === st.bw ? 600 : 400, fill: ink }, v !== null ? v : ""), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "318", textAnchor: "middle", fontSize: "10.5", fill: quiet }, st.src.at(c) !== null ? `A[${st.src.at(c)}]` : ""), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "340", textAnchor: "middle", fontSize: "11.5", fill: quiet }, c + 1)))), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "phases" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "phase-title", x: "496", y: "100", fontSize: "12", fill: quiet }, "Faser i Counting-Sort(A, n, k)"), ph(1), ph(2), ph(3), ph(4), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "phase-1", x: "506", y: "127", fontSize: "12", fill: ink }, "Linje 1\u20133: nullstill C"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "phase-2", x: "506", y: "157", fontSize: "12", fill: ink }, "Linje 4\u20135: tell forekomster"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "phase-3", x: "506", y: "187", fontSize: "12", fill: ink }, "Linje 7\u20138: prefikssummer"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "phase-4", x: "506", y: "217", fontSize: "12", fill: ink }, "Linje 11\u201313: plasser bakfra")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "374", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "396", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["dag-shortest-paths"] = (function(){ const { C, Controls, Title, Explain, Node, Edge, Pseudo, fmt } = window.AlgLib;
const V = ["r", "s", "t", "x", "y", "z"];
const P = new Map(V.map((v, i) => [v, [50 + i * 86, 250]]));
const E = [["r", "s", 5, 0], ["r", "t", 3, -110], ["s", "t", 2, 0], ["s", "x", 6, 110], ["t", "x", 7, 0], ["t", "y", 4, -110], ["t", "z", 2, 150], ["x", "y", -1, 0], ["x", "z", 1, -110], ["y", "z", -2, 0]];
const Adj = new Map(V.map((v) => [v, E.filter((e) => e[0] === v)]));
const CODE = [
  "DAG-SHORTEST-PATHS(G, w, s)",
  "1  sorter G topologisk",
  "2  INIT-SINGLE-SOURCE(G, s)",
  "3  for hver u, topologisk",
  "4    for each v in G.Adj[u]",
  "5      RELAX(u, v, w)"
];
function buildSteps() {
  const d = new Map(V.map((v) => [v, Infinity])), pi = new Map(V.map((v) => [v, null])), out = [];
  d.set("s", 0);
  const snap = (o) => out.push({ u: null, upd: [], ...o, d: new Map(d), pi: new Map(pi) });
  snap({ code: [1, 2], a: "Linje 1\u20132: nodene er topologisk sortert fra venstre mot h\xF8yre. s.d = 0, alle andre har d = \u221E.", b: "Alle kanter g\xE5r mot h\xF8yre, s\xE5 n\xE5r vi kommer til en node, er alle kanter inn til den allerede relaksert." });
  V.forEach((u) => {
    const upd = [];
    Adj.get(u).forEach(([, v, w]) => {
      if (d.get(u) + w < d.get(v)) {
        upd.push(`${v}.d = ${fmt(d.get(u) + w)}`);
        d.set(v, d.get(u) + w);
        pi.set(v, u);
      }
    });
    const none = Adj.get(u).length === 0;
    snap({
      u,
      upd: upd.map((x) => x.at(0)),
      code: [3, 4, 5],
      a: `Linje 3\u20135: u = ${u} (${u}.d = ${fmt(d.get(u))}). ${none ? "Ingen utkanter." : `Kantene ut fra ${u} relakseres.`}`,
      b: upd.length ? `Forbedret: ${upd.join(", ")}.` : d.get(u) === Infinity ? `${u} kan ikke n\xE5s fra s, s\xE5 ingenting endres.` : "Ingen forbedringer."
    });
  });
  out.at(-1).b += " Ferdig: r \u221E, s 0, t 2, x 6, y 5, z 3. Hver kant ble relaksert n\xF8yaktig \xE9n gang.";
  return out;
}
const STEPS = buildSteps();
return () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const done = (v) => st.u !== null && V.indexOf(v) <= V.indexOf(st.u);
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 520", role: "img", "aria-label": "Dag-Shortest-Paths steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement(Title, { title: "Dag-Shortest-Paths steg for steg", subtitle: "Grafen fra bokas figur 22.5 med kilde s; tallet i noden er v.d" }), /* @__PURE__ */ React.createElement(Controls, { s, N, setS }), E.map(([u, v, w, bend], k) => {
    const tree = st.pi.get(v) === u, out = u === st.u;
    return /* @__PURE__ */ React.createElement(
      Edge,
      {
        key: k,
        p: P.get(u),
        q: P.get(v),
        directed: true,
        bend,
        r: 24,
        label: fmt(w),
        color: tree ? C.accent : out ? C.cmp : C.edge,
        width: tree ? 3 : out ? 2 : 1.25
      }
    );
  }), V.map((v) => {
    const [x, y] = P.get(v), cur = v === st.u, up = st.upd.includes(v), dn = done(v);
    return /* @__PURE__ */ React.createElement("g", { key: v }, /* @__PURE__ */ React.createElement(
      Node,
      {
        x,
        y,
        r: 24,
        label: fmt(st.d.get(v)),
        fill: dn ? C.ink : "none",
        fillOpacity: dn ? 0.75 : 0,
        textFill: dn ? "var(--cds-chart-reference-tint)" : C.ink,
        stroke: cur ? C.accent : up ? C.good : C.edge,
        strokeWidth: cur || up ? 3 : 1.25
      }
    ), /* @__PURE__ */ React.createElement("text", { x, y: y - 32, textAnchor: "middle", fontSize: "13", fontWeight: "600", fill: C.quiet }, v));
  }), /* @__PURE__ */ React.createElement(Pseudo, { x: 540, y: 150, lines: CODE, active: st.code, w: 214, size: 11 }), /* @__PURE__ */ React.createElement("text", { x: "24", y: "410", fontSize: "12", fill: C.quiet }, "Svart node = behandlet. Bl\xE5 kant = korteste-vei-treet (v.\u03C0, v). Oransje = kantene som relakseres n\xE5."), /* @__PURE__ */ React.createElement(Explain, { y: 446, a: st.a, b: st.b }));
};
 })();
window.AlgWidgets["dfs"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", grid = "var(--cds-chart-grid)", accent = "var(--cds-chart-categorical-1)", grayc = "var(--cds-chart-categorical-4)", bk = "var(--cds-chart-status-critical)", fw = "var(--cds-chart-categorical-3)", cr = "var(--cds-chart-categorical-5)";
  const V = ["u", "v", "w", "x", "y", "z"];
  const P = /* @__PURE__ */ new Map([["u", [120, 170]], ["v", [270, 170]], ["w", [420, 170]], ["x", [120, 300]], ["y", [270, 300]], ["z", [420, 300]]]);
  const Adj = /* @__PURE__ */ new Map([["u", ["v", "x"]], ["v", ["y"]], ["w", ["y", "z"]], ["x", ["v"]], ["y", ["x"]], ["z", ["z"]]]);
  const E = [["u", "v"], ["u", "x"], ["x", "v"], ["v", "y"], ["y", "x"], ["w", "y"], ["w", "z"]];
  const colOf = (c) => c === "T" ? accent : c === "B" ? bk : c === "F" ? fw : c === "C" ? cr : edge;
  const steps = (() => {
    const col = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), cls = /* @__PURE__ */ new Map(), out = [];
    let time = 0, paren = "";
    V.forEach((v) => col.set(v, "w"));
    const snap = (o) => out.push({ cur: null, ek: "", ...o, time, paren, col: new Map(col), d: new Map(d), f: new Map(f), cls: new Map(cls) });
    snap({ a: "DFS(G): alle noder er hvite, time = 0. Hovedl\xF8kken pr\xF8ver nodene i rekkef\xF8lgen u, v, w, x, y, z.", b: "Hver node f\xE5r to tidsstempler: d n\xE5r den oppdages og f n\xE5r den er ferdig." });
    const visit = (u, via) => {
      time += 1;
      d.set(u, time);
      col.set(u, "g");
      paren += `(${u} `;
      snap({ cur: u, ek: via ? `${via}>${u}` : "", a: `${via ? `Kanten (${via}, ${u}) er en trekant, fordi ${u} er hvit. ` : `Hovedl\xF8kken kaller DFS-Visit(G, ${u}). `}${u}.d = ${time}, og ${u} blir gr\xE5.`, b: "De gr\xE5 nodene er akkurat de som ligger p\xE5 rekursjonsstakken." });
      Adj.get(u).forEach((v) => {
        const k = `${u}>${v}`;
        if (col.get(v) === "w") {
          cls.set(k, "T");
          visit(v, u);
        } else if (col.get(v) === "g") {
          cls.set(k, "B");
          snap({ cur: u, ek: k, a: `Kanten (${u}, ${v}): ${v} er gr\xE5, s\xE5 det er en bakoverkant${u === v ? " (en l\xF8kke)" : ""}.`, b: `${v} er en forfar til ${u} som ikke er ferdig. En bakoverkant betyr at grafen har en sykel.` });
        } else if (d.get(u) < d.get(v)) {
          cls.set(k, "F");
          snap({ cur: u, ek: k, a: `Kanten (${u}, ${v}): ${v} er svart og ${u}.d = ${d.get(u)} < ${v}.d = ${d.get(v)}, s\xE5 det er en foroverkant.`, b: `${v} er en etterkommer av ${u} som allerede er ferdig.` });
        } else {
          cls.set(k, "C");
          snap({ cur: u, ek: k, a: `Kanten (${u}, ${v}): ${v} er svart og ${u}.d = ${d.get(u)} > ${v}.d = ${d.get(v)}, s\xE5 det er en krysskant.`, b: "Ingen av de to nodene er forfar til den andre." });
        }
      });
      time += 1;
      f.set(u, time);
      col.set(u, "b");
      paren += `${u}) `;
      snap({ cur: u, a: `Alle naboene til ${u} er unders\xF8kt: ${u}.f = ${time}, og ${u} blir svart.`, b: `Intervallet [${d.get(u)}, ${time}] for ${u} lukkes, innenfor intervallene til alle gr\xE5 noder.` });
    };
    V.forEach((u) => {
      if (col.get(u) === "w") {
        visit(u, null);
      }
    });
    snap({ a: "Ferdig. T: (u,v), (v,y), (y,x), (w,z). B: (x,v), (z,z). F: (u,x). C: (w,y).", b: "Dybde-f\xF8rst-skogen har to tr\xE6r, med r\xF8tter u og w. Grafen har sykler, siden det finnes bakoverkanter." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const seg = (a, b) => {
    const p = P.get(a), q = P.get(b), L = Math.hypot(q.at(0) - p.at(0), q.at(1) - p.at(1)), ux = (q.at(0) - p.at(0)) / L, uy = (q.at(1) - p.at(1)) / L;
    return [p.at(0) + ux * 22, p.at(1) + uy * 22, q.at(0) - ux * 25, q.at(1) - uy * 25];
  };
  const tx = (t) => 548 + (t - 1) * 16;
  const mid = (c) => c === "T" ? "url(#dfs-t)" : c === "B" ? "url(#dfs-b)" : c === "F" ? "url(#dfs-f)" : c === "C" ? "url(#dfs-c)" : "url(#dfs-n)";
  const zc = st.cls.get("z>z"), zp = P.get("z");
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 480", role: "img", "aria-label": "DFS steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("marker", { id: "dfs-t", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, /* @__PURE__ */ React.createElement("path", { d: "M0 0L10 5L0 10z", fill: accent })), /* @__PURE__ */ React.createElement("marker", { id: "dfs-b", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, /* @__PURE__ */ React.createElement("path", { d: "M0 0L10 5L0 10z", fill: bk })), /* @__PURE__ */ React.createElement("marker", { id: "dfs-f", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, /* @__PURE__ */ React.createElement("path", { d: "M0 0L10 5L0 10z", fill: fw })), /* @__PURE__ */ React.createElement("marker", { id: "dfs-c", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, /* @__PURE__ */ React.createElement("path", { d: "M0 0L10 5L0 10z", fill: cr })), /* @__PURE__ */ React.createElement("marker", { id: "dfs-n", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, /* @__PURE__ */ React.createElement("path", { d: "M0 0L10 5L0 10z", fill: edge }))), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "DFS steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Rettet graf fra bokas figur 20.4; tidsstempler, parentesstruktur og kantklasser"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N} \xB7 time = ${st.time}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "edges" }, E.map((e) => {
    const a = e.at(0), b = e.at(1), k = `${a}>${b}`, c = st.cls.get(k), g = seg(a, b), on = k === st.ek;
    return /* @__PURE__ */ React.createElement("g", { key: k }, /* @__PURE__ */ React.createElement("line", { x1: g.at(0), y1: g.at(1), x2: g.at(2), y2: g.at(3), stroke: colOf(c), strokeWidth: on ? 3.5 : c ? 2.25 : 1.25, markerEnd: mid(c), strokeDasharray: c === "B" || c === "C" ? "6 4" : "none" }), c ? /* @__PURE__ */ React.createElement("text", { x: (g.at(0) + g.at(2)) / 2 + 8, y: (g.at(1) + g.at(3)) / 2 - 6, fontSize: "11.5", fontWeight: "600", fill: colOf(c) }, c) : null);
  }), /* @__PURE__ */ React.createElement("path", { d: `M${zp.at(0) + 18} ${zp.at(1) - 14}C${zp.at(0) + 70} ${zp.at(1) - 50} ${zp.at(0) + 70} ${zp.at(1) + 50} ${zp.at(0) + 21} ${zp.at(1) + 12}`, fill: "none", stroke: colOf(zc), strokeWidth: st.ek === "z>z" ? 3.5 : zc ? 2.25 : 1.25, markerEnd: mid(zc), strokeDasharray: zc === "B" ? "6 4" : "none" }), zc ? /* @__PURE__ */ React.createElement("text", { x: zp.at(0) + 66, y: zp.at(1) + 4, fontSize: "11.5", fontWeight: "600", fill: colOf(zc) }, zc) : null), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "nodes" }, V.map((v) => {
    const p = P.get(v), c = st.col.get(v), cur = v === st.cur;
    return /* @__PURE__ */ React.createElement("g", { key: v }, /* @__PURE__ */ React.createElement("circle", { cx: p.at(0), cy: p.at(1), r: "22", fill: c === "b" ? ink : c === "g" ? grayc : "none", fillOpacity: c === "b" ? 0.75 : c === "g" ? 0.28 : 0, stroke: cur ? accent : edge, strokeWidth: cur ? 3 : 1.25 }), /* @__PURE__ */ React.createElement("text", { x: p.at(0), y: p.at(1) + 5, textAnchor: "middle", fontSize: "14", fontWeight: "600", fill: c === "b" ? "var(--cds-chart-reference-tint)" : ink }, v), /* @__PURE__ */ React.createElement("text", { x: p.at(0), y: p.at(1) + (p.at(1) < 200 ? -30 : 42), textAnchor: "middle", fontSize: "12", fill: quiet }, `${st.d.has(v) ? st.d.get(v) : ""}${st.d.has(v) ? "/" : ""}${st.f.has(v) ? st.f.get(v) : ""}`));
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "timeline" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "tl-title", x: "520", y: "128", fontSize: "12", fill: quiet }, "Intervallene [d, f]"), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((t) => /* @__PURE__ */ React.createElement("g", { key: `t${t}` }, /* @__PURE__ */ React.createElement("line", { x1: tx(t), x2: tx(t), y1: "138", y2: "300", stroke: grid }), /* @__PURE__ */ React.createElement("text", { x: tx(t), y: "314", textAnchor: "middle", fontSize: "10.5", fill: quiet }, t))), ["u", "v", "y", "x", "w", "z"].map((v, k) => {
    const has = st.d.has(v), d0 = st.d.get(v), f0 = st.f.has(v) ? st.f.get(v) : st.time;
    return /* @__PURE__ */ React.createElement("g", { key: `b${v}` }, /* @__PURE__ */ React.createElement("text", { x: "528", y: 156 + k * 25, textAnchor: "middle", fontSize: "12", fontWeight: "600", fill: ink }, v), has ? /* @__PURE__ */ React.createElement("rect", { x: tx(d0) - 4, y: 145 + k * 25, width: Math.max(8, tx(f0) - tx(d0) + 8), height: "16", rx: "8", fill: st.f.has(v) ? edge : grayc, fillOpacity: st.f.has(v) ? 0.35 : 0.4, stroke: v === st.cur ? accent : "none", strokeWidth: "2" }) : null);
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "parens" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "paren-label", x: "24", y: "372", fontSize: "12", fill: quiet }, "Parentesstruktur:"), /* @__PURE__ */ React.createElement("text", { x: "130", y: "372", fontSize: "13", fontWeight: "600", fill: ink }, st.paren)), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "legend" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-t", x: "24", y: "398", fontSize: "12", fontWeight: "600", fill: accent }, "T trekant"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-b", x: "110", y: "398", fontSize: "12", fontWeight: "600", fill: bk }, "B bakoverkant"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-f", x: "226", y: "398", fontSize: "12", fontWeight: "600", fill: fw }, "F foroverkant"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-c", x: "336", y: "398", fontSize: "12", fontWeight: "600", fill: cr }, "C krysskant")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "436", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "458", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["dijkstra"] = (function(){ const { C, Controls, Title, Explain, Node, Edge, Pseudo, fmt } = window.AlgLib;
const V = ["s", "t", "x", "y", "z"];
const P = /* @__PURE__ */ new Map([["s", [70, 250]], ["t", [220, 160]], ["x", [420, 160]], ["y", [220, 340]], ["z", [420, 340]]]);
const E = [["s", "t", 10, 0], ["s", "y", 5, 0], ["t", "x", 1, 0], ["t", "y", 2, 14], ["y", "t", 3, 14], ["x", "z", 4, 14], ["z", "x", 6, 14], ["y", "x", 9, 0], ["y", "z", 2, 0], ["z", "s", 7, 40]];
const Adj = new Map(V.map((v) => [v, E.filter((e) => e[0] === v)]));
const CODE = [
  "DIJKSTRA(G, w, s)",
  " 6  while Q \u2260 \u2205",
  " 7    u = EXTRACT-MIN(Q)",
  " 8    S = S \u222A {u}",
  " 9    for each v in G.Adj[u]",
  "10      RELAX(u, v, w)",
  "11      if RELAX senket v.d",
  "12        DECREASE-KEY(Q, v, v.d)"
];
function buildSteps() {
  const d = new Map(V.map((v) => [v, Infinity])), pi = new Map(V.map((v) => [v, null])), S = /* @__PURE__ */ new Set(), out = [];
  d.set("s", 0);
  const snap = (o) => out.push({ u: null, upd: [], ...o, d: new Map(d), pi: new Map(pi), S: new Set(S) });
  snap({ code: [], a: "Linje 1\u20135: s.d = 0, alle andre har d = \u221E. S = \u2205, og alle nodene legges i min-prioritetsk\xF8en Q med d som n\xF8kkel.", b: "S er nodene der d allerede er riktig. Krever at ingen kanter har negativ vekt." });
  while (S.size < V.length) {
    const u = V.filter((v) => !S.has(v)).sort((a, b) => d.get(a) - d.get(b) || a.localeCompare(b)).at(0);
    S.add(u);
    const upd = [];
    Adj.get(u).forEach(([, v, w]) => {
      if (d.get(u) + w < d.get(v)) {
        upd.push(`${v}: ${fmt(d.get(v))} \u2192 ${d.get(u) + w}`);
        d.set(v, d.get(u) + w);
        pi.set(v, u);
      }
    });
    snap({
      u,
      upd: upd.map((x) => x.at(0)),
      code: [7, 8, 9, 10].concat(upd.length ? [11, 12] : []),
      a: `Linje 7\u20138: EXTRACT-MIN gir ${u} med ${u}.d = ${d.get(u)}, som legges i S. ${u}.d er n\xE5 endelig.`,
      b: upd.length ? `Linje 9\u201312: kantene ut fra ${u} relakseres, og ${upd.join(", ")}.` : `Linje 9\u201312: kantene ut fra ${u} relakseres, men ingen gir kortere vei.`
    });
  }
  out.at(-1).b += " Ferdig: s 0, t 8, x 9, y 5, z 7.";
  return out;
}
const STEPS = buildSteps();
return () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const Qs = V.filter((v) => !st.S.has(v)).sort((a, b) => st.d.get(a) - st.d.get(b) || a.localeCompare(b));
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 520", role: "img", "aria-label": "Dijkstra steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement(Title, { title: "Dijkstra steg for steg", subtitle: "Grafen fra bokas figur 22.6 med kilde s; tallet i noden er v.d" }), /* @__PURE__ */ React.createElement(Controls, { s, N, setS }), E.map(([u, v, w, bend], k) => {
    const tree = st.pi.get(v) === u, out = u === st.u;
    return /* @__PURE__ */ React.createElement(
      Edge,
      {
        key: k,
        p: P.get(u),
        q: P.get(v),
        directed: true,
        bend,
        r: 24,
        label: w,
        color: tree ? C.accent : out ? C.cmp : C.edge,
        width: tree ? 3 : out ? 2 : 1.25
      }
    );
  }), V.map((v) => {
    const [x, y] = P.get(v), inS = st.S.has(v), cur = v === st.u, up = st.upd.includes(v);
    return /* @__PURE__ */ React.createElement("g", { key: v }, /* @__PURE__ */ React.createElement(
      Node,
      {
        x,
        y,
        r: 24,
        label: fmt(st.d.get(v)),
        fill: inS ? C.ink : "none",
        fillOpacity: inS ? 0.75 : 0,
        textFill: inS ? "var(--cds-chart-reference-tint)" : C.ink,
        stroke: cur ? C.accent : up ? C.good : C.edge,
        strokeWidth: cur || up ? 3 : 1.25
      }
    ), /* @__PURE__ */ React.createElement("text", { x, y: y + (y < 200 ? -32 : 44), textAnchor: "middle", fontSize: "13", fontWeight: "600", fill: C.quiet }, v));
  }), /* @__PURE__ */ React.createElement(Pseudo, { x: 500, y: 150, lines: CODE, active: st.code, w: 252 }), /* @__PURE__ */ React.createElement("text", { x: "500", y: "312", fontSize: "12", fill: C.quiet }, "Q sortert p\xE5 d (minst f\xF8rst)"), Qs.map((v, k) => /* @__PURE__ */ React.createElement("g", { key: `q${k}` }, /* @__PURE__ */ React.createElement("rect", { x: 500 + k * 50, y: "322", width: "46", height: "28", rx: "4", fill: "none", stroke: C.edge }), /* @__PURE__ */ React.createElement("text", { x: 523 + k * 50, y: "341", textAnchor: "middle", fontSize: "12", fill: C.ink }, `${v}:${fmt(st.d.get(v))}`))), /* @__PURE__ */ React.createElement("text", { x: "500", y: "372", fontSize: "12", fill: C.quiet }, `S = {${[...st.S].join(", ")}}  (svarte noder)`), /* @__PURE__ */ React.createElement(Explain, { y: 430, a: st.a, b: st.b }));
};
 })();
window.AlgWidgets["disjoint-sets"] = (function(){ const { C, Controls, Title, Explain, Node, Pseudo, Edge } = window.AlgLib;
const ELEMS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const LINK_CODE = [
  "LINK(x, y)",
  "1  if x.rank > y.rank",
  "2      y.p = x",
  "3  else x.p = y",
  "4      if x.rank == y.rank",
  "5          y.rank = y.rank + 1"
];
const FIND_CODE = [
  "FIND-SET(x)",
  "1  if x \u2260 x.p",
  "2      x.p = FIND-SET(x.p)",
  "3  return x.p"
];
const FIND = (n) => n + 10;
function buildSteps() {
  const p = /* @__PURE__ */ new Map(), rank = /* @__PURE__ */ new Map(), out = [];
  const snap = (o) => out.push({ hl: [], path: [], code: [], ...o, p: new Map(p), rank: new Map(rank) });
  ELEMS.forEach((x) => {
    p.set(x, x);
    rank.set(x, 0);
  });
  snap({ a: "MAKE-SET for hver av a\u2013h: hvert element er sin egen mengde, med x.p = x og x.rank = 0.", b: "Hver mengde er et tre. Roten er representanten og peker p\xE5 seg selv." });
  const findPath = (x) => {
    const path = [x];
    while (p.get(path.at(-1)) !== path.at(-1)) path.push(p.get(path.at(-1)));
    return path;
  };
  const find = (x, label) => {
    const path = findPath(x), root = path.at(-1);
    const changed = path.slice(0, -1).filter((v) => p.get(v) !== root);
    path.slice(0, -1).forEach((v) => p.set(v, root));
    snap({
      hl: [x, root],
      path,
      code: [FIND(1), FIND(2), FIND(3)],
      a: `${label}FIND-SET(${x}) g\xE5r stien ${path.join(" \u2192 ")} og returnerer roten ${root}.`,
      b: changed.length > 0 ? `Stikomprimering: ${changed.join(", ")} peker n\xE5 rett p\xE5 ${root}. Rangene endres ikke, s\xE5 rang er bare en \xF8vre grense for h\xF8yden.` : "Ingen noder \xE5 komprimere: alle p\xE5 stien peker allerede p\xE5 roten."
    });
    return root;
  };
  const link = (x, y) => {
    if (rank.get(x) > rank.get(y)) {
      p.set(y, x);
      snap({ hl: [x, y], code: [1, 2], a: `LINK(${x}, ${y}): ${x}.rank = ${rank.get(x)} > ${y}.rank = ${rank.get(y)}, s\xE5 ${y} henges under ${x}.`, b: "Union by rank: roten med lavest rang blir barn. Da vokser ikke h\xF8yden." });
    } else {
      p.set(x, y);
      const eq = rank.get(x) === rank.get(y);
      if (eq) rank.set(y, rank.get(y) + 1);
      snap({
        hl: [x, y],
        code: eq ? [1, 3, 4, 5] : [1, 3],
        a: `LINK(${x}, ${y}): ${x}.rank = ${rank.get(x)} ${eq ? "=" : "<"} ${y}.rank${eq ? " f\xF8r \xF8kningen" : ` = ${rank.get(y)}`}, s\xE5 ${x} henges under ${y}${eq ? `, og ${y}.rank \xF8ker til ${rank.get(y)}` : ""}.`,
        b: eq ? "Like ranger: det nye treet kan bli \xE9n h\xF8yere, s\xE5 rangen til den nye roten \xF8kes." : "Den laveste rangen henges under, s\xE5 rangen til roten er uendret."
      });
    }
  };
  const union = (x, y, simple) => {
    if (simple) {
      link(x, y);
      out.at(-1).a = `UNION(${x}, ${y}) = LINK(FIND-SET(${x}), FIND-SET(${y})) = ${out.at(-1).a}`;
      return;
    }
    const rx = find(x, `UNION(${x}, ${y}), del 1: `);
    const ry = find(y, `UNION(${x}, ${y}), del 2: `);
    link(rx, ry);
  };
  union("a", "b", true);
  union("c", "d", true);
  union("a", "c");
  union("e", "f", true);
  union("g", "h", true);
  union("e", "g");
  union("a", "e");
  find("b", "");
  out.at(-1).b += " Neste FIND-SET(b) tar bare ett steg.";
  find("c", "");
  return out;
}
function layout(p) {
  const kids = new Map(ELEMS.map((x) => [x, []]));
  const roots = [];
  ELEMS.forEach((x) => {
    if (p.get(x) === x) roots.push(x);
    else kids.get(p.get(x)).push(x);
  });
  const width = (x) => kids.get(x).length === 0 ? 1 : kids.get(x).reduce((s, c) => s + width(c), 0);
  const pos = /* @__PURE__ */ new Map();
  const place = (x, left2, depth) => {
    const w = width(x);
    pos.set(x, [left2 + w * 54 / 2, 200 + depth * 64]);
    let l = left2;
    kids.get(x).forEach((c) => {
      place(c, l, depth + 1);
      l += width(c) * 54;
    });
  };
  let left = 30;
  roots.forEach((r) => {
    place(r, left, 0);
    left += width(r) * 54 + 6;
  });
  return pos;
}
const STEPS = buildSteps();
return () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const pos = layout(st.p);
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 520", role: "img", "aria-label": "Disjunkte mengder steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement(Title, { title: "Disjunkte mengder som skog", subtitle: "Union by rank og stikomprimering; tallet ved hver node er rangen" }), /* @__PURE__ */ React.createElement(Controls, { s, N, setS }), /* @__PURE__ */ React.createElement("text", { x: "24", y: "140", fontSize: "12", fill: C.quiet }, "Pilene er foreldrepekere x.p. R\xF8ttene (med l\xF8kke) er representantene."), ELEMS.filter((x) => st.p.get(x) !== x).map((x) => {
    const onPath = st.path.includes(x);
    return /* @__PURE__ */ React.createElement(Edge, { key: `e${x}`, p: pos.get(x), q: pos.get(st.p.get(x)), directed: true, color: onPath ? C.cmp : C.edge, width: onPath ? 2.5 : 1.25 });
  }), ELEMS.filter((x) => st.p.get(x) === x).map((x) => {
    const [cx, cy] = pos.get(x);
    return /* @__PURE__ */ React.createElement("path", { key: `l${x}`, d: `M${cx - 8},${cy - 18} C${cx - 16},${cy - 48} ${cx + 16},${cy - 48} ${cx + 8},${cy - 18}`, fill: "none", stroke: C.edge, strokeWidth: "1.25" });
  }), ELEMS.map((x) => {
    const [cx, cy] = pos.get(x), on = st.hl.includes(x), root = st.p.get(x) === x;
    return /* @__PURE__ */ React.createElement("g", { key: x }, /* @__PURE__ */ React.createElement(Node, { x: cx, y: cy, label: x, fill: root ? C.accent : "none", fillOpacity: root ? 0.15 : 0, stroke: on ? C.cmp : C.edge, strokeWidth: on ? 3 : 1.25 }), /* @__PURE__ */ React.createElement("text", { x: cx + 23, y: cy + 4, fontSize: "11", fill: C.quiet }, st.rank.get(x)));
  }), /* @__PURE__ */ React.createElement(Pseudo, { x: 500, y: 140, lines: LINK_CODE, active: st.code.filter((n) => n < 10), w: 250 }), /* @__PURE__ */ React.createElement(Pseudo, { x: 500, y: 260, lines: FIND_CODE, active: st.code.filter((n) => n > 10).map((n) => n - 10), w: 250 }), /* @__PURE__ */ React.createElement(Explain, { y: 450, a: st.a, b: st.b }));
};
 })();
window.AlgWidgets["edmonds-karp"] = (function(){ const { C, Controls, Title, Explain, Node, Edge } = window.AlgLib;
const V = ["s", "v1", "v2", "v3", "v4", "t"];
const LBL = { s: "s", v1: "v\u2081", v2: "v\u2082", v3: "v\u2083", v4: "v\u2084", t: "t" };
const Q = { s: [20, 95], v1: [110, 25], v2: [110, 165], v3: [225, 25], v4: [225, 165], t: [315, 95] };
const E = [["s", "v1", 16], ["s", "v2", 13], ["v1", "v3", 12], ["v2", "v1", 4], ["v3", "v2", 9], ["v2", "v4", 14], ["v4", "v3", 7], ["v3", "t", 20], ["v4", "t", 4]];
const cap = new Map(E.map(([u, v, c]) => [`${u}|${v}`, c]));
function residual(f) {
  const r = [];
  E.forEach(([u, v, c]) => {
    const fl = f.get(`${u}|${v}`);
    if (c - fl > 0) r.push([u, v, c - fl, false]);
    if (fl > 0) r.push([v, u, fl, true]);
  });
  return r;
}
function bfs(res) {
  const pi = /* @__PURE__ */ new Map([["s", null]]), queue = ["s"];
  while (queue.length) {
    const u = queue.shift();
    V.forEach((v) => {
      const e = res.find((x) => x[0] === u && x[1] === v);
      if (e && !pi.has(v)) {
        pi.set(v, u);
        queue.push(v);
      }
    });
  }
  if (!pi.has("t")) return { path: null, reach: new Set(pi.keys()) };
  const path = ["t"];
  while (path.at(0) !== "s") path.unshift(pi.get(path.at(0)));
  return { path, reach: new Set(pi.keys()) };
}
function buildSteps() {
  const f = new Map(E.map(([u, v]) => [`${u}|${v}`, 0])), out = [];
  let value = 0, it = 0;
  out.push({
    res: residual(f),
    f: new Map(f),
    path: [],
    value,
    cut: null,
    a: "Linje 1\u20132: flyten er 0 p\xE5 alle kanter. Restnettet G_f er da det samme som G.",
    b: "Edmonds-Karp er Ford-Fulkerson der den for\xF8kende stien finnes med BFS, alts\xE5 en sti med f\xE6rrest mulig kanter."
  });
  for (; ; ) {
    const res = residual(f), { path, reach } = bfs(res);
    if (!path) {
      const cut = E.filter(([u, v]) => reach.has(u) && !reach.has(v));
      const cc = cut.reduce((s, e) => s + e[2], 0);
      out.push({
        res,
        f: new Map(f),
        path: [],
        value,
        cut: { S: reach, edges: cut.map(([u, v]) => `${u}|${v}`), cap: cc },
        a: `BFS finner ingen sti fra s til t i G_f, s\xE5 flyten er maksimal: |f| = ${value}.`,
        b: `Nodene som kan n\xE5s fra s i G_f, S = {${[...reach].map((x) => LBL[x]).join(", ")}}, gir et minimalt snitt. Kantene ut av S er fulle, og c(S, T) = ${cut.map((e) => e[2]).join(" + ")} = ${cc} = |f|.`
      });
      break;
    }
    it += 1;
    const edges = path.slice(1).map((v, i) => res.find((x) => x[0] === path[i] && x[1] === v));
    const cf = Math.min(...edges.map((e) => e[2]));
    const back = edges.filter((e) => e[3]);
    edges.forEach(([u, v, , isBack]) => {
      if (!isBack) f.set(`${u}|${v}`, f.get(`${u}|${v}`) + cf);
      else f.set(`${v}|${u}`, f.get(`${v}|${u}`) - cf);
    });
    value += cf;
    out.push({
      res,
      f: new Map(f),
      path,
      value,
      cut: null,
      a: `Iterasjon ${it}: BFS finner p = ${path.map((x) => LBL[x]).join(" \u2192 ")} med c_f(p) = min(${edges.map((e) => e[2]).join(", ")}) = ${cf}. Flyten \xF8kes med ${cf}, til |f| = ${value}.`,
      b: back.length ? `Stien bruker ${back.map((e) => `(${LBL[e[0]]}, ${LBL[e[1]]})`).join(", ")} baklengs, s\xE5 flyt p\xE5 den opprinnelige kanten oppheves (linje 8).` : "Venstre: restnettet f\xF8r \xF8kningen, med stien uthevet. H\xF8yre: flyten etterp\xE5."
    });
  }
  return out;
}
const STEPS = buildSteps();
function Panel({ x0, y0, title, children }) {
  return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("text", { x: x0, y: y0 - 20, fontSize: "12", fontWeight: "600", fill: C.quiet }, title), /* @__PURE__ */ React.createElement("g", { transform: `translate(${x0 + 15}, ${y0})` }, children));
}
return () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const onPath = (u, v) => {
    const i = st.path.indexOf(u);
    return i >= 0 && st.path.at(i + 1) === v;
  };
  const both = (u, v) => st.res.some((e) => e[0] === u && e[1] === v) && st.res.some((e) => e[0] === v && e[1] === u);
  const inS = (v) => st.cut && st.cut.S.has(v);
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 530", role: "img", "aria-label": "Edmonds-Karp steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement(Title, { title: "Edmonds-Karp (Ford-Fulkerson med BFS) steg for steg", subtitle: "Flytnettet fra bokas figur 24.1; venstre er restnettet G_f, h\xF8yre er flyten f/c" }), /* @__PURE__ */ React.createElement(Controls, { s, N, setS }), /* @__PURE__ */ React.createElement(Panel, { x0: 20, y0: 170, title: st.cut ? "Restnett G_f (ingen sti til t)" : "Restnett G_f med for\xF8kende sti" }, st.res.map(([u, v, rc, isBack], k) => {
    const pth = onPath(u, v);
    return /* @__PURE__ */ React.createElement(
      Edge,
      {
        key: k,
        p: Q[u],
        q: Q[v],
        directed: true,
        r: 18,
        bend: both(u, v) ? 12 : 0,
        label: rc,
        color: pth ? C.cmp : isBack ? C.purple : C.edge,
        width: pth ? 3 : 1.25,
        dash: isBack && !pth ? "4 3" : void 0
      }
    );
  }), V.map((v) => /* @__PURE__ */ React.createElement(
    Node,
    {
      key: v,
      x: Q[v][0],
      y: Q[v][1],
      r: 18,
      label: LBL[v],
      fill: inS(v) ? C.accent : "none",
      fillOpacity: inS(v) ? 0.25 : 0,
      stroke: st.path.includes(v) ? C.cmp : C.edge,
      strokeWidth: st.path.includes(v) ? 2.5 : 1.25
    }
  ))), /* @__PURE__ */ React.createElement(Panel, { x0: 395, y0: 170, title: `Flyt f, |f| = ${st.value}` }, E.map(([u, v, c], k) => {
    const fl = st.f.get(`${u}|${v}`), cutE = st.cut && st.cut.edges.includes(`${u}|${v}`);
    return /* @__PURE__ */ React.createElement(
      Edge,
      {
        key: k,
        p: Q[u],
        q: Q[v],
        directed: true,
        r: 18,
        label: `${fl}/${c}`,
        color: cutE ? C.bad : fl > 0 ? C.accent : C.edge,
        width: cutE ? 3 : fl > 0 ? 1 + fl / c * 2.5 : 1.25
      }
    );
  }), V.map((v) => /* @__PURE__ */ React.createElement(Node, { key: v, x: Q[v][0], y: Q[v][1], r: 18, label: LBL[v], fill: inS(v) ? C.accent : "none", fillOpacity: inS(v) ? 0.25 : 0 }))), /* @__PURE__ */ React.createElement("text", { x: "24", y: "400", fontSize: "12", fill: C.quiet }, "Restnett: gr\xE5 = c \u2212 f p\xE5 kanter i G, lilla stiplet = f baklengs (kan oppheves), oransje = for\xF8kende sti."), /* @__PURE__ */ React.createElement("text", { x: "24", y: "418", fontSize: "12", fill: C.quiet }, st.cut ? "Fylte noder = S. R\xF8de kanter = snittkantene fra S til T, alle fulle." : "Flyt: bl\xE5 kanter har flyt, tykkere jo fullere de er."), /* @__PURE__ */ React.createElement(Explain, { y: 452, a: st.a, b: st.b }));
};
 })();
window.AlgWidgets["floyd-warshall"] = (function(){ const { C, Controls, Title, Explain, Node, Edge, Matrix, fmt } = window.AlgLib;
const n = 5;
const P = [[60, 250], [150, 170], [250, 250], [210, 345], [100, 345]];
const E = [[1, 2, 3], [1, 3, 8, 0.2], [1, 5, -4], [2, 4, 1, 0.72], [2, 5, 7, 0.72], [3, 2, 4], [4, 1, 2, 0.3], [4, 3, -5], [5, 4, 6]];
const LBL = [1, 2, 3, 4, 5];
function buildSteps() {
  let D = [...Array(n)].map((_, i) => [...Array(n)].map((__, j) => i === j ? 0 : Infinity));
  let Pi = [...Array(n)].map(() => [...Array(n)].map(() => null));
  E.forEach(([u, v, w]) => {
    D[u - 1][v - 1] = w;
    Pi[u - 1][v - 1] = u;
  });
  const out = [];
  out.push({
    k: 0,
    D: D.map((r) => r.slice()),
    Pi: Pi.map((r) => r.slice()),
    changed: [],
    path: [],
    a: "D\u207D\u2070\u207E = W: kantvektene, 0 p\xE5 diagonalen og \u221E der det ikke er noen kant. \u03C0\u207D\u2070\u207E\u1D62\u2C7C = i hvis (i, j) er en kant, ellers NIL.",
    b: "D\u207D\u1D4F\u207E\u1D62\u2C7C er lengden av korteste vei fra i til j der alle mellomnodene er i {1, \u2026, k}."
  });
  for (let k = 1; k <= n; k += 1) {
    const ND = D.map((r) => r.slice()), NP = Pi.map((r) => r.slice()), changed = [];
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) {
        const via = D[i][k - 1] + D[k - 1][j];
        if (via < D[i][j]) {
          ND[i][j] = via;
          NP[i][j] = Pi[k - 1][j];
          changed.push([i, j, D[i][j], via]);
        }
      }
    }
    D = ND;
    Pi = NP;
    const ex = changed.slice(0, 3).map(([i, j, o, nw]) => `d${i + 1}${j + 1}: ${fmt(o)} \u2192 ${fmt(nw)}`).join(", ");
    out.push({
      k,
      D: D.map((r) => r.slice()),
      Pi: Pi.map((r) => r.slice()),
      changed,
      path: [],
      a: `k = ${k}: n\xE5 kan node ${k} brukes som mellomnode. For hver (i, j): d\u1D62\u2C7C = min(d\u1D62\u2C7C, d\u1D62\u2096 + d\u2096\u2C7C). ${changed.length} celler blir bedre${changed.length ? `, f.eks. ${ex}` : ""}.`,
      b: `N\xE5r en celle blir bedre, settes \u03C0\u1D62\u2C7C = \u03C0\u2096\u2C7C: forgjengeren til j p\xE5 den beste veien fra ${k} til j. Rad og kolonne ${k} (markert) endres aldri i runde k.`
    });
  }
  const path = [];
  const rec = (i, j) => {
    if (i === j) {
      path.push(i);
      return;
    }
    rec(i, Pi[i - 1][j - 1]);
    path.push(j);
  };
  rec(1, 2);
  out.push({
    k: n,
    D,
    Pi,
    changed: [],
    path,
    print: true,
    a: `PRINT-ALL-PAIRS-SHORTEST-PATH(\u03A0, 1, 2): \u03C0\u2081\u2082 = 3, \u03C0\u2081\u2083 = 4, \u03C0\u2081\u2084 = 5, \u03C0\u2081\u2085 = 1. Utskrift p\xE5 vei tilbake fra rekursjonen: ${path.join(" \u2192 ")}.`,
    b: `Lengden er d\u2081\u2082 = ${D[0][1]}: (\u22124) + 6 + (\u22125) + 4. Rad i i \u03A0 er et korteste-vei-tre med rot i.`
  });
  return out;
}
const STEPS = buildSteps();
return () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const hlD = /* @__PURE__ */ new Map(), hlP = /* @__PURE__ */ new Map();
  st.changed.forEach(([i, j]) => {
    hlD.set(`${i},${j}`, C.good);
    hlP.set(`${i},${j}`, C.good);
  });
  if (st.k > 0 && !st.print) {
    for (let t = 0; t < n; t += 1) {
      [`${st.k - 1},${t}`, `${t},${st.k - 1}`].forEach((key) => {
        if (!hlD.has(key)) hlD.set(key, C.accent);
      });
    }
  }
  if (st.print) st.path.slice(1).forEach((j) => hlP.set(`0,${j - 1}`, C.cmp));
  const onPath = (u, v) => {
    const i = st.path.indexOf(u);
    return i >= 0 && st.path.at(i + 1) === v;
  };
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 520", role: "img", "aria-label": "Floyd-Warshall steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement(Title, { title: "Floyd-Warshall steg for steg", subtitle: "Grafen fra bokas figur 23.1; ett steg per verdi av k (bokas figur 23.4)" }), /* @__PURE__ */ React.createElement(Controls, { s, N, setS }), E.map(([u, v, w, lt], idx) => {
    const pth = onPath(u, v), viaK = st.k > 0 && !st.print && (u === st.k || v === st.k);
    return /* @__PURE__ */ React.createElement(
      Edge,
      {
        key: idx,
        p: P[u - 1],
        q: P[v - 1],
        directed: true,
        label: fmt(w),
        labelT: lt || 0.5,
        r: 18,
        color: pth ? C.cmp : viaK ? C.accent : C.edge,
        width: pth ? 3 : viaK ? 2 : 1.25
      }
    );
  }), LBL.map((v, i) => /* @__PURE__ */ React.createElement(
    Node,
    {
      key: v,
      x: P[i][0],
      y: P[i][1],
      r: 18,
      label: v,
      fill: st.k === v && !st.print ? C.accent : "none",
      fillOpacity: st.k === v && !st.print ? 0.25 : 0
    }
  )), /* @__PURE__ */ React.createElement(Matrix, { x: 290, y: 160, label: `D\u207D${"\u2070\xB9\xB2\xB3\u2074\u2075".charAt(st.k)}\u207E`, data: st.D.map((r) => r.map(fmt)), hl: hlD, rowLabels: LBL, colLabels: LBL }), /* @__PURE__ */ React.createElement(Matrix, { x: 520, y: 160, label: `\u03A0\u207D${"\u2070\xB9\xB2\xB3\u2074\u2075".charAt(st.k)}\u207E`, data: st.Pi.map((r) => r.map((v) => v === null ? "NIL" : v)), hl: hlP, rowLabels: LBL, colLabels: LBL, size: 11 }), /* @__PURE__ */ React.createElement("text", { x: "290", y: "310", fontSize: "12", fill: C.quiet }, "Gr\xF8nn = forbedret i denne runden. Bl\xE5 = rad og kolonne k, som brukes i formelen."), /* @__PURE__ */ React.createElement("text", { x: "290", y: "330", fontSize: "12", fill: C.quiet }, st.print ? "Oransje i \u03A0: forgjengerne som f\xF8lges i rad 1." : `d\u1D62\u2C7C\u207D\u1D4F\u207E = min(d\u1D62\u2C7C\u207D\u1D4F\u207B\xB9\u207E, d\u1D62\u2096\u207D\u1D4F\u207B\xB9\u207E + d\u2096\u2C7C\u207D\u1D4F\u207B\xB9\u207E)`), /* @__PURE__ */ React.createElement(Explain, { y: 410, a: st.a, b: st.b }));
};
 })();
window.AlgWidgets["heapsort"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", tint = "var(--cds-chart-reference-tint)", accent = "var(--cds-chart-categorical-1)", cmpc = "var(--cds-chart-categorical-2)";
  const steps = (() => {
    const A = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7], out = [];
    let hs = 10, phase = "Build-Max-Heap";
    const snap = (o) => out.push({ hi: -1, sw: [], ...o, hs, phase, A: A.slice() });
    const swap = (a, b) => {
      const t = A.at(a - 1);
      A.splice(a - 1, 1, A.at(b - 1));
      A.splice(b - 1, 1, t);
    };
    const heapify = (i) => {
      let cur = i, go2 = true;
      while (go2) {
        const l = 2 * cur, r = 2 * cur + 1;
        let lg = cur;
        if (l <= hs && A.at(l - 1) > A.at(cur - 1)) {
          lg = l;
        }
        if (r <= hs && A.at(r - 1) > A.at(lg - 1)) {
          lg = r;
        }
        if (lg !== cur) {
          const vc = A.at(cur - 1), vl = A.at(lg - 1);
          swap(cur, lg);
          const leaf = 2 * lg > hs;
          snap({ hi: cur, sw: [cur, lg], a: `Max-Heapify(A, ${cur}): st\xF8rst av node ${cur} og barna er A[${lg}] = ${vl}, s\xE5 ${vc} og ${vl} byttes.`, b: leaf ? `Node ${lg} er et l\xF8v, s\xE5 Max-Heapify er ferdig.` : `Haugegenskapen kan v\xE6re brutt i node ${lg}, s\xE5 Max-Heapify(A, ${lg}) kalles.` });
          cur = lg;
        } else {
          if (cur === i) {
            snap({ hi: cur, a: `Max-Heapify(A, ${cur}): A[${cur}] = ${A.at(cur - 1)} er minst like stor som barna. Ingen bytte.`, b: "Deltreet med rot i denne noden er allerede en max-haug." });
          }
          go2 = false;
        }
      }
    };
    snap({ a: "Start: A = \u27E84, 1, 3, 2, 16, 9, 10, 14, 8, 7\u27E9 tolket som et bin\xE6rt tre. Det er ikke en haug.", b: "Build-Max-Heap kaller Max-Heapify for i = \u230A10/2\u230B = 5 ned til 1. Node 6\u201310 er l\xF8v." });
    for (let i = 5; i >= 1; i -= 1) {
      heapify(i);
    }
    snap({ a: "Build-Max-Heap er ferdig: A er en max-haug med 16 i roten.", b: "N\xE5 starter Heapsort: flytt roten bakerst, krymp haugen og reparer." });
    phase = "Heapsort";
    for (let i = 10; i >= 2; i -= 1) {
      const mx = A.at(0);
      swap(1, i);
      hs -= 1;
      snap({ sw: [1, i], a: `Heapsort, i = ${i}: bytt A[1] = ${mx} med A[${i}], og reduser heap-size til ${hs}.`, b: `A[${i} : 10] inneholder n\xE5 de ${11 - i} st\xF8rste elementene, sortert. Roten m\xE5 repareres.` });
      heapify(1);
    }
    phase = "Ferdig";
    snap({ a: "Ferdig: A = \u27E81, 2, 3, 4, 7, 8, 9, 10, 14, 16\u27E9.", b: "Hver av de n \u2212 1 iterasjonene kostet O(lg n), s\xE5 Heapsort tar O(n lg n)." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const lev = (i) => Math.floor(Math.log2(i));
  const nx = (i) => 80 + (i - Math.pow(2, lev(i)) + 0.5) * 600 / Math.pow(2, lev(i)), ny = (i) => 136 + lev(i) * 56;
  const cx = (c) => 80 + c * 48;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const seg = (i) => {
    const px = nx(Math.floor(i / 2)), py = ny(Math.floor(i / 2)), qx = nx(i), qy = ny(i), L = Math.hypot(qx - px, qy - py), ux = (qx - px) / L, uy = (qy - py) / L;
    return [px + ux * 18, py + uy * 18, qx - ux * 18, qy - uy * 18];
  };
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 480", role: "img", "aria-label": "Heapsort steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Build-Max-Heap og Heapsort steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Treet og tabellen er samme data; hvert trykk er \xE9n ombytting"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N} \xB7 ${st.phase}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "tree" }, ids.filter((i) => i > 1).map((i) => /* @__PURE__ */ React.createElement("line", { key: `e${i}`, x1: seg(i).at(0), y1: seg(i).at(1), x2: seg(i).at(2), y2: seg(i).at(3), stroke: edge, strokeWidth: "1", opacity: i > st.hs ? 0.3 : 1 })), ids.map((i) => {
    const sw = st.sw.includes(i), out = i > st.hs, cur = i === st.hi && !sw;
    return /* @__PURE__ */ React.createElement("g", { key: `n${i}` }, /* @__PURE__ */ React.createElement("circle", { cx: nx(i), cy: ny(i), r: "18", fill: sw ? accent : out ? tint : "var(--cds-chart-background, none)", fillOpacity: sw ? 0.2 : 1, stroke: sw ? accent : cur ? cmpc : edge, strokeWidth: sw || cur ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: nx(i), y: ny(i) + 4.5, textAnchor: "middle", fontWeight: sw ? 600 : 400, fill: ink, fillOpacity: out ? 0.55 : 1 }, st.A.at(i - 1)), /* @__PURE__ */ React.createElement("text", { x: nx(i) + (i % 2 === 0 ? -24 : 24), y: ny(i) - 14, textAnchor: "middle", fontSize: "10.5", fill: quiet }, i));
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "array" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "382", fontWeight: "600", fill: ink }, "A"), st.A.map((v, c) => {
    const i = c + 1, sw = st.sw.includes(i), out = i > st.hs;
    return /* @__PURE__ */ React.createElement("g", { key: `a${c}` }, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 22, y: "360", width: "44", height: "36", fill: sw ? accent : out ? tint : "none", fillOpacity: sw ? 0.2 : 1, stroke: sw ? accent : edge, strokeWidth: sw ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "383", textAnchor: "middle", fontWeight: sw ? 600 : 400, fill: ink }, v), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "412", textAnchor: "middle", fontSize: "11.5", fill: quiet }, i));
  }), /* @__PURE__ */ React.createElement("line", { x1: cx(st.hs - 1) + 24, y1: "352", x2: cx(st.hs - 1) + 24, y2: "404", stroke: cmpc, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: cx(st.hs - 1) + 30, y: "352", fontSize: "11.5", fill: cmpc }, `heap-size = ${st.hs}`)), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "446", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "468", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["huffman"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", tint = "var(--cds-chart-reference-tint)", accent = "var(--cds-chart-categorical-1)", cmpc = "var(--cds-chart-categorical-2)", good = "var(--cds-chart-status-good)";
  const X = /* @__PURE__ */ new Map([["a", 120], ["c", 220], ["b", 320], ["f", 420], ["e", 520], ["d", 620]]);
  const F = /* @__PURE__ */ new Map([["a", 45], ["b", 13], ["c", 12], ["d", 16], ["e", 9], ["f", 5]]);
  const H = /* @__PURE__ */ new Map(), Lc = /* @__PURE__ */ new Map(), Rc = /* @__PURE__ */ new Map();
  ["a", "b", "c", "d", "e", "f"].forEach((k) => H.set(k, 0));
  const steps = (() => {
    const out = [];
    let Q = ["a", "b", "c", "d", "e", "f"];
    const made = [];
    const qs = () => Q.slice().sort((u, v) => F.get(u) - F.get(v));
    out.push({ made: [], q: qs(), x: null, y: null, z: null, codes: false, a: "Start: Q inneholder de seks tegnene som l\xF8vnoder, med frekvens (i tusen).", b: "Hver iterasjon tar ut de to med lavest frekvens og sl\xE5r dem sammen." });
    for (let i = 1; i <= 5; i += 1) {
      const srt = qs();
      const x = srt.at(0), y = srt.at(1);
      const fz = F.get(x) + F.get(y);
      const z = `n${fz}`;
      F.set(z, fz);
      H.set(z, 1 + Math.max(H.get(x), H.get(y)));
      Lc.set(z, x);
      Rc.set(z, y);
      X.set(z, (X.get(x) + X.get(y)) / 2);
      Q = Q.filter((k) => k !== x && k !== y);
      Q.push(z);
      made.push(z);
      const nm = (k) => k.length === 1 ? `${k}:${F.get(k)}` : `${F.get(k)}`;
      out.push({ made: made.slice(), q: qs(), x, y, z, codes: false, a: `Iterasjon ${i}: Extract-Min gir x = ${nm(x)} og y = ${nm(y)}. Ny node z med frekvens ${F.get(x)} + ${F.get(y)} = ${fz}.`, b: i < 5 ? `z settes inn i Q. Det er n\xE5 ${Q.length} tr\xE6r igjen.` : "Bare roten er igjen i Q. Treet er ferdig etter n \u2212 1 = 5 iterasjoner." });
    }
    out.push({ made: made.slice(), q: qs(), x: null, y: null, z: null, codes: true, a: "Kodeordene: a = 0, c = 100, b = 101, f = 1100, e = 1101, d = 111 (0 = venstre, 1 = h\xF8yre).", b: "Kostnad: 45\xB71 + 12\xB73 + 13\xB73 + 5\xB74 + 9\xB74 + 16\xB73 = 224 tusen bits, mot 300 tusen med 3 bits per tegn." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const ny = (k) => 344 - H.get(k) * 52;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const shown = (k) => k.length === 1 || st.made.includes(k);
  const nodes = ["a", "b", "c", "d", "e", "f", "n14", "n25", "n30", "n55", "n100"];
  const seg = (p, c) => {
    const px = X.get(p), py = ny(p), qx = X.get(c), qy = ny(c), L = Math.hypot(qx - px, qy - py), ux = (qx - px) / L, uy = (qy - py) / L;
    return [px + ux * 18, py + uy * 18, qx - ux * 18, qy - uy * 18];
  };
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 470", role: "img", "aria-label": "Huffman steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Huffman steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Frekvensene fra bokas figur 15.5; hvert trykk sl\xE5r sammen de to minste"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "queue" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "q-label", x: "24", y: "128", fontSize: "12", fill: quiet }, "Q (min-prioritetsk\xF8):"), /* @__PURE__ */ React.createElement("text", { x: "160", y: "128", fontSize: "12", fontWeight: "600", fill: ink }, st.q.map((k) => k.length === 1 ? `${k}:${F.get(k)}` : `${F.get(k)}`).join("   "))), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "tree" }, nodes.filter((k) => k.length > 1 && shown(k)).map((z) => /* @__PURE__ */ React.createElement("g", { key: `e${z}` }, [Lc.get(z), Rc.get(z)].map((c, t) => {
    const g = seg(z, c), on = z === st.z;
    return /* @__PURE__ */ React.createElement("g", { key: `${z}${c}` }, /* @__PURE__ */ React.createElement("line", { x1: g.at(0), y1: g.at(1), x2: g.at(2), y2: g.at(3), stroke: on ? accent : edge, strokeWidth: on ? 2 : 1 }), st.codes ? /* @__PURE__ */ React.createElement("text", { x: (g.at(0) + g.at(2)) / 2 + (t === 0 ? -10 : 10), y: (g.at(1) + g.at(3)) / 2, textAnchor: "middle", fontSize: "12", fontWeight: "600", fill: cmpc }, t) : null);
  }))), nodes.filter(shown).map((k) => {
    const leaf = k.length === 1, isZ = k === st.z, isXY = k === st.x || k === st.y, inQ = st.q.includes(k);
    const col = isZ ? accent : isXY ? cmpc : st.codes && leaf ? good : edge;
    return /* @__PURE__ */ React.createElement("g", { key: `n${k}` }, leaf ? /* @__PURE__ */ React.createElement("rect", { x: X.get(k) - 22, y: ny(k) - 16, width: "44", height: "32", rx: "6", fill: col, fillOpacity: isXY || st.codes && leaf ? 0.16 : inQ ? 0 : 0, stroke: col, strokeWidth: isXY || isZ || inQ ? 2 : 1 }) : /* @__PURE__ */ React.createElement("circle", { cx: X.get(k), cy: ny(k), r: "18", fill: col, fillOpacity: isZ ? 0.18 : 0, stroke: col, strokeWidth: isZ || inQ ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: X.get(k), y: ny(k) + 4.5, textAnchor: "middle", fontSize: "12", fontWeight: isZ || isXY ? 600 : 400, fill: ink }, leaf ? `${k}:${F.get(k)}` : `${F.get(k)}`));
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "legend" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg", x: "24", y: "392", fontSize: "12", fill: quiet }, "Tykk kant: treet er en rot i Q. Farget: x og y tas ut, z er den nye noden.")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "432", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "454", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["insertion-sort"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", tint = "var(--cds-chart-reference-tint)", accent = "var(--cds-chart-categorical-1)", cmpc = "var(--cds-chart-categorical-2)";
  const steps = (() => {
    const A = [5, 2, 4, 6, 1, 3], out = [];
    const snap = (o) => out.push({ j: -1, key: null, hole: 0, cmp: 0, ...o, A: A.slice() });
    snap({ line: 0, i: 0, sorted: 0, a: "Start: A = \u27E85, 2, 4, 6, 1, 3\u27E9 og n = 6.", b: "For-l\xF8kken begynner med i = 2, fordi A[1 : 1] alene allerede er sortert." });
    for (let i = 2; i <= 6; i++) {
      const key = A.at(i - 1);
      snap({ line: 2, i, key, hole: i, sorted: i - 1, a: `Linje 2: i = ${i}, key = A[${i}] = ${key}. Plass ${i} er n\xE5 et hull.`, b: `Invarianten: A[1 : ${i - 1}] er sortert. Key skal settes inn blant disse.` });
      let j = i - 1, going = true;
      while (going) {
        const base = { line: 5, i, j, key, hole: j + 1, sorted: i - 1 };
        if (j === 0) {
          snap({ ...base, a: "Linje 5: j = 0, s\xE5 testen j > 0 er usann og while-l\xF8kken stopper.", b: "Key er mindre enn alt i den sorterte delen og skal helt fremst, p\xE5 plass 1." });
          going = false;
        } else if (A.at(j - 1) <= key) {
          snap({ ...base, cmp: j, a: `Linje 5: A[${j}] = ${A.at(j - 1)} \u2264 key = ${key}, s\xE5 testen er usann og l\xF8kken stopper.`, b: `Alt til venstre for plass ${j + 1} er \u2264 key, og alt til h\xF8yre er > key.` });
          going = false;
        } else {
          snap({ ...base, cmp: j, a: `Linje 5: A[${j}] = ${A.at(j - 1)} > key = ${key}, s\xE5 testen er sann.`, b: `Linje 6\u20137: ${A.at(j - 1)} kopieres til A[${j + 1}], og j minker til ${j - 1}.` });
          A.splice(j, 1, A.at(j - 1));
          j = j - 1;
        }
      }
      A.splice(j, 1, key);
      snap({ line: 8, i, j, sorted: i, a: `Linje 8: A[${j + 1}] = key = ${key}.`, b: `N\xE5 er A[1 : ${i}] sortert, s\xE5 invarianten holder n\xE5r i \xF8ker til ${i + 1}.` });
    }
    snap({ line: 1, i: 7, sorted: 6, a: "Linje 1: i = 7 = n + 1, s\xE5 for-l\xF8kken stopper.", b: "Invarianten med i = n + 1 sier at hele A[1 : 6] er sortert." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const cx = (c) => 74 + c * 52, lineY = (k) => 134 + 22 * k;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const mono = "ui-monospace, Menlo, Consolas, monospace";
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 396", role: "img", "aria-label": "Insertion-Sort steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Insertion-Sort steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Hvert trykk p\xE5 Neste utf\xF8rer \xE9n linje eller \xE9n test i while-l\xF8kken"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "array" }, st.key !== null ? /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("rect", { x: cx(st.hole - 1) - 24, y: "124", width: "48", height: "40", rx: "6", fill: accent, fillOpacity: "0.15", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: cx(st.hole - 1), y: "149", textAnchor: "middle", fontWeight: "600", fill: ink }, st.key), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "key-tag", x: cx(st.hole - 1) - 30, y: "149", textAnchor: "end", fontSize: "11.5", fill: quiet }, "key"), /* @__PURE__ */ React.createElement("line", { x1: cx(st.hole - 1), y1: "164", x2: cx(st.hole - 1), y2: "180", stroke: accent, strokeWidth: "1.25", strokeDasharray: "3 3" })) : null, [0, 1, 2, 3, 4, 5].map((c) => {
    const hole = c === st.hole - 1, cmp = c === st.cmp - 1, srt = c < st.sorted && !hole;
    return /* @__PURE__ */ React.createElement("g", { key: c }, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 24, y: "180", width: "48", height: "40", fill: srt ? tint : "none", stroke: cmp ? cmpc : edge, strokeWidth: cmp ? 2 : 1, strokeDasharray: hole ? "4 3" : "none" }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "205", textAnchor: "middle", fontWeight: cmp ? 600 : 400, fill: hole ? quiet : ink, fillOpacity: hole ? 0.5 : 1 }, st.A.at(c)), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "240", textAnchor: "middle", fontSize: "11.5", fill: quiet }, c + 1));
  }), st.i >= 2 && st.i <= 6 ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "i-mark", x: cx(st.i - 1), y: "262", textAnchor: "middle", fontWeight: "600", fill: ink }, "\u2191 i") : null, st.j >= 1 ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "j-mark", x: cx(st.j - 1), y: "262", textAnchor: "middle", fontWeight: "600", fill: cmpc }, "\u2191 j") : null, st.j === 0 ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "j-zero", x: "24", y: "262", fontWeight: "600", fill: cmpc }, "j = 0") : null), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "variables" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "294", fill: ink }, `i = ${st.i >= 2 && st.i <= 7 ? st.i : "\u2013"}`), /* @__PURE__ */ React.createElement("text", { x: "104", y: "294", fill: ink }, `j = ${st.j >= 0 ? st.j : "\u2013"}`), /* @__PURE__ */ React.createElement("text", { x: "184", y: "294", fill: ink }, `key = ${st.key !== null ? st.key : "\u2013"}`)), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "pseudocode", fontFamily: mono, fontSize: "12" }, /* @__PURE__ */ React.createElement("rect", { x: "392", y: "112", width: "344", height: "212", rx: "8", fill: "none", stroke: edge, strokeWidth: "1" }), st.line > 0 ? /* @__PURE__ */ React.createElement("rect", { x: "396", y: lineY(st.line) - 15, width: "336", height: "21", rx: "4", fill: accent, fillOpacity: "0.18" }) : null, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-head", x: "404", y: lineY(0), fontWeight: "600", fill: ink }, "INSERTION-SORT(A, n)"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n1", x: "404", y: lineY(1), fill: quiet }, "1"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-1", x: "428", y: lineY(1), fill: ink }, "for i = 2 to n"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n2", x: "404", y: lineY(2), fill: quiet }, "2"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-2", x: "448", y: lineY(2), fill: ink }, "key = A[i]"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n3", x: "404", y: lineY(3), fill: quiet }, "3"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-3", x: "448", y: lineY(3), fill: quiet }, "// sett inn A[i] i A[1 : i \u2212 1]"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n4", x: "404", y: lineY(4), fill: quiet }, "4"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-4", x: "448", y: lineY(4), fill: ink }, "j = i \u2212 1"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n5", x: "404", y: lineY(5), fill: quiet }, "5"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-5", x: "448", y: lineY(5), fill: ink }, "while j > 0 and A[j] > key"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n6", x: "404", y: lineY(6), fill: quiet }, "6"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-6", x: "468", y: lineY(6), fill: ink }, "A[j + 1] = A[j]"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n7", x: "404", y: lineY(7), fill: quiet }, "7"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-7", x: "468", y: lineY(7), fill: ink }, "j = j \u2212 1"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n8", x: "404", y: lineY(8), fill: quiet }, "8"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-8", x: "448", y: lineY(8), fill: ink }, "A[j + 1] = key")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "354", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "376", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["knapsack"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", tint = "var(--cds-chart-reference-tint)", accent = "var(--cds-chart-categorical-1)", cmpc = "var(--cds-chart-categorical-2)", c3 = "var(--cds-chart-categorical-3)", good = "var(--cds-chart-status-good)";
  const w = [2, 3, 4, 5], v = [3, 4, 5, 6], n = 4, W = 5;
  const steps = (() => {
    const K = [], out = [];
    for (let i = 0; i <= n; i += 1) {
      K.push([0, 0, 0, 0, 0, 0]);
    }
    const snap = (o) => out.push({ ii: 0, jj: -1, dx: null, dy: null, take: [], path: [], ...o, K: K.map((r) => r.slice()) });
    snap({ a: "Linje 1\u20133: K[0, j] = 0 for alle j. Uten gjenstander er verdien 0.", b: "Hver celle K[i, j] er beste verdi med gjenstand 1..i og kapasitet j." });
    for (let i = 1; i <= n; i += 1) {
      const wi = w.at(i - 1), vi = v.at(i - 1);
      for (let j2 = 0; j2 <= W; j2 += 1) {
        const x = K.at(i - 1).at(j2);
        if (j2 < wi) {
          K.at(i).splice(j2, 1, x);
          snap({ ii: i, jj: j2, dx: [i - 1, j2], a: `i = ${i}, j = ${j2}: w${i} = ${wi} > j, s\xE5 gjenstand ${i} f\xE5r ikke plass. K[${i}, ${j2}] = x = ${x}.`, b: "Linje 7\u20138: bare alternativet \xABikke ta med\xBB er mulig." });
        } else {
          const y = K.at(i - 1).at(j2 - wi) + vi, mx = Math.max(x, y);
          K.at(i).splice(j2, 1, mx);
          snap({ ii: i, jj: j2, dx: [i - 1, j2], dy: [i - 1, j2 - wi], a: `i = ${i}, j = ${j2}: uten ${i} gir x = K[${i - 1}, ${j2}] = ${x}; med ${i} gir y = K[${i - 1}, ${j2 - wi}] + ${vi} = ${y}.`, b: `K[${i}, ${j2}] = max(${x}, ${y}) = ${mx}. ${y > x ? `Det l\xF8nner seg \xE5 ta med gjenstand ${i}.` : "Det l\xF8nner seg ikke \xE5 ta med gjenstanden her."}` });
        }
      }
    }
    let j = W;
    const take = [], path = [];
    for (let i = n; i >= 1; i -= 1) {
      path.push(`${i},${j}`);
      if (K.at(i).at(j) !== K.at(i - 1).at(j)) {
        take.push(i);
        snap({ ii: 9, take: take.slice(), path: path.slice(), a: `K[${i}, ${j}] = ${K.at(i).at(j)} \u2260 K[${i - 1}, ${j}] = ${K.at(i - 1).at(j)}, s\xE5 gjenstand ${i} er med. Ny kapasitet ${j} \u2212 ${w.at(i - 1)} = ${j - w.at(i - 1)}.`, b: "Verdien endret seg da gjenstand i ble tilgjengelig, s\xE5 den m\xE5 v\xE6re brukt." });
        j -= w.at(i - 1);
      } else {
        snap({ ii: 9, take: take.slice(), path: path.slice(), a: `K[${i}, ${j}] = K[${i - 1}, ${j}] = ${K.at(i).at(j)}, s\xE5 gjenstand ${i} trengs ikke.`, b: "Rekonstruksjonen g\xE5r fra K[n, W] og oppover, \xE9n rad per gjenstand." });
      }
    }
    snap({ ii: 9, take: take.slice(), path: path.slice(), a: `Optimal l\xF8sning: gjenstand ${take.slice().reverse().join(" og ")}, med vekt 5 og verdi ${K.at(n).at(W)}.`, b: "Tabellen har (n + 1)(W + 1) celler med konstant arbeid hver: \u0398(nW)." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const gx = (j) => 300 + j * 50, gy = (i) => 160 + i * 34;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const jump = () => {
    const tr = steps.at(Math.min(s + 1, N - 1)).ii;
    let t = Math.min(s + 1, N - 1);
    while (t + 1 < N && steps.at(t + 1).ii === tr && tr <= n) {
      t += 1;
    }
    setS(t);
  };
  const done = (i, j) => i === 0 || st.ii > i || st.ii === i && st.jj >= j;
  const items = [1, 2, 3, 4], rows = [0, 1, 2, 3, 4], cols = [0, 1, 2, 3, 4, 5];
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 420", role: "img", "aria-label": "Bin\xE6r ryggsekk steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Knapsack\u2032 steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Fire gjenstander, kapasitet W = 5; \xE9n celle per trykk"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "100", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "74", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "132", y: "68", width: "100", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "182", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-row", onClick: jump, cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "240", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-row-label", x: "295", y: "89", textAnchor: "middle", fill: ink }, "Hele raden \u23ED")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "358", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "403", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "462", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "items" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "it-title", x: "24", y: "132", fontSize: "12", fill: quiet }, "Gjenstander"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "it-i", x: "40", y: "154", textAnchor: "middle", fontSize: "12", fontWeight: "600", fill: ink }, "i"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "it-w", x: "90", y: "154", textAnchor: "middle", fontSize: "12", fontWeight: "600", fill: ink }, "w\u1D62"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "it-v", x: "140", y: "154", textAnchor: "middle", fontSize: "12", fontWeight: "600", fill: ink }, "v\u1D62"), items.map((i) => {
    const cur = i === st.ii, tk = st.take.includes(i);
    return /* @__PURE__ */ React.createElement("g", { key: `it${i}` }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: gy(i) + 2, width: "140", height: "28", rx: "4", fill: tk ? good : cur ? accent : "none", fillOpacity: tk || cur ? 0.15 : 0 }), /* @__PURE__ */ React.createElement("text", { x: "40", y: gy(i) + 21, textAnchor: "middle", fill: ink }, i), /* @__PURE__ */ React.createElement("text", { x: "90", y: gy(i) + 21, textAnchor: "middle", fill: ink }, w.at(i - 1)), /* @__PURE__ */ React.createElement("text", { x: "140", y: gy(i) + 21, textAnchor: "middle", fill: ink }, v.at(i - 1)));
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "table" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "j-label", x: "230", y: "134", fontSize: "11.5", fill: quiet }, "kapasitet j"), cols.map((j) => /* @__PURE__ */ React.createElement("text", { key: `h${j}`, x: gx(j), y: "152", textAnchor: "middle", fontSize: "12", fontWeight: "600", fill: j === st.jj && st.ii <= n ? cmpc : ink }, j)), rows.map((i) => /* @__PURE__ */ React.createElement("g", { key: `r${i}` }, /* @__PURE__ */ React.createElement("text", { x: "256", y: gy(i) + 22, textAnchor: "middle", fontSize: "12", fontWeight: "600", fill: i === st.ii ? cmpc : ink }, `i = ${i}`), cols.map((j) => {
    const dn = done(i, j), cur = i === st.ii && j === st.jj && st.ii <= n, isx = st.dx !== null && st.dx.at(0) === i && st.dx.at(1) === j, isy = st.dy !== null && st.dy.at(0) === i && st.dy.at(1) === j, onP = st.path.includes(`${i},${j}`);
    const col = onP ? good : cur ? accent : isy ? c3 : isx ? cmpc : edge;
    return /* @__PURE__ */ React.createElement("g", { key: `c${i}-${j}` }, /* @__PURE__ */ React.createElement("rect", { x: gx(j) - 24, y: gy(i), width: "48", height: "34", fill: onP || cur || isx || isy ? col : dn ? tint : "none", fillOpacity: onP || cur || isx || isy ? 0.18 : 1, stroke: col, strokeWidth: onP || cur || isx || isy ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: gx(j), y: gy(i) + 22, textAnchor: "middle", fontWeight: cur ? 600 : 400, fill: ink }, dn ? st.K.at(i).at(j) : ""));
  })))), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "legend" }, /* @__PURE__ */ React.createElement("rect", { x: "600", y: "166", width: "16", height: "14", fill: cmpc, fillOpacity: "0.18", stroke: cmpc, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-x", x: "624", y: "177", fontSize: "12", fill: quiet }, "x: uten gjenstand i"), /* @__PURE__ */ React.createElement("rect", { x: "600", y: "192", width: "16", height: "14", fill: c3, fillOpacity: "0.18", stroke: c3, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-y", x: "624", y: "203", fontSize: "12", fill: quiet }, "y: med gjenstand i"), /* @__PURE__ */ React.createElement("rect", { x: "600", y: "218", width: "16", height: "14", fill: good, fillOpacity: "0.18", stroke: good, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-p", x: "624", y: "229", fontSize: "12", fill: quiet }, "rekonstruksjon")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "376", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "398", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["lcs"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", tint = "var(--cds-chart-reference-tint)", accent = "var(--cds-chart-categorical-1)", cmpc = "var(--cds-chart-categorical-2)", good = "var(--cds-chart-status-good)";
  const X = "ABCBDAB", Y = "BDCABA", m = 7, n = 6;
  const steps = (() => {
    const c = [], b = [], out = [];
    for (let i2 = 0; i2 <= m; i2 += 1) {
      c.push([0, 0, 0, 0, 0, 0, 0]);
      b.push(["", "", "", "", "", "", ""]);
    }
    const snap = (o) => out.push({ ii: 0, jj: 0, cs: "", path: [], lcs: "", ...o, c: c.map((r) => r.slice()), bt: b.map((r) => r.slice()) });
    snap({ ii: 0, a: "Linje 2\u20135: rad 0 og kolonne 0 settes til 0. En LCS med en tom streng er tom.", b: "Tabellen fylles rad for rad, fra venstre mot h\xF8yre (linje 6\u20137)." });
    for (let i2 = 1; i2 <= m; i2 += 1) {
      for (let j2 = 1; j2 <= n; j2 += 1) {
        const xi = X.charAt(i2 - 1), yj = Y.charAt(j2 - 1), d = c.at(i2 - 1).at(j2 - 1), u = c.at(i2 - 1).at(j2), l = c.at(i2).at(j2 - 1);
        if (xi === yj) {
          c.at(i2).splice(j2, 1, d + 1);
          b.at(i2).splice(j2, 1, "\u2196");
          snap({ ii: i2, jj: j2, cs: "diag", a: `x${i2} = y${j2} = ${xi}: c[${i2}, ${j2}] = c[${i2 - 1}, ${j2 - 1}] + 1 = ${d + 1}, pil \u2196.`, b: "Et felles siste tegn kan alltid tas med i en LCS av de to prefiksene." });
        } else if (u >= l) {
          c.at(i2).splice(j2, 1, u);
          b.at(i2).splice(j2, 1, "\u2191");
          snap({ ii: i2, jj: j2, cs: "up", a: `x${i2} = ${xi} \u2260 y${j2} = ${yj}, og c[${i2 - 1}, ${j2}] = ${u} \u2265 c[${i2}, ${j2 - 1}] = ${l}: c[${i2}, ${j2}] = ${u}, pil \u2191.`, b: `Den beste LCS-en av X\u2081..${i2} og Y\u2081..${j2} trenger ikke x${i2}.` });
        } else {
          c.at(i2).splice(j2, 1, l);
          b.at(i2).splice(j2, 1, "\u2190");
          snap({ ii: i2, jj: j2, cs: "left", a: `x${i2} = ${xi} \u2260 y${j2} = ${yj}, og c[${i2 - 1}, ${j2}] = ${u} < c[${i2}, ${j2 - 1}] = ${l}: c[${i2}, ${j2}] = ${l}, pil \u2190.`, b: `Den beste LCS-en av X\u2081..${i2} og Y\u2081..${j2} trenger ikke y${j2}.` });
        }
      }
    }
    let i = m, j = n, lcs = "";
    const path = [];
    while (i > 0 && j > 0) {
      path.push(`${i},${j}`);
      const ar = b.at(i).at(j);
      if (ar === "\u2196") {
        lcs = X.charAt(i - 1) + lcs;
        snap({ ii: 8, path: path.slice(), lcs, a: `Print-LCS: b[${i}, ${j}] = \u2196, s\xE5 ${X.charAt(i - 1)} er med i LCS-en. G\xE5 til (${i - 1}, ${j - 1}).`, b: `LCS s\xE5 langt, bakfra: ${lcs}.` });
        i -= 1;
        j -= 1;
      } else if (ar === "\u2191") {
        snap({ ii: 8, path: path.slice(), lcs, a: `Print-LCS: b[${i}, ${j}] = \u2191. G\xE5 til (${i - 1}, ${j}).`, b: "Ingen bokstav skrives ut for \u2191 eller \u2190." });
        i -= 1;
      } else {
        snap({ ii: 8, path: path.slice(), lcs, a: `Print-LCS: b[${i}, ${j}] = \u2190. G\xE5 til (${i}, ${j - 1}).`, b: "Ingen bokstav skrives ut for \u2191 eller \u2190." });
        j -= 1;
      }
    }
    snap({ ii: 8, path: path.slice(), lcs, a: `i = ${i} eller j = ${j} er 0, s\xE5 rekursjonen stopper. LCS = ${lcs}, med lengde ${lcs.length} = c[7, 6].`, b: "Print-LCS skriver ut bokstavene i riktig rekkef\xF8lge fordi utskriften skjer etter det rekursive kallet." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const gx = (j) => 132 + j * 44, gy = (i) => 160 + i * 32;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const jump = () => {
    const tr = steps.at(Math.min(s + 1, N - 1)).ii;
    let t = Math.min(s + 1, N - 1);
    while (t + 1 < N && steps.at(t + 1).ii === tr && tr <= m) {
      t += 1;
    }
    setS(t);
  };
  const rows = [0, 1, 2, 3, 4, 5, 6, 7], cols = [0, 1, 2, 3, 4, 5, 6];
  const done = (i, j) => i === 0 || j === 0 || st.ii > i || st.ii === i && st.jj >= j;
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 480", role: "img", "aria-label": "LCS steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "LCS-Length og Print-LCS steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "X = ABCBDAB og Y = BDCABA (bokas figur 14.8); \xE9n celle per trykk"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "100", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "74", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "132", y: "68", width: "100", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "182", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-row", onClick: jump, cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "240", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-row-label", x: "295", y: "89", textAnchor: "middle", fill: ink }, "Hele raden \u23ED")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "358", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "403", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "462", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "grid" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "j-label", x: "100", y: "126", textAnchor: "middle", fontSize: "11.5", fill: quiet }, "j"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "i-label", x: "40", y: "150", textAnchor: "middle", fontSize: "11.5", fill: quiet }, "i"), cols.map((j) => /* @__PURE__ */ React.createElement("g", { key: `h${j}` }, /* @__PURE__ */ React.createElement("text", { x: gx(j), y: "126", textAnchor: "middle", fontSize: "11.5", fill: quiet }, j), /* @__PURE__ */ React.createElement("text", { x: gx(j), y: "146", textAnchor: "middle", fontWeight: "600", fill: j === st.jj && st.ii <= m && st.ii > 0 ? cmpc : ink }, j === 0 ? "" : Y.charAt(j - 1)))), rows.map((i) => /* @__PURE__ */ React.createElement("g", { key: `r${i}` }, /* @__PURE__ */ React.createElement("text", { x: "40", y: gy(i) + 21, textAnchor: "middle", fontSize: "11.5", fill: quiet }, i), /* @__PURE__ */ React.createElement("text", { x: "72", y: gy(i) + 21, textAnchor: "middle", fontWeight: "600", fill: i === st.ii ? cmpc : ink }, i === 0 ? "" : X.charAt(i - 1)), cols.map((j) => {
    const dn = done(i, j), cur = i === st.ii && j === st.jj && st.ii <= m && st.ii > 0, onP = st.path.includes(`${i},${j}`), dep = st.ii <= m && st.ii > 0 && (st.cs === "diag" && i === st.ii - 1 && j === st.jj - 1 || st.cs === "up" && i === st.ii - 1 && j === st.jj || st.cs === "left" && i === st.ii && j === st.jj - 1);
    return /* @__PURE__ */ React.createElement("g", { key: `c${i}-${j}` }, /* @__PURE__ */ React.createElement("rect", { x: gx(j) - 22, y: gy(i), width: "44", height: "32", fill: onP ? good : cur ? accent : dep ? cmpc : dn ? tint : "none", fillOpacity: onP || cur || dep ? 0.18 : 1, stroke: onP ? good : cur ? accent : dep ? cmpc : edge, strokeWidth: onP || cur || dep ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: gx(j) - 6, y: gy(i) + 21, textAnchor: "middle", fontWeight: cur ? 600 : 400, fill: ink }, dn ? st.c.at(i).at(j) : ""), /* @__PURE__ */ React.createElement("text", { x: gx(j) + 12, y: gy(i) + 20, textAnchor: "middle", fontSize: "12", fill: quiet }, dn ? st.bt.at(i).at(j) : ""));
  })))), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "rules" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "rule-title", x: "470", y: "150", fontSize: "12", fill: quiet }, "Regel for c[i, j] (linje 8\u201315)"), /* @__PURE__ */ React.createElement("rect", { x: "464", y: "160", width: "272", height: "26", rx: "4", fill: accent, fillOpacity: st.cs === "diag" ? 0.18 : 0 }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "rule-1", x: "472", y: "178", fontSize: "12", fill: ink }, "x\u1D62 = y\u2C7C: c[i \u2212 1, j \u2212 1] + 1, pil \u2196"), /* @__PURE__ */ React.createElement("rect", { x: "464", y: "190", width: "272", height: "26", rx: "4", fill: accent, fillOpacity: st.cs === "up" ? 0.18 : 0 }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "rule-2", x: "472", y: "208", fontSize: "12", fill: ink }, "ellers, c[i \u2212 1, j] \u2265 c[i, j \u2212 1]: opp, pil \u2191"), /* @__PURE__ */ React.createElement("rect", { x: "464", y: "220", width: "272", height: "26", rx: "4", fill: accent, fillOpacity: st.cs === "left" ? 0.18 : 0 }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "rule-3", x: "472", y: "238", fontSize: "12", fill: ink }, "ellers: venstre, pil \u2190"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "lcs-label", x: "470", y: "290", fontSize: "12", fill: quiet }, "LCS funnet s\xE5 langt:"), /* @__PURE__ */ React.createElement("text", { x: "470", y: "318", fontSize: "18", fontWeight: "600", fill: good }, st.lcs)), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "444", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "466", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["merge-sort"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", tint = "var(--cds-chart-reference-tint)", accent = "var(--cds-chart-categorical-1)", cmpc = "var(--cds-chart-categorical-2)";
  const steps = (() => {
    const A = [12, 3, 7, 9, 14, 6, 11, 2], out = [], done = [];
    const snap = (o) => out.push({ p: -1, q: -1, r: -1, L: [], R: [], i: -1, j: -1, k: -1, w: -1, ...o, A: A.slice(), done: done.slice() });
    const merge = (p, q, r) => {
      const L = A.slice(p, q + 1), R = A.slice(q + 1, r + 1);
      let i = 0, j = 0, k = p;
      const P = p + 1, Q = q + 1, RR = r + 1;
      snap({ p, q, r, L, R, i, j, k, a: `Merge(A, ${P}, ${Q}, ${RR}): L = A[${P} : ${Q}] og R = A[${Q + 1} : ${RR}] kopieres ut.`, b: "L og R er hver for seg sortert. N\xE5 flettes de tilbake inn i A, minste element f\xF8rst." });
      while (i < L.length || j < R.length) {
        let a = "";
        if (j >= R.length) {
          a = `R er tom, s\xE5 resten av L kopieres: A[${k + 1}] = ${L.at(i)}.`;
          A.splice(k, 1, L.at(i));
          i += 1;
        } else if (i >= L.length) {
          a = `L er tom, s\xE5 resten av R kopieres: A[${k + 1}] = ${R.at(j)}.`;
          A.splice(k, 1, R.at(j));
          j += 1;
        } else if (L.at(i) <= R.at(j)) {
          a = `L[${i}] = ${L.at(i)} \u2264 R[${j}] = ${R.at(j)}, s\xE5 A[${k + 1}] = ${L.at(i)}.`;
          A.splice(k, 1, L.at(i));
          i += 1;
        } else {
          a = `L[${i}] = ${L.at(i)} > R[${j}] = ${R.at(j)}, s\xE5 A[${k + 1}] = ${R.at(j)}.`;
          A.splice(k, 1, R.at(j));
          j += 1;
        }
        k += 1;
        const fin = k > r;
        if (fin) {
          done.push(`${p}-${r}`);
        }
        snap({ p, q, r, L, R, i, j, k, w: k - 1, a, b: fin ? `A[${P} : ${RR}] er n\xE5 sortert, og dette Merge-kallet er ferdig.` : `Invarianten: A[${P} : ${k}] inneholder de ${k - p} minste elementene fra L og R, sortert.` });
      }
    };
    const sort = (p, r) => {
      if (p >= r) {
        return;
      }
      const q = Math.floor((p + r) / 2);
      sort(p, q);
      sort(q + 1, r);
      merge(p, q, r);
    };
    snap({ a: "Start: A = \u27E812, 3, 7, 9, 14, 6, 11, 2\u27E9, og kallet er Merge-Sort(A, 1, 8).", b: "Rekursjonen deler helt ned til ett element. F\xF8rste fletting er A[1 : 1] med A[2 : 2]." });
    sort(0, 7);
    snap({ a: "Ferdig: A = \u27E82, 3, 6, 7, 9, 11, 12, 14\u27E9.", b: "Hvert av de lg 8 = 3 fletteniv\xE5ene kopierte til sammen n = 8 elementer: \u0398(n lg n)." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const cx = (c) => 44 + c * 44, rx = (c) => 252 + c * 44;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const segs = [[0, 7, 0], [0, 3, 1], [4, 7, 1], [0, 1, 2], [2, 3, 2], [4, 5, 2], [6, 7, 2], [0, 0, 3], [1, 1, 3], [2, 2, 3], [3, 3, 3], [4, 4, 3], [5, 5, 3], [6, 6, 3], [7, 7, 3]];
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 390", role: "img", "aria-label": "Merge-Sort steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Merge-Sort steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Hvert trykk p\xE5 Neste starter et Merge-kall eller kopierer ett element tilbake til A"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "array-a" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "128", fontWeight: "600", fill: ink }, st.p >= 0 ? `A, under Merge(A, ${st.p + 1}, ${st.q + 1}, ${st.r + 1})` : "A"), [0, 1, 2, 3, 4, 5, 6, 7].map((c) => {
    const inR = c >= st.p && c <= st.r, filled = inR && c < st.k, stale = inR && c >= st.k, wr = c === st.w;
    return /* @__PURE__ */ React.createElement("g", { key: c }, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 20, y: "140", width: "40", height: "40", fill: filled ? tint : "none", stroke: wr ? accent : edge, strokeWidth: wr ? 2 : 1, strokeDasharray: stale ? "4 3" : "none" }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "165", textAnchor: "middle", fontWeight: wr ? 600 : 400, fill: stale ? quiet : ink, fillOpacity: stale ? 0.5 : 1 }, st.A.at(c)), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "198", textAnchor: "middle", fontSize: "11.5", fill: quiet }, c + 1));
  }), st.k >= 0 && st.k <= st.r ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "k-mark", x: cx(st.k), y: "216", textAnchor: "middle", fontWeight: "600", fill: accent }, "\u2191 k") : null), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "arrays-lr" }, st.L.length > 0 ? /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "l-label", x: "24", y: "244", fontWeight: "600", fill: ink }, "L"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "r-label", x: "232", y: "244", fontWeight: "600", fill: ink }, "R"), st.L.map((v, c) => /* @__PURE__ */ React.createElement("g", { key: `l${c}` }, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 20, y: "254", width: "40", height: "40", fill: "none", stroke: c === st.i ? cmpc : edge, strokeWidth: c === st.i ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "279", textAnchor: "middle", fill: c < st.i ? quiet : ink, fillOpacity: c < st.i ? 0.4 : 1 }, v))), st.R.map((v, c) => /* @__PURE__ */ React.createElement("g", { key: `r${c}` }, /* @__PURE__ */ React.createElement("rect", { x: rx(c) - 20, y: "254", width: "40", height: "40", fill: "none", stroke: c === st.j ? cmpc : edge, strokeWidth: c === st.j ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: rx(c), y: "279", textAnchor: "middle", fill: c < st.j ? quiet : ink, fillOpacity: c < st.j ? 0.4 : 1 }, v))), st.i < st.L.length ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "i-mark", x: cx(st.i), y: "314", textAnchor: "middle", fontWeight: "600", fill: cmpc }, "\u2191 i") : null, st.j < st.R.length ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "j-mark", x: rx(st.j), y: "314", textAnchor: "middle", fontWeight: "600", fill: cmpc }, "\u2191 j") : null) : null), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "tree" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "tree-title", x: "440", y: "128", fontSize: "12", fill: quiet }, "Rekursjonstre: deltabellene A[p : r]"), segs.map((g) => {
    const p = g.at(0), r = g.at(1), lev = g.at(2), cur = st.p === p && st.r === r, fin = p === r || st.done.includes(`${p}-${r}`);
    return /* @__PURE__ */ React.createElement("g", { key: `${p}-${r}` }, /* @__PURE__ */ React.createElement("rect", { x: 440 + p * 37 + 2, y: 140 + lev * 44, width: (r - p + 1) * 37 - 4, height: "32", rx: "6", fill: cur ? accent : fin ? tint : "none", fillOpacity: cur ? 0.15 : 1, stroke: cur ? accent : edge, strokeWidth: cur ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: 440 + (p + r + 1) * 37 / 2, y: 140 + lev * 44 + 21, textAnchor: "middle", fontSize: "11.5", fill: ink }, p === r ? `${p + 1}` : `${p + 1}:${r + 1}`));
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "348", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "370", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["mst-kruskal"] = (function(){ const { C, PALETTE, Controls, Title, Explain, Node, Edge } = window.AlgLib;
const V = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
const P = /* @__PURE__ */ new Map([["a", [50, 250]], ["b", [140, 170]], ["c", [270, 170]], ["d", [400, 170]], ["e", [490, 250]], ["f", [400, 330]], ["g", [270, 330]], ["h", [140, 330]], ["i", [205, 250]]]);
const SORTED = [["h", "g", 1], ["i", "c", 2], ["g", "f", 2], ["a", "b", 4], ["c", "f", 4], ["i", "g", 6], ["c", "d", 7], ["h", "i", 7], ["a", "h", 8], ["b", "c", 8], ["d", "e", 9], ["e", "f", 10], ["b", "h", 11], ["d", "f", 14]];
function buildSteps() {
  const rep = new Map(V.map((v) => [v, v]));
  const find = (v) => rep.get(v) === v ? v : find(rep.get(v));
  const A = [], status = /* @__PURE__ */ new Map(), out = [];
  let total = 0;
  const snap = (o) => {
    const comp = new Map(V.map((v) => [v, find(v)]));
    out.push({ cur: -1, ...o, A: A.slice(), status: new Map(status), comp, total });
  };
  snap({ a: "Linje 1\u20135: A = \u2205, og hver node er sin egen mengde (MAKE-SET). Kantene sorteres etter vekt.", b: "Fargene viser mengdene, alts\xE5 tr\xE6rne i skogen A. Lista til h\xF8yre er kantene i sortert rekkef\xF8lge." });
  SORTED.forEach((e, k) => {
    const [u, v, w] = e, ru = find(u), rv = find(v);
    if (ru !== rv) {
      A.push(k);
      rep.set(ru, rv);
      status.set(k, "ok");
      total += w;
      snap({
        cur: k,
        a: `Linje 7\u20139: (${u}, ${v}) med vekt ${w}. FIND-SET(${u}) \u2260 FIND-SET(${v}), s\xE5 kanten legges i A og mengdene sl\xE5s sammen med UNION.`,
        b: `Kanten er lettest blant dem som krysser snittet mellom treet til ${u} og resten, s\xE5 den er trygg (korollar 21.2). Vekt s\xE5 langt: ${total}.`
      });
    } else {
      status.set(k, "no");
      snap({ cur: k, a: `Linje 7: (${u}, ${v}) med vekt ${w}. ${u} og ${v} er allerede i samme mengde, s\xE5 kanten hoppes over.`, b: "Den ville laget en sykel i A." });
    }
  });
  out.at(-1).b += ` Ferdig: A er et minimalt spenntre med vekt ${total}.`;
  return out;
}
const STEPS = buildSteps();
return () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const roots = [...new Set(V.map((v) => st.comp.get(v)))];
  const colorOf = (v) => {
    const r = st.comp.get(v);
    const size = V.filter((x) => st.comp.get(x) === r).length;
    return size > 1 ? PALETTE[roots.indexOf(r) % PALETTE.length] : null;
  };
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 520", role: "img", "aria-label": "MST-Kruskal steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement(Title, { title: "MST-Kruskal steg for steg", subtitle: "Grafen fra bokas figur 21.1; kantene behandles i sortert rekkef\xF8lge" }), /* @__PURE__ */ React.createElement(Controls, { s, N, setS }), SORTED.map((e, k) => {
    const inA = st.A.includes(k), cur = k === st.cur;
    return /* @__PURE__ */ React.createElement(
      Edge,
      {
        key: k,
        p: P.get(e[0]),
        q: P.get(e[1]),
        label: e[2],
        color: cur ? C.cmp : inA ? C.accent : C.edge,
        width: cur || inA ? 3.5 : 1.25,
        dash: st.status.get(k) === "no" && !cur ? "4 4" : void 0
      }
    );
  }), V.map((v) => {
    const [x, y] = P.get(v), col = colorOf(v);
    return /* @__PURE__ */ React.createElement(Node, { key: v, x, y, label: v, fill: col || "none", fillOpacity: col ? 0.28 : 0 });
  }), /* @__PURE__ */ React.createElement("text", { x: "560", y: "140", fontSize: "12", fill: C.quiet }, "Sortert kantliste"), SORTED.map((e, k) => {
    const stt = st.status.get(k), cur = k === st.cur, y = 160 + k * 19;
    return /* @__PURE__ */ React.createElement("g", { key: `r${k}` }, cur ? /* @__PURE__ */ React.createElement("rect", { x: "554", y: y - 13, width: "180", height: "18", rx: "3", fill: C.cmp, fillOpacity: "0.16" }) : null, /* @__PURE__ */ React.createElement("text", { x: "562", y, fontSize: "12", fill: stt === "no" ? C.quiet : C.ink, textDecoration: stt === "no" ? "line-through" : void 0 }, `(${e[0]}, ${e[1]})`), /* @__PURE__ */ React.createElement("text", { x: "630", y, fontSize: "12", fill: C.quiet }, `w = ${e[2]}`), /* @__PURE__ */ React.createElement("text", { x: "700", y, fontSize: "13", fontWeight: "600", fill: stt === "ok" ? C.good : C.bad }, stt === "ok" ? "\u2713" : stt === "no" ? "\u2717" : ""));
  }), /* @__PURE__ */ React.createElement("text", { x: "24", y: "410", fontSize: "12", fill: C.quiet }, `Kanter i A: ${st.A.length} av ${V.length - 1}  \xB7  vekt ${st.total}  \xB7  stiplet = forkastet (ville gitt sykel)`), /* @__PURE__ */ React.createElement(Explain, { y: 452, a: st.a, b: st.b }));
};
 })();
window.AlgWidgets["mst-prim"] = (function(){ const { C, Controls, Title, Explain, Node, Edge, Pseudo, fmt } = window.AlgLib;
const V = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
const P = /* @__PURE__ */ new Map([["a", [50, 250]], ["b", [140, 170]], ["c", [270, 170]], ["d", [400, 170]], ["e", [490, 250]], ["f", [400, 330]], ["g", [270, 330]], ["h", [140, 330]], ["i", [205, 250]]]);
const E = [["a", "b", 4], ["a", "h", 8], ["b", "c", 8], ["b", "h", 11], ["c", "d", 7], ["c", "f", 4], ["c", "i", 2], ["d", "e", 9], ["d", "f", 14], ["e", "f", 10], ["f", "g", 2], ["g", "h", 1], ["g", "i", 6], ["h", "i", 7]];
const W = /* @__PURE__ */ new Map();
E.forEach(([u, v, w]) => {
  W.set(`${u}${v}`, w);
  W.set(`${v}${u}`, w);
});
const Adj = new Map(V.map((v) => [v, V.filter((x) => W.has(`${v}${x}`))]));
const CODE = [
  "MST-PRIM(G, w, r)",
  " 8  while Q \u2260 \u2205",
  " 9    u = EXTRACT-MIN(Q)",
  "10    for each v in G.Adj[u]",
  "11      if v\u2208Q and w(u,v)<v.key",
  "12        v.\u03C0 = u",
  "13        v.key = w(u,v)",
  "14        DECREASE-KEY(Q,v,w(u,v))"
];
function buildSteps() {
  const key = new Map(V.map((v) => [v, Infinity])), pi = new Map(V.map((v) => [v, null]));
  const inQ = new Set(V), out = [];
  key.set("a", 0);
  const snap = (o) => out.push({ u: null, upd: [], code: [], ...o, key: new Map(key), pi: new Map(pi), inQ: new Set(inQ) });
  snap({ a: "Linje 1\u20137: alle noder f\xE5r key = \u221E og \u03C0 = NIL, unntatt roten a, som f\xE5r key = 0. Alle legges i min-prioritetsk\xF8en Q.", b: "v.key er vekten p\xE5 den letteste kanten fra v til treet s\xE5 langt." });
  while (inQ.size > 0) {
    const u = [...inQ].sort((x, y) => key.get(x) - key.get(y) || x.localeCompare(y)).at(0);
    inQ.delete(u);
    const upd = [];
    Adj.get(u).forEach((v) => {
      if (inQ.has(v) && W.get(`${u}${v}`) < key.get(v)) {
        upd.push(`${v}: ${fmt(key.get(v))} \u2192 ${W.get(`${u}${v}`)}`);
        pi.set(v, u);
        key.set(v, W.get(`${u}${v}`));
      }
    });
    const added = pi.get(u) ? `Kanten (${pi.get(u)}, ${u}) med vekt ${key.get(u)} blir en del av treet. ` : "Roten blir f\xF8rste node i treet. ";
    snap({
      u,
      upd: upd.map((x) => x.at(0)),
      code: upd.length ? [9, 10, 11, 12, 13, 14] : [9, 10, 11],
      a: `Linje 9: EXTRACT-MIN gir ${u} (key = ${key.get(u)}). ${added}`,
      b: upd.length ? `Linje 10\u201314: naboer i Q f\xE5r lavere key: ${upd.join(", ")}.` : "Linje 10\u201314: ingen naboer i Q f\xE5r lavere key."
    });
  }
  const total = V.reduce((s, v) => s + (pi.get(v) ? key.get(v) : 0), 0);
  out.at(-1).b += ` Q er tom. Treet {(v, v.\u03C0)} har vekt ${total}.`;
  return out;
}
const STEPS = buildSteps();
return () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const isTree = (u, v) => st.pi.get(v) === u && !st.inQ.has(v) || st.pi.get(u) === v && !st.inQ.has(u);
  const isCand = (u, v) => st.pi.get(v) === u && st.inQ.has(v) || st.pi.get(u) === v && st.inQ.has(u);
  const Qs = [...st.inQ].sort((x, y) => st.key.get(x) - st.key.get(y) || x.localeCompare(y));
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 520", role: "img", "aria-label": "MST-Prim steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement(Title, { title: "MST-Prim steg for steg", subtitle: "Grafen fra bokas figur 21.1 med rot a; tallet over hver node er v.key" }), /* @__PURE__ */ React.createElement(Controls, { s, N, setS }), E.map(([u, v, w]) => {
    const t = isTree(u, v), c = isCand(u, v);
    return /* @__PURE__ */ React.createElement(Edge, { key: `${u}${v}`, p: P.get(u), q: P.get(v), label: w, color: t ? C.accent : c ? C.cmp : C.edge, width: t ? 3.5 : c ? 2 : 1.25, dash: c ? "5 4" : void 0 });
  }), V.map((v) => {
    const [x, y] = P.get(v), inTree = !st.inQ.has(v), cur = v === st.u, up = st.upd.includes(v);
    return /* @__PURE__ */ React.createElement(
      Node,
      {
        key: v,
        x,
        y,
        label: v,
        fill: inTree ? C.accent : "none",
        fillOpacity: inTree ? 0.22 : 0,
        stroke: cur ? C.accent : up ? C.cmp : C.edge,
        strokeWidth: cur || up ? 3 : 1.25,
        sub: inTree ? null : fmt(st.key.get(v)),
        subDy: y < 200 ? -28 : y > 300 ? 38 : -28,
        subFill: up ? C.cmp : C.quiet
      }
    );
  }), /* @__PURE__ */ React.createElement(Pseudo, { x: 530, y: 140, lines: CODE, active: st.code, w: 226, size: 11 }), /* @__PURE__ */ React.createElement("text", { x: "530", y: "300", fontSize: "12", fill: C.quiet }, "Q sortert p\xE5 key (minst f\xF8rst)"), Qs.map((v, k) => /* @__PURE__ */ React.createElement("g", { key: `q${k}` }, /* @__PURE__ */ React.createElement("rect", { x: 530 + k % 5 * 44, y: 310 + Math.floor(k / 5) * 34, width: "40", height: "28", rx: "4", fill: "none", stroke: C.edge }), /* @__PURE__ */ React.createElement("text", { x: 550 + k % 5 * 44, y: 329 + Math.floor(k / 5) * 34, textAnchor: "middle", fontSize: "12", fill: C.ink }, `${v}:${fmt(st.key.get(v))}`))), /* @__PURE__ */ React.createElement("text", { x: "24", y: "410", fontSize: "12", fill: C.quiet }, "Fylt node = i treet (V \u2212 Q). Bl\xE5 kant = i treet. Oransje stiplet = (v, v.\u03C0) for v i Q, letteste kant over snittet fra v."), /* @__PURE__ */ React.createElement(Explain, { y: 452, a: st.a, b: st.b }));
};
 })();
window.AlgWidgets["np-reductions"] = (function(){ const { C, Controls, Title, Para, wrap } = window.AlgLib;
const NODES = [
  ["circ", "CIRCUIT-SAT", 330, 150, null],
  ["sat", "SAT", 330, 205, "circ"],
  ["cnf", "3-CNF-SAT", 330, 260, "sat"],
  ["clique", "CLIQUE", 210, 315, "cnf"],
  ["subset", "SUBSET-SUM", 470, 315, "cnf"],
  ["vc", "VERTEX-COVER", 210, 370, "clique"],
  ["knap", "Bin\xE6r ryggsekk", 470, 370, "subset", true],
  ["ham", "HAM-CYCLE", 210, 425, "vc"],
  ["tsp", "TSP", 110, 480, "ham"],
  ["lsp", "Lengste enkle vei", 320, 480, "ham", true]
];
const INFO = {
  circ: {
    d: "Gitt en boolsk krets med AND-, OR- og NOT-porter og \xE9n utgang: finnes det en input som gir utgangen 1?",
    np: "Sertifikat: verdiene p\xE5 inputene. Simuler kretsen i polynomisk tid.",
    red: "NP-hard direkte (lemma 34.6): for et vilk\xE5rlig L i NP bygges en krets som simulerer verifikasjonsalgoritmen A(x, y) for fast x. Kretsen er tilfredsstillbar hvis og bare hvis det finnes et sertifikat y. Dette er \xABroten\xBB: alle andre bevis reduserer fra den."
  },
  sat: {
    d: "Gitt en boolsk formel \u03C6 med variabler, \u2227, \u2228, \xAC, \u2192 og \u2194: finnes det en tilordning som gj\xF8r \u03C6 sann?",
    np: "Sertifikat: en tilordning. Evaluer formelen i polynomisk tid.",
    red: "CIRCUIT-SAT \u2264p SAT: gi hver ledning i kretsen en variabel, og skriv hver port som en liten formel, f.eks. x\u2081\u2080 \u2194 (x\u2087 \u2227 x\u2088 \u2227 x\u2089). \u03C6 er utgangsvariabelen AND-et med alle portformlene. Rett fram innsetting kunne gitt eksponentielt store formler, s\xE5 det er derfor vi innf\xF8rer variabler for ledningene."
  },
  cnf: {
    d: "Er en formel p\xE5 3-CNF-form (AND av klausuler, hver en OR av n\xF8yaktig tre literaler) tilfredsstillbar?",
    np: "Sertifikat: en tilordning, som for SAT.",
    red: "SAT \u2264p 3-CNF-SAT: bygg et bin\xE6rt parsetre for formelen og gi hver indre node en variabel (som for kretsen). Skriv hver liten delformel om til CNF med sannhetstabell og De Morgan, og fyll p\xE5 med hjelpevariabler til n\xF8yaktig tre literaler per klausul."
  },
  clique: {
    d: "Har grafen G en klikk (komplett delgraf) med k noder?",
    np: "Sertifikat: de k nodene. Sjekk at alle par er naboer, O(k\xB2).",
    red: "3-CNF-SAT \u2264p CLIQUE: \xE9n node per literal i hver klausul. Kant mellom to literaler hvis de er i ulike klausuler og ikke er hverandres negasjon. \u03C6 med k klausuler er tilfredsstillbar hvis og bare hvis G har en klikk av st\xF8rrelse k. Se figuren under."
  },
  subset: {
    d: "Gitt en mengde S av positive heltall og et m\xE5l t: finnes det en delmengde med sum n\xF8yaktig t?",
    np: "Sertifikat: delmengden. Summer og sammenlign.",
    red: "3-CNF-SAT \u2264p SUBSET-SUM: lag tall med ett siffer per variabel og per klausul (i base 10). For hver variabel to tall (x\u1D62 og \xACx\u1D62), for hver klausul to \xABslakk\xBB-tall. M\xE5let t har 1 i variabelsifrene (velg n\xF8yaktig \xE9n av x\u1D62 og \xACx\u1D62) og 4 i klausulsifrene (minst \xE9n sann literal pluss slakk)."
  },
  vc: {
    d: "Har grafen G et nodedekke med k noder, alts\xE5 k noder slik at hver kant har minst \xE9n ende i mengden?",
    np: "Sertifikat: de k nodene. Sjekk hver kant.",
    red: "CLIQUE \u2264p VERTEX-COVER: bruk komplementgrafen \u1E20 (kant der G ikke har kant). G har en klikk av st\xF8rrelse k hvis og bare hvis \u1E20 har et nodedekke av st\xF8rrelse |V| \u2212 k: nodene utenfor klikken dekker alle kantene i \u1E20."
  },
  knap: {
    d: "Beslutningsversjonen av bin\xE6r ryggsekk: finnes et utvalg med vekt \u2264 W og verdi \u2265 V?",
    np: "I NP: sertifikatet er utvalget. Optimeringsversjonen er NP-hard.",
    red: "SUBSET-SUM \u2264p ryggsekk: la hvert tall v\xE6re b\xE5de vekt og verdi, og sett W = V = t. Et utvalg med vekt \u2264 t og verdi \u2265 t har sum n\xF8yaktig t. \u0398(nW)-algoritmen (appendiks E) er bare pseudopolynomisk, s\xE5 den motbeviser ikke dette."
  },
  ham: {
    d: "Har grafen G en Hamilton-sykel, alts\xE5 en enkel sykel som g\xE5r gjennom alle nodene?",
    np: "Sertifikat: rekkef\xF8lgen av nodene. Sjekk at de er distinkte og at nabopar er kanter.",
    red: "VERTEX-COVER \u2264p HAM-CYCLE: \xE9n \xABdings\xBB (widget) med 12 noder per kant i G, og k velgernoder. Dingsen for (u, v) kan bare krysses p\xE5 tre m\xE5ter, som tilsvarer at u, v eller begge er i dekket. En Hamilton-sykel finnes hvis og bare hvis G har et nodedekke med k noder."
  },
  tsp: {
    d: "Gitt en komplett graf med heltallskostnader og et tall k: finnes det en rundtur innom alle byene med kostnad \u2264 k?",
    np: "Sertifikat: rundturen. Sjekk at den er en permutasjon og summer kostnadene.",
    red: "HAM-CYCLE \u2264p TSP: lag den komplette grafen med kostnad 0 p\xE5 kantene som finnes i G og 1 p\xE5 de andre, og k = 0. En tur med kostnad 0 bruker bare kanter fra G, alts\xE5 er den en Hamilton-sykel."
  },
  lsp: {
    d: "Finnes det en enkel sti fra u til v med minst k kanter? (Optimering: finn lengste enkle vei.)",
    np: "Sertifikat: stien. Optimeringsversjonen er NP-hard.",
    red: "HAM-PATH (variant av HAM-CYCLE) \u2264p lengste enkle vei: en enkel sti med |V| \u2212 1 kanter g\xE5r gjennom alle nodene. Kontrast: korteste vei kan finnes i polynomisk tid, fordi den har optimal delstruktur; lengste enkle vei har ikke det."
  }
};
return () => {
  const [s, setS] = React.useState(0);
  const N = NODES.length;
  const cur = NODES[s];
  const pos = new Map(NODES.map((n) => [n[0], n]));
  const ancestors = /* @__PURE__ */ new Set();
  for (let p = cur; p; p = p[4] ? pos.get(p[4]) : null) ancestors.add(p[0]);
  const info = INFO[cur[0]];
  const parent = cur[4] ? pos.get(cur[4])[1] : null;
  const t1 = `Problemet: ${info.d}`, t2 = `Hvorfor i NP: ${info.np}`, t3 = parent ? `Reduksjon fra ${parent}: ${info.red}` : `Hvorfor NP-hard: ${info.red}`;
  const y1 = 562, y2 = y1 + wrap(t1, 110).length * 18 + 8, y3 = y2 + wrap(t2, 110).length * 18 + 8;
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 720", role: "img", "aria-label": "Reduksjonstreet for NP-komplette problemer", fontSize: "13" }, /* @__PURE__ */ React.createElement(Title, { title: "NP-komplette problemer og reduksjonene mellom dem", subtitle: "Bokas figur 34.13 pluss ryggsekk og lengste enkle vei. Klikk p\xE5 et problem, eller bla med knappene." }), /* @__PURE__ */ React.createElement(Controls, { s, N, setS }), NODES.filter((n) => n[4]).map((n) => {
    const p = pos.get(n[4]), on = ancestors.has(n[0]) && ancestors.has(p[0]);
    return /* @__PURE__ */ React.createElement("g", { key: `e${n[0]}` }, /* @__PURE__ */ React.createElement("line", { x1: p[2], y1: p[3] + 13, x2: n[2], y2: n[3] - 15, stroke: on ? C.cmp : C.edge, strokeWidth: on ? 2.5 : 1.25, strokeDasharray: n[5] ? "5 4" : void 0 }), /* @__PURE__ */ React.createElement("path", { d: `M${n[2]},${n[3] - 13} l-5,-9 l10,0 Z`, fill: on ? C.cmp : C.edge }));
  }), NODES.map((n, i) => {
    const sel = i === s, w = n[1].length * 8 + 24;
    return /* @__PURE__ */ React.createElement("g", { key: n[0], onClick: () => setS(i), cursor: "pointer" }, /* @__PURE__ */ React.createElement(
      "rect",
      {
        x: n[2] - w / 2,
        y: n[3] - 13,
        width: w,
        height: "26",
        rx: "6",
        fill: sel ? C.accent : "var(--cds-chart-background)",
        fillOpacity: sel ? 0.18 : 1,
        stroke: sel ? C.accent : ancestors.has(n[0]) ? C.cmp : C.edge,
        strokeWidth: sel ? 2.5 : 1.25,
        strokeDasharray: n[5] ? "5 3" : void 0
      }
    ), /* @__PURE__ */ React.createElement("text", { x: n[2], y: n[3] + 5, textAnchor: "middle", fontSize: "12", fontWeight: "600", fill: C.ink }, n[1]));
  }), /* @__PURE__ */ React.createElement("text", { x: "560", y: "160", fontSize: "12", fill: C.quiet }, "Pil fra A til B: A \u2264p B,"), /* @__PURE__ */ React.createElement("text", { x: "560", y: "178", fontSize: "12", fill: C.quiet }, "B vises NP-hard ved \xE5"), /* @__PURE__ */ React.createElement("text", { x: "560", y: "196", fontSize: "12", fill: C.quiet }, "redusere fra A til B."), /* @__PURE__ */ React.createElement("text", { x: "560", y: "224", fontSize: "12", fill: C.quiet }, "Stiplet: NP-hard (F14),"), /* @__PURE__ */ React.createElement("text", { x: "560", y: "242", fontSize: "12", fill: C.quiet }, "ikke i bokas figur."), /* @__PURE__ */ React.createElement("line", { x1: "24", y1: "512", x2: "736", y2: "512", stroke: C.edge, strokeWidth: "0.75" }), /* @__PURE__ */ React.createElement("text", { x: "24", y: "538", fontSize: "14", fontWeight: "600", fill: C.ink }, cur[1]), /* @__PURE__ */ React.createElement(Para, { x: 24, y: y1, text: t1, max: 110 }), /* @__PURE__ */ React.createElement(Para, { x: 24, y: y2, text: t2, max: 110, fill: C.quiet }), /* @__PURE__ */ React.createElement(Para, { x: 24, y: y3, text: t3, max: 110 }));
};
 })();
window.AlgWidgets["quicksort"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", tint = "var(--cds-chart-reference-tint)", accent = "var(--cds-chart-categorical-1)", lowc = "var(--cds-chart-categorical-3)", highc = "var(--cds-chart-categorical-4)";
  const steps = (() => {
    const A = [2, 8, 7, 1, 3, 5, 6, 4], out = [], fixed = [];
    const snap = (o) => out.push({ p: 0, r: -1, i: -2, hi: -1, q: -1, x: null, line: 0, ...o, A: A.slice(), fixed: fixed.slice() });
    const swap = (a, b) => {
      const t = A.at(a);
      A.splice(a, 1, A.at(b));
      A.splice(b, 1, t);
    };
    const part = (p, r) => {
      const x = A.at(r);
      let i = p - 1;
      snap({ p, r, i, x, hi: p - 1, line: 2, a: `Partition(A, ${p + 1}, ${r + 1}): pivot x = A[${r + 1}] = ${x}, og i = p \u2212 1 = ${i + 1}.`, b: "Lav og h\xF8y side er tomme. Alt fra j og ut til r \u2212 1 er ubehandlet." });
      for (let j = p; j < r; j += 1) {
        const v = A.at(j);
        if (v <= x) {
          i += 1;
          swap(i, j);
          snap({ p, r, i, x, hi: j, line: 6, a: `j = ${j + 1}: A[j] = ${v} \u2264 x = ${x}, s\xE5 i \xF8kes til ${i + 1}, og A[${i + 1}] byttes med A[${j + 1}].`, b: `Lav side er n\xE5 A[${p + 1} : ${i + 1}] (\u2264 ${x}), h\xF8y side er A[${i + 2} : ${j + 1}] (> ${x}).` });
        } else {
          snap({ p, r, i, x, hi: j, line: 4, a: `j = ${j + 1}: A[j] = ${v} > x = ${x}, s\xE5 elementet blir liggende p\xE5 h\xF8y side.`, b: `Ingen bytte. H\xF8y side vokser til A[${i + 2} : ${j + 1}].` });
        }
      }
      swap(i + 1, r);
      const q = i + 1;
      fixed.push(q);
      snap({ p, r, i, x, hi: r, q, line: 7, a: `Linje 7: bytt A[${q + 1}] og A[${r + 1}]. Pivoten ${x} st\xE5r p\xE5 sin endelige plass q = ${q + 1}.`, b: `Venstre for q er alt \u2264 ${x}, h\xF8yre for q er alt > ${x}. N\xE5 sorteres hver side rekursivt.` });
      return q;
    };
    const qs = (p, r) => {
      if (p < r) {
        const q = part(p, r);
        qs(p, q - 1);
        qs(q + 1, r);
      } else if (p === r) {
        fixed.push(p);
      }
    };
    snap({ a: "Start: A = \u27E82, 8, 7, 1, 3, 5, 6, 4\u27E9, og kallet er Quicksort(A, 1, 8).", b: "Hvert Partition-kall setter \xE9n pivot p\xE5 endelig plass og deler resten i to." });
    qs(0, 7);
    snap({ a: "Ferdig: A = \u27E81, 2, 3, 4, 5, 6, 7, 8\u27E9.", b: "Kombineringen var gratis: hver pivot havnet direkte p\xE5 riktig plass." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const cx = (c) => 80 + c * 46, lineY = (k) => 134 + 22 * k;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const zone = (c) => {
    if (c < st.p || c > st.r) {
      return "out";
    }
    if (st.q >= 0) {
      return c === st.q ? "pivot" : c < st.q ? "low" : "high";
    }
    if (c === st.r) {
      return "pivot";
    }
    if (c <= st.i) {
      return "low";
    }
    if (c <= st.hi) {
      return "high";
    }
    return "none";
  };
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 392", role: "img", "aria-label": "Quicksort steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Quicksort steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Hvert trykk p\xE5 Neste starter et Partition-kall eller behandler ett element A[j]"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "array" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "128", fontWeight: "600", fill: ink }, st.r >= 0 ? `A, under Partition(A, ${st.p + 1}, ${st.r + 1})` : "A"), [0, 1, 2, 3, 4, 5, 6, 7].map((c) => {
    const z = zone(c), fx = st.fixed.includes(c);
    const fill = z === "low" ? lowc : z === "high" ? highc : z === "pivot" ? accent : z === "out" && fx ? tint : "none";
    return /* @__PURE__ */ React.createElement("g", { key: c }, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 21, y: "140", width: "42", height: "42", fill, fillOpacity: z === "low" || z === "high" ? 0.22 : z === "pivot" ? 0.15 : 1, stroke: z === "pivot" ? accent : edge, strokeWidth: z === "pivot" ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "166", textAnchor: "middle", fontWeight: fx && z === "out" ? 600 : 400, fill: ink, fillOpacity: z === "out" && !fx && st.r >= 0 ? 0.45 : 1 }, st.A.at(c)), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "200", textAnchor: "middle", fontSize: "11.5", fill: quiet }, c + 1));
  }), st.r >= 0 && st.q < 0 ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "i-mark", x: cx(st.i), y: "220", textAnchor: "middle", fontWeight: "600", fill: lowc }, "\u2191 i") : null, st.r >= 0 && st.q < 0 && st.hi >= st.p ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "j-mark", x: cx(st.hi), y: "238", textAnchor: "middle", fontWeight: "600", fill: highc }, "\u2191 j") : null, st.q >= 0 ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "q-mark", x: cx(st.q), y: "220", textAnchor: "middle", fontWeight: "600", fill: accent }, "\u2191 q") : null), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "legend" }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "252", width: "18", height: "14", fill: lowc, fillOpacity: "0.22", stroke: edge, strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-low", x: "50", y: "263", fontSize: "12", fill: quiet }, "lav side (\u2264 x)"), /* @__PURE__ */ React.createElement("rect", { x: "176", y: "252", width: "18", height: "14", fill: highc, fillOpacity: "0.22", stroke: edge, strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-high", x: "202", y: "263", fontSize: "12", fill: quiet }, "h\xF8y side (> x)"), /* @__PURE__ */ React.createElement("rect", { x: "24", y: "274", width: "18", height: "14", fill: accent, fillOpacity: "0.15", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-pivot", x: "50", y: "285", fontSize: "12", fill: quiet }, "pivot x"), /* @__PURE__ */ React.createElement("rect", { x: "176", y: "274", width: "18", height: "14", fill: tint, stroke: edge, strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-fixed", x: "202", y: "285", fontSize: "12", fill: quiet }, "p\xE5 endelig plass")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "variables" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "316", fill: ink }, `x = ${st.x !== null ? st.x : "\u2013"}`), /* @__PURE__ */ React.createElement("text", { x: "104", y: "316", fill: ink }, `i = ${st.r >= 0 ? st.i + 1 : "\u2013"}`), /* @__PURE__ */ React.createElement("text", { x: "184", y: "316", fill: ink }, `j = ${st.r >= 0 && st.q < 0 && st.hi >= st.p ? st.hi + 1 : "\u2013"}`)), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "pseudocode", fontSize: "12" }, /* @__PURE__ */ React.createElement("rect", { x: "440", y: "112", width: "296", height: "212", rx: "8", fill: "none", stroke: edge, strokeWidth: "1" }), st.line > 0 ? /* @__PURE__ */ React.createElement("rect", { x: "444", y: lineY(st.line) - 15, width: "288", height: "21", rx: "4", fill: accent, fillOpacity: "0.18" }) : null, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-head", x: "452", y: lineY(0), fontWeight: "600", fill: ink }, "PARTITION(A, p, r)"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n1", x: "452", y: lineY(1), fill: quiet }, "1"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-1", x: "476", y: lineY(1), fill: ink }, "x = A[r]"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n2", x: "452", y: lineY(2), fill: quiet }, "2"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-2", x: "476", y: lineY(2), fill: ink }, "i = p \u2212 1"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n3", x: "452", y: lineY(3), fill: quiet }, "3"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-3", x: "476", y: lineY(3), fill: ink }, "for j = p to r \u2212 1"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n4", x: "452", y: lineY(4), fill: quiet }, "4"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-4", x: "496", y: lineY(4), fill: ink }, "if A[j] \u2264 x"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n5", x: "452", y: lineY(5), fill: quiet }, "5"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-5", x: "516", y: lineY(5), fill: ink }, "i = i + 1"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n6", x: "452", y: lineY(6), fill: quiet }, "6"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-6", x: "516", y: lineY(6), fill: ink }, "bytt A[i] og A[j]"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n7", x: "452", y: lineY(7), fill: quiet }, "7"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-7", x: "476", y: lineY(7), fill: ink }, "bytt A[i + 1] og A[r]"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-n8", x: "452", y: lineY(8), fill: quiet }, "8"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "pc-8", x: "476", y: lineY(8), fill: ink }, "return i + 1")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "352", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "374", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["radix-sort"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", tint = "var(--cds-chart-reference-tint)", accent = "var(--cds-chart-categorical-1)", cmpc = "var(--cds-chart-categorical-2)";
  const names = ["enerplassen", "tierplassen", "hundrerplassen"];
  const steps = (() => {
    let A = [329, 457, 657, 839, 436, 720, 355];
    const out = [];
    const dig = (x, i) => Math.floor(x / Math.pow(10, i - 1)) % 10;
    const empty = [null, null, null, null, null, null, null];
    out.push({ pass: 0, hl: 0, before: A.slice(), after: empty.slice(), C: [], ja: -1, bw: -1, cd: -1, a: "Start: A = \u27E8329, 457, 657, 839, 436, 720, 355\u27E9, med d = 3 sifre.", b: "Hvert pass sorterer stabilt p\xE5 ett siffer, fra det minst signifikante." });
    for (let i = 1; i <= 3; i += 1) {
      const nm = names.at(i - 1);
      const C = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      A.forEach((x) => {
        const d = dig(x, i);
        C.splice(d, 1, C.at(d) + 1);
      });
      for (let t = 1; t < 10; t += 1) {
        C.splice(t, 1, C.at(t) + C.at(t - 1));
      }
      const B = empty.slice();
      out.push({ pass: i, hl: i, before: A.slice(), after: B.slice(), C: C.slice(), ja: -1, bw: -1, cd: -1, a: `Pass ${i}: Counting-Sort p\xE5 ${nm}. C viser antall elementer med siffer \u2264 v.`, b: "Tellingen og prefikssummene er gjort. N\xE5 plasseres elementene bakfra." });
      for (let j = 6; j >= 0; j -= 1) {
        const v = A.at(j), d = dig(v, i), pos = C.at(d);
        B.splice(pos - 1, 1, v);
        C.splice(d, 1, pos - 1);
        out.push({ pass: i, hl: i, before: A.slice(), after: B.slice(), C: C.slice(), ja: j, bw: pos - 1, cd: d, a: `${v} har siffer ${d} p\xE5 ${nm}, og C[${d}] = ${pos}, s\xE5 det plasseres p\xE5 plass ${pos}.`, b: `Etter pass ${i} er A sortert p\xE5 de ${i} siste sifrene. Like sifre beholder rekkef\xF8lgen.` });
      }
      A = B.slice();
    }
    out.push({ pass: 4, hl: 0, before: A.slice(), after: A.slice(), C: [], ja: -1, bw: -1, cd: -1, a: "Ferdig: A = \u27E8329, 355, 436, 457, 657, 720, 839\u27E9.", b: "Tre stabile pass p\xE5 hvert sitt siffer ga en fullstendig sortert tabell." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const ry = (k) => 140 + k * 28, ccx = (c) => 97 + c * 36;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const num = (v, x, y, bold) => /* @__PURE__ */ React.createElement("text", { x, y, textAnchor: "middle", fontSize: "15", fill: ink }, String(v).split("").map((ch, t) => /* @__PURE__ */ React.createElement("tspan", { key: t, fill: st.hl > 0 && t === 3 - st.hl ? accent : ink, fontWeight: st.hl > 0 && t === 3 - st.hl || bold ? 700 : 400 }, ch)));
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 486", role: "img", "aria-label": "Radix-Sort steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("marker", { id: "rx-arrow", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" }, /* @__PURE__ */ React.createElement("path", { d: "M0 0L10 5L0 10z", fill: cmpc }))), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Radix-Sort steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Hvert pass er en stabil Counting-Sort p\xE5 ett siffer; hvert trykk plasserer ett tall"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "lists" }, /* @__PURE__ */ React.createElement("text", { x: "100", y: "128", textAnchor: "middle", fontWeight: "600", fill: ink }, st.pass >= 1 && st.pass <= 3 ? `F\xF8r pass ${st.pass}` : st.pass === 4 ? "Sortert" : "A"), /* @__PURE__ */ React.createElement("text", { x: "340", y: "128", textAnchor: "middle", fontWeight: "600", fill: ink }, st.pass >= 1 && st.pass <= 3 ? `Etter pass ${st.pass}` : ""), st.before.map((v, k) => /* @__PURE__ */ React.createElement("g", { key: `b${k}` }, /* @__PURE__ */ React.createElement("rect", { x: "40", y: ry(k), width: "120", height: "24", rx: "4", fill: "none", stroke: k === st.ja ? cmpc : edge, strokeWidth: k === st.ja ? 2 : 1 }), num(v, 100, ry(k) + 18, false), /* @__PURE__ */ React.createElement("text", { x: "30", y: ry(k) + 17, textAnchor: "end", fontSize: "11.5", fill: quiet }, k + 1))), st.pass >= 1 && st.pass <= 3 ? st.after.map((v, k) => /* @__PURE__ */ React.createElement("g", { key: `a${k}` }, /* @__PURE__ */ React.createElement("rect", { x: "280", y: ry(k), width: "120", height: "24", rx: "4", fill: v !== null ? tint : "none", stroke: k === st.bw ? accent : edge, strokeWidth: k === st.bw ? 2 : 1 }), v !== null ? num(v, 340, ry(k) + 18, k === st.bw) : null, /* @__PURE__ */ React.createElement("text", { x: "410", y: ry(k) + 17, fontSize: "11.5", fill: quiet }, k + 1))) : null, st.ja >= 0 ? /* @__PURE__ */ React.createElement("line", { x1: "164", y1: ry(st.ja) + 12, x2: "276", y2: ry(st.bw) + 12, stroke: cmpc, strokeWidth: "1.25", markerEnd: "url(#rx-arrow)" }) : null), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "count-array" }, st.C.length > 0 ? /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "c-label", x: "24", y: "358", fontWeight: "600", fill: ink }, "C"), st.C.map((v, c) => /* @__PURE__ */ React.createElement("g", { key: `c${c}` }, /* @__PURE__ */ React.createElement("rect", { x: ccx(c) - 16, y: "340", width: "32", height: "30", fill: c === st.cd ? accent : "none", fillOpacity: c === st.cd ? 0.15 : 1, stroke: c === st.cd ? accent : edge, strokeWidth: c === st.cd ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: ccx(c), y: "360", textAnchor: "middle", fill: ink }, v), /* @__PURE__ */ React.createElement("text", { x: ccx(c), y: "388", textAnchor: "middle", fontSize: "11.5", fill: quiet }, c)))) : null), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "note" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "note-1", x: "470", y: "160", fontSize: "12", fill: quiet }, "Uthevet siffer: det som sorteres p\xE5"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "note-2", x: "470", y: "182", fontSize: "12", fill: quiet }, "i dette passet. Pilen viser hvor"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "note-3", x: "470", y: "204", fontSize: "12", fill: quiet }, "elementet havner i neste tabell.")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "440", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "462", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["randomized-select"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", accent = "var(--cds-chart-categorical-1)", lowc = "var(--cds-chart-categorical-3)", highc = "var(--cds-chart-categorical-4)", good = "var(--cds-chart-status-good)";
  const steps = (() => {
    const A = [3, 2, 9, 0, 7, 5, 4, 8, 6, 1], picks = [7, 2, 5, 3], out = [], calls = [];
    let pk = 0;
    const snap = (o) => out.push({ p: 0, r: 9, i: 5, q: -1, k: -1, piv: -1, ans: false, ...o, A: A.slice(), calls: calls.slice() });
    const swap = (a, b) => {
      const t = A.at(a);
      A.splice(a, 1, A.at(b));
      A.splice(b, 1, t);
    };
    const part = (p, r) => {
      const x = A.at(r);
      let i = p - 1;
      for (let j = p; j < r; j += 1) {
        if (A.at(j) <= x) {
          i += 1;
          swap(i, j);
        }
      }
      swap(i + 1, r);
      return i + 1;
    };
    const sel = (p, r, i) => {
      calls.push(`Randomized-Select(A, ${p + 1}, ${r + 1}, ${i})`);
      if (p === r) {
        snap({ p, r, i, q: p, k: 1, ans: true, a: `p = r = ${p + 1}: bare ett element igjen, og da m\xE5 i = 1.`, b: `Svaret er A[${p + 1}] = ${A.at(p)}, det 5. minste elementet i hele A.` });
        return A.at(p);
      }
      const val = picks.at(pk);
      pk += 1;
      let t = p;
      for (let u = p; u <= r; u += 1) {
        if (A.at(u) === val) {
          t = u;
        }
      }
      swap(t, r);
      snap({ p, r, i, piv: r, a: `Kall (A, ${p + 1}, ${r + 1}, ${i}): RANDOM velger A[${t + 1}] = ${val}, som byttes med A[${r + 1}].`, b: "Pivoten st\xE5r n\xE5 bakerst, klar for Partition." });
      const q = part(p, r), k = q - p + 1;
      const dec = i === k ? `i = k = ${k}: pivoten er svaret.` : i < k ? `i = ${i} < k = ${k}: svaret er det ${i}. minste i A[${p + 1} : ${q}].` : `i = ${i} > k = ${k}: svaret er det ${i - k}. minste i A[${q + 2} : ${r + 1}].`;
      snap({ p, r, i, q, k, a: `Partition setter pivoten ${val} p\xE5 q = ${q + 1}, s\xE5 k = q \u2212 p + 1 = ${k}.`, b: dec });
      if (i === k) {
        return A.at(q);
      }
      if (i < k) {
        return sel(p, q - 1, i);
      }
      return sel(q + 1, r, i - k);
    };
    snap({ a: "Finn det 5. minste elementet i A = \u27E83, 2, 9, 0, 7, 5, 4, 8, 6, 1\u27E9.", b: "Pivotene er valgt p\xE5 forh\xE5nd for eksempelets skyld; i algoritmen er de tilfeldige." });
    sel(0, 9, 5);
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const cx = (c) => 46 + c * 44;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const zone = (c) => {
    if (c < st.p || c > st.r) {
      return "out";
    }
    if (st.ans) {
      return "ans";
    }
    if (st.q >= 0) {
      return c === st.q ? "pivot" : c < st.q ? "low" : "high";
    }
    if (c === st.piv) {
      return "pivot";
    }
    return "none";
  };
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 372", role: "img", "aria-label": "Randomized-Select steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Randomized-Select steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Finn det i-te minste elementet: partisjoner, og fortsett bare p\xE5 \xE9n side"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "array" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "a-label", x: "24", y: "128", fontWeight: "600", fill: ink }, "A"), st.A.map((v, c) => {
    const z = zone(c);
    const fill = z === "low" ? lowc : z === "high" ? highc : z === "pivot" ? accent : z === "ans" ? good : "none";
    return /* @__PURE__ */ React.createElement("g", { key: c }, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 20, y: "140", width: "40", height: "42", fill, fillOpacity: z === "low" || z === "high" ? 0.22 : z === "pivot" || z === "ans" ? 0.18 : 1, stroke: z === "pivot" ? accent : z === "ans" ? good : edge, strokeWidth: z === "pivot" || z === "ans" ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "166", textAnchor: "middle", fontWeight: z === "pivot" || z === "ans" ? 600 : 400, fill: ink, fillOpacity: z === "out" ? 0.35 : 1 }, v), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "200", textAnchor: "middle", fontSize: "11.5", fill: quiet }, c + 1));
  }), st.q >= 0 && !st.ans ? /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "q-mark", x: cx(st.q), y: "220", textAnchor: "middle", fontWeight: "600", fill: accent }, "\u2191 q") : null), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "legend" }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "238", width: "18", height: "14", fill: lowc, fillOpacity: "0.22", stroke: edge, strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-low", x: "50", y: "249", fontSize: "12", fill: quiet }, "\u2264 pivot"), /* @__PURE__ */ React.createElement("rect", { x: "130", y: "238", width: "18", height: "14", fill: highc, fillOpacity: "0.22", stroke: edge, strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-high", x: "156", y: "249", fontSize: "12", fill: quiet }, "> pivot"), /* @__PURE__ */ React.createElement("rect", { x: "236", y: "238", width: "18", height: "14", fill: accent, fillOpacity: "0.18", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-pivot", x: "262", y: "249", fontSize: "12", fill: quiet }, "pivot"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "leg-out", x: "330", y: "249", fontSize: "12", fill: quiet }, "nedtonet: forkastet")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "variables" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "282", fill: ink }, `p = ${st.p + 1}`), /* @__PURE__ */ React.createElement("text", { x: "94", y: "282", fill: ink }, `r = ${st.r + 1}`), /* @__PURE__ */ React.createElement("text", { x: "164", y: "282", fill: ink }, `i = ${st.i}`), /* @__PURE__ */ React.createElement("text", { x: "234", y: "282", fill: ink }, `q = ${st.q >= 0 ? st.q + 1 : "\u2013"}`), /* @__PURE__ */ React.createElement("text", { x: "304", y: "282", fill: ink }, `k = ${st.k >= 0 ? st.k : "\u2013"}`)), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "calls" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "calls-title", x: "500", y: "128", fontSize: "12", fill: quiet }, "Rekursive kall"), st.calls.map((c, k) => /* @__PURE__ */ React.createElement("text", { key: k, x: "500", y: 150 + k * 22, fontSize: "12", fill: ink, fontWeight: k === st.calls.length - 1 ? 600 : 400 }, c))), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "330", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "352", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["rod-cutting"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", tint = "var(--cds-chart-reference-tint)", accent = "var(--cds-chart-categorical-1)", good = "var(--cds-chart-status-good)";
  const P = [1, 5, 8, 9, 10, 17, 17, 20];
  const steps = (() => {
    const r = [0], sv = [null], out = [];
    const snap = (o) => out.push({ j: -1, cands: [], best: -1, cut: [], ...o, r: r.slice(), sv: sv.slice() });
    snap({ a: "Linje 2: r[0] = 0. En stang med lengde 0 gir ingen inntekt.", b: "Delinstansene l\xF8ses i stigende lengde, s\xE5 r[j \u2212 i] alltid er klar n\xE5r r[j] trengs." });
    for (let j = 1; j <= 8; j += 1) {
      const cands = [];
      let q = -1, bi = -1;
      for (let i = 1; i <= j; i += 1) {
        const v = P.at(i - 1) + r.at(j - i);
        cands.push([i, P.at(i - 1), r.at(j - i), v]);
        if (q < v) {
          q = v;
          bi = i;
        }
      }
      r.push(q);
      sv.push(bi);
      snap({ j, cands, best: bi, a: `j = ${j}: pr\xF8v alle f\xF8rste stykker i = 1, \u2026, ${j}. Best er i = ${bi}: p[${bi}] + r[${j - bi}] = ${q}.`, b: `r[${j}] = ${q} og s[${j}] = ${bi}. Buene viser de ${j} delinstansene r[${j}] avhenger av.` });
    }
    snap({ j: 8, cut: [8], a: "Rekonstruksjon for n = 8: s[8] = 2, s\xE5 f\xF8rste stykke har lengde 2. Resten har lengde 6.", b: "Print-Cut-Rod-Solution f\xF8lger de lagrede beslutningene i s." });
    snap({ j: 6, cut: [8, 6], a: "s[6] = 6: resten tas som ett stykke p\xE5 6. Kuttene er 2 + 6, med inntekt 5 + 17 = 22.", b: "Rekonstruksjonen tar O(n) tid fordi hvert steg bare sl\xE5r opp i s." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const cx = (c) => 114 + c * 50;
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const arc = (a, b, on) => {
    const x1 = cx(a), x2 = cx(b), h = 10 + Math.abs(a - b) * 6;
    return /* @__PURE__ */ React.createElement("path", { d: `M${x1} 236Q${(x1 + x2) / 2} ${236 - h} ${x2} 236`, fill: "none", stroke: on ? accent : edge, strokeWidth: on ? 2 : 1, opacity: on ? 1 : 0.5 });
  };
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 420", role: "img", "aria-label": "Stavkapping bottom-up steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Stavkapping bottom-up steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "Extended-Bottom-Up-Cut-Rod med prisene fra bokas figur 14.1, n = 8"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "prices" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "len-label", x: "24", y: "132", fontSize: "12", fill: quiet }, "lengde i"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "p-label", x: "24", y: "160", fontWeight: "600", fill: ink }, "p[i]"), P.map((v, c) => /* @__PURE__ */ React.createElement("g", { key: `p${c}` }, /* @__PURE__ */ React.createElement("text", { x: cx(c + 1), y: "132", textAnchor: "middle", fontSize: "11.5", fill: quiet }, c + 1), /* @__PURE__ */ React.createElement("rect", { x: cx(c + 1) - 22, y: "140", width: "44", height: "30", fill: st.best === c + 1 && st.cut.length === 0 ? accent : "none", fillOpacity: "0.15", stroke: edge, strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: cx(c + 1), y: "160", textAnchor: "middle", fill: ink }, v)))), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "graph" }, st.cut.length === 0 ? st.cands.map((cd) => /* @__PURE__ */ React.createElement("g", { key: `arc${cd.at(0)}` }, arc(st.j, st.j - cd.at(0), cd.at(0) === st.best))) : null), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "table-r" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "r-label", x: "24", y: "261", fontWeight: "600", fill: ink }, "r[j]"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "s-label", x: "24", y: "305", fontWeight: "600", fill: ink }, "s[j]"), [0, 1, 2, 3, 4, 5, 6, 7, 8].map((c) => {
    const has = c < st.r.length, cur = c === st.j && st.cut.length === 0, inCut = st.cut.includes(c);
    return /* @__PURE__ */ React.createElement("g", { key: `r${c}` }, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 22, y: "240", width: "44", height: "32", fill: cur ? accent : has ? tint : "none", fillOpacity: cur ? 0.15 : 1, stroke: cur ? accent : edge, strokeWidth: cur ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "261", textAnchor: "middle", fontWeight: cur ? 600 : 400, fill: ink }, has ? st.r.at(c) : ""), c > 0 ? /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("rect", { x: cx(c) - 22, y: "284", width: "44", height: "32", fill: inCut ? good : "none", fillOpacity: "0.16", stroke: inCut ? good : edge, strokeWidth: inCut ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "305", textAnchor: "middle", fontWeight: inCut ? 600 : 400, fill: ink }, has ? st.sv.at(c) : "")) : null, /* @__PURE__ */ React.createElement("text", { x: cx(c), y: "334", textAnchor: "middle", fontSize: "11.5", fill: quiet }, c));
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "candidates" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "cand-title", x: "580", y: "132", fontSize: "12", fill: quiet }, "Kandidater p[i] + r[j \u2212 i]"), st.cut.length === 0 ? st.cands.map((cd, k) => /* @__PURE__ */ React.createElement("text", { key: `c${k}`, x: "580", y: 156 + k * 20, fontSize: "12", fontWeight: cd.at(0) === st.best ? 600 : 400, fill: cd.at(0) === st.best ? accent : ink }, `i = ${cd.at(0)}: ${cd.at(1)} + ${cd.at(2)} = ${cd.at(3)}`)) : null), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "374", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "396", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["scc"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", accent = "var(--cds-chart-categorical-1)";
  const cc = ["var(--cds-chart-categorical-1)", "var(--cds-chart-categorical-2)", "var(--cds-chart-categorical-3)", "var(--cds-chart-categorical-5)"];
  const V = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const P = /* @__PURE__ */ new Map([["a", [100, 160]], ["b", [230, 160]], ["c", [360, 160]], ["d", [490, 160]], ["e", [100, 290]], ["f", [230, 290]], ["g", [360, 290]], ["h", [490, 290]]]);
  const E = [["a", "b"], ["b", "c"], ["b", "e"], ["b", "f"], ["c", "d"], ["c", "g"], ["d", "c"], ["d", "h"], ["e", "a"], ["e", "f"], ["f", "g"], ["g", "f"], ["g", "h"]];
  const Adj = /* @__PURE__ */ new Map([["c", ["g", "d"]], ["g", ["f", "h"]], ["f", ["g"]], ["h", ["h"]], ["d", ["c", "h"]], ["b", ["e", "f", "c"]], ["e", ["a", "f"]], ["a", ["b"]]]);
  const res = (() => {
    const col = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), fin = [];
    let time = 0;
    V.forEach((v) => col.set(v, "w"));
    const visit = (u) => {
      time += 1;
      d.set(u, time);
      col.set(u, "g");
      Adj.get(u).forEach((v) => {
        if (col.get(v) === "w") {
          visit(v);
        }
      });
      time += 1;
      f.set(u, time);
      col.set(u, "b");
      fin.unshift(u);
    };
    ["c", "b", "a", "d", "e", "f", "g", "h"].forEach((u) => {
      if (col.get(u) === "w") {
        visit(u);
      }
    });
    const AT = /* @__PURE__ */ new Map();
    V.forEach((v) => AT.set(v, []));
    E.forEach((e) => AT.get(e.at(1)).push(e.at(0)));
    AT.get("h").push("h");
    const c2 = /* @__PURE__ */ new Map(), comps = [];
    V.forEach((v) => c2.set(v, -1));
    const visit2 = (u, k) => {
      c2.set(u, k);
      comps.at(k).push(u);
      AT.get(u).forEach((v) => {
        if (c2.get(v) === -1) {
          visit2(v, k);
        }
      });
    };
    fin.forEach((u) => {
      if (c2.get(u) === -1) {
        comps.push([]);
        visit2(u, comps.length - 1);
      }
    });
    return { d, f, fin, c2, comps };
  })();
  const cs = res.comps;
  const steps = [{ ph: 0, k: -1, a: "Grafen G fra bokas figur 20.9. Linje 1: kj\xF8r DFS(G) for \xE5 finne ferdigtidene.", b: "DFS starter i c og deretter i b. Trykk Neste for resultatet." }, { ph: 1, k: -1, a: "DFS(G) er ferdig. Tallene er d/f for hver node.", b: `Synkende ferdigtid: ${res.fin.join(", ")}. Denne rekkef\xF8lgen brukes i linje 3.` }, { ph: 2, k: -1, a: "Linje 2: lag G\u1D40 ved \xE5 snu alle kantene. G og G\u1D40 har de samme sterke komponentene.", b: `Linje 3: DFS(G\u1D40) med hovedl\xF8kken i rekkef\xF8lgen ${res.fin.join(", ")}.` }].concat(cs.map((c, k) => ({ ph: 3, k, a: `DFS(G\u1D40) fra ${c.at(0)} (st\xF8rst gjenv\xE6rende f = ${res.f.get(c.at(0))}) n\xE5r {${c.join(", ")}}. Det er sterk komponent nr. ${k + 1}.`, b: k === 0 ? "Kanter i G\u1D40 ut av denne komponenten ville g\xE5tt til en komponent med st\xF8rre f. Den finnes ikke." : "Kantene i G\u1D40 som g\xE5r ut av komponenten, f\xF8rer bare til svarte noder i komponenter som er funnet." }))).concat([{ ph: 4, k: cs.length - 1, a: "Komponentgrafen: {a,b,e} \u2192 {c,d} \u2192 {f,g} \u2192 {h}, pluss {a,b,e} \u2192 {f,g} og {c,d} \u2192 {h}.", b: "Komponentgrafen er alltid en DAG. Komponentene ble funnet i topologisk rekkef\xF8lge." }]);
  const N = steps.length, st = steps.at(s);
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const has = (a, b) => E.some((e) => e.at(0) === a && e.at(1) === b);
  const seg = (a, b) => {
    const p = P.get(a), q = P.get(b), L = Math.hypot(q.at(0) - p.at(0), q.at(1) - p.at(1)), ux = (q.at(0) - p.at(0)) / L, uy = (q.at(1) - p.at(1)) / L, o = has(b, a) ? 6 : 0;
    return [p.at(0) + ux * 22 - uy * o, p.at(1) + uy * 22 + ux * o, q.at(0) - ux * 25 - uy * o, q.at(1) - uy * 25 + ux * o];
  };
  const ck = (v) => res.c2.get(v);
  const shownComp = (v) => st.ph >= 3 && ck(v) <= st.k;
  const hp = P.get("h");
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 460", role: "img", "aria-label": "Sterke komponenter steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("marker", { id: "scc-arrow", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" }, /* @__PURE__ */ React.createElement("path", { d: "M0 0L10 5L0 10z", fill: edge }))), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Strongly-Connected-Components steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "DFS p\xE5 G, snu kantene, DFS p\xE5 G\u1D40 i synkende ferdigtid"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N} \xB7 ${st.ph >= 2 ? "graf: G\u1D40" : "graf: G"}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "edges" }, E.map((e) => {
    const rev = st.ph >= 2, a = rev ? e.at(1) : e.at(0), b = rev ? e.at(0) : e.at(1), g = seg(a, b), same = shownComp(a) && shownComp(b) && ck(a) === ck(b);
    return /* @__PURE__ */ React.createElement("line", { key: `${e.at(0)}${e.at(1)}`, x1: g.at(0), y1: g.at(1), x2: g.at(2), y2: g.at(3), stroke: same ? cc.at(ck(a)) : edge, strokeWidth: same ? 2.5 : 1.25, markerEnd: "url(#scc-arrow)", opacity: st.ph >= 3 && !same ? 0.55 : 1 });
  }), /* @__PURE__ */ React.createElement("path", { d: `M${hp.at(0) + 18} ${hp.at(1) - 14}C${hp.at(0) + 70} ${hp.at(1) - 50} ${hp.at(0) + 70} ${hp.at(1) + 50} ${hp.at(0) + 21} ${hp.at(1) + 12}`, fill: "none", stroke: shownComp("h") ? cc.at(ck("h")) : edge, strokeWidth: "1.25", markerEnd: "url(#scc-arrow)" })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "nodes" }, V.map((v) => {
    const p = P.get(v), sc = shownComp(v), cur = st.ph === 3 && ck(v) === st.k;
    return /* @__PURE__ */ React.createElement("g", { key: v }, /* @__PURE__ */ React.createElement("circle", { cx: p.at(0), cy: p.at(1), r: "22", fill: sc ? cc.at(ck(v)) : "none", fillOpacity: sc ? 0.22 : 0, stroke: sc ? cc.at(ck(v)) : edge, strokeWidth: cur ? 3.5 : sc ? 2 : 1.25 }), /* @__PURE__ */ React.createElement("text", { x: p.at(0), y: p.at(1) + 5, textAnchor: "middle", fontSize: "14", fontWeight: "600", fill: ink }, v), st.ph >= 1 ? /* @__PURE__ */ React.createElement("text", { x: p.at(0), y: p.at(1) + (p.at(1) < 200 ? -30 : 42), textAnchor: "middle", fontSize: "12", fill: quiet }, `${res.d.get(v)}/${res.f.get(v)}`) : null);
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "side" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "side-title", x: "592", y: "140", fontSize: "12", fill: quiet }, "Komponenter funnet:"), cs.map((c, k) => st.ph >= 3 && k <= st.k ? /* @__PURE__ */ React.createElement("text", { key: `c${k}`, x: "592", y: 166 + k * 24, fontSize: "13", fontWeight: "600", fill: cc.at(k) }, `${k + 1}: {${c.join(", ")}}`) : null)), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "408", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "430", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["topological-sort"] = (function(){ return () => {
  const [s, setS] = React.useState(0);
  const ink = "var(--cds-text-primary)", quiet = "var(--cds-text-secondary)", edge = "var(--cds-chart-axis)", accent = "var(--cds-chart-categorical-1)", grayc = "var(--cds-chart-categorical-4)", good = "var(--cds-chart-status-good)";
  const order = ["skjorte", "slips", "jakke", "belte", "klokke", "underbukse", "bukse", "sko", "sokker"];
  const P = /* @__PURE__ */ new Map([["underbukse", [90, 150]], ["sokker", [250, 150]], ["skjorte", [430, 150]], ["klokke", [610, 150]], ["bukse", [90, 240]], ["sko", [250, 240]], ["slips", [430, 240]], ["belte", [250, 330]], ["jakke", [430, 330]]]);
  const Adj = /* @__PURE__ */ new Map([["skjorte", ["slips", "belte"]], ["slips", ["jakke"]], ["jakke", []], ["belte", ["jakke"]], ["klokke", []], ["underbukse", ["bukse", "sko"]], ["bukse", ["sko", "belte"]], ["sko", []], ["sokker", ["sko"]]]);
  const E = [["underbukse", "bukse"], ["underbukse", "sko"], ["bukse", "sko"], ["bukse", "belte"], ["sokker", "sko"], ["skjorte", "slips"], ["skjorte", "belte"], ["slips", "jakke"], ["belte", "jakke"]];
  const steps = (() => {
    const col = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), out = [], list = [];
    let time = 0;
    order.forEach((v) => col.set(v, "w"));
    const snap = (o) => out.push({ cur: null, ...o, col: new Map(col), d: new Map(d), f: new Map(f), list: list.slice() });
    snap({ a: "DFS(G) pr\xF8ver nodene i rekkef\xF8lgen skjorte, slips, jakke, belte, klokke, underbukse, bukse, sko, sokker.", b: "Hver gang en node blir ferdig, settes den inn foran i den lenkede listen." });
    const visit = (u) => {
      time += 1;
      d.set(u, time);
      col.set(u, "g");
      snap({ cur: u, a: `${u} oppdages: d = ${time}.`, b: Adj.get(u).length > 0 ? `Utkanter til: ${Adj.get(u).join(", ")}. Hvite naboer utforskes rekursivt, svarte hoppes over.` : `${u} har ingen utkanter, s\xE5 den blir ferdig med en gang.` });
      Adj.get(u).forEach((v) => {
        if (col.get(v) === "w") {
          visit(v);
        }
      });
      time += 1;
      f.set(u, time);
      col.set(u, "b");
      list.unshift(u);
      snap({ cur: u, a: `${u} er ferdig: f = ${time}. ${u} settes inn foran i listen.`, b: "Alt som m\xE5 komme etter denne noden, er allerede ferdig og st\xE5r lenger bak i listen." });
    };
    order.forEach((u) => {
      if (col.get(u) === "w") {
        visit(u);
      }
    });
    snap({ a: `Ferdig. Topologisk rekkef\xF8lge: ${list.join(", ")}.`, b: "Sjekk: hver kant g\xE5r fra venstre mot h\xF8yre i listen, fordi f er synkende langs listen." });
    return out;
  })();
  const N = steps.length, st = steps.at(s);
  const go = (d) => setS(Math.max(0, Math.min(N - 1, s + d)));
  const cut = (p, dx, dy) => {
    const t = Math.min(dx === 0 ? 999 : 47 / Math.abs(dx), dy === 0 ? 999 : 16 / Math.abs(dy));
    return [p.at(0) + dx * t, p.at(1) + dy * t];
  };
  const seg = (a, b) => {
    const p = P.get(a), q = P.get(b), L = Math.hypot(q.at(0) - p.at(0), q.at(1) - p.at(1)), ux = (q.at(0) - p.at(0)) / L, uy = (q.at(1) - p.at(1)) / L;
    const st0 = cut(p, ux, uy), en = cut(q, -ux, -uy);
    return [st0.at(0), st0.at(1), en.at(0) - ux * 3, en.at(1) - uy * 3];
  };
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 490", role: "img", "aria-label": "Topologisk sortering steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("marker", { id: "topo-arrow", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" }, /* @__PURE__ */ React.createElement("path", { d: "M0 0L10 5L0 10z", fill: edge }))), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "title", x: "24", y: "30", fontSize: "15", fontWeight: "600", fill: ink }, "Topological-Sort steg for steg"), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "subtitle", x: "24", y: "50", fontSize: "12", fill: quiet }, "P\xE5kledning fra bokas figur 20.7: en kant u \u2192 v betyr at u m\xE5 p\xE5 f\xF8r v"), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-back", onClick: () => go(-1), cursor: "pointer", opacity: s === 0 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "24", y: "68", width: "110", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-back-label", x: "79", y: "89", textAnchor: "middle", fill: ink }, "\u25C0 Tilbake")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-next", onClick: () => go(1), cursor: "pointer", opacity: s === N - 1 ? 0.4 : 1 }, /* @__PURE__ */ React.createElement("rect", { x: "146", y: "68", width: "110", height: "32", rx: "8", fill: accent, fillOpacity: "0.12", stroke: accent, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-next-label", x: "201", y: "89", textAnchor: "middle", fontWeight: "600", fill: ink }, "Neste \u25B6")), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "btn-reset", onClick: () => setS(0), cursor: "pointer" }, /* @__PURE__ */ React.createElement("rect", { x: "268", y: "68", width: "90", height: "32", rx: "8", fill: "none", stroke: edge, strokeWidth: "1.25" }), /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "btn-reset-label", x: "313", y: "89", textAnchor: "middle", fill: ink }, "Til start")), /* @__PURE__ */ React.createElement("text", { x: "376", y: "89", fontSize: "12", fill: quiet }, `Steg ${s + 1} av ${N}`), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "edges" }, E.map((e) => {
    const g = seg(e.at(0), e.at(1));
    return /* @__PURE__ */ React.createElement("line", { key: `${e.at(0)}${e.at(1)}`, x1: g.at(0), y1: g.at(1), x2: g.at(2), y2: g.at(3), stroke: edge, strokeWidth: "1.25", markerEnd: "url(#topo-arrow)" });
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "nodes" }, order.map((v) => {
    const p = P.get(v), c = st.col.get(v), cur = v === st.cur;
    return /* @__PURE__ */ React.createElement("g", { key: v }, /* @__PURE__ */ React.createElement("rect", { x: p.at(0) - 46, y: p.at(1) - 15, width: "92", height: "30", rx: "8", fill: c === "b" ? ink : c === "g" ? grayc : "none", fillOpacity: c === "b" ? 0.7 : c === "g" ? 0.28 : 0, stroke: cur ? accent : edge, strokeWidth: cur ? 3 : 1.25 }), /* @__PURE__ */ React.createElement("text", { x: p.at(0), y: p.at(1) + 4.5, textAnchor: "middle", fontSize: "12.5", fontWeight: "600", fill: c === "b" ? "var(--cds-chart-reference-tint)" : ink }, v), /* @__PURE__ */ React.createElement("text", { x: p.at(0) + 50, y: p.at(1) - 18, fontSize: "11.5", fill: quiet }, `${st.d.has(v) ? st.d.get(v) : ""}${st.d.has(v) ? "/" : ""}${st.f.has(v) ? st.f.get(v) : ""}`));
  })), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "list" }, /* @__PURE__ */ React.createElement("text", { "data-claude-text-id": "list-label", x: "24", y: "392", fontSize: "12", fill: quiet }, "Lenket liste (nye noder settes inn foran):"), st.list.map((v, k) => /* @__PURE__ */ React.createElement("g", { key: `l${v}` }, /* @__PURE__ */ React.createElement("rect", { x: 24 + k * 79, y: "402", width: "72", height: "26", rx: "4", fill: k === 0 && st.cur === v ? good : "none", fillOpacity: "0.18", stroke: k === 0 && st.cur === v ? good : edge, strokeWidth: k === 0 && st.cur === v ? 2 : 1 }), /* @__PURE__ */ React.createElement("text", { x: 60 + k * 79, y: "420", textAnchor: "middle", fontSize: "11.5", fill: ink }, v)))), /* @__PURE__ */ React.createElement("g", { "data-claude-anchor": "explanation" }, /* @__PURE__ */ React.createElement("text", { x: "24", y: "458", fill: ink }, st.a), /* @__PURE__ */ React.createElement("text", { x: "24", y: "480", fill: quiet }, st.b)));
};
 })();
window.AlgWidgets["transitive-closure"] = (function(){ const { C, Controls, Title, Explain, Node, Edge, Matrix } = window.AlgLib;
const n = 4;
const P = [[80, 170], [240, 170], [240, 320], [80, 320]];
const E = [[2, 3, 14], [3, 2, 14], [2, 4, 0], [4, 1, 0], [4, 3, 0]];
const LBL = [1, 2, 3, 4];
function buildSteps() {
  let T = [...Array(n)].map((_, i) => [...Array(n)].map((__, j) => i === j ? 1 : 0));
  E.forEach(([u, v]) => {
    T[u - 1][v - 1] = 1;
  });
  const out = [{ k: 0, T: T.map((r) => r.slice()), changed: [], a: "Linje 1\u20136: t\u207D\u2070\u207E\u1D62\u2C7C = 1 hvis i = j eller (i, j) er en kant, ellers 0.", b: "t\u207D\u1D4F\u207E\u1D62\u2C7C = 1 betyr at det finnes en sti fra i til j der alle mellomnodene er i {1, \u2026, k}." }];
  for (let k = 1; k <= n; k += 1) {
    const NT = T.map((r) => r.slice()), changed = [];
    for (let i = 0; i < n; i += 1) for (let j = 0; j < n; j += 1) {
      if (!T[i][j] && T[i][k - 1] && T[k - 1][j]) {
        NT[i][j] = 1;
        changed.push([i, j]);
      }
    }
    T = NT;
    out.push({
      k,
      T: T.map((r) => r.slice()),
      changed,
      a: `k = ${k}: t\u1D62\u2C7C = t\u1D62\u2C7C \u2228 (t\u1D62\u2096 \u2227 t\u2096\u2C7C). ${changed.length ? `Nye stier via ${k}: ${changed.map(([i, j]) => `${i + 1} \u2192 ${j + 1}`).join(", ")}.` : `Node ${k} gir ingen nye stier.`}`,
      b: k === n ? "T\u207D\u2074\u207E er den transitive tillukningen: t\u1D62\u2C7C = 1 hvis og bare hvis j kan n\xE5s fra i. Node 1 n\xE5r bare seg selv." : "Samme struktur som Floyd-Warshall, men med \u2228 og \u2227 i stedet for min og +."
    });
  }
  return out;
}
const STEPS = buildSteps();
return () => {
  const [s, setS] = React.useState(0);
  const N = STEPS.length, st = STEPS.at(s);
  const hl = /* @__PURE__ */ new Map();
  st.changed.forEach(([i, j]) => hl.set(`${i},${j}`, C.good));
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 470", role: "img", "aria-label": "Transitive-Closure steg for steg", fontSize: "13" }, /* @__PURE__ */ React.createElement(Title, { title: "Transitive-Closure steg for steg", subtitle: "Grafen fra bokas figur 23.5; ett steg per verdi av k" }), /* @__PURE__ */ React.createElement(Controls, { s, N, setS }), E.map(([u, v, bend], idx) => /* @__PURE__ */ React.createElement(
    Edge,
    {
      key: idx,
      p: P[u - 1],
      q: P[v - 1],
      directed: true,
      bend,
      r: 20,
      color: st.k === u || st.k === v ? C.accent : C.edge,
      width: st.k === u || st.k === v ? 2 : 1.25
    }
  )), st.changed.map(([i, j], idx) => i === j ? null : /* @__PURE__ */ React.createElement(Edge, { key: `n${idx}`, p: P[i], q: P[j], directed: true, bend: -30, r: 20, color: C.good, width: 2, dash: "5 4" })), LBL.map((v, i) => /* @__PURE__ */ React.createElement(Node, { key: v, x: P[i][0], y: P[i][1], label: v, fill: st.k === v ? C.accent : "none", fillOpacity: st.k === v ? 0.25 : 0 })), /* @__PURE__ */ React.createElement(Matrix, { x: 400, y: 170, label: `T\u207D${"\u2070\xB9\xB2\xB3\u2074".charAt(st.k)}\u207E`, data: st.T, hl, rowLabels: LBL, colLabels: LBL, cw: 40, ch: 26 }), /* @__PURE__ */ React.createElement("text", { x: "400", y: "310", fontSize: "12", fill: C.quiet }, "Gr\xF8nn celle og stiplet pil = ny sti funnet i denne runden."), /* @__PURE__ */ React.createElement(Explain, { y: 390, a: st.a, b: st.b }));
};
 })();
