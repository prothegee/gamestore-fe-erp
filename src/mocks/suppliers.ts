import type { Supplier, PurchaseOrder } from "@/types/supplier";

export const mockSuppliers: Supplier[] = [
    {
        id: "s1",
        name: "Bandai Namco Distribution",
        contactName: "Yuki Tanaka",
        email: "yuki@bandainamco-dist.com",
        phone: "+81-3-5555-0001",
        country: "Japan",
        leadTimeDays: 14,
        fillRate: 0.97,
        defectRate: 0.01,
        createdAt: "2023-01-10T08:00:00Z"
    },
    {
        id: "s2",
        name: "Sony Interactive Supply",
        contactName: "Maria Garcia",
        email: "mgarcia@sony-supply.com",
        phone: "+1-310-555-0002",
        country: "USA",
        leadTimeDays: 7,
        fillRate: 0.99,
        defectRate: 0.005,
        createdAt: "2023-02-15T08:00:00Z"
    },
    {
        id: "s3",
        name: "Nintendo Americas",
        contactName: "Chris Wong",
        email: "cwong@nintendo-americas.com",
        phone: "+1-425-555-0003",
        country: "USA",
        leadTimeDays: 10,
        fillRate: 0.95,
        defectRate: 0.02,
        createdAt: "2023-03-01T08:00:00Z"
    },
    {
        id: "s4",
        name: "Activision Fulfillment EU",
        contactName: "Hans Müller",
        email: "hmuller@activision-eu.com",
        phone: "+49-30-555-0004",
        country: "Germany",
        leadTimeDays: 21,
        fillRate: 0.9,
        defectRate: 0.03,
        createdAt: "2023-04-20T08:00:00Z"
    }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
    {
        id: "po-001",
        supplierId: "s1",
        supplierName: "Bandai Namco Distribution",
        items: [
            {
                productId: "p1",
                productName: "Elden Ring",
                sku: "ER-PS5-001",
                quantity: 50,
                unitCost: 30.0,
                total: 1500.0
            }
        ],
        subtotal: 1500.0,
        status: "confirmed",
        expectedAt: "2024-06-25T00:00:00Z",
        createdAt: "2024-06-11T08:00:00Z",
        updatedAt: "2024-06-12T10:00:00Z"
    },
    {
        id: "po-002",
        supplierId: "s2",
        supplierName: "Sony Interactive Supply",
        items: [
            {
                productId: "p5",
                productName: "Call of Duty: MW3",
                sku: "COD-PS5-001",
                quantity: 100,
                unitCost: 38.0,
                total: 3800.0
            },
            {
                productId: "p7",
                productName: "Spider-Man 2",
                sku: "SM2-PS5-001",
                quantity: 40,
                unitCost: 36.0,
                total: 1440.0
            }
        ],
        subtotal: 5240.0,
        status: "sent",
        expectedAt: "2024-06-22T00:00:00Z",
        createdAt: "2024-06-13T09:00:00Z",
        updatedAt: "2024-06-13T09:00:00Z"
    },
    {
        id: "po-003",
        supplierId: "s3",
        supplierName: "Nintendo Americas",
        items: [
            {
                productId: "p4",
                productName: "Zelda: TotK",
                sku: "TOTK-NSW-001",
                quantity: 30,
                unitCost: 25.0,
                total: 750.0
            }
        ],
        subtotal: 750.0,
        status: "draft",
        createdAt: "2024-06-15T11:00:00Z",
        updatedAt: "2024-06-15T11:00:00Z"
    }
];
