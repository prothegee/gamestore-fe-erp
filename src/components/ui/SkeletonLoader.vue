<template>
    <div class="skeleton" :style="{ width, height, borderRadius: radius }" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ width?: string; height?: string; radius?: string }>(), {
    width: "100%",
    height: "16px",
    radius: "4px"
});
</script>

<style scoped>
.skeleton {
    background: linear-gradient(
        90deg,
        var(--color-border-light) 25%,
        var(--color-border) 50%,
        var(--color-border-light) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}
</style>
