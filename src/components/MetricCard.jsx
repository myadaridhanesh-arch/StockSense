import React from 'react';

export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = 'blue',
  onClick,
  active = false 
}) => {
  const variantStyles = {
    blue: {
      border: 'border-sky-500/30',
      bg: 'from-sky-950/40 via-slate-900 to-slate-900',
      iconBg: 'bg-sky-500/20 text-sky-400',
      text: 'text-sky-400',
      activeRing: 'ring-2 ring-sky-500 shadow-sky-500/20'
    },
    amber: {
      border: 'border-amber-500/30',
      bg: 'from-amber-950/40 via-slate-900 to-slate-900',
      iconBg: 'bg-amber-500/20 text-amber-400',
      text: 'text-amber-400',
      activeRing: 'ring-2 ring-amber-500 shadow-amber-500/20'
    },
    emerald: {
      border: 'border-emerald-500/30',
      bg: 'from-emerald-950/40 via-slate-900 to-slate-900',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      text: 'text-emerald-400',
      activeRing: 'ring-2 ring-emerald-500 shadow-emerald-500/20'
    },
    rose: {
      border: 'border-rose-500/30',
      bg: 'from-rose-950/40 via-slate-900 to-slate-900',
      iconBg: 'bg-rose-500/20 text-rose-400',
      text: 'text-rose-400',
      activeRing: 'ring-2 ring-rose-500 shadow-rose-500/20'
    },
    indigo: {
      border: 'border-indigo-500/30',
      bg: 'from-indigo-950/40 via-slate-900 to-slate-900',
      iconBg: 'bg-indigo-500/20 text-indigo-400',
      text: 'text-indigo-400',
      activeRing: 'ring-2 ring-indigo-500 shadow-indigo-500/20'
    },
    purple: {
      border: 'border-purple-500/30',
      bg: 'from-purple-950/40 via-slate-900 to-slate-900',
      iconBg: 'bg-purple-500/20 text-purple-400',
      text: 'text-purple-400',
      activeRing: 'ring-2 ring-purple-500 shadow-purple-500/20'
    }
  };

  const style = variantStyles[variant] || variantStyles.blue;

  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${style.bg} border ${style.border} shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] ${
        active ? style.activeRing : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${style.iconBg} backdrop-blur-md`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
