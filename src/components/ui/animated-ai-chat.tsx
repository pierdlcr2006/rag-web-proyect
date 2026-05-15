"use client";

import { useEffect, useRef, useCallback, useTransition, useMemo } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    ImageIcon,
    FileUp,
    MonitorIcon,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
    SendIcon,
    XIcon,
    LoaderIcon,
    Sparkles,
    Command,
    FileText,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Maximize2,
    Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react"
import { LoadingBreadcrumb } from "./animated-loading-svg-text-shimmer";
import { filesApi } from "@/sites/b2c-site/files/api/files.api";
import { useAuthStore } from "@/sites/b2c-site/auth/store/authStore";

// --- Components & Hooks ---

export type RagStage = 'idle' | 'validating' | 'analyzing' | 'searching' | 'generating';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sourcesUsed?: any[];
    createdAt: string;
}

interface AnimatedAIChatProps {
    messages?: Message[];
    onSendMessage: (message: string) => void;
    onUpload?: () => void;
    isStreaming?: boolean;
    isThinking?: boolean;
    streamingText?: string;
    streamingSources?: any[];
    currentStage?: RagStage;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { showRing?: boolean }>(
    ({ className, showRing = true, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border-none bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    showRing && "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    className
                )}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

// --- PDF Preview Component ---

const PDFPreviewModal = ({ fileId, fileName, pageNumber, onClose }: { fileId: string, fileName: string, pageNumber?: number, onClose: () => void }) => {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const token = useAuthStore(state => state.accessToken);

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                // If we have a page number, we use the slice endpoint
                if (pageNumber) {
                    setUrl(`/api/files/${fileId}/slice?pages=${pageNumber}&token=${token}`);
                } else {
                    const data = await filesApi.get(fileId);
                    setUrl(data.downloadUrl);
                }
            } catch (err) {
                console.error("Error fetching PDF URL:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUrl();
    }, [fileId, pageNumber, token]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 bg-black/80 backdrop-blur-sm"
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-5xl h-full bg-[#121212] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white/90">{fileName}</h3>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">
                                {pageNumber ? `Página ${pageNumber} (Recorte Original)` : 'Previsualización de Documento'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                    >
                        <XIcon size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white/5 relative">
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                            <LoaderIcon className="animate-spin text-white/20" size={32} />
                            <p className="text-xs text-white/40">Cargando captura...</p>
                        </div>
                    ) : url ? (
                        <iframe 
                            src={`${url}${url.includes('#') ? '' : '#toolbar=0&navpanes=0&scrollbar=0&view=FitH'}`}
                            className="w-full h-full border-none bg-white"
                            title={fileName}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                            <XIcon className="text-red-500/40" size={32} />
                            <p className="text-xs text-white/40">No se pudo cargar la captura</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Source Card Component ---

const SourceCard = ({ source, onPreview }: { source: any, onPreview: (id: string, name: string, page?: number) => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const token = useAuthStore(state => state.accessToken);

    return (
        <motion.div 
            layout
            className={cn(
                "flex flex-col bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden transition-all hover:bg-white/[0.06] group",
                isExpanded ? "ring-1 ring-primary/20 bg-white/[0.08]" : ""
            )}
        >
            {/* Visual Thumbnail (Only if pageNumber is available) */}
            {source.fileId && source.pageNumber && (
                <div className="relative aspect-[16/9] w-full bg-white/[0.02] border-b border-white/5 overflow-hidden">
                    {(() => {
                        const ext = source.fileName?.split('.').pop()?.toLowerCase();
                        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
                        const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext || '');
                        const url = `/api/files/${source.fileId}/slice?pages=${source.pageNumber}&token=${token}`;

                        if (isImage) {
                            return <img src={url} alt="Context Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />;
                        } else if (isVideo) {
                            return <video src={url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" muted loop playsInline />;
                        } else {
                            return (
                                <iframe 
                                    src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                    className="w-full h-full border-none pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity bg-transparent"
                                    title="Page Preview"
                                />
                            );
                        }
                    })()}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3 pointer-events-none">
                        <div className="flex items-center gap-2">
                            <div className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white/80 uppercase tracking-wider">
                                {(() => {
                                    const ext = source.fileName?.split('.').pop()?.toLowerCase();
                                    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'IMAGEN';
                                    if (['mp4', 'webm', 'ogg', 'mov'].includes(ext || '')) return 'VIDEO';
                                    if (['mp3', 'wav', 'ogg'].includes(ext || '')) return 'AUDIO';
                                    return `PÁG. ${source.pageNumber}`;
                                })()}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => onPreview(source.fileId, source.fileName, source.pageNumber)}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
                    >
                        <div className="p-2 rounded-full bg-primary text-white shadow-xl scale-90 group-hover:scale-100 transition-transform">
                            <Eye size={20} />
                        </div>
                    </button>
                </div>
            )}

            <div className="flex items-center gap-3 p-3 text-left w-full relative">
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex-1 flex items-center gap-3 text-left min-w-0"
                >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <FileText size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white/80 truncate">{source.fileName}</p>
                        <p className="text-[10px] text-white/40">
                            Página {source.pageNumber || '?'} • Similitud {(source.similarity * 100).toFixed(0)}%
                        </p>
                    </div>
                </button>
                
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 text-white/20 hover:text-white/40"
                    >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>
            </div>
            
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-3 pb-3"
                    >
                        <div className="p-3 bg-black/20 rounded-xl border border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-[9px] font-black text-primary/60 uppercase tracking-widest">
                                <Sparkles size={10} /> Fragmento Citado
                            </div>
                            <p className="text-[11px] leading-relaxed text-white/60 italic">
                                "...{source.chunkText}..."
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const AnimatedAIChat = ({ 
    messages = [], 
    onSendMessage, 
    onUpload, 
    isStreaming = false, 
    isThinking = false,
    streamingText = "", 
    streamingSources = [],
    currentStage = 'idle'
}: AnimatedAIChatProps) => {
    const [value, setValue] = useState("");
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(0);
    const [inputFocused, setInputFocused] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [previewFile, setPreviewFile] = useState<{ id: string, name: string, page?: number } | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const commandPaletteRef = useRef<HTMLDivElement>(null);

    const commandSuggestions = [
        { icon: <Sparkles size={14}/>, label: "Mejorar respuesta", prefix: "/mejorar", description: "Refina el tono y la claridad" },
        { icon: <FileUp size={14}/>, label: "Resumir documento", prefix: "/resumen", description: "Extrae puntos clave" },
        { icon: <ImageIcon size={14}/>, label: "Explicar imagen", prefix: "/vision", description: "Analiza el contenido visual" },
    ];

    // Scroll to bottom when streaming or new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, streamingText, isStreaming]);

    // Handle mouse tracking for ambient glow
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Handle command palette visibility
    useEffect(() => {
        if (value.startsWith("/")) {
            setShowCommandPalette(true);
        } else {
            setShowCommandPalette(false);
        }
    }, [value]);

    const adjustHeight = (reset = false) => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            if (!reset) {
                textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showCommandPalette) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveSuggestion((prev) => (prev + 1) % commandSuggestions.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveSuggestion((prev) => (prev - 1 + commandSuggestions.length) % commandSuggestions.length);
            } else if (e.key === "Enter") {
                e.preventDefault();
                const suggestion = commandSuggestions[activeSuggestion];
                setValue(suggestion.prefix + ' ');
                setShowCommandPalette(false);
            } else if (e.key === "Escape") {
                setShowCommandPalette(false);
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (value.trim() && !isStreaming) {
            onSendMessage(value);
            setValue("");
            adjustHeight(true);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-transparent text-white relative overflow-hidden">
            <AnimatePresence>
                {previewFile && (
                    <PDFPreviewModal 
                        fileId={previewFile.id} 
                        fileName={previewFile.name} 
                        pageNumber={previewFile.page}
                        onClose={() => setPreviewFile(null)} 
                    />
                )}
            </AnimatePresence>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-10 scroll-smooth relative z-10">
                <div className="max-w-3xl mx-auto space-y-12">
                    {messages.length === 0 && !isStreaming ? (
                        <motion.div 
                            className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="space-y-3">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-block"
                                >
                                    <h1 className="text-4xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/40 pb-1">
                                        ¿Cómo puedo ayudarte hoy?
                                    </h1>
                                    <motion.div 
                                        className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: "100%", opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                    />
                                </motion.div>
                                <p className="text-sm text-white/40">Escribe un comando o haz una pregunta sobre tus documentos.</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {commandSuggestions.map((suggestion, index) => (
                                    <motion.button
                                        key={suggestion.prefix}
                                        onClick={() => { setValue(suggestion.prefix + ' '); textareaRef.current?.focus(); }}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-sm text-white/60 hover:text-white/90 transition-all border border-white/[0.05]"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {suggestion.icon}
                                        <span>{suggestion.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <motion.div 
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
                                >
                                    <div className={cn(
                                        "max-w-[85%] p-4 rounded-2xl",
                                        msg.role === 'user' 
                                            ? "bg-white/5 border border-white/10 text-white/90" 
                                            : "bg-transparent text-white/80"
                                    )}>
                                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        
                                        {/* Sources Rendering */}
                                        {msg.role === 'assistant' && Array.isArray(msg.sourcesUsed) && msg.sourcesUsed.length > 0 && (
                                            <div className="mt-8 space-y-4">
                                                <div className="flex items-center gap-3 text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">
                                                    <Sparkles size={12} /> Evidencia Visual y Referencias
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {msg.sourcesUsed.map((s, i) => (
                                                        <SourceCard key={i} source={s} onPreview={(id, name, page) => setPreviewFile({ id, name, page })} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isStreaming && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col gap-4"
                                >
                                    <div className="max-w-[85%] p-4 text-white/80">
                                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                                            {streamingText}
                                        </p>
                                        
                                        {/* Streaming Sources */}
                                        {Array.isArray(streamingSources) && streamingSources.length > 0 && (
                                            <div className="mt-8 space-y-4">
                                                <div className="flex items-center gap-3 text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">
                                                    <LoaderIcon size={12} className="animate-spin" /> Analizando Evidencia Visual
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {streamingSources.map((s, i) => (
                                                        <SourceCard key={i} source={s} onPreview={(id, name, page) => setPreviewFile({ id, name, page })} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <AnimatePresence>
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="inline-flex self-start"
                                        >
                                            <LoadingBreadcrumb
                                                text={(() => {
                                                    if (!isThinking) return "IA escribiendo...";
                                                    const labels: Record<RagStage, string> = {
                                                        idle: "IA pensando...",
                                                        validating: "Validando seguridad...",
                                                        analyzing: "Analizando consulta...",
                                                        searching: "Buscando en fuentes visuales...",
                                                        generating: "Generando respuesta..."
                                                    };
                                                    return labels[currentStage || 'idle'];
                                                })()}
                                                className="px-4 py-2"
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-6 relative z-20">
                <div className="max-w-2xl mx-auto relative">
                    <AnimatePresence>
                        {showCommandPalette && (
                            <motion.div 
                                ref={commandPaletteRef}
                                className="absolute bottom-full left-0 right-0 mb-4 backdrop-blur-xl bg-black/90 rounded-2xl z-50 shadow-2xl border border-white/10 overflow-hidden"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                <div className="py-2">
                                    {commandSuggestions.map((suggestion, index) => (
                                        <div 
                                            key={suggestion.prefix}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                                                activeSuggestion === index ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5"
                                            )}
                                            onClick={() => { setValue(suggestion.prefix + ' '); setShowCommandPalette(false); }}
                                        >
                                            <div className="text-white/40">{suggestion.icon}</div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{suggestion.label}</span>
                                                <span className="text-[10px] opacity-50">{suggestion.description}</span>
                                            </div>
                                            <span className="text-xs text-white/20 ml-auto">{suggestion.prefix}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div 
                        className="relative backdrop-blur-3xl bg-white/[0.02] rounded-3xl border border-white/10 shadow-2xl overflow-hidden group"
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                    >
                        <div className="p-4">
                            <Textarea 
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => { setValue(e.target.value); adjustHeight(); }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                placeholder="Haz una pregunta o usa / para comandos..."
                                className="resize-none py-2 px-4 text-white/90 placeholder:text-white/10 min-h-[60px]"
                                showRing={false}
                            />
                        </div>

                        <div className="p-4 pt-0 flex items-center justify-between border-t border-white/[0.05]">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={onUpload}
                                    className="p-2 text-white/40 hover:text-white transition-colors rounded-xl hover:bg-white/5 group/btn relative"
                                >
                                    <Paperclip size={18}/>
                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">Adjuntar Archivo</span>
                                </button>
                                <button 
                                    onClick={() => setShowCommandPalette(!showCommandPalette)}
                                    className={cn("p-2 text-white/40 hover:text-white transition-colors rounded-xl hover:bg-white/5", showCommandPalette && "text-white bg-white/10")}
                                >
                                    <Command size={18}/>
                                </button>
                            </div>
                            
                            <motion.button 
                                onClick={handleSend}
                                disabled={!value.trim() || isStreaming}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "px-5 py-2 rounded-2xl flex items-center gap-2 transition-all font-bold text-sm",
                                    value.trim() ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "text-white/20 bg-white/5"
                                )}
                            >
                                {isStreaming ? <LoaderIcon className="animate-spin" size={16}/> : <SendIcon size={16}/>}
                                <span>Enviar</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Mouse Tracking Glow */}
            {inputFocused && (
                <motion.div 
                    className="fixed w-[40rem] h-[40rem] rounded-full pointer-events-none z-0 opacity-[0.03] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[100px]"
                    animate={{ x: mousePosition.x - 300, y: mousePosition.y - 300 }}
                    transition={{ type: "spring", damping: 30, stiffness: 100 }}
                />
            )}
        </div>
    );
}
