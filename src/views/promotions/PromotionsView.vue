<template>
    <div>
        <PageHeader title="Pricing & Promotions" :breadcrumbs="[{ label: 'Promotions' }]">
            <template #actions>
                <button class="btn btn--primary">
                    <AppIcon name="plus" :size="15" /> New Code
                </button>
            </template>
        </PageHeader>

        <div class="section-title">Discount Codes</div>
        <div class="card mb">
            <DataTable
                :columns="codeColumns"
                :rows="codes"
                :total="codes.length"
                :page="1"
                :page-size="20"
            >
                <template #cell-discountType="{ row }">
                    <span class="code-type"
                        >{{ (row as DiscountCode).discountType === "percentage" ? "%" : "$" }}
                        {{ (row as DiscountCode).value
                        }}{{
                            (row as DiscountCode).discountType === "percentage" ? " off" : " flat"
                        }}</span
                    >
                </template>
                <template #cell-usage="{ row }">
                    {{ (row as DiscountCode).usageCount }} / {{ (row as DiscountCode).usageLimit }}
                </template>
                <template #cell-status="{ row }">
                    <StatusBadge :status="(row as DiscountCode).status" />
                </template>
                <template #cell-expiresAt="{ row }">
                    {{ formatDate((row as DiscountCode).expiresAt) }}
                </template>
                <template #cell-code="{ row }">
                    <code class="code-chip">{{ (row as DiscountCode).code }}</code>
                </template>
            </DataTable>
        </div>

        <div class="section-title">Sale Events</div>
        <div class="card">
            <DataTable
                :columns="eventColumns"
                :rows="events"
                :total="events.length"
                :page="1"
                :page-size="20"
            >
                <template #cell-status="{ row }">
                    <StatusBadge :status="(row as SaleEvent).status" />
                </template>
                <template #cell-value="{ row }">
                    {{
                        (row as SaleEvent).discountType === "percentage"
                            ? (row as SaleEvent).value + "%"
                            : "$" + (row as SaleEvent).value
                    }}
                    off
                </template>
                <template #cell-revenueImpact="{ row }">
                    <span :class="(row as SaleEvent).revenueImpact < 0 ? 'negative' : ''">
                        ${{ (row as SaleEvent).revenueImpact.toFixed(2) }}
                    </span>
                </template>
                <template #cell-startsAt="{ row }">
                    {{ formatDate((row as SaleEvent).startsAt) }}
                </template>
                <template #cell-endsAt="{ row }">
                    {{ formatDate((row as SaleEvent).endsAt) }}
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import PageHeader from "@/components/ui/PageHeader.vue";
import DataTable from "@/components/ui/DataTable.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import { mockDiscountCodes, mockSaleEvents } from "@/mocks/promotions";
import type { DiscountCode, SaleEvent } from "@/types/promotion";

const codes = mockDiscountCodes;
const events = mockSaleEvents;

const codeColumns = [
    { key: "code", label: "Code" },
    { key: "discountType", label: "Discount" },
    { key: "usage", label: "Usage" },
    { key: "expiresAt", label: "Expires" },
    { key: "status", label: "Status" }
];

const eventColumns = [
    { key: "name", label: "Event Name" },
    { key: "value", label: "Discount" },
    { key: "redemptions", label: "Redemptions" },
    { key: "revenueImpact", label: "Revenue Impact" },
    { key: "startsAt", label: "Start" },
    { key: "endsAt", label: "End" },
    { key: "status", label: "Status" }
];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}
</script>

<style scoped>
.section-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 14px;
}
.card {
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
}
.mb {
    margin-bottom: 24px;
}
.code-chip {
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}
.code-type {
    font-weight: 600;
    color: var(--color-primary);
}
.negative {
    color: var(--color-danger);
    font-weight: 600;
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
