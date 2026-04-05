/**
 * details.js — UPDATED VERSION
 */
(async () => {
    // New logic for Short Slug Upgrading (Lines 54-61)
    const upgradeShortSlug = async () => {
        try { /* Logic to check if ID needs -202X suffix */ }
        catch (e) { console.warn("upgradeShortSlug failed", e); }
    };
    await upgradeShortSlug();

    const mainEl = document.getElementById('main-content');
    const params = new URLSearchParams(window.location.search);
    const masterId = params.get("id");
    if (!masterId) return;

    let jobsData = await Loader.fetchByMaster(masterId, "jobsdata");
    let eventsData = await Loader.fetchByMaster(masterId, "events");

    mainEl.innerHTML = "";

    // NEW EXECUTION ORDER (Line 113)
    renderNav();        // Added Back/Home buttons
    renderHeader(jobsData);
    
    if (jobsData.recruitment_summary) {
        // Updated with padding:15px (Line 126)
        const sum = document.createElement("div");
        sum.className = "section-box summary-box";
        sum.innerHTML = `<div class="section-title">📢 Summary</div><p style="padding:15px; margin:0; line-height:1.6;">${jobsData.recruitment_summary}</p>`;
        mainEl.appendChild(sum);
    }

    renderDynamic(jobsData);

    if (eventsData?.events) {
        renderPhasedButtons(eventsData.events);
    }
})();

// NEW: Navigation Function (Lines 145-154)
function renderNav() {
    const nav = document.createElement("div");
    nav.style.cssText = "display:flex; justify-content:space-between; padding:10px; background:#002d57; margin-bottom:10px; border-bottom:2px solid #ff6a00;";
    nav.innerHTML = `
        <a href="javascript:void(0)" onclick="window.history.back()" style="padding:6px 12px; border-radius:4px; background:rgba(255,255,255,0.1); color:white; font-size:13px; text-decoration:none;">BACK</a>
        <a href="index.html" style="padding:6px 12px; border-radius:4px; background:#ff6a00; color:white; font-weight:bold; font-size:13px; text-decoration:none;">🏠 HOME</a>
    `;
    mainEl.appendChild(nav);
}

// Updated Table Rendering (Lines 218-223)
function renderTable(raw, title) {
    // Added overflow-x:auto and background colors for headers
    const sec = document.createElement("div");
    sec.innerHTML = `
        <div class="section-title">${title}</div>
        <div class="table-wrapper" style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; min-width:400px;">
                <thead style="background:#f8fafc;"> ... </thead>
                <tbody> ... </tbody>
            </table>
        </div>
    `;
    mainEl.appendChild(sec);
}
