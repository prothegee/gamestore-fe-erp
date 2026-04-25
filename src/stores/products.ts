import { defineStore } from "pinia";
import { ref } from "vue";
import { mockProducts } from "@/mocks/products";
import type { Product } from "@/types/product";

// NOTE:
// - Fetch this later to: <VITE_API_PRODUCT>
const STORAGE_KEY = "_dummy-products";

function loadFromStorage(): Product[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as Product[];
    } catch {}
    const seed = mockProducts.map((p) => ({ ...p }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
}

export const useProductStore = defineStore("products", () => {
    const products = ref<Product[]>(loadFromStorage());

    function persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value));
    }

    function add(draft: Omit<Product, "id" | "createdAt" | "updatedAt">) {
        const now = new Date().toISOString();
        products.value.push({
            ...draft,
            id: "p" + Date.now(),
            createdAt: now,
            updatedAt: now
        } as Product);
        persist();
    }

    function update(p: Product) {
        const i = products.value.findIndex((x) => x.id === p.id);
        if (i !== -1) {
            products.value[i] = { ...p, updatedAt: new Date().toISOString() };
            persist();
        }
    }

    function archive(id: string) {
        const p = products.value.find((x) => x.id === id);
        if (p) {
            p.status = "archived";
            p.updatedAt = new Date().toISOString();
            persist();
        }
    }

    function getById(id: string): Product | undefined {
        return products.value.find((p) => p.id === id);
    }

    return { products, add, update, archive, getById };
});
