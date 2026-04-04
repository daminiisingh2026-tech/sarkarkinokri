/**
 * loader.js — COMPATIBILITY UNIVERSAL LOADER
 * Works with existing router.js, details.js, main.js, ticker.js
 */

window.Loader = {
    indexManifest: null,
    _sharedFetch: null,

    // REQUIRED by details.js
    getBase() {
        if (window.PathFix && window.PathFix.base) {
            return window.PathFix.base + "/";
        }

        // fallback for Acode / localhost
        const path = location.pathname;
        const parts = path.split("/").filter(Boolean);

        // if inside repo folder
        if (location.hostname.includes("github.io") && parts.length) {
            return "/" + parts[0] + "/";
        }

        return "";
    },

    _resolve(path) {
        let final = path;

        // router depth resolver (if exists)
        if (typeof window.rel === "function") {
            final = window.rel(final);
        }

        // github repo prefix (optional)
        if (window.PathFix && window.PathFix.resolve) {
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
                console.log("✅ Loader initialized");
                return this.indexManifest;

            } catch (e) {
                console.error("❌ Loader init failed", e);
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

        // events normalization
        if (type === "events") {
            return {
                ...raw,
                events: raw.events || (Array.isArray(raw) ? raw : [])
            };
        }

        // jobsdata normalization
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
        } catch {
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