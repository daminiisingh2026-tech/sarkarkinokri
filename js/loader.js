/**
 * loader.js — THE HYBRID SPECIALIST (SMART & ROOT SAFE)
 */
window.Loader = {
    indexManifest: null,
    _sharedFetch: null,

    // NEW: Path Resolver to handle GitHub Subfolders
    getBase() {
        const isGitHub = window.location.hostname.includes('github.io');
        // If on GitHub, add your repo name. If local/Acode, stay at root.
        const base = isGitHub ? '/sarkarkinokri/' : '/';
        return base;
    },
    
    // 1. Original Manifest Fetching (Now with Shared Fetch for stability)
    async init(path) {
        if (this.indexManifest) return this.indexManifest;
        if (this._sharedFetch) return this._sharedFetch;

        // Resolve Path: Prioritize PathFix/rel, fallback to getBase()
        const finalPath = window.rel ? window.rel(path) : (this.getBase() + path).replace(/\/+/g, '/');
        
        this._sharedFetch = (async () => {
            try {
                console.log("🔍 Fetch Manifest:", finalPath);
                const res = await fetch(finalPath);
                if (!res.ok) throw new Error("Fetch failed");
                this.indexManifest = await res.json();
                console.log("%c✅ Manifest Secured", "color: #10b981; font-weight: bold;");
                return this.indexManifest;
            } catch (e) {
                console.error("❌ Manifest fetch failed:", finalPath);
                this._sharedFetch = null;
                return null;
            }
        })();
        return this._sharedFetch;
    },

    // 2. SMART FETCHING: Fixes the details.js demand (Array vs Object)
    async fetchByMaster(id, type) {
        const fileName = id.endsWith('.json') ? id : `${id}.json`;
        const rawPath = `data/${type}/${fileName}`;
        
        // Resolve Path
        const finalPath = window.rel ? window.rel(rawPath) : (this.getBase() + rawPath).replace(/\/+/g, '/');
        
        const raw = await this._fetchJSON(finalPath);
        if (!raw) return null;

        // --- THE ACODE LOGIC HOOKS ---
        if (type === "events") {
            // Fix: Ensure we have an events property even if the file is just an array
            return {
                ...raw,
                events: raw.events || (Array.isArray(raw) ? raw : [])
            };
        } 
        
        if (type === "jobsdata") {
            // FIX: THE DATA HANDSHAKE
            // Forces the data into an Array format so details.js doesn't hang on "Syncing"
            return Array.isArray(raw)
                ? raw
                : (raw.data || raw.rows || [raw]);
        }

        return raw; 
    },

    async _fetchJSON(url) {
        try {
            console.log("🔍 Fetch:", url);
            const res = await fetch(url);
            return res.ok ? await res.json() : null;
        } catch (e) { 
            console.error("❌ Fetch failed:", url);
            return null; 
        }
    },

    getAllMasterIds() {
        const m = this.indexManifest;
        if (!m) return [];

        const list = m.entries || m.rows || (Array.isArray(m) ? m : []);
        
        return [...new Set(
            list.map(item => item.master_id || item.id)
        )].filter(Boolean);
    }
};
