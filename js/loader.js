/**
 * loader.js — THE HYBRID SPECIALIST (PathFix integrated)
 */
window.Loader = {
    indexManifest: null,
    _sharedFetch: null,

    getBase() {
        return (window.PathFix && window.PathFix.base) ? window.PathFix.base : '';
    },

    _resolve(path) {
        if (window.PathFix && window.PathFix.resolve) {
            return window.PathFix.resolve(path);
        }
        return path;
    },

    // 1. Manifest is always an Object with 'entries'
    async init(path) {
        if (this.indexManifest) return this.indexManifest;
        if (this._sharedFetch) return this._sharedFetch;

        const finalPath = this._resolve(path);

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
        const finalPath = this._resolve(`data/${type}/${fileName}`);
        
        const raw = await this._fetchJSON(finalPath);
        if (!raw) return null;

        // --- LOGIC HOOKS ---
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
            const final = this._resolve(url);
            const res = await fetch(final);
            return res.ok ? await res.json() : null;
        } catch (e) { 
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
