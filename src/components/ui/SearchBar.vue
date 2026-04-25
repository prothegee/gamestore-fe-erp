<template>
    <div class="search-bar">
        <AppIcon name="search" :size="15" class="search-bar__icon" />
        <input
            class="search-bar__input"
            type="text"
            :placeholder="placeholder"
            :value="modelValue"
            @input="onInput"
        />
        <button v-if="modelValue" class="search-bar__clear" @click="$emit('update:modelValue', '')">
            <AppIcon name="x" :size="12" />
        </button>
    </div>
</template>

<script setup lang="ts">
import AppIcon from "./AppIcon.vue";

const props = withDefaults(
    defineProps<{ modelValue: string; placeholder?: string; debounce?: number }>(),
    { placeholder: "Search…", debounce: 300 }
);
const emit = defineEmits<{ (e: "update:modelValue", val: string): void }>();

let timer: ReturnType<typeof setTimeout>;

function onInput(e: Event) {
    clearTimeout(timer);
    const val = (e.target as HTMLInputElement).value;
    timer = setTimeout(() => emit("update:modelValue", val), props.debounce);
}
</script>

<style scoped>
.search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 0 12px;
    height: 38px;
    transition: border-color var(--transition);
}
.search-bar:focus-within {
    border-color: var(--color-secondary);
    box-shadow: 0 0 0 2px rgba(40, 141, 169, 0.15);
}
.search-bar__icon {
    color: var(--color-text-muted);
    font-size: 16px;
}
.search-bar__input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: var(--color-text-primary);
    font-size: 13px;
}
.search-bar__input::placeholder {
    color: var(--color-text-muted);
}
.search-bar__clear {
    background: none;
    border: none;
    color: var(--color-text-muted);
    font-size: 11px;
    padding: 2px;
    line-height: 1;
    cursor: pointer;
}
.search-bar__clear:hover {
    color: var(--color-danger);
}
</style>
