<template>
    <div>
        <PageHeader title="Notifications" :breadcrumbs="[{ label: 'Notifications' }]">
            <template #actions>
                <button class="btn btn--ghost" @click="notifStore.markAllRead()">
                    Mark all read
                </button>
            </template>
        </PageHeader>

        <div v-if="notifStore.notifications.length === 0" class="empty-state">
            <AppIcon name="notifications" :size="32" class="empty-icon" />
            <p>No notifications yet.</p>
        </div>

        <div v-else class="notif-list">
            <div
                v-for="n in notifStore.notifications"
                :key="n.id"
                class="notif-row"
                :class="{ 'notif-row--unread': !n.read }"
                @click="notifStore.markRead(n.id)"
            >
                <div class="notif-icon" :class="`notif-icon--${n.type}`">
                    <AppIcon :name="iconMap[n.type]" :size="16" />
                </div>
                <div class="notif-body">
                    <span class="notif-title">{{ n.title }}</span>
                    <span class="notif-msg">{{ n.message }}</span>
                </div>
                <div class="notif-meta">
                    <span class="notif-time">{{ notifStore.relativeTime(n.time) }}</span>
                    <span v-if="!n.read" class="notif-dot" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import PageHeader from "@/components/ui/PageHeader.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import { useNotificationStore } from "@/stores/notifications";
import type { NotifType } from "@/stores/notifications";

const notifStore = useNotificationStore();

const iconMap: Record<NotifType, string> = {
    warning: "alert",
    info: "notifications",
    success: "check",
    error: "x"
};
</script>

<style scoped>
.notif-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.notif-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    padding: 16px;
    cursor: pointer;
    transition: background var(--transition);
}
.notif-row:hover {
    background: var(--color-surface-2);
}
.notif-row--unread {
    border-left: 3px solid var(--color-secondary);
}
.notif-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.notif-icon--warning {
    background: var(--color-warning-bg);
    color: var(--color-warning);
}
.notif-icon--info {
    background: var(--color-info-bg);
    color: var(--color-secondary);
}
.notif-icon--success {
    background: var(--color-success-bg);
    color: var(--color-success);
}
.notif-icon--error {
    background: var(--color-error-bg);
    color: var(--color-danger);
}
.notif-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.notif-title {
    font-weight: 700;
    font-size: 13px;
}
.notif-msg {
    font-size: 12px;
    color: var(--color-text-secondary);
    line-height: 1.5;
}
.notif-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
}
.notif-time {
    font-size: 11px;
    color: var(--color-text-muted);
    white-space: nowrap;
}
.notif-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-secondary);
}
.empty-state {
    text-align: center;
    padding: 60px;
    color: var(--color-text-muted);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}
.empty-icon {
    opacity: 0.3;
}
.btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 16px;
    border-radius: var(--border-radius);
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
}
.btn--ghost {
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
}
.btn--ghost:hover {
    opacity: 0.88;
}
</style>
