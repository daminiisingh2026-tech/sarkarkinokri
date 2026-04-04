(function () {

  function getBase() {
    const { hostname, pathname } = window.location;

    // GitHub pages
    if (hostname.includes("github.io")) {
      const parts = pathname.split("/").filter(Boolean);
      return parts.length ? "/" + parts[0] : "";
    }

    // local (acode)
    return "";
  }

  const BASE = getBase();

  window.PathFix = {
    base: BASE,
    resolve: function (path) {

      if (!path) return BASE;

      // external link
      if (/^(https?:)?\/\//.test(path)) return path;

      // already prefixed
      if (BASE && path.startsWith(BASE)) return path;

      // ensure no double slash
      if (path.startsWith("/")) path = path.slice(1);

      return BASE + "/" + path;
    }
  };

})();