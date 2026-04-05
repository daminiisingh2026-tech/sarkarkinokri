/**
 * loader.js — THE HYBRID SPECIALIST
 */
window.Loader = {
    indexManifest: null,
    _sharedFetch: null,

    // 1. Manifest Fetching Logic
    async init(path) {
        if (this.indexManifest) return this.indexManifest;
        if (this._sharedFetch) return this._sharedFetch;

        const finalPath = window.rel ? window.rel(path) : path;

        this._sharedFetch = (async () => {
            try {
                const res = await fetch(finalPath);
                this.indexManifest = await res.json();
                console.log("%c✅ Manifest Secured", "color: #10b981; font-weight: bold;");
                return this.indexManifest;
            } catch (e) {
                this._sharedFetch = null;
                return null;
            }
        })();

        return this._sharedFetch;
    },

    // 2. Intelligent Fetching based on 'type'
    async fetchByMaster(id, type) {
        const fileName = id.endsWith('.json') ? id : `${id}.json`;
        
        // Using the dynamic path resolution we fixed
        const finalPath = window.rel ? window.rel(`data/${type}/${fileName}`) : `data/${type}/${fileName}`;
        
        const raw = await this._fetchJSON(finalPath);
        if (!raw) return null;

        // --- THE LOGIC HOOKS ---
        if (type === "events") {
            // Ensure it returns an Object with an events array for the hooks
            return {
                ...raw,
                events: raw.events || (Array.isArray(raw) ? raw : [])
            };
        } 

        if (type === "jobsdata") {
            // Ensure it returns an Array for table rendering
            return Array.isArray(raw) ? raw : (raw.data || raw.rows || [raw]);
        }

        return raw; // Default: for dailyposts or others
    },

    async _fetchJSON(url) {
        try {
            const res = await fetch(url);
            return res.ok ? await res.json() : null;
        } catch (e) { 
            return null; 
        }
    }
};
