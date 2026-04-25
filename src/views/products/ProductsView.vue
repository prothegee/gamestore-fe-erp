<template>
    <div>
        <PageHeader title="Products & Inventory" :breadcrumbs="[{ label: 'Products' }]">
            <template #actions>
                <button class="btn btn--primary" @click="openAdd">
                    <AppIcon name="plus" :size="15" /> Add Product
                </button>
            </template>
        </PageHeader>

        <!-- Add / Edit panel -->
        <div v-if="showForm" class="form-panel card mb">
            <h3 class="panel-title">{{ editingProduct ? "Edit Product" : "New Product" }}</h3>
            <div class="form-grid">
                <FormInput
                    v-model="form.name"
                    label="Name"
                    required
                    placeholder="e.g. Elden Ring"
                />
                <FormInput v-model="form.sku" label="SKU" required placeholder="e.g. ER-PS5-001" />
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
                <FormInput
                    v-model="form.publisher"
                    label="Publisher"
                    placeholder="e.g. Bandai Namco"
                />
                <FormInput v-model="form.releaseDate" label="Release Date" type="date" />
                <FormInput
                    v-model="form.coverUrl"
                    label="Cover URL"
                    placeholder="https://… (optional)"
                />
            </div>
            <FormInput v-model="form.description" label="Description" type="textarea" :rows="3" />
            <div class="form-actions">
                <button class="btn btn--primary" @click="submitForm">
                    {{ editingProduct ? "Save Changes" : "Add Product" }}
                </button>
                <button class="btn btn--ghost" @click="closeForm">Cancel</button>
            </div>
        </div>

        <div class="filters">
            <SearchBar v-model="search" placeholder="Search by name or SKU…" />
            <select v-model="filterPlatform" class="filter-select">
                <option value="">All Platforms</option>
                <option v-for="p in platforms" :key="p" :value="p">{{ p }}</option>
            </select>
            <select v-model="filterStatus" class="filter-select">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="archived">Archived</option>
            </select>
        </div>

        <div class="card">
            <DataTable
                :columns="columns"
                :rows="filtered"
                :total="filtered.length"
                :page="1"
                :page-size="20"
                :sort-state="sortState"
                @sort="onSort"
            >
                <template #cell-coverUrl="{ row }">
                    <img
                        :src="(row as Product).coverUrl"
                        :alt="(row as Product).name"
                        class="product-cover"
                    />
                </template>
                <template #cell-name="{ row }">
                    <div>
                        <span class="product-name">{{ (row as Product).name }}</span>
                        <span class="product-publisher">{{ (row as Product).publisher }}</span>
                    </div>
                </template>
                <template #cell-price="{ row }">
                    ${{ (row as Product).price.toFixed(2) }}
                </template>
                <template #cell-stock="{ row }">
                    <span
                        class="stock-count"
                        :class="{
                            'stock-count--low':
                                (row as Product).stock > 0 &&
                                (row as Product).stock <= (row as Product).lowStockThreshold,
                            'stock-count--zero': (row as Product).stock === 0
                        }"
                    >
                        {{ (row as Product).stock }}
                    </span>
                </template>
                <template #cell-status="{ row }">
                    <StatusBadge :status="(row as Product).status" />
                </template>
                <template #actions="{ row }">
                    <div class="row-actions">
                        <RouterLink
                            :to="`/products/${(row as Product).id}`"
                            class="action-btn"
                            title="View"
                        >
                            <AppIcon name="eye" :size="15" />
                        </RouterLink>
                        <button class="action-btn" title="Edit" @click="openEdit(row as Product)">
                            <AppIcon name="edit" :size="15" />
                        </button>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { RouterLink } from "vue-router";
import PageHeader from "@/components/ui/PageHeader.vue";
import SearchBar from "@/components/ui/SearchBar.vue";
import DataTable from "@/components/ui/DataTable.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import FormInput from "@/components/ui/FormInput.vue";
import { useProductStore } from "@/stores/products";
import { useToastStore } from "@/stores/toast";
import { useNotificationStore } from "@/stores/notifications";
import type { Product, Platform, Genre, ProductStatus } from "@/types/product";
import type { SortState } from "@/types/common";

// NOTE:
// - Fetch this later to: <VITE_API_PRODUCT>
const productStore = useProductStore();
const toast = useToastStore();
const notif = useNotificationStore();

const search = ref("");
const filterPlatform = ref("");
const filterStatus = ref("");
const sortState = ref<SortState>({ field: "name", dir: "asc" });
const showForm = ref(false);
const editingProduct = ref<Product | null>(null);

