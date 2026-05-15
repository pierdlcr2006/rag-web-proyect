import React from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download,
  AlertCircle,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';

const MOCK_LOGS = [
  { id: 1, level: 'info', message: 'Inicio de sesión exitoso: admin@example.com', timestamp: 'Hace 2 minutos', category: 'AUTH' },
  { id: 2, level: 'success', message: 'Nuevo pago recibido: $49.00 (Plan Business)', timestamp: 'Hace 15 minutos', category: 'BILLING' },
  { id: 3, level: 'info', message: 'Archivo procesado: "reporte_anual.pdf"', timestamp: 'Hace 45 minutos', category: 'FILES' },
  { id: 4, level: 'warning', message: 'Límite de tokens alcanzado para usuario: test@example.com', timestamp: 'Hace 1 hora', category: 'AI' },
  { id: 5, level: 'error', message: 'Error de conexión con S3: Timeout en bucket rag-assets', timestamp: 'Hace 3 horas', category: 'STORAGE' },
  { id: 6, level: 'info', message: 'Nueva conversación iniciada: ID #8812', timestamp: 'Hace 4 horas', category: 'CHAT' },
];

export const AdminLogsPage: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Logs del Sistema</h1>
          <p className="text-slate-400 mt-2">Historial detallado de eventos, errores y auditoría de acciones.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors border border-slate-700">
            <Download size={18} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Filtrar logs por mensaje o categoría..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <select className="bg-slate-950 border border-slate-800 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option>Todos los Niveles</option>
          <option>Info</option>
          <option>Warning</option>
          <option>Error</option>
        </select>
        <button className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
          <Filter size={18} />
        </button>
      </div>

      {/* Logs Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-slate-800">
          {MOCK_LOGS.map((log) => (
            <div key={log.id} className="p-6 hover:bg-slate-800/30 transition-colors flex gap-6 items-start">
              <div className={`mt-1 p-2 rounded-lg ${
                log.level === 'error' ? 'bg-red-500/10 text-red-500' :
                log.level === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                log.level === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                'bg-blue-500/10 text-blue-500'
              }`}>
                {log.level === 'error' ? <AlertCircle size={20} /> :
                 log.level === 'warning' ? <AlertCircle size={20} /> :
                 log.level === 'success' ? <CheckCircle size={20} /> :
                 <Info size={20} />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${
                    log.level === 'error' ? 'text-red-500' :
                    log.level === 'warning' ? 'text-orange-500' :
                    log.level === 'success' ? 'text-emerald-500' :
                    'text-blue-500'
                  }`}>
                    {log.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock size={12} />
                    {log.timestamp}
                  </div>
                </div>
                <p className="text-sm text-slate-200 font-medium">{log.message}</p>
                <div className="text-[10px] font-mono text-slate-600 mt-2 bg-black/30 p-2 rounded border border-white/5">
                  EVENT_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} | TRACE_ID: {Math.random().toString(36).substr(2, 12)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-slate-900/50 border-t border-slate-800 text-center">
          <button className="text-sm font-bold text-slate-500 hover:text-white transition-colors">
            Cargar más logs...
          </button>
        </div>
      </div>
    </div>
  );
};
