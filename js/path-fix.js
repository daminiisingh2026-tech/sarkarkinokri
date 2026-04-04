/**
 * path-fix.js — DEBUG TEMP VERSION
 */
(function () {

  console.log("🧭 PathFix script running");

  const isGithub = location.hostname.includes("github.io");
  let BASE = "";

  if (isGithub) {

    const path = location.pathname;

    console.log("🧭 pathname:", path);

    // Case 1: /repo/...
    const parts = path.split("/").filter(Boolean);
    if (parts.length > 0) {
      BASE = "/" + parts[0];
    }

    // Case 2 fallback
    if (!BASE) {
      const repoMatch = location.href.match(/github\.io\/([^\/]+)/);
      if (repoMatch) BASE = "/" + repoMatch[1];
    }
  }

  console.log("🧭 PathFix BASE =", BASE);

  window.PathFix = {
    base: BASE,
    resolve(path) {
      console.log("🧭 resolve input:", path);

      if (!path) return path;
      if (/^(https?:)?\/\//.test(path)) return path;

      path = path.replace(/^\/+/, "");

      const final = BASE ? BASE + "/" + path : path;

      console.log("🧭 resolve output:", final);

      return final;
    }
  };

  const _fetch = window.fetch;

  window.fetch = function (url, options) {

    console.log("🌐 FETCH INPUT:", url);

    if (typeof url === "string" && !/^(https?:)?\/\//.test(url)) {

      const original = url;

      url = url.replace(/^\/+/, "");

      if (BASE && !url.startsWith(BASE)) {
        url = BASE + "/" + url;
      }

      console.log("🌐 FETCH MODIFIED:", original, "→", url);
    }

    return _fetch(url, options);
  };

})();
