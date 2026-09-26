import React, { useState } from 'react';
import { 
  PackageCheck, 
  AlertTriangle, 
  XCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowLeftRight,
  PlusCircle,
  History,
  Boxes,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { MetricCard } from '../components/MetricCard';
import { FilterBar } from '../components/FilterBar';
import { StockBadge } from '../components/StockBadge';

export const DashboardScreen = ({ onNavigate, onOpenOpModal }) => {
  const { products, operations, ledgerEntries, warehouses } = useInventory();

  // Filters
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOpType, setSelectedOpType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Filter products
  const filteredProducts = products.filter(p => {
    if (selectedWarehouse !== 'All' && p.warehouse !== selectedWarehouse) return false;
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    return true;
  });

  // Calculate Metrics
  const totalStock = filteredProducts.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = filteredProducts.filter(p => p.stock > 0 && p.stock <= p.reorderLevel).length;
  const outOfStockCount = filteredProducts.filter(p => p.stock === 0).length;

  // Filter operations
  const filteredOps = operations.filter(op => {
    if (selectedWarehouse !== 'All' && op.warehouse !== selectedWarehouse) return false;
    if (selectedOpType !== 'All' && op.type !== selectedOpType) return false;
    if (selectedStatus !== 'All' && op.status !== selectedStatus) return false;
    return true;
  });

  const pendingReceipts = filteredOps.filter(op => op.type === 'Receipt' && op.status === 'Pending').length;
  const pendingDeliveries = filteredOps.filter(op => op.type === 'Delivery' && op.status === 'Pending').length;
  const internalTransfersCount = filteredOps.filter(op => op.type === 'Internal Transfer').length;

  const handleResetFilters = () => {
    setSelectedWarehouse('All');
    setSelectedCategory('All');
    setSelectedOpType('All');
    setSelectedStatus('All');
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Inventory Dashboard Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-location stock levels, pending operations, and movement audits.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onOpenOpModal('Receipt')}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition shadow-lg shadow-emerald-900/30"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Receipt</span>
          </button>
          <button
            onClick={() => onOpenOpModal('Delivery')}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 bg-sky-600/90 hover:bg-sky-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition shadow-lg shadow-sky-900/30"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ Delivery</span>
          </button>
          <button
            onClick={() => onOpenOpModal('Internal Transfer')}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 bg-indigo-600/90 hover:bg-indigo-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition shadow-lg shadow-indigo-900/30"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Transfer</span>
          </button>
        </div>
      </div>

      {/* Interactive Filter Bar */}
      <FilterBar
        selectedWarehouse={selectedWarehouse}
        setSelectedWarehouse={setSelectedWarehouse}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedOpType={selectedOpType}
        setSelectedOpType={setSelectedOpType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onReset={handleResetFilters}
      />

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <MetricCard
          title="Total Stock"
          value={totalStock.toLocaleString()}
          subtitle={`${filteredProducts.length} unique products`}
          icon={PackageCheck}
          variant="blue"
          onClick={() => onNavigate('products')}
        />
        <MetricCard
          title="Low Stock"
          value={lowStockCount}
          subtitle="At or below reorder limit"
          icon={AlertTriangle}
          variant="amber"
          onClick={() => onNavigate('products')}
        />
        <MetricCard
          title="Out of Stock"
          value={outOfStockCount}
          subtitle="Zero stock available"
          icon={XCircle}
          variant="rose"
          onClick={() => onNavigate('products')}
        />
        <MetricCard
          title="Pending Receipts"
          value={pendingReceipts}
          subtitle="Incoming stock arrivals"
          icon={ArrowDownLeft}
          variant="emerald"
          onClick={() => onNavigate('operations')}
        />
        <MetricCard
          title="Pending Deliveries"
          value={pendingDeliveries}
          subtitle="Outgoing customer orders"
          icon={ArrowUpRight}
          variant="purple"
          onClick={() => onNavigate('operations')}
        />
        <MetricCard
          title="Internal Transfers"
          value={internalTransfersCount}
          subtitle="Location movements"
          icon={ArrowLeftRight}
          variant="indigo"
          onClick={() => onNavigate('operations')}
        />
      </div>

      {/* Critical Stock Alerts & Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Critical Low & Out of Stock Alert List */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-slate-100 text-sm sm:text-base">Reorder & Stock Attention</h3>
            </div>
            <button 
              onClick={() => onNavigate('products')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-0.5"
            >
              <span>View Catalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {products.filter(p => p.stock <= p.reorderLevel).slice(0, 5).map(item => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-900/90 rounded-xl border border-slate-700/50 hover:border-slate-600 transition"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-slate-400 font-semibold">{item.sku}</span>
                    <StockBadge stock={item.stock} reorderLevel={item.reorderLevel} />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-100 mt-1">{item.name}</h4>
                  <p className="text-[10px] text-slate-400">Reorder Level: {item.reorderLevel} {item.uom}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-white">{item.stock}</span>
                  <span className="text-[10px] text-slate-400 block">{item.uom}</span>
                </div>
              </div>
            ))}
            {products.filter(p => p.stock <= p.reorderLevel).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">All stock levels are currently healthy!</p>
            )}
          </div>
        </div>

        {/* Recent Stock Movements Audit Preview */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-sky-400" />
              <h3 className="font-bold text-slate-100 text-sm sm:text-base">Recent Stock Movements</h3>
            </div>
            <button 
              onClick={() => onNavigate('ledger')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-0.5"
            >
              <span>View Full Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {ledgerEntries.slice(0, 5).map(entry => (
              <div 
                key={entry.id}
                className="flex items-center justify-between p-3 bg-slate-900/90 rounded-xl border border-slate-700/50 hover:border-slate-600 transition"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <StockBadge status={entry.operation} />
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-100 mt-1 truncate max-w-[200px] sm:max-w-xs">
                    {entry.productName}
                  </h4>
                  <p className="text-[10px] text-slate-400">{entry.source} → {entry.destination}</p>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-extrabold ${
                    entry.quantity > 0 ? 'text-emerald-400' : entry.quantity < 0 ? 'text-rose-400' : 'text-slate-300'
                  }`}>
                    {entry.quantity > 0 ? `+${entry.quantity}` : entry.quantity}
                  </span>
                  <span className="text-[10px] text-slate-400 block">After: {entry.stockAfter}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
