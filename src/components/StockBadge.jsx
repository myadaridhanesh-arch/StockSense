import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const StockBadge = ({ status, stock, reorderLevel }) => {
  // If status is explicit
  if (status) {
    const statusMap = {
      Completed: { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle2, label: 'Completed' },
      Pending: { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30', icon: Clock, label: 'Pending' },
      Cancelled: { bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30', icon: XCircle, label: 'Cancelled' },
      Receipt: { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle2, label: 'Receipt' },
      Delivery: { bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30', icon: CheckCircle2, label: 'Delivery' },
      'Internal Transfer': { bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30', icon: CheckCircle2, label: 'Transfer' },
      'Inventory Adjustment': { bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30', icon: CheckCircle2, label: 'Adjustment' },
    };

    const config = statusMap[status] || { bg: 'bg-slate-700/40 text-slate-300 border-slate-600', icon: CheckCircle2, label: status };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg}`}>
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </span>
    );
  }

  // Calculated stock status badge
  if (stock === 0) {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
        <XCircle className="w-3 h-3" />
        <span>Out of Stock</span>
      </span>
    );
  }

  if (stock <= reorderLevel) {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <AlertTriangle className="w-3 h-3" />
        <span>Low Stock</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
      <CheckCircle2 className="w-3 h-3" />
      <span>In Stock</span>
    </span>
  );
};
