import {transformSync} from 'esbuild';
import fs from 'fs';
const dir='widgets'; let out='window.AlgWidgets = window.AlgWidgets || {};\n';
for (const f of fs.readdirSync(dir).filter(f=>f.endsWith('.jsx')).sort()){
  const name=f.replace('.jsx','');
  let src=fs.readFileSync(`${dir}/${f}`,'utf8').replace(/^\s*export default\s*/,'return ');
  const js=transformSync(src,{loader:'jsx',jsxFactory:'React.createElement',jsxFragment:'React.Fragment'}).code;
  out+=`window.AlgWidgets[${JSON.stringify(name)}] = (function(){ ${js} })();\n`;
}
fs.writeFileSync(process.argv[2]||'algwidgets.js',out);
console.log('ok',out.length);
