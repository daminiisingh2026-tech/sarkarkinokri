(function () {

    // prevent duplicate execution
    if (window.rel) return;

    function detectBase() {
        const { hostname, pathname } = window.location;

        if (hostname.includes("github.io")) {
            const parts = pathname.split("/").filter(Boolean);
            return parts.length ? "/" + parts[0] + "/" : "/";
        }
        return "/";
    }

    const base = detectBase();

    window.SarkarPath = {
        base,
        rel(path) {
            if (!path || path.startsWith("http") || path.startsWith("#"))
                return path;

            const clean = path.replace(/^\/+/, "");
            return base + clean;
        }
    };

    window.rel = window.SarkarPath.rel;

    // only one safe log
    console.log("[Commander] Root:", base);

})();