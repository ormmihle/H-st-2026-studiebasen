// Opplesning: en «Les opp»-knapp øverst på hver side som leser innholdet
// med nettleserens innebygde talesyntese (Web Speech API). Ingen data sendes
// noe sted av denne koden; stemmene kommer fra nettleseren og Windows.
//
// Siden leses avsnitt for avsnitt, og avsnittet som leses, markeres.
// Klikk på et avsnitt mens opplesningen går for å hoppe dit.
// Lukkede fasit-bokser, kode, formler og interaktive figurer hoppes over.
(function () {
  if (!("speechSynthesis" in window)) return;
  var synth = window.speechSynthesis;

  var LAGRING = "studiebasen-opplesning";
  var innst = { fart: 1, stemme: "" };
  try { Object.assign(innst, JSON.parse(localStorage.getItem(LAGRING) || "{}")); } catch (e) {}
  function lagre() { try { localStorage.setItem(LAGRING, JSON.stringify(innst)); } catch (e) {} }

  var HOPP_OVER = "pre, code, .highlight, .arithmatex, mjx-container, .MathJax, script, style, " +
    ".algwidget, .headerlink, .md-button, .tts-verktoy, svg, .mermaid, .md-source-file";
  var BLOKK = { P: 1, H1: 1, H2: 1, H3: 1, H4: 1, H5: 1, H6: 1, TR: 1, SUMMARY: 1, DT: 1, DD: 1, FIGCAPTION: 1 };

  var blokker = [], indeks = 0, status = "stopp", knapper = {}, aktivEl = null;

  function tekstAv(el, utenBarn) {
    var kopi = el.cloneNode(true);
    kopi.querySelectorAll(HOPP_OVER).forEach(function (n) { n.remove(); });
    if (utenBarn) kopi.querySelectorAll("ul, ol, details, div").forEach(function (n) { n.remove(); });
    if (el.tagName === "TR") {
      return Array.prototype.map.call(kopi.children, function (c) { return c.textContent.trim(); })
        .filter(Boolean).join(". ");
    }
    return kopi.textContent.replace(/\s+/g, " ").trim();
  }

  function skalHoppes(el) {
    if (el.matches(HOPP_OVER)) return true;
    if (el.tagName === "DETAILS" && !el.open) return true;
    return false;
  }

  function samle(rot) {
    Array.prototype.forEach.call(rot.children, function (el) {
      if (skalHoppes(el)) return;
      var tag = el.tagName;
      if (BLOKK[tag]) {
        var t = tekstAv(el);
        if (t) blokker.push({ el: el, tekst: t });
      } else if (tag === "LI") {
        if (el.querySelector(":scope > p")) { samle(el); return; }
        var egen = tekstAv(el, true);
        if (egen) blokker.push({ el: el, tekst: egen });
        Array.prototype.forEach.call(el.children, function (c) {
          if (/^(UL|OL|DIV|DETAILS)$/.test(c.tagName) && !skalHoppes(c)) samle(c);
        });
      } else {
        samle(el);
      }
    });
  }

  // Chrome stopper lange ytringer etter ca. 15 sekunder, så lange avsnitt deles i setninger.
  function biter(tekst) {
    var setninger = tekst.match(/[^.!?:;]+[.!?:;]*\s*/g) || [tekst];
    var ut = [], cur = "";
    setninger.forEach(function (s) {
      if ((cur + s).length > 220 && cur) { ut.push(cur); cur = ""; }
      cur += s;
    });
    if (cur.trim()) ut.push(cur);
    return ut;
  }

  function norskeFørst(a, b) {
    var na = /^(nb|no|nn)/i.test(a.lang) ? 0 : 1, nb = /^(nb|no|nn)/i.test(b.lang) ? 0 : 1;
    if (na !== nb) return na - nb;
    var ka = /natural|online/i.test(a.name) ? 0 : 1, kb = /natural|online/i.test(b.name) ? 0 : 1;
    return ka - kb || a.name.localeCompare(b.name);
  }

  function valgtStemme() {
    var stemmer = synth.getVoices();
    return stemmer.find(function (v) { return v.name === innst.stemme; }) ||
      stemmer.slice().sort(norskeFørst)[0] || null;
  }

  function marker(el) {
    if (aktivEl) aktivEl.classList.remove("tts-aktiv");
    aktivEl = el;
    if (!el) return;
    el.classList.add("tts-aktiv");
    var r = el.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight - 40) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function lesFra(i) {
    synth.cancel();
    indeks = i;
    if (indeks >= blokker.length) { stopp(); return; }
    var blokk = blokker[indeks];
    marker(blokk.el);
    var deler = biter(blokk.tekst), stemme = valgtStemme(), denne = indeks;
    deler.forEach(function (del, n) {
      var u = new SpeechSynthesisUtterance(del);
      if (stemme) { u.voice = stemme; u.lang = stemme.lang; } else { u.lang = "nb-NO"; }
      u.rate = innst.fart;
      if (n === deler.length - 1) {
        u.onend = function () { if (status === "spiller" && indeks === denne) lesFra(denne + 1); };
      }
      synth.speak(u);
    });
    settStatus("spiller");
  }

  function stopp() {
    synth.cancel();
    marker(null);
    settStatus("stopp");
  }

  function settStatus(s) {
    status = s;
    knapper.spill.textContent = s === "spiller" ? "⏸ Pause" : s === "pause" ? "▶ Fortsett" : "▶ Les opp";
    knapper.spill.setAttribute("aria-pressed", s === "spiller" ? "true" : "false");
    knapper.stopp.hidden = s === "stopp";
    document.body.classList.toggle("tts-pa", s !== "stopp");
  }

  function fyllStemmer(velg) {
    var stemmer = synth.getVoices().slice().sort(norskeFørst);
    velg.innerHTML = "";
    stemmer.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v.name;
      o.textContent = v.name.replace(/^Microsoft /, "") + " (" + v.lang + ")";
      velg.appendChild(o);
    });
    var valgt = valgtStemme();
    if (valgt) velg.value = valgt.name;
    var harNorsk = stemmer.some(function (v) { return /^(nb|no|nn)/i.test(v.lang); });
    knapper.tips.hidden = harNorsk || !stemmer.length;
  }

  function lagVerktoy() {
    var artikkel = document.querySelector(".md-content__inner");
    var h1 = artikkel && artikkel.querySelector("h1");
    if (!artikkel || !h1) return;

    var boks = document.createElement("div");
    boks.className = "tts-verktoy";
    boks.innerHTML =
      '<button type="button" class="md-button md-button--primary tts-spill">▶ Les opp</button>' +
      '<button type="button" class="md-button tts-stopp" hidden>⏹ Stopp</button>' +
      '<label>Fart <select class="tts-fart">' +
      [0.8, 1, 1.2, 1.4, 1.7, 2].map(function (f) { return '<option value="' + f + '">' + String(f).replace(".", ",") + "×</option>"; }).join("") +
      "</select></label>" +
      '<label>Stemme <select class="tts-stemme"></select></label>' +
      '<p class="tts-tips" hidden>Fant ingen norsk stemme. I Windows: Innstillinger → Tid og språk → Tale → Legg til stemmer → Norsk (bokmål). Microsoft Edge har også egne, naturlige norske stemmer.</p>';
    h1.insertAdjacentElement("afterend", boks);

    knapper.spill = boks.querySelector(".tts-spill");
    knapper.stopp = boks.querySelector(".tts-stopp");
    knapper.tips = boks.querySelector(".tts-tips");
    var fart = boks.querySelector(".tts-fart"), stemmeValg = boks.querySelector(".tts-stemme");
    fart.value = String(innst.fart);

    knapper.spill.addEventListener("click", function () {
      if (status === "spiller") { synth.pause(); settStatus("pause"); }
      else if (status === "pause") { synth.resume(); settStatus("spiller"); }
      else {
        blokker = [];
        samle(artikkel);
        lesFra(0);
      }
    });
    knapper.stopp.addEventListener("click", stopp);
    fart.addEventListener("change", function () {
      innst.fart = parseFloat(fart.value); lagre();
      if (status === "spiller") lesFra(indeks);
    });
    stemmeValg.addEventListener("change", function () {
      innst.stemme = stemmeValg.value; lagre();
      if (status === "spiller") lesFra(indeks);
    });

    // Klikk på et avsnitt under opplesning for å hoppe dit.
    artikkel.addEventListener("click", function (e) {
      if (status === "stopp" || e.target.closest("a, button, select, summary, .tts-verktoy")) return;
      for (var i = 0; i < blokker.length; i++) {
        if (blokker[i].el.contains(e.target)) { lesFra(i); return; }
      }
    });

    fyllStemmer(stemmeValg);
    synth.addEventListener("voiceschanged", function () { fyllStemmer(stemmeValg); });
    window.addEventListener("beforeunload", function () { synth.cancel(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", lagVerktoy);
  else lagVerktoy();
})();
