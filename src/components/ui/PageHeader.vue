<template>
    <div class="page-header">
        <div class="page-header__meta">
            <nav v-if="breadcrumbs.length" class="breadcrumb">
                <span v-for="(crumb, i) in breadcrumbs" :key="i" class="breadcrumb__item">
                    <RouterLink v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</RouterLink>
                    <span v-else>{{ crumb.label }}</span>
                    <span v-if="i < breadcrumbs.length - 1" class="breadcrumb__sep">/</span>
                </span>
            </nav>
            <h1 class="page-header__title">{{ title }}</h1>
        </div>
        <div v-if="$slots.actions" class="page-header__actions">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps<{
    title: string;
    breadcrumbs?: { label: string; to?: string }[];
}>();
</script>

<style scoped>
.page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 16px;
}
.breadcrumb {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
}
.breadcrumb__item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--color-text-muted);
}
.breadcrumb__item a {
    color: var(--color-secondary);
}
.breadcrumb__item a:hover {
    text-decoration: underline;
}
.breadcrumb__sep {
    color: var(--color-border);
}
.page-header__title {
    font-size: 22px;
    font-weight: 700;
    color: var(--color-text-primary);
}
.page-header__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}
</style>
