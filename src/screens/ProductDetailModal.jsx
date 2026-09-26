import React from 'react';
import { Package, MapPin, History, AlertTriangle, CheckCircle2, Layers } from 'lucide-react';
import { ModalWrapper } from '../components/ModalWrapper';
import { StockBadge } from '../components/StockBadge';
import { useInventory } from '../context/InventoryContext';

export const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { ledgerEntries, warehouses } = useInventory();

  if (!product) return null;

  const productLedger = ledgerEntries.filter(entry => entry.productId === product.id);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Product Inventory Details" maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Product Identity Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                {product.sku}
              </span>
              <span className="text-xs text-slate-400 font-medium">{product.category}</span>
            </div>
            <h3 className="text-lg font-extrabold text-white mt-1">{product.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{product.description}</p>
          </div>
          
          <div className="text-right">
            <StockBadge stock={product.stock} reorderLevel={product.reorderLevel} />
            <p className="text-2xl font-black text-white mt-1">{product.stock} <span className="text-xs text-slate-400 font-normal">{product.uom}</span></p>
          </div>
        </div>

        {/* Product Key Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Unit Price</span>
            <span className="font-bold text-white text-sm">${product.unitPrice?.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Reorder Level</span>
            <span className="font-bold text-amber-400 text-sm">{product.reorderLevel} {product.uom}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Default Warehouse</span>
            <span className="font-bold text-sky-400 text-sm">{product.warehouse}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Default Bin</span>
            <span className="font-bold text-indigo-400 text-sm">{product.defaultLocation}</span>
          </div>
        </div>

        {/* Location Stock Breakdown */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>Stock Breakdown by Bin Location</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(product.stockByLocation || {}).map(([locId, qty]) => (
              <div key={locId} className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-200">{locId}</span>
                </div>
                <span className="text-sm font-bold text-white">{qty} <span className="text-[10px] text-slate-400 font-normal">{product.uom}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Stock Movement History */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <History className="w-4 h-4 text-sky-400" />
            <span>Recent Stock Movements Audit</span>
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {productLedger.length > 0 ? (
              productLedger.map(entry => (
                <div key={entry.id} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <StockBadge status={entry.operation} />
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">{entry.source} → {entry.destination}</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${entry.quantity > 0 ? 'text-emerald-400' : entry.quantity < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {entry.quantity > 0 ? `+${entry.quantity}` : entry.quantity}
                    </span>
                    <span className="text-[10px] text-slate-400 block">After: {entry.stockAfter}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No stock movements recorded for this product yet.</p>
            )}
          </div>
        </div>

      </div>
    </ModalWrapper>
  );
};
