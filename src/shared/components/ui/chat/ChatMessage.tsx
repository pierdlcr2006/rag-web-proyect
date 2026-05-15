import React from "react";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  sources?: any[];
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, sources, className = "" }) => {
  const isUser = role === "user";
  const isSystem = role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 animate-fade-in">
        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
          {content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex w-full py-8 group transition-colors ${isUser ? "" : "bg-transparent"} ${className}`}>
      <div className="flex gap-6 w-full max-w-4xl mx-auto px-4">
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${
          isUser ? "bg-slate-200 text-slate-600" : "bg-primary/10 text-primary border border-primary/20"
        }`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {isUser ? "Tú" : "Asistente IA"}
            </span>
          </div>
          
          <div className="text-[15px] leading-relaxed text-slate-800 font-medium whitespace-pre-wrap break-words">
            {content}
          </div>

          {!isUser && sources && sources.length > 0 && (
            <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fuentes:</span>
              <div className="flex flex-wrap gap-2">
                {sources.map((source, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-full hover:border-primary/30 hover:bg-primary/5 transition-all cursor-default shadow-sm">
                    <span className="text-primary opacity-60 text-[10px]">📄</span>
                    <span className="truncate max-w-[120px] font-bold">{source.fileName}</span>
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
