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

      // don't touch external URLs
      if (/^(https?:)?\/\//.test(path)) return path;

      // only modify on GitHub
      if (BASE) {
        // remove leading slash
        path = path.replace(/^\/+/, "");
        return BASE + "/" + path;
      }

      // Acode / localhost: leave untouched
      return path;
    }
  };

})();