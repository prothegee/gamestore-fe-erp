<template>
    <div v-if="product">
        <PageHeader
            :title="product.name"
            :breadcrumbs="[{ label: 'Products', to: '/products' }, { label: product.name }]"
        >
            <template #actions>
                <button class="btn btn--ghost" @click="showConfirm = true">
                    <AppIcon name="trash" :size="14" /> Archive
                </button>
                <button class="btn btn--primary" @click="openEdit">
                    <AppIcon name="edit" :size="14" /> Edit
                </button>
            </template>
        </PageHeader>

        <!-- Inline edit form -->
        <div v-if="showEditForm" class="form-panel card mb">
            <h3 class="panel-title">Edit Product</h3>
            <div class="form-grid">
                <FormInput v-model="form.name" label="Name" required />
                <FormInput v-model="form.sku" label="SKU" required />
                <FormInput
                    v-model="form.platform"
                    label="Platform"
                    type="select"
                    :options="platformOptions"
                />
                <FormInput
                    v-model="form.genre"
                    label="Genre"
                    type="select"
                    :options="genreOptions"
                />
                <FormInput
                    v-model="form.price"
                    label="Retail Price ($)"
                    type="number"
                    step="0.01"
                    min="0"
                />
                <FormInput v-model="form.cost" label="Cost ($)" type="number" step="0.01" min="0" />
                <FormInput v-model="form.stock" label="Stock" type="number" min="0" />
                <FormInput
                    v-model="form.lowStockThreshold"
                    label="Low Stock Threshold"
                    type="number"
                    min="0"
                />
                <FormInput
                    v-model="form.status"
                    label="Status"
                    type="select"
                    :options="statusOptions"
                />
                <FormInput v-model="form.publisher" label="Publisher" />
                <FormInput v-model="form.releaseDate" label="Release Date" type="date" />
                <FormInput v-model="form.coverUrl" label="Cover URL" />
            </div>
            <FormInput v-model="form.description" label="Description" type="textarea" :rows="3" />
            <div class="form-actions">
                <button class="btn btn--primary" @click="saveEdit">Save Changes</button>
                <button class="btn btn--ghost" @click="showEditForm = false">Cancel</button>
            </div>
        </div>

        <div class="detail-grid">
            <div class="detail-main">
                <div class="card">
                    <img :src="product.coverUrl" :alt="product.name" class="product-hero" />
                    <div class="product-info">
                        <div class="info-row">
                            <span class="info-label">SKU</span><span>{{ product.sku }}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Platform</span
                            ><span>{{ product.platform }}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Genre</span><span>{{ product.genre }}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Publisher</span
                            ><span>{{ product.publisher }}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Release Date</span
                            ><span>{{ product.releaseDate }}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Status</span
                            ><StatusBadge :status="product.status" />
                        </div>
                        <div class="info-row">
                            <span class="info-label">Description</span
                            ><span>{{ product.description }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="detail-aside">
                <div class="card stock-card">
                    <h3 class="card-title">Inventory</h3>
                    <div
                        class="stock-display"
                        :class="{
                            'stock-display--low': product.stock <= product.lowStockThreshold
                        }"
                    >
                        <span class="stock-num">{{ product.stock }}</span>
                        <span class="stock-label">units in stock</span>
                    </div>
                    <div class="stock-meta">
                        <span
                            >Low stock threshold:
                            <strong>{{ product.lowStockThreshold }}</strong></span
                        >
                    </div>
                </div>

                <div class="card pricing-card">
                    <h3 class="card-title">Pricing</h3>
                    <div class="price-row">
                        <span class="info-label">Retail Price</span
                        ><span class="price-value">${{ product.price.toFixed(2) }}</span>
                    </div>
                    <div class="price-row">
                        <span class="info-label">Cost</span
                        ><span>${{ product.cost.toFixed(2) }}</span>
                    </div>
                    <div class="price-row">
                        <span class="info-label">Margin</span
                        ><span class="margin">{{ margin }}%</span>
                    </div>
                </div>
            </div>
        </div>

        <ConfirmModal
            :open="showConfirm"
            title="Archive Product"
            :message="`Are you sure you want to archive '${product.name}'? It will no longer appear in the active catalog.`"
            icon="trash"
            confirm-label="Archive"
            @confirm="archive"
            @cancel="showConfirm = false"
        />
    </div>
    <div v-else class="not-found">Product not found.</div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "@/components/ui/PageHeader.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import FormInput from "@/components/ui/FormInput.vue";
import ConfirmModal from "@/components/ui/ConfirmModal.vue";
import { useProductStore } from "@/stores/products";
import { useToastStore } from "@/stores/toast";
import { useNotificationStore } from "@/stores/notifications";
import type { Platform, Genre, ProductStatus } from "@/types/product";

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const toast = useToastStore();
const notif = useNotificationStore();
const showConfirm = ref(false);
const showEditForm = ref(false);

