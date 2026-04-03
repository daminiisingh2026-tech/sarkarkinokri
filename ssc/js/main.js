/**
 * SarkarKinokri Railway Cluster Binding — Version 3.2 (LOCKED)
 * Features: Header Nav Fix, Dynamic Footer, & index.json Router Sync
 */

document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;
    const currentFile = path.split("/").pop() || "index.html";
    const slug = currentFile.replace(".html", "");

    // 1. DYNAMIC NAVIGATION (Top Tab Links)
    const railwayNavigation = {
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
                const isActive = (currentFile === link.url) ? 'class="active-tab" style="background:#002d57; color:white;"' : '';
                return `<a href="${link.url}" ${isActive}>${link.name}</a>`;
            }).join('');
        }
    };

    // 2. HEADER NAVIGATION (Back & Home Buttons)
    const injectHeaderNav = () => {
        // Targets the first header element found
        const header = document.querySelector('header') || document.querySelector('.header');
        if (header && !document.querySelector('.header-router-nav')) {
            const navHTML = `
                <div class="header-router-nav" style="display:flex; justify-content:space-between; padding:12px; width:100%; box-sizing:border-box; background:rgba(0,0,0,0.03);">
                    <a href="javascript:history.back()" class="nav-edge-btn" style="text-decoration:none; color:inherit; font-weight:800; font-size:13px;">← BACK</a>
                    <a href="../index.html" class="nav-edge-btn" style="text-decoration:none; color:inherit; font-weight:800; font-size:13px;">HOME 🏠</a>
                </div>`;
            header.insertAdjacentHTML('afterbegin', navHTML);
        }
    };

    // 3. 5-BUTTON DOCK (MeshRouter Binding)
    const injectRouterControls = () => {
        if (document.querySelector('.cta-grid-dock')) return;
        const dock = document.createElement('div');
        dock.className = 'cta-grid-dock';
        
        // SYLLABUS: Points to root resources folder
        // STRATEGY: Local to the cluster
        // RECRUITMENT: Uses # to trigger Router logic
        dock.innerHTML = `
            <a href="../resources/syllabus/${slug}.html" data-route="${slug}" data-cat="syllabus" class="glow-btn btn-syllabus">📖 SYLLABUS</a>
            <a href="blueprint.html" data-route="blueprint" class="glow-btn btn-strategy">⚡ STRATEGY</a>
            <a href="#" data-route="${slug}" data-cat="details" class="glow-btn btn-details">🔥 RECRUITMENT</a>
        `;
        document.body.appendChild(dock);

        dock.addEventListener('click', async (e) => {
            const btn = e.target.closest('a');
            if (!btn) return;
            
            const category = btn.dataset.cat;
            const href = btn.getAttribute('href');

            // Handle the Dynamic Recruitment Button via MeshRouter + index.json
            if (href === '#' || category === 'details') {
                e.preventDefault();
                if (window.MeshRouter) {
                    await MeshRouter.navigate(btn.dataset.route, category);
                } else {
                    // Manual fallback to details.html
                    window.location.href = `../details.html?id=${btn.dataset.route}`;
                }
            }
        });
    };

    // 4. DYNAMIC FOOTER INJECTION
    const injectFooter = () => {
        if (document.querySelector('.site-footer')) return;
        const footerHTML = `
            <footer class="site-footer" style="background:#111; color:white; padding:45px 20px; margin-top:60px; text-align:center; border-top:3px solid #002d57;">
                <div style="max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:35px; text-align:left;">
                    <div>
                        <h4 style="color:#ff6a00; margin-bottom:10px;">Railway Cluster</h4>
                        <p style="font-size:13px; opacity:0.6; line-height:1.5;">Automated recruitment engine for RRB NTPC, ALP, JE & Group D. All paths managed by index.json.</p>
                    </div>
                    <div>
                        <h4 style="color:#ff6a00; margin-bottom:10px;">Quick Links</h4>
                        <div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
                            <a href="medical.html" style="color:#aaa; text-decoration:none;">Medical Standards</a>
                            <a href="salary.html" style="color:#aaa; text-decoration:none;">Salary Matrix</a>
                        </div>
                    </div>
                </div>
                <p style="margin-top:40px; font-size:11px; opacity:0.3; letter-spacing:1px;">© 2026 SARKARKINOKRI | CLUSTER V3.2 LOCKED</p>
            </footer>`;
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    };

    // EXECUTION
    railwayNavigation.init();
    injectHeaderNav();
    injectRouterControls();
    injectFooter();
});
