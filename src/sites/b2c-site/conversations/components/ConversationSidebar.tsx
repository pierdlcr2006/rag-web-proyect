import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  LogOut, 
  CreditCard,
  ChevronRight,
  Sparkles,
  Edit2,
  Check,
  X,
  LayoutDashboard
} from 'lucide-react';
import { conversationsApi } from '../api/conversations.api';
import { useAuthStore, UserRole } from '../../auth/store/authStore';

export const ConversationSidebar: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);

  // Local state for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: conversationsApi.list,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => 
      conversationsApi.update(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => conversationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const handleStartEdit = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      updateMutation.mutate({ id: editingId, title: editTitle.trim() });
    } else {
      setEditingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-80 flex flex-col h-screen bg-slate-950/40 backdrop-blur-3xl text-slate-300 border-r border-white/5 z-20">
      {/* Brand / Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Sparkles size={20} />
        </div>
        <span className="text-xl font-black text-white tracking-tight">RAG AI</span>
      </div>

      {/* Main Actions (Hidden for Admins) */}
      {user?.role !== UserRole.ADMIN && (
        <>
          <div className="px-4 mb-8 space-y-3">
            <button
              onClick={() => navigate('/chat')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 text-sm font-bold shadow-xl shadow-black/20"
            >
              <Plus size={18} /> Nuevo chat
            </button>
          </div>

          <div className="px-8 mb-4">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Recientes</p>
          </div>
        </>
      )}

      {/* Conversations List (Hidden for Admins) */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-sidebar pb-4">
        {user?.role !== UserRole.ADMIN && (
          isLoading ? (
            <div className="px-4 py-2 text-xs text-slate-600 font-bold animate-pulse">Cargando...</div>
          ) : (
            (conversations?.data || []).map((conv) => (
              <div key={conv.id} className="group relative">
                {editingId === conv.id ? (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 border border-primary/30">
                    <input
                      autoFocus
                      className="flex-1 bg-transparent border-none text-sm font-bold text-white outline-none"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      onBlur={handleSaveEdit}
                    />
                    <div className="flex items-center gap-1">
                      <button onClick={handleSaveEdit} className="text-emerald-400 hover:text-emerald-300">
                        <Check size={14} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-white/40 hover:text-white/60">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <NavLink
                      to={`/chat/${conv.id}`}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 border ${
                          isActive 
                            ? 'bg-white/5 text-white border-white/10' 
                            : 'text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/5'
                        }`
                      }
                    >
                      <MessageSquare size={18} className="flex-shrink-0 opacity-40" />
                      <span className="truncate text-sm font-bold">{conv.title || 'Chat sin título'}</span>
                    </NavLink>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button
                        onClick={(e) => handleStartEdit(e, conv.id, conv.title)}
                        className="p-1.5 text-slate-700 hover:text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if(confirm('¿Eliminar chat?')) deleteMutation.mutate(conv.id);
                        }}
                        className="p-1.5 text-slate-700 hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )
        )}
      </nav>

      {/* User Area */}
      <div className="p-6 border-t border-white/5 bg-black/20 space-y-3">
        <div className="flex items-center gap-3 p-3 mb-2 bg-white/5 rounded-2xl border border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-black uppercase shadow-lg">
            {user?.email?.[0] || 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-white truncate">{user?.email?.split('@')[0]}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-primary uppercase tracking-wider">{user?.plan}</span>
              <div className="w-1 h-1 rounded-full bg-slate-700"></div>
              <span className="text-[10px] font-bold text-slate-600">Activo</span>
            </div>
          </div>
        </div>
        
        <NavLink 
          to="/billing"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-xs font-bold border ${
              isActive ? 'bg-primary/20 text-primary border-primary/20' : 'text-slate-500 border-transparent hover:text-white hover:bg-white/5'
            }`
          }
        >
          <CreditCard size={16} /> Facturación
        </NavLink>

        {user?.role === UserRole.ADMIN && (
          <NavLink 
            to="/admin"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-xs font-bold border ${
                isActive ? 'bg-violet-500/20 text-violet-400 border-violet-500/20' : 'text-slate-500 border-transparent hover:text-white hover:bg-white/5'
              }`
            }
          >
            <LayoutDashboard size={16} /> Admin Dashboard
          </NavLink>
        )}

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 text-xs font-bold"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
};
