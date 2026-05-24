import { useState, useCallback, useRef, useEffect } from 'react';

interface ChatFilters {
  genre?: string;
  platform?: string;
  price_min?: number;
  price_max?: number;
}

interface UseChatStreamReturn {
  response: string;
  isStreaming: boolean;
  error: string | null;
  sessionId: string | null;
  gamesRetrieved: number;
  sendMessage: (query: string, filters?: ChatFilters, image?: File | null) => Promise<void>;
  clearSession: () => Promise<void>;
  resetResponse: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useChatStream(): UseChatStreamReturn {
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [gamesRetrieved, setGamesRetrieved] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  const sendMessage = useCallback(async (
    query: string,
    filters?: ChatFilters,
    image?: File | null
  ) => {
    setIsStreaming(true);
    setResponse('');
    setError(null);
    setGamesRetrieved(0);

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      // Build FormData for multimodal support
      const formData = new FormData();
      formData.append('query', query);
      formData.append('stream', 'true');

      if (sessionId) {
        formData.append('session_id', sessionId);
      }

      if (filters?.genre) {
        formData.append('genre', filters.genre);
      }
      if (filters?.platform) {
        formData.append('platform', filters.platform);
      }
      if (filters?.price_min !== undefined) {
        formData.append('price_min', filters.price_min.toString());
      }
      if (filters?.price_max !== undefined) {
        formData.append('price_max', filters.price_max.toString());
      }

      // Add image if present
      if (image) {
        formData.append('image', image);
      }

      // Use fetch to POST, then create EventSource from response
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // Read SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) {
            // Empty line marks end of SSE message, reset event type
            currentEvent = '';
            continue;
          }

          if (line.startsWith('event: ')) {
            currentEvent = line.substring(7).trim();
            continue;
          }

          if (line.startsWith('data: ')) {
            const data = line.substring(6);

            // Process based on event type
            if (currentEvent === 'session') {
              setSessionId(data);
            } else if (currentEvent === 'metadata') {
              setGamesRetrieved(parseInt(data, 10));
            } else if (currentEvent === 'done') {
              setIsStreaming(false);
            } else if (currentEvent === 'token') {
              // Unescape newlines
              const token = data.replace(/\\n/g, '\n');
              setResponse(prev => prev + token);
            } else if (currentEvent === 'error') {
              setError(data);
              setIsStreaming(false);
            }
          }
        }
      }

      setIsStreaming(false);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection error';
      setError(errorMessage);
      setIsStreaming(false);
    }
  }, [sessionId]);

  const clearSession = useCallback(async () => {
    if (sessionId) {
      try {
        await fetch(`${API_BASE}/api/chat/session/${sessionId}`, {
          method: 'DELETE',
        });
        setSessionId(null);
        setResponse('');
        setGamesRetrieved(0);
      } catch (err) {
        console.error('Failed to clear session:', err);
      }
    }
  }, [sessionId]);

  const resetResponse = useCallback(() => {
    setResponse('');
    setError(null);
    setGamesRetrieved(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    response,
    isStreaming,
    error,
    sessionId,
    gamesRetrieved,
    sendMessage,
    clearSession,
    resetResponse,
  };
}
