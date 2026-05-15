import { useState, useCallback } from 'react';
import { useAuthStore } from '../../auth/store/authStore';

export type RagStage = 'idle' | 'validating' | 'analyzing' | 'searching' | 'generating';

interface Source {
  fileId: string;
  fileName: string;
  chunkText: string;
  chunkIndex: number;
  similarity: number;
}

export function useStreamingMessage() {
  const [streamingText, setStreamingText] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentStage, setCurrentStage] = useState<RagStage>('idle');

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    setIsStreaming(true);
    setIsThinking(true);
    setStreamingText('');
    setSources([]);
    setCurrentStage('validating');

    const token = useAuthStore.getState().accessToken;

    try {
      const response = await fetch(`/api/chat/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (response.status === 401) {
        useAuthStore.getState().logout();
        return;
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(line.slice(6));

            // Stage events from backend: { stage: 'analyzing', label: '...' }
            if (data.stage) {
              setCurrentStage(data.stage as RagStage);
              continue;
            }

            switch (data.type) {
              case 'chunk':
                setStreamingText(data.text);
                setIsThinking(false);
                setCurrentStage('idle');
                break;
              case 'sources':
                setSources(data.sources);
                break;
              case 'done':
                setIsStreaming(false);
                setIsThinking(false);
                setCurrentStage('idle');
                break;
              case 'error':
                console.error('Streaming error:', data.message);
                setIsStreaming(false);
                setIsThinking(false);
                setCurrentStage('idle');
                break;
            }
          } catch (e) {
            console.error('Error parsing SSE line:', line, e);
          }
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setIsStreaming(false);
      setIsThinking(false);
      setCurrentStage('idle');
    }
  }, []);

  return { streamingText, sources, isStreaming, isThinking, currentStage, sendMessage };
}
