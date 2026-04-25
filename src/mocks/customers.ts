import type { Customer } from "@/types/customer";

export const mockCustomers: Customer[] = [
    {
        id: "c1",
        name: "Alex Rivera",
        email: "alex.rivera@email.com",
        phone: "+1-555-0101",
        status: "active",
        totalOrders: 24,
        lifetimeValue: 1842.5,
        returnRate: 0.04,
        tags: ["VIP", "console"],
        createdAt: "2023-03-15T08:00:00Z",
        lastOrderAt: "2024-06-10T14:30:00Z"
    },
    {
        id: "c2",
        name: "Jordan Kim",
        email: "jordan.kim@email.com",
        phone: "+1-555-0102",
        status: "active",
        totalOrders: 8,
        lifetimeValue: 520.0,
        returnRate: 0.0,
        tags: ["PC gamer"],
        createdAt: "2023-07-22T08:00:00Z",
        lastOrderAt: "2024-05-28T10:00:00Z"
    },
    {
        id: "c3",
        name: "Sam Okafor",
        email: "sam.okafor@email.com",
        phone: "+1-555-0103",
        status: "flagged",
        totalOrders: 3,
        lifetimeValue: 189.97,
        returnRate: 0.33,
        tags: ["high-return"],
        notes: "Flagged for excessive returns in Q1.",
        createdAt: "2024-01-05T08:00:00Z",
        lastOrderAt: "2024-03-12T09:00:00Z"
    },
    {
        id: "c4",
        name: "Taylor Nguyen",
        email: "taylor.nguyen@email.com",
        phone: "+1-555-0104",
        status: "active",
        totalOrders: 41,
        lifetimeValue: 3210.75,
        returnRate: 0.02,
        tags: ["VIP", "bulk buyer"],
        createdAt: "2022-11-10T08:00:00Z",
        lastOrderAt: "2024-06-14T16:00:00Z"
    },
    {
        id: "c5",
        name: "Morgan Patel",
        email: "morgan.patel@email.com",
        phone: "+1-555-0105",
        status: "suspended",
        totalOrders: 2,
        lifetimeValue: 109.98,
        returnRate: 0.5,
        tags: ["chargeback"],
        notes: "Suspended after chargeback dispute.",
        createdAt: "2024-02-18T08:00:00Z",
        lastOrderAt: "2024-02-25T11:00:00Z"
    },
    {
        id: "c6",
        name: "Casey Lin",
        email: "casey.lin@email.com",
        phone: "+1-555-0106",
        status: "active",
        totalOrders: 15,
        lifetimeValue: 987.85,
        returnRate: 0.07,
        tags: ["RPG fan"],
        createdAt: "2023-05-01T08:00:00Z",
        lastOrderAt: "2024-06-05T13:00:00Z"
    }
];
