<template>
    <div>
        <PageHeader title="Reports & Analytics" :breadcrumbs="[{ label: 'Reports' }]">
            <template #actions>
                <button class="btn btn--ghost" @click="exportCSV">
                    <AppIcon name="download" :size="14" /> Export CSV
                </button>
            </template>
        </PageHeader>

        <!-- Date range selector -->
        <div class="date-bar">
            <button
                v-for="preset in presets"
                :key="preset"
                class="preset-btn"
                :class="{ 'preset-btn--active': activePreset === preset }"
                @click="activePreset = preset"
            >
                {{ preset }}
            </button>
        </div>

        <!-- KPIs -->
        <div class="kpi-grid">
            <KpiCard
                icon="reports"
                label="Gross Revenue"
                :value="current.kpis.revenueFormatted"
                :trend="current.kpis.revTrend"
            />
            <KpiCard
                icon="products"
                label="Units Sold"
                :value="current.kpis.unitsFormatted"
                :trend="current.kpis.unitsTrend"
            />
            <KpiCard
                icon="orders"
                label="Orders"
                :value="current.kpis.ordersFormatted"
                :trend="current.kpis.ordersTrend"
            />
            <KpiCard
                icon="customers"
                label="Avg. Order Value"
                :value="current.kpis.aovFormatted"
                :trend="current.kpis.aovTrend"
            />
        </div>

        <div class="report-grid">
            <!-- Revenue by platform -->
            <div class="card">
                <h3 class="card-title">Revenue by Platform</h3>
                <div class="bar-chart">
                    <div v-for="item in current.platformRevenue" :key="item.label" class="bar-row">
                        <span class="bar-label">{{ item.label }}</span>
                        <div class="bar-track">
                            <div class="bar-fill" :style="{ width: item.pct + '%' }" />
                        </div>
                        <span class="bar-value">${{ item.value.toLocaleString() }}</span>
                    </div>
                </div>
            </div>

            <!-- Revenue by genre -->
            <div class="card">
                <h3 class="card-title">Revenue by Genre</h3>
                <div class="bar-chart">
                    <div v-for="item in current.genreRevenue" :key="item.label" class="bar-row">
                        <span class="bar-label">{{ item.label }}</span>
                        <div class="bar-track">
                            <div class="bar-fill bar-fill--2" :style="{ width: item.pct + '%' }" />
                        </div>
                        <span class="bar-value">${{ item.value.toLocaleString() }}</span>
                    </div>
                </div>
            </div>

            <!-- Financial summary -->
            <div class="card">
                <h3 class="card-title">Financial Summary</h3>
                <div class="fin-row">
                    <span>Gross Revenue</span
                    ><span class="fin-positive"
                        >${{ current.financial.gross.toLocaleString() }}.00</span
                    >
                </div>
                <div class="fin-row">
                    <span>Cost of Goods Sold</span
                    ><span class="fin-negative"
                        >-${{ current.financial.cogs.toLocaleString() }}.00</span
                    >
                </div>
                <div class="fin-divider" />
                <div class="fin-row fin-row--total">
                    <span>Gross Profit</span
                    ><span>${{ current.financial.profit.toLocaleString() }}.00</span>
                </div>
                <div class="fin-row">
                    <span>Gross Margin</span
                    ><span class="fin-margin">{{ current.financial.margin }}%</span>
                </div>
            </div>

            <!-- Top SKUs -->
            <div class="card">
                <h3 class="card-title">Top SKUs by Units Sold</h3>
                <DataTable
                    :columns="skuCols"
                    :rows="current.topSkus"
                    :total="current.topSkus.length"
                    :page="1"
                    :page-size="5"
                >
                    <template #cell-revenue="{ row }">
                        ${{ (row as TopSku).revenue.toLocaleString() }}
                    </template>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import KpiCard from "@/components/ui/KpiCard.vue";
import DataTable from "@/components/ui/DataTable.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import { useToastStore } from "@/stores/toast";

const toast = useToastStore();
const presets = ["Today", "This Week", "This Month", "This Quarter", "This Year"] as const;
type Preset = (typeof presets)[number];
const activePreset = ref<Preset>("This Month");

