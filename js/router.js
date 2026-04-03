(function () {
  "use strict";

  // -----------------------------
  // RELATIVE PATH HELPER
  // -----------------------------
  window.rel = function (path = "") {
    const depth = location.pathname.split("/").filter(Boolean).length - 1;
    return "../".repeat(depth) + path;
  };

  // -----------------------------
  // NORMALIZE
  // -----------------------------
  function normalize(str) {
    return str.replace(/-\d{4}$/, "").toLowerCase();
  }

  // -----------------------------
  // GET SLUG
  // -----------------------------
  function getSlug() {
    const file = location.pathname.split("/").pop() || "";
    return file.replace(".html", "").toLowerCase();
  }

  // -----------------------------
  // FETCH JSON
  // -----------------------------
  async function fetchJSON(path) {
    try {
      const res = await fetch(window.rel(path));
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn("fetch failed:", path);
      return null;
    }
  }

  // -----------------------------
  // ROUTER
  // -----------------------------
  async function route() {

    // don't run inside details page
    if (location.pathname.includes("details.html")) return;

    const slug = normalize(getSlug());

    console.log("Router slug:", slug);

    // -------------------------
    // STATIC FIRST
    // -------------------------
    const staticMap = await fetchJSON("data/staticportals.json");

    if (staticMap && staticMap[slug]) {
      location.replace(window.rel(staticMap[slug]));
      return;
    }

    // -------------------------
    // INDEX LOOKUP
    // -------------------------
    const index = await fetchJSON("data/index.json");
    if (!index) return;

    let masterId = null;

    // index.json is ARRAY
    for (const item of index) {
      if (!item.master_id) continue;

      const norm = normalize(item.master_id);

      if (norm === slug) {
        masterId = item.master_id;
        break;
      }
    }

    console.log("Mapped masterId:", masterId);

    // -------------------------
    // REDIRECT
    // -------------------------
    if (masterId) {
      const url = window.rel(`details.html?id=${masterId}`);
      location.replace(url);
    } else {
      console.warn("No match in index.json for:", slug);
    }
  }

  route();

})();