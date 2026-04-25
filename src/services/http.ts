import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean>;
}

async function request<T>(baseURL: string, path: string, options: RequestOptions = {}): Promise<T> {
    const auth = useAuthStore();
    const toast = useToastStore();

    const { params, ...fetchOptions } = options;

    let url = baseURL.replace(/\/$/, "") + path;
    if (params) {
        const qs = new URLSearchParams(
            Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
        ).toString();
        url += "?" + qs;
    }

    const token = localStorage.getItem("erp_token");
    const headers = new Headers(fetchOptions.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type") && fetchOptions.body) {
        headers.set("Content-Type", "application/json");
    }

    const res = await fetch(url, { ...fetchOptions, headers });

    if (res.status === 401) {
        auth.logout();
        throw new Error("Unauthorized");
    }
    if (res.status === 403) {
        toast.add({ type: "error", message: "You do not have permission to perform this action." });
        throw new Error("Forbidden");
    }
    if (res.status >= 500) {
        toast.add({ type: "error", message: "A service error occurred. Please try again." });
        throw new Error("Server error");
    }
    if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
    }

    const text = await res.text();
    return text ? (JSON.parse(text) as T) : ({} as T);
}

export function createServiceClient(baseURL: string) {
    return {
        get: <T>(path: string, options?: RequestOptions) =>
            request<T>(baseURL, path, { ...options, method: "GET" }),
        post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
            request<T>(baseURL, path, { ...options, method: "POST", body: JSON.stringify(body) }),
        put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
            request<T>(baseURL, path, { ...options, method: "PUT", body: JSON.stringify(body) }),
        patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
            request<T>(baseURL, path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
        delete: <T>(path: string, options?: RequestOptions) =>
            request<T>(baseURL, path, { ...options, method: "DELETE" })
    };
}
