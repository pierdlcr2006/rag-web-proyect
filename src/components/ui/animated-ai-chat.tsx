"use client";

import { useEffect, useRef, useCallback, useTransition, useMemo } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
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
    onSendMessage?: (message: string) => void;
    onUpload?: () => void;
    isStreaming?: boolean;
    isThinking?: boolean;
    streamingText?: string;
    streamingSources?: any[];
    currentStage?: RagStage;
}

const MIN_RENDERABLE_SOURCE_SIMILARITY = 0.45;

const getRenderableSources = (sources?: any[]) => {
    if (!Array.isArray(sources)) return [];
    return sources.filter((source) => {
        if (typeof source?.similarity !== 'number') return true;
        return source.similarity >= MIN_RENDERABLE_SOURCE_SIMILARITY;
    });
};

const isInternalMessage = (message: Message) =>
    message.content.startsWith('[SUGGESTED_QUESTIONS]');

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

    // Cerrar con Escape.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    // Portal a document.body para escapar el contexto de apilamiento del chat
    // (si no, la barra lateral se dibuja encima y tapa el botón de cerrar).
    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 bg-black/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl h-full bg-[#0A0A0A] rounded-none border-2 border-white/20 shadow-[12px_12px_0px_#2563EB] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-none border border-red-500/20 bg-red-500/10 flex items-center justify-center text-red-500">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-[#F4F2ED]">{fileName}</h3>
                            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-heading font-bold">
                                {pageNumber ? `Página ${pageNumber} (Recorte Original)` : 'Previsualización de Documento'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 border border-transparent hover:border-white/20 hover:bg-white/5 rounded-none text-white/40 hover:text-white transition-all cursor-pointer"
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
        </motion.div>,
        document.body,
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
                "flex flex-col bg-white/[0.02] border border-white/10 rounded-none overflow-hidden transition-all hover:bg-white/[0.04] hover:border-[#2563EB] group",
                isExpanded ? "border-[#2563EB] bg-white/[0.04]" : ""
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
                            <div className="px-2 py-1 rounded-none bg-black/85 border border-white/20 text-[9px] font-heading font-bold text-[#F4F2ED] uppercase tracking-[0.2em]">
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
                        <div className="p-3 rounded-none bg-[#2563EB] text-white shadow-xl scale-90 group-hover:scale-100 transition-all border border-white/25 hover:bg-white hover:text-black">
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
                    <div className="w-8 h-8 rounded-none border border-[#2563EB]/25 bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                        <FileText size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white/80 truncate">{source.fileName}</p>
                        <p className="text-[10px] text-white/45 font-mono">
                            PÁG. {source.pageNumber || '?'} • SIMILITUD {(source.similarity * 100).toFixed(0)}%
                        </p>
                    </div>
                </button>
                
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 text-white/20 hover:text-white/40 cursor-pointer"
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
                        <div className="p-3 bg-black/40 rounded-none border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-[9px] font-heading font-bold text-[#2563EB] uppercase tracking-widest">
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
    const visibleMessages = useMemo(
        () => messages.filter((message) => !isInternalMessage(message)),
        [messages],
    );

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
            onSendMessage?.(value);
            setValue("");
            adjustHeight(true);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-transparent text-[#F4F2ED] relative overflow-hidden font-body">
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
                    {visibleMessages.length === 0 && !isStreaming ? (
                        <motion.div 
                            className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 relative z-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="space-y-3">
                                <div className="inline-block">
                                    <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tighter uppercase text-[#F4F2ED]">
                                        ¿CÓMO PUEDO <span className="text-[#2563EB]">AYUDARTE HOY?</span>
                                    </h1>
                                    <div className="h-0.5 bg-gradient-to-r from-transparent via-[#2563EB]/30 to-transparent w-full mt-3" />
                                </div>
                                <p className="font-body text-xs text-white/45 tracking-wide">Escribe un comando o haz una pregunta sobre tus documentos.</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-3">
                                {commandSuggestions.map((suggestion, index) => (
                                    <button
                                        key={suggestion.prefix}
                                        onClick={() => { setValue(suggestion.prefix + ' '); textareaRef.current?.focus(); }}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/10 hover:bg-[#2563EB]/10 hover:border-[#2563EB] hover:text-[#F4F2ED] rounded-none text-xs text-white/60 font-heading uppercase tracking-widest transition-all cursor-pointer group"
                                    >
                                        <span className="text-[#2563EB] group-hover:text-white transition-colors">{suggestion.icon}</span>
                                        <span>{suggestion.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            {visibleMessages.map((msg) => {
                                const displaySources = msg.role === 'assistant'
                                    ? getRenderableSources(msg.sourcesUsed)
                                    : [];

                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn("flex gap-4 relative z-10", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
                                    >
                                        <div className={cn(
                                            "max-w-[85%] p-4 rounded-none font-body",
                                            msg.role === 'user'
                                                ? "bg-[#2563EB]/10 border-2 border-[#2563EB] text-[#F4F2ED]"
                                                : "bg-white/[0.02] border border-white/10 text-[#F4F2ED]/90 border-l-4 border-l-[#2563EB]"
                                        )}>
                                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                                            {/* Sources Rendering */}
                                            {displaySources.length > 0 && (
                                                <div className="mt-8 space-y-4">
                                                    <div className="flex items-center gap-3 text-[10px] font-heading font-bold text-[#2563EB] uppercase tracking-[0.25em]">
                                                        <Sparkles size={12} /> Evidencia Visual y Referencias
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {displaySources.map((s, i) => (
                                                            <SourceCard key={i} source={s} onPreview={(id, name, page) => setPreviewFile({ id, name, page })} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {isStreaming && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col gap-4 relative z-10"
                                >
                                    <div className="max-w-[85%] p-4 text-white/85 bg-white/[0.01] border border-white/5 border-l-4 border-l-[#2563EB] rounded-none">
                                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                                            {streamingText}
                                        </p>
                                        {/* Las fuentes/recortes del documento se muestran SOLO al terminar
                                            la respuesta (en el mensaje ya completado), no durante el streaming. */}
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
                                                    if (!isThinking) return "IA ESCRIBIENDO...";
                                                    const labels: Record<RagStage, string> = {
                                                        idle: "IA PENSANDO...",
                                                        validating: "VALIDANDO SEGURIDAD...",
                                                        analyzing: "ANALIZANDO CONSULTA...",
                                                        searching: "BUSCANDO EN FUENTES VISUALES...",
                                                        generating: "GENERANDO RESPUESTA..."
                                                    };
                                                    return labels[currentStage || 'idle'];
                                                })()}
                                                className="px-4 py-2 font-heading uppercase text-xs tracking-wider text-[#2563EB]"
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
                                className="absolute bottom-full left-0 right-0 mb-4 bg-[#111111] border-2 border-[#2563EB] rounded-none z-50 shadow-[6px_6px_0px_rgba(37,99,235,0.2)] overflow-hidden"
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
                                                activeSuggestion === index ? "bg-[#2563EB] text-white" : "text-white/60 hover:bg-[#2563EB]/10"
                                            )}
                                            onClick={() => { setValue(suggestion.prefix + ' '); setShowCommandPalette(false); }}
                                        >
                                            <div className="text-white/40">{suggestion.icon}</div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-heading font-bold uppercase tracking-wider">{suggestion.label}</span>
                                                <span className="text-[10px] font-body text-white/45">{suggestion.description}</span>
                                            </div>
                                            <span className="text-xs font-mono text-white/20 ml-auto">{suggestion.prefix}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div 
                        className="relative bg-[#111111] border-2 border-white/15 focus-within:border-[#2563EB] rounded-none shadow-[8px_8px_0px_rgba(37,99,235,0.15)] focus-within:shadow-[8px_8px_0px_rgba(37,99,235,0.3)] transition-all overflow-hidden group"
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
                                className="resize-none py-2 px-4 text-[#F4F2ED] placeholder:text-white/30 min-h-[60px]"
                                showRing={false}
                            />
                        </div>

                        <div className="p-4 pt-0 flex items-center justify-between border-t border-white/[0.05]">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={onUpload}
                                    className="p-2.5 text-white/40 hover:text-[#2563EB] hover:bg-white/[0.04] transition-all rounded-none border border-transparent hover:border-white/10 group/btn relative cursor-pointer"
                                >
                                    <Paperclip size={18}/>
                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#111111] border border-white/15 font-heading text-[9px] uppercase tracking-widest px-2 py-1.5 rounded-none opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap text-white z-50">Adjuntar Archivo</span>
                                </button>
                                <button 
                                    onClick={() => setShowCommandPalette(!showCommandPalette)}
                                    className={cn("p-2.5 text-white/40 hover:text-[#2563EB] hover:bg-white/[0.04] transition-all rounded-none border border-transparent hover:border-white/10 cursor-pointer", showCommandPalette && "text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/30")}
                                >
                                    <Command size={18}/>
                                </button>
                            </div>
                            
                            <button 
                                onClick={handleSend}
                                disabled={!value.trim() || isStreaming}
                                className={cn(
                                    "px-6 py-3 flex items-center gap-2 transition-all font-heading font-bold uppercase tracking-widest text-xs rounded-none border border-[#F4F2ED]/20 hover:border-[#F4F2ED] disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer",
                                    value.trim() ? "bg-[#2563EB] text-white hover:bg-white hover:text-black" : "text-white/20 bg-white/5 border-transparent"
                                )}
                            >
                                {isStreaming ? <LoaderIcon className="animate-spin" size={16}/> : <SendIcon size={16}/>}
                                <span>Enviar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mouse Tracking Glow */}
            {inputFocused && (
                <motion.div 
                    className="fixed w-[40rem] h-[40rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-[#2563EB] blur-[140px]"
                    animate={{ x: mousePosition.x - 300, y: mousePosition.y - 300 }}
                    transition={{ type: "spring", damping: 30, stiffness: 100 }}
                />
            )}
        </div>
    );
}
