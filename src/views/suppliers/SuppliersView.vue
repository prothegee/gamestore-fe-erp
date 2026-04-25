<template>
    <div>
        <PageHeader title="Suppliers & Vendors" :breadcrumbs="[{ label: 'Suppliers' }]">
            <template #actions>
                <button class="btn btn--ghost" @click="openAddSupplier">
                    <AppIcon name="plus" :size="15" /> Add Supplier
                </button>
                <button class="btn btn--primary" @click="openNewPO">
                    <AppIcon name="plus" :size="15" /> New PO
                </button>
            </template>
        </PageHeader>

        <!-- Add / Edit Supplier panel -->
        <div v-if="showSupplierForm" class="form-panel card mb">
            <h3 class="panel-title">{{ editingSupplier ? "Edit Supplier" : "New Supplier" }}</h3>
            <div class="form-grid">
                <FormInput v-model="sForm.name" label="Company Name" required />
                <FormInput v-model="sForm.contactName" label="Contact Name" required />
                <FormInput v-model="sForm.email" label="Email" type="email" />
                <FormInput v-model="sForm.phone" label="Phone" />
                <FormInput v-model="sForm.country" label="Country" />
                <FormInput
                    v-model="sForm.leadTimeDays"
                    label="Lead Time (days)"
                    type="number"
                    min="1"
                />
                <FormInput
                    v-model="sForm.fillRate"
                    label="Fill Rate (0–1)"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                />
                <FormInput
                    v-model="sForm.defectRate"
                    label="Defect Rate (0–1)"
                    type="number"
                    step="0.001"
                    min="0"
                    max="1"
                />
            </div>
            <div class="form-actions">
                <button class="btn btn--primary" @click="submitSupplier">
                    {{ editingSupplier ? "Save Changes" : "Add Supplier" }}
                </button>
                <button class="btn btn--ghost" @click="closeSupplierForm">Cancel</button>
            </div>
        </div>

        <!-- New PO panel -->
        <div v-if="showPOForm" class="form-panel card mb">
            <h3 class="panel-title">New Purchase Order</h3>
            <div class="form-grid">
                <FormInput
                    v-model="poForm.supplierId"
                    label="Supplier"
                    type="select"
                    :options="supplierOptions"
                    required
                />
                <FormInput
                    v-model="poForm.productId"
                    label="Product"
                    type="select"
                    :options="productOptions"
                    required
                    @update:model-value="onProductSelect"
                />
                <FormInput
                    v-model="poForm.quantity"
                    label="Quantity"
                    type="number"
                    min="1"
                    required
                />
                <FormInput
                    v-model="poForm.unitCost"
                    label="Unit Cost ($)"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                />
                <FormInput v-model="poForm.expectedAt" label="Expected Date" type="date" />
            </div>
            <div v-if="poForm.supplierId && poForm.productId && poForm.quantity" class="po-preview">
                <span>Subtotal:</span>
                <strong
                    >${{ (Number(poForm.quantity) * Number(poForm.unitCost)).toFixed(2) }}</strong
                >
            </div>
            <div class="form-actions">
                <button class="btn btn--primary" @click="submitPO">Create PO</button>
                <button class="btn btn--ghost" @click="closePOForm">Cancel</button>
            </div>
        </div>

        <div class="section-title">Supplier Directory</div>
        <div class="supplier-grid">
            <div v-for="s in supplierStore.suppliers" :key="s.id" class="supplier-card">
                <div class="supplier-card__header">
                    <div class="supplier-avatar">{{ s.name.charAt(0) }}</div>
                    <div class="supplier-info">
                        <div class="supplier-name">{{ s.name }}</div>
                        <div class="supplier-country">{{ s.country }}</div>
                    </div>
                    <button class="edit-btn" title="Edit" @click="openEditSupplier(s)">
                        <AppIcon name="edit" :size="14" />
                    </button>
                </div>
                <div class="supplier-meta">
                    <div class="meta-row">
                        <span>Contact</span><span>{{ s.contactName }}</span>
                    </div>
                    <div class="meta-row">
                        <span>Lead Time</span><span>{{ s.leadTimeDays }} days</span>
                    </div>
                    <div class="meta-row">
                        <span>Fill Rate</span
                        ><span class="fill-rate">{{ (s.fillRate * 100).toFixed(0) }}%</span>
                    </div>
                    <div class="meta-row">
                        <span>Defect Rate</span
                        ><span class="defect-rate">{{ (s.defectRate * 100).toFixed(1) }}%</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="section-title" style="margin-top: 28px">Purchase Orders</div>
        <div class="card">
            <!-- NOTE:
           - Fetch this later to: <VITE_API_PRODUCT> (purchase orders endpoint) -->
            <DataTable
                :columns="poColumns"
                :rows="supplierStore.purchaseOrders"
                :total="supplierStore.purchaseOrders.length"
                :page="1"
                :page-size="20"
            >
                <template #cell-status="{ row }">
                    <StatusBadge :status="(row as PurchaseOrder).status" />
                </template>
                <template #cell-subtotal="{ row }">
                    <strong>${{ (row as PurchaseOrder).subtotal.toFixed(2) }}</strong>
                </template>
                <template #cell-expectedAt="{ row }">
                    {{
                        (row as PurchaseOrder).expectedAt
                            ? formatDate((row as PurchaseOrder).expectedAt!)
                            : "—"
                    }}
                </template>
                <template #actions="{ row }">
                    <div class="row-actions">
                        <select
                            class="status-select"
                            :value="(row as PurchaseOrder).status"
                            @change="
                                supplierStore.updatePOStatus(
                                    (row as PurchaseOrder).id,
                                    ($event.target as HTMLSelectElement)
                                        .value as PurchaseOrder['status']
                                )
                            "
                        >
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="received">Received</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import DataTable from "@/components/ui/DataTable.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import FormInput from "@/components/ui/FormInput.vue";
import { useSupplierStore } from "@/stores/suppliers";
import { useProductStore } from "@/stores/products";
import { useToastStore } from "@/stores/toast";
import { useNotificationStore } from "@/stores/notifications";
import type { Supplier, PurchaseOrder } from "@/types/supplier";

