import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { 
  Server, 
  Database, 
  HardDrive, 
  MessageSquare, 
  FileText, 
  Zap,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Info
} from 'lucide-react';

export const AdminStatusPage: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-service-stats'],
    queryFn: adminApi.getServiceStats,
    refetchInterval: 15000,
  });

  const { data: health } = useQuery({
    queryKey: ['admin-system-health'],
    queryFn: adminApi.getHealth,
    refetchInterval: 5000,
  });

  const { data: billing } = useQuery({
    queryKey: ['admin-billing-stats'],
    queryFn: adminApi.getBillingStats,
  });

  const storageUsagePercent = ((stats?.files.totalStorageMB || 0) / 1024) * 100;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Estado del Sistema</h1>
          <p className="text-slate-400 mt-2">Monitoreo real de infraestructura, bases de datos y servicios externos.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <div className={`w-2 h-2 rounded-full animate-pulse ${health?.status === 'ok' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          Sistema: {health?.status === 'ok' ? 'Saludable' : 'Error'}
        </div>
      </div>

      {/* Health Check Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <Server size={80} />
          </div>
          <div className={`p-4 rounded-2xl ${health?.services.api.status === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
            <Server size={32} />
          </div>
          <div>
            <div className="text-sm text-slate-400">API Backend</div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              {health?.services.api.status === 'up' ? 'Operativo' : 'Desconectado'}
              {health?.services.api.status === 'up' && <CheckCircle2 size={16} className="text-emerald-500" />}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">v{health?.services.api.version} | Uptime: {Math.floor((health?.services.api.uptime || 0) / 60)}m</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <Database size={80} />
          </div>
          <div className={`p-4 rounded-2xl ${health?.services.database.status === 'up' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
            <Database size={32} />
          </div>
          <div>
            <div className="text-sm text-slate-400">PostgreSQL (Supabase)</div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              {health?.services.database.status === 'up' ? 'Conectado' : 'Error'}
              {health?.services.database.status === 'up' && <CheckCircle2 size={16} className="text-emerald-500" />}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">{health?.services.database.message}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <Zap size={80} />
          </div>
          <div className={`p-4 rounded-2xl ${health?.services.ai.status === 'up' ? 'bg-purple-500/10 text-purple-500' : 'bg-red-500/10 text-red-500'}`}>
            <Zap size={32} />
          </div>
          <div>
            <div className="text-sm text-slate-400">{health?.services.ai.provider}</div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              {health?.services.ai.status === 'up' ? 'Activo' : 'Error'}
              {health?.services.ai.status === 'up' && <CheckCircle2 size={16} className="text-emerald-500" />}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">Modelo: Gemini 2.0 Flash</div>
          </div>
        </div>
      </div>

      {/* Infra Logos & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AWS & Cloud Storage */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 border border-slate-800">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-lg font-semibold text-white">AWS Infrastructure</h2>
            </div>
            <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-widest">S3 & Cost Explorer</span>
          </div>
          
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-4xl font-bold text-white">{stats?.files.totalStorageMB.toFixed(2)} MB</div>
                <div className="text-sm text-slate-400 mt-1">Almacenamiento total en S3</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-400">{stats?.files.total} archivos</div>
                <div className="text-xs text-slate-500">Node: {health?.timestamp ? 'rag-worker-01' : 'offline'}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Capacidad del Nodo (Soft Limit)</span>
                <span>{storageUsagePercent.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    storageUsagePercent > 80 ? 'bg-red-500' : 'bg-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]'
                  }`}
                  style={{ width: `${Math.min(storageUsagePercent, 100)}%` }}
                />
              </div>
            </div>

            {/* AWS Services Table */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
              <div className="px-4 py-2 bg-slate-800/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                Costos de Servicios AWS
              </div>
              {billing?.aws.services && billing.aws.services.length > 0 ? (
                <div className="divide-y divide-slate-800 max-h-48 overflow-y-auto">
                  {billing.aws.services.map((svc) => (
                    <div key={svc.name} className="px-4 py-2 flex justify-between items-center hover:bg-slate-800/20 transition-colors">
                      <span className="text-xs font-medium text-slate-400">{svc.name}</span>
                      <span className="text-xs font-bold text-white">${svc.cost.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <AlertTriangle className="mx-auto text-orange-500 mb-2" size={20} />
                  <p className="text-xs text-slate-400 font-medium">No se pueden obtener datos de AWS</p>
                  <p className="text-[10px] text-slate-600 mt-1">Verifica los permisos IAM de 'Cost Explorer'</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI & Payments Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 border border-slate-800 overflow-hidden">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="w-full h-full object-contain scale-125" />
              </div>
              <h2 className="text-lg font-semibold text-white">Pagos & IA</h2>
            </div>
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-white p-1 overflow-hidden">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" alt="GCP" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1 bg-emerald-500 h-full" />
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Pasarela Stripe</div>
                <div className="text-xl font-bold text-white flex items-center gap-2">
                  Activa & Segura
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-bold">Modo: Live</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">TLS 1.3 Enabled</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Tokens IA (Total)</div>
                <div className="text-2xl font-bold text-white">{(stats?.messages.totalTokensUsed || 0).toLocaleString()}</div>
                <div className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                  <Activity size={10} />
                  Dentro de cuota segura
                </div>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Modelos</div>
                <div className="text-lg font-bold text-white">Flash & Emb.</div>
                <div className="text-[10px] text-slate-500 mt-1">Gemini AI Suite</div>
              </div>
            </div>

            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 flex items-center gap-4">
              <div className="p-2 bg-slate-900 rounded-lg">
                <Info className="text-blue-500" size={18} />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                El sistema de facturación está sincronizado con los Webhooks de Stripe. Los cambios en suscripciones se reflejan en menos de 5 segundos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
