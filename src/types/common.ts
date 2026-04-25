export type RbacRole = "superadmin" | "manager" | "staff" | "viewer";

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    cursor?: string;
}

export interface ApiError {
    code: number;
    message: string;
}

export type SortDir = "asc" | "desc";

export interface SortState {
    field: string;
    dir: SortDir;
}

export interface DateRange {
    from: string;
    to: string;
}
