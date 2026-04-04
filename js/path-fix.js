/**
 * path-fix.js — GLOBAL SAFE FETCH PREFIX (GitHub only)
 */
(function () {

  const isGithub = location.hostname.includes("github.io");
  let BASE = "";

  if (isGithub) {
    const parts = location.pathname.split("/").filter(Boolean);
    BASE = parts.length ? "/" + parts[0] : "";
  }

  window.PathFix = {
    base: BASE,

    resolve(path) {
      if (!path) return path;

      // ignore external
      if (/^(https?:)?\/\//.test(path)) return path;

      path = path.replace(/^\/+/, "");
      return BASE ? BASE + "/" + path : path;
    }
  };

  // ✅ GLOBAL FETCH PATCH (required for ticker.js)
  const _fetch = window.fetch;

  window.fetch = function (url, options) {

    if (typeof url === "string") {

      // ignore external URLs
      if (!/^(https?:)?\/\//.test(url)) {

        url = url.replace(/^\/+/, "");

        if (BASE && !url.startsWith(BASE)) {
          url = BASE + "/" + url;
        }
      }
    }

    return _fetch(url, options);
  };

})();