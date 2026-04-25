import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useProductStore } from "@/stores/products";

describe("useProductStore", () => {
    beforeEach(() => {
        localStorage.clear();
        setActivePinia(createPinia());
    });

    it("seeds from mockProducts on first load", () => {
        const store = useProductStore();
        expect(store.products.length).toBeGreaterThan(0);
        expect(store.products[0]).toHaveProperty("name");
        expect(store.products[0]).toHaveProperty("sku");
        expect(store.products[0]).toHaveProperty("platform");
    });

    it("writes seed data to localStorage on first load", () => {
        useProductStore();
        const raw = localStorage.getItem("_dummy-products");
        expect(raw).not.toBeNull();
        const parsed = JSON.parse(raw!);
        expect(Array.isArray(parsed)).toBe(true);
        expect(parsed.length).toBeGreaterThan(0);
    });

    it("adds a new product and persists it", () => {
        const store = useProductStore();
        const before = store.products.length;
        store.add({
            name: "Test Game",
            sku: "TG-PC-001",
            platform: "PC",
            genre: "RPG",
            price: 49.99,
            cost: 20.0,
            stock: 100,
            lowStockThreshold: 10,
            status: "active",
            publisher: "Test Pub",
            releaseDate: "2024-01-01",
            description: "A test game.",
            coverUrl: ""
        });
        expect(store.products.length).toBe(before + 1);
        const added = store.products.find((p) => p.sku === "TG-PC-001");
        expect(added).toBeDefined();
        expect(added?.name).toBe("Test Game");
        expect(added?.price).toBe(49.99);
        expect(added?.id).toMatch(/^p\d+$/);
        expect(added?.createdAt).toBeTruthy();
        const raw = localStorage.getItem("_dummy-products");
        expect(raw).toContain("TG-PC-001");
    });

    it("updates an existing product", () => {
        const store = useProductStore();
        const original = store.products[0];
        store.update({ ...original, name: "Renamed Game", price: 99.99 });
        const updated = store.getById(original.id);
        expect(updated?.name).toBe("Renamed Game");
        expect(updated?.price).toBe(99.99);
        expect(updated?.updatedAt).not.toBe(original.updatedAt);
    });

    it("archives a product by setting status to archived", () => {
        const store = useProductStore();
        const active = store.products.find((p) => p.status === "active");
        expect(active).toBeDefined();
        store.archive(active!.id);
        expect(store.getById(active!.id)?.status).toBe("archived");
        expect(localStorage.getItem("_dummy-products")).toContain('"archived"');
    });

    it("getById returns the correct product", () => {
        const store = useProductStore();
        const first = store.products[0];
        const found = store.getById(first.id);
        expect(found?.id).toBe(first.id);
        expect(found?.name).toBe(first.name);
    });

    it("getById returns undefined for an unknown id", () => {
        const store = useProductStore();
        expect(store.getById("no-such-id")).toBeUndefined();
    });

    it("persists across store re-instantiations (simulates page reload)", () => {
        const store1 = useProductStore();
        store1.add({
            name: "Reload Game",
            sku: "RLD-001",
            platform: "PS5",
            genre: "Action",
            price: 59.99,
            cost: 25.0,
            stock: 50,
            lowStockThreshold: 5,
            status: "active",
            publisher: "Persist Co",
            releaseDate: "2024-06-01",
            description: "Persisted.",
            coverUrl: ""
        });
        // Simulate reload: fresh pinia without clearing localStorage
        setActivePinia(createPinia());
        const store2 = useProductStore();
        const found = store2.products.find((p) => p.sku === "RLD-001");
        expect(found).toBeDefined();
        expect(found?.name).toBe("Reload Game");
    });

    it("preserves all existing products when adding a new one", () => {
        const store = useProductStore();
        const countBefore = store.products.length;
        store.add({
            name: "Extra",
            sku: "EXT-001",
            platform: "PC",
            genre: "Strategy",
            price: 29.99,
            cost: 12.0,
            stock: 20,
            lowStockThreshold: 3,
            status: "active",
            publisher: "Extra Pub",
            releaseDate: "2024-01-01",
            description: "",
            coverUrl: ""
        });
        expect(store.products.length).toBe(countBefore + 1);
        expect(store.products.filter((p) => p.sku !== "EXT-001").length).toBe(countBefore);
    });
});
