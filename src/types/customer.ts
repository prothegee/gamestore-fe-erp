export type CustomerStatus = "active" | "suspended" | "flagged";

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status: CustomerStatus;
    totalOrders: number;
    lifetimeValue: number;
    returnRate: number;
    tags: string[];
    notes?: string;
    createdAt: string;
    lastOrderAt?: string;
}
