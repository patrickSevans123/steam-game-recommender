import type { Game, SearchResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchApi<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function searchGames(query: string, limit = 20): Promise<SearchResponse> {
  return fetchApi<SearchResponse>("/api/search", { q: query, limit: String(limit) });
}

export async function getGame(id: number): Promise<Game> {
  return fetchApi<Game>(`/api/games/${id}`);
}

export async function getSimilarGames(id: number, limit = 8): Promise<SearchResponse> {
  return fetchApi<SearchResponse>(`/api/games/${id}/similar`, { limit: String(limit) });
}

export async function getTrending(limit = 12): Promise<SearchResponse> {
  return fetchApi<SearchResponse>("/api/trending", { limit: String(limit) });
}
