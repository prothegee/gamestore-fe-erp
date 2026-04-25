<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="open" class="modal-overlay" @click.self="$emit('cancel')">
                <div class="modal">
                    <div class="modal__header">
                        <AppIcon :name="icon" :size="22" class="modal__icon" />
                        <h3 class="modal__title">{{ title }}</h3>
                    </div>
                    <p class="modal__body">{{ message }}</p>
                    <div class="modal__footer">
                        <button class="btn btn--ghost" @click="$emit('cancel')">
                            {{ cancelLabel }}
                        </button>
                        <button class="btn" :class="`btn--${variant}`" @click="$emit('confirm')">
                            {{ confirmLabel }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import AppIcon from "./AppIcon.vue";
withDefaults(
    defineProps<{
        open: boolean;
        title: string;
        message: string;
        icon?: string;
        variant?: "danger" | "primary";
        confirmLabel?: string;
        cancelLabel?: string;
    }>(),
    { icon: "alert", variant: "danger", confirmLabel: "Confirm", cancelLabel: "Cancel" }
);
defineEmits<{ (e: "confirm"): void; (e: "cancel"): void }>();
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9000;
}
.modal {
    background: var(--color-surface);
    border-radius: var(--border-radius-lg);
    padding: 28px;
    width: 420px;
    box-shadow: var(--shadow-lg);
}
.modal__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}
.modal__icon {
    font-size: 24px;
}
.modal__title {
    font-size: 17px;
    font-weight: 700;
}
.modal__body {
    color: var(--color-text-secondary);
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 24px;
}
.modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn {
    padding: 9px 20px;
    border-radius: var(--border-radius);
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: opacity var(--transition);
}
.btn:hover {
    opacity: 0.88;
}
.btn--danger {
    background: var(--color-danger);
    color: #fff;
}
.btn--primary {
    background: var(--color-primary);
    color: #fff;
}
.btn--ghost {
    background: var(--color-border-light);
    color: var(--color-text-secondary);
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
