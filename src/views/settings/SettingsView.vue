<template>
    <div>
        <PageHeader title="Settings & Configuration" :breadcrumbs="[{ label: 'Settings' }]" />

        <div class="settings-grid">
            <div class="settings-sidebar">
                <button
                    v-for="section in sections"
                    :key="section.id"
                    class="settings-nav-btn"
                    :class="{ 'settings-nav-btn--active': active === section.id }"
                    @click="active = section.id"
                >
                    <AppIcon :name="section.icon" :size="16" />
                    {{ section.label }}
                </button>
            </div>

            <div class="settings-body">
                <!-- System Settings -->
                <div v-if="active === 'system'" class="card">
                    <h3 class="card-title">System Settings</h3>
                    <div class="settings-form">
                        <FormInput
                            v-model="settings.sys.currency"
                            label="Default Currency"
                            type="select"
                            :options="[
                                { value: 'USD', label: 'USD – US Dollar' },
                                { value: 'EUR', label: 'EUR – Euro' }
                            ]"
                        />
                        <FormInput
                            v-model="settings.sys.timezone"
                            label="Timezone"
                            type="select"
                            :options="[
                                { value: 'America/New_York', label: 'Eastern (ET)' },
                                { value: 'America/Chicago', label: 'Central (CT)' },
                                { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
                                { value: 'Europe/London', label: 'London (GMT)' },
                                { value: 'Asia/Tokyo', label: 'Tokyo (JST)' }
                            ]"
                        />
                        <FormInput
                            v-model="settings.sys.dateFormat"
                            label="Date Format"
                            type="select"
                            :options="[
                                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                            ]"
                        />
                        <FormInput
                            v-model="settings.sys.pageSize"
                            label="Page Size (rows)"
                            type="number"
                            min="10"
                            max="100"
                            step="10"
                            hint="Applied to all data tables on next page load."
                        />
                        <div class="preview-bar">
                            <span class="preview-label">Preview:</span>
                            <span>{{ settings.formatPrice(59.99) }}</span>
                            <span>&nbsp;&middot;&nbsp;</span>
                            <span>{{ settings.formatDate("2024-06-15T00:00:00Z") }}</span>
                        </div>
                        <button class="btn btn--primary" @click="saveSystem">Save Changes</button>
                    </div>
                </div>

                <!-- API Endpoints (debug only) -->
                <div v-if="active === 'api'" class="card">
                    <h3 class="card-title">
                        API Endpoint Manager <span class="debug-badge">debug only</span>
                    </h3>
                    <div class="settings-form">
                        <FormInput
                            v-model="settings.api.account"
                            label="Account Service"
                            placeholder="http://localhost:9001"
                        />
                        <FormInput
                            v-model="settings.api.media"
                            label="Media Service"
                            placeholder="http://localhost:9002"
                        />
                        <FormInput
                            v-model="settings.api.product"
                            label="Product Service"
                            placeholder="http://localhost:9003"
                        />
                        <FormInput
                            v-model="settings.api.purchase"
                            label="Purchase Service"
                            placeholder="http://localhost:9004"
                        />
                        <FormInput
                            v-model="settings.api.session"
                            label="Session Service"
                            placeholder="http://localhost:9005"
                        />
                        <button class="btn btn--primary" @click="saveApi">Apply</button>
                    </div>
                </div>

                <!-- Roles -->
                <div v-if="active === 'roles'" class="card">
                    <h3 class="card-title">Role & Permission Matrix</h3>
                    <div class="table-scroll">
                        <table class="perm-table">
                            <thead>
                                <tr>
                                    <th>Module</th>
                                    <th v-for="role in roles" :key="role">{{ role }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="module in modules" :key="module.name">
                                    <td class="module-name">{{ module.name }}</td>
                                    <td v-for="role in roles" :key="role" class="perm-cell">
                                        <AppIcon
                                            v-if="hasAccess(role, module.minRole)"
                                            name="check"
                                            :size="15"
                                            class="perm-check"
                                        />
                                        <AppIcon v-else name="x" :size="15" class="perm-x" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Audit log -->
                <div v-if="active === 'audit'" class="card">
                    <h3 class="card-title">Audit Log</h3>
                    <div class="audit-list">
                        <div v-for="entry in auditLog" :key="entry.id" class="audit-row">
                            <span class="audit-time">{{ entry.time }}</span>
                            <span class="audit-actor">{{ entry.actor }}</span>
                            <span class="audit-action" :class="`audit-action--${entry.type}`">{{
                                entry.action
                            }}</span>
                            <span class="audit-detail">{{ entry.detail }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import FormInput from "@/components/ui/FormInput.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import { useToastStore } from "@/stores/toast";
import { useSettingsStore } from "@/stores/settings";
import type { RbacRole } from "@/types/common";

const toast = useToastStore();
const settings = useSettingsStore();
const active = ref("system");

const sections = [
    { id: "system", icon: "settings", label: "System" },
    { id: "api", icon: "refresh", label: "API Endpoints" },
    { id: "roles", icon: "admin", label: "Roles & Permissions" },
    { id: "audit", icon: "eye", label: "Audit Log" }
];

function saveSystem() {
    settings.save();
    toast.add({ type: "success", message: "System settings saved." });
}

function saveApi() {
    settings.save();
    toast.add({ type: "success", message: "API endpoints saved. Reload to apply." });
}

const roles: RbacRole[] = ["superadmin", "manager", "staff", "viewer"];
const roleOrder: RbacRole[] = ["viewer", "staff", "manager", "superadmin"];
const modules = [
    { name: "Dashboard", minRole: "viewer" as RbacRole },
    { name: "Products", minRole: "staff" as RbacRole },
    { name: "Orders", minRole: "staff" as RbacRole },
    { name: "Customers", minRole: "staff" as RbacRole },
    { name: "Suppliers", minRole: "manager" as RbacRole },
    { name: "Promotions", minRole: "manager" as RbacRole },
    { name: "Reports", minRole: "manager" as RbacRole },
    { name: "Settings", minRole: "manager" as RbacRole },
    { name: "Admin", minRole: "superadmin" as RbacRole }
];

function hasAccess(role: RbacRole, minRole: RbacRole) {
    return roleOrder.indexOf(role) >= roleOrder.indexOf(minRole);
}

const auditLog = [
    {
        id: 1,
        time: "2024-06-15 16:32",
        actor: "demouser",
        action: "update",
        type: "edit",
        detail: "Updated order #ord-003 status to processing"
    },
    {
        id: 2,
        time: "2024-06-15 15:44",
        actor: "demouser",
        action: "create",
        type: "create",
        detail: "Created purchase order #po-003"
    },
    {
        id: 3,
        time: "2024-06-15 14:20",
        actor: "demouser",
        action: "update",
        type: "edit",
        detail: "Updated product p2 stock count"
    },
    {
        id: 4,
        time: "2024-06-15 12:05",
        actor: "demouser",
        action: "delete",
        type: "delete",
        detail: "Archived product Age of Empires IV"
    },
    {
        id: 5,
        time: "2024-06-14 09:18",
        actor: "demouser",
        action: "create",
        type: "create",
        detail: "Created discount code VIP50"
    }
];
</script>

<style scoped>
.settings-grid {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 20px;
}
@media (max-width: 768px) {
    .settings-grid {
        grid-template-columns: 1fr;
    }
}
.settings-sidebar {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.settings-nav-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--border-radius);
    font-size: 13px;
    font-weight: 500;
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    text-align: left;
    transition:
        background var(--transition),
        color var(--transition);
}
.settings-nav-btn:hover {
    background: var(--color-surface);
    color: var(--color-text-primary);
}
.settings-nav-btn--active {
    background: var(--color-primary);
    color: #fff;
    font-weight: 600;
}
.settings-body {
    min-width: 0;
}
.card {
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    padding: 24px;
    box-shadow: var(--shadow-sm);
}
.card-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}
.debug-badge {
    font-size: 10px;
    font-weight: 600;
    background: var(--color-warning-bg);
    color: var(--color-warning);
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid var(--color-warning);
}
.settings-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 480px;
}
.preview-bar {
    font-size: 12px;
    color: var(--color-text-secondary);
    background: var(--color-surface-2);
    padding: 8px 12px;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    gap: 4px;
}
.preview-label {
    font-weight: 600;
    margin-right: 4px;
}
.btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 20px;
    border-radius: var(--border-radius);
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    align-self: flex-start;
}
.btn--primary {
    background: var(--color-primary);
    color: #fff;
}
.btn--primary:hover {
    opacity: 0.88;
}

