import React from 'react';
import { User, Bot } from 'lucide-react';

interface Source {
  id: string;
  fileName: string;
  chunkText: string;
}

interface Props {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
}

export const MessageBubble: React.FC<Props> = ({ role, content, sources, isStreaming }) => {
  const isUser = role === 'user';

  return (
    <div className={`w-full py-8 ${isUser ? '' : 'bg-transparent'}`}>
      <div className="chat-container flex gap-6 px-4 md:px-0">
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isUser ? 'bg-slate-200 text-slate-600' : 'bg-primary/10 text-primary border border-primary/20'
        }`}>
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>
        
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              {isUser ? 'Tú' : 'Asistente IA'}
            </span>
          </div>
          
          <div className={`${isUser ? 'text-slate-700' : 'text-slate-800'} leading-relaxed`}>
            <p className="whitespace-pre-wrap break-words text-[15px] font-medium selection:bg-primary/20">
              {content}
              {isStreaming && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle rounded-full" />
              )}
            </p>
          </div>

          {!isUser && sources && sources.length > 0 && (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fuentes analizadas:</span>
              <div className="flex flex-wrap gap-2">
                {sources.map((source, idx) => (
                  <div 
                    key={source.id || idx}
                    className="group relative flex items-center gap-2 text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-full hover:border-primary/30 hover:bg-primary/5 transition-all cursor-help shadow-sm"
                  >
                    <span className="text-primary opacity-60">📄</span>
                    <span className="max-w-[150px] truncate font-bold">{source.fileName}</span>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl leading-relaxed">
                      "{source.chunkText.slice(0, 150)}..."
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
