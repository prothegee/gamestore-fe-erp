<template>
    <div>
        <PageHeader title="Dashboard" :breadcrumbs="[]" />

        <div class="kpi-grid">
            <KpiCard icon="reports" label="Today's Revenue" value="$4,281.50" :trend="12" />
            <KpiCard icon="orders" label="Total Orders" value="38" :trend="5" />
            <KpiCard icon="products" label="Active Products" value="847" :trend="-2" />
            <KpiCard icon="customers" label="New Customers" value="14" :trend="22" />
        </div>

        <div class="dash-grid">
            <div class="dash-card">
                <h3 class="dash-card__title">Top Selling Games</h3>
                <div class="top-list">
                    <div v-for="item in topSellers" :key="item.id" class="top-list__row">
                        <img :src="item.coverUrl" :alt="item.name" class="top-list__cover" />
                        <div class="top-list__info">
                            <span class="top-list__name">{{ item.name }}</span>
                            <span class="top-list__platform">{{ item.platform }}</span>
                        </div>
                        <div class="top-list__right">
                            <span class="top-list__units">{{ item.unitsSold }} sold</span>
                            <span class="top-list__revenue">${{ item.revenue.toFixed(2) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dash-card">
                <h3 class="dash-card__title">Low Stock Alerts</h3>
                <div v-if="lowStock.length === 0" class="dash-empty">
                    All products are adequately stocked.
                </div>
                <div v-else class="alert-list">
                    <div v-for="p in lowStock" :key="p.id" class="alert-row">
                        <AppIcon name="alert" :size="15" class="alert-row__icon" />
                        <div class="alert-row__info">
                            <span class="alert-row__name">{{ p.name }}</span>
                            <span class="alert-row__sku">{{ p.sku }}</span>
                        </div>
                        <StatusBadge :status="p.stock === 0 ? 'out_of_stock' : 'active'" />
                        <span class="alert-row__stock">{{ p.stock }} left</span>
                    </div>
                </div>
            </div>

            <div class="dash-card">
                <h3 class="dash-card__title">Service Health</h3>
                <div class="health-list">
                    <div v-for="svc in services" :key="svc.name" class="health-row">
                        <span class="health-dot" :class="`health-dot--${svc.status}`" />
                        <span class="health-name">{{ svc.name }}</span>
                        <span class="health-url">{{ svc.url }}</span>
                        <span class="health-status">{{ svc.status }}</span>
                    </div>
                </div>
            </div>

            <div class="dash-card">
                <h3 class="dash-card__title">Recent Activity</h3>
                <div class="activity-list">
                    <div v-for="event in recentActivity" :key="event.id" class="activity-row">
                        <span class="activity-row__time">{{ event.time }}</span>
                        <span class="activity-row__msg">{{ event.message }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import KpiCard from "@/components/ui/KpiCard.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import { mockProducts } from "@/mocks/products";

const lowStock = computed(() => mockProducts.filter((p) => p.stock <= p.lowStockThreshold));

const topSellers = [
    {
        id: "p1",
        name: "Elden Ring",
        platform: "PS5",
        unitsSold: 42,
        revenue: 2519.58,
        coverUrl: "https://placehold.co/36x48/026C96/FFE3AD?text=ER"
    },
    {
        id: "p3",
        name: "FIFA 25",
        platform: "XSX",
        unitsSold: 31,
        revenue: 2169.69,
        coverUrl: "https://placehold.co/36x48/FDA46F/026C96?text=F25"
    },
    {
        id: "p7",
        name: "Spider-Man 2",
        platform: "PS5",
        unitsSold: 28,
        revenue: 1959.72,
        coverUrl: "https://placehold.co/36x48/288DA9/FFE3AD?text=SM2"
    },
    {
        id: "p4",
        name: "Zelda: TotK",
        platform: "NSW",
        unitsSold: 19,
        revenue: 1139.81,
        coverUrl: "https://placehold.co/36x48/7BC3AF/026C96?text=TK"
    }
];

const services = [
    { name: "Account Service", url: "localhost:9001", status: "online" },
    { name: "Media Service", url: "localhost:9002", status: "online" },
    { name: "Product Service", url: "localhost:9003", status: "online" },
    { name: "Purchase Service", url: "localhost:9004", status: "degraded" },
    { name: "Session Service", url: "localhost:9005", status: "online" }
];

const recentActivity = [
    { id: 1, time: "2 min ago", message: "Order #ord-005 placed by Casey Lin" },
    { id: 2, time: "14 min ago", message: "Stock updated: Elden Ring +50 units" },
    { id: 3, time: "31 min ago", message: "Return request #ret-002 approved" },
    { id: 4, time: "1 hr ago", message: "PO #po-003 created for Nintendo Americas" },
    { id: 5, time: "2 hr ago", message: "User Morgan Patel suspended" },
    { id: 6, time: "3 hr ago", message: 'Sale event "Xbox Weekend Deal" activated' }
];
</script>

<style scoped>
.kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
}
@media (max-width: 1200px) {
    .kpi-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (max-width: 600px) {
    .kpi-grid {
        grid-template-columns: 1fr;
    }
}

.dash-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}
@media (max-width: 900px) {
    .dash-grid {
        grid-template-columns: 1fr;
    }
}

.dash-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    padding: 20px;
    box-shadow: var(--shadow-sm);
}
.dash-card__title {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
}
.dash-empty {
    font-size: 13px;
    color: var(--color-text-muted);
}

/* Top sellers */
.top-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.top-list__row {
    display: flex;
    align-items: center;
    gap: 12px;
}
.top-list__cover {
    width: 36px;
    height: 48px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
}
.top-list__info {
    flex: 1;
    display: flex;
    flex-direction: column;
}
.top-list__name {
    font-size: 13px;
    font-weight: 600;
}
.top-list__platform {
    font-size: 11px;
    color: var(--color-text-muted);
}
.top-list__right {
    text-align: right;
}
.top-list__units {
    display: block;
    font-size: 12px;
    color: var(--color-text-secondary);
}
.top-list__revenue {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: var(--color-primary);
}

/* Low stock alerts */
.alert-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.alert-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: var(--border-radius);
    background: var(--color-surface-2);
}
.alert-row__icon {
    color: var(--color-warning);
    flex-shrink: 0;
}
.alert-row__info {
    flex: 1;
    display: flex;
    flex-direction: column;
}
.alert-row__name {
    font-size: 13px;
    font-weight: 600;
}
.alert-row__sku {
    font-size: 11px;
    color: var(--color-text-muted);
}
.alert-row__stock {
    font-size: 12px;
    font-weight: 700;
    color: var(--color-danger);
}

/* Health */
.health-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.health-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
}
.health-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}
.health-dot--online {
    background: var(--color-success);
}
.health-dot--degraded {
    background: var(--color-warning);
}
.health-dot--offline {
    background: var(--color-danger);
}
.health-name {
    font-weight: 600;
    flex: 1;
}
.health-url {
    font-size: 11px;
    color: var(--color-text-muted);
    flex: 1;
}
.health-status {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
}

/* Activity */
.activity-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.activity-row {
    display: flex;
    gap: 12px;
    font-size: 13px;
}
.activity-row__time {
    color: var(--color-text-muted);
    white-space: nowrap;
    flex-shrink: 0;
    width: 80px;
}
.activity-row__msg {
    color: var(--color-text-primary);
}
</style>