.table-scroll {
    overflow-x: auto;
}
.perm-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    min-width: 480px;
}
.perm-table th {
    padding: 10px 14px;
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    border-bottom: 2px solid var(--color-border-light);
}
.perm-table th:first-child {
    text-align: left;
}
.perm-table td {
    padding: 10px 14px;
    border-bottom: 1px solid var(--color-border-light);
    text-align: center;
}
.module-name {
    text-align: left !important;
    font-weight: 600;
}
.perm-check {
    color: var(--color-success);
}
.perm-x {
    color: var(--color-border);
}

.audit-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.audit-row {
    display: flex;
    gap: 10px;
    font-size: 12px;
    padding: 8px;
    border-radius: var(--border-radius);
    background: var(--color-surface-2);
    flex-wrap: wrap;
}
.audit-time {
    color: var(--color-text-muted);
    font-family: monospace;
    flex-shrink: 0;
    min-width: 120px;
}
.audit-actor {
    font-weight: 700;
    flex-shrink: 0;
    min-width: 70px;
}
.audit-action {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 999px;
    text-transform: uppercase;
    flex-shrink: 0;
    align-self: center;
}
.audit-action--create {
    background: #c6f6d5;
    color: #276749;
}
.audit-action--edit {
    background: #bee3f8;
    color: #2a69ac;
}
.audit-action--delete {
    background: #fed7d7;
    color: #9b2c2c;
}
.audit-detail {
    color: var(--color-text-secondary);
    min-width: 0;
}
</style>
