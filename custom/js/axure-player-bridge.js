(function () {
  function notifyPlayer() {
    try {
      if (!window.parent || window.parent === window || window.name !== "mainFrame") return;
      if (!window.parent.$axure || !window.parent.$axure.messageCenter) return;

      var title = document.title || "";
      window.parent.$axure.messageCenter.setState("page.data", {
        id: document.body.getAttribute("data-axure-page-id") || "custom_static_page",
        pageName: title,
        location: window.location.toString(),
        notes: {},
        widgetNotes: [],
        defaultAdaptiveView: {
          name: "",
          size: { width: 0, height: 0 },
          condition: ""
        },
        adaptiveViews: [],
        masterNotes: [],
        ownerToFns: {}
      });
    } catch (error) {
      // Axure player bridge is best-effort; standalone page usage should never fail because of it.
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", notifyPlayer);
  } else {
    notifyPlayer();
  }
})();
