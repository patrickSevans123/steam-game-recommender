"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  isStreaming,
  placeholder = "Ask for game recommendations..."
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      onSend(input.trim());
      setInput("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-2 p-3 sm:p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-xl focus-within:border-white/[0.12] transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isStreaming}
          rows={1}
          className={cn(
            "flex-1 bg-transparent text-sm sm:text-base text-foreground/90 placeholder:text-muted-foreground/50",
            "resize-none outline-none min-h-[40px] max-h-[200px]",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          style={{ scrollbarWidth: 'thin' }}
        />

        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
            "transition-all duration-200",
            input.trim() && !isStreaming
              ? "bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25"
              : "bg-white/[0.06] cursor-not-allowed",
            "disabled:opacity-50"
          )}
        >
          {isStreaming ? (
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          ) : (
            <Send className={cn(
              "h-5 w-5",
              input.trim() ? "text-white" : "text-muted-foreground/50"
            )} />
          )}
        </button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground/50 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
