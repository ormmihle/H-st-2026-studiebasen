// Nedtelling til eksamenene: hvert element med data-tid="ÅÅÅÅ-MM-DDTtt:mm"
// får en tekst om hvor lenge det er igjen. Den nærmeste kommende eksamenen
// markeres med klassen «neste».
(function () {
  function tekst(dager) {
    if (dager === 0) return "I dag";
    if (dager === 1) return "I morgen";
    var uker = Math.floor(dager / 7);
    var rest = dager % 7;
    var ukeTekst = uker >= 2 ? " (" + uker + " uker" + (rest ? " og " + rest + (rest === 1 ? " dag" : " dager") : "") + ")" : "";
    return "Om " + dager + " dager" + ukeTekst;
  }

  function oppdater() {
    var naa = new Date();
    var idag = new Date(naa.getFullYear(), naa.getMonth(), naa.getDate());
    var nesteFunnet = false;
    document.querySelectorAll("[data-tid]").forEach(function (el) {
      var tid = new Date(el.dataset.tid);
      var slutt = new Date(tid.getTime() + 4 * 3600 * 1000);
      var dag = new Date(tid.getFullYear(), tid.getMonth(), tid.getDate());
      var dager = Math.round((dag - idag) / 86400000);
      var felt = el.querySelector(".nedtelling");
      el.classList.remove("neste", "ferdig");
      if (naa > slutt) {
        el.classList.add("ferdig");
        if (felt) felt.textContent = "Ferdig";
        return;
      }
      if (!nesteFunnet) {
        el.classList.add("neste");
        nesteFunnet = true;
      }
      if (felt) felt.textContent = naa >= tid ? "Pågår nå" : tekst(dager);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", oppdater);
  } else {
    oppdater();
  }
})();
