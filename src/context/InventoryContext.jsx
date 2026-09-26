import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_USER, 
  INITIAL_PRODUCTS, 
  INITIAL_OPERATIONS, 
  INITIAL_STOCK_LEDGER, 
  WAREHOUSES,
  CATEGORIES,
  UNITS_OF_MEASURE 
} from '../data/mockData';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  // Persistence helpers
  const getStored = (key, fallback) => {
    try {
      const stored = localStorage.getItem(`ims_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const setStored = (key, data) => {
    try {
      localStorage.setItem(`ims_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error('Storage error', e);
    }
  };

  // State
  const [currentUser, setCurrentUser] = useState(() => getStored('user', INITIAL_USER));
  const [isAuthenticated, setIsAuthenticated] = useState(() => getStored('auth', true));
  const [products, setProducts] = useState(() => getStored('products', INITIAL_PRODUCTS));
  const [operations, setOperations] = useState(() => getStored('operations', INITIAL_OPERATIONS));
  const [ledgerEntries, setLedgerEntries] = useState(() => getStored('ledger', INITIAL_STOCK_LEDGER));
  const [warehouses, setWarehouses] = useState(() => getStored('warehouses', WAREHOUSES));
  const [toast, setToast] = useState(null);

  // Sync with LocalStorage
  useEffect(() => setStored('user', currentUser), [currentUser]);
  useEffect(() => setStored('auth', isAuthenticated), [isAuthenticated]);
  useEffect(() => setStored('products', products), [products]);
  useEffect(() => setStored('operations', operations), [operations]);
  useEffect(() => setStored('ledger', ledgerEntries), [ledgerEntries]);
  useEffect(() => setStored('warehouses', warehouses), [warehouses]);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  // Auth Operations
  const login = (email, password) => {
    if (!email || !password) {
      showToast('Please enter both email/phone and password', 'error');
      return false;
    }
    const userObj = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0] || 'Warehouse User',
      email,
      phone: '+1 (555) 987-6543',
      role: 'Inventory Manager',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      warehouse: 'WH-1 (Central Depot)'
    };
    setCurrentUser(userObj);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${userObj.name}!`);
    return true;
  };

  const signup = (userData) => {
    if (!userData.email || !userData.password || !userData.name) {
      showToast('Please fill in all required fields', 'error');
      return false;
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '+1 (555) 000-1122',
      role: userData.role || 'Warehouse Staff',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      warehouse: userData.warehouse || 'WH-1 (Central Depot)'
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    showToast('Account created successfully!');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Logged out successfully', 'info');
  };

  const resetPasswordWithOtp = (email, otp, newPassword) => {
    if (!email || !otp || !newPassword) {
      showToast('Please provide all details', 'error');
      return false;
    }
    if (otp !== '123456' && otp.length !== 6) {
      showToast('Invalid OTP code. Try entering demo OTP: 123456', 'error');
      return false;
    }
    showToast('Password reset successfully. You can now login.');
    return true;
  };

  // Product Operations
  const addProduct = (productData) => {
    if (!productData.name || !productData.sku) {
      showToast('Product Name and SKU are required', 'error');
      return false;
    }
    const skuExists = products.some(p => p.sku.toLowerCase() === productData.sku.toLowerCase());
    if (skuExists) {
      showToast(`SKU "${productData.sku}" already exists in system`, 'error');
      return false;
    }

    const initialStock = parseInt(productData.stock) || 0;
    const newProduct = {
      id: `PRD-${Date.now().toString().slice(-4)}`,
      sku: productData.sku.toUpperCase(),
      name: productData.name,
      category: productData.category || CATEGORIES[0],
      uom: productData.uom || UNITS_OF_MEASURE[0],
      stock: initialStock,
      reorderLevel: parseInt(productData.reorderLevel) || 10,
      unitPrice: parseFloat(productData.unitPrice) || 10.0,
      defaultLocation: productData.defaultLocation || 'LOC-A1-01',
      warehouse: productData.warehouse || 'WH-1',
      description: productData.description || 'Newly created inventory product.',
      lastUpdated: new Date().toISOString(),
      stockByLocation: {
        [productData.defaultLocation || 'LOC-A1-01']: initialStock
      }
    };

    setProducts(prev => [newProduct, ...prev]);

    // Initial stock ledger entry if initial stock > 0
    if (initialStock > 0) {
      addLedgerRecord({
        productId: newProduct.id,
        productName: newProduct.name,
        sku: newProduct.sku,
        operation: 'Initial Receipt',
        reference: 'INIT-ADD',
        quantity: initialStock,
        source: 'Initial Setup',
        destination: newProduct.defaultLocation,
        stockBefore: 0,
        stockAfter: initialStock,
        user: currentUser?.name || 'System Admin',
        notes: 'Initial product creation with stock'
      });
    }

    showToast(`Product "${newProduct.name}" created!`);
    return true;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updatedFields,
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    }));
    showToast('Product updated successfully');
  };

  const deleteProduct = (id) => {
    const prd = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(`Product "${prd?.name || id}" removed`, 'info');
  };

  // Helper to record stock ledger entry
  const addLedgerRecord = (record) => {
    const newLedger = {
      id: `LED-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString(),
      user: currentUser?.name || 'Alex Mercer',
      ...record
    };
    setLedgerEntries(prev => [newLedger, ...prev]);
  };

  // STOCK OPERATIONS LOGIC
  // 1. RECEIPT
  const processReceipt = ({ productId, warehouseId, locationId, quantity, supplier, reference, notes }) => {
    const qty = parseInt(quantity);
    if (!productId || !qty || qty <= 0) {
      showToast('Select a product and valid positive quantity', 'error');
      return false;
    }

    const prd = products.find(p => p.id === productId);
    if (!prd) {
      showToast('Product not found', 'error');
      return false;
    }

    const stockBefore = prd.stock;
    const stockAfter = stockBefore + qty;
    const targetLoc = locationId || prd.defaultLocation || 'LOC-A1-01';

    // Update Product Stock
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const locMap = { ...(p.stockByLocation || {}) };
        locMap[targetLoc] = (locMap[targetLoc] || 0) + qty;
        return {
          ...p,
          stock: stockAfter,
          stockByLocation: locMap,
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    }));

    // Record Operation
    const opRecord = {
      id: `OP-REC-${Date.now().toString().slice(-4)}`,
      type: 'Receipt',
      reference: reference || `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Completed',
      warehouse: warehouseId || prd.warehouse || 'WH-1',
      productId: prd.id,
      productName: prd.name,
      sku: prd.sku,
      quantity: qty,
      source: supplier ? `Vendor: ${supplier}` : 'Supplier Dock',
      destination: targetLoc,
      date: new Date().toISOString(),
      createdBy: currentUser?.name || 'Alex Mercer',
      notes: notes || 'Stock receipt validated and added.'
    };
    setOperations(prev => [opRecord, ...prev]);

    // Record Stock Ledger Entry
    addLedgerRecord({
      productId: prd.id,
      productName: prd.name,
      sku: prd.sku,
      operation: 'Receipt',
      reference: opRecord.reference,
      quantity: qty,
      source: opRecord.source,
      destination: opRecord.destination,
      stockBefore,
      stockAfter,
      notes: notes || 'Receipt processing'
    });

    showToast(`Successfully received +${qty} units of ${prd.name}`);
    return true;
  };

  // 2. DELIVERY
  const processDelivery = ({ productId, warehouseId, locationId, quantity, customer, reference, notes }) => {
    const qty = parseInt(quantity);
    if (!productId || !qty || qty <= 0) {
      showToast('Select a product and valid positive quantity', 'error');
      return false;
    }

    const prd = products.find(p => p.id === productId);
    if (!prd) {
      showToast('Product not found', 'error');
      return false;
    }

    if (prd.stock < qty) {
      showToast(`Insufficient Stock! Available: ${prd.stock} ${prd.uom}, Requested: ${qty}`, 'error');
      return false;
    }

    const stockBefore = prd.stock;
    const stockAfter = stockBefore - qty;
    const sourceLoc = locationId || prd.defaultLocation || 'LOC-A1-01';

    // Update Product Stock
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const locMap = { ...(p.stockByLocation || {}) };
        const currentLocQty = locMap[sourceLoc] || 0;
        locMap[sourceLoc] = Math.max(0, currentLocQty - qty);
        return {
          ...p,
          stock: stockAfter,
          stockByLocation: locMap,
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    }));

    // Record Operation
    const opRecord = {
      id: `OP-DEL-${Date.now().toString().slice(-4)}`,
      type: 'Delivery',
      reference: reference || `SO-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Completed',
      warehouse: warehouseId || prd.warehouse || 'WH-1',
      productId: prd.id,
      productName: prd.name,
      sku: prd.sku,
      quantity: qty,
      source: sourceLoc,
      destination: customer ? `Customer: ${customer}` : 'Outbound Logistics',
      date: new Date().toISOString(),
      createdBy: currentUser?.name || 'Alex Mercer',
      notes: notes || 'Stock delivery dispatched.'
    };
    setOperations(prev => [opRecord, ...prev]);

    // Record Stock Ledger Entry
    addLedgerRecord({
      productId: prd.id,
      productName: prd.name,
      sku: prd.sku,
      operation: 'Delivery',
      reference: opRecord.reference,
      quantity: -qty,
      source: opRecord.source,
      destination: opRecord.destination,
      stockBefore,
      stockAfter,
      notes: notes || 'Delivery processing'
    });

    showToast(`Successfully dispatched -${qty} units of ${prd.name}`);
    return true;
  };

  // 3. INTERNAL TRANSFER
  const processTransfer = ({ productId, sourceLocation, destLocation, quantity, reference, notes }) => {
    const qty = parseInt(quantity);
    if (!productId || !qty || qty <= 0) {
      showToast('Select a product and valid transfer quantity', 'error');
      return false;
    }
    if (sourceLocation === destLocation) {
      showToast('Source and Destination locations must be different', 'error');
      return false;
    }

    const prd = products.find(p => p.id === productId);
    if (!prd) {
      showToast('Product not found', 'error');
      return false;
    }

    const locMap = { ...(prd.stockByLocation || {}) };
    const srcQty = locMap[sourceLocation] || 0;

    if (srcQty < qty) {
      showToast(`Source location (${sourceLocation}) has only ${srcQty} units available. Cannot transfer ${qty}.`, 'error');
      return false;
    }

    // Update location breakdown
    locMap[sourceLocation] = srcQty - qty;
    locMap[destLocation] = (locMap[destLocation] || 0) + qty;

    // Overall product stock remains UNCHANGED!
    const stockBefore = prd.stock;
    const stockAfter = stockBefore;

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stockByLocation: locMap,
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    }));

    // Record Operation
    const opRecord = {
      id: `OP-TRN-${Date.now().toString().slice(-4)}`,
      type: 'Internal Transfer',
      reference: reference || `TR-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Completed',
      warehouse: prd.warehouse,
      productId: prd.id,
      productName: prd.name,
      sku: prd.sku,
      quantity: qty,
      source: sourceLocation,
      destination: destLocation,
      date: new Date().toISOString(),
      createdBy: currentUser?.name || 'Alex Mercer',
      notes: notes || 'Location transfer executed.'
    };
    setOperations(prev => [opRecord, ...prev]);

    // Record Stock Ledger Entry
    addLedgerRecord({
      productId: prd.id,
      productName: prd.name,
      sku: prd.sku,
      operation: 'Internal Transfer',
      reference: opRecord.reference,
      quantity: qty,
      source: sourceLocation,
      destination: destLocation,
      stockBefore,
      stockAfter,
      notes: `Transferred ${qty} units from ${sourceLocation} to ${destLocation}. Total stock unchanged.`
    });

    showToast(`Moved ${qty} units from ${sourceLocation} to ${destLocation}`);
    return true;
  };

  // 4. INVENTORY ADJUSTMENT
  const processAdjustment = ({ productId, locationId, physicalCount, reason, reference, notes }) => {
    const newCount = parseInt(physicalCount);
    if (!productId || isNaN(newCount) || newCount < 0) {
      showToast('Please enter a valid non-negative physical count', 'error');
      return false;
    }

    const prd = products.find(p => p.id === productId);
    if (!prd) {
      showToast('Product not found', 'error');
      return false;
    }

    const stockBefore = prd.stock;
    const stockAfter = newCount;
    const delta = stockAfter - stockBefore;
    const targetLoc = locationId || prd.defaultLocation || 'LOC-A1-01';

    // Update Product Stock to physical count
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const locMap = { ...(p.stockByLocation || {}) };
        locMap[targetLoc] = newCount;
        return {
          ...p,
          stock: stockAfter,
          stockByLocation: locMap,
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    }));

    // Record Operation
    const opRecord = {
      id: `OP-ADJ-${Date.now().toString().slice(-4)}`,
      type: 'Inventory Adjustment',
      reference: reference || `ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Completed',
      warehouse: prd.warehouse,
      productId: prd.id,
      productName: prd.name,
      sku: prd.sku,
      quantity: delta,
      source: targetLoc,
      destination: `Adjustment: ${reason || 'Physical Audit'}`,
      date: new Date().toISOString(),
      createdBy: currentUser?.name || 'Alex Mercer',
      notes: notes || `Audit count adjusted stock from ${stockBefore} to ${stockAfter}`
    };
    setOperations(prev => [opRecord, ...prev]);

    // Record Stock Ledger Entry
    addLedgerRecord({
      productId: prd.id,
      productName: prd.name,
      sku: prd.sku,
      operation: 'Inventory Adjustment',
      reference: opRecord.reference,
      quantity: delta,
      source: targetLoc,
      destination: `Adjustment: ${reason || 'Audit Count'}`,
      stockBefore,
      stockAfter,
      notes: `Physical Count: ${newCount} units (${delta >= 0 ? '+' : ''}${delta} discrepancy). Reason: ${reason || 'Physical Count'}`
    });

    showToast(`Adjusted stock of ${prd.name} to ${newCount} (Delta: ${delta >= 0 ? '+' : ''}${delta})`);
    return true;
  };

  // Reset to original seed data
  const resetToMockData = () => {
    setCurrentUser(INITIAL_USER);
    setProducts(INITIAL_PRODUCTS);
    setOperations(INITIAL_OPERATIONS);
    setLedgerEntries(INITIAL_STOCK_LEDGER);
    setWarehouses(WAREHOUSES);
    localStorage.clear();
    showToast('App data reset to default demo values', 'info');
  };

  return (
    <InventoryContext.Provider value={{
      currentUser,
      isAuthenticated,
      login,
      signup,
      logout,
      resetPasswordWithOtp,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      operations,
      processReceipt,
      processDelivery,
      processTransfer,
      processAdjustment,
      ledgerEntries,
      warehouses,
      categories: CATEGORIES,
      uoms: UNITS_OF_MEASURE,
      toast,
      showToast,
      resetToMockData
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
