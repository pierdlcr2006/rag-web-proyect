import api from '../../../shared/lib/axios';

export type FileStatus = 'pending' | 'processing' | 'ready' | 'error';

export interface FileResponse {
  id: string;
  originalName: string;
  fileType: string;
  sizeBytes: number;
  status: FileStatus;
  createdAt: string;
}

export interface PaginatedFiles {
  data: FileResponse[];
  total: number;
  page: number;
  limit: number;
}

export const filesApi = {
  list: async (page = 1, limit = 20, conversationId?: string) => {
    const response = await api.get<PaginatedFiles>('/files', {
      params: { page, limit, conversationId }
    });
    return response.data;
  },

  upload: async (file: File, onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/files/${id}`);
  },

  get: async (id: string) => {
    const response = await api.get<FileResponse & { downloadUrl: string }>(`/files/${id}`);
    return response.data;
  }
};
