import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useMediaStore } from "@/stores/media";

vi.stubGlobal("URL", {
    createObjectURL: vi.fn(() => "blob:mock-url-" + Date.now()),
    revokeObjectURL: vi.fn()
});

describe("useMediaStore", () => {
    beforeEach(() => {
        localStorage.clear();
        setActivePinia(createPinia());
    });

    it("seeds from mockMediaAssets on first load", () => {
        const store = useMediaStore();
        expect(store.assets.length).toBeGreaterThan(0);
        expect(store.assets[0]).toHaveProperty("name");
        expect(store.assets[0]).toHaveProperty("type");
        expect(store.assets[0]).toHaveProperty("url");
    });

    it("writes seeds to localStorage on first load", () => {
        useMediaStore();
        const raw = localStorage.getItem("_dummy-media");
        expect(raw).not.toBeNull();
        const parsed = JSON.parse(raw!);
        expect(Array.isArray(parsed)).toBe(true);
    });

    it("add() inserts a new asset at the front of the list", () => {
        const store = useMediaStore();
        const before = store.assets.length;
        const file = new File(["data"], "cover-art.jpg", { type: "image/jpeg" });
        const asset = store.add(file, "cover", ["RPG", "PS5"]);
        expect(store.assets.length).toBe(before + 1);
        expect(store.assets[0].id).toBe(asset.id);
        expect(store.assets[0].name).toBe("cover-art.jpg");
        expect(store.assets[0].type).toBe("cover");
        expect(store.assets[0].tags).toEqual(["RPG", "PS5"]);
        expect(store.assets[0].mimeType).toBe("image/jpeg");
        expect(store.assets[0].size).toBe(file.size);
    });

    it("add() assigns an id prefixed with ma", () => {
        const store = useMediaStore();
        const file = new File(["x"], "thumb.png", { type: "image/png" });
        const asset = store.add(file, "screenshot", []);
        expect(asset.id).toMatch(/^ma\d+$/);
    });

    it("add() uses URL.createObjectURL for the url", () => {
        const store = useMediaStore();
        const file = new File(["y"], "vid.mp4", { type: "video/mp4" });
        const asset = store.add(file, "trailer", []);
        expect(asset.url).toContain("blob:mock-url");
    });

    it("add() persists the new asset to localStorage", () => {
        const store = useMediaStore();
        const file = new File(["z"], "banner.jpg", { type: "image/jpeg" });
        store.add(file, "banner", ["sale"]);
        const raw = localStorage.getItem("_dummy-media");
        expect(raw).toContain("banner.jpg");
    });

    it("remove() deletes an asset by id", () => {
        const store = useMediaStore();
        const before = store.assets.length;
        const idToRemove = store.assets[0].id;
        store.remove(idToRemove);
        expect(store.assets.length).toBe(before - 1);
        expect(store.assets.find((a) => a.id === idToRemove)).toBeUndefined();
    });

    it("remove() persists the deletion to localStorage", () => {
        const store = useMediaStore();
        const { id, name } = store.assets[0];
        store.remove(id);
        const raw = localStorage.getItem("_dummy-media");
        expect(raw).not.toContain(name);
    });

    it("remove() is a no-op for an unknown id", () => {
        const store = useMediaStore();
        const before = store.assets.length;
        store.remove("nonexistent-id");
        expect(store.assets.length).toBe(before);
    });

    it("persists across store re-instantiations", () => {
        const store1 = useMediaStore();
        const file = new File(["data"], "reload-test.jpg", { type: "image/jpeg" });
        store1.add(file, "cover", ["test"]);
        setActivePinia(createPinia());
        const store2 = useMediaStore();
        expect(store2.assets.find((a) => a.name === "reload-test.jpg")).toBeDefined();
    });
});
