import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useNotificationStore } from "@/stores/notifications";

describe("useNotificationStore", () => {
    beforeEach(() => {
        localStorage.clear();
        setActivePinia(createPinia());
    });

    it("seeds with default notifications on first load", () => {
        const store = useNotificationStore();
        expect(store.notifications.length).toBeGreaterThan(0);
        expect(store.notifications[0]).toHaveProperty("type");
        expect(store.notifications[0]).toHaveProperty("title");
        expect(store.notifications[0]).toHaveProperty("read");
    });

    it("writes seeds to localStorage on first load", () => {
        useNotificationStore();
        const raw = localStorage.getItem("_dummy-notification");
        expect(raw).not.toBeNull();
        const parsed = JSON.parse(raw!);
        expect(Array.isArray(parsed)).toBe(true);
    });

    it("adds a new notification at the top of the list", () => {
        const store = useNotificationStore();
        const before = store.notifications.length;
        store.add("success", "Test Title", "Test message body.");
        expect(store.notifications.length).toBe(before + 1);
        expect(store.notifications[0].title).toBe("Test Title");
        expect(store.notifications[0].message).toBe("Test message body.");
        expect(store.notifications[0].type).toBe("success");
        expect(store.notifications[0].read).toBe(false);
    });

    it("new notifications have unique incrementing ids", () => {
        const store = useNotificationStore();
        store.add("info", "A", "msg A");
        store.add("info", "B", "msg B");
        const ids = store.notifications.map((n) => n.id);
        const unique = new Set(ids);
        expect(unique.size).toBe(ids.length);
    });

    it("persists added notifications to localStorage", () => {
        const store = useNotificationStore();
        store.add("warning", "Stock Alert", "Only 3 units left.");
        const raw = localStorage.getItem("_dummy-notification");
        expect(raw).toContain("Stock Alert");
        expect(raw).toContain("Only 3 units left.");
    });

    it("markRead sets a notification to read", () => {
        const store = useNotificationStore();
        store.add("info", "Unread", "Will be marked read.");
        const added = store.notifications[0];
        expect(added.read).toBe(false);
        store.markRead(added.id);
        expect(store.notifications.find((n) => n.id === added.id)?.read).toBe(true);
    });

    it("markAllRead sets every notification to read", () => {
        const store = useNotificationStore();
        store.add("warning", "W1", "m1");
        store.add("error", "W2", "m2");
        store.markAllRead();
        expect(store.notifications.every((n) => n.read)).toBe(true);
        expect(store.unreadCount).toBe(0);
    });

    it("unreadCount reflects the number of unread notifications", () => {
        const store = useNotificationStore();
        const initialUnread = store.unreadCount;
        store.add("info", "New1", "msg");
        store.add("info", "New2", "msg");
        expect(store.unreadCount).toBe(initialUnread + 2);
        store.markRead(store.notifications[0].id);
        expect(store.unreadCount).toBe(initialUnread + 1);
    });

    it("relativeTime returns a human-readable string for ISO timestamps", () => {
        const store = useNotificationStore();
        const justNow = new Date().toISOString();
        expect(store.relativeTime(justNow)).toBe("just now");

        const tenMinsAgo = new Date(Date.now() - 10 * 60000).toISOString();
        expect(store.relativeTime(tenMinsAgo)).toBe("10 min ago");

        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60000).toISOString();
        expect(store.relativeTime(twoHoursAgo)).toBe("2 hr ago");
    });

    it("persists across store re-instantiations", () => {
        const store1 = useNotificationStore();
        store1.add("success", "Reload Test", "This should survive a reload.");
        setActivePinia(createPinia());
        const store2 = useNotificationStore();
        expect(store2.notifications.find((n) => n.title === "Reload Test")).toBeDefined();
    });
});
