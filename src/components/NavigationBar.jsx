import React from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  ArrowLeftRight, 
  History, 
  Warehouse, 
  User 
} from 'lucide-react';

export const NavigationBar = ({ activeScreen, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Boxes },
    { id: 'operations', label: 'Operations', icon: ArrowLeftRight },
    { id: 'ledger', label: 'Ledger', icon: History },
    { id: 'warehouses', label: 'Warehouse', icon: Warehouse },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1.5 sm:py-2">
      <div className="max-w-md md:max-w-4xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-full py-1.5 px-1 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-sky-400 font-semibold bg-sky-500/10 scale-105' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-[10px] sm:text-xs mt-1 tracking-tight truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
