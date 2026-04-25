<template>
    <div class="field">
        <label v-if="label" class="field__label"
            >{{ label }}<span v-if="required" class="field__req">*</span></label
        >
        <select
            v-if="type === 'select'"
            class="field__input"
            :class="{ 'field__input--error': error }"
            :value="modelValue"
            :disabled="disabled"
            @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        >
            <option value="" disabled>{{ placeholder || "Select…" }}</option>
            <option v-for="opt in options" :key="opt.value" :value="opt.value">
                {{ opt.label }}
            </option>
        </select>
        <textarea
            v-else-if="type === 'textarea'"
            class="field__input field__textarea"
            :class="{ 'field__input--error': error }"
            :value="modelValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :rows="rows"
            @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        />
        <input
            v-else
            class="field__input"
            :class="{ 'field__input--error': error }"
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :min="min"
            :max="max"
            :step="step"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
        <p v-if="error" class="field__error">{{ error }}</p>
        <p v-if="hint && !error" class="field__hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        modelValue: string | number;
        label?: string;
        type?: string;
        placeholder?: string;
        error?: string;
        hint?: string;
        required?: boolean;
        disabled?: boolean;
        options?: { value: string; label: string }[];
        rows?: number;
        min?: string | number;
        max?: string | number;
        step?: string | number;
    }>(),
    {
        type: "text",
        rows: 4,
        label: undefined,
        placeholder: undefined,
        error: undefined,
        hint: undefined,
        options: undefined,
        min: undefined,
        max: undefined,
        step: undefined
    }
);
defineEmits<{ (e: "update:modelValue", val: string | number): void }>();
</script>

<style scoped>
.field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.field__label {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-secondary);
}
.field__req {
    color: var(--color-danger);
    margin-left: 2px;
}
.field__input {
    height: 38px;
    padding: 0 12px;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background: var(--color-surface);
    color: var(--color-text-primary);
    font-size: 13px;
    outline: none;
    transition:
        border-color var(--transition),
        box-shadow var(--transition);
    width: 100%;
}
.field__input:focus {
    border-color: var(--color-secondary);
    box-shadow: 0 0 0 2px rgba(40, 141, 169, 0.15);
}
.field__input--error {
    border-color: var(--color-danger);
}
.field__input:disabled {
    background: var(--color-surface-2);
    color: var(--color-text-muted);
    cursor: not-allowed;
}
.field__textarea {
    height: auto;
    padding: 10px 12px;
    resize: vertical;
}
.field__error {
    font-size: 11px;
    color: var(--color-danger);
}
.field__hint {
    font-size: 11px;
    color: var(--color-text-muted);
}
</style>
