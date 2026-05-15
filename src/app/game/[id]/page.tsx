"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Globe,
  Building2,
  Calendar,
  DollarSign,
  Users,
  ThumbsUp,
  ThumbsDown,
  Monitor,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameGrid from "@/components/GameGrid";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getGame, getSimilarGames } from "@/lib/api";
import type { Game } from "@/lib/types";

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [game, setGame] = useState<Game | null>(null);
  const [similar, setSimilar] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getGame(Number(id)),
      getSimilarGames(Number(id)),
    ])
      .then(([g, sim]) => {
        if (!cancelled) {
          setGame(g);
          setSimilar(sim.results.map((r) => r.game));
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
  }, [id]);

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-6 w-20 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="aspect-video rounded-xl" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 mx-auto">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Error loading game</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Link
              href="/"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Go home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="bg-glow pointer-events-none fixed inset-0" />

      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ScreenshotGallery
                screenshots={game.screenshots}
                headerImage={game.header_image}
                name={game.name}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {game.name}
              </h1>

              {game.genres && game.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {game.genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="secondary"
                      className="text-xs"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              <Separator className="mb-4" />

              <h2 className="text-lg font-semibold mb-2">About this game</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {game.short_description || game.description}
              </p>
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24 space-y-4"
            >
              {game.header_image && (
                <div className="relative aspect-[460/215] overflow-hidden rounded-xl border border-border/50 bg-muted lg:hidden">
                  <Image
                    src={game.header_image}
                    alt={game.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              )}

              <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Details
                </h3>

                <InfoRow icon={DollarSign} label="Price">
                  {game.price > 0
                    ? `$${game.price.toFixed(2)}`
                    : "Free"}
                </InfoRow>

                {game.developers && game.developers.length > 0 && (
                  <InfoRow icon={Building2} label="Developer">
                    {game.developers.join(", ")}
                  </InfoRow>
                )}

                {game.publishers && game.publishers.length > 0 && (
                  <InfoRow icon={Globe} label="Publisher">
                    {game.publishers.join(", ")}
                  </InfoRow>
                )}

                {game.release_date && (
                  <InfoRow icon={Calendar} label="Release">
                    {new Date(game.release_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </InfoRow>
                )}

                {game.platforms && game.platforms.length > 0 && (
                  <InfoRow icon={Monitor} label="Platforms">
                    {game.platforms.join(", ")}
                  </InfoRow>
                )}
              </div>

              {(game.metacritic_score > 0 || game.steam_rating > 0) && (
                <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Ratings
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {game.metacritic_score > 0 && (
                      <div className="text-center p-3 rounded-lg bg-muted">
                        <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-xl font-bold">
                            {game.metacritic_score}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Metacritic
                        </p>
                      </div>
                    )}
                    {game.steam_rating > 0 && (
                      <div className="text-center p-3 rounded-lg bg-muted">
                        <div className="flex items-center justify-center gap-1 text-indigo-400 mb-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-xl font-bold">
                            {game.steam_rating}%
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Steam Rating
                        </p>
                      </div>
                    )}
                  </div>
                  {(game.positive_reviews > 0 || game.negative_reviews > 0) && (
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3 text-green-400" />
                        {game.positive_reviews.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="h-3 w-3 text-red-400" />
                        {game.negative_reviews.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {similar.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <Separator className="mb-6" />
            <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
              Similar Games
              <span className="text-sm font-normal text-muted-foreground">
                you might also like
              </span>
            </h2>
            <GameGrid games={similar} />
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-medium truncate">{children}</p>
      </div>
    </div>
  );
}
