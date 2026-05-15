"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Game } from "@/lib/types";

export default function GameCard({
  game,
  index = 0,
}: {
  game: Game;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/game/${game.id}`} className="group block">
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 card-hover">
          <div className="relative aspect-[460/215] overflow-hidden bg-muted">
            {game.header_image ? (
              <Image
                src={game.header_image}
                alt={game.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {game.metacritic_score > 0 && (
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur-sm px-2 py-1 text-xs font-semibold text-green-400">
                <Star className="h-3 w-3 fill-current" />
                {game.metacritic_score}
              </div>
            )}
          </div>

          <div className="p-3.5 space-y-2">
            <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-1 group-hover:text-indigo-400 transition-colors">
              {game.name}
            </h3>

            {game.genres && game.genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {game.genres.slice(0, 3).map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4 font-normal"
                  >
                    <Tag className="h-2.5 w-2.5 mr-0.5" />
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              {game.steam_rating > 0 ? (
                <span className="text-xs text-muted-foreground">
                  {game.steam_rating}% positive
                </span>
              ) : (
                <span />
              )}
              {game.price > 0 ? (
                <span className="text-xs font-semibold text-foreground">
                  ${game.price.toFixed(2)}
                </span>
              ) : game.price === 0 ? (
                <span className="text-xs font-semibold text-green-400">
                  Free
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