interface TopSku {
    id: string;
    name: string;
    sku: string;
    units: number;
    revenue: number;
}
interface PresetData {
    kpis: {
        revenue: number;
        revTrend: number;
        units: number;
        unitsTrend: number;
        orders: number;
        ordersTrend: number;
        aov: number;
        aovTrend: number;
    };
    platformRevenue: { label: string; value: number; pct: number }[];
    genreRevenue: { label: string; value: number; pct: number }[];
    financial: { gross: number; cogs: number; profit: number; margin: number };
    topSkus: TopSku[];
}

const reportData: Record<Preset, PresetData> = {
    Today: {
        kpis: {
            revenue: 3210,
            revTrend: 5,
            units: 46,
            unitsTrend: 2,
            orders: 14,
            ordersTrend: 8,
            aov: 229.28,
            aovTrend: -1
        },
        platformRevenue: [
            { label: "PS5", value: 1200, pct: 100 },
            { label: "PC", value: 920, pct: 77 },
            { label: "Xbox Series X", value: 700, pct: 58 },
            { label: "Nintendo Switch", value: 280, pct: 23 },
            { label: "PS4", value: 110, pct: 9 }
        ],
        genreRevenue: [
            { label: "RPG", value: 1020, pct: 100 },
            { label: "FPS", value: 820, pct: 80 },
            { label: "Action", value: 620, pct: 61 },
            { label: "Sports", value: 490, pct: 48 },
            { label: "Adventure", value: 260, pct: 25 }
        ],
        financial: { gross: 3210, cogs: 1490, profit: 1720, margin: 53.6 },
        topSkus: [
            { id: "1", name: "Elden Ring", sku: "ER-PS5-001", units: 5, revenue: 300 },
            { id: "2", name: "FIFA 25", sku: "FIFA-XSX-001", units: 4, revenue: 280 },
            { id: "3", name: "Spider-Man 2", sku: "SM2-PS5-001", units: 3, revenue: 210 },
            { id: "4", name: "Zelda: TotK", sku: "TOTK-NSW-001", units: 2, revenue: 120 },
            { id: "5", name: "Cyberpunk 2077", sku: "CP-PC-001", units: 2, revenue: 80 }
        ]
    },
    "This Week": {
        kpis: {
            revenue: 21900,
            revTrend: 7,
            units: 322,
            unitsTrend: 4,
            orders: 104,
            ordersTrend: 9,
            aov: 210.58,
            aovTrend: -1
        },
        platformRevenue: [
            { label: "PS5", value: 8100, pct: 100 },
            { label: "PC", value: 6300, pct: 78 },
            { label: "Xbox Series X", value: 4800, pct: 59 },
            { label: "Nintendo Switch", value: 1900, pct: 23 },
            { label: "PS4", value: 800, pct: 10 }
        ],
        genreRevenue: [
            { label: "RPG", value: 7200, pct: 100 },
            { label: "FPS", value: 5500, pct: 76 },
            { label: "Action", value: 4100, pct: 57 },
            { label: "Sports", value: 3200, pct: 44 },
            { label: "Adventure", value: 1900, pct: 26 }
        ],
        financial: { gross: 21900, cogs: 10300, profit: 11600, margin: 53.0 },
        topSkus: [
            { id: "1", name: "Elden Ring", sku: "ER-PS5-001", units: 36, revenue: 2160 },
            { id: "2", name: "FIFA 25", sku: "FIFA-XSX-001", units: 24, revenue: 1680 },
            { id: "3", name: "Spider-Man 2", sku: "SM2-PS5-001", units: 19, revenue: 1330 },
            { id: "4", name: "Zelda: TotK", sku: "TOTK-NSW-001", units: 16, revenue: 960 },
            { id: "5", name: "Cyberpunk 2077", sku: "CP-PC-001", units: 14, revenue: 560 }
        ]
    },
    "This Month": {
        kpis: {
            revenue: 87410,
            revTrend: 8,
            units: 1284,
            unitsTrend: 3,
            orders: 412,
            ordersTrend: 11,
            aov: 212.17,
            aovTrend: -2
        },
        platformRevenue: [
            { label: "PS5", value: 32100, pct: 100 },
            { label: "PC", value: 24500, pct: 76 },
            { label: "Xbox Series X", value: 18700, pct: 58 },
            { label: "Nintendo Switch", value: 8400, pct: 26 },
            { label: "PS4", value: 3710, pct: 12 }
        ],
        genreRevenue: [
            { label: "RPG", value: 28900, pct: 100 },
            { label: "FPS", value: 22100, pct: 76 },
            { label: "Action", value: 16400, pct: 57 },
            { label: "Sports", value: 12800, pct: 44 },
            { label: "Adventure", value: 7210, pct: 25 }
        ],
        financial: { gross: 87410, cogs: 41200, profit: 46210, margin: 52.9 },
        topSkus: [
            { id: "1", name: "Elden Ring", sku: "ER-PS5-001", units: 142, revenue: 8518 },
            { id: "2", name: "FIFA 25", sku: "FIFA-XSX-001", units: 98, revenue: 6859 },
            { id: "3", name: "Spider-Man 2", sku: "SM2-PS5-001", units: 77, revenue: 5389 },
            { id: "4", name: "Zelda: TotK", sku: "TOTK-NSW-001", units: 64, revenue: 3839 },
            { id: "5", name: "Cyberpunk 2077", sku: "CP-PC-001", units: 58, revenue: 2319 }
        ]
    },
    "This Quarter": {
        kpis: {
            revenue: 241800,
            revTrend: 12,
            units: 3520,
            unitsTrend: 6,
            orders: 1148,
            ordersTrend: 14,
            aov: 210.63,
            aovTrend: -1
        },
        platformRevenue: [
            { label: "PS5", value: 88900, pct: 100 },
            { label: "PC", value: 67400, pct: 76 },
            { label: "Xbox Series X", value: 51600, pct: 58 },
            { label: "Nintendo Switch", value: 23200, pct: 26 },
            { label: "PS4", value: 10700, pct: 12 }
        ],
        genreRevenue: [
            { label: "RPG", value: 79800, pct: 100 },
            { label: "FPS", value: 61100, pct: 77 },
            { label: "Action", value: 45200, pct: 57 },
            { label: "Sports", value: 35300, pct: 44 },
            { label: "Adventure", value: 20400, pct: 26 }
        ],
        financial: { gross: 241800, cogs: 113800, profit: 128000, margin: 52.9 },
        topSkus: [
            { id: "1", name: "Elden Ring", sku: "ER-PS5-001", units: 392, revenue: 23518 },
            { id: "2", name: "FIFA 25", sku: "FIFA-XSX-001", units: 271, revenue: 18969 },
            { id: "3", name: "Spider-Man 2", sku: "SM2-PS5-001", units: 213, revenue: 14909 },
            { id: "4", name: "Zelda: TotK", sku: "TOTK-NSW-001", units: 177, revenue: 10619 },
            { id: "5", name: "Cyberpunk 2077", sku: "CP-PC-001", units: 160, revenue: 6399 }
        ]
    },
    "This Year": {
        kpis: {
            revenue: 892500,
            revTrend: 18,
            units: 13200,
            unitsTrend: 9,
            orders: 4280,
            ordersTrend: 16,
            aov: 208.53,
            aovTrend: 2
        },
        platformRevenue: [
            { label: "PS5", value: 334200, pct: 100 },
            { label: "PC", value: 251600, pct: 75 },
            { label: "Xbox Series X", value: 191800, pct: 57 },
            { label: "Nintendo Switch", value: 87300, pct: 26 },
            { label: "PS4", value: 27600, pct: 8 }
        ],
        genreRevenue: [
            { label: "RPG", value: 298400, pct: 100 },
            { label: "FPS", value: 228200, pct: 76 },
            { label: "Action", value: 169100, pct: 57 },
            { label: "Sports", value: 131800, pct: 44 },
            { label: "Adventure", value: 65000, pct: 22 }
        ],
        financial: { gross: 892500, cogs: 420900, profit: 471600, margin: 52.8 },
        topSkus: [
            { id: "1", name: "Elden Ring", sku: "ER-PS5-001", units: 1468, revenue: 88069 },
            { id: "2", name: "FIFA 25", sku: "FIFA-XSX-001", units: 1014, revenue: 70979 },
            { id: "3", name: "Spider-Man 2", sku: "SM2-PS5-001", units: 797, revenue: 55789 },
            { id: "4", name: "Zelda: TotK", sku: "TOTK-NSW-001", units: 662, revenue: 39709 },
            { id: "5", name: "Cyberpunk 2077", sku: "CP-PC-001", units: 598, revenue: 23919 }
        ]
    }
};

