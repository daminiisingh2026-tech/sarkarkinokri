(async () => {
  const loaderEl = document.getElementById('loader');
  const mainEl = document.getElementById('main-content');

  if (!window.Loader) {
    loaderEl.innerHTML = `<p style="color:red;">Loader System Missing</p>`;
    return;
  }

  // 1. Initialize & Fetch
  try { 
    await Loader.init(Loader.getBase() + 'data/index.json'); 
  } catch (e) { return; }

  const params = new URLSearchParams(window.location.search);
  const masterId = params.get("id"); 
  if (!masterId) return;

  let jobsData = await Loader.fetchByMaster(masterId, "jobsdata");
  let eventsData = await Loader.fetchByMaster(masterId, "events");

  // 2. THE FIX: Extract Object from Array or Object
  const extract = (d, id) => {
    if (!d) return {};
    let p = (typeof d === "string") ? JSON.parse(d) : d;
    if (Array.isArray(p)) return p.find(x => x.master_id === id) || p[0] || {};
    return p[id] || p;
  };

  const jobCore = extract(jobsData, masterId);
  const eventCore = extract(eventsData, masterId);

  // Merge: Job Details + Live Event Status
  let core = { ...jobCore, ...eventCore };

  // 3. Safety Exit
  if (!core.title && !core.exam_name) {
    loaderEl.innerHTML = `<p style="padding:20px; color:red;">⚠️ Data Syncing... (Check Filename in Index)</p>`;
    return;
  }

  // 4. Reveal Page
  loaderEl.style.display = "none";
  mainEl.style.display = "block";
  mainEl.innerHTML = "";

  // 5. Render Components (Nav First)
  renderNav();
  renderHeader(core);
  
  if (core.recruitment_summary) {
      const div = document.createElement("div");
      div.className = "section-box summary-box";
      div.innerHTML = `<div class="section-title">📢 Summary</div><p style="padding:15px; line-height:1.6;">${core.recruitment_summary}</p>`;
      mainEl.appendChild(div);
  }

  renderDynamic(core);

  // 6. Inject Live Links (Answer Key / Apply Now)
  if (eventCore.events) renderPhasedButtons(eventCore.events);

  /* --- INTERNAL RENDERERS --- */
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
    const title = data.title || data.exam_name || "Official Notification";
    div.innerHTML = `<h1 style="margin:10px 0; font-size:1.5rem;">${title}</h1>
      <div class="meta-pills">
        <span class="pill" style="background:#fff; color:#002d57; font-weight:bold; padding:4px 10px; border-radius:4px;">${data.notice_type || "Notice"}</span>
        ${data.status ? `<span class="pill" style="background:#22c55e; color:#fff; padding:4px 10px; border-radius:4px; margin-left:10px;">● ${data.status}</span>` : ""}
      </div>`;
    mainEl.appendChild(div);
  }

  function renderDynamic(data) {
    const skip = ["title", "master_id", "events", "status", "recruitment_summary", "exam_name"];
    Object.entries(data).forEach(([key, value]) => {
      if (skip.includes(key) || !value) return;
      const sec = document.createElement("div");
      sec.className = "section-box";
      sec.innerHTML = `<div class="section-title">${key.replace(/_/g, ' ').toUpperCase()}</div>`;
      
      if (Array.isArray(value)) {
          // Table or List logic here...
          sec.innerHTML += `<div style="padding:15px;">${JSON.stringify(value)}</div>`;
      } else {
          sec.innerHTML += `<div style="padding:15px;">${value}</div>`;
      }
      mainEl.appendChild(sec);
    });
  }

  function renderPhasedButtons(events) {
    const sec = document.createElement("div");
    sec.className = "section-box";
    sec.innerHTML = `<div class="section-title">🔗 Important Links</div><div id="btn-root" style="padding:15px;"></div>`;
    const root = sec.querySelector("#btn-root");
    events.forEach(ev => {
        root.innerHTML += `<a href="${ev.url}" class="btn" style="display:block; margin-bottom:5px; padding:10px; background:#002d57; color:white; text-decoration:none; text-align:center; border-radius:4px;">${ev.label}</a>`;
    });
    mainEl.appendChild(sec);
  }
})();
