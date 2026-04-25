import type { Order, ReturnRequest } from "@/types/order";

export const mockOrders: Order[] = [
    {
        id: "ord-001",
        customerId: "c1",
        customerName: "Alex Rivera",
        customerEmail: "alex.rivera@email.com",
        items: [
            {
                productId: "p1",
                productName: "Elden Ring",
                sku: "ER-PS5-001",
                quantity: 1,
                unitPrice: 59.99,
                total: 59.99
            }
        ],
        subtotal: 59.99,
        tax: 5.4,
        total: 65.39,
        status: "completed",
        shippingAddress: "123 Main St, Austin TX 78701",
        createdAt: "2024-06-10T10:00:00Z",
        updatedAt: "2024-06-14T15:00:00Z"
    },
    {
        id: "ord-002",
        customerId: "c4",
        customerName: "Taylor Nguyen",
        customerEmail: "taylor.nguyen@email.com",
        items: [
            {
                productId: "p3",
                productName: "FIFA 25",
                sku: "FIFA-XSX-001",
                quantity: 2,
                unitPrice: 69.99,
                total: 139.98
            },
            {
                productId: "p8",
                productName: "Forza Horizon 5",
                sku: "FH5-XSX-001",
                quantity: 1,
                unitPrice: 59.99,
                total: 59.99
            }
        ],
        subtotal: 199.97,
        tax: 18.0,
        total: 217.97,
        status: "shipped",
        shippingAddress: "456 Oak Ave, Dallas TX 75201",
        createdAt: "2024-06-14T09:00:00Z",
        updatedAt: "2024-06-15T08:00:00Z"
    },
    {
        id: "ord-003",
        customerId: "c2",
        customerName: "Jordan Kim",
        customerEmail: "jordan.kim@email.com",
        items: [
            {
                productId: "p2",
                productName: "Cyberpunk 2077",
                sku: "CP-PC-001",
                quantity: 1,
                unitPrice: 39.99,
                total: 39.99
            }
        ],
        subtotal: 39.99,
        tax: 3.6,
        total: 43.59,
        status: "processing",
        shippingAddress: "789 Elm St, Seattle WA 98101",
        createdAt: "2024-06-15T11:30:00Z",
        updatedAt: "2024-06-15T12:00:00Z"
    },
    {
        id: "ord-004",
        customerId: "c3",
        customerName: "Sam Okafor",
        customerEmail: "sam.okafor@email.com",
        items: [
            {
                productId: "p9",
                productName: "Resident Evil 4",
                sku: "RE4-PS5-001",
                quantity: 1,
                unitPrice: 49.99,
                total: 49.99
            }
        ],
        subtotal: 49.99,
        tax: 4.5,
        total: 54.49,
        status: "cancelled",
        shippingAddress: "321 Pine Rd, Chicago IL 60601",
        createdAt: "2024-06-12T14:00:00Z",
        updatedAt: "2024-06-12T16:00:00Z"
    },
    {
        id: "ord-005",
        customerId: "c6",
        customerName: "Casey Lin",
        customerEmail: "casey.lin@email.com",
        items: [
            {
                productId: "p4",
                productName: "Zelda: TotK",
                sku: "TOTK-NSW-001",
                quantity: 1,
                unitPrice: 59.99,
                total: 59.99
            },
            {
                productId: "p1",
                productName: "Elden Ring",
                sku: "ER-PS5-001",
                quantity: 1,
                unitPrice: 59.99,
                total: 59.99
            }
        ],
        subtotal: 119.98,
        tax: 10.8,
        total: 130.78,
        status: "pending",
        shippingAddress: "654 Maple Dr, Portland OR 97201",
        createdAt: "2024-06-15T15:45:00Z",
        updatedAt: "2024-06-15T15:45:00Z"
    },
    {
        id: "ord-006",
        customerId: "c1",
        customerName: "Alex Rivera",
        customerEmail: "alex.rivera@email.com",
        items: [
            {
                productId: "p7",
                productName: "Spider-Man 2",
                sku: "SM2-PS5-001",
                quantity: 1,
                unitPrice: 69.99,
                total: 69.99
            }
        ],
        subtotal: 69.99,
        tax: 6.3,
        total: 76.29,
        status: "delivered",
        shippingAddress: "123 Main St, Austin TX 78701",
        createdAt: "2024-06-08T10:00:00Z",
        updatedAt: "2024-06-12T14:00:00Z"
    }
];

export const mockReturnRequests: ReturnRequest[] = [
    {
        id: "ret-001",
        orderId: "ord-001",
        customerId: "c3",
        reason: "Disc scratched on arrival",
        status: "refunded",
        refundAmount: 54.49,
        createdAt: "2024-06-13T10:00:00Z",
        updatedAt: "2024-06-14T10:00:00Z"
    },
    {
        id: "ret-002",
        orderId: "ord-006",
        customerId: "c1",
        reason: "Wrong platform edition received",
        status: "approved",
        refundAmount: 76.29,
        createdAt: "2024-06-13T14:00:00Z",
        updatedAt: "2024-06-13T16:00:00Z"
    }
];
