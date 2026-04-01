(function () {

    if (window.rel) return;

    const path = window.location.pathname;

    // detect repo name
    const segments = path.split("/").filter(Boolean);
    const base = segments.length ? "/" + segments[0] + "/" : "/";

    window.rel = function (p) {
        if (!p || p.startsWith("http") || p.startsWith("#")) return p;
        return base + p.replace(/^\/+/, "");
    };

    console.log("[Commander] Root:", base);

})();
