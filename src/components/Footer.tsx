"use client";

import { Gamepad2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Gamepad2 className="h-4 w-4 text-indigo-500" />
          <span>
            SteamRec — TBI Final Project
          </span>
        </div>
        <p className="text-xs text-muted-foreground/60">
          Powered by Faiss &amp; CLIP
        </p>
      </div>
    </footer>
  );
}
