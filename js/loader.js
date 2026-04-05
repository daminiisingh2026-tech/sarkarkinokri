/**
 * loader.js — THE HYBRID SPECIALIST (ROOT SAFE)
 */
window.Loader = {
    indexManifest: null,
    
    // 1. Original Manifest Fetching
    async init(path) {
        if (this.indexManifest) return this.indexManifest;

        const finalPath = window.rel ? window.rel(path) : path;
        
        try {
            console.log("🔍 Fetch Manifest:", finalPath); // Restored Red line
            const res = await fetch(finalPath);
            this.indexManifest = await res.json();
            console.log("%c✅ Manifest Secured", "color: #10b981; font-weight: bold;");
            return this.indexManifest;
        } catch (e) {
            console.error("❌ Manifest fetch failed:", finalPath); // Restored Red line
            return null;
        }
    },

    // 2. Original Intelligent Fetching
    async fetchByMaster(id, type) {
        const fileName = id.endsWith('.json') ? id : `${id}.json`;
        
        // Restored Original Red Path Logic (Lines 39-42)
        const rawPath = `data/${type}/${fileName}`;
        const finalPath = window.rel ? window.rel(rawPath) : rawPath;
        
        const raw = await this._fetchJSON(finalPath);
        if (!raw) return null;

        // --- THE LOGIC HOOKS ---
        if (type === "events") {
            return raw; // Original behavior before the Object/Array wrap
        } 
        
        if (type === "jobsdata") {
            return raw; // Original behavior before the Array check
        }

        return raw; 
    },

    async _fetchJSON(url) {
        try {
            console.log("🔍 Fetch:", url); // Restored Red line
            const res = await fetch(url);
            return res.ok ? await res.json() : null;
        } catch (e) { 
            console.error("❌ Fetch failed:", url); // Restored Red line
            return null; 
        }
    },

    getAllMasterIds() {
        const m = this.indexManifest;
        if (!m) return [];

        // Restored Original Red Mapping (Lines 75-80)
        const list = m.entries || m.rows || (Array.isArray(m) ? m : []);
        
        return [...new Set(
            list.map(item => item.master_id || item.id)
        )].filter(Boolean);
    }
};
