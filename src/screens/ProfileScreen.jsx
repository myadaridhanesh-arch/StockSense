import React from 'react';
import { User, Mail, Phone, Shield, Warehouse, RefreshCw, LogOut, CheckCircle2, Settings } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const ProfileScreen = () => {
  const { currentUser, logout, resetToMockData } = useInventory();

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-2xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <User className="w-6 h-6 text-sky-400" />
          <span>User Profile & System Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage staff permissions, active warehouse assignments, and app state.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* User Identity Header */}
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-700/60">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-sky-500/30"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-extrabold text-white">{currentUser?.name || 'Alex Mercer'}</h3>
              <span className="text-[10px] uppercase font-bold bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded border border-sky-500/30">
                Active Staff
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser?.role || 'Inventory Manager'}</p>
            <p className="text-xs font-mono text-sky-400 mt-1">ID: {currentUser?.id || 'usr-101'}</p>
          </div>
        </div>

        {/* Contact Details Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Account Credentials & Contact</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center space-x-3 text-xs">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Email Address</span>
                <span className="font-medium text-white truncate">{currentUser?.email}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center space-x-3 text-xs">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Phone Number</span>
                <span className="font-medium text-white">{currentUser?.phone}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center space-x-3 text-xs">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">System Role</span>
                <span className="font-medium text-white">{currentUser?.role}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center space-x-3 text-xs">
              <Warehouse className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Warehouse</span>
                <span className="font-medium text-white">{currentUser?.warehouse}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-slate-700/60 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">System Administration</h4>

          <button
            onClick={resetToMockData}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900 hover:bg-slate-750 text-slate-200 border border-slate-800 transition text-xs font-semibold"
          >
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-sky-400" />
              <span>Reset Application to Seed Demo Data</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Restore Defaults</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 p-3.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-900/30"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>

      </div>

    </div>
  );
};
