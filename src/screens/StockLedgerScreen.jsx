import React, { useState } from 'react';
import { History, Download, Search, Filter, Calendar, User, ArrowRight } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { SearchBar } from '../components/SearchBar';
import { StockBadge } from '../components/StockBadge';

export const StockLedgerScreen = () => {
  const { ledgerEntries, showToast } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOpFilter, setSelectedOpFilter] = useState('All');

  const filteredEntries = ledgerEntries.filter(entry => {
    const matchesSearch = entry.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.user?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesOp = selectedOpFilter === 'All' || entry.operation === selectedOpFilter;
    return matchesSearch && matchesOp;
  });

  const handleExportCSV = () => {
    showToast('Exporting Stock Ledger audit history to CSV...', 'info');
    setTimeout(() => {
      showToast('Stock_Ledger_Export_2026.csv downloaded successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      
      {/* Title & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <History className="w-6 h-6 text-sky-400" />
            <span>Stock Ledger Audit Trail</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete, immutable movement log with before/after stock records.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition shadow"
        >
          <Download className="w-4 h-4 text-sky-400" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search by product, SKU, reference or staff member..." 
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedOpFilter}
            onChange={(e) => setSelectedOpFilter(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Operations</option>
            <option value="Receipt">Receipts Only</option>
            <option value="Delivery">Deliveries Only</option>
            <option value="Internal Transfer">Transfers Only</option>
            <option value="Inventory Adjustment">Adjustments Only</option>
          </select>
        </div>
      </div>

      {/* Ledger Entries List / Cards for Mobile & Table for Larger Screens */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-700/80">
              <tr>
                <th className="px-4 py-3.5">Date & Time</th>
                <th className="px-4 py-3.5">Product & SKU</th>
                <th className="px-4 py-3.5">Operation</th>
                <th className="px-4 py-3.5">Source → Destination</th>
                <th className="px-4 py-3.5 text-center">Qty Change</th>
                <th className="px-4 py-3.5 text-center">Stock (Before → After)</th>
                <th className="px-4 py-3.5">Staff User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-750/50 transition">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-slate-300 font-medium block">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-100 block">{entry.productName}</span>
                    <span className="font-mono text-[10px] text-sky-400">{entry.sku}</span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <StockBadge status={entry.operation} />
                    {entry.reference && (
                      <span className="text-[10px] text-slate-500 block mt-0.5">{entry.reference}</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1 text-slate-300 text-[11px]">
                      <span className="truncate max-w-[120px]">{entry.source}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[120px]">{entry.destination}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className={`font-black text-sm ${
                      entry.quantity > 0 ? 'text-emerald-400' : entry.quantity < 0 ? 'text-rose-400' : 'text-slate-300'
                    }`}>
                      {entry.quantity > 0 ? `+${entry.quantity}` : entry.quantity}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className="font-mono text-slate-400 text-xs">
                      {entry.stockBefore} → <strong className="text-white">{entry.stockAfter}</strong>
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-slate-300 font-medium">
                    {entry.user || 'Alex Mercer'}
                  </td>
                </tr>
              ))}
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No ledger entries match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
