import React, { useState } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, placeholder = "Escribe un mensaje...", disabled }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit(value);
      setValue("");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-t from-anthropic-bg via-anthropic-bg/95 to-transparent">
      <div className="max-w-3xl mx-auto relative">
        <form 
          onSubmit={handleSubmit}
          className="relative group glass-card rounded-[2rem] p-1 shadow-2xl shadow-slate-200 focus-within:shadow-primary/5 transition-all duration-300"
        >
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full py-4 px-6 bg-transparent outline-none text-[15px] font-medium placeholder:text-slate-400"
            disabled={disabled}
          />
          <button
            type="submit"
            disabled={!value.trim() || disabled}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-300 ${
              value.trim() && !disabled 
                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-100" 
                : "bg-slate-100 text-slate-300 scale-95"
            }`}
          >
            {disabled ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
        <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
          <Sparkles size={10} className="text-primary" />
          <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-[0.2em]">
            RAG AI Intelligence
          </p>
        </div>
      </div>
    </div>
  );
};
