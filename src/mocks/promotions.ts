import type { DiscountCode, SaleEvent } from "@/types/promotion";

export const mockDiscountCodes: DiscountCode[] = [
    {
        id: "dc1",
        code: "SUMMER24",
        discountType: "percentage",
        value: 15,
        usageLimit: 500,
        usageCount: 312,
        expiresAt: "2024-08-31T23:59:59Z",
        status: "active",
        createdAt: "2024-06-01T08:00:00Z"
    },
    {
        id: "dc2",
        code: "NEWUSER10",
        discountType: "flat",
        value: 10,
        usageLimit: 1000,
        usageCount: 867,
        expiresAt: "2024-12-31T23:59:59Z",
        status: "active",
        createdAt: "2024-01-01T08:00:00Z"
    },
    {
        id: "dc3",
        code: "SPRING20",
        discountType: "percentage",
        value: 20,
        usageLimit: 200,
        usageCount: 200,
        expiresAt: "2024-05-31T23:59:59Z",
        status: "expired",
        createdAt: "2024-03-01T08:00:00Z"
    },
    {
        id: "dc4",
        code: "VIP50",
        discountType: "flat",
        value: 50,
        usageLimit: 10,
        usageCount: 3,
        expiresAt: "2024-12-31T23:59:59Z",
        status: "active",
        createdAt: "2024-06-10T08:00:00Z"
    }
];

export const mockSaleEvents: SaleEvent[] = [
    {
        id: "se1",
        name: "Summer RPG Blowout",
        discountType: "percentage",
        value: 20,
        targetGenres: ["RPG"],
        targetPlatforms: ["PC", "PS5"],
        startsAt: "2024-07-01T00:00:00Z",
        endsAt: "2024-07-07T23:59:59Z",
        status: "scheduled",
        redemptions: 0,
        revenueImpact: 0
    },
    {
        id: "se2",
        name: "Xbox Weekend Deal",
        discountType: "percentage",
        value: 10,
        targetGenres: [],
        targetPlatforms: ["Xbox Series X", "Xbox One"],
        startsAt: "2024-06-15T00:00:00Z",
        endsAt: "2024-06-17T23:59:59Z",
        status: "active",
        redemptions: 88,
        revenueImpact: -620.4
    },
    {
        id: "se3",
        name: "Spring Clearance",
        discountType: "flat",
        value: 5,
        targetGenres: ["Strategy", "Simulation"],
        targetPlatforms: [],
        startsAt: "2024-04-01T00:00:00Z",
        endsAt: "2024-04-30T23:59:59Z",
        status: "expired",
        redemptions: 245,
        revenueImpact: -1225.0
    }
];
