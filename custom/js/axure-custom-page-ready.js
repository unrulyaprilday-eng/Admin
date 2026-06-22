(function () {
  if (window.__axureCustomPageReadyLoaded__) return;
  window.__axureCustomPageReadyLoaded__ = true;

  function fireReady() {
    document.dispatchEvent(new CustomEvent("axure-custom-page-ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fireReady, { once: true });
  } else {
    fireReady();
  }
})();