// NOTE:
// - Fetch this later to: <VITE_API_PRODUCT> (supplier/vendor endpoints)
const supplierStore = useSupplierStore();
const productStore = useProductStore();
const toast = useToastStore();
const notif = useNotificationStore();

// ── Supplier form ──────────────────────────────────────────────
const showSupplierForm = ref(false);
const editingSupplier = ref<Supplier | null>(null);

const sForm = reactive({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    leadTimeDays: "14",
    fillRate: "0.95",
    defectRate: "0.02"
});

function blankSForm() {
    return {
        name: "",
        contactName: "",
        email: "",
        phone: "",
        country: "",
        leadTimeDays: "14",
        fillRate: "0.95",
        defectRate: "0.02"
    };
}

function openAddSupplier() {
    editingSupplier.value = null;
    Object.assign(sForm, blankSForm());
    showSupplierForm.value = true;
}

function openEditSupplier(s: Supplier) {
    editingSupplier.value = s;
    Object.assign(sForm, {
        name: s.name,
        contactName: s.contactName,
        email: s.email,
        phone: s.phone,
        country: s.country,
        leadTimeDays: String(s.leadTimeDays),
        fillRate: String(s.fillRate),
        defectRate: String(s.defectRate)
    });
    showSupplierForm.value = true;
}

function closeSupplierForm() {
    showSupplierForm.value = false;
    editingSupplier.value = null;
}

function submitSupplier() {
    if (!sForm.name.trim()) {
        toast.add({ type: "error", message: "Company name is required." });
        return;
    }
    const draft = {
        name: sForm.name.trim(),
        contactName: sForm.contactName.trim(),
        email: sForm.email.trim(),
        phone: sForm.phone.trim(),
        country: sForm.country.trim(),
        leadTimeDays: parseInt(String(sForm.leadTimeDays)) || 14,
        fillRate: parseFloat(String(sForm.fillRate)) || 0.95,
        defectRate: parseFloat(String(sForm.defectRate)) || 0.02
    };
    if (editingSupplier.value) {
        supplierStore.updateSupplier({ ...editingSupplier.value, ...draft });
        toast.add({ type: "success", message: `"${draft.name}" updated.` });
    } else {
        supplierStore.addSupplier(draft);
        toast.add({ type: "success", message: `Supplier "${draft.name}" added.` });
        notif.add(
            "info",
            "Supplier Added",
            `"${draft.name}" has been added to the supplier directory.`
        );
    }
    closeSupplierForm();
}

