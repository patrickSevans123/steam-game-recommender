"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowRight } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import GameGrid from "@/components/GameGrid";
import Footer from "@/components/Footer";
import { getTrending } from "@/lib/api";
import type { Game } from "@/lib/types";

const trendingTags = [
  "RPG", "Open World", "Horror", "Souls-like",
  "Farming Sim", "Story Rich", "Action", "Indie",
];

export default function HomePage() {
  const router = useRouter();
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);

  useEffect(() => {
    getTrending(8).then((res) => {
      setTrendingGames(res.results.map((r) => r.game));
    }).catch(() => {});
  }, []);

  return (
    <>
      <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-background via-[#0b0a1e] to-background">
        <div className="bg-glow pointer-events-none fixed inset-0" />

        <main className="relative z-10 flex flex-col items-center px-4 pt-24 pb-16">
          <div className="flex flex-col items-center text-center max-w-3xl w-full mb-20">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-heading tracking-tight leading-[0.95] mb-4">
              <span className="text-gradient text-glow">treasure</span>
              <br />
              <span className="text-foreground">hunting, but</span>
              <br />
              <span className="text-foreground/90">for games.</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground/70 max-w-xl mb-10">
              Type what you&apos;re in the mood for. messy, vague, specific. we get it.
            </p>

            <SearchBar large />

            <div className="mt-8 flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/50" />
              <div className="flex flex-wrap justify-center gap-1.5">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
                    className="px-3 py-1 text-xs font-medium text-muted-foreground/60 hover:text-purple-300 transition-colors rounded-full hover:bg-purple-500/10"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {trendingGames.length > 0 && (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading text-foreground/80 tracking-tight flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  trending now
                </h2>
                <button
                  onClick={() => router.push("/search?q=trending")}
                  className="text-xs text-muted-foreground/50 hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  see all <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <GameGrid games={trendingGames} />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
