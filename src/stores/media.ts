import { defineStore } from "pinia";
import { ref } from "vue";
import { mockMediaAssets } from "@/mocks/media";
import type { MediaAsset, AssetType } from "@/types/media";

// NOTE:
// - Fetch this later to: <VITE_API_MEDIA>
const STORAGE_KEY = "_dummy-media";

function loadFromStorage(): MediaAsset[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as MediaAsset[];
    } catch {}
    const seed = mockMediaAssets.map((a) => ({ ...a }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
}

export const useMediaStore = defineStore("media", () => {
    const assets = ref<MediaAsset[]>(loadFromStorage());

    function persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(assets.value));
    }

    function add(file: File, type: AssetType, tags: string[]): MediaAsset {
        const asset: MediaAsset = {
            id: "ma" + Date.now(),
            name: file.name,
            type,
            url: URL.createObjectURL(file),
            size: file.size,
            mimeType: file.type || "application/octet-stream",
            linkedProductIds: [],
            tags,
            uploadedAt: new Date().toISOString()
        };
        assets.value.unshift(asset);
        persist();
        return asset;
    }

    function remove(id: string) {
        assets.value = assets.value.filter((a) => a.id !== id);
        persist();
    }

    return { assets, add, remove };
});
