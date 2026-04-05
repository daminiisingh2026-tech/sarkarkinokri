/* =========================================
   SHORT SLUG → MASTER ID AUTO UPGRADE
   (Redirects old/short IDs to full Master IDs)
========================================= */
(function () {
  function normalize(str) {
    return (str || "").replace(/-\d{4}$/, "").toLowerCase();
  }

  async function upgradeShortSlug() {
    if (!location.pathname.includes("details.html")) return;
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (!id) return;

    const normalized = normalize(id);
    if (id !== normalized) return; // Already upgraded

    try {
      const res = await fetch("data/index.json");
      const data = await res.json();
      const list = data.entries || data.jobsdata || data.data || data || [];

      if (!Array.isArray(list)) return;

      for (const item of list) {
        if (!item || !item.master_id) continue;
        if (normalize(item.master_id) === normalized) {
          console.log("Slug upgraded:", id, "→", item.master_id);
          location.replace(`details.html?id=${item.master_id}`);
          return;
        }
      }
    } catch (e) {
      console.warn("upgradeShortSlug failed", e);
    }
  }
  upgradeShortSlug();
})();

/* =========================================
   MAIN RENDER ENGINE
========================================= */
(async () => {
  const loaderEl = document.getElementById('loader');
  const mainEl = document.getElementById('main-content');

  if (!window.Loader) {
    loaderEl.innerHTML = `<p style="color:red;">Loader System Missing</p>`;
    return;
  }

  // 1. Initialize Loader
  const BASE = Loader.getBase();
  const buildPath = (p) => {
    if (!p || p === "#" || p.startsWith("http")) return p;
    const clean = p.startsWith('/') ? p.slice(1) : p;
    return BASE + clean;
  };

  try { 
    await Loader.init(buildPath('data/index.json')); 
  } catch (e) { 
    loaderEl.innerHTML = `<p style="color:red;">Failed to initialize data index.</p>`;
    return; 
  }

  const params = new URLSearchParams(window.location.search);
  const masterId = params.get("id"); 
  if (!masterId) {
    loaderEl.innerHTML = `<p>No ID provided. <a href="index.html">Go Home</a></p>`;
    return;
  }

  /* ===============================
     DATA FETCHING & NORMALIZATION
  =============================== */
  let jobsData = await Loader.fetchByMaster(masterId, "jobsdata");
  let eventsData = await Loader.fetchByMaster(masterId, "events");
  let dailyPosts = (await Loader.fetchByMaster(masterId, "dailypost") || [])
                    .filter(p => p.master_id === masterId);

  // Parse if strings (Legacy support)
  if (typeof jobsData === "string") { try { jobsData = JSON.parse(jobsData); } catch(e) {} }
  if (typeof eventsData === "string") { try { eventsData = JSON.parse(eventsData); } catch(e) {} }

  // Extract the core object from possible Arrays
  const getCore = (data, id) => {
    if (!data) return {};
    if (Array.isArray(data)) return data.find(item => item.master_id === id) || data[0] || {};
    return data[id] || data;
  };

  const jobCore = getCore(jobsData, masterId);
  const eventCore = getCore(eventsData, masterId);

  // Merge: Priority to job details, then timeline events
  let core = { ...jobCore, ...eventCore };

  // CRITICAL CHECK: If we have no title/exam name, we can't render
  if (!core.title && !core.exam_name) {
    console.error("Data missing or malformed for:", masterId);
    loaderEl.innerHTML = `<div style="padding:20px; text-align:center;">
        <p style="color:red; font-weight:bold;">⚠️ Record Not Found</p>
        <p>The details for ${masterId} are not yet available.</p>
        <a href="index.html" style="color:#002d57; text-decoration:underline;">Return Home</a>
    </div>`;
    return;
  }

  // 2. Hide Loader & Clear Container
  loaderEl.style.display = "none";
  mainEl.style.display = "block";
  mainEl.innerHTML = "";

  /* ===============================
     EXECUTION: RENDER COMPONENTS
  =============================== */
  renderNav();
  renderHeader(core);
  
  if (core.recruitment_summary) renderSummary(core.recruitment_summary);
  if (dailyPosts.length) renderDailyPosts(dailyPosts);
  
  renderDynamic(core);

  // Important links at the bottom
  if (eventCore.events) renderPhasedButtons(eventCore.events);

  /* ===============================
     UI RENDERING FUNCTIONS
  =============================== */

  function renderNav() {
    const nav = document.createElement("div");
    nav.style.cssText = "display:flex; justify-content:space-between; padding:10px; background:#002d57; margin-bottom:10px; border-bottom:2px solid #ff6a00;";
    nav.innerHTML = `
      <a href="javascript:void(0)" onclick="window.history.back()" style="text-decoration:none; color:white; font-weight:bold; font-size:13px; background:rgba(255,255,255,0.1); padding:6px 12px; border-radius:4px;">← BACK</a>
      <a href="index.html" style="text-decoration:none; color:white; font-weight:bold; font-size:13px; background:#ff6a00; padding:6px 12px; border-radius:4px;">🏠 HOME</a>
    `;
    mainEl.appendChild(nav);
  }

  function renderHeader(data) {
    const div = document.createElement("div");
    div.className = "job-header";
    const scope = (data.header_scope || ["Govt Job"]).map(s => `<span class="pill" style="background:rgba(255,255,255,0.2); color:white; border:1px solid rgba(255,255,255,0.3); padding:4px 10px; border-radius:4px; font-size:11px; margin-right:5px;">${s}</span>`).join("");
    
    div.innerHTML = `
      <div class="meta-pills">${scope}</div>
      <h1 style="margin:10px 0; font-size:1.5rem;">${data.title || data.exam_name}</h1>
      <div class="meta-pills">
        <span class="pill" style="background:#fff; color:#002d57; font-weight:bold; padding:4px 10px; border-radius:4px;">${data.notice_type || "Notice"} ${data.notice_no || ""}</span>
        ${data.status ? `<span class="pill" style="background:#22c55e; color:#fff; padding:4px 10px; border-radius:4px; margin-left:10px;">● ${data.status}</span>` : ""}
      </div>`;
    mainEl.appendChild(div);
  }

  function renderSummary(text) {
      const sum = document.createElement("div");
      sum.className = "section-box summary-box";
      sum.innerHTML = `<div class="section-title">📢 Summary</div><p style="padding:15px; margin:0; line-height:1.6;">${text}</p>`;
      mainEl.appendChild(sum);
  }

  function renderDynamic(data) {
    const skip = ["overview", "title", "slug", "master_id", "header_scope", "notice_type", "notice_no", "events", "links", "status", "recruitment_summary", "exam_name"];
    if (data.overview) renderGrid(data.overview, "📊 Quick Highlights");

    Object.entries(data).forEach(([key, value]) => {
      if (skip.includes(key) || !value) return;
      const title = key.replace(/_/g, ' ').toUpperCase();

      if (Array.isArray(value)) {
        if (typeof value[0] === 'string') { renderList(value, `📝 ${title}`); } 
        else { renderTable(value, `📋 ${title}`); }
      } else if (typeof value === "object") {
        renderGrid(value, `⚙️ ${title}`);
      } else {
        const sec = document.createElement("div");
        sec.className = "section-box";
        sec.innerHTML = `<div class="section-title">${title}</div><div style="padding:15px;">${value}</div>`;
        mainEl.appendChild(sec);
      }
    });
  }

  function renderList(arr, title) {
    const sec = document.createElement("div");
    sec.className = "section-box";
    sec.innerHTML = `<div class="section-title">${title}</div><ul style="padding:15px 15px 15px 35px; line-height:1.8;">${arr.map(item => `<li>${item}</li>`).join("")}</ul>`;
    mainEl.appendChild(sec);
  }

  function renderGrid(obj, title) {
    const sec = document.createElement("div");
    sec.className = "section-box";
    sec.innerHTML = `<div class="section-title">${title}</div><div class="generic-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1px; background:#eee;">
      ${Object.entries(obj).map(([k,v]) => `
        <div class="grid-card" style="background:#fff; padding:15px;">
            <label style="display:block; font-size:10px; color:#64748b; text-transform:uppercase; margin-bottom:4px;">${k.replace(/_/g,' ')}</label>
            <span style="font-weight:bold; color:#002d57; font-size:14px;">${v}</span>
        </div>`).join("")}
    </div>`;
    mainEl.appendChild(sec);
  }

  function renderTable(data, title) {
    const raw = Array.isArray(data) ? data : (data.table || data.rows || []);
    if (!raw.length) return;
    const cols = [...new Set(raw.flatMap(row => Object.keys(row)))];
    const sec = document.createElement("div");
    sec.className = "section-box";
    sec.innerHTML = `<div class="section-title">${title}</div><div class="table-wrapper" style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; min-width:400px;">
      <thead><tr style="background:#f8fafc;">${cols.map(c => `<th style="padding:10px; border:1px solid #eee; text-align:left; font-size:12px;">${c.toUpperCase()}</th>`).join("")}</tr></thead>
      <tbody>
        ${raw.map(row => `<tr>${cols.map(c => `<td style="padding:10px; border:1px solid #eee; font-size:12px;">${row[c] ?? "-"}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table></div>`;
    mainEl.appendChild(sec);
  }

  function renderPhasedButtons(events) {
    const sec = document.createElement("div");
    sec.className = "section-box";
    sec.style.borderLeft = "8px solid #22c55e"; 
    sec.innerHTML = `<div class="section-title">🔗 Important Links</div><div id="btn-root" style="padding:15px;"></div>`;
    const root = sec.querySelector("#btn-root");

    const grouped = events.reduce((acc, ev) => {
      const p = ev.phase || "Direct Links";
      if (!acc[p]) acc[p] = [];
      acc[p].push(ev);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([phase, items]) => {
      const g = document.createElement("div");
      g.style.marginBottom = "20px";
      g.innerHTML = `<div style="font-size:11px; font-weight:bold; color:#64748b; margin-bottom:8px; text-transform:uppercase; border-bottom:1px solid #eee; padding-bottom:4px;">${phase}</div><div class="link-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:10px;"></div>`;
      const grid = g.querySelector(".link-grid");
      
      items.forEach(ev => {
        const url = ev.official_event_url || ev.url;
        const active = ev.is_active && url;
        grid.innerHTML += `
          <div style="text-align:center; background:#f8fafc; padding:10px; border:1px solid #e2e8f0; border-radius:8px;">
            <div class="badge ${active ? 'active' : 'expired'}" style="margin-bottom:6px; font-size:9px; font-weight:bold;">${ev.badge_text || (active ? 'LIVE' : 'CLOSED')}</div>
            <a href="${url || '#'}" class="btn ${active ? 'btn-active' : 'btn-inactive'}" ${url ? 'target="_blank"' : ''} 
               style="display:block; text-decoration:none; padding:8px; border-radius:4px; font-weight:bold; font-size:12px; background:${active ? '#002d57' : '#cbd5e1'}; color:${active ? '#fff' : '#64748b'};">
               ${ev.label}
            </a>
            ${ev.status_label ? `<small style="display:block; margin-top:6px; color:#002d57; font-weight:bold; font-size:10px;">● ${ev.status_label}</small>` : ''}
          </div>`;
      });
      root.appendChild(g);
    });
    mainEl.appendChild(sec);
  }

  function renderDailyPosts(posts) {
    const sec = document.createElement("div");
    sec.className = "section-box";
    sec.innerHTML = `<div class="section-title">📰 News & Updates</div>
      <ul style="list-style:none; padding:0; margin:0;">${posts.map(p => `
        <li style="padding:10px; border-bottom:1px solid #f1f5f9;">
          <a href="${p.url}" target="_blank" style="text-decoration:none; color:#002d57; font-weight:bold; display:block; font-size:13px;">${p.title}</a>
          <small style="color:#64748b; font-size:10px;">${p.date || ''}</small>
        </li>`).join("")}
      </ul>`;
    mainEl.appendChild(sec);
  }
})();
