import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  File, 
  Image as ImageIcon, 
  Video, 
  Music, 
  FileText, 
  Loader2, 
  Plus, 
  HardDrive 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { filesApi } from '../api/files.api';


interface Props {
  conversationId: string;
  onUploadClick: () => void;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <ImageIcon size={18} className="text-blue-400" />;
  if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext)) return <Video size={18} className="text-purple-400" />;
  if (['mp3', 'wav', 'ogg'].includes(ext)) return <Music size={18} className="text-emerald-400" />;
  if (['pdf'].includes(ext)) return <FileText size={18} className="text-red-400" />;
  return <File size={18} className="text-white/40" />;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const FilesSidebar: React.FC<Props> = ({ conversationId, onUploadClick }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['files', conversationId],
    queryFn: () => filesApi.list(1, 100, conversationId),
    enabled: !!conversationId,
    refetchInterval: (query) => {
      // Auto-refetch if any file is pending or processing
      const hasProcessing = query.state.data?.data?.some(f => f.status === 'pending' || f.status === 'processing');
      return hasProcessing ? 2000 : false;
    }
  });

  const files = data?.data || [];

  return (
    <div className="w-80 h-full border-l border-white/5 bg-slate-950/50 flex flex-col z-20 backdrop-blur-xl">
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
        <h2 className="font-bold text-white/90 text-sm flex items-center gap-2">
          <HardDrive size={16} className="text-primary" />
          Contexto Actual
        </h2>
        <div className="text-[10px] font-bold text-white/30 bg-white/5 px-2 py-1 rounded-md">
          {files.length} {files.length === 1 ? 'ARCHIVO' : 'ARCHIVOS'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
              <HardDrive size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">Caja Vacía</p>
              <p className="text-xs text-white/40 mt-1">
                No hay archivos cargados en esta conversación.
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-colors flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  {getFileIcon(file.originalName)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80 truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/40">{formatBytes(file.sizeBytes)}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-[10px] text-white/40 truncate">
                      {new Date(file.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="shrink-0 flex items-center pt-1">
                  {(file.status === 'pending' || file.status === 'processing') ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : file.status === 'error' ? (
                    <div className="w-2 h-2 rounded-full bg-red-500" title="Error en el procesamiento" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" title="Listo para usarse" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-slate-950/80 backdrop-blur-md">
        <button
          onClick={onUploadClick}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 text-primary transition-all text-sm font-medium group"
        >
          <Plus size={16} className="group-hover:scale-110 transition-transform" />
          Añadir Contexto
        </button>
      </div>
    </div>
  );
};
