<template>
    <div v-if="order">
        <PageHeader
            :title="`Order ${order.id}`"
            :breadcrumbs="[{ label: 'Orders', to: '/orders' }, { label: order.id }]"
        >
            <template #actions>
                <select class="status-select" :value="order.status" @change="updateStatus">
                    <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
                </select>
            </template>
        </PageHeader>

        <div class="detail-grid">
            <div class="detail-main">
                <div class="card">
                    <h3 class="card-title">Order Items</h3>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in order.items" :key="item.productId">
                                <td>{{ item.productName }}</td>
                                <td class="mono">{{ item.sku }}</td>
                                <td>{{ item.quantity }}</td>
                                <td>${{ item.unitPrice.toFixed(2) }}</td>
                                <td>
                                    <strong>${{ item.total.toFixed(2) }}</strong>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" class="subtotal-label">Subtotal</td>
                                <td>${{ order.subtotal.toFixed(2) }}</td>
                            </tr>
                            <tr>
                                <td colspan="4" class="subtotal-label">Tax</td>
                                <td>${{ order.tax.toFixed(2) }}</td>
                            </tr>
                            <tr class="total-row">
                                <td colspan="4" class="subtotal-label">Total</td>
                                <td>${{ order.total.toFixed(2) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div class="detail-aside">
                <div class="card">
                    <h3 class="card-title">Customer</h3>
                    <div class="info-row">
                        <span class="info-label">Name</span><span>{{ order.customerName }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Email</span><span>{{ order.customerEmail }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Address</span
                        ><span>{{ order.shippingAddress }}</span>
                    </div>
                </div>
                <div class="card">
                    <h3 class="card-title">Status</h3>
                    <StatusBadge :status="order.status" />
                    <p class="info-label mt">Created: {{ formatDate(order.createdAt) }}</p>
                    <p class="info-label">Updated: {{ formatDate(order.updatedAt) }}</p>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="not-found">Order not found.</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import PageHeader from "@/components/ui/PageHeader.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import { mockOrders } from "@/mocks/orders";
import { useToastStore } from "@/stores/toast";
import type { OrderStatus } from "@/types/order";

const route = useRoute();
const toast = useToastStore();
const order = computed(() => mockOrders.find((o) => o.id === route.params.id));
const statuses: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "completed",
    "cancelled"
];

function updateStatus(e: Event) {
    const val = (e.target as HTMLSelectElement).value as OrderStatus;
    if (order.value) {
        order.value.status = val;
        toast.add({ type: "success", message: `Order status updated to "${val}".` });
    }
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}
</script>

<style scoped>
.detail-grid {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 16px;
}
@media (max-width: 900px) {
    .detail-grid {
        grid-template-columns: 1fr;
    }
}
.detail-main,
.detail-aside {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.card {
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    padding: 20px;
    box-shadow: var(--shadow-sm);
}
.card-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 14px;
}
.info-row {
    display: flex;
    gap: 12px;
    font-size: 13px;
    margin-bottom: 10px;
}
.info-label {
    font-weight: 600;
    color: var(--color-text-secondary);
    min-width: 70px;
}
.mt {
    margin-top: 12px;
}

.items-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
}
.items-table th {
    padding: 8px 10px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-text-muted);
    border-bottom: 2px solid var(--color-border-light);
}
.items-table td {
    padding: 10px;
    border-bottom: 1px solid var(--color-border-light);
}
.items-table tfoot td {
    padding: 8px 10px;
}
.subtotal-label {
    text-align: right;
    color: var(--color-text-secondary);
}
.total-row td {
    font-weight: 700;
    font-size: 15px;
    border-top: 2px solid var(--color-border);
}
.mono {
    font-family: monospace;
    font-size: 11px;
    color: var(--color-text-muted);
}

.status-select {
    height: 38px;
    padding: 0 12px;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background: var(--color-surface);
    font-size: 13px;
}
.not-found {
    text-align: center;
    padding: 60px;
    color: var(--color-text-muted);
}
</style>
