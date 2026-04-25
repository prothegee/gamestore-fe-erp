<template>
    <div>
        <PageHeader title="Admin" :breadcrumbs="[{ label: 'Admin' }]">
            <template #actions>
                <!-- NOTE: tmp hidden -->
                <!-- <button class="btn btn--primary"><AppIcon name="plus" :size="15" /> Add User</button> -->
            </template>
        </PageHeader>

        <div class="card">
            <h3 class="card-title">Staff Accounts</h3>
            <DataTable
                :columns="columns"
                :rows="users"
                :total="users.length"
                :page="1"
                :page-size="20"
            >
                <template #cell-username="{ row }">
                    <div class="user-cell">
                        <div class="user-avatar">
                            {{ (row as StaffUser).username.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                            <span class="user-name">{{ (row as StaffUser).username }}</span>
                            <span class="user-email">{{ (row as StaffUser).email }}</span>
                        </div>
                    </div>
                </template>
                <template #cell-role="{ row }">
                    <span class="role-badge" :class="`role-badge--${(row as StaffUser).role}`">{{
                        (row as StaffUser).role
                    }}</span>
                </template>
                <template #cell-status="{ row }">
                    <StatusBadge :status="(row as StaffUser).active ? 'active' : 'suspended'" />
                </template>
                <template #actions="{ row }">
                    <div class="row-actions">
                        <button class="action-btn" title="Edit">
                            <AppIcon name="edit" :size="15" />
                        </button>
                        <button
                            class="action-btn action-btn--danger"
                            title="Deactivate"
                            @click="deactivate(row as StaffUser)"
                        >
                            <AppIcon name="trash" :size="15" />
                        </button>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import DataTable from "@/components/ui/DataTable.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import { useToastStore } from "@/stores/toast";
import type { RbacRole } from "@/types/common";

const toast = useToastStore();

interface StaffUser {
    id: string;
    username: string;
    email: string;
    role: RbacRole;
    active: boolean;
    createdAt: string;
}

const users = ref<StaffUser[]>([
    {
        id: "u1",
        username: "demouser",
        email: "demo@gamestore.com",
        role: "superadmin",
        active: true,
        createdAt: "2024-01-01"
    },
    {
        id: "u2",
        username: "manager1",
        email: "manager@gamestore.com",
        role: "manager",
        active: true,
        createdAt: "2024-02-15"
    },
    {
        id: "u3",
        username: "staff_alice",
        email: "alice@gamestore.com",
        role: "staff",
        active: true,
        createdAt: "2024-03-01"
    },
    {
        id: "u4",
        username: "staff_bob",
        email: "bob@gamestore.com",
        role: "staff",
        active: false,
        createdAt: "2024-03-10"
    },
    {
        id: "u5",
        username: "viewer_01",
        email: "view@gamestore.com",
        role: "viewer",
        active: true,
        createdAt: "2024-04-20"
    }
]);

const columns = [
    { key: "username", label: "User" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" }
];

function deactivate(u: StaffUser) {
    u.active = false;
    toast.add({ type: "success", message: `User "${u.username}" has been deactivated.` });
}
</script>

<style scoped>
.card {
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    padding: 20px;
    box-shadow: var(--shadow-sm);
}
.card-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
}
.user-cell {
    display: flex;
    align-items: center;
    gap: 10px;
}
.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--color-primary);
    color: var(--color-warm);
    font-weight: 700;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.user-name {
    display: block;
    font-weight: 600;
    font-size: 13px;
}
.user-email {
    display: block;
    font-size: 11px;
    color: var(--color-text-muted);
}
.role-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 999px;
    text-transform: uppercase;
}
.role-badge--superadmin {
    background: var(--color-primary);
    color: #fff;
}
.role-badge--manager {
    background: var(--color-secondary);
    color: #fff;
}
.role-badge--staff {
    background: var(--color-warm);
    color: var(--color-primary);
}
.role-badge--viewer {
    background: var(--color-border-light);
    color: var(--color-text-secondary);
}
.row-actions {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
}
.action-btn {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    padding: 5px;
    color: var(--color-text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all var(--transition);
}
.action-btn:hover {
    border-color: var(--color-secondary);
    color: var(--color-secondary);
}
.action-btn--danger:hover {
    border-color: var(--color-danger);
    color: var(--color-danger);
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
.btn--primary {
    background: var(--color-primary);
    color: #fff;
}
.btn--primary:hover {
    opacity: 0.88;
}
</style>
