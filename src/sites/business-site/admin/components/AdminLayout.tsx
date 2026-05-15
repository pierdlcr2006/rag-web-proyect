import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200 font-sans">
      {/* Sidebar Fijo */}
      <AdminSidebar />
      
      {/* Contenido Principal con Scroll */}
      <main className="flex-1 overflow-y-auto bg-slate-950 relative">
        {/* Gradiente de fondo sutil para dar profundidad */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
        </div>
        
        {/* Renderiza la página actual */}
        <div className="relative z-10 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
