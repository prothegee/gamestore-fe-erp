<template>
    <div>
        <PageHeader title="Media Assets" :breadcrumbs="[{ label: 'Media' }]">
            <template #actions>
                <button class="btn btn--primary" @click="showUpload = !showUpload">
                    <AppIcon name="upload" :size="15" /> Upload
                </button>
            </template>
        </PageHeader>

        <!-- Upload panel -->
        <div v-if="showUpload" class="upload-panel card mb">
            <h3 class="panel-title">Upload New Asset</h3>
            <FileDropzone accept="image/*,video/mp4" @file="onFile" />
            <div v-if="pendingFile" class="upload-meta">
                <div class="upload-filename">
                    <AppIcon name="upload" :size="14" />
                    <span>{{ pendingFile.name }}</span>
                    <span class="file-size">({{ formatSize(pendingFile.size) }})</span>
                </div>
                <div class="upload-fields">
                    <FormInput
                        v-model="uploadType"
                        label="Asset Type"
                        type="select"
                        :options="[
                            { value: 'cover', label: 'Cover' },
                            { value: 'banner', label: 'Banner' },
                            { value: 'trailer', label: 'Trailer' },
                            { value: 'screenshot', label: 'Screenshot' }
                        ]"
                    />
                    <FormInput
                        v-model="uploadTags"
                        label="Tags (comma-separated)"
                        placeholder="e.g. RPG, PS5, promo"
                    />
                </div>
                <div class="upload-actions">
                    <button class="btn btn--primary" @click="submitUpload">Upload</button>
                    <button class="btn btn--ghost" @click="cancelUpload">Cancel</button>
                </div>
            </div>
        </div>

        <div class="filters">
            <SearchBar v-model="search" placeholder="Search by name or tag…" />
            <select v-model="filterType" class="filter-select">
                <option value="">All Types</option>
                <option value="cover">Cover</option>
                <option value="banner">Banner</option>
                <option value="trailer">Trailer</option>
                <option value="screenshot">Screenshot</option>
            </select>
        </div>

        <div v-if="filtered.length === 0" class="empty-state">
            <AppIcon name="media" :size="32" class="empty-icon" />
            <p>No media assets found.</p>
        </div>

        <div v-else class="media-grid">
            <div v-for="asset in filtered" :key="asset.id" class="media-card">
                <div class="media-card__img-wrap">
                    <img
                        :src="asset.url"
                        :alt="asset.name"
                        class="media-card__img"
                        @error="onImgError"
                    />
                    <span class="media-card__type-badge">{{ asset.type }}</span>
                </div>
                <div class="media-card__body">
                    <span class="media-card__name" :title="asset.name">{{ asset.name }}</span>
                    <span class="media-card__meta"
                        >{{ formatSize(asset.size) }} &middot; {{ asset.mimeType }}</span
                    >
                    <div class="media-card__tags">
                        <span v-for="tag in asset.tags" :key="tag" class="tag">{{ tag }}</span>
                    </div>
                    <div v-if="asset.linkedProductIds.length" class="media-card__links">
                        <AppIcon name="products" :size="12" />
                        <span>{{ asset.linkedProductIds.length }} product(s)</span>
                    </div>
                </div>
                <div class="media-card__actions">
                    <button class="action-btn" title="Copy URL" @click="copyUrl(asset.url)">
                        <AppIcon name="eye" :size="14" />
                    </button>
                    <button
                        class="action-btn action-btn--danger"
                        title="Delete"
                        @click="deleteAsset(asset.id, asset.name)"
                    >
                        <AppIcon name="trash" :size="14" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import SearchBar from "@/components/ui/SearchBar.vue";
import FileDropzone from "@/components/ui/FileDropzone.vue";
import FormInput from "@/components/ui/FormInput.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import { useMediaStore } from "@/stores/media";
import { useToastStore } from "@/stores/toast";
import { useNotificationStore } from "@/stores/notifications";
import type { AssetType } from "@/types/media";

// NOTE:
// - Fetch this later to: <VITE_API_MEDIA>
const mediaStore = useMediaStore();
const toast = useToastStore();
const notif = useNotificationStore();

