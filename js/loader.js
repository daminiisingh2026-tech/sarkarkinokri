(function () {

  if (!window.PathFix) {
    console.error("PathFix missing");
    return;
  }

  async function loadJSON(path) {
    const url = PathFix.build(path);
    const res = await fetch(url);
    return res.json();
  }

  async function loadHTML(path) {
    const url = PathFix.build(path);
    const res = await fetch(url);
    return res.text();
  }

  window.Loader = {
    base: PathFix.base,
    build: PathFix.build,
    json: loadJSON,
    html: loadHTML
  };

})();
