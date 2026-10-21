// Bygger docs/javascripts/vendor/piper/: én JS-fil med Piper + ONNX Runtime,
// og WASM-filene de trenger, slik at alt utenom selve stemmemodellen ligger lokalt.
// Stemmemodellen (ca. 63 MB) lastes ned fra Hugging Face første gang den brukes,
// og lagres i nettleseren etterpå.
import { build } from "esbuild";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ut = "../../docs/javascripts/vendor/piper";
mkdirSync(ut, { recursive: true });

await build({
  entryPoints: ["entry.js"],
  bundle: true,
  format: "iife",
  minify: true,
  target: "es2020",
  outfile: `${ut}/piper.js`,
  legalComments: "eof",
  external: ["fs", "path", "crypto", "worker_threads", "url", "module"],  // bare brukt i Node, aldri i nettleseren
});

// Bruk det offisielle Piper-stemmearkivet (rhasspy) i stedet for et speil.
const fil = `${ut}/piper.js`;
let js = readFileSync(fil, "utf8");
const før = js.length;
js = js.replace("https://huggingface.co/diffusionstudio/piper-voices/resolve/main",
                "https://huggingface.co/rhasspy/piper-voices/resolve/main");
if (js.length === før && !js.includes("rhasspy/piper-voices")) throw new Error("Fant ikke HF_BASE i bunten");
writeFileSync(fil, js);

for (const f of ["piper_phonemize.wasm", "piper_phonemize.data"]) {
  copyFileSync(`node_modules/@diffusionstudio/piper-wasm/build/${f}`, `${ut}/${f}`);
}
copyFileSync("node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm", `${ut}/ort-wasm-simd.wasm`);
console.log("Ferdig:", ut);
