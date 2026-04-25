import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useSettingsStore } from "@/stores/settings";

describe("useSettingsStore", () => {
    beforeEach(() => {
        localStorage.clear();
        setActivePinia(createPinia());
    });

    it("loads default system settings when localStorage is empty", () => {
        const store = useSettingsStore();
        expect(store.sys.currency).toBe("USD");
        expect(store.sys.timezone).toBe("America/New_York");
        expect(store.sys.dateFormat).toBe("MM/DD/YYYY");
        expect(store.sys.pageSize).toBe(20);
    });

    it("loads default API endpoints when localStorage is empty", () => {
        const store = useSettingsStore();
        expect(store.api.account).toBe("http://localhost:9001");
        expect(store.api.media).toBe("http://localhost:9002");
        expect(store.api.product).toBe("http://localhost:9003");
        expect(store.api.purchase).toBe("http://localhost:9004");
        expect(store.api.session).toBe("http://localhost:9005");
    });

    it("save() persists settings to localStorage", () => {
        const store = useSettingsStore();
        store.sys.currency = "EUR";
        store.sys.pageSize = 50;
        store.save();
        const raw = localStorage.getItem("_dummy-settings");
        expect(raw).not.toBeNull();
        const parsed = JSON.parse(raw!);
        expect(parsed.sys.currency).toBe("EUR");
        expect(parsed.sys.pageSize).toBe(50);
    });

    it("loads previously saved settings on re-instantiation", () => {
        const store1 = useSettingsStore();
        store1.sys.currency = "EUR";
        store1.sys.dateFormat = "DD/MM/YYYY";
        store1.save();
        setActivePinia(createPinia());
        const store2 = useSettingsStore();
        expect(store2.sys.currency).toBe("EUR");
        expect(store2.sys.dateFormat).toBe("DD/MM/YYYY");
    });

    it("saves and restores API endpoint overrides", () => {
        const store1 = useSettingsStore();
        store1.api.product = "https://api.example.com/products";
        store1.save();
        setActivePinia(createPinia());
        const store2 = useSettingsStore();
        expect(store2.api.product).toBe("https://api.example.com/products");
    });

    describe("formatPrice()", () => {
        it("formats USD prices with $ symbol", () => {
            const store = useSettingsStore();
            store.sys.currency = "USD";
            expect(store.formatPrice(59.99)).toBe("$59.99");
            expect(store.formatPrice(0)).toBe("$0.00");
            expect(store.formatPrice(1234.5)).toBe("$1234.50");
        });

        it("formats EUR prices with € symbol", () => {
            const store = useSettingsStore();
            store.sys.currency = "EUR";
            expect(store.formatPrice(49.99)).toBe("€49.99");
        });

        it("uses currency code as fallback for unknown currencies", () => {
            const store = useSettingsStore();
            store.sys.currency = "GBP";
            expect(store.formatPrice(10)).toBe("GBP 10.00");
        });
    });

    describe("formatDate()", () => {
        const iso = "2024-06-15T00:00:00Z";

        it("formats as MM/DD/YYYY by default", () => {
            const store = useSettingsStore();
            store.sys.dateFormat = "MM/DD/YYYY";
            expect(store.formatDate(iso)).toBe("06/15/2024");
        });

        it("formats as DD/MM/YYYY", () => {
            const store = useSettingsStore();
            store.sys.dateFormat = "DD/MM/YYYY";
            expect(store.formatDate(iso)).toBe("15/06/2024");
        });

        it("formats as YYYY-MM-DD", () => {
            const store = useSettingsStore();
            store.sys.dateFormat = "YYYY-MM-DD";
            expect(store.formatDate(iso)).toBe("2024-06-15");
        });

        it("returns — for empty string", () => {
            const store = useSettingsStore();
            expect(store.formatDate("")).toBe("—");
        });

        it("returns the original value for invalid date strings", () => {
            const store = useSettingsStore();
            expect(store.formatDate("not-a-date")).toBe("not-a-date");
        });
    });
});
