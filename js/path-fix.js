(function () {

  function getBase() {
    const { origin, pathname } = window.location;

    // GitHub project repo detection
    const segments = pathname.split("/").filter(Boolean);

    if (origin.includes("github.io") && segments.length > 0) {
      return origin + "/" + segments[0] + "/";
    }

    return origin + "/";
  }

  window.PathFix = {
    base: getBase(),

    build: function (path) {
      if (!path) return this.base;

      if (/^(http|https):\/\//i.test(path)) return path;

      path = path.replace(/^\/+/, "");

      return this.base + path;
    }
  };

})();
