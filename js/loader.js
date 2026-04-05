/**
 * loader.js — GLOBAL PATH ENFORCER (GitHub Stable)
 */
window.Loader = {
    indexManifest: null,
    _sharedFetch: null,
    _cache: new Map(),

    // 1. DYNAMIC BASE DETECTOR
    getBase() {
        const isGitHub = window.location.hostname.includes('github.io');
        return isGitHub ? '/sarkarkinokri/' : '/';
    },

    // 2. GLOBAL PATH CLEANER (Strips ../ and fixes routing)
    _resolve(path) {
        if (!path || typeof path !== 'string') return path;
        // Strip any relative jumps (../) or leading slashes (/)
        const clean = path.replace(/^\.\.\//g, '').replace(/^\//, '');
        const final = (this.getBase() + clean).replace(/\/+/g, '/');
        return final;
    },

    async init(path) {
        if (this.indexManifest) return this.indexManifest;
        if (this._sharedFetch) return this._sharedFetch;

        // Force resolve the manifest to its absolute GitHub path
        const finalPath = this._resolve('data/index.json');
        
        this._sharedFetch = (async () => {
            try {
                const res = await fetch(finalPath, { priority: 'high' });
                if (res.ok) {
                    this.indexManifest = await res.json();
                    console.log("%c✅ Engine Linked", "color: #10b981; font-weight: bold;");
                    return this.indexManifest;
                }
            } catch (e) { console.error("❌ Manifest Error"); }
            this._sharedFetch = null;
            return null;
        })();
        return this._sharedFetch;
    },

    async fetchByMaster(id, type) {
        if (!id) return null;
        const cacheKey = `${type}_${id}`;
        if (this._cache.has(cacheKey)) return this._cache.get(cacheKey);

        const fileName = id.endsWith('.json') ? id : `${id}.json`;
        const finalPath = this._resolve(`data/${type}/${fileName}`);
        
        const raw = await this._fetchJSON(finalPath);
        if (!raw) return null;

        // THE "ACODE" HANDSHAKE (Array vs Object Fix)
        let processed = raw;
        if (type === "events") {
            processed = { ...raw, events: raw.events || (Array.isArray(raw) ? raw : []) };
        } else if (type === "jobsdata") {
            // If it's an array (like MTS), find the matching entry.
            // If it's an object, wrap it or find the key.
            if (Array.isArray(raw)) {
                processed = raw.find(item => item.master_id === id) || raw[0];
            } else {
                processed = raw[id] || raw.data || raw;
            }
        }

        this._cache.set(cacheKey, processed);
        return processed;
    },

    async _fetchJSON(url) {
        try {
            console.log("🔍 Fetching:", url);
            const res = await fetch(url);
            return res.ok ? await res.json() : null;
        } catch (e) { return null; }
    },

    getAllMasterIds() {
        const m = this.indexManifest;
        if (!m) return [];
        const list = m.entries || m.rows || (Array.isArray(m) ? m : []);
        return [...new Set(list.map(item => item.master_id || item.id))].filter(Boolean);
    }
};

// 3. THE "NUCLEAR" FIX: Patch the global fetch to stop ../ 404s
const originalFetch = window.fetch;
window.fetch = function(input, init) {
    if (typeof input === 'string' && input.includes('../data/')) {
        const fixedUrl = window.Loader._resolve(input);
        console.log("🛠️ Auto-Fixing Path:", input, "→", fixedUrl);
        return originalFetch(fixedUrl, init);
    }
    return originalFetch(input, init);
};
