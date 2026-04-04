(function () {

    const isGithub = location.hostname.includes("github.io");

    function getRepoRoot() {
        if (!isGithub) return "/";
        const parts = location.pathname.split("/").filter(Boolean);
        return parts.length ? `/${parts[0]}/` : "/";
    }

    window.SarkarPath = {
        base: getRepoRoot(),

        rel(path) {
            if (!path || path.startsWith("http") || path.startsWith("#"))
                return path;

            if (path.startsWith(this.base))
                return path;

            const clean = path.replace(/^\/+/, "");
            return this.base + clean;
        }
    };

    window.rel = window.SarkarPath.rel.bind(window.SarkarPath);

    console.log(
        "%c[Commander] Root:",
        "color:#8b5cf6;font-weight:bold;",
        window.SarkarPath.base
    );

})();
