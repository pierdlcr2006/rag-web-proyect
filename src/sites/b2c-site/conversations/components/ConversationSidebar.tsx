import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Plus,
  Trash2,
  LogOut,
  CreditCard,
  Check,
  X,
  LayoutDashboard,
  Edit2,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { conversationsApi } from '../api/conversations.api';
import { useAuthStore, UserRole } from '../../auth/store/authStore';
import { useSidebarStore } from '../store/sidebarStore';

/**
 * Etiqueta que colapsa su propio ancho a 0 cuando el sidebar está comprimido.
 * Al colapsar el ancho del texto (no dejarlo fijo y recortarlo) es imposible que
 * el contenido se "desborde/congele" fuera del panel.
 */
const Label: React.FC<{ collapsed: boolean; className?: string; children: React.ReactNode; width?: string }> = ({
  collapsed,
  className = '',
  children,
  width = 'max-w-[180px]',
}) => (
  <span
    className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out ${
      collapsed ? 'max-w-0 opacity-0' : `${width} opacity-100`
    } ${className}`}
  >
    {children}
  </span>
);

export const ConversationSidebar: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  // Comprimido = no fijado. Toggle simple con el botón de abajo.
  const { isPinned, togglePinned } = useSidebarStore();
  const collapsed = !isPinned;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: conversationsApi.list,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => conversationsApi.update(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => conversationsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
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

  const rowBase =
    'flex items-center gap-3 px-4 py-3 rounded-none transition-colors duration-150 text-[10px] font-heading font-bold uppercase tracking-widest border';

  return (
    <aside
      className={`relative flex flex-col h-screen flex-shrink-0 overflow-hidden bg-[#0A0A0A] text-[#F4F2ED] border-r-2 border-white/10 font-body transition-[width] duration-[380ms] ease-in-out ${
        collapsed ? 'w-20' : 'w-80'
      }`}
    >
      {/* Logo (swap directo, sin cross-fade) */}
      <div className="flex items-center h-20 px-4 border-b border-white/10 shrink-0 overflow-hidden">
        <img
          src={collapsed ? '/logo-comprimido.png' : '/logo-3.png'}
          alt="TalKent AI"
          className="h-11 w-auto max-w-none select-none"
          decoding="async"
        />
      </div>

      {/* Acciones (oculto para admins) */}
      {user?.role !== UserRole.ADMIN && (
        <div className="px-4 pt-6 pb-4 shrink-0">
          <button
            onClick={() => navigate('/chat')}
            className="w-full flex items-center gap-2 px-3 py-3 bg-[#2563EB] text-white border-2 border-white/20 hover:border-white/40 hover:bg-[#1d4ed8] transition-colors duration-150 text-xs font-heading font-bold uppercase tracking-widest cursor-pointer"
            title="Nuevo chat"
          >
            <Plus size={16} className="flex-shrink-0" />
            <Label collapsed={collapsed} width="max-w-[150px]">
              Nuevo chat
            </Label>
          </button>

          <p className="mt-5 h-3">
            <Label collapsed={collapsed} width="max-w-[150px]" className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-[#2563EB]">
              Recientes
            </Label>
          </p>
        </div>
      )}

      {/* Lista de conversaciones */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-1.5 scrollbar-sidebar pb-4">
        {user?.role !== UserRole.ADMIN &&
          (isLoading
            ? !collapsed && (
                <div className="px-4 py-2 text-xs text-white/30 font-heading font-bold uppercase tracking-wider animate-pulse">
                  Cargando...
                </div>
              )
            : (conversations?.data || []).map((conv) => (
                <div key={conv.id} className="group relative">
                  {editingId === conv.id && !collapsed ? (
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-[#111111] border border-[#2563EB]">
                      <input
                        autoFocus
                        className="flex-1 min-w-0 bg-transparent border-none text-xs font-heading font-bold uppercase tracking-wider text-white outline-none"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        onBlur={handleSaveEdit}
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={handleSaveEdit} className="text-emerald-400 hover:text-emerald-300 cursor-pointer">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-white/40 hover:text-white/60 cursor-pointer">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <NavLink
                        to={`/chat/${conv.id}`}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 border-l-2 transition-colors duration-150 ${
                            isActive
                              ? 'bg-[#2563EB]/10 text-white border-[#2563EB]'
                              : 'text-white/45 border-transparent hover:text-white hover:bg-white/[0.03]'
                          }`
                        }
                        title={conv.title || 'Chat sin título'}
                      >
                        <MessageSquare size={16} className="flex-shrink-0 opacity-60" />
                        <Label collapsed={collapsed} className="text-xs font-heading font-bold uppercase tracking-wider">
                          {conv.title || 'Chat sin título'}
                        </Label>
                      </NavLink>

                      {!collapsed && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            onClick={(e) => handleStartEdit(e, conv.id, conv.title)}
                            className="p-1.5 text-white/40 hover:text-[#2563EB] hover:bg-white/[0.03] cursor-pointer"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (confirm('¿Eliminar chat?')) deleteMutation.mutate(conv.id);
                            }}
                            className="p-1.5 text-white/40 hover:text-red-400 hover:bg-white/[0.03] cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )))}
      </nav>

      {/* Área de usuario */}
      <div className="p-4 border-t border-white/5 bg-[#0B0B0B] space-y-3 shrink-0">
        <div className="flex items-center gap-3 p-3 bg-[#111111] border border-white/10">
          <div className="w-9 h-9 bg-[#2563EB] flex items-center justify-center text-white text-xs font-heading font-bold uppercase tracking-wider flex-shrink-0">
            {user?.email?.[0] || 'U'}
          </div>
          <div className={`flex flex-col min-w-0 overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out ${collapsed ? 'max-w-0 opacity-0' : 'max-w-[180px] opacity-100'}`}>
            <span className="text-xs font-heading font-bold text-white truncate uppercase tracking-wider whitespace-nowrap">
              {user?.email?.split('@')[0]}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
              <span className="text-[9px] font-heading font-bold text-[#2563EB] uppercase tracking-widest">{user?.plan}</span>
              <div className="w-1 h-1 rounded-full bg-[#2563EB]" />
              <span className="text-[9px] font-heading font-bold text-white/55 uppercase tracking-widest">Activo</span>
            </div>
          </div>
        </div>

        <NavLink
          to="/billing"
          className={({ isActive }) =>
            `${rowBase} ${
              isActive
                ? 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/25'
                : 'text-white/60 border-transparent hover:text-white hover:bg-white/[0.03] hover:border-white/10'
            }`
          }
          title="Facturación"
        >
          <CreditCard size={15} className="flex-shrink-0" />
          <Label collapsed={collapsed} width="max-w-[150px]">
            Facturación
          </Label>
        </NavLink>

        {user?.role === UserRole.ADMIN && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `${rowBase} ${
                isActive
                  ? 'bg-[#2563EB]/20 text-white border-[#2563EB]/25'
                  : 'text-white/60 border-transparent hover:text-white hover:bg-white/[0.03] hover:border-white/10'
              }`
            }
            title="Admin Dashboard"
          >
            <LayoutDashboard size={15} className="flex-shrink-0" />
            <Label collapsed={collapsed} width="max-w-[150px]">
              Admin Dashboard
            </Label>
          </NavLink>
        )}

        <button
          onClick={handleLogout}
          className={`${rowBase} w-full text-white/60 border-transparent hover:text-red-400 hover:bg-red-400/5 hover:border-red-400/10 cursor-pointer`}
          title="Cerrar sesión"
        >
          <LogOut size={15} className="flex-shrink-0" />
          <Label collapsed={collapsed} width="max-w-[150px]">
            Cerrar sesión
          </Label>
        </button>
      </div>

      {/* Toggle comprimir / expandir */}
      <div className="p-4 border-t border-white/10 bg-[#0B0B0B] shrink-0">
        <button
          onClick={togglePinned}
          className={`${rowBase} w-full cursor-pointer ${
            collapsed
              ? 'text-white/60 border-transparent hover:text-white hover:bg-white/[0.03] hover:border-white/10'
              : 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/25 hover:bg-[#2563EB]/30'
          }`}
          title={collapsed ? 'Expandir menú' : 'Comprimir menú'}
        >
          {collapsed ? (
            <PanelLeft size={15} className="flex-shrink-0" />
          ) : (
            <PanelLeftClose size={15} className="flex-shrink-0" />
          )}
          <Label collapsed={collapsed} width="max-w-[150px]">
            Comprimir menú
          </Label>
        </button>
      </div>
    </aside>
  );
};
