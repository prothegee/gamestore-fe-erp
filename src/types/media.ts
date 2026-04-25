export type AssetType = "cover" | "banner" | "trailer" | "screenshot";

export interface MediaAsset {
    id: string;
    name: string;
    type: AssetType;
    url: string;
    size: number;
    mimeType: string;
    linkedProductIds: string[];
    tags: string[];
    uploadedAt: string;
}
