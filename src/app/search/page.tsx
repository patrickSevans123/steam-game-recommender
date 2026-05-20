"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Search, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import GameGrid from "@/components/GameGrid";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { searchGames } from "@/lib/api";
import type { Game } from "@/lib/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    searchGames(query)
      .then((res) => {
        if (!cancelled) {
          setGames(res.results.map((r) => r.game));
          setTotal(res.total);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

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

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex-1">
              <SearchBar initialQuery={query} />
            </div>
          </div>

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
