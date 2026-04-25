<template>
    <div>
        <PageHeader title="Customers" :breadcrumbs="[{ label: 'Customers' }]" />

        <div class="filters">
            <SearchBar v-model="search" placeholder="Search by name or email…" />
            <select v-model="filterStatus" class="filter-select">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="flagged">Flagged</option>
            </select>
        </div>

        <div class="card">
            <DataTable
                :columns="columns"
                :rows="filtered"
                :total="filtered.length"
                :page="1"
                :page-size="20"
            >
                <template #cell-name="{ row }">
                    <div class="customer-name-cell">
                        <div class="customer-avatar">{{ (row as Customer).name.charAt(0) }}</div>
                        <div>
                            <span class="customer-name">{{ (row as Customer).name }}</span>
                            <span class="customer-email">{{ (row as Customer).email }}</span>
                        </div>
                    </div>
                </template>
                <template #cell-lifetimeValue="{ row }">
                    <strong>${{ (row as Customer).lifetimeValue.toFixed(2) }}</strong>
                </template>
                <template #cell-returnRate="{ row }">
                    <span :class="{ 'rate-high': (row as Customer).returnRate > 0.1 }">
                        {{ ((row as Customer).returnRate * 100).toFixed(0) }}%
                    </span>
                </template>
                <template #cell-status="{ row }">
                    <StatusBadge :status="(row as Customer).status" />
                </template>
                <template #cell-tags="{ row }">
                    <div class="tags">
                        <span v-for="tag in (row as Customer).tags" :key="tag" class="tag">{{
                            tag
                        }}</span>
                    </div>
                </template>
                <template #actions="{ row }">
                    <div class="row-actions">
                        <button
                            class="action-btn"
                            title="Edit"
                            @click="editCustomer(row as Customer)"
                        >
                            <AppIcon name="edit" :size="15" />
                        </button>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import SearchBar from "@/components/ui/SearchBar.vue";
import DataTable from "@/components/ui/DataTable.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import { mockCustomers } from "@/mocks/customers";
import type { Customer } from "@/types/customer";

const search = ref("");
const filterStatus = ref("");

const columns = [
    { key: "name", label: "Customer", sortable: true },
    { key: "totalOrders", label: "Orders", sortable: true },
    { key: "lifetimeValue", label: "LTV", sortable: true },
    { key: "returnRate", label: "Return Rate", sortable: true },
    { key: "status", label: "Status" },
    { key: "tags", label: "Tags" }
];

const filtered = computed(() => {
    let list = [...mockCustomers];
    if (search.value) {
        const q = search.value.toLowerCase();
        list = list.filter(
            (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
        );
    }
    if (filterStatus.value) list = list.filter((c) => c.status === filterStatus.value);
    return list;
});

function editCustomer(_c: Customer) {
    // TODO: open edit modal
}
</script>

<style scoped>
.filters {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}
.filter-select {
    height: 38px;
    padding: 0 12px;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background: var(--color-surface);
    font-size: 13px;
    outline: none;
}
.card {
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
}
.customer-name-cell {
    display: flex;
    align-items: center;
    gap: 10px;
}
.customer-avatar {
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
.customer-name {
    display: block;
    font-weight: 600;
    font-size: 13px;
}
.customer-email {
    display: block;
    font-size: 11px;
    color: var(--color-text-muted);
}
.rate-high {
    color: var(--color-danger);
    font-weight: 700;
}
.tags {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
}
.tag {
    background: var(--color-warm);
    color: var(--color-primary);
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 999px;
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
</style>
