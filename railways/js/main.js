/**
 * SarkarKinokri Railway Cluster Binding — Version 3.3 (ROUTER SAFE)
 * Features: Header Nav Fix, Dynamic Footer, Router-safe Recruitment button
 */

document.addEventListener("DOMContentLoaded", function () {

    const path = window.location.pathname;
    const currentFile = path.split("/").pop() || "index.html";
    const slug = currentFile.replace(".html", "");

    /* ----------------------------------
       1. DYNAMIC NAVIGATION
    ---------------------------------- */
    const railwayNavigation = {
        init() {
            const navContainer = document.getElementById("main-nav");
            if (!navContainer) return;

            const links = [
                { name: "Home", url: "index.html" },
                { name: "NTPC", url: "rrb-ntpc.html" },
                { name: "ALP", url: "rrb-alp.html" },
                { name: "Tech", url: "rrb-technician.html" },
                { name: "Group D", url: "rrb-group-d.html" },
                { name: "JE", url: "rrb-je.html" },
                { name: "Syllabus", url: "syllabus.html" },
                { name: "Medical", url: "medical.html" },
                { name: "Salary", url: "salary.html" },
                { name: "Analysis", url: "analysis.html" },
                { name: "Strategy", url: "blueprint.html" }
            ];

            navContainer.innerHTML = links.map(link => {
                const active = (currentFile === link.url)
                    ? 'class="active-tab" style="background:#002d57;color:white;"'
                    : "";
                return `<a href="${link.url}" ${active}>${link.name}</a>`;
            }).join("");
        }
    };

    /* ----------------------------------
       2. HEADER NAVIGATION
    ---------------------------------- */
    const injectHeaderNav = () => {
        const header =
            document.querySelector("header") ||
            document.querySelector(".header");

        if (!header || document.querySelector(".header-router-nav")) return;

        header.insertAdjacentHTML("afterbegin", `
            <div class="header-router-nav"
                 style="display:flex;justify-content:space-between;padding:12px;width:100%;box-sizing:border-box;background:rgba(0,0,0,0.03);">
                 
                <a href="javascript:history.back()"
                   class="nav-edge-btn"
                   style="text-decoration:none;color:inherit;font-weight:800;font-size:13px;">
                   ← BACK
                </a>

                <a href="../index.html"
                   class="nav-edge-btn"
                   style="text-decoration:none;color:inherit;font-weight:800;font-size:13px;">
                   HOME 🏠
                </a>
            </div>
        `);
    };

    /* ----------------------------------
       3. ROUTER DOCK
    ---------------------------------- */
    const injectRouterControls = () => {

        if (document.querySelector(".cta-grid-dock")) return;

        const dock = document.createElement("div");
        dock.className = "cta-grid-dock";

        dock.innerHTML = `
            <a href="../resources/syllabus/${slug}.html"
               data-route="${slug}"
               data-cat="syllabus"
               class="glow-btn btn-syllabus">
               📖 SYLLABUS
            </a>

            <a href="blueprint.html"
               data-route="blueprint"
               class="glow-btn btn-strategy">
               ⚡ STRATEGY
            </a>

            <a href="#"
               data-route="${slug}"
               data-cat="details"
               class="glow-btn btn-details">
               🔥 RECRUITMENT
            </a>
        `;

        document.body.appendChild(dock);

        dock.addEventListener("click", async (e) => {
            const btn = e.target.closest("a");
            if (!btn) return;

            const category = btn.dataset.cat;
            const route = btn.dataset.route;

            // Recruitment button
            if (category === "details") {
                e.preventDefault();

                // Primary: MeshRouter
                if (window.MeshRouter) {
                    await window.MeshRouter.navigate(route, category);
                    return;
                }

                // Router-safe fallback (IMPORTANT FIX)
                window.location.href = `../${route}.html`;
            }
        });
    };

    /* ----------------------------------
       4. FOOTER
    ---------------------------------- */
    const injectFooter = () => {

        if (document.querySelector(".site-footer")) return;

        document.body.insertAdjacentHTML("beforeend", `
            <footer class="site-footer"
                style="background:#111;color:white;padding:45px 20px;margin-top:60px;text-align:center;border-top:3px solid #002d57;">

                <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:35px;text-align:left;">
                    
                    <div>
                        <h4 style="color:#ff6a00;margin-bottom:10px;">Railway Cluster</h4>
                        <p style="font-size:13px;opacity:0.6;line-height:1.5;">
                            Automated recruitment engine for RRB NTPC, ALP, JE & Group D.
                            All paths managed by index.json.
                        </p>
                    </div>

                    <div>
                        <h4 style="color:#ff6a00;margin-bottom:10px;">Quick Links</h4>
                        <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;">
                            <a href="medical.html" style="color:#aaa;text-decoration:none;">Medical Standards</a>
                            <a href="salary.html" style="color:#aaa;text-decoration:none;">Salary Matrix</a>
                        </div>
                    </div>

                </div>

                <p style="margin-top:40px;font-size:11px;opacity:0.3;letter-spacing:1px;">
                    © 2026 SARKARKINOKRI | CLUSTER V3.3 ROUTER SAFE
                </p>
            </footer>
        `);
    };

    /* ----------------------------------
       EXECUTION
    ---------------------------------- */
    railwayNavigation.init();
    injectHeaderNav();
    injectRouterControls();
    injectFooter();

});