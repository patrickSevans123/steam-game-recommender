"use client";

import Link from "next/link";
import { Gamepad2, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-gradient">Steam</span>
            <span className="text-foreground">Rec</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Discover
          </Link>
        </div>
      </div>
    </header>
  );
}
