/**
 * SarkarKinokri SSC Central Engine - Cluster Version 3.0
 * Handles: MeshRouter Integration, Dynamic Nav, 5-Button Test Dock, Popups
 */

document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;
    const currentFile = path.split("/").pop() || "index.html";
    const slug = currentFile.replace(".html", "");

    // 1. DYNAMIC NAVIGATION ENGINE
    const sscNavigation = {
        init() {
            const navContainer = document.getElementById('main-nav');
            if (!navContainer) return;

            const links = [
                { name: "Home", url: "index.html" },
                { name: "SSC CGL", url: "ssc-cgl.html" },
                { name: "SSC CHSL", url: "ssc-chsl.html" },
                { name: "SSC MTS", url: "ssc-mts.html" },
                { name: "SSC JE", url: "ssc-je.html" },
                { name: "Selection Posts", url: "ssc-selectionpost.html" },
                { name: "Steno", url: "ssc-steno.html" },
                { name: "Strategy", url: "blueprint.html" }
            ];

            navContainer.innerHTML = links.map(link => {
                const isActive = (currentFile === link.url) ? 'class="active-tab" style="background:#004a8f; color:white;"' : '';
                return `<a href="${link.url}" ${isActive}>${link.name}</a>`;
            }).join('');
        }
    };

    // 2. 5-BUTTON ROUTER TEST INJECTION
    const injectRouterControls = () => {
        // A. Header Buttons (Back & Home)
        const header = document.querySelector('.header');
        if (header) {
            header.style.position = 'relative';
            const headNav = `
                <div class="header-router-nav">
                    <a href="javascript:history.back()" class="nav-edge-btn">← BACK</a>
                    <a href="../index.html" class="nav-edge-btn">HOME 🏠</a>
                </div>`;
            header.insertAdjacentHTML('afterbegin', headNav);
        }

        // B. Bottom Glowing Dock (3 CTAs)
        const dock = document.createElement('div');
        dock.className = 'cta-grid-dock';
        dock.innerHTML = `
            <a href="#" data-route="${slug}" data-cat="syllabus" class="glow-btn btn-syllabus">📖 SYLLABUS</a>
            <a href="#" data-route="blueprint" class="glow-btn btn-strategy">⚡ STRATEGY</a>
            <a href="#" data-route="${slug}" data-cat="details" class="glow-btn btn-details">🔥 RECRUITMENT</a>
        `;
        document.body.appendChild(dock);

        // Router Event Listener
        dock.addEventListener('click', async (e) => {
            const btn = e.target.closest('a');
            if (!btn || !window.MeshRouter) return;
            e.preventDefault();
            
            const targetId = btn.dataset.route;
            const category = btn.dataset.cat;

            if (category === 'details') {
                window.location.href = `../details.html?id=${targetId}`;
            } else {
                await MeshRouter.navigate(targetId, category);
            }
        });
    };

    // 3. POPUP & AD CLEANUP (Original Logic)
    const runEssentials = () => {
        if (!sessionStorage.getItem('ssc_v2_closed')) {
            setTimeout(() => {
                const popup = document.getElementById('popup-ad-container');
                if (!popup) return;
                popup.style.display = 'block';
                popup.innerHTML = `<div class="popup-box">
                    <button onclick="this.parentElement.parentElement.style.display='none'; sessionStorage.setItem('ssc_v2_closed','true')">×</button>
                    <h2>🔥 SSC GS VAULT 2026</h2>
                    <p>Download 500+ Most Repeated Questions PDF.</p>
                    <a href="../details.html?id=ssc-gs-vault" class="vibrant-btn">GET PDF CLUE</a>
                </div>`;
            }, 8000);
        }
    };

    // Execution
    sscNavigation.init();
    injectRouterControls();
    runEssentials();
});
