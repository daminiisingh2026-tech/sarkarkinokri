/**
 * SarkarKinokri SSC Cluster Engine - FULL PRODUCTION VERSION
 * Handles: Dynamic Nav, Filename Mapping, Popups, and Ad Cleanup
 */

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. DYNAMIC NAVIGATION WITH FILENAME MAPPING
    const sscNavigation = {
        init() {
            const navContainer = document.getElementById('main-nav');
            if (!navContainer) return;

            // Updated URLs to your NEW hyphenated filenames
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

            const path = window.location.pathname;
            const currentFile = path.split("/").pop() || "index.html";

            // Mapping for legacy URLs to prevent 404s
            const legacyMap = {
                "ssccgl.html": "ssc-cgl.html",
                "sscchsl.html": "ssc-chsl.html",
                "sscmts.html": "ssc-mts.html",
                "sscje.html": "ssc-je.html",
                "sscselection.html": "ssc-selectionpost.html",
                "sscsteno.html": "ssc-steno.html"
            };

            // If user lands on old name, redirect to new name immediately
            if (legacyMap[currentFile]) {
                window.location.replace(legacyMap[currentFile]);
                return;
            }

            navContainer.innerHTML = links.map(link => {
                const isActive = (currentFile === link.url) ? 
                    'class="active-tab" style="background:#004a8f; color:white;"' : '';
                return `<a href="${link.url}" ${isActive}>${link.name}</a>`;
            }).join('');
        }
    };

    sscNavigation.init();

    // 2. YOUR ORIGINAL POPUP LOGIC (8 Second Delay)
    const triggerSscPopup = () => {
        if (!sessionStorage.getItem('ssc_v2_closed')) {
            setTimeout(() => {
                const popup = document.getElementById('popup-ad-container');
                if (!popup) return;
                
                popup.style.display = 'block';
                popup.innerHTML = `
                    <div style="background:white; padding:20px; border-radius:15px; max-width:90%; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); border:4px solid #004a8f; box-shadow:0 0 50px rgba(0,0,0,0.5); z-index:10000; text-align:center;">
                        <button id="close-ssc-popup" style="position:absolute; top:10px; right:10px; border:none; background:none; font-size:24px; cursor:pointer;">×</button>
                        <h2 style="color:#e74c3c;">🔥 SSC GS VAULT 2026</h2>
                        <p style="font-weight:bold; margin-bottom:20px;">Download 500+ Most Repeated SSC Questions PDF.</p>
                        <a href="../details.html?id=ssc-gs-vault" style="display:block; background:#004a8f; color:white; padding:12px; text-decoration:none; border-radius:8px; font-weight:bold;">GET PDF CLUE</a>
                    </div>
                `;

                document.getElementById('close-ssc-popup').onclick = () => {
                    popup.style.display = 'none';
                    sessionStorage.setItem('ssc_v2_closed', 'true');
                };
            }, 8000); 
        }
    };
    triggerSscPopup();

    // 3. YOUR ORIGINAL AD-BLOCKER CLEANUP
    const cleanEmptyAds = () => {
        const adBoxes = document.querySelectorAll('.ad-box');
        let attempts = 0;
        const checkInterval = setInterval(() => {
            adBoxes.forEach(box => {
                const ins = box.querySelector('ins');
                if (ins && ins.getAttribute('data-ad-status') === 'unfilled' && attempts >= 5) {
                    box.style.display = 'none';
                } else if (box.innerHTML.trim() === "" && attempts >= 5) {
                    box.style.display = 'none';
                }
            });
            if (++attempts > 5) clearInterval(checkInterval);
        }, 1000);
    };
    cleanEmptyAds();

    // 4. YOUR ORIGINAL ROOT NAVIGATOR
    window.promiseSscNavigator = function(id) {
        window.location.href = `../details.html?id=${id}`;
    };

});
