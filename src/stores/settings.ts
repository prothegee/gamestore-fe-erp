import { defineStore } from "pinia";
import { reactive } from "vue";

// NOTE:
// - Fetch this later to: <VITE_API_ACCOUNT> / <VITE_API_PRODUCT> etc.
const STORAGE_KEY = "_dummy-settings";

interface SysSettings {
    currency: string;
    timezone: string;
    dateFormat: string;
    pageSize: number;
}

interface ApiSettings {
    account: string;
    media: string;
    product: string;
    purchase: string;
    session: string;
}

interface Stored {
    sys?: Partial<SysSettings>;
    api?: Partial<ApiSettings>;
}

function load(): Stored | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Stored) : null;
    } catch {
        return null;
    }
}

export const useSettingsStore = defineStore("settings", () => {
    const saved = load();

    const sys = reactive<SysSettings>({
        currency: saved?.sys?.currency ?? "USD",
        timezone: saved?.sys?.timezone ?? "America/New_York",
        dateFormat: saved?.sys?.dateFormat ?? "MM/DD/YYYY",
        pageSize: saved?.sys?.pageSize ?? 20
    });

    const api = reactive<ApiSettings>({
        account:
            saved?.api?.account ??
            String(import.meta.env.VITE_API_ACCOUNT ?? "http://localhost:9001"),
        media:
            saved?.api?.media ?? String(import.meta.env.VITE_API_MEDIA ?? "http://localhost:9002"),
        product:
            saved?.api?.product ??
            String(import.meta.env.VITE_API_PRODUCT ?? "http://localhost:9003"),
        purchase:
            saved?.api?.purchase ??
            String(import.meta.env.VITE_API_PURCHASE ?? "http://localhost:9004"),
        session:
            saved?.api?.session ??
            String(import.meta.env.VITE_API_SESSION ?? "http://localhost:9005")
    });

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ sys: { ...sys }, api: { ...api } }));
    }

    function formatPrice(amount: number): string {
        const symbols: Record<string, string> = { USD: "$", EUR: "€" };
        const symbol = symbols[sys.currency] ?? sys.currency + " ";
        return `${symbol}${amount.toFixed(2)}`;
    }

    function formatDate(iso: string): string {
        if (!iso) return "—";
        const d = new Date(iso);
        if (isNaN(d.getTime())) return iso;
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const yyyy = String(d.getFullYear());
        if (sys.dateFormat === "DD/MM/YYYY") return `${dd}/${mm}/${yyyy}`;
        if (sys.dateFormat === "YYYY-MM-DD") return `${yyyy}-${mm}-${dd}`;
        return `${mm}/${dd}/${yyyy}`;
    }

    return { sys, api, save, formatPrice, formatDate };
});
