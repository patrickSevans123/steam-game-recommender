"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string, image?: File | null) => void;
  isStreaming: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  isStreaming,
  placeholder = "Ask for game recommendations..."
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || selectedImage) && !isStreaming) {
      onSend(input.trim(), selectedImage);
      setInput("");
      handleClearImage();
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
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-white/[0.08]">
            <img
              src={imagePreview}
              alt="Selected"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleClearImage}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
              title="Remove image"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {selectedImage?.name}
          </p>
        </div>
      )}

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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
          disabled={isStreaming}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isStreaming || selectedImage !== null}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
            "transition-all duration-200",
            "bg-white/[0.06] hover:bg-white/[0.08]",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          title="Upload image"
        >
          <ImageIcon className="h-5 w-5 text-muted-foreground/70" />
        </button>

        <button
          type="submit"
          disabled={(!input.trim() && !selectedImage) || isStreaming}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
            "transition-all duration-200",
            (input.trim() || selectedImage) && !isStreaming
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
              (input.trim() || selectedImage) ? "text-white" : "text-muted-foreground/50"
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
