<template>
    <div>
        <PageHeader title="Orders" :breadcrumbs="[{ label: 'Orders' }]" />

        <div class="filters">
            <SearchBar v-model="search" placeholder="Search by order ID or customer…" />
            <select v-model="filterStatus" class="filter-select">
                <option value="">All Statuses</option>
                <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
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
                <template #cell-id="{ row }">
                    <span class="order-id">{{ (row as Order).id }}</span>
                </template>
                <template #cell-total="{ row }">
                    <strong>${{ (row as Order).total.toFixed(2) }}</strong>
                </template>
                <template #cell-status="{ row }">
                    <StatusBadge :status="(row as Order).status" />
                </template>
                <template #cell-createdAt="{ row }">
                    {{ formatDate((row as Order).createdAt) }}
                </template>
                <template #actions="{ row }">
                    <div class="row-actions">
                        <RouterLink
                            :to="`/orders/${(row as Order).id}`"
                            class="action-btn"
                            title="View"
                        >
                            <AppIcon name="eye" :size="15" />
                        </RouterLink>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import PageHeader from "@/components/ui/PageHeader.vue";
import SearchBar from "@/components/ui/SearchBar.vue";
import DataTable from "@/components/ui/DataTable.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import { mockOrders } from "@/mocks/orders";
import type { Order } from "@/types/order";

const search = ref("");
const filterStatus = ref("");
const statuses = ["pending", "processing", "shipped", "delivered", "completed", "cancelled"];

const columns = [
    { key: "id", label: "Order ID" },
    { key: "customerName", label: "Customer", sortable: true },
    { key: "total", label: "Total", sortable: true },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Date", sortable: true }
];

const filtered = computed(() => {
    let list = [...mockOrders];
    if (search.value) {
        const q = search.value.toLowerCase();
        list = list.filter((o) => o.id.includes(q) || o.customerName.toLowerCase().includes(q));
    }
    if (filterStatus.value) list = list.filter((o) => o.status === filterStatus.value);
    return list;
});

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
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
    color: var(--color-text-primary);
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
.order-id {
    font-family: monospace;
    font-size: 12px;
    color: var(--color-text-muted);
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
