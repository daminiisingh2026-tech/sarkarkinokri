/**
 * path-fix.js — FINAL ROBUST VERSION
 */
(function () {

  const isGithub = location.hostname.includes("github.io");
  let BASE = "";

  if (isGithub) {

    const path = location.pathname;

    // Case 1: /repo/...
    const parts = path.split("/").filter(Boolean);
    if (parts.length > 0) {
      BASE = "/" + parts[0];
    }

    // Case 2: fallback — derive from URL
    if (!BASE) {
      const repoMatch = location.href.match(/github\.io\/([^\/]+)/);
      if (repoMatch) BASE = "/" + repoMatch[1];
    }
  }

  console.log("🧭 PathFix BASE =", BASE);

  window.PathFix = {
    base: BASE,
    resolve(path) {
      if (!path) return path;
      if (/^(https?:)?\/\//.test(path)) return path;

      path = path.replace(/^\/+/, "");
      return BASE ? BASE + "/" + path : path;
    }
  };

  const _fetch = window.fetch;

  window.fetch = function (url, options) {

    if (typeof url === "string" && !/^(https?:)?\/\//.test(url)) {
      url = url.replace(/^\/+/, "");
      if (BASE && !url.startsWith(BASE)) {
        url = BASE + "/" + url;
      }
    }

    return _fetch(url, options);
  };

})();