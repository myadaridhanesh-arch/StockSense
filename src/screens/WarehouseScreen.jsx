import React, { useState } from 'react';
import { Warehouse, MapPin, Layers, Building2, User, ChevronRight, Package } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const WarehouseScreen = () => {
  const { warehouses, products } = useInventory();
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouses[0]?.id || 'WH-1');

  const selectedWh = warehouses.find(w => w.id === selectedWarehouseId) || warehouses[0];

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <Warehouse className="w-6 h-6 text-sky-400" />
          <span>Warehouse & Bin Location Management</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor facility capacities, rack zones, and location-level inventory breakdown.
        </p>
      </div>

      {/* Warehouse Selector Cards Slider */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {warehouses.map(wh => {
          const isSelected = wh.id === selectedWarehouseId;
          const usagePercent = Math.round((wh.usedCapacity / wh.totalCapacity) * 100);

          return (
            <div
              key={wh.id}
              onClick={() => setSelectedWarehouseId(wh.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-sky-950/60 to-slate-900 border-sky-500 shadow-lg ring-2 ring-sky-500/20'
                  : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    {wh.code}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{wh.locations.length} Bin Zones</span>
                </div>
                <h3 className="font-bold text-white text-base mt-2">{wh.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{wh.address}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Capacity Used:</span>
                  <span className="font-bold text-white">{usagePercent}% ({wh.usedCapacity.toLocaleString()} / {wh.totalCapacity.toLocaleString()} units)</span>
                </div>

                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${usagePercent > 80 ? 'bg-amber-500' : 'bg-sky-500'}`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Warehouse Bin Location Breakdown */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/60">
          <div>
            <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-500/20 px-2 py-0.5 rounded">
              Selected Facility
            </span>
            <h3 className="text-lg font-extrabold text-white mt-1">{selectedWh.name} ({selectedWh.code})</h3>
            <p className="text-xs text-slate-400">Manager: {selectedWh.manager} • Location: {selectedWh.address}</p>
          </div>
        </div>

        {/* Location Racks Grid */}
        <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center space-x-1.5">
          <MapPin className="w-4 h-4 text-sky-400" />
          <span>Racks, Shelves & Bin Locations Map</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {selectedWh.locations.map(loc => {
            // Find products stored in this location
            const storedProducts = products.filter(p => p.stockByLocation && p.stockByLocation[loc.id] > 0);

            return (
              <div key={loc.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-sky-400 font-bold">{loc.id}</span>
                  <span className="text-[10px] text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded">
                    {loc.zone}
                  </span>
                </div>
                <h5 className="font-semibold text-slate-200 text-xs">{loc.name}</h5>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Units Stored:</span>
                  <span className="font-bold text-emerald-400">{loc.stockCount}</span>
                </div>

                <div className="pt-1 text-[11px] text-slate-400">
                  {storedProducts.length > 0 ? (
                    <p className="truncate">Items: {storedProducts.map(p => p.sku).join(', ')}</p>
                  ) : (
                    <p className="text-slate-500 italic">Bin available for staging</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
