(function () {
  "use strict";

  // 1. IMPROVED PATH HELPER (GitHub Friendly)
  window.rel = function (path = "") {
    const isGitHub = window.location.hostname.includes('github.io');
    const base = isGitHub ? '/sarkarkinokri/' : '/';
    // Remove leading slashes from path to prevent double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return base + cleanPath;
  };

  function normalize(str) {
    return (str || "").replace(/-\d{4}$/, "").toLowerCase();
  }

  function getSlug() {
    const file = location.pathname.split("/").pop() || "";
    return file.replace(".html", "").toLowerCase();
  }

  async function fetchJSON(path) {
    // 2. Use the Loader if available for caching/stability
    if (window.Loader && window.Loader.init) {
        const manifest = await window.Loader.init('data/index.json');
        if (path.includes('index.json')) return manifest;
        // Fallback to fetch for specific files
    }

    try {
      const res = await fetch(window.rel(path));
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async function route() {
    const isDetails = location.pathname.includes("details.html");
    const params = new URLSearchParams(location.search);

    // =====================================================
    // CASE 1 : DETAILS PAGE → UPGRADE SHORT SLUG
    // =====================================================
    if (isDetails) {
      const id = params.get("id");
      if (!id) return;

      const normalized = normalize(id);
      if (normalized !== id) return;

      const index = await fetchJSON("data/index.json");
      if (!index) return;

      const entry = index.find(item => normalize(item.master_id) === normalized);
      
      if (entry && entry.master_id !== id) {
        // Use window.rel to ensure the URL is absolute to the repo
        location.replace(window.rel(`details.html?id=${entry.master_id}`));
      }
      return;
    }

    // =====================================================
    // CASE 2 : SLUG PAGE ROUTING (Home/Portal)
    // =====================================================
    const slug = normalize(getSlug());
    if (slug === "index" || slug === "") return; // Don't route the home page

    const staticMap = await fetchJSON("data/staticportals.json");
    if (staticMap && staticMap[slug]) {
      location.replace(window.rel(staticMap[slug]));
      return;
    }

    const index = await fetchJSON("data/index.json");
    if (!index) return;

    const match = index.find(item => normalize(item.master_id) === slug);

    if (match) {
      location.replace(window.rel(`details.html?id=${match.master_id}`));
    }
  }

  route();
})();
