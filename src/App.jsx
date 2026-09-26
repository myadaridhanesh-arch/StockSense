import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Header } from './components/Header';
import { NavigationBar } from './components/NavigationBar';
import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { OperationsScreen } from './screens/OperationsScreen';
import { StockLedgerScreen } from './screens/StockLedgerScreen';
import { WarehouseScreen } from './screens/WarehouseScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent = () => {
  const { isAuthenticated, toast } = useInventory();
  const [activeScreen, setActiveScreen] = useState('dashboard'); // 'dashboard' | 'products' | 'operations' | 'ledger' | 'warehouses' | 'profile'
  const [opInitialTab, setOpInitialTab] = useState('Receipt');

  const handleOpenOpModal = (tabName) => {
    setOpInitialTab(tabName);
    setActiveScreen('operations');
  };

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const screenTitles = {
    dashboard: 'Dashboard Overview',
    products: 'Products Catalog',
    operations: 'Stock Operations Center',
    ledger: 'Stock Ledger Audit Trail',
    warehouses: 'Warehouse Bin Locations',
    profile: 'User Profile & Settings'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased">
      
      {/* Toast Notification Alert */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold animate-bounce ${
          toast.type === 'error'
            ? 'bg-rose-900/90 text-rose-200 border-rose-700/80 shadow-rose-950/50'
            : toast.type === 'info'
            ? 'bg-sky-900/90 text-sky-200 border-sky-700/80 shadow-sky-950/50'
            : 'bg-emerald-900/90 text-emerald-200 border-emerald-700/80 shadow-emerald-950/50'
        }`}>
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 shrink-0 text-sky-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header 
        currentScreen={activeScreen} 
        title={screenTitles[activeScreen]} 
        onNavigate={setActiveScreen} 
      />

      {/* Screen Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeScreen === 'dashboard' && (
          <DashboardScreen onNavigate={setActiveScreen} onOpenOpModal={handleOpenOpModal} />
        )}
        {activeScreen === 'products' && (
          <ProductsScreen />
        )}
        {activeScreen === 'operations' && (
          <OperationsScreen initialTab={opInitialTab} />
        )}
        {activeScreen === 'ledger' && (
          <StockLedgerScreen />
        )}
        {activeScreen === 'warehouses' && (
          <WarehouseScreen />
        )}
        {activeScreen === 'profile' && (
          <ProfileScreen />
        )}
      </main>

      {/* Mobile-First Bottom Navigation Bar */}
      <NavigationBar 
        activeScreen={activeScreen} 
        onNavigate={setActiveScreen} 
      />

    </div>
  );
};

export default function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}
