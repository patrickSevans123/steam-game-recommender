"use client";

import Link from "next/link";
import { User, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  imageUrl?: string;
}

export default function ChatMessage({ role, content, isStreaming, imageUrl }: ChatMessageProps) {
  const isUser = role === "user";

  // Parse game citations [Game Name](game_id) and make them clickable
  const parseContent = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Regex to match **[Game Name](game_id)** pattern
    const regex = /\*\*\[([^\]]+)\]\((\d+)\)\*\*/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const gameName = match[1];
      const gameId = match[2];

      // Add clickable game link
      parts.push(
        <Link
          key={match.index}
          href={`/game/${gameId}`}
          className="inline-flex items-center gap-1 font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Sparkles className="h-3 w-3" />
          {gameName}
        </Link>
      );

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Format content with line breaks
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => (
      <span key={i}>
        {parseContent(line)}
        {i < lines.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div
      className={cn(
        "flex gap-3 sm:gap-4 group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/[0.08]">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5",
          isUser
            ? "bg-white/[0.08] border border-white/[0.08]"
            : "bg-gradient-to-br from-white/[0.06] to-white/[0.03] border border-white/[0.06]"
        )}
      >
        {/* Image preview for user messages */}
        {imageUrl && isUser && (
          <div className="mb-3">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="rounded-lg max-w-full h-auto max-h-48 object-contain border border-white/[0.08]"
            />
          </div>
        )}

        {/* Text content */}
        <div className={cn(
          "text-sm sm:text-base leading-relaxed",
          isUser ? "text-foreground/90" : "text-foreground/80"
        )}>
          {formatContent(content)}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-purple-400/60 animate-pulse rounded-sm" />
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/[0.08] flex items-center justify-center border border-white/[0.08]">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
