window.Loader = {
    indexManifest: null,
    _sharedFetch: null,

    getBase() {
        return window.SarkarPath?.base || "/";
    },

    async init(path) {
        if (this.indexManifest) return this.indexManifest;
        if (this._sharedFetch) return this._sharedFetch;

        const finalPath = rel(path);

        this._sharedFetch = (async () => {
            try {
                const res = await fetch(finalPath);
                this.indexManifest = await res.json();

                console.log(
                    "%c✅ Manifest Secured",
                    "color:#10b981;font-weight:bold;"
                );

                return this.indexManifest;
            } catch (e) {
                this._sharedFetch = null;
                return null;
            }
        })();

        return this._sharedFetch;
    },

    async fetchByMaster(id, type) {
        const file = id.endsWith(".json") ? id : `${id}.json`;
        const finalPath = rel(`data/${type}/${file}`);

        const raw = await this._fetchJSON(finalPath);
        if (!raw) return null;

        if (type === "events") {
            return {
                ...raw,
                events: raw.events || (Array.isArray(raw) ? raw : [])
            };
        }

        if (type === "jobsdata") {
            return Array.isArray(raw)
                ? raw
                : (raw.data || raw.rows || [raw]);
        }

        return raw;
    },

    async _fetchJSON(url) {
        try {
            const res = await fetch(url);
            return res.ok ? await res.json() : null;
        } catch {
            return null;
        }
    },

    getAllMasterIds() {
        const m = this.indexManifest;
        if (!m) return [];

        const list =
            m.entries ||
            m.rows ||
            (Array.isArray(m) ? m : []);

        return [...new Set(
            list.map(i => i.master_id || i.id)
        )].filter(Boolean);
    }
};
