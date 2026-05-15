"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
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
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="bg-glow pointer-events-none fixed inset-0" />

      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex-1">
              <SearchBar initialQuery={query} />
            </div>
          </div>

          {query && !loading && !error && (
            <p className="text-sm text-muted-foreground">
              {total > 0
                ? `Found ${total} result${total !== 1 ? "s" : ""} for "${query}"`
                : `No results for "${query}"`}
            </p>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[460/215] rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Connection Error</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Could not reach the API. Make sure the backend server is running at{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
              </code>
            </p>
          </motion.div>
        )}

        {!loading && !error && games.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GameGrid games={games} />
          </motion.div>
        )}

        {!loading && !error && query && games.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No games found</h3>
            <p className="text-sm text-muted-foreground">
              Try a different search term
            </p>
          </motion.div>
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
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
