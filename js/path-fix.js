(function () {
  const getBase = () => {
    const { origin, pathname } = window.location;

    // GitHub Pages project repo support
    // Example: username.github.io/project-name/
    const parts = pathname.split("/").filter(Boolean);

    if (origin.includes("github.io") && parts.length > 0) {
      return origin + "/" + parts[0] + "/";
    }

    // Normal domain
    return origin + "/";
  };

  window.PathFix = {
    base: getBase(),

    build: function (path) {
      if (!path) return this.base;

      if (path.startsWith("http")) return path;
      if (path.startsWith("/")) path = path.substring(1);

      return this.base + path;
    }
  };
})();
