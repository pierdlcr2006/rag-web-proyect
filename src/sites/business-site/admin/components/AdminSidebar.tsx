import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  ShieldCheck,
  BarChart3,
  Activity,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../../../b2c-site/auth/store/authStore';

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/admin' },
    { icon: <BarChart3 size={18} />, label: 'Facturación', path: '/admin/billing' },
    { icon: <Users size={18} />, label: 'Usuarios', path: '/admin/users' },
    { icon: <FileText size={18} />, label: 'Logs de Sistema', path: '/admin/logs' },
    { icon: <Activity size={18} />, label: 'Estado API', path: '/admin/status' },
  ];

  return (
    <aside className="w-72 flex flex-col h-screen bg-slate-900 text-slate-400 border-r border-white/5 z-20">
      {/* Admin Brand */}
      <div className="p-8 flex items-center gap-3 border-b border-white/5">
        <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-600/20">
          <ShieldCheck size={20} />
        </div>
        <div>
          <span className="text-lg font-black text-white tracking-tight block">ADMIN</span>
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Business Control</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p className="px-4 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Principal</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border ${
                isActive 
                  ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' 
                  : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5'
              }`
            }
          >
            {item.icon}
            <span className="text-sm font-bold">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Area */}
      <div className="p-6 border-t border-white/5 bg-black/20 space-y-4">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white text-sm font-black shadow-lg">
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-white truncate">{user?.email?.split('@')[0]}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Administrador</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 text-xs font-bold border border-transparent hover:border-red-400/20"
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
