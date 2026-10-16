// Starter de interaktive AlgDat-figurene: hvert <div class="algwidget" data-widget="navn">
// får komponenten med samme navn fra algwidgets.js.
(function () {
  function mount() {
    if (!window.React || !window.ReactDOM || !window.AlgWidgets) return;
    document.querySelectorAll(".algwidget[data-widget]").forEach(function (el) {
      if (el.dataset.mounted) return;
      var C = window.AlgWidgets[el.dataset.widget];
      if (!C) {
        el.textContent = "Fant ikke figuren «" + el.dataset.widget + "».";
        return;
      }
      el.dataset.mounted = "1";
      ReactDOM.createRoot(el).render(React.createElement(C));
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
