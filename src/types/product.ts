export type Platform =
    | "PC"
    | "PS5"
    | "PS4"
    | "Xbox Series X"
    | "Xbox One"
    | "Nintendo Switch"
    | "Mobile";
export type Genre =
    | "Action"
    | "RPG"
    | "Strategy"
    | "Sports"
    | "FPS"
    | "Adventure"
    | "Simulation"
    | "Horror"
    | "Racing";
export type ProductStatus = "active" | "archived" | "out_of_stock";

export interface Product {
    id: string;
    name: string;
    sku: string;
    platform: Platform;
    genre: Genre;
    price: number;
    cost: number;
    stock: number;
    lowStockThreshold: number;
    status: ProductStatus;
    mediaAssetId?: string;
    coverUrl?: string;
    description: string;
    publisher: string;
    releaseDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface StockUpdate {
    productId: string;
    delta: number;
    reason: string;
}
