import type { Game, SearchResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SearchFilters {
  genre?: string;
  platform?: string;
  price_min?: number;
  price_max?: number;
}

async function fetchApi<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function searchGames(
  query: string,
  limit = 20,
  filters?: SearchFilters,
): Promise<SearchResponse> {
  const params: Record<string, string> = { q: query, limit: String(limit), rerank: "true" };
  if (filters?.genre) params.genre = filters.genre;
  if (filters?.platform) params.platform = filters.platform;
  if (filters?.price_min !== undefined) params.price_min = String(filters.price_min);
  if (filters?.price_max !== undefined) params.price_max = String(filters.price_max);
  return fetchApi<SearchResponse>("/api/search", params);
}

export async function getGame(id: number): Promise<Game> {
  return fetchApi<Game>(`/api/games/${id}`);
}

export async function getSimilarGames(
  id: number,
  limit = 8,
  rerank = false,
): Promise<SearchResponse> {
  return fetchApi<SearchResponse>(`/api/games/${id}/similar`, {
    limit: String(limit),
    rerank: String(rerank),
  });
}

export async function getTrending(limit = 12): Promise<SearchResponse> {
  return fetchApi<SearchResponse>("/api/trending", { limit: String(limit) });
}

// Chat API

export interface ChatResponse {
  response: string;
  session_id: string;
  games_retrieved: number;
}

export async function sendChatMessage(
  query: string,
  sessionId?: string,
  filters?: SearchFilters,
): Promise<ChatResponse> {
  const body = {
    query,
    stream: false,
    ...(sessionId && { session_id: sessionId }),
    ...(filters?.genre && { genre: filters.genre }),
    ...(filters?.platform && { platform: filters.platform }),
    ...(filters?.price_min !== undefined && { price_min: filters.price_min }),
    ...(filters?.price_max !== undefined && { price_max: filters.price_max }),
  };

  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Chat API error: ${res.status}`);
  return res.json();
}

export async function clearChatSession(sessionId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/chat/session/${sessionId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to clear session: ${res.status}`);
}
