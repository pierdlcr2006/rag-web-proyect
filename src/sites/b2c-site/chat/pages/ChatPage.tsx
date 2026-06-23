import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Sparkles,
  FileText,
  MessageSquare,
  Zap,
  Upload,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { ConversationSidebar } from '../../conversations/components/ConversationSidebar';
import { conversationsApi } from '../../conversations/api/conversations.api';
import { useStreamingMessage } from '../hooks/useStreamingMessage';
import { AnimatedAIChat } from '../../../../components/ui/animated-ai-chat';
import { FileUploader } from '../../files/components/FileUploader';
import { FilesSidebar } from '../../files/components/FilesSidebar';

// ─── Step 1: New Notebook Screen (no conversation yet) ───────────────────────

const NewNotebookScreen: React.FC<{
  onCreate: (title: string) => void;
  isCreating: boolean;
}> = ({ onCreate, isCreating }) => {
  const [inputValue, setInputValue] = useState('');

  const suggestions = [
    { icon: <FileText size={14} />, label: 'Analizar un documento' },
    { icon: <Sparkles size={14} />, label: 'Extraer información clave' },
    { icon: <MessageSquare size={14} />, label: 'Hacer preguntas específicas' },
    { icon: <Zap size={14} />, label: 'Comparar contenido' },
  ];

  const handleSubmit = () => {
    const title = inputValue.trim() || 'Nuevo cuaderno';
    if (!isCreating) onCreate(title);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-transparent text-[#F4F2ED]">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl w-full space-y-8 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <img
            src="/logo-cuaderno.png"
            alt="Cuaderno"
            className="mx-auto block h-36 w-auto mb-4 select-none"
            decoding="async"
          />
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tighter uppercase text-[#F4F2ED]">
            Nuevo <span className="text-[#2563EB]">Cuaderno</span>
          </h1>
          <p className="font-body text-sm text-white/60 tracking-wide">
            Dale un nombre o elige una sugerencia
          </p>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setInputValue(s.label)}
              className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/[0.02] hover:bg-[#2563EB]/10 hover:border-[#2563EB] hover:text-white rounded-none text-xs text-white/60 font-heading uppercase tracking-widest transition-all cursor-pointer group"
            >
              <span className="text-[#2563EB] group-hover:text-white transition-colors">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Input + button */}
        <div className="bg-[#111111] border-2 border-white/15 focus-within:border-[#2563EB] rounded-none shadow-[8px_8px_0px_rgba(37,99,235,0.15)] focus-within:shadow-[8px_8px_0px_rgba(37,99,235,0.3)] transition-all overflow-hidden">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Nombre del cuaderno..."
            className="w-full bg-transparent px-6 py-5 text-sm text-[#F4F2ED] placeholder:text-white/20 font-body focus:outline-none"
            autoFocus
          />
          <div className="px-4 pb-4 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isCreating}
              className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white border border-[#F4F2ED]/20 hover:border-[#F4F2ED] rounded-none font-heading font-bold uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-40 disabled:cursor-wait cursor-pointer"
            >
              {isCreating
                ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <ArrowRight size={14} />
              }
              {isCreating ? 'Creando...' : 'Continuar'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Step 2: File Upload Screen (conversation just created, no files yet) ─────

const UploadFilesScreen: React.FC<{
  conversationId: string;
  onDone: () => void;
}> = ({ conversationId, onDone }) => {
  const [uploadedCount, setUploadedCount] = useState(0);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-transparent text-[#F4F2ED]">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl w-full space-y-8 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#2563EB]/10 border-2 border-[#2563EB] text-[#2563EB] shadow-[4px_4px_0px_#F4F2ED] mb-3 rounded-none">
            <Upload size={26} />
          </div>
          <h2 className="font-heading text-4xl font-bold tracking-tighter uppercase text-[#F4F2ED]">
            Sube tus archivos
          </h2>
          <p className="font-body text-sm text-white/60 tracking-wide">
            Añade los documentos, imágenes o archivos que quieres consultar con la IA
          </p>
        </div>

        {/* File uploader */}
        <div className="bg-[#111111] border-2 border-white/10 rounded-none shadow-[8px_8px_0px_rgba(244,242,237,0.05)] overflow-hidden">
          <FileUploader
            conversationId={conversationId}
            onClose={() => {}}
            onUploadSuccess={() => setUploadedCount((c) => c + 1)}
          />
        </div>

        {/* Done button — only enabled when ≥1 file uploaded */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onDone}
            disabled={uploadedCount === 0}
            className="flex items-center gap-3 px-8 py-3.5 bg-[#2563EB] text-white border border-[#F4F2ED]/20 hover:border-[#F4F2ED] rounded-none font-heading font-bold uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100 cursor-pointer shadow-[4px_4px_0px_#F4F2ED]"
          >
            <CheckCircle2 size={18} />
            Listo, ir al chat
            {uploadedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-[#0A0A0A]/40 border border-white/10 rounded-none font-mono text-[9px]">
                {uploadedCount} {uploadedCount === 1 ? 'archivo' : 'archivos'}
              </span>
            )}
          </button>
          {uploadedCount === 0 && (
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
              Sube al menos un archivo para continuar
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main ChatPage ────────────────────────────────────────────────────────────

export const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  // Track which conversationIds are in "upload phase" (just created, no messages yet)
  const [uploadPhaseIds, setUploadPhaseIds] = useState<Set<string>>(new Set());

  const { data: conversation, refetch } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => (conversationId ? conversationsApi.get(conversationId) : null),
    enabled: !!conversationId,
  });

  const { streamingText, sources, isStreaming, isThinking, currentStage, sendMessage } =
    useStreamingMessage();

  const handleCreate = async (title: string) => {
    setIsCreating(true);
    try {
      const newConv = await conversationsApi.create(title);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      // Mark this conversation as being in upload phase
      setUploadPhaseIds((prev) => new Set(prev).add(newConv.id));
      navigate(`/chat/${newConv.id}`, { replace: false });
    } catch (err) {
      console.error('Error creating conversation:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUploadDone = () => {
    if (conversationId) {
      // Remove from upload phase — now show the chat
      setUploadPhaseIds((prev) => {
        const next = new Set(prev);
        next.delete(conversationId);
        return next;
      });
      refetch();
    }
  };

  const handleSend = async (content: string) => {
    if (isStreaming || !conversationId) return;
    await sendMessage(conversationId, content);
    refetch();
  };

  // Determine which screen to show
  const isUploadPhase = conversationId ? uploadPhaseIds.has(conversationId) : false;

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden relative selection:bg-[#2563EB] selection:text-white">
      <ConversationSidebar />

      <main className="flex-1 flex flex-col min-w-0 relative h-screen bg-transparent">
        {/* Background Grid & Cobalt Aurora exactly like Login Page */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0b1226] to-[#0A0A0A]" />
          <div className="absolute -top-1/4 -left-1/4 w-[65%] h-[65%] rounded-full bg-[#2563EB]/30 blur-[130px] login-blob-1" />
          <div className="absolute top-1/3 -right-1/4 w-[60%] h-[60%] rounded-full bg-[#2563EB]/20 blur-[150px] login-blob-2" />
          <div className="absolute inset-0 opacity-[0.05] login-grid" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(10,10,10,0.6))]" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col min-w-0 h-full">
          {!conversationId ? (
            // Step 1: No conversation → show notebook creation screen
            <NewNotebookScreen onCreate={handleCreate} isCreating={isCreating} />
          ) : isUploadPhase ? (
            // Step 2: Conversation created → force file upload before chat
            <UploadFilesScreen conversationId={conversationId} onDone={handleUploadDone} />
          ) : (
            // Step 3: Files uploaded → show full chat
            <AnimatedAIChat
              messages={conversation?.messages || []}
              onSendMessage={handleSend}
              onUpload={() => setUploadPhaseIds((prev) => new Set(prev).add(conversationId!))}
              isStreaming={isStreaming}
              isThinking={isThinking}
              streamingText={streamingText}
              streamingSources={sources}
              currentStage={currentStage}
            />
          )}
        </div>
      </main>

      {/* Right Sidebar: Context Files */}
      {conversationId && !isUploadPhase && (
        <FilesSidebar 
          conversationId={conversationId} 
          onUploadClick={() => setUploadPhaseIds((prev) => new Set(prev).add(conversationId!))}
        />
      )}
    </div>
  );
};
