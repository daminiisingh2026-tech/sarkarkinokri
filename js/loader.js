(function () {

  if (!window.PathFix) {
    console.error("PathFix missing");
    return;
  }

  const BASE = window.PathFix.base;

  const build = (p) => {
    if (!p) return BASE;

    if (p.startsWith("http")) return p;
    if (p.startsWith("/")) p = p.substring(1);

    return BASE + p;
  };

  async function loadJSON(path) {
    try {
      const url = build(path);
      const res = await fetch(url);

      if (!res.ok) throw new Error("HTTP " + res.status);

      return await res.json();
    } catch (err) {
      console.error("Loader JSON error:", path, err);
      return null;
    }
  }

  async function loadHTML(path) {
    try {
      const url = build(path);
      const res = await fetch(url);

      if (!res.ok) throw new Error("HTTP " + res.status);

      return await res.text();
    } catch (err) {
      console.error("Loader HTML error:", path, err);
      return "";
    }
  }

  window.Loader = {
    base: BASE,
    build,
    json: loadJSON,
    html: loadHTML
  };

})();