const search = ref("");
const filterType = ref("");
const showUpload = ref(false);
const pendingFile = ref<File | null>(null);
const uploadType = ref<AssetType>("cover");
const uploadTags = ref("");

const filtered = computed(() => {
    let list = [...mediaStore.assets];
    if (search.value) {
        const q = search.value.toLowerCase();
        list = list.filter(
            (a) =>
                a.name.toLowerCase().includes(q) ||
                a.type.toLowerCase().includes(q) ||
                a.tags.some((t) => t.toLowerCase().includes(q))
        );
    }
    if (filterType.value) list = list.filter((a) => a.type === filterType.value);
    return list;
});

function onFile(f: File) {
    pendingFile.value = f;
}

function cancelUpload() {
    pendingFile.value = null;
    uploadTags.value = "";
    showUpload.value = false;
}

function submitUpload() {
    if (!pendingFile.value) return;
    const tags = uploadTags.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    const asset = mediaStore.add(pendingFile.value, uploadType.value, tags);
    toast.add({ type: "success", message: `"${asset.name}" uploaded.` });
    notif.add(
        "success",
        "Media Uploaded",
        `File "${asset.name}" (${asset.type}) has been uploaded.`
    );
    pendingFile.value = null;
    uploadTags.value = "";
    showUpload.value = false;
}

function deleteAsset(id: string, name: string) {
    mediaStore.remove(id);
    toast.add({ type: "success", message: `"${name}" deleted.` });
    notif.add("warning", "Media Deleted", `File "${name}" was removed from the media library.`);
}

function copyUrl(url: string) {
    navigator.clipboard?.writeText(url).catch(() => {});
    toast.add({ type: "success", message: "URL copied to clipboard." });
}

function onImgError(e: Event) {
    const img = e.target as HTMLImageElement;
    img.src = "https://placehold.co/400x280/026C96/FFE3AD?text=No+Preview";
}

function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(0) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
}
</script>

<style scoped>
.filters {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}
.filter-select {
    height: 38px;
    padding: 0 12px;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background: var(--color-surface);
    font-size: 13px;
    outline: none;
    color: var(--color-text-primary);
}
.card {
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    padding: 20px;
    box-shadow: var(--shadow-sm);
}
.mb {
    margin-bottom: 20px;
}
.panel-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 14px;
}
.upload-filename {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 12px;
}
.file-size {
    font-size: 11px;
    color: var(--color-text-muted);
    font-weight: 400;
}
.upload-fields {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 14px;
}
.upload-actions {
    display: flex;
    gap: 10px;
}
.empty-state {
    text-align: center;
    padding: 60px;
    color: var(--color-text-muted);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}
.empty-icon {
    opacity: 0.3;
}

.media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
}
@media (max-width: 480px) {
    .media-grid {
        grid-template-columns: 1fr 1fr;
    }
}
.media-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
}
.media-card__img-wrap {
    position: relative;
}
.media-card__img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    display: block;
    background: var(--color-surface-2);
}
.media-card__type-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    background: var(--color-primary);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 999px;
    text-transform: uppercase;
}
.media-card__body {
    padding: 12px;
    flex: 1;
}
.media-card__name {
    display: block;
    font-weight: 600;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
}
.media-card__meta {
    display: block;
    font-size: 10px;
    color: var(--color-text-muted);
    margin-bottom: 8px;
}
.media-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    margin-bottom: 6px;
}
.tag {
    background: var(--color-warm);
    color: var(--color-primary);
    font-size: 10px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 999px;
}
.media-card__links {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: var(--color-text-muted);
}
.media-card__actions {
    display: flex;
    gap: 6px;
    padding: 10px 12px;
    border-top: 1px solid var(--color-border-light);
}
.action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    background: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--transition);
}
.action-btn:hover {
    border-color: var(--color-secondary);
    color: var(--color-secondary);
}
.action-btn--danger:hover {
    border-color: var(--color-danger);
    color: var(--color-danger);
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
.btn--ghost {
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
}
.btn:hover {
    opacity: 0.88;
}
</style>
