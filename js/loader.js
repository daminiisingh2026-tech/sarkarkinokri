/**
 * loader.js — PERFORMANCE & RELIABILITY VERSION
 */
window.Loader = {
    indexManifest: null,
    _sharedFetch: null,
    _cache: new Map(), // Prevent re-fetching the same file

    getBase() {
        return window.location.hostname.includes('github.io') ? '/sarkarkinokri/' : '/';
    },

    _resolve(path) {
        const clean = path.replace(/^\.\.\//g, '').replace(/^\//, '');
        return (this.getBase() + clean).replace(/\/+/g, '/');
    },

    // 1. FAST INIT: Load manifest immediately with high priority
    async init(path) {
        if (this.indexManifest) return this.indexManifest;
        if (this._sharedFetch) return this._sharedFetch;

        const finalPath = this._resolve('data/index.json');
        
        this._sharedFetch = (async () => {
            // RETRY LOGIC: Try 3 times before giving up
            for (let i = 0; i < 3; i++) {
                try {
                    const res = await fetch(finalPath, { priority: 'high' });
                    if (res.ok) {
                        this.indexManifest = await res.json();
                        return this.indexManifest;
                    }
                } catch (e) {
                    console.warn(`Retry ${i+1} for manifest...`);
                }
                await new Promise(r => setTimeout(r, 200 * i)); // Wait longer each time
            }
            this._sharedFetch = null;
            return null;
        })();
        return this._sharedFetch;
    },

    // 2. SMART CACHING: Fixes the "Important Links Not Fetched" issue
    async fetchByMaster(id, type) {
        if (!id) return null;
        const cacheKey = `${type}_${id}`;
        if (this._cache.has(cacheKey)) return this._cache.get(cacheKey);

        const fileName = id.endsWith('.json') ? id : `${id}.json`;
        const finalPath = this._resolve(`data/${type}/${fileName}`);
        
        const raw = await this._fetchJSON(finalPath);
        if (!raw) return null;

        let processed = raw;
        if (type === "events") {
            processed = { ...raw, events: raw.events || (Array.isArray(raw) ? raw : []) };
        } else if (type === "jobsdata") {
            processed = Array.isArray(raw) ? raw : (raw.data || raw.rows || [raw]);
        }

        this._cache.set(cacheKey, processed); // Save to memory so refresh is instant
        return processed;
    },

    async _fetchJSON(url) {
        try {
            const res = await fetch(url);
            return res.ok ? await res.json() : null;
        } catch (e) { 
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
