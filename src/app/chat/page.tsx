"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, RotateCcw, Info, TrendingUp } from "lucide-react";
import { useChatStream } from "@/hooks/useChatStream";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SUGGESTED_PROMPTS = [
  "I want dark souls-like games but easier",
  "Recommend cozy games for rainy days",
  "What are good multiplayer games for 4 players?",
  "Games like Stardew Valley",
  "Horror games that aren't too scary",
  "Best indie RPGs under $20",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const {
    response,
    isStreaming,
    error,
    sessionId,
    gamesRetrieved,
    sendMessage,
    clearSession,
    resetResponse,
  } = useChatStream();

  const [messages, setMessages] = useState<Message[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasShownWelcome = useRef(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, response]);

  // Show welcome message on first load
  useEffect(() => {
    if (!hasShownWelcome.current) {
      hasShownWelcome.current = true;
      setMessages([
        {
          role: "assistant",
          content: "Hey! I'm your game recommendation assistant. Tell me what you're in the mood for, and I'll help you find the perfect game. You can be as specific or as vague as you want!",
        },
      ]);
    }
  }, []);

  const handleSend = async (query: string) => {
    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: query }]);

    // Show thinking indicator
    setIsThinking(true);

    // Send to API
    await sendMessage(query);
  };

  // Hide thinking indicator when streaming starts
  useEffect(() => {
    if (isStreaming && response) {
      setIsThinking(false);
    }
  }, [isStreaming, response]);

  // When streaming completes, add assistant response to messages
  useEffect(() => {
    if (!isStreaming && response && response.length > 0) {
      setIsThinking(false);
      setMessages(prev => {
        // Check if last message is already this response
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.role === "assistant" && lastMsg?.content === response) {
          return prev;
        }
        return [...prev, { role: "assistant", content: response }];
      });
      resetResponse();
    }
  }, [isStreaming, response, resetResponse]);

  const handleNewChat = async () => {
    await clearSession();
    setMessages([
      {
        role: "assistant",
        content: "Fresh start! What kind of games are you looking for?",
      },
    ]);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-[#0b0a1e] to-background">
      <Header />

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/[0.08]">
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-heading">AI Assistant</h1>
              <p className="text-xs sm:text-sm text-muted-foreground/60">
                {sessionId ? `Session active` : "Ready to help"}
                {gamesRetrieved > 0 && ` • ${gamesRetrieved} games retrieved`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
              title="About this assistant"
            >
              <Info className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.08] border border-white/[0.08] transition-colors text-sm"
              title="Start new chat"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </div>

        {/* Info banner */}
        {showInfo && (
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-foreground/80 space-y-2">
                <p>
                  <strong className="text-foreground/90">How it works:</strong> This AI assistant uses RAG (Retrieval-Augmented Generation) to search through 76,000+ Steam games and provide personalized recommendations.
                </p>
                <p>
                  Click on highlighted game names to view their details. The assistant remembers your conversation, so you can ask follow-up questions!
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Powered by Google Gemini 2.5 Flash (FREE tier)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 mb-6 space-y-4 overflow-y-auto">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/[0.08]">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 animate-pulse" />
              </div>
              <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-br from-white/[0.06] to-white/[0.03] border border-white/[0.06]">
                <div className="text-sm sm:text-base text-muted-foreground/60 italic">
                  Thinking...
                </div>
              </div>
            </div>
          )}

          {/* Streaming message */}
          {isStreaming && response && (
            <ChatMessage
              role="assistant"
              content={response}
              isStreaming={true}
            />
          )}

          {/* Error message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts (show only if no messages yet) */}
        {messages.length <= 1 && !isStreaming && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground/60">Try asking:</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="text-left p-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.10] transition-all text-sm text-foreground/70 hover:text-foreground/90"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="sticky bottom-0 pb-4">
          <ChatInput
            onSend={handleSend}
            isStreaming={isStreaming}
            placeholder="Ask for game recommendations..."
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
