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
    return (str || "").replace(/-\d{4}$/, "").toLowerCase();
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

    const isDetails = location.pathname.includes("details.html");

    // =====================================================
    // CASE 1 : DETAILS PAGE → UPGRADE SHORT SLUG
    // =====================================================
    if (isDetails) {

      const params = new URLSearchParams(location.search);
      const id = params.get("id");
      if (!id) return;

      const normalized = normalize(id);

      // already master id (has year)
      if (normalized !== id) return;

      const index = await fetchJSON("data/index.json");
      if (!index) return;

      let masterId = null;

      for (const item of index) {
        if (!item.master_id) continue;

        if (normalize(item.master_id) === normalized) {
          masterId = item.master_id;
          break;
        }
      }

      // upgrade safely
      if (masterId && masterId !== id) {
        const newUrl = `${location.pathname}?id=${masterId}`;
        location.replace(newUrl);
      }

      return;
    }

    // =====================================================
    // CASE 2 : SLUG PAGE ROUTING
    // =====================================================
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

    for (const item of index) {
      if (!item.master_id) continue;

      if (normalize(item.master_id) === slug) {
        masterId = item.master_id;
        break;
      }
    }

    console.log("Mapped masterId:", masterId);

    if (masterId) {
      const url = window.rel(`details.html?id=${masterId}`);
      location.replace(url);
    } else {
      console.warn("No match in index.json for:", slug);
    }
  }

  route();

})();