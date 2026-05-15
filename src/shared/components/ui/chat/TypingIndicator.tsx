import React from "react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-6 w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
        </div>
      </div>
      <div className="flex-1 flex items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
          La IA está pensando...
        </span>
      </div>
    </div>
  );
};
