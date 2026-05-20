"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Building2,
  Calendar,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  Monitor,
  Loader2,
  AlertCircle,
  Globe,
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
  const [imgFailed, setImgFailed] = useState(false);

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
      <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-background via-[#0b0a1e] to-background">
        <Header />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-5 w-16 mb-6 bg-white/[0.04]" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="aspect-video rounded-xl bg-white/[0.04]" />
              <Skeleton className="h-8 w-3/4 bg-white/[0.04]" />
              <Skeleton className="h-4 w-1/2 bg-white/[0.04]" />
              <Skeleton className="h-32 w-full bg-white/[0.04]" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg bg-white/[0.04]" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-background via-[#0b0a1e] to-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 mx-auto">
              <AlertCircle className="h-6 w-6 text-rose-400/70" />
            </div>
            <p className="text-sm text-muted-foreground/60 mb-4">{error || "game not found"}</p>
            <Link
              href="/"
              className="text-sm text-muted-foreground/50 hover:text-purple-300 transition-colors"
            >
              go home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasRatings = game.metacritic_score > 0 || game.steam_rating > 0;

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-background via-[#0b0a1e] to-background">
      <Header />

      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/60 hover:text-purple-300 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ScreenshotGallery
              screenshots={game.screenshots}
              headerImage={game.header_image}
              name={game.name}
            />

            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl font-heading tracking-tight leading-tight">
                  {game.name}
                </h1>
                {game.price > 0 && (
                  <span className="shrink-0 text-lg font-heading text-rose-400/90">
                    ${game.price.toFixed(2)}
                  </span>
                )}
                {game.price === 0 && (
                  <span className="shrink-0 text-sm font-medium text-rose-400/70 px-2.5 py-0.5 rounded-md bg-rose-500/10">
                    Free
                  </span>
                )}
              </div>

              {game.genres && game.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {game.genres.map((genre) => (
                    <Badge
                      key={genre}
                      className="text-xs font-normal bg-white/[0.04] text-muted-foreground/80 border-white/[0.08]"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              <Separator className="mb-5 bg-white/[0.06]" />

              <p className="text-sm text-muted-foreground/70 leading-relaxed whitespace-pre-line">
                {game.short_description || game.description}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="sticky top-24 space-y-4">
              {game.header_image && !imgFailed && (
                <div className="relative aspect-[460/215] overflow-hidden rounded-lg bg-white/[0.04] lg:hidden">
                  <Image
                    src={game.header_image}
                    alt={game.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    onError={() => setImgFailed(true)}
                  />
                </div>
              )}

              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
                <h3 className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                  Details
                </h3>

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
                  <InfoRow icon={Calendar} label="Released">
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

                <InfoRow icon={DollarSign} label="Price">
                  {game.price > 0 ? `$${game.price.toFixed(2)}` : "Free"}
                </InfoRow>
              </div>

              {hasRatings && (
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
                  <h3 className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                    Ratings
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {game.metacritic_score > 0 && (
                      <div className="text-center p-3 rounded-md bg-white/[0.04]">
                        <div className="flex items-center justify-center gap-1 text-rose-400/80 mb-1">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-xl font-bold">
                            {game.metacritic_score}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                          Metacritic
                        </p>
                      </div>
                    )}
                    {game.steam_rating > 0 && (
                      <div className="text-center p-3 rounded-md bg-white/[0.04]">
                        <div className="flex items-center justify-center gap-1 text-purple-400/80 mb-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-xl font-bold">
                            {game.steam_rating}%
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                          Steam
                        </p>
                      </div>
                    )}
                  </div>
                  {(game.positive_reviews > 0 || game.negative_reviews > 0) && (
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/50 pt-1">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3 text-rose-400/60" />
                        {game.positive_reviews.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="h-3 w-3 text-rose-400/40" />
                        {game.negative_reviews.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-14">
            <Separator className="mb-6 bg-white/[0.06]" />
            <h2 className="text-lg font-heading tracking-tight mb-6 text-foreground/80">
              similar games
            </h2>
            <GameGrid games={similar} />
          </div>
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
      <Icon className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm text-muted-foreground/80">{children}</p>
      </div>
    </div>
  );
}
