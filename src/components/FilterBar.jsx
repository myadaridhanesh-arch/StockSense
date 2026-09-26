import React from 'react';
import { Filter, X } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const FilterBar = ({ 
  selectedWarehouse, 
  setSelectedWarehouse,
  selectedCategory, 
  setSelectedCategory,
  selectedOpType, 
  setSelectedOpType,
  selectedStatus, 
  setSelectedStatus,
  onReset
}) => {
  const { warehouses, categories } = useInventory();

  const isFiltered = selectedWarehouse !== 'All' || selectedCategory !== 'All' || selectedOpType !== 'All' || selectedStatus !== 'All';

  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700/60 shadow-md mb-6">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700/50">
        <div className="flex items-center space-x-2 text-slate-300 font-semibold text-xs uppercase tracking-wider">
          <Filter className="w-4 h-4 text-sky-400" />
          <span>Filters & Controls</span>
        </div>
        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 font-medium transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        {/* Warehouse Filter */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Warehouse</label>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition"
          >
            <option value="All">All Warehouses</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Operation Type Filter */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Operation</label>
          <select
            value={selectedOpType}
            onChange={(e) => setSelectedOpType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition"
          >
            <option value="All">All Operations</option>
            <option value="Receipt">Receipt (Incoming)</option>
            <option value="Delivery">Delivery (Outgoing)</option>
            <option value="Internal Transfer">Internal Transfer</option>
            <option value="Inventory Adjustment">Adjustment</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

      </div>
    </div>
  );
};
