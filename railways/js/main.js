/**
 * SarkarKinokri Railway Cluster Engine
 * Unified logic for Navigation, Footer, and CTAs
 */

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. RAILWAY NAVIGATION INJECTION (11-Page Logic)
    const railwayNavigation = {
        init() {
            const navContainer = document.getElementById('main-nav');
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

            const currentFile = window.location.pathname.split("/").pop() || "index.html";
            
            navContainer.innerHTML = links.map(link => {
                const isActive = currentFile === link.url ? 
                    `class="active-tab" style="background:#002d57; color:white; border-bottom:3px solid #ff6a00;"` : '';
                return `<a href="${link.url}" ${isActive}>${link.name}</a>`;
            }).join('');
        }
    };

    // 2. DYNAMIC FOOTER INJECTION
    const injectFooter = () => {
        const footerHTML = `
            <footer class="site-footer" style="background:#1a1a1a; color:white; padding:40px 20px; margin-top:50px;">
                <div class="footer-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:30px; max-width:1200px; margin:0 auto;">
                    <div>
                        <h4 style="color:#ff6a00; border-bottom:2px solid #333; padding-bottom:10px;">Railway Helpline</h4>
                        <p style="font-size:14px; opacity:0.8;">📧 sarkarkinokrilelo@gmail.com</p>
                        <p style="font-size:14px; opacity:0.8;">Official updates for RRB CEN 2025-26.</p>
                    </div>
                    <div>
                        <h4 style="color:#ff6a00; border-bottom:2px solid #333; padding-bottom:10px;">Quick Links</h4>
                        <ul style="list-style:none; padding:0; font-size:14px; line-height:2;">
                            <li><a href="medical.html" style="color:white; text-decoration:none;">⚕️ Medical Standards</a></li>
                            <li><a href="salary.html" style="color:white; text-decoration:none;">💰 Salary Matrix</a></li>
                            <li><a href="blueprint.html" style="color:white; text-decoration:none;">⚡ 90-Day Strategy</a></li>
                        </ul>
                    </div>
                </div>
                <p style="text-align:center; margin-top:30px; padding-top:20px; border-top:1px solid #333; font-size:13px; opacity:0.6;">
                    <strong>SarkarKinokri</strong> - Built by experts, trusted by aspirants. © 2026
                </p>
            </footer>
        `;
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    };

    // 3. FLOATING CTA INJECTION (Cluster Bridge)
    const injectFloatingCTAs = () => {
        const currentFile = window.location.pathname.split("/").pop();
        // Don't show floating buttons on the home index to keep it clean
        if (currentFile === "index.html" || currentFile === "") return;

        const dockHTML = `
            <div class="floating-actions">
                <a href="blueprint.html" class="vibrant-btn btn-blueprint">⚡ RAILWAY 90-DAY STRATEGY</a>
                <a href="../resources/syllabus/index.html" class="vibrant-btn btn-blueprint">📚 SYLLABUS HUB</a>
                <a href="javascript:void(0)" onclick="MeshRouter.navigate('live-railway')" class="vibrant-btn btn-ongoing">🔥 ONGOING RRB JOBS</a>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', dockHTML);
    };

    // 4. AD-BOX OPTIMIZER (Same logic as SSC)
    const cleanEmptyAds = () => {
        document.querySelectorAll('.ad-box').forEach(box => {
            if (box.innerHTML.trim() === "") {
                box.style.display = 'none';
            }
        });
    };

    // EXECUTION
    railwayNavigation.init();
    injectFooter();
    injectFloatingCTAs();
    cleanEmptyAds();
});

// GLOBAL BRIDGE FOR MESHROUTER
window.openRailwayDetails = function(slug) {
    if (typeof MeshRouter !== 'undefined') {
        MeshRouter.navigate(slug);
    } else {
        window.location.href = `../details.html?slug=${slug}`;
    }
};
