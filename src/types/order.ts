export type OrderStatus =
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "completed"
    | "cancelled";
export type ReturnStatus = "requested" | "approved" | "received" | "refunded" | "rejected";

export interface OrderItem {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface Order {
    id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: OrderStatus;
    shippingAddress: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReturnRequest {
    id: string;
    orderId: string;
    customerId: string;
    reason: string;
    status: ReturnStatus;
    refundAmount: number;
    createdAt: string;
    updatedAt: string;
}
