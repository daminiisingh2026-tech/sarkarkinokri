/**
 * loader.js — REFRESH-STABLE (ABSOLUTE PATHS)
 */
window.Loader = {
    indexManifest: null,
    _sharedFetch: null,

    // FORCE ABSOLUTE BASE
    getBase() {
        const isGitHub = window.location.hostname.includes('github.io');
        // This ensures paths always start from the repo root, never relative ../
        return isGitHub ? '/sarkarkinokri/' : '/';
    },

    _resolve(path) {
        // Remove any existing ../ or leading slashes to prevent doubling
        const cleanPath = path.replace(/^\.\.\//, '').replace(/^\//, '');
        return this.getBase() + cleanPath;
    },

    async init(path) {
        if (this.indexManifest) return this.indexManifest;
        if (this._sharedFetch) return this._sharedFetch;

        // Force resolve the manifest path to be absolute
        const finalPath = this._resolve('data/index.json');
        
        this._sharedFetch = (async () => {
            try {
                console.log("🔍 Fetch Manifest (Absolute):", finalPath);
                const res = await fetch(finalPath);
                if (!res.ok) throw new Error("404");
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

    async fetchByMaster(id, type) {
        const fileName = id.endsWith('.json') ? id : `${id}.json`;
        // Force absolute path for every data fetch
        const finalPath = this._resolve(`data/${type}/${fileName}`);
        
        const raw = await this._fetchJSON(finalPath);
        if (!raw) return null;

        // SMART CONVERSION (Matches Acode Logic)
        if (type === "events") {
            return {
                ...raw,
                events: raw.events || (Array.isArray(raw) ? raw : [])
            };
        } 
        
        if (type === "jobsdata") {
            return Array.isArray(raw) ? raw : (raw.data || raw.rows || [raw]);
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
        return [...new Set(list.map(item => item.master_id || item.id))].filter(Boolean);
    }
};
