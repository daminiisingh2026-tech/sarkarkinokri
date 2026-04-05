/**
 * loader.js — DEEP-LINK STABILITY VERSION
 */
window.Loader = {
    indexManifest: null,
    _sharedFetch: null,
    _cache: new Map(),

    getBase() {
        return window.location.hostname.includes('github.io') ? '/sarkarkinokri/' : '/';
    },

    _resolve(path) {
        const clean = path.replace(/^\.\.\//g, '').replace(/^\//, '');
        return (this.getBase() + clean).replace(/\/+/g, '/');
    },

    async init(path) {
        if (this.indexManifest) return this.indexManifest;
        if (this._sharedFetch) return this._sharedFetch;

        const finalPath = this._resolve('data/index.json');
        this._sharedFetch = (async () => {
            try {
                const res = await fetch(finalPath, { priority: 'high' });
                if (res.ok) {
                    this.indexManifest = await res.json();
                    return this.indexManifest;
                }
            } catch (e) { this._sharedFetch = null; }
            return null;
        })();
        return this._sharedFetch;
    },

    // IMPROVED: Handles both Home Page (Full List) and Details Page (Single Item)
    async fetchByMaster(id, type) {
        // 1. Generate a Cache Key that distinguishes between 'Full List' and 'Single Item'
        const cacheKey = id ? `${type}_${id}` : `${type}_full`;
        if (this._cache.has(cacheKey)) return this._cache.get(cacheKey);

        const fileName = id ? (id.endsWith('.json') ? id : `${id}.json`) : 'index.json';
        
        // If no ID is provided, we might be looking for a category index
        const rawPath = id ? `data/${type}/${fileName}` : `data/${type}.json`;
        const finalPath = this._resolve(rawPath);
        
        const raw = await this._fetchJSON(finalPath);
        if (!raw) return null;

        let processed = raw;

        // 2. SMART NORMALIZATION
        if (type === "events") {
            processed = { ...raw, events: raw.events || (Array.isArray(raw) ? raw : []) };
        } 
        else if (type === "jobsdata") {
            // If we have an ID, extract that specific job. 
            // If NO ID (Home Page), return the full Array so the grid can render.
            if (id && Array.isArray(raw)) {
                processed = raw.find(item => item.master_id === id) || raw[0];
            } else {
                processed = Array.isArray(raw) ? raw : (raw.data || raw.rows || [raw]);
            }
        }

        this._cache.set(cacheKey, processed);
        return processed;
    },

    async _fetchJSON(url) {
        try {
            const res = await fetch(url);
            return res.ok ? await res.json() : null;
        } catch (e) { return null; }
    }
};
