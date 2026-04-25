<template>
    <div class="kpi-card">
        <div class="kpi-card__header">
            <AppIcon :name="icon" :size="16" class="kpi-card__icon" />
            <span class="kpi-card__label">{{ label }}</span>
        </div>
        <div class="kpi-card__value">{{ value }}</div>
        <div v-if="trend !== undefined" class="kpi-card__trend" :class="trend >= 0 ? 'up' : 'down'">
            <AppIcon :name="trend >= 0 ? 'chevron-right' : 'chevron-left'" :size="12" />
            {{ Math.abs(trend) }}% vs last period
        </div>
    </div>
</template>

<script setup lang="ts">
import AppIcon from "./AppIcon.vue";
defineProps<{
    icon: string;
    label: string;
    value: string;
    trend?: number;
}>();
</script>

<style scoped>
.kpi-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    padding: 20px;
    box-shadow: var(--shadow-sm);
}
.kpi-card__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}
.kpi-card__icon {
    font-size: 18px;
}
.kpi-card__label {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.kpi-card__value {
    font-size: 28px;
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: 1;
    margin-bottom: 8px;
}
.kpi-card__trend {
    font-size: 11px;
    font-weight: 600;
}
.kpi-card__trend.up {
    color: var(--color-success);
}
.kpi-card__trend.down {
    color: var(--color-danger);
}
</style>
