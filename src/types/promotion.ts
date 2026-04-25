export type DiscountType = "percentage" | "flat";
export type PromotionStatus = "active" | "scheduled" | "expired" | "disabled";

export interface DiscountCode {
    id: string;
    code: string;
    discountType: DiscountType;
    value: number;
    usageLimit: number;
    usageCount: number;
    expiresAt: string;
    status: PromotionStatus;
    createdAt: string;
}

export interface SaleEvent {
    id: string;
    name: string;
    discountType: DiscountType;
    value: number;
    targetGenres: string[];
    targetPlatforms: string[];
    startsAt: string;
    endsAt: string;
    status: PromotionStatus;
    redemptions: number;
    revenueImpact: number;
}
