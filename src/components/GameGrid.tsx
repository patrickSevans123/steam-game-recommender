"use client";

import GameCard from "@/components/GameCard";
import type { Game } from "@/lib/types";

export default function GameGrid({ games }: { games: Game[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {games.map((game, i) => (
        <GameCard key={game.id} game={game} index={i} />
      ))}
    </div>
  );
}
