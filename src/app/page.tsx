"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Gamepad2, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";

const trendingTags = [
  "RPG", "Open World", "Horror", "Souls-like",
  "Farming Sim", "Story Rich", "Action", "Indie",
];

export default function HomePage() {
  const router = useRouter();

  const handleTagClick = useCallback(
    (tag: string) => {
      router.push(`/search?q=${encodeURIComponent(tag)}`);
    },
    [router]
  );

  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <div className="bg-glow pointer-events-none fixed inset-0" />

        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-3xl w-full"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Steam Game Recommender
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3">
              <span className="text-gradient">Discover</span>{" "}
              <span className="text-foreground">your next</span>
              <br />
              <span className="text-foreground">favorite game</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mb-10">
              Just describe what you&apos;re looking for — in your own words.
              Our AI finds the perfect Steam games for you.
            </p>

            <div className="w-full flex flex-col items-center gap-8">
              <SearchBar large />

              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Trending searches
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {trendingTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-secondary/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300 hover:scale-105"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 flex items-center gap-2 text-xs text-muted-foreground/40"
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>Built with Faiss &middot; CLIP &middot; Next.js</span>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
}
