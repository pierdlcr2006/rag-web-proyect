import React, { useCallback, useState } from 'react';
import { useDropzone, type Accept, type FileRejection } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useAuthStore, UserPlan } from '../../auth/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { UploadProgressGSAP } from './UploadProgressGSAP';
import type { UploadFileEntry, UploadStage } from './UploadProgressGSAP';
import { filesApi } from '../api/files.api';

// Tipos soportados por el backend (MIME_TO_FILE_TYPE en plan-limits.constants.ts).
// Mantener sincronizado: PDF, Word, imágenes, video y audio. NO incluye PowerPoint.
const ACCEPTED_TYPES: Accept = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'video/x-msvideo': ['.avi'],
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
  'audio/mp4': ['.m4a'],
};

const randomUUID = (): string =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

interface Props {
  conversationId?: string;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

const PLAN_LIMITS = {
  [UserPlan.FREE]:     { maxFiles: 5,        maxSizeMB: 10   },
  [UserPlan.PRO]:      { maxFiles: 50,       maxSizeMB: 100  },
  [UserPlan.BUSINESS]: { maxFiles: Infinity, maxSizeMB: 1024 },
};

// Time (ms) each intermediate stage is shown so the user sees the animation
const STAGE_DELAY = 1200;
const PROCESSING_POLL_INTERVAL = 2000;
const PROCESSING_TIMEOUT = 5 * 60 * 1000;

export const FileUploader: React.FC<Props> = ({ conversationId, onClose, onUploadSuccess }) => {
  const [entries, setEntries] = useState<UploadFileEntry[]>([]);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const setStage = (id: string, stage: UploadStage) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, stage } : e)));

  const setProgress = (id: string, progress: number) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, progress } : e)));

  const setError = (id: string, message: string) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, stage: 'error', error: message } : e)));

  const uploadFile = async (file: File, id: string) => {
    try {
      // ── Stage 1: Uploading ───────────────────────────────────────────────
      setStage(id, 'uploading');

      const uploaded = await filesApi.upload(file, conversationId, (pct) => {
        setProgress(id, pct);
      });

      // ── Stage 2: Processing (show while backend parses the file) ─────────
      setStage(id, 'processing');
      await delay(STAGE_DELAY);

      // ── Stage 3: Initializing embeddings ─────────────────────────────────
      setStage(id, 'embedding');
      const processedFile = await waitForFileProcessing(uploaded.fileId);

      if (processedFile.status === 'error') {
        throw new Error(processedFile.errorMessage || 'No se pudo procesar el archivo');
      }

      // ── Stage 4: Completed ───────────────────────────────────────────────
      setStage(id, 'completed');
      onUploadSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['files'] });
    } catch (err: unknown) {
      // Mostrar el motivo real del backend (ej. tipo no soportado / límite de plan)
      // en vez de un genérico "Error al procesar".
      setError(id, getFriendlyUploadError(err));
      queryClient.invalidateQueries({ queryKey: ['files'] });
    }
  };

  const onDrop = useCallback(
    (accepted: File[]) => {
      const newEntries: UploadFileEntry[] = accepted.map((file) => ({
        id: randomUUID(),
        name: file.name,
        size: file.size,
        stage: 'pending',
        progress: 0,
      }));

      setEntries((prev) => [...prev, ...newEntries]);

      // Kick off uploads with tiny stagger so row entrance animations look nice
      newEntries.forEach((entry, i) => {
        setTimeout(() => uploadFile(accepted[i], entry.id), i * 300);
      });
    },
    [conversationId],
  );

  // Archivos rechazados en el cliente (tipo no soportado o demasiado grande):
  // se muestran como fila de error sin intentar subirlos.
  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    const rejectedEntries: UploadFileEntry[] = rejections.map(({ file, errors }) => {
      const tooBig = errors.some((e) => e.code === 'file-too-large');
      return {
        id: randomUUID(),
        name: file.name,
        size: file.size,
        stage: 'error' as UploadStage,
        progress: 100,
        error: tooBig ? 'Excede el tamaño permitido' : 'Tipo de archivo no soportado',
      };
    });
    setEntries((prev) => [...prev, ...rejectedEntries]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: ACCEPTED_TYPES,
    maxSize: (user ? PLAN_LIMITS[user.plan].maxSizeMB : 10) * 1024 * 1024,
  });

  return (
    <div className="p-5 space-y-4 font-body">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-none p-10 text-center cursor-pointer
          transition-all duration-300 group
          ${isDragActive
            ? 'border-[#2563EB] bg-[#2563EB]/10'
            : 'border-white/15 hover:border-[#2563EB] hover:bg-white/[0.02]'}
        `}
      >
        <input {...getInputProps()} />

        {/* Animated ring on drag */}
        {isDragActive && (
          <div className="absolute inset-0 rounded-none border-2 border-[#2563EB] animate-pulse opacity-30 pointer-events-none" />
        )}

        <div className="flex flex-col items-center gap-4 pointer-events-none">
          <div
            className={`w-12 h-12 rounded-none border flex items-center justify-center transition-all duration-300
              ${isDragActive ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'bg-white/[0.03] border-white/10 text-white/30 group-hover:border-[#2563EB] group-hover:text-[#2563EB]'}`}
          >
            <Upload size={20} />
          </div>
          <div>
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-white/60 group-hover:text-[#F4F2ED] transition-colors">
              {isDragActive ? 'Suelta aquí los archivos' : 'Arrastra archivos o haz clic'}
            </p>
            <p className="text-[11px] text-white/30 mt-1.5 font-mono">
              PDF, WORD, IMÁGENES, VIDEO, AUDIO · HASTA {user ? PLAN_LIMITS[user.plan].maxSizeMB : 10} MB
            </p>
          </div>
        </div>
      </div>

      {/* GSAP animated progress */}
      <UploadProgressGSAP files={entries} />
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const waitForFileProcessing = async (fileId: string) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < PROCESSING_TIMEOUT) {
    const file = await filesApi.get(fileId);
    if (file.status === 'ready' || file.status === 'error') {
      return file;
    }
    await delay(PROCESSING_POLL_INTERVAL);
  }

  throw new Error('El archivo sigue procesándose. Revisa el estado en la barra lateral.');
};

const getFriendlyUploadError = (err: unknown): string => {
  const res = (err as { response?: { data?: { message?: string | string[] } } }).response;
  const raw = res?.data?.message;
  const backendMsg = Array.isArray(raw) ? raw[0] : raw;
  const message = backendMsg || (err instanceof Error ? err.message : undefined);

  if (message && /unsupported file type/i.test(message)) {
    return 'Tipo de archivo no soportado';
  }
  if (message && /not allowed on the .* plan/i.test(message)) {
    return 'No disponible en tu plan';
  }
  if (message && /quota exceeded|too many requests|rate-limits|free_tier/i.test(message)) {
    return 'Gemini agotó su cuota temporalmente. Intenta nuevamente más tarde.';
  }

  return message || 'No se pudo subir el archivo';
};
