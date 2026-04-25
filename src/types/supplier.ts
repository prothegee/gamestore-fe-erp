export type PoStatus = "draft" | "sent" | "confirmed" | "received" | "closed";

export interface Supplier {
    id: string;
    name: string;
    contactName: string;
    email: string;
    phone: string;
    country: string;
    leadTimeDays: number;
    fillRate: number;
    defectRate: number;
    createdAt: string;
}

export interface PurchaseOrderItem {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitCost: number;
    total: number;
}

export interface PurchaseOrder {
    id: string;
    supplierId: string;
    supplierName: string;
    items: PurchaseOrderItem[];
    subtotal: number;
    status: PoStatus;
    expectedAt?: string;
    receivedAt?: string;
    createdAt: string;
    updatedAt: string;
}
