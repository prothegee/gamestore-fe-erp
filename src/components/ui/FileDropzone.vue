<template>
    <div
        class="dropzone"
        :class="{ 'dropzone--over': isOver, 'dropzone--has-file': !!file }"
        @dragover.prevent="isOver = true"
        @dragleave="isOver = false"
        @drop.prevent="onDrop"
    >
        <input
            ref="inputRef"
            type="file"
            class="dropzone__input"
            :accept="accept"
            @change="onFileChange"
        />
        <div v-if="!file" class="dropzone__idle" @click="inputRef?.click()">
            <AppIcon name="upload" :size="32" class="dropzone__upload-icon" />
            <p class="dropzone__title">
                Drop a file here, or <span class="dropzone__link">browse</span>
            </p>
            <p class="dropzone__hint">{{ accept || "Any file type" }}</p>
        </div>
        <div v-else class="dropzone__preview">
            <AppIcon name="check" :size="20" class="dropzone__check" />
            <span class="dropzone__filename">{{ file.name }}</span>
            <button class="dropzone__remove" @click.stop="clear">
                <AppIcon name="x" :size="14" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppIcon from "./AppIcon.vue";

withDefaults(defineProps<{ accept?: string }>(), { accept: undefined });
const emit = defineEmits<{ (e: "file", f: File): void }>();

const file = ref<File | null>(null);
const isOver = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

function onDrop(e: DragEvent) {
    isOver.value = false;
    const f = e.dataTransfer?.files[0];
    if (f) set(f);
}

function onFileChange(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) set(f);
}

function set(f: File) {
    file.value = f;
    emit("file", f);
}

function clear() {
    file.value = null;
    if (inputRef.value) inputRef.value.value = "";
}
</script>

<style scoped>
.dropzone {
    position: relative;
    border: 2px dashed var(--color-border);
    border-radius: var(--border-radius-lg);
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition:
        border-color var(--transition),
        background var(--transition);
    background: var(--color-surface-2);
}
.dropzone--over {
    border-color: var(--color-secondary);
    background: rgba(40, 141, 169, 0.06);
}
.dropzone--has-file {
    border-style: solid;
    border-color: var(--color-accent);
}
.dropzone__input {
    display: none;
}
.dropzone__idle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}
.dropzone__upload-icon {
    color: var(--color-text-muted);
}
.dropzone__title {
    font-size: 14px;
    color: var(--color-text-secondary);
}
.dropzone__link {
    color: var(--color-secondary);
    font-weight: 600;
}
.dropzone__hint {
    font-size: 11px;
    color: var(--color-text-muted);
}
.dropzone__preview {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
}
.dropzone__check {
    color: var(--color-success);
}
.dropzone__filename {
    font-size: 13px;
    font-weight: 500;
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.dropzone__remove {
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    display: flex;
}
.dropzone__remove:hover {
    color: var(--color-danger);
}
</style>