const current = computed(() => {
    const d = reportData[activePreset.value];
    return {
        ...d,
        kpis: {
            ...d.kpis,
            revenueFormatted: "$" + d.kpis.revenue.toLocaleString() + ".00",
            unitsFormatted: d.kpis.units.toLocaleString(),
            ordersFormatted: d.kpis.orders.toLocaleString(),
            aovFormatted: "$" + d.kpis.aov.toFixed(2)
        }
    };
});

const skuCols = [
    { key: "name", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "units", label: "Units", sortable: true },
    { key: "revenue", label: "Revenue", sortable: true }
];

function exportCSV() {
    const d = reportData[activePreset.value];
    const rows = [
        ["GameStore ERP — Report Export"],
        [`Period: ${activePreset.value}`],
        [],
        ["KPIs"],
        ["Gross Revenue", "$" + d.kpis.revenue.toLocaleString()],
        ["Units Sold", d.kpis.units],
        ["Orders", d.kpis.orders],
        ["Avg. Order Value", "$" + d.kpis.aov.toFixed(2)],
        [],
        ["Top SKUs by Units"],
        ["Product", "SKU", "Units", "Revenue"],
        ...d.topSkus.map((s) => [s.name, s.sku, s.units, "$" + s.revenue.toLocaleString()]),
        [],
        ["Revenue by Platform"],
        ["Platform", "Revenue"],
        ...d.platformRevenue.map((p) => [p.label, "$" + p.value.toLocaleString()]),
        [],
        ["Revenue by Genre"],
        ["Genre", "Revenue"],
        ...d.genreRevenue.map((g) => [g.label, "$" + g.value.toLocaleString()])
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${activePreset.value.toLowerCase().replace(/ /g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.add({ type: "success", message: `Report exported as CSV.` });
}
</script>

<style scoped>
.date-bar {
    display: flex;
    gap: 6px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}
.preset-btn {
    padding: 6px 14px;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    background: var(--color-surface);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--transition);
}
.preset-btn:hover {
    border-color: var(--color-secondary);
    color: var(--color-secondary);
}
.preset-btn--active {
    background: var(--color-primary);
    color: #fff;
    border-color: var(--color-primary);
}

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
        grid-template-columns: 1fr 1fr;
    }
}

