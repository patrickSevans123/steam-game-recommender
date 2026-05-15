"use client";

import { useState, type KeyboardEvent, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Sparkles } from "lucide-react";
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
    <div className={cn("relative w-full", large ? "max-w-2xl" : "max-w-xl")}>
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-muted-foreground" />
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
          placeholder='Try "game like Omori"...'
          className={cn(
            "w-full bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground/60",
            "transition-all duration-300",
            large
              ? "h-14 pl-12 pr-6 text-base rounded-2xl"
              : "h-10 pl-10 pr-4 text-sm rounded-xl",
            "focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50",
            "hover:border-border"
          )}
        />
      </div>

      {showSuggestions && !query && (
        <div
          ref={suggestionsRef}
          className="absolute top-full mt-2 w-full rounded-xl border border-border/50 bg-popover shadow-2xl shadow-indigo-500/5 overflow-hidden z-50"
        >
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
            Suggestions
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
                "w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors",
                selectedSuggestion === i
                  ? "bg-indigo-500/10 text-indigo-300"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
