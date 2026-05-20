"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Search, ArrowLeft, Loader2, AlertCircle, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import GameGrid from "@/components/GameGrid";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { searchGames } from "@/lib/api";
import type { Game, SearchFilters } from "@/lib/types";

const GENRES = [
  "Action", "Adventure", "Casual", "Early Access", "Free to Play",
  "Indie", "Massively Multiplayer", "Racing", "RPG", "Simulation",
  "Sports", "Strategy",
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const doSearch = useCallback(async (q: string, f: SearchFilters) => {
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const res = await searchGames(q, 20, f);
      setGames(res.results.map((r) => r.game));
      setTotal(res.total);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    doSearch(query, filters);
  }, [query, filters, doSearch]);

  const toggleGenre = (g: string) => {
    setFilters((prev) => ({
      ...prev,
      genre: prev.genre === g ? undefined : g,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  const filterCount = Object.values(filters).filter((v) => v !== undefined).length;

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-background via-[#0b0a1e] to-background">
      <Header />
      <div className="bg-glow pointer-events-none fixed inset-0" />

      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/60 hover:text-purple-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            home
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
            <div className="flex-1">
              <SearchBar initialQuery={query} />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
                showFilters || hasActiveFilters
                  ? "border-purple-500/30 text-purple-300 bg-purple-500/10"
                  : "border-white/[0.06] text-muted-foreground/60 hover:border-white/[0.12]"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              filters
              {filterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 text-[11px] text-purple-300">
                  {filterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mb-6 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">genre</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground/40 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                      filters.genre === g
                        ? "border-purple-500/40 text-purple-300 bg-purple-500/10"
                        : "border-white/[0.06] text-muted-foreground/60 hover:border-white/[0.12]"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 mb-3">
                <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">platform</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Windows", "Mac", "Linux"].map((p) => (
                  <button
                    key={p}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        platform: prev.platform === p ? undefined : p,
                      }))
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                      filters.platform === p
                        ? "border-purple-500/40 text-purple-300 bg-purple-500/10"
                        : "border-white/[0.06] text-muted-foreground/60 hover:border-white/[0.12]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 mb-3">
                <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">price</p>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="min"
                  value={filters.price_min ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      price_min: e.target.value ? parseFloat(e.target.value) : undefined,
                    }))
                  }
                  className="w-24 px-3 py-1.5 rounded-lg text-xs border border-white/[0.06] bg-white/[0.02] text-muted-foreground/80 placeholder:text-muted-foreground/30 outline-none focus:border-purple-500/40 transition-colors"
                />
                <span className="text-muted-foreground/30 text-xs">to</span>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="max"
                  value={filters.price_max ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      price_max: e.target.value ? parseFloat(e.target.value) : undefined,
                    }))
                  }
                  className="w-24 px-3 py-1.5 rounded-lg text-xs border border-white/[0.06] bg-white/[0.02] text-muted-foreground/80 placeholder:text-muted-foreground/30 outline-none focus:border-purple-500/40 transition-colors"
                />
              </div>
            </div>
          )}

          {query && !loading && !error && (
            <p className="text-sm text-muted-foreground/60">
              {total > 0
                ? `${total} result${total !== 1 ? "s" : ""} for "${query}"`
                : `no hits for "${query}"`}
            </p>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[460/215] rounded-xl bg-white/[0.04]" />
                <Skeleton className="h-4 w-3/4 rounded bg-white/[0.04]" />
                <Skeleton className="h-3 w-1/2 rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10">
              <AlertCircle className="h-6 w-6 text-rose-400/70" />
            </div>
            <p className="text-sm text-muted-foreground/60 max-w-md">
              can&apos;t reach the server.
            </p>
          </div>
        )}

        {!loading && !error && games.length > 0 && (
          <GameGrid games={games} />
        )}

        {!loading && !error && query && games.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06]">
              <Search className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground/60">
              nothing matches &quot;{query}&quot;
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/40" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
