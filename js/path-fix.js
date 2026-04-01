(function () {

    if (window.__ROOT_FIXED__) return;
    window.__ROOT_FIXED__ = true;

    // Apply only on GitHub Pages
    if (!location.hostname.includes("github.io")) {
        console.log("[Commander] Local mode - no root change");
        return;
    }

    const repo = location.pathname.split("/")[1];
    if (!repo) return;

    const base = "/" + repo + "/";

    const baseTag = document.createElement("base");
    baseTag.href = base;

    document.head.prepend(baseTag);

    console.log("[Commander] GitHub root forced:", base);

})();
