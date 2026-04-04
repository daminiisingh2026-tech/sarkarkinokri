/**
 * loader.js — STABLE UNIVERSAL LOADER (rel + PathFix compatible)
 */
window.Loader = {
    indexManifest: null,
    _sharedFetch: null,

    _resolve(path) {
        let final = path;

        // Step 1: router depth resolver
        if (typeof window.rel === "function") {
            final = window.rel(final);
        }

        // Step 2: optional GitHub repo prefix
        if (window.PathFix && typeof window.PathFix.resolve === "function") {
            final = window.PathFix.resolve(final);
        }

        return final;
    },

    async init(path) {
        if (this.indexManifest) return this.indexManifest;
        if (this._sharedFetch) return this._sharedFetch;

        const finalPath = this._resolve(path);

        this._sharedFetch = (async () => {
            try {
                const res = await fetch(finalPath);
                if (!res.ok) throw new Error("Manifest fetch failed");

                this.indexManifest = await res.json();
                console.log("%c✅ Manifest Secured", "color:#10b981;font-weight:bold;");
                return this.indexManifest;
            } catch (e) {
                console.error("Loader init failed:", e);
                this._sharedFetch = null;
                return null;
            }
        })();

        return this._sharedFetch;
    },

    async fetchByMaster(id, type) {
        const fileName = id.endsWith(".json") ? id : `${id}.json`;
        const finalPath = this._resolve(`data/${type}/${fileName}`);

        const raw = await this._fetchJSON(finalPath);
        if (!raw) return null;

        // normalize events
        if (type === "events") {
            return {
                ...raw,
                events: raw.events || (Array.isArray(raw) ? raw : [])
            };
        }

        // normalize jobsdata
        if (type === "jobsdata") {
            return Array.isArray(raw)
                ? raw
                : (raw.data || raw.rows || [raw]);
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