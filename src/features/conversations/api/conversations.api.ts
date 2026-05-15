import api from '../../../shared/lib/axios';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sourcesUsed?: any;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  description?: string;
  updatedAt: string;
  messages?: Message[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const conversationsApi = {
  list: async () => {
    const response = await api.get<PaginatedResponse<Conversation>>('/conversations');
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get<Conversation>(`/conversations/${id}`);
    return response.data;
  },

  create: async (title: string) => {
    const response = await api.post<Conversation>('/conversations', { title });
    return response.data;
  },

  update: async (id: string, title: string) => {
    const response = await api.patch<Conversation>(`/conversations/${id}`, { title });
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/conversations/${id}`);
  }
};
