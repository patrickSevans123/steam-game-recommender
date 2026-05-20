"use client";

import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export default function Header() {
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
      </div>
    </header>
  );
}
