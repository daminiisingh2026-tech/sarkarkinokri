/**
 * SarkarKinokri SSC Central Engine — Version 3.4 (BUG FIX)
 * Fixes: "Silent Death" by adding dependency checks and path correction.
 */

document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;
    const currentFile = path.split("/").pop() || "index.html";
    const slug = currentFile.replace(".html", "");

    // 1. DYNAMIC NAVIGATION
    const sscNavigation = {
        init() {
            const navContainer = document.getElementById('main-nav');
            if (!navContainer) return;
            const links = [
                { name: "Home", url: "index.html" },
                { name: "CGL", url: "ssc-cgl.html" },
                { name: "CHSL", url: "ssc-chsl.html" },
                { name: "MTS", url: "ssc-mts.html" },
                { name: "Strategy", url: "blueprint.html" }
            ];
            navContainer.innerHTML = links.map(link => {
                const isActive = (currentFile === link.url) ? 'class="active-tab" style="background:#004a8f; color:white;"' : '';
                return `<a href="${link.url}" ${isActive}>${link.name}</a>`;
            }).join('');
        }
    };

    // 2. 5-BUTTON DOCK (Standardized)
    const injectRouterControls = () => {
        if (document.querySelector('.cta-grid-dock')) return;
        const dock = document.createElement('div');
        dock.className = 'cta-grid-dock';
        
        dock.innerHTML = `
            <a href="../resources/syllabus/${slug}.html" data-route="${slug}" data-cat="syllabus" class="glow-btn btn-syllabus">📖 SYLLABUS</a>
            <a href="blueprint.html" class="glow-btn btn-strategy">⚡ STRATEGY</a>
            <a href="#" data-route="${slug}" data-cat="details" class="glow-btn btn-details">🔥 RECRUITMENT</a>
        `;
        document.body.appendChild(dock);

        dock.addEventListener('click', async (e) => {
            const btn = e.target.closest('a');
            if (!btn || btn.getAttribute('href') !== '#') return;
            
            e.preventDefault();
            const targetId = btn.dataset.route;

            // CHECK: Is the Router actually loaded?
            if (window.MeshRouter && window.Loader && Loader.indexManifest) {
                console.log("Router Active: Searching for " + targetId);
                await MeshRouter.navigate(targetId, 'details');
            } else {
                // EMERGENCY FALLBACK: Direct redirect if JS fails
                console.warn("Router missing/loading. Using Emergency Fallback.");
                window.location.href = `../details.html?id=${targetId}`;
            }
        });
    };

    // 3. HEADER & FOOTER
    const injectLayout = () => {
        const header = document.querySelector('header') || document.querySelector('.header');
        if (header && !document.querySelector('.header-router-nav')) {
            header.insertAdjacentHTML('afterbegin', `
                <div class="header-router-nav" style="display:flex; justify-content:space-between; padding:10px; width:100%;">
                    <a href="javascript:history.back()" style="text-decoration:none; color:inherit; font-weight:bold;">← BACK</a>
                    <a href="../index.html" style="text-decoration:none; color:inherit; font-weight:bold;">HOME 🏠</a>
                </div>`);
        }

        if (!document.querySelector('.site-footer')) {
            document.body.insertAdjacentHTML('beforeend', `
                <footer class="site-footer" style="background:#111; color:white; padding:30px; text-align:center; margin-top:50px;">
                    <p>© 2026 SarkarKinokri | SSC Cluster V3.4</p>
                </footer>`);
        }
    };

    sscNavigation.init();
    injectRouterControls();
    injectLayout();
});
