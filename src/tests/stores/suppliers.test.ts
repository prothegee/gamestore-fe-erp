import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useSupplierStore } from "@/stores/suppliers";

describe("useSupplierStore", () => {
    beforeEach(() => {
        localStorage.clear();
        setActivePinia(createPinia());
    });

    it("seeds suppliers and purchase orders on first load", () => {
        const store = useSupplierStore();
        expect(store.suppliers.length).toBeGreaterThan(0);
        expect(store.purchaseOrders.length).toBeGreaterThan(0);
    });

    it("writes seeds to localStorage on first load", () => {
        useSupplierStore();
        const raw = localStorage.getItem("_dummy-suppliers");
        expect(raw).not.toBeNull();
        const parsed = JSON.parse(raw!);
        expect(Array.isArray(parsed.suppliers)).toBe(true);
        expect(Array.isArray(parsed.pos)).toBe(true);
    });

    it("addSupplier appends a new supplier", () => {
        const store = useSupplierStore();
        const before = store.suppliers.length;
        store.addSupplier({
            name: "NewCo Dist",
            contactName: "Jane Doe",
            email: "jane@newco.com",
            phone: "+1-555-0001",
            country: "USA",
            leadTimeDays: 7,
            fillRate: 0.98,
            defectRate: 0.01
        });
        expect(store.suppliers.length).toBe(before + 1);
        const added = store.suppliers.find((s) => s.name === "NewCo Dist");
        expect(added).toBeDefined();
        expect(added?.id).toMatch(/^s\d+$/);
        expect(added?.createdAt).toBeTruthy();
    });

    it("addSupplier persists to localStorage", () => {
        const store = useSupplierStore();
        store.addSupplier({
            name: "Persist Dist",
            contactName: "Bob",
            email: "b@dist.com",
            phone: "+1-000-0000",
            country: "UK",
            leadTimeDays: 10,
            fillRate: 0.95,
            defectRate: 0.02
        });
        const raw = localStorage.getItem("_dummy-suppliers");
        expect(raw).toContain("Persist Dist");
    });

    it("updateSupplier modifies an existing supplier", () => {
        const store = useSupplierStore();
        const original = store.suppliers[0];
        store.updateSupplier({ ...original, contactName: "Updated Contact", leadTimeDays: 21 });
        const updated = store.suppliers.find((s) => s.id === original.id);
        expect(updated?.contactName).toBe("Updated Contact");
        expect(updated?.leadTimeDays).toBe(21);
    });

    it("addPO prepends a new purchase order with draft status", () => {
        const store = useSupplierStore();
        const before = store.purchaseOrders.length;
        store.addPO({
            supplierId: "s1",
            supplierName: "Bandai Namco Distribution",
            items: [
                {
                    productId: "p1",
                    productName: "Elden Ring",
                    sku: "ER-PS5-001",
                    quantity: 20,
                    unitCost: 30,
                    total: 600
                }
            ],
            subtotal: 600,
            status: "draft",
            expectedAt: "2024-08-01T00:00:00Z"
        });
        expect(store.purchaseOrders.length).toBe(before + 1);
        const po = store.purchaseOrders[0];
        expect(po.status).toBe("draft");
        expect(po.subtotal).toBe(600);
        expect(po.id).toMatch(/^po-\d+$/);
    });

    it("updatePOStatus changes the status of a purchase order", () => {
        const store = useSupplierStore();
        const po = store.purchaseOrders[0];
        store.updatePOStatus(po.id, "confirmed");
        expect(store.purchaseOrders.find((p) => p.id === po.id)?.status).toBe("confirmed");
    });

    it("updatePOStatus persists the change", () => {
        const store = useSupplierStore();
        const po = store.purchaseOrders[0];
        store.updatePOStatus(po.id, "received");
        const raw = localStorage.getItem("_dummy-suppliers");
        expect(raw).toContain('"received"');
    });

    it("persists across store re-instantiations", () => {
        const store1 = useSupplierStore();
        store1.addSupplier({
            name: "Reload Supplier",
            contactName: "R",
            email: "r@r.com",
            phone: "+0",
            country: "JP",
            leadTimeDays: 5,
            fillRate: 0.99,
            defectRate: 0.005
        });
        setActivePinia(createPinia());
        const store2 = useSupplierStore();
        expect(store2.suppliers.find((s) => s.name === "Reload Supplier")).toBeDefined();
    });
});
