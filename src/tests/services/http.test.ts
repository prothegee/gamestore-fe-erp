import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { createServiceClient } from "@/services/http";

function mockFetch(status: number, body: unknown, ok?: boolean) {
    return vi.fn().mockResolvedValue({
        ok: ok ?? (status >= 200 && status < 300),
        status,
        text: async () => (body === "" ? "" : JSON.stringify(body))
    });
}

describe("createServiceClient", () => {
    beforeEach(() => {
        localStorage.clear();
        setActivePinia(createPinia());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("GET — sends correct method and URL", async () => {
        vi.stubGlobal("fetch", mockFetch(200, { ok: true }));
        const client = createServiceClient("http://localhost:9001");
        const result = await client.get<{ ok: boolean }>("/ping");
        expect(vi.mocked(fetch).mock.calls[0][0]).toBe("http://localhost:9001/ping");
        expect((vi.mocked(fetch).mock.calls[0][1] as RequestInit).method).toBe("GET");
        expect(result).toEqual({ ok: true });
    });

    it("GET — appends query params when params option is provided", async () => {
        vi.stubGlobal("fetch", mockFetch(200, []));
        const client = createServiceClient("http://localhost:9003");
        await client.get("/products", { params: { q: "elden", page: 2, active: true } });
        const url = vi.mocked(fetch).mock.calls[0][0] as string;
        expect(url).toContain("q=elden");
        expect(url).toContain("page=2");
        expect(url).toContain("active=true");
    });

    it("GET — strips trailing slash from baseURL", async () => {
        vi.stubGlobal("fetch", mockFetch(200, {}));
        const client = createServiceClient("http://localhost:9001/");
        await client.get("/users");
        const url = vi.mocked(fetch).mock.calls[0][0] as string;
        expect(url).toBe("http://localhost:9001/users");
    });

    it("GET — attaches Bearer token from localStorage", async () => {
        localStorage.setItem("erp_token", "jwt-abc-123");
        vi.stubGlobal("fetch", mockFetch(200, {}));
        const client = createServiceClient("http://localhost:9001");
        await client.get("/me");
        const headers = (vi.mocked(fetch).mock.calls[0][1] as RequestInit).headers as Headers;
        expect(headers.get("Authorization")).toBe("Bearer jwt-abc-123");
    });

    it("GET — omits Authorization header when no token", async () => {
        vi.stubGlobal("fetch", mockFetch(200, {}));
        const client = createServiceClient("http://localhost:9001");
        await client.get("/public");
        const headers = (vi.mocked(fetch).mock.calls[0][1] as RequestInit).headers as Headers;
        expect(headers.has("Authorization")).toBe(false);
    });

    it("POST — sends JSON body and Content-Type header", async () => {
        vi.stubGlobal("fetch", mockFetch(200, { id: "new-1" }));
        const client = createServiceClient("http://localhost:9003");
        const payload = { name: "Elden Ring", price: 59.99 };
        const result = await client.post<{ id: string }>("/products", payload);
        const opts = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
        expect(opts.method).toBe("POST");
        expect(opts.body).toBe(JSON.stringify(payload));
        const headers = opts.headers as Headers;
        expect(headers.get("Content-Type")).toBe("application/json");
        expect(result).toEqual({ id: "new-1" });
    });

    it("PUT — sends correct method and body", async () => {
        vi.stubGlobal("fetch", mockFetch(200, { updated: true }));
        const client = createServiceClient("http://localhost:9003");
        await client.put("/products/p1", { stock: 50 });
        const opts = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
        expect(opts.method).toBe("PUT");
        expect(opts.body).toBe(JSON.stringify({ stock: 50 }));
    });

    it("PATCH — sends correct method and body", async () => {
        vi.stubGlobal("fetch", mockFetch(200, { patched: true }));
        const client = createServiceClient("http://localhost:9003");
        await client.patch("/products/p1", { status: "archived" });
        const opts = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
        expect(opts.method).toBe("PATCH");
    });

    it("DELETE — sends correct method with no body", async () => {
        vi.stubGlobal("fetch", mockFetch(200, ""));
        const client = createServiceClient("http://localhost:9003");
        const result = await client.delete("/products/p1");
        const opts = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
        expect(opts.method).toBe("DELETE");
        expect(result).toEqual({});
    });

    it("401 — throws Unauthorized error", async () => {
        vi.stubGlobal("fetch", mockFetch(401, "Unauthorized"));
        const client = createServiceClient("http://localhost:9001");
        await expect(client.get("/protected")).rejects.toThrow("Unauthorized");
    });

    it("403 — throws Forbidden error", async () => {
        vi.stubGlobal("fetch", mockFetch(403, "Forbidden"));
        const client = createServiceClient("http://localhost:9001");
        await expect(client.get("/admin-only")).rejects.toThrow("Forbidden");
    });

    it("500 — throws Server error", async () => {
        vi.stubGlobal("fetch", mockFetch(500, "Internal Server Error"));
        const client = createServiceClient("http://localhost:9001");
        await expect(client.get("/broken")).rejects.toThrow("Server error");
    });

    it("503 — throws Server error (any 5xx)", async () => {
        vi.stubGlobal("fetch", mockFetch(503, "Service Unavailable"));
        const client = createServiceClient("http://localhost:9001");
        await expect(client.get("/service")).rejects.toThrow("Server error");
    });

    it("empty response body returns empty object", async () => {
        vi.stubGlobal("fetch", mockFetch(200, ""));
        const client = createServiceClient("http://localhost:9001");
        const result = await client.get<Record<string, never>>("/empty");
        expect(result).toEqual({});
    });
});
