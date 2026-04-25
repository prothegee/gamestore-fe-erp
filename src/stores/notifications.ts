import { defineStore } from "pinia";
import { ref, computed } from "vue";

// NOTE:
// - Fetch this later to: <VITE_API_ACCOUNT> (notification endpoint)
const STORAGE_KEY = "_dummy-notification";

export type NotifType = "warning" | "info" | "success" | "error";

export interface AppNotification {
    id: number;
    type: NotifType;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const seeds: AppNotification[] = [
    {
        id: 1,
        type: "warning",
        title: "Low Stock",
        message: "Cyberpunk 2077 has only 8 units remaining (threshold: 15).",
        time: new Date(Date.now() - 2 * 60000).toISOString(),
        read: false
    },
    {
        id: 2,
        type: "warning",
        title: "Low Stock",
        message: "Starfield has only 5 units remaining (threshold: 10).",
        time: new Date(Date.now() - 15 * 60000).toISOString(),
        read: false
    },
    {
        id: 3,
        type: "info",
        title: "New Order",
        message: "Order #ord-005 placed by Casey Lin for $130.78.",
        time: new Date(Date.now() - 31 * 60000).toISOString(),
        read: false
    },
    {
        id: 4,
        type: "success",
        title: "Return Refunded",
        message: "Return #ret-001 has been refunded ($54.49) to Sam Okafor.",
        time: new Date(Date.now() - 60 * 60000).toISOString(),
        read: true
    },
    {
        id: 5,
        type: "error",
        title: "Service Degraded",
        message: "Purchase Service (port 9004) is reporting degraded performance.",
        time: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        read: true
    },
    {
        id: 6,
        type: "info",
        title: "PO Confirmed",
        message: "Purchase Order #po-001 confirmed by Bandai Namco Distribution.",
        time: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
        read: true
    },
    {
        id: 7,
        type: "success",
        title: "Sale Event Active",
        message: '"Xbox Weekend Deal" promotion is now live (10% off Xbox titles).',
        time: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
        read: true
    }
];

function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    return `${Math.floor(hrs / 24)} day(s) ago`;
}

function loadFromStorage(): AppNotification[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as AppNotification[];
    } catch {}
    const seed = seeds.map((n) => ({ ...n }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
}

export const useNotificationStore = defineStore("notifications", () => {
    const notifications = ref<AppNotification[]>(loadFromStorage());
    let nextId = notifications.value.reduce((m, n) => Math.max(m, n.id), 0) + 1;

    function persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.value));
    }

    function add(type: NotifType, title: string, message: string) {
        notifications.value.unshift({
            id: nextId++,
            type,
            title,
            message,
            time: new Date().toISOString(),
            read: false
        });
        persist();
    }

    function markRead(id: number) {
        const n = notifications.value.find((x) => x.id === id);
        if (n) {
            n.read = true;
            persist();
        }
    }

    function markAllRead() {
        notifications.value.forEach((n) => (n.read = true));
        persist();
    }

    const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length);

    return { notifications, add, markRead, markAllRead, unreadCount, relativeTime };
});