const platforms: Platform[] = [
    "PC",
    "PS5",
    "PS4",
    "Xbox Series X",
    "Xbox One",
    "Nintendo Switch",
    "Mobile"
];
const platformOptions = platforms.map((p) => ({ value: p, label: p }));
const genreOptions: { value: Genre; label: Genre }[] = [
    "Action",
    "RPG",
    "Strategy",
    "Sports",
    "FPS",
    "Adventure",
    "Simulation",
    "Horror",
    "Racing"
].map((g) => ({ value: g as Genre, label: g as Genre }));
const statusOptions = [
    { value: "active", label: "Active" },
    { value: "out_of_stock", label: "Out of Stock" },
    { value: "archived", label: "Archived" }
];

function blankForm() {
    return {
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
    };
}

const form = reactive(blankForm());

function openAdd() {
    editingProduct.value = null;
    Object.assign(form, blankForm());
    showForm.value = true;
}

function openEdit(p: Product) {
    editingProduct.value = p;
    Object.assign(form, {
        name: p.name,
        sku: p.sku,
        platform: p.platform,
        genre: p.genre,
        price: String(p.price),
        cost: String(p.cost),
        stock: String(p.stock),
        lowStockThreshold: String(p.lowStockThreshold),
        status: p.status,
        publisher: p.publisher,
        releaseDate: p.releaseDate,
        description: p.description,
        coverUrl: p.coverUrl ?? ""
    });
    showForm.value = true;
}

function closeForm() {
    showForm.value = false;
    editingProduct.value = null;
}

function submitForm() {
    if (!form.name.trim() || !form.sku.trim()) {
        toast.add({ type: "error", message: "Name and SKU are required." });
        return;
    }
    const draft = {
        name: form.name.trim(),
        sku: form.sku.trim().toUpperCase(),
        platform: form.platform,
        genre: form.genre,
        price: parseFloat(String(form.price)) || 0,
        cost: parseFloat(String(form.cost)) || 0,
        stock: parseInt(String(form.stock)) || 0,
        lowStockThreshold: parseInt(String(form.lowStockThreshold)) || 10,
        status: form.status,
        publisher: form.publisher.trim(),
        releaseDate: form.releaseDate,
        description: form.description.trim(),
        coverUrl:
            form.coverUrl.trim() ||
            `https://placehold.co/120x160/026C96/FFE3AD?text=${encodeURIComponent(form.name)}`
    };
    if (editingProduct.value) {
        productStore.update({ ...editingProduct.value, ...draft });
        toast.add({ type: "success", message: `"${draft.name}" updated.` });
        notif.add("info", "Product Updated", `"${draft.name}" was updated in the catalog.`);
    } else {
        productStore.add(draft);
        toast.add({ type: "success", message: `"${draft.name}" added to catalog.` });
        notif.add(
            "success",
            "Product Added",
            `"${draft.name}" (${draft.sku}) was added to the catalog.`
        );
    }
    closeForm();
}

const columns = [
    { key: "coverUrl", label: "", width: "60px" },
    { key: "name", label: "Name", sortable: true },
    { key: "sku", label: "SKU" },
    { key: "platform", label: "Platform", sortable: true },
    { key: "genre", label: "Genre" },
    { key: "price", label: "Price", sortable: true },
    { key: "stock", label: "Stock", sortable: true },
    { key: "status", label: "Status" }
];

const filtered = computed(() => {
    let list = [...productStore.products];
    if (search.value) {
        const q = search.value.toLowerCase();
        list = list.filter(
            (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
        );
    }
    if (filterPlatform.value) list = list.filter((p) => p.platform === filterPlatform.value);
    if (filterStatus.value) list = list.filter((p) => p.status === filterStatus.value);
    return list.sort((a, b) => {
        const dir = sortState.value.dir === "asc" ? 1 : -1;
        const f = sortState.value.field as keyof Product;
        return (a[f]! > b[f]! ? 1 : -1) * dir;
    });
});

function onSort(field: string) {
    if (sortState.value.field === field) {
        sortState.value.dir = sortState.value.dir === "asc" ? "desc" : "asc";
    } else {
        sortState.value = { field, dir: "asc" };
    }
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
    color: var(--color-text-primary);
    font-size: 13px;
    outline: none;
    cursor: pointer;
}
.card {
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
}
.mb {
    margin-bottom: 20px;
}

.form-panel {
    padding: 20px;
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

.product-cover {
    width: 36px;
    height: 48px;
    object-fit: cover;
    border-radius: 4px;
    display: block;
}
.product-name {
    display: block;
    font-weight: 600;
    font-size: 13px;
}
.product-publisher {
    display: block;
    font-size: 11px;
    color: var(--color-text-muted);
}
.stock-count {
    font-weight: 700;
}
.stock-count--low {
    color: var(--color-warning);
}
.stock-count--zero {
    color: var(--color-danger);
}
.row-actions {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
}
.action-btn {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    padding: 5px;
    color: var(--color-text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all var(--transition);
    text-decoration: none;
}
.action-btn:hover {
    border-color: var(--color-secondary);
    color: var(--color-secondary);
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
.btn--primary:hover {
    opacity: 0.88;
}
.btn--ghost {
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
}
.btn--ghost:hover {
    opacity: 0.88;
}
</style>
