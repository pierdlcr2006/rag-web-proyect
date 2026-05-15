import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { 
  Users, 
  Search, 
  MoreVertical, 
  UserPlus,
  Shield,
  User,
  Mail,
  Calendar
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminApi.getUsers,
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestión de Usuarios</h1>
          <p className="text-slate-400 mt-2">Administra los accesos, roles y planes de los usuarios del sistema.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
          <UserPlus size={18} />
          Nuevo Usuario
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Usuarios</div>
          <div className="text-2xl font-bold text-white">{users?.length || 0}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Administradores</div>
          <div className="text-2xl font-bold text-white">{users?.filter(u => u.role === 'admin').length || 0}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Plan Pro</div>
          <div className="text-2xl font-bold text-white">{users?.filter(u => u.plan === 'pro').length || 0}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Plan Business</div>
          <div className="text-2xl font-bold text-white">{users?.filter(u => u.plan === 'business').length || 0}</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por email o ID..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
            Filtrar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold">Rol</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold">Creado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-3/4" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-1/2" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-1/2" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-1/2" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : (
                users?.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{user.email}</div>
                          <div className="text-[10px] text-slate-500 font-mono uppercase">{user.id.split('-')[0]}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold ${
                        user.plan === 'business' ? 'text-orange-500' : 
                        user.plan === 'pro' ? 'text-emerald-500' : 'text-slate-400'
                      }`}>
                        {user.plan.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-500 hover:text-white transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
