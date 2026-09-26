import React from 'react';
import { Package, Bell, RefreshCw, Warehouse, LogOut } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const Header = ({ currentScreen, title, onNavigate }) => {
  const { currentUser, resetToMockData, logout } = useInventory();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 text-slate-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo & App Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 ring-1 ring-white/20">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-wider text-white">IMS</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded border border-sky-500/30">
                PRO v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">Inventory Management System</p>
          </div>
        </div>

        {/* Current Active Screen Title */}
        {title && (
          <div className="hidden md:flex items-center space-x-2 text-slate-300 font-semibold text-sm bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <span>{title}</span>
          </div>
        )}

        {/* User Info & Quick Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            onClick={resetToMockData}
            title="Reset Mock Data"
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-sky-400 hover:bg-slate-700 transition duration-150 flex items-center space-x-1 text-xs font-medium border border-slate-700/60"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>

          <div 
            onClick={() => onNavigate('profile')}
            className="flex items-center space-x-2.5 bg-slate-800/80 hover:bg-slate-700/80 p-1.5 pr-3 rounded-full border border-slate-700/60 cursor-pointer transition"
          >
            <img 
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
              alt={currentUser?.name} 
              className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/40"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-white leading-tight">{currentUser?.name || 'Alex Mercer'}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{currentUser?.role || 'Inventory Mgr'}</p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
