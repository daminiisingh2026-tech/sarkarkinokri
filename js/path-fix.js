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
      if (!BASE) return path;
      if (/^(https?:)?\/\//.test(path)) return path;

      path = path.replace(/^\/+/, "");
      return BASE + "/" + path;
    }
  };

})();