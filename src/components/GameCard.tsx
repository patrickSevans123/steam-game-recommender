"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Star, Gamepad2, ThumbsUp } from "lucide-react";
import type { Game } from "@/lib/types";

export default function GameCard({ game }: { game: Game }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link href={`/game/${game.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg border border-white/[0.06] bg-card transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.02]">
        <div className="relative aspect-[460/215] overflow-hidden bg-muted">
          {game.header_image && !imgFailed ? (
            <Image
              src={game.header_image}
              alt={game.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground/30">
              <Gamepad2 className="h-8 w-8" />
            </div>
          )}

          {game.metacritic_score > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-400/90">
              <Star className="h-3 w-3 fill-current" />
              {game.metacritic_score}
            </div>
          )}
        </div>

        <div className="p-3 space-y-1.5">
          <h3 className="font-heading text-sm leading-tight text-foreground/90 line-clamp-1">
            {game.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {game.genres?.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="text-[10px] text-muted-foreground/50"
                >
                  {genre}
                </span>
              ))}
            </div>

            {game.price > 0 ? (
              <span className="text-xs font-medium text-rose-400/80 shrink-0">
                ${game.price.toFixed(2)}
              </span>
            ) : game.price === 0 ? (
              <span className="text-xs font-medium text-rose-400/60 shrink-0">
                Free
              </span>
            ) : null}
          </div>

          {game.steam_rating > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground/50">
              <ThumbsUp className="h-3 w-3" />
              {game.steam_rating}%
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
