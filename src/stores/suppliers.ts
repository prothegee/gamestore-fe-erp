import { defineStore } from "pinia";
import { ref } from "vue";
import { mockSuppliers, mockPurchaseOrders } from "@/mocks/suppliers";
import type { Supplier, PurchaseOrder } from "@/types/supplier";

// NOTE:
// - Fetch this later to: <VITE_API_PRODUCT> (supplier/PO endpoints)
const STORAGE_KEY = "_dummy-suppliers";

interface StoredSuppliers {
    suppliers: Supplier[];
    pos: PurchaseOrder[];
}

function loadFromStorage(): StoredSuppliers {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as StoredSuppliers;
    } catch {}
    const seed: StoredSuppliers = {
        suppliers: mockSuppliers.map((s) => ({ ...s })),
        pos: mockPurchaseOrders.map((p) => ({ ...p }))
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
}

export const useSupplierStore = defineStore("suppliers", () => {
    const stored = loadFromStorage();
    const suppliers = ref<Supplier[]>(stored.suppliers);
    const purchaseOrders = ref<PurchaseOrder[]>(stored.pos);

    function persist() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ suppliers: suppliers.value, pos: purchaseOrders.value })
        );
    }

    function addSupplier(draft: Omit<Supplier, "id" | "createdAt">) {
        suppliers.value.push({
            ...draft,
            id: "s" + Date.now(),
            createdAt: new Date().toISOString()
        });
        persist();
    }

    function updateSupplier(s: Supplier) {
        const i = suppliers.value.findIndex((x) => x.id === s.id);
        if (i !== -1) {
            suppliers.value[i] = s;
            persist();
        }
    }

    function addPO(draft: Omit<PurchaseOrder, "id" | "createdAt" | "updatedAt">) {
        const now = new Date().toISOString();
        purchaseOrders.value.unshift({
            ...draft,
            id: "po-" + Date.now(),
            createdAt: now,
            updatedAt: now
        });
        persist();
    }

    function updatePOStatus(id: string, status: PurchaseOrder["status"]) {
        const po = purchaseOrders.value.find((x) => x.id === id);
        if (po) {
            po.status = status;
            po.updatedAt = new Date().toISOString();
            persist();
        }
    }

    return { suppliers, purchaseOrders, addSupplier, updateSupplier, addPO, updatePOStatus };
});
