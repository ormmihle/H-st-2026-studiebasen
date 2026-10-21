// Opplesning: en «Les opp»-knapp øverst på hver side.
//
// To motorer:
//  - «Norsk – innebygd»: Piper med en åpen norsk stemme (talesyntese, nb). Kjører helt lokalt i
//    nettleseren. Stemmemodellen (ca. 60 MB) lastes ned fra Hugging Face første gang og lagres
//    i nettleseren etterpå, så den virker uten nett senere. Resten ligger i javascripts/vendor/piper/.
//  - Nettleserens egne stemmer (Web Speech API), for eksempel Edge sine norske stemmer.
//
// Siden leses avsnitt for avsnitt, og avsnittet som leses, markeres. Opplesningen starter der du
// har blada til, eller ved tekst du har markert. Klikk på et avsnitt under opplesning for å hoppe dit.
// Lukkede fasit-bokser, kode, formler og interaktive figurer hoppes over.
(function () {
  var synth = window.speechSynthesis || null;
  var PIPER = "__piper";
  var PIPER_STEMME = "no_NO-talesyntese-medium";
  var VENDOR = new URL("javascripts/vendor/piper/", document.querySelector('script[src$="opplesning.js"]').src.replace(/javascripts\/opplesning\.js.*$/, "")).href;

  var LAGRING = "studiebasen-opplesning";
  var innst = { fart: 1, stemme: "" };
  try { Object.assign(innst, JSON.parse(localStorage.getItem(LAGRING) || "{}")); } catch (e) {}
  function lagre() { try { localStorage.setItem(LAGRING, JSON.stringify(innst)); } catch (e) {} }

  var HOPP_OVER = "pre, code, .highlight, .arithmatex, mjx-container, .MathJax, script, style, " +
    ".algwidget, .headerlink, .md-button, .tts-verktoy, svg, .mermaid, .md-source-file";
  var BLOKK = { P: 1, H1: 1, H2: 1, H3: 1, H4: 1, H5: 1, H6: 1, TR: 1, SUMMARY: 1, DT: 1, DD: 1, FIGCAPTION: 1 };

  var blokker = [], indeks = 0, status = "stopp", ui = {}, aktivEl = null, generasjon = 0;

  // ---------- Finne teksten ----------

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
    return el.matches(HOPP_OVER) || (el.tagName === "DETAILS" && !el.open);
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

  // Start ved markert tekst, ellers ved første avsnitt som er synlig på skjermen.
  function startpunkt() {
    var utvalg = window.getSelection && window.getSelection();
    if (utvalg && !utvalg.isCollapsed && utvalg.anchorNode) {
      var node = utvalg.anchorNode.nodeType === 1 ? utvalg.anchorNode : utvalg.anchorNode.parentElement;
      for (var i = 0; i < blokker.length; i++) {
        if (blokker[i].el.contains(node)) { utvalg.removeAllRanges(); return i; }
      }
    }
    if (window.scrollY < 50) return 0;
    var topp = (document.querySelector(".md-header") || { offsetHeight: 0 }).offsetHeight + 10;
    for (var j = 0; j < blokker.length; j++) {
      if (blokker[j].el.getBoundingClientRect().bottom > topp) return j;
    }
    return 0;
  }

  function marker(el) {
    if (aktivEl) aktivEl.classList.remove("tts-aktiv");
    aktivEl = el;
    if (!el) return;
    el.classList.add("tts-aktiv");
    var r = el.getBoundingClientRect();
    if (r.top < 120 || r.bottom > window.innerHeight - 40) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function melding(t) {
    ui.melding.textContent = t || "";
    ui.melding.hidden = !t;
  }

  // ---------- Motor 1: innebygd norsk stemme (Piper) ----------

  var piper = {
    lastet: null, sesjon: null, lyd: new Audio(), lager: {}, ko: Promise.resolve(),

    last: function () {
      if (this.lastet) return this.lastet;
      this.lastet = new Promise(function (ok, feil) {
        var s = document.createElement("script");
        s.src = VENDOR + "piper.js";
        s.onload = ok;
        s.onerror = function () { feil(new Error("Fant ikke " + s.src)); };
        document.head.appendChild(s);
      }).then(function () {
        return window.PiperTTS.TtsSession.create({
          voiceId: PIPER_STEMME,
          wasmPaths: { onnxWasm: VENDOR, piperWasm: VENDOR + "piper_phonemize.wasm", piperData: VENDOR + "piper_phonemize.data" },
          progress: function (p) {
            if (p && p.total && /\.onnx$/.test(p.url)) {
              var pst = Math.round(p.loaded * 100 / p.total);
              melding(pst < 100 ? "Laster ned den norske stemmen (ca. " + Math.round(p.total / 1048576) + " MB, bare første gang): " + pst + " %" : "Gjør klar stemmen …");
            }
          }
        });
      }).then(function (sesjon) { piper.sesjon = sesjon; return sesjon; });
      this.lastet.catch(function () { piper.lastet = null; });
      return this.lastet;
    },

    // Lager lyd for blokk i (én om gangen, i kø) og husker resultatet.
    lag: function (i) {
      if (i >= blokker.length) return Promise.resolve(null);
      if (this.lager[i]) return this.lager[i];
      var tekst = blokker[i].tekst, self = this;
      var p = this.ko.then(function () { return self.last(); }).then(function (sesjon) { return sesjon.predict(tekst); })
        .then(function (wav) { return URL.createObjectURL(wav); });
      this.ko = p.catch(function () {});
      this.lager[i] = p;
      return p;
    },

    spill: function (i, gen) {
      var self = this;
      if (!this.sesjon) melding("Starter den norske stemmen …");
      this.lag(i).then(function (url) {
        if (gen !== generasjon) return;
        melding("");
        if (!url) { stopp(); return; }
        self.lyd.src = url;
        self.lyd.playbackRate = innst.fart;
        self.lyd.onended = function () { if (gen === generasjon && status === "spiller") lesFra(i + 1); };
        self.lyd.play();
        self.lag(i + 1); // forbered neste avsnitt mens dette spilles
      }).catch(function (e) {
        if (gen !== generasjon) return;
        console.error(e);
        stopp();
        melding("Klarte ikke å starte den norske stemmen. Første gang trengs internett for å laste den ned. (" + e.message + ")");
      });
    },
    pause: function () { this.lyd.pause(); },
    fortsett: function () { this.lyd.play(); },
    stopp: function () {
      this.lyd.pause();
      this.lyd.onended = null;
      var lager = this.lager;
      Object.keys(lager).forEach(function (k) { lager[k].then(function (u) { if (u) URL.revokeObjectURL(u); }, function () {}); });
      this.lager = {};
    },
    fart: function (f) { this.lyd.playbackRate = f; }
  };

  // ---------- Motor 2: nettleserens stemmer ----------

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

  var nettleser = {
    stemme: function () {
      return synth.getVoices().find(function (v) { return v.name === innst.stemme; }) || null;
    },
    spill: function (i, gen) {
      synth.cancel();
      var deler = biter(blokker[i].tekst), stemme = this.stemme();
      deler.forEach(function (del, n) {
        var u = new SpeechSynthesisUtterance(del);
        if (stemme) { u.voice = stemme; u.lang = stemme.lang; } else { u.lang = "nb-NO"; }
        u.rate = innst.fart;
        if (n === deler.length - 1) u.onend = function () { if (gen === generasjon && status === "spiller") lesFra(i + 1); };
        synth.speak(u);
      });
    },
    pause: function () { synth.pause(); },
    fortsett: function () { synth.resume(); },
    stopp: function () { synth.cancel(); },
    fart: function () { if (status === "spiller") lesFra(indeks); }
  };

  // Nettleserstemme bare hvis du har valgt en som faktisk finnes; ellers innebygd norsk.
  function motor() { return synth && innst.stemme && innst.stemme !== PIPER && nettleser.stemme() ? nettleser : piper; }

  // ---------- Styring ----------

  function lesFra(i) {
    piper.lyd.pause();
    if (synth) synth.cancel();
    generasjon++;
    indeks = i;
    if (indeks >= blokker.length) { stopp(); return; }
    marker(blokker[indeks].el);
    settStatus("spiller");
    motor().spill(indeks, generasjon);
  }

  function stopp() {
    generasjon++;
    piper.stopp();
    if (synth) synth.cancel();
    marker(null);
    settStatus("stopp");
  }

  function settStatus(s) {
    status = s;
    ui.spill.textContent = s === "spiller" ? "⏸ Pause" : s === "pause" ? "▶ Fortsett" : "▶ Les opp";
    ui.spill.setAttribute("aria-pressed", s === "spiller" ? "true" : "false");
    ui.stopp.hidden = s === "stopp";
    document.body.classList.toggle("tts-pa", s !== "stopp");
  }

  function erNorsk(v) { return /^(nb|no|nn)/i.test(v.lang); }

  function fyllStemmer() {
    var velg = ui.stemme;
    var stemmer = synth ? synth.getVoices().slice() : [];
    stemmer.sort(function (a, b) {
      return (erNorsk(a) ? 0 : 1) - (erNorsk(b) ? 0 : 1) ||
        (/natural|online/i.test(a.name) ? 0 : 1) - (/natural|online/i.test(b.name) ? 0 : 1) ||
        a.name.localeCompare(b.name);
    });
    velg.innerHTML = '<option value="' + PIPER + '">Norsk – innebygd</option>';
    stemmer.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v.name;
      o.textContent = v.name.replace(/^Microsoft /, "") + " (" + v.lang + ")";
      velg.appendChild(o);
    });
    // Standard: innebygd norsk, med mindre du har valgt en annen stemme som finnes.
    var finnes = stemmer.some(function (v) { return v.name === innst.stemme; });
    velg.value = finnes ? innst.stemme : PIPER;
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
      '<p class="tts-melding" hidden></p>';
    h1.insertAdjacentElement("afterend", boks);

    ui.spill = boks.querySelector(".tts-spill");
    ui.stopp = boks.querySelector(".tts-stopp");
    ui.melding = boks.querySelector(".tts-melding");
    ui.stemme = boks.querySelector(".tts-stemme");
    var fart = boks.querySelector(".tts-fart");
    fart.value = String(innst.fart);

    ui.spill.addEventListener("click", function () {
      if (status === "spiller") { motor().pause(); settStatus("pause"); }
      else if (status === "pause") { motor().fortsett(); settStatus("spiller"); }
      else {
        blokker = [];
        samle(artikkel);
        lesFra(startpunkt());
      }
    });
    ui.stopp.addEventListener("click", function () { stopp(); melding(""); });
    fart.addEventListener("change", function () {
      innst.fart = parseFloat(fart.value); lagre();
      motor().fart(innst.fart);
    });
    ui.stemme.addEventListener("change", function () {
      var spilte = status !== "stopp";
      stopp();
      innst.stemme = ui.stemme.value; lagre();
      if (spilte) { blokker = []; samle(artikkel); lesFra(Math.min(indeks, blokker.length - 1)); }
    });

    artikkel.addEventListener("click", function (e) {
      if (status === "stopp" || e.target.closest("a, button, select, summary, .tts-verktoy")) return;
      for (var i = 0; i < blokker.length; i++) {
        if (blokker[i].el.contains(e.target)) { lesFra(i); return; }
      }
    });

    fyllStemmer();
    if (synth) synth.addEventListener("voiceschanged", fyllStemmer);
    window.addEventListener("beforeunload", function () { if (synth) synth.cancel(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", lagVerktoy);
  else lagVerktoy();
})();
