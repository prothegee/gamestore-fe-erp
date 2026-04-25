<template>
    <div class="app-layout" :class="{ 'app-layout--collapsed': collapsed }">
        <aside class="sidebar">
            <div class="sidebar__brand">
                <RouterLink to="/" class="sidebar__logo">
                    <span class="sidebar__logo-icon">GS</span>
                    <span class="sidebar__logo-text">GameStore ERP</span>
                </RouterLink>
                <button class="sidebar__toggle" @click="toggleSidebar">
                    <AppIcon :name="collapsed ? 'chevron-right' : 'chevron-left'" :size="16" />
                </button>
            </div>

            <nav class="sidebar__nav">
                <RouterLink
                    v-for="item in navItems"
                    :key="item.to"
                    :to="item.to"
                    class="sidebar__link"
                    :class="{
                        'sidebar__link--active':
                            route.path === item.to || route.path.startsWith(item.to + '/')
                    }"
                    :title="collapsed ? item.label : undefined"
                >
                    <AppIcon :name="item.icon" :size="18" class="sidebar__link-icon" />
                    <span class="sidebar__link-label">{{ item.label }}</span>
                    <span v-if="item.badge" class="sidebar__badge">{{ item.badge }}</span>
                </RouterLink>
            </nav>

            <div class="sidebar__footer">
                <div class="sidebar__user">
                    <div class="sidebar__avatar">{{ user?.username?.charAt(0).toUpperCase() }}</div>
                    <div class="sidebar__user-info">
                        <span class="sidebar__user-name">{{ user?.username }}</span>
                        <span class="sidebar__user-role">{{ user?.role }}</span>
                    </div>
                </div>
                <button class="sidebar__logout" title="Logout" @click="logout">
                    <AppIcon name="logout" :size="17" />
                </button>
            </div>
        </aside>

        <div class="main-area">
            <header class="topbar">
                <button class="topbar__menu-btn" @click="toggleSidebar">
                    <AppIcon name="menu" :size="20" />
                </button>
                <div class="topbar__right">
                    <RouterLink to="/notifications" class="topbar__notif-btn" title="Notifications">
                        <AppIcon name="notifications" :size="18" />
                    </RouterLink>
                    <span class="topbar__role-badge">{{ user?.role }}</span>
                </div>
            </header>
            <main class="page-content">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterView, RouterLink, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useUiStore } from "@/stores/ui";
import { useNotificationStore } from "@/stores/notifications";
import AppIcon from "@/components/ui/AppIcon.vue";

const authStore = useAuthStore();
const uiStore = useUiStore();
const notifStore = useNotificationStore();
const { user } = storeToRefs(authStore);
const { sidebarCollapsed: collapsed } = storeToRefs(uiStore);
const { toggleSidebar } = uiStore;
const { logout } = authStore;
const route = useRoute();

const navItems = computed(() => {
    const unread = notifStore.unreadCount;
    const base = [
        { to: "/", icon: "dashboard", label: "Dashboard", badge: undefined as string | undefined },
        { to: "/products", icon: "products", label: "Products", badge: undefined },
        { to: "/orders", icon: "orders", label: "Orders", badge: undefined },
        { to: "/customers", icon: "customers", label: "Customers", badge: undefined },
        { to: "/suppliers", icon: "suppliers", label: "Suppliers", badge: undefined },
        { to: "/promotions", icon: "promotions", label: "Promotions", badge: undefined },
        { to: "/reports", icon: "reports", label: "Reports", badge: undefined },
        { to: "/media", icon: "media", label: "Media", badge: undefined },
        {
            to: "/notifications",
            icon: "notifications",
            label: "Notifications",
            badge: unread > 0 ? String(unread) : undefined
        },
        { to: "/settings", icon: "settings", label: "Settings", badge: undefined }
    ];
    if (user.value?.role === "superadmin") {
        base.push({ to: "/admin", icon: "admin", label: "Admin", badge: undefined });
    }
    return base;
});
</script>

<style scoped>
.app-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
    --sb-width: var(--sidebar-width);
}
.app-layout--collapsed {
    --sb-width: var(--sidebar-collapsed-width);
}

/* Sidebar */
.sidebar {
    width: var(--sb-width);
    background: var(--color-primary);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    transition: width var(--transition);
    overflow: hidden;
}

.sidebar__brand {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    height: var(--header-height);
}
.sidebar__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    overflow: hidden;
}
.sidebar__logo-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: var(--color-warm);
    color: var(--color-primary);
    font-weight: 800;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.sidebar__logo-text {
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
}
.app-layout--collapsed .sidebar__logo-text {
    display: none;
}
.app-layout--collapsed .sidebar__logo {
    display: none;
}
.app-layout--collapsed .sidebar__brand {
    justify-content: center;
    padding: 16px 0;
}

.sidebar__toggle {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: rgba(255, 255, 255, 0.7);
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background var(--transition);
}
.sidebar__toggle:hover {
    background: rgba(255, 255, 255, 0.2);
}

.sidebar__nav {
    flex: 1;
    padding: 10px 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
    overflow-x: hidden;
}

.sidebar__link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: var(--border-radius);
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
    font-weight: 500;
    transition:
        background var(--transition),
        color var(--transition);
    white-space: nowrap;
    overflow: hidden;
    position: relative;
}
.sidebar__link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
}
.sidebar__link--active {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    font-weight: 600;
}
.sidebar__link-icon {
    flex-shrink: 0;
}
.sidebar__link-label {
    overflow: hidden;
    text-overflow: ellipsis;
}
.app-layout--collapsed .sidebar__link-label {
    display: none;
}
.app-layout--collapsed .sidebar__link {
    justify-content: center;
    padding-left: 0;
    padding-right: 0;
}
.sidebar__badge {
    margin-left: auto;
    background: var(--color-warning);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 999px;
}
.app-layout--collapsed .sidebar__badge {
    display: none;
}

.sidebar__footer {
    padding: 12px 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;
}
.sidebar__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--color-secondary);
    color: #fff;
    font-weight: 700;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.sidebar__user {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    overflow: hidden;
}
.sidebar__user-info {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.app-layout--collapsed .sidebar__user-info {
    display: none;
}
.sidebar__user-name {
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.sidebar__user-role {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
}
.sidebar__logout {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    display: flex;
    padding: 4px;
    border-radius: 4px;
    flex-shrink: 0;
    transition:
        color var(--transition),
        background var(--transition);
}
.sidebar__logout:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
}
.app-layout--collapsed .sidebar__logout {
    margin: 0 auto;
}

/* Main area */
.main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.topbar {
    height: var(--header-height);
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    flex-shrink: 0;
    box-shadow: var(--shadow-sm);
}
.topbar__menu-btn {
    display: none;
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
}
@media (max-width: 768px) {
    .topbar__menu-btn {
        display: flex;
    }
}
.topbar__right {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-left: auto;
}
.topbar__notif-btn {
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;
    transition: color var(--transition);
}
.topbar__notif-btn:hover {
    color: var(--color-primary);
}
.topbar__role-badge {
    font-size: 11px;
    font-weight: 600;
    background: var(--color-warm);
    color: var(--color-primary);
    padding: 3px 10px;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
}

.page-content {
    flex: 1;
    overflow-y: auto;
    padding: 28px;
}
</style>
