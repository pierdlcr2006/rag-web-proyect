import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Cloud, 
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';

export const AdminBillingPage: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-billing-stats'],
    queryFn: adminApi.getBillingStats,
    refetchInterval: 30000, // Refresh every 30s
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
        Error al cargar las estadísticas de facturación.
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Facturación Consolidada</h1>
          <p className="text-slate-400 mt-2">Visión general de ingresos (Stripe) y costos de infraestructura (AWS/GCP).</p>
        </div>
        <div className="px-4 py-2 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <Activity size={14} className="text-emerald-500 animate-pulse" />
          Actualizado en tiempo real
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <DollarSign size={24} />
            </div>
            <span className="text-slate-400 font-medium">Ingresos Totales (Stripe)</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            ${stats?.stripe.totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 text-emerald-500 text-sm">
            <TrendingUp size={14} />
            <span>+12.5% este mes</span>
          </div>
        </div>

        {/* AWS Costs Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-orange-500">
            <Cloud size={80} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
              <Cloud size={24} />
            </div>
            <span className="text-slate-400 font-medium">Gastos AWS (Estimado)</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            ${stats?.aws.totalCost.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 text-orange-500 text-sm font-medium">
            Periodo: {stats?.aws.period.start} - {stats?.aws.period.end}
          </div>
        </div>

        {/* GCP / AI Costs Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-blue-500">
            <Cpu size={80} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Cpu size={24} />
            </div>
            <span className="text-slate-400 font-medium">Costos IA (Gemini)</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            ${stats?.gcp.estimatedCost.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 text-blue-500 text-sm">
            <Activity size={14} />
            <span>Basado en consumo de tokens</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Últimos Pagos (Stripe)</h2>
            <button className="text-primary text-sm hover:underline">Ver todos</button>
          </div>
          <div className="divide-y divide-slate-800">
            {stats?.stripe.recentPayments.map((payment) => (
              <div key={payment.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${payment.status === 'succeeded' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{payment.customerEmail || 'Cliente Anónimo'}</div>
                    <div className="text-xs text-slate-500">{new Date(payment.created).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">${payment.amount.toFixed(2)}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">{payment.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AWS Service Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Desglose de Servicios AWS</h2>
          <div className="space-y-6">
            {stats?.aws.services.map((service) => (
              <div key={service.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{service.name}</span>
                  <span className="text-white font-medium">${service.cost}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full" 
                    style={{ width: `${(service.cost / (stats?.aws.totalCost || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {stats?.aws.services.length === 0 && (
              <div className="text-center py-12 text-slate-500 italic">
                No hay datos de servicios disponibles para este periodo.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
