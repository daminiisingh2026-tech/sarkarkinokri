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

      // external
      if (/^(https?:)?\/\//.test(path)) return path;

      // already absolute
      if (path.startsWith("/")) {
        return BASE + path;
      }

      // GitHub → force absolute from repo root
      if (BASE) {
        return BASE + "/" + path;
      }

      // Acode → keep relative
      return path;
    }
  };

})();