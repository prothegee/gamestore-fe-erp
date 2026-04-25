import type { MediaAsset } from "@/types/media";

export const mockMediaAssets: MediaAsset[] = [
    {
        id: "ma1",
        name: "elden-ring-cover.jpg",
        type: "cover",
        url: "https://placehold.co/400x560/026C96/FFE3AD?text=Elden+Ring",
        size: 245760,
        mimeType: "image/jpeg",
        linkedProductIds: ["p1"],
        tags: ["RPG", "PS5", "FromSoftware"],
        uploadedAt: "2024-01-10T09:00:00Z"
    },
    {
        id: "ma2",
        name: "cyberpunk-cover.jpg",
        type: "cover",
        url: "https://placehold.co/400x560/288DA9/FFE3AD?text=Cyberpunk",
        size: 312000,
        mimeType: "image/jpeg",
        linkedProductIds: ["p2"],
        tags: ["RPG", "PC", "CDPR"],
        uploadedAt: "2024-01-11T09:00:00Z"
    },
    {
        id: "ma3",
        name: "summer-sale-banner.jpg",
        type: "banner",
        url: "https://placehold.co/1200x400/FDA46F/026C96?text=Summer+Sale",
        size: 189000,
        mimeType: "image/jpeg",
        linkedProductIds: [],
        tags: ["promo", "summer", "banner"],
        uploadedAt: "2024-06-01T09:00:00Z"
    },
    {
        id: "ma4",
        name: "spider-man-cover.jpg",
        type: "cover",
        url: "https://placehold.co/400x560/288DA9/FFE3AD?text=Spider-Man+2",
        size: 290000,
        mimeType: "image/jpeg",
        linkedProductIds: ["p7"],
        tags: ["Action", "PS5", "Insomniac"],
        uploadedAt: "2024-01-25T09:00:00Z"
    },
    {
        id: "ma5",
        name: "zelda-cover.jpg",
        type: "cover",
        url: "https://placehold.co/400x560/7BC3AF/026C96?text=TotK",
        size: 275000,
        mimeType: "image/jpeg",
        linkedProductIds: ["p4"],
        tags: ["Adventure", "Switch", "Nintendo"],
        uploadedAt: "2024-01-15T09:00:00Z"
    },
    {
        id: "ma6",
        name: "homepage-hero.jpg",
        type: "banner",
        url: "https://placehold.co/1920x600/026C96/FFE3AD?text=GameStore+Hero",
        size: 480000,
        mimeType: "image/jpeg",
        linkedProductIds: [],
        tags: ["hero", "homepage"],
        uploadedAt: "2024-03-01T09:00:00Z"
    }
];