.report-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}
@media (max-width: 900px) {
    .report-grid {
        grid-template-columns: 1fr;
    }
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
    margin-bottom: 16px;
}

.bar-chart {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.bar-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
}
.bar-label {
    width: 110px;
    flex-shrink: 0;
    color: var(--color-text-secondary);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.bar-track {
    flex: 1;
    height: 8px;
    background: var(--color-border-light);
    border-radius: 999px;
    overflow: hidden;
}
.bar-fill {
    height: 100%;
    background: var(--color-primary);
    border-radius: 999px;
    transition: width 0.5s ease;
}
.bar-fill--2 {
    background: var(--color-secondary);
}
.bar-value {
    width: 80px;
    text-align: right;
    font-weight: 600;
    color: var(--color-text-primary);
    font-size: 11px;
}

.fin-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--color-border-light);
    font-size: 13px;
}
.fin-row:last-child {
    border-bottom: none;
}
.fin-row--total {
    font-weight: 700;
    font-size: 15px;
}
.fin-positive {
    color: var(--color-success);
    font-weight: 600;
}
.fin-negative {
    color: var(--color-danger);
    font-weight: 600;
}
.fin-margin {
    color: var(--color-secondary);
    font-weight: 700;
}
.fin-divider {
    height: 2px;
    background: var(--color-border);
    margin: 6px 0;
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
