/** Cliente del lado del navegador para la API Next.js (misma app, mismo origen). */
import type { CatalogTool, HybridSearchResult, RagArchitectureResponse } from "./types";

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export const api = {
  catalog: (params?: { category?: string; license?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>);
    const s = q.toString();
    return getJson<CatalogTool[]>(`/api/v1/catalog${s ? `?${s}` : ""}`);
  },
  hybridSearch: (query: string, embedding?: number[]) =>
    getJson<HybridSearchResult[]>("/api/v1/hybrid-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, embedding }),
    }),
  ragArchitecture: (prompt: string) =>
    getJson<RagArchitectureResponse>("/api/v1/rag/architecture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    }),
};
