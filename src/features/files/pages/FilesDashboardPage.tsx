import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FileText, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  HardDrive,
  Sparkles,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { filesApi } from '../api/files.api';
import { FileUploader } from '../components/FileUploader';
import { ConversationSidebar } from '../../conversations/components/ConversationSidebar';
import { cn } from '@/lib/utils';
import { BackgroundPlus } from '../../../components/ui/background-plus';

export const FilesDashboardPage: React.FC = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: () => filesApi.list(1, 50),
    refetchInterval: 5000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => filesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Background Pattern */}
      <BackgroundPlus plusColor="#3b82f6" opacity={0.08} />
      
      <ConversationSidebar />

      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[128px] animate-pulse delay-700" />
      </div>

      {/* Mouse Tracking Glow */}
      <motion.div 
        className="fixed w-[40rem] h-[40rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[100px]"
        animate={{ x: mousePosition.x - 300, y: mousePosition.y - 300 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      />

      <main className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
        {/* Header Area */}
        <header className="p-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                <HardDrive size={20} />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white/90">Base de Conocimientos</h1>
            </div>
            <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Knowledge Intelligence Engine</p>
          </div>

          <button
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-[1.2rem] font-black text-sm uppercase tracking-wider hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-95"
          >
            <Upload size={18} /> Subir Documento
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-4">
          <div className="max-w-6xl mx-auto space-y-10">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[2rem] p-6 border-white/5 hover:border-white/10 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Documentos Activos</p>
                    <p className="text-2xl font-black text-white/90 tracking-tighter">{data?.meta?.totalItems || 0}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-[2rem] p-6 border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-green-400">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Estado del Motor</p>
                    <p className="text-2xl font-black text-green-400/90 tracking-tighter">Optimizado</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Files Table */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl shadow-black/40"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Nombre del Archivo</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Estado</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Tamaño</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr><td colSpan={4} className="px-8 py-20 text-center text-white/20 font-bold animate-pulse">Consultando base de datos...</td></tr>
                  ) : (data?.items?.length ?? 0) === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                          <Search size={48} />
                          <p className="text-sm font-bold uppercase tracking-widest">No hay archivos indexados</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data?.items.map((file, idx) => (
                      <motion.tr 
                        key={file.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                              <FileText size={18} />
                            </div>
                            <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{file.originalName}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider",
                            file.status === 'ready' ? "bg-green-500/5 border-green-500/20 text-green-400" :
                            file.status === 'error' ? "bg-red-500/5 border-red-500/20 text-red-400" : "bg-blue-500/5 border-blue-500/20 text-blue-400 animate-pulse"
                          )}>
                            {file.status === 'ready' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                            {file.status === 'ready' ? 'Listo' : 'Procesando'}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-white/40 tracking-wider">
                          {formatSize(file.sizeBytes)}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => { if(confirm('¿Eliminar archivo?')) deleteMutation.mutate(file.id); }}
                            className="p-2 text-white/10 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Uploader Modal - Premium Style */}
      <AnimatePresence>
        {showUploader && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card rounded-[3rem] p-10 max-w-2xl w-full border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-primary animate-pulse" />
              
              <button 
                onClick={() => setShowUploader(false)}
                className="absolute top-8 right-8 p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-black text-white/90 tracking-tighter">Entrenar mi IA</h2>
                <p className="text-white/40 text-sm font-medium mt-1">Sube documentos para ampliar la base de conocimientos.</p>
              </div>

              <FileUploader onClose={() => setShowUploader(false)} />
              
              <div className="mt-10 flex justify-end gap-4">
                <button
                  onClick={() => setShowUploader(false)}
                  className="px-8 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 shadow-xl shadow-white/5"
                >
                  Finalizar Carga
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