const product = computed(() => productStore.getById(route.params.id as string));
const margin = computed(() => {
    if (!product.value) return 0;
    return (((product.value.price - product.value.cost) / product.value.price) * 100).toFixed(1);
});

const platformOptions = [
    "PC",
    "PS5",
    "PS4",
    "Xbox Series X",
    "Xbox One",
    "Nintendo Switch",
    "Mobile"
].map((p) => ({ value: p, label: p }));
const genreOptions = [
    "Action",
    "RPG",
    "Strategy",
    "Sports",
    "FPS",
    "Adventure",
    "Simulation",
    "Horror",
    "Racing"
].map((g) => ({ value: g, label: g }));
const statusOptions = [
    { value: "active", label: "Active" },
    { value: "out_of_stock", label: "Out of Stock" },
    { value: "archived", label: "Archived" }
];

const form = reactive({
    name: "",
    sku: "",
    platform: "PC" as Platform,
    genre: "Action" as Genre,
    price: "0",
    cost: "0",
    stock: "0",
    lowStockThreshold: "10",
    status: "active" as ProductStatus,
    publisher: "",
    releaseDate: "",
    description: "",
    coverUrl: ""
});

function openEdit() {
    if (!product.value) return;
    Object.assign(form, {
        name: product.value.name,
        sku: product.value.sku,
        platform: product.value.platform,
        genre: product.value.genre,
        price: String(product.value.price),
        cost: String(product.value.cost),
        stock: String(product.value.stock),
        lowStockThreshold: String(product.value.lowStockThreshold),
        status: product.value.status,
        publisher: product.value.publisher,
        releaseDate: product.value.releaseDate,
        description: product.value.description,
        coverUrl: product.value.coverUrl ?? ""
    });
    showEditForm.value = true;
}

function saveEdit() {
    if (!product.value) return;
    productStore.update({
        ...product.value,
        name: form.name,
        sku: form.sku,
        platform: form.platform,
        genre: form.genre,
        price: parseFloat(String(form.price)) || 0,
        cost: parseFloat(String(form.cost)) || 0,
        stock: parseInt(String(form.stock)) || 0,
        lowStockThreshold: parseInt(String(form.lowStockThreshold)) || 10,
        status: form.status,
        publisher: form.publisher,
        releaseDate: form.releaseDate,
        description: form.description,
        coverUrl: form.coverUrl || product.value.coverUrl
    });
    toast.add({ type: "success", message: `"${form.name}" updated.` });
    notif.add("info", "Product Updated", `"${form.name}" was updated.`);
    showEditForm.value = false;
}

function archive() {
    const name = product.value?.name ?? "";
    productStore.archive(product.value!.id);
    showConfirm.value = false;
    toast.add({ type: "success", message: `"${name}" has been archived.` });
    notif.add(
        "warning",
        "Product Archived",
        `"${name}" has been archived and removed from the active catalog.`
    );
    router.push("/products");
}
</script>

<style scoped>
.detail-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 16px;
}
@media (max-width: 900px) {
    .detail-grid {
        grid-template-columns: 1fr;
    }
}
.detail-main,
.detail-aside {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.card {
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    padding: 20px;
    box-shadow: var(--shadow-sm);
}
.card-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
}
.product-hero {
    width: 100%;
    max-width: 200px;
    border-radius: var(--border-radius);
    margin-bottom: 20px;
}
.product-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.info-row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    font-size: 13px;
}
.info-label {
    font-weight: 600;
    color: var(--color-text-secondary);
    width: 110px;
    flex-shrink: 0;
}
.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    padding: 6px 0;
    border-bottom: 1px solid var(--color-border-light);
}
.price-row:last-child {
    border-bottom: none;
}
.price-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-primary);
}
.margin {
    font-weight: 700;
    color: var(--color-success);
}
.stock-display {
    text-align: center;
    padding: 16px;
    margin: 12px 0;
    background: var(--color-surface-2);
    border-radius: var(--border-radius);
}
.stock-display--low {
    background: #fff5f5;
}
.stock-num {
    display: block;
    font-size: 40px;
    font-weight: 800;
    color: var(--color-text-primary);
    line-height: 1;
}
.stock-display--low .stock-num {
    color: var(--color-danger);
}
.stock-label {
    font-size: 12px;
    color: var(--color-text-muted);
}
.stock-meta {
    font-size: 12px;
    color: var(--color-text-secondary);
}
.mb {
    margin-bottom: 20px;
}
.form-panel {
    overflow: visible;
}
.panel-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
}
.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
    margin-bottom: 14px;
}
.form-actions {
    display: flex;
    gap: 10px;
    margin-top: 16px;
}
.not-found {
    text-align: center;
    padding: 60px;
    color: var(--color-text-muted);
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
    transition: opacity var(--transition);
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
.btn:hover:not(:disabled) {
    opacity: 0.88;
}
</style>
