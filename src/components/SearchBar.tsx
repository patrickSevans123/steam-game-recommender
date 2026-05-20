"use client";

import { useState, type KeyboardEvent, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const suggestions = [
  "game like Omori",
  "open world RPG with crafting",
  "relaxing farming simulator",
  "horror game with deep story",
  "souls-like with challenging combat",
];

export default function SearchBar({
  initialQuery = "",
  large = false,
}: {
  initialQuery?: string;
  large?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function doSearch(q: string) {
    if (!q.trim()) return;
    setIsSearching(true);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      doSearch(query);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  return (
    <div className={cn("relative w-full", large ? "max-w-xl" : "max-w-lg")}>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-4 w-4 text-muted-foreground/50 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground/50" />
          )}
        </div>
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            setSelectedSuggestion(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder='try "game like Omori"...'
          className={cn(
            "w-full bg-white/[0.04] border-white/[0.08] text-foreground placeholder:text-muted-foreground/40",
            "transition-all duration-200",
            large
              ? "h-12 pl-10 pr-4 text-base rounded-xl"
              : "h-9 pl-9 pr-3 text-sm rounded-lg",
            "focus-visible:ring-1 focus-visible:ring-purple-500/30 focus-visible:border-purple-500/40",
            "hover:border-white/[0.12]"
          )}
        />
      </div>

      {showSuggestions && !query && (
        <div
          ref={suggestionsRef}
          className="absolute top-full mt-1 w-full rounded-lg border border-white/[0.08] bg-popover shadow-lg overflow-hidden z-50"
        >
          <div className="px-3 py-1.5 text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">
            try
          </div>
          {suggestions.map((s, i) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                doSearch(s);
              }}
              onMouseEnter={() => setSelectedSuggestion(i)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors",
                selectedSuggestion === i
                  ? "bg-white/[0.04] text-foreground"
                  : "text-muted-foreground/70 hover:text-foreground hover:bg-white/[0.02]"
              )}
            >
              <Zap className="h-3 w-3 shrink-0 text-purple-400/50" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
