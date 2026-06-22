import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useAuthStore, UserPlan } from '../../auth/store/authStore';
import api from '../../../../shared/lib/axios';
import { useQueryClient } from '@tanstack/react-query';
import { UploadProgressGSAP } from './UploadProgressGSAP';
import type { UploadFileEntry, UploadStage } from './UploadProgressGSAP';

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

export const FileUploader: React.FC<Props> = ({ conversationId, onClose, onUploadSuccess }) => {
  const [entries, setEntries] = useState<UploadFileEntry[]>([]);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const setStage = (id: string, stage: UploadStage) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, stage } : e)));

  const setProgress = (id: string, progress: number) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, progress } : e)));

  const uploadFile = async (file: File, id: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (conversationId) formData.append('conversationId', conversationId);

    try {
      // ── Stage 1: Uploading ───────────────────────────────────────────────
      setStage(id, 'uploading');

      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / (e.total || 100));
          setProgress(id, pct);
        },
      });

      // ── Stage 2: Processing (show while backend parses the file) ─────────
      setStage(id, 'processing');
      await delay(STAGE_DELAY);

      // ── Stage 3: Initializing embeddings ─────────────────────────────────
      setStage(id, 'embedding');
      await delay(STAGE_DELAY);

      // ── Stage 4: Completed ───────────────────────────────────────────────
      setStage(id, 'completed');
      onUploadSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['files'] });
    } catch {
      setStage(id, 'error');
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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
              PDF, IMÁGENES, VIDEO, AUDIO · HASTA {user ? PLAN_LIMITS[user.plan].maxSizeMB : 10} MB
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
