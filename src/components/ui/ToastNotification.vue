<template>
    <Teleport to="body">
        <div class="toast-stack">
            <TransitionGroup name="toast">
                <div
                    v-for="toast in toasts"
                    :key="toast.id"
                    class="toast"
                    :class="`toast--${toast.type}`"
                    @click="remove(toast.id)"
                >
                    <AppIcon :name="icons[toast.type]" :size="12" class="toast__icon" />
                    <span class="toast__msg">{{ toast.message }}</span>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { storeToRefs } from "pinia";
import AppIcon from "./AppIcon.vue";

const store = useToastStore();
const { toasts } = storeToRefs(store);
const { remove } = store;

const icons: Record<string, string> = {
    success: "check",
    error: "x",
    warning: "alert",
    info: "notifications"
};
</script>

<style scoped>
.toast-stack {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
}

.toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    pointer-events: all;
    min-width: 260px;
    max-width: 400px;
    backdrop-filter: blur(4px);
}

.toast__icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 4px;
}

.toast--success {
    background: #fff;
    border-left: 4px solid var(--color-success);
    color: var(--color-text-primary);
}
.toast--success .toast__icon {
    background: var(--color-success);
    color: #fff;
}
.toast--error {
    background: #fff;
    border-left: 4px solid var(--color-danger);
    color: var(--color-text-primary);
}
.toast--error .toast__icon {
    background: var(--color-danger);
    color: #fff;
}
.toast--warning {
    background: #fff;
    border-left: 4px solid var(--color-warning);
    color: var(--color-text-primary);
}
.toast--warning .toast__icon {
    background: var(--color-warning);
    color: #fff;
}
.toast--info {
    background: #fff;
    border-left: 4px solid var(--color-secondary);
    color: var(--color-text-primary);
}
.toast--info .toast__icon {
    background: var(--color-secondary);
    color: #fff;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.25s ease;
}
.toast-enter-from {
    transform: translateX(100%);
    opacity: 0;
}
.toast-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>
