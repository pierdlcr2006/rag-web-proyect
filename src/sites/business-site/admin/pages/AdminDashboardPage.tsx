import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  DollarSign, Cloud, Cpu, Users, FileText, MessageSquare,
  HardDrive, TrendingUp, Activity, Loader2, ShieldCheck,
  ArrowUpRight, Sparkles
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { adminApi } from '../api/admin.api';
import { AdminSidebar } from '../components/AdminSidebar';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];

const StatCard: React.FC<{
  title: string; value: string | number; subtitle?: string;
  icon: React.ReactNode; color: string; delay?: number;
}> = ({ title, value, subtitle, icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card rounded-3xl p-6 border-white/10 group hover:border-white/20 transition-all duration-500"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg`}
        style={{ background: `${color}15`, borderColor: `${color}30`, color }}>
        {icon}
      </div>
      <ArrowUpRight size={16} className="text-white/10 group-hover:text-white/30 transition-colors" />
    </div>
    <p className="text-2xl font-black text-white/90 tracking-tight">{value}</p>
    <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.15em] mt-1">{title}</p>
    {subtitle && <p className="text-xs text-white/20 mt-1 font-medium">{subtitle}</p>}
  </motion.div>
);

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; color: string }> = ({ icon, title, color }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
      style={{ background: `${color}15`, borderColor: `${color}30`, color }}>
      {icon}
    </div>
    <h2 className="text-lg font-black text-white/80 tracking-tight">{title}</h2>
  </div>
);

