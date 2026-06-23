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
  HardDrive,
  AlertCircle,
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
    <div className="w-80 h-full border-l-2 border-white/10 bg-[#0A0A0A] flex flex-col z-20 font-body">
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
        <h2 className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-[#F4F2ED] flex items-center gap-2">
          <HardDrive size={16} className="text-[#2563EB]" />
          Contexto Actual
        </h2>
        <div className="text-[10px] font-mono font-bold text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/25 px-2.5 py-1 rounded-none uppercase tracking-wider">
          {files.length} {files.length === 1 ? 'ARCHIVO' : 'ARCHIVOS'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-white/10 my-4 mx-2 rounded-none space-y-4">
            <div className="w-12 h-12 bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/20 rounded-none">
              <HardDrive size={20} />
            </div>
            <div>
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-white/60">Caja Vacía</p>
              <p className="text-[11px] text-white/40 mt-1 leading-relaxed">
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
                exit={{ opacity: 0 }}
                className={`group p-3 rounded-none bg-white/[0.02] border transition-colors flex items-start gap-3 ${
                  file.status === 'error'
                    ? 'border-red-500/30 hover:bg-red-500/[0.03] hover:border-red-500/50'
                    : 'border-white/10 hover:bg-white/[0.04] hover:border-[#2563EB]'
                }`}
              >
                <div className="w-9 h-9 rounded-none border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0">
                  {getFileIcon(file.originalName)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white/80 truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/40 font-mono">{formatBytes(file.sizeBytes)}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-[9px] text-white/40 truncate font-mono uppercase">
                      {new Date(file.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {file.status === 'error' && (
                    <p className="mt-2 text-[10px] leading-snug text-red-300/80 font-mono">
                      {file.errorMessage || 'Error al procesar el archivo'}
                    </p>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="shrink-0 flex items-center pt-1">
                  {(file.status === 'pending' || file.status === 'processing') ? (
                    <Loader2 className="w-4 h-4 text-[#2563EB] animate-spin" />
                  ) : file.status === 'error' ? (
                    <span title={file.errorMessage || 'Error en el procesamiento'}>
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    </span>
                  ) : (
                    <div className="w-2 h-2 rounded-none bg-emerald-500/50" title="Listo para usarse" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
