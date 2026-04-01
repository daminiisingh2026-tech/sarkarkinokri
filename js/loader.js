/**
 * loader.js — THE HYBRID SPECIALIST (ROOT SAFE)
 */
window.Loader = {
    indexManifest: null,
    _sharedFetch: null,

    getBase() {
        return (window.SarkarPath && window.SarkarPath.base) ? window.SarkarPath.base : '/';
    },

    // 1. Manifest is always an Object with 'entries'
    async init(path) {
        if (this.indexManifest) return this.indexManifest;
        if (this._sharedFetch) return this._sharedFetch;

        const finalPath = window.rel ? window.rel(path) : path;

        this._sharedFetch = (async () => {
            try {
                console.log("📡 Fetch Manifest:", finalPath);
                const res = await fetch(finalPath);
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

    // 2. Intelligent Fetching based on 'type'
    async fetchByMaster(id, type) {
        const fileName = id.endsWith('.json') ? id : `${id}.json`;

        const rawPath = `data/${type}/${fileName}`;
        const finalPath = window.rel ? window.rel(rawPath) : rawPath;

        const raw = await this._fetchJSON(finalPath);
        if (!raw) return null;

        // --- THE LOGIC HOOKS ---
        if (type === "events") {
            return {
                ...raw,
                events: raw.events || (Array.isArray(raw) ? raw : [])
            };
        }

        if (type === "jobsdata") {
            return Array.isArray(raw) ? raw : (raw.data || raw.rows || [raw]);
        }

        return raw; // Default
    },

    async _fetchJSON(url) {
        try {
            console.log("📡 Fetch:", url);
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