export const AdminDashboardPage: React.FC = () => {
  const { data: billing, isLoading: billingLoading } = useQuery({
    queryKey: ['admin-billing'], queryFn: adminApi.getBillingStats,
  });
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['admin-services'], queryFn: adminApi.getServiceStats,
  });

  const isLoading = billingLoading || servicesLoading;

  const planData = billing?.stripe.planDistribution
    ? Object.entries(billing.stripe.planDistribution).map(([name, value]) => ({ name, value }))
    : [];

  const fileTypeData = services?.files.byType
    ? Object.entries(services.files.byType).map(([name, value]) => ({ name, value }))
    : [];

  const cloudCostData = [
    { name: 'Stripe Revenue', cost: billing?.stripe.totalRevenue || 0 },
    { name: 'AWS Costs', cost: billing?.aws.totalCost || 0 },
    { name: 'GCP Estimated', cost: billing?.gcp.estimatedCost || 0 },
  ];

  return (
    <div className="flex flex-col min-w-0 relative z-10">
      {/* Header */}
      <header className="p-10 pb-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-xs font-black uppercase tracking-widest mb-4">
          <ShieldCheck size={14} /> Panel Administrativo
        </motion.div>
        <h1 className="text-3xl font-black tracking-tighter text-white/90">Dashboard de Facturación y Servicios</h1>
        <p className="text-white/30 font-medium mt-1">Monitoreo en tiempo real de costos cloud y uso de servicios.</p>
      </header>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto w-full p-10 pt-4 space-y-10">
          {/* ... cards and charts ... */}
          {/* Note: Keeping the same structure as before but without the full page wrappers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard title="Ingresos Stripe" value={`$${billing?.stripe.totalRevenue?.toFixed(2) || '0.00'}`}
              subtitle={`${billing?.stripe.activeSubscriptions || 0} suscripciones activas`}
              icon={<DollarSign size={22} />} color="#10b981" delay={0} />
            <StatCard title="Costos AWS" value={`$${billing?.aws.totalCost?.toFixed(2) || '0.00'}`}
              subtitle={`${billing?.aws.services?.length || 0} servicios activos`}
              icon={<Cloud size={22} />} color="#f59e0b" delay={0.05} />
            <StatCard title="Costos GCP (Est.)" value={`$${billing?.gcp.estimatedCost?.toFixed(4) || '0.0000'}`}
              subtitle="Gemini AI estimado"
              icon={<Cpu size={22} />} color="#3b82f6" delay={0.1} />
            <StatCard title="Usuarios Totales" value={services?.users.total || 0}
              subtitle={`+${services?.users.recentSignups || 0} esta semana`}
              icon={<Users size={22} />} color="#8b5cf6" delay={0.15} />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SectionTitle icon={<TrendingUp size={18} />} title="Resumen de Costos Cloud" color="#06b6d4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-3xl p-6 border-white/10">
                <p className="text-xs font-black text-white/30 uppercase tracking-widest mb-4">Ingresos vs Costos</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={cloudCostData} barSize={40}>
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, fontSize: 12, fontWeight: 700 }}
                      formatter={(v: number) => [`$${v.toFixed(4)}`, 'Monto']} />
                    <Bar dataKey="cost" radius={[12, 12, 0, 0]}>
                      {cloudCostData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card rounded-3xl p-6 border-white/10">
                <p className="text-xs font-black text-white/30 uppercase tracking-widest mb-4">Servicios AWS Detalle</p>
                {billing?.aws.services && billing.aws.services.length > 0 ? (
                  <div className="space-y-3 max-h-[240px] overflow-y-auto scrollbar-sidebar">
                    {billing.aws.services.map((svc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/5">
                        <span className="text-sm font-bold text-white/60 truncate mr-4">{svc.name}</span>
                        <span className="text-sm font-black text-amber-400 whitespace-nowrap">${svc.cost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-white/20">
                    <Cloud size={32} className="mb-2" />
                    <p className="text-sm font-bold">Sin datos de AWS disponibles</p>
                    <p className="text-xs mt-1">Verifica permisos de Cost Explorer</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <SectionTitle icon={<Sparkles size={18} />} title="Google Cloud / Gemini AI" color="#3b82f6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {billing?.gcp.breakdown?.map((item, i) => (
                <div key={i} className="glass-card rounded-3xl p-6 border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-black text-white/70">{item.service}</p>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full border border-blue-500/20">
                      {item.calls} calls
                    </span>
                  </div>
                  <p className="text-2xl font-black text-white/90">${item.estimatedCost.toFixed(4)}</p>
                  <p className="text-[10px] text-white/20 mt-1 font-bold uppercase tracking-widest">Costo estimado</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <SectionTitle icon={<Activity size={18} />} title="Métricas de Servicios" color="#8b5cf6" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard title="Archivos Subidos" value={services?.files.total || 0}
                subtitle={`${services?.files.totalStorageMB?.toFixed(1) || 0} MB total`}
                icon={<FileText size={22} />} color="#06b6d4" />
              <StatCard title="Conversaciones" value={services?.conversations.total || 0}
                subtitle={`${services?.conversations.activeLastWeek || 0} activas (7d)`}
                icon={<MessageSquare size={22} />} color="#f59e0b" />
              <StatCard title="Mensajes Totales" value={services?.messages.total || 0}
                subtitle={`${services?.messages.totalTokensUsed?.toLocaleString() || 0} tokens`}
                icon={<Activity size={22} />} color="#ef4444" />
              <StatCard title="Almacenamiento" value={`${services?.files.totalStorageMB?.toFixed(1) || 0} MB`}
                icon={<HardDrive size={22} />} color="#10b981" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6 border-white/10">
              <p className="text-xs font-black text-white/30 uppercase tracking-widest mb-4">Distribución de Planes</p>
              {planData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={planData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                      dataKey="value" stroke="none" paddingAngle={4}>
                      {planData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, fontSize: 12, fontWeight: 700 }} />
                    <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-white/20 py-16 font-bold">Sin datos</p>}
            </div>

            <div className="glass-card rounded-3xl p-6 border-white/10">
              <p className="text-xs font-black text-white/30 uppercase tracking-widest mb-4">Archivos por Tipo</p>
              {fileTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={fileTypeData} barSize={36}>
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, fontSize: 12, fontWeight: 700 }} />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                      {fileTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-white/20 py-16 font-bold">Sin datos</p>}
            </div>
          </motion.div>

          {billing?.stripe.recentPayments && billing.stripe.recentPayments.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <SectionTitle icon={<DollarSign size={18} />} title="Pagos Recientes (Stripe)" color="#10b981" />
              <div className="glass-card rounded-3xl border-white/10 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Email', 'Monto', 'Estado', 'Fecha'].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-[10px] font-black text-white/20 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {billing.stripe.recentPayments.map((p) => (
                      <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-white/60">{p.customerEmail || '—'}</td>
                        <td className="px-6 py-4 text-sm font-black text-emerald-400">${p.amount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                            p.status === 'succeeded' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>{p.status}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/30 font-medium">{new Date(p.created).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          <div className="h-8" />
        </div>
      )}
    </div>
  );
};
