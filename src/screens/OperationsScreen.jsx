import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ArrowDownLeft, 
  ArrowUpRight, 
  SlidersHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Package,
  Layers,
  MapPin,
  Building2,
  FileText
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { StockBadge } from '../components/StockBadge';

export const OperationsScreen = ({ initialTab = 'Receipt' }) => {
  const { 
    products, 
    operations, 
    warehouses, 
    processReceipt, 
    processDelivery, 
    processTransfer, 
    processAdjustment 
  } = useInventory();

  const [activeTab, setActiveTab] = useState(initialTab); // 'Receipt' | 'Delivery' | 'Internal Transfer' | 'Inventory Adjustment'

  // Operation Forms State
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('WH-1');
  const [locationId, setLocationId] = useState('LOC-A1-01');
  const [destLocationId, setDestLocationId] = useState('LOC-B2-10');
  const [quantity, setQuantity] = useState(10);
  const [reference, setReference] = useState('');
  const [partyName, setPartyName] = useState('');
  const [notes, setNotes] = useState('');

  // Adjustment specific fields
  const [physicalCount, setPhysicalCount] = useState(100);
  const [adjReason, setAdjReason] = useState('Physical Audit Discrepancy');

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleReceiptSubmit = (e) => {
    e.preventDefault();
    const ok = processReceipt({
      productId: selectedProductId,
      warehouseId: selectedWarehouseId,
      locationId: locationId || selectedProduct?.defaultLocation,
      quantity,
      supplier: partyName || 'Global Electronics Ltd',
      reference: reference || `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      notes
    });
    if (ok) resetForm();
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    const ok = processDelivery({
      productId: selectedProductId,
      warehouseId: selectedWarehouseId,
      locationId: locationId || selectedProduct?.defaultLocation,
      quantity,
      customer: partyName || 'Acme Logistics Inc',
      reference: reference || `SO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      notes
    });
    if (ok) resetForm();
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    const ok = processTransfer({
      productId: selectedProductId,
      sourceLocation: locationId || 'LOC-A1-01',
      destLocation: destLocationId || 'LOC-B2-10',
      quantity,
      reference: reference || `TR-2026-${Math.floor(100 + Math.random() * 900)}`,
      notes
    });
    if (ok) resetForm();
  };

  const handleAdjustmentSubmit = (e) => {
    e.preventDefault();
    const ok = processAdjustment({
      productId: selectedProductId,
      locationId: locationId || selectedProduct?.defaultLocation,
      physicalCount,
      reason: adjReason,
      reference: reference || `ADJ-2026-${Math.floor(100 + Math.random() * 900)}`,
      notes
    });
    if (ok) resetForm();
  };

  const resetForm = () => {
    setQuantity(10);
    setReference('');
    setPartyName('');
    setNotes('');
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <ArrowLeftRight className="w-6 h-6 text-sky-400" />
          <span>Stock Operations Center</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Process Receipts (Inbound), Deliveries (Outbound), Internal Transfers, and Inventory Audits.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('Receipt')}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
            activeTab === 'Receipt'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Receipt (+Stock)</span>
        </button>

        <button
          onClick={() => setActiveTab('Delivery')}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
            activeTab === 'Delivery'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Delivery (-Stock)</span>
        </button>

        <button
          onClick={() => setActiveTab('Internal Transfer')}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
            activeTab === 'Internal Transfer'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Internal Transfer</span>
        </button>

        <button
          onClick={() => setActiveTab('Inventory Adjustment')}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
            activeTab === 'Inventory Adjustment'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Adjustment</span>
        </button>
      </div>

      {/* Main Action Card */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl">
        
        {/* Tab Header Banner */}
        <div className="mb-6 pb-4 border-b border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded border border-sky-500/30">
              Active Workflow
            </span>
            <h3 className="text-lg font-extrabold text-white mt-1">
              {activeTab === 'Receipt' && 'Process Incoming Goods Receipt'}
              {activeTab === 'Delivery' && 'Process Outgoing Customer Order Delivery'}
              {activeTab === 'Internal Transfer' && 'Inter-Bin / Inter-Warehouse Stock Transfer'}
              {activeTab === 'Inventory Adjustment' && 'Perform Stock Count Audit Adjustment'}
            </h3>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-xs text-slate-400">Formula:</span>
            <p className="font-mono text-xs font-bold text-sky-300">
              {activeTab === 'Receipt' && 'Stock = Current Stock + Received Qty'}
              {activeTab === 'Delivery' && 'Stock = Current Stock - Delivered Qty'}
              {activeTab === 'Internal Transfer' && 'Src Loc -Qty | Dest Loc +Qty (Total Unchanged)'}
              {activeTab === 'Inventory Adjustment' && 'Stock = Physical Counted Qty'}
            </p>
          </div>
        </div>

        {/* 1. RECEIPT FORM */}
        {activeTab === 'Receipt' && (
          <form onSubmit={handleReceiptSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Product *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.sku} - {p.name} (Cur Stock: {p.stock} {p.uom})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Supplier / Vendor Name</label>
                <input
                  type="text"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="e.g. DisplayTech Korea Ltd"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Target Warehouse</label>
                <select
                  value={selectedWarehouseId}
                  onChange={(e) => setSelectedWarehouseId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Destination Bin Location</label>
                <input
                  type="text"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  placeholder="e.g. Rack A1 - Slot 01"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Quantity Received *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">PO Reference #</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. PO-2026-9812"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Notes / Inspection Comments</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Inspection status, carrier details..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-emerald-900/40 flex items-center justify-center space-x-2 mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Validate Receipt & Increase Stock (+{quantity} {selectedProduct?.uom})</span>
            </button>
          </form>
        )}

        {/* 2. DELIVERY FORM */}
        {activeTab === 'Delivery' && (
          <form onSubmit={handleDeliverySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Product *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.sku} - {p.name} (Available Stock: {p.stock} {p.uom})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Customer / Destination</label>
                <input
                  type="text"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="e.g. Apex Systems Ltd"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Source Warehouse</label>
                <select
                  value={selectedWarehouseId}
                  onChange={(e) => setSelectedWarehouseId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Source Bin Location</label>
                <input
                  type="text"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  placeholder="e.g. Pallet Zone C3"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Dispatch Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-rose-400 font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Sales Order Ref #</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. SO-2026-4012"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Shipping airway bill, driver details..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-sky-900/40 flex items-center justify-center space-x-2 mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Validate Delivery & Decrease Stock (-{quantity} {selectedProduct?.uom})</span>
            </button>
          </form>
        )}

        {/* 3. INTERNAL TRANSFER FORM */}
        {activeTab === 'Internal Transfer' && (
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Product *</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.sku} - {p.name} (Total System Stock: {p.stock} {p.uom})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase mb-1">Source Location (From) *</label>
                <input
                  type="text"
                  required
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  placeholder="e.g. WH-1 (Rack A1 - Slot 01)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Destination Location (To) *</label>
                <input
                  type="text"
                  required
                  value={destLocationId}
                  onChange={(e) => setDestLocationId(e.target.value)}
                  placeholder="e.g. WH-2 (Cold Bay N2)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Transfer Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-indigo-400 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Transfer Ref #</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. TR-2026-0045"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-indigo-900/40 flex items-center justify-center space-x-2 mt-2"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Execute Transfer (Move {quantity} {selectedProduct?.uom})</span>
            </button>
          </form>
        )}

        {/* 4. INVENTORY ADJUSTMENT FORM */}
        {activeTab === 'Inventory Adjustment' && (
          <form onSubmit={handleAdjustmentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Product *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    const pid = e.target.value;
                    setSelectedProductId(pid);
                    const p = products.find(prd => prd.id === pid);
                    if (p) setPhysicalCount(p.stock);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.sku} - {p.name} (Recorded: {p.stock} {p.uom})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Audit Location Bin</label>
                <input
                  type="text"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  placeholder="e.g. Shelf B2 - Bin 10"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Recorded System Stock</span>
                <span className="text-xl font-bold text-slate-300">{selectedProduct?.stock} {selectedProduct?.uom}</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase block">Actual Physical Counted</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={physicalCount}
                  onChange={(e) => setPhysicalCount(e.target.value)}
                  className="w-24 bg-slate-800 border border-amber-500/50 rounded-lg py-1 px-2 text-center text-lg font-bold text-white focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] text-sky-400 font-bold uppercase block">Discrepancy Delta</span>
                <span className={`text-xl font-extrabold ${
                  (physicalCount - selectedProduct?.stock) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {(physicalCount - selectedProduct?.stock) >= 0 ? `+${physicalCount - selectedProduct?.stock}` : (physicalCount - selectedProduct?.stock)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Reason for Discrepancy</label>
                <select
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                >
                  <option value="Physical Audit Discrepancy">Physical Audit Discrepancy</option>
                  <option value="Damaged Goods in Warehouse">Damaged Goods in Warehouse</option>
                  <option value="Expired Stock Removal">Expired Stock Removal</option>
                  <option value="Unrecorded Sample Dispatch">Unrecorded Sample Dispatch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Audit Reference #</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. AUD-2026-Q3"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-purple-900/40 flex items-center justify-center space-x-2 mt-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Update Stock to Physical Count ({physicalCount} {selectedProduct?.uom})</span>
            </button>
          </form>
        )}

      </div>

      {/* Operations History Log */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 shadow-lg">
        <h3 className="text-base font-extrabold text-white mb-3">Completed & Pending Operations List</h3>
        <div className="space-y-2.5">
          {operations.map(op => (
            <div key={op.id} className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sky-400 font-bold">{op.id}</span>
                  <StockBadge status={op.type} />
                  <StockBadge status={op.status} />
                  <span className="text-slate-400">{op.reference}</span>
                </div>
                <h4 className="font-semibold text-white mt-1">{op.productName} ({op.sku})</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{op.source} → {op.destination}</p>
              </div>

              <div className="text-right self-end sm:self-center">
                <span className="text-sm font-extrabold text-white">{op.quantity} units</span>
                <span className="text-[10px] text-slate-400 block">{new Date(op.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
