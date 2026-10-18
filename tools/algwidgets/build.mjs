// Bygger alle figurene i widgets/*.jsx til én fil. lib.jsx (felles byggeklosser)
// legges først og blir tilgjengelig som window.AlgLib.
import {transformSync} from 'esbuild';
import fs from 'fs';

const jsx = src => transformSync(src, {loader: 'jsx', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment'}).code;

let out = 'window.AlgWidgets = window.AlgWidgets || {};\n';
if (fs.existsSync('lib.jsx')) {
  out += `window.AlgLib = (function(){ ${jsx(fs.readFileSync('lib.jsx', 'utf8'))} })();\n`;
}
const dir = 'widgets';
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jsx')).sort()) {
  const name = f.replace('.jsx', '');
  const src = fs.readFileSync(`${dir}/${f}`, 'utf8').replace(/^\s*export default\s*/m, 'return ');
  out += `window.AlgWidgets[${JSON.stringify(name)}] = (function(){ ${jsx(src)} })();\n`;
}
fs.writeFileSync(process.argv[2] || 'algwidgets.js', out);
console.log('ok', out.length);
