import React from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

interface Props {
  title: string;
}

export const AdminPlaceholderPage: React.FC<Props> = ({ title }) => {
  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden relative">
      <AdminSidebar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 bg-violet-500/10 rounded-3xl flex items-center justify-center text-violet-500 mx-auto border border-violet-500/20 shadow-xl shadow-violet-500/10">
            <Construction size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">{title}</h1>
          <p className="text-white/30 font-medium max-w-md mx-auto">
            Esta sección del panel de control empresarial está actualmente en desarrollo. 
            Vuelve pronto para ver las métricas detalladas.
          </p>
        </motion.div>
      </main>
    </div>
  );
};
