"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/[0.06] group-hover:bg-white/[0.10] transition-colors">
            <Gamepad2 className="h-4 w-4 text-muted-foreground/70" />
          </div>
          <span className="text-sm font-heading tracking-wide text-foreground/80">
            steamrec
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/chat"
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all",
              pathname === "/chat"
                ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400 border border-purple-500/30"
                : "text-muted-foreground/70 hover:text-foreground/90 hover:bg-white/[0.06]"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI Assistant</span>
            <span className="sm:hidden">AI</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