// ── PO form ────────────────────────────────────────────────────
const showPOForm = ref(false);

const poForm = reactive({
    supplierId: "",
    productId: "",
    quantity: "1",
    unitCost: "0",
    expectedAt: ""
});

const supplierOptions = computed(() =>
    supplierStore.suppliers.map((s) => ({ value: s.id, label: s.name }))
);
const productOptions = computed(() =>
    productStore.products.map((p) => ({ value: p.id, label: `${p.name} (${p.sku})` }))
);

function onProductSelect(val: string | number) {
    const p = productStore.products.find((x) => x.id === String(val));
    if (p) poForm.unitCost = String(p.cost);
}

function openNewPO() {
    Object.assign(poForm, {
        supplierId: "",
        productId: "",
        quantity: "1",
        unitCost: "0",
        expectedAt: ""
    });
    showPOForm.value = true;
}

function closePOForm() {
    showPOForm.value = false;
}

function submitPO() {
    const supplier = supplierStore.suppliers.find((s) => s.id === poForm.supplierId);
    const product = productStore.products.find((p) => p.id === poForm.productId);
    if (!supplier || !product) {
        toast.add({ type: "error", message: "Select a supplier and product." });
        return;
    }
    const qty = parseInt(String(poForm.quantity)) || 1;
    const unitCost = parseFloat(String(poForm.unitCost)) || 0;
    const total = qty * unitCost;
    supplierStore.addPO({
        supplierId: supplier.id,
        supplierName: supplier.name,
        items: [
            {
                productId: product.id,
                productName: product.name,
                sku: product.sku,
                quantity: qty,
                unitCost,
                total
            }
        ],
        subtotal: total,
        status: "draft",
        expectedAt: poForm.expectedAt || undefined
    });
    toast.add({ type: "success", message: `PO for "${supplier.name}" created.` });
    notif.add(
        "info",
        "PO Created",
        `Purchase Order for ${supplier.name} — ${product.name} (×${qty}) created.`
    );
    closePOForm();
}

const poColumns = [
    { key: "id", label: "PO Number" },
    { key: "supplierName", label: "Supplier", sortable: true },
    { key: "subtotal", label: "Total", sortable: true },
    { key: "status", label: "Status" },
    { key: "expectedAt", label: "Expected" }
];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}
</script>

<style scoped>
.section-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 14px;
}
.supplier-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
    margin-bottom: 8px;
}
.supplier-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-lg);
    padding: 18px;
    box-shadow: var(--shadow-sm);
}
.supplier-card__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}
.supplier-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--color-primary);
    color: var(--color-warm);
    font-weight: 800;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.supplier-info {
    flex: 1;
    min-width: 0;
}
.supplier-name {
    font-weight: 700;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.supplier-country {
    font-size: 12px;
    color: var(--color-text-muted);
}
.edit-btn {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    padding: 4px;
    color: var(--color-text-secondary);
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
    transition: all var(--transition);
}
.edit-btn:hover {
    border-color: var(--color-secondary);
    color: var(--color-secondary);
}
.supplier-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.meta-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--color-text-secondary);
}
.meta-row span:last-child {
    font-weight: 600;
    color: var(--color-text-primary);
}
.fill-rate {
    color: var(--color-success) !important;
}
.defect-rate {
    color: var(--color-warning) !important;
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
.po-preview {
    font-size: 13px;
    padding: 10px 12px;
    background: var(--color-warm);
    color: var(--color-primary);
    border-radius: var(--border-radius);
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
}

.row-actions {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
}
.status-select {
    height: 30px;
    padding: 0 8px;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    background: var(--color-surface);
    font-size: 12px;
    cursor: pointer;
    outline: none;
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
