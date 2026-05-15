import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  BookOpen,
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
import { AnimatedAIChat } from '../../../components/ui/animated-ai-chat';
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
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl w-full space-y-6 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-3"
          >
            <BookOpen size={26} />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight text-white/90">Nuevo Cuaderno</h1>
          <p className="text-white/40 text-sm">Dale un nombre o elige una sugerencia</p>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              onClick={() => setInputValue(s.label)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.07] hover:border-primary/30 rounded-full text-xs text-white/50 hover:text-white/90 transition-all group"
            >
              <span className="text-primary/50 group-hover:text-primary transition-colors">{s.icon}</span>
              {s.label}
            </motion.button>
          ))}
        </div>

        {/* Input + button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Nombre del cuaderno..."
            className="w-full bg-transparent px-5 py-4 text-sm text-white/80 placeholder:text-white/20 focus:outline-none"
            autoFocus
          />
          <div className="px-3 pb-3 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isCreating}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-wait"
            >
              {isCreating
                ? <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : <ArrowRight size={14} />
              }
              {isCreating ? 'Creando...' : 'Continuar'}
            </button>
          </div>
        </motion.div>
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
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl w-full space-y-6 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3"
          >
            <Upload size={26} />
          </motion.div>
          <h2 className="text-3xl font-black tracking-tight text-white/90">Sube tus archivos</h2>
          <p className="text-white/40 text-sm">
            Añade los documentos, imágenes o archivos que quieres consultar con la IA
          </p>
        </div>

        {/* File uploader */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/[0.07] rounded-3xl overflow-hidden"
        >
          <FileUploader
            conversationId={conversationId}
            onClose={() => {}}
            onUploadSuccess={() => setUploadedCount((c) => c + 1)}
          />
        </motion.div>

        {/* Done button — only enabled when ≥1 file uploaded */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col items-center gap-2"
        >
          <button
            onClick={onDone}
            disabled={uploadedCount === 0}
            className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-slate-200 transition-all active:scale-95 shadow-xl shadow-white/5 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
          >
            <CheckCircle2 size={18} />
            Listo, ir al chat
            {uploadedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-black/20 rounded-md text-[10px] font-black">
                {uploadedCount} {uploadedCount === 1 ? 'archivo' : 'archivos'}
              </span>
            )}
          </button>
          {uploadedCount === 0 && (
            <p className="text-[11px] text-white/25 font-medium">
              Sube al menos un archivo para continuar
            </p>
          )}
        </motion.div>
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
    <div className="flex h-screen bg-slate-950 overflow-hidden relative">
      <ConversationSidebar />

      <main className="flex-1 flex flex-col min-w-0 relative h-screen">
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

