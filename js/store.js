/**
 * IMS Central State Store
 * Manages reactive application state, LocalStorage persistence,
 * operational workflows, and core inventory calculations.
 */

const STORAGE_KEY = "IMS_APPLICATION_STATE_V1";

// Initial benchmark demo dataset
const INITIAL_DEMO_DATA = {
  currentUser: {
    name: "Alex Morgan",
    email: "admin@ims.com",
    role: "Inventory Manager",
    warehouse: "wh-main"
  },
  warehouses: [
    {
      id: "wh-main",
      name: "Main Warehouse",
      code: "WH-MAIN",
      locations: [
        { id: "loc-main-store", name: "Main Store", type: "Store" },
        { id: "loc-rack-a", name: "Rack A", type: "Rack" },
        { id: "loc-rack-b", name: "Rack B", type: "Rack" },
        { id: "loc-prod-floor", name: "Production Floor", type: "Production Area" }
      ]
    },
    {
      id: "wh-sec",
      name: "Secondary Warehouse",
      code: "WH-SEC",
      locations: [
        { id: "loc-sec-rack-a", name: "Rack A", type: "Rack" },
        { id: "loc-sec-rack-b", name: "Rack B", type: "Rack" }
      ]
    }
  ],
  categories: [
    { id: "cat-raw", name: "Raw Materials", description: "Metals, wires, and raw manufacturing elements" },
    { id: "cat-furn", name: "Furniture", description: "Office desks, chairs, and tables" },
    { id: "cat-const", name: "Construction", description: "Cement, bricks, structural materials" },
    { id: "cat-elec", name: "Electrical", description: "Wiring, cables, and components" }
  ],
  suppliers: [
    { id: "sup-1", name: "ABC Steel Suppliers", contact: "sales@abcsteel.com" },
    { id: "sup-2", name: "Metro Materials", contact: "orders@metromaterials.com" },
    { id: "sup-3", name: "Apex Timber Co.", contact: "contact@apextimber.com" }
  ],
  customers: [
    { id: "cust-1", name: "BuildTech Industries", contact: "procurement@buildtech.com" },
    { id: "cust-2", name: "City Furniture", contact: "stock@cityfurniture.com" },
    { id: "cust-3", name: "Vanguard Infra", contact: "supplies@vanguard.com" }
  ],
  products: [
    {
      id: "prod-chair",
      name: "Office Chair",
      sku: "CHAIR-01",
      categoryId: "cat-furn",
      uom: "pcs",
      initialStock: 80,
      currentStock: 80,
      reorderLevel: 15,
      stockByLocation: {
        "loc-main-store": 50,
        "loc-rack-a": 30
      }
    },
    {
      id: "prod-cement",
      name: "Cement Bag",
      sku: "CEM-50",
      categoryId: "cat-const",
      uom: "Bags",
      initialStock: 150,
      currentStock: 150,
      reorderLevel: 50,
      stockByLocation: {
        "loc-main-store": 100,
        "loc-rack-b": 50
      }
    },
    {
      id: "prod-table",
      name: "Wooden Table",
      sku: "TAB-WOOD",
      categoryId: "cat-furn",
      uom: "pcs",
      initialStock: 12,
      currentStock: 12,
      reorderLevel: 15, // Currently Low Stock
      stockByLocation: {
        "loc-rack-a": 12
      }
    },
    {
      id: "prod-wire",
      name: "Copper Wire",
      sku: "CW-100",
      categoryId: "cat-elec",
      uom: "Meters",
      initialStock: 500,
      currentStock: 500,
      reorderLevel: 100,
      stockByLocation: {
        "loc-rack-b": 500
      }
    }
  ],
  receipts: [
    {
      id: "rec-101",
      reference: "REC/2026/0001",
      supplierId: "sup-1",
      productId: "prod-cement",
      quantity: 50,
      destinationLocationId: "loc-main-store",
      status: "Done",
      createdAt: "2026-09-24T10:00:00.000Z",
      validatedAt: "2026-09-24T10:30:00.000Z"
    }
  ],
  deliveries: [
    {
      id: "del-101",
      reference: "DEL/2026/0001",
      customerId: "cust-1",
      productId: "prod-chair",
      quantity: 10,
      sourceLocationId: "loc-main-store",
      status: "Done",
      createdAt: "2026-09-25T11:00:00.000Z",
      validatedAt: "2026-09-25T11:15:00.000Z"
    }
  ],
  transfers: [
    {
      id: "trf-101",
      reference: "INT/2026/0001",
      productId: "prod-wire",
      quantity: 50,
      sourceLocationId: "loc-rack-b",
      destinationLocationId: "loc-sec-rack-a",
      status: "Done",
      createdAt: "2026-09-25T14:00:00.000Z",
      validatedAt: "2026-09-25T14:05:00.000Z"
    }
  ],
  adjustments: [],
  ledger: [
    {
      id: "led-1",
      timestamp: "2026-09-24 10:30",
      productId: "prod-cement",
      productName: "Cement Bag",
      sku: "CEM-50",
      operation: "Receipt",
      reference: "REC/2026/0001",
      source: "ABC Steel Suppliers",
      destination: "Main Store",
      quantity: 50,
      stockBefore: 100,
      stockAfter: 150,
      user: "Alex Morgan",
      status: "Done"
    },
    {
      id: "led-2",
      timestamp: "2026-09-25 11:15",
      productId: "prod-chair",
      productName: "Office Chair",
      sku: "CHAIR-01",
      operation: "Delivery",
      reference: "DEL/2026/0001",
      source: "Main Store",
      destination: "BuildTech Industries",
      quantity: -10,
      stockBefore: 90,
      stockAfter: 80,
      user: "Alex Morgan",
      status: "Done"
    }
  ]
};

class Store {
  constructor() {
    this.listeners = [];
    this.data = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }
    return JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
    this.notify();
  }

  resetDemoData() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.data));
  }

  // Auth Methods
  getCurrentUser() {
    return this.data.currentUser;
  }

  login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    this.data.currentUser = {
      name: email.split("@")[0].replace(".", " ").toUpperCase(),
      email: email,
      role: "Inventory Manager",
      warehouse: "wh-main"
    };
    this.saveState();
    return this.data.currentUser;
  }

  logout() {
    this.data.currentUser = null;
    this.saveState();
  }

  // Lookup Helpers
  getLocationName(locId) {
    for (const wh of this.data.warehouses) {
      const loc = wh.locations.find(l => l.id === locId);
      if (loc) {
        return `${wh.name} / ${loc.name}`;
      }
    }
    return locId || "N/A";
  }

  getSupplierName(supId) {
    const sup = this.data.suppliers.find(s => s.id === supId);
    return sup ? sup.name : supId;
  }

  getCustomerName(custId) {
    const cust = this.data.customers.find(c => c.id === custId);
    return cust ? cust.name : custId;
  }

  getCategoryName(catId) {
    const cat = this.data.categories.find(c => c.id === catId);
    return cat ? cat.name : "Uncategorized";
  }

  // Products & Stock Calculation
  getProducts(filters = {}) {
    let list = this.data.products;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (filters.categoryId) {
      list = list.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters.stockStatus) {
      if (filters.stockStatus === "low") {
        list = list.filter(p => p.currentStock <= p.reorderLevel && p.currentStock > 0);
      } else if (filters.stockStatus === "out") {
        list = list.filter(p => p.currentStock <= 0);
      } else if (filters.stockStatus === "in") {
        list = list.filter(p => p.currentStock > p.reorderLevel);
      }
    }
    return list;
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  addProduct(productData) {
    if (!productData.name || !productData.sku) {
      throw new Error("Product Name and SKU are required.");
    }
    // Check SKU uniqueness
    if (this.data.products.some(p => p.sku.toLowerCase() === productData.sku.toLowerCase())) {
      throw new Error(`SKU "${productData.sku}" already exists.`);
    }

    const initialStock = Number(productData.initialStock) || 0;
    const defaultLoc = productData.locationId || "loc-main-store";

    const newProd = {
      id: "prod-" + Date.now(),
      name: productData.name,
      sku: productData.sku.toUpperCase(),
      categoryId: productData.categoryId || "cat-raw",
      uom: productData.uom || "pcs",
      initialStock: initialStock,
      currentStock: initialStock,
      reorderLevel: Number(productData.reorderLevel) || 0,
      stockByLocation: {
        [defaultLoc]: initialStock
      }
    };

    this.data.products.push(newProd);
    this.saveState();
    return newProd;
  }

  updateProduct(id, updates) {
    const p = this.getProductById(id);
    if (!p) throw new Error("Product not found");

    if (updates.sku && updates.sku.toLowerCase() !== p.sku.toLowerCase()) {
      if (this.data.products.some(x => x.sku.toLowerCase() === updates.sku.toLowerCase())) {
        throw new Error(`SKU "${updates.sku}" already exists.`);
      }
    }

    Object.assign(p, updates);
    this.saveState();
    return p;
  }

  // -------------------------------------------------------------
  // Operations Logic
  // -------------------------------------------------------------

  // RECEIPTS (Incoming Stock)
  addReceipt(receiptData) {
    const prod = this.getProductById(receiptData.productId);
    if (!prod) throw new Error("Please select a valid product.");

    const newReceipt = {
      id: "rec-" + Date.now(),
      reference: `REC/2026/${String(this.data.receipts.length + 1).padStart(4, "0")}`,
      supplierId: receiptData.supplierId,
      productId: receiptData.productId,
      quantity: Number(receiptData.quantity),
      destinationLocationId: receiptData.destinationLocationId || "loc-main-store",
      status: "Draft",
      createdAt: new Date().toISOString()
    };

    this.data.receipts.unshift(newReceipt);
    this.saveState();
    return newReceipt;
  }

  validateReceipt(receiptId) {
    const rec = this.data.receipts.find(r => r.id === receiptId);
    if (!rec) throw new Error("Receipt not found");
    if (rec.status === "Done") throw new Error("Receipt is already validated");
    if (rec.status === "Canceled") throw new Error("Canceled receipts cannot be validated");

    const prod = this.getProductById(rec.productId);
    if (!prod) throw new Error("Product associated with this receipt no longer exists");

    const stockBefore = prod.currentStock;
    const destLoc = rec.destinationLocationId;

    // Core stock update: New Stock = Current Stock + Received Quantity
    prod.stockByLocation[destLoc] = (prod.stockByLocation[destLoc] || 0) + rec.quantity;
    prod.currentStock = Object.values(prod.stockByLocation).reduce((a, b) => a + b, 0);

    rec.status = "Done";
    rec.validatedAt = new Date().toISOString();

    // Create Ledger entry
    this.addLedgerEntry({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      operation: "Receipt",
      reference: rec.reference,
      source: this.getSupplierName(rec.supplierId),
      destination: this.getLocationName(destLoc),
      quantity: rec.quantity,
      stockBefore: stockBefore,
      stockAfter: prod.currentStock,
      user: this.getCurrentUser()?.name || "System",
      status: "Done"
    });

    this.saveState();
    return rec;
  }

  // DELIVERIES (Outgoing Stock)
  addDelivery(deliveryData) {
    const prod = this.getProductById(deliveryData.productId);
    if (!prod) throw new Error("Please select a valid product.");

    const newDel = {
      id: "del-" + Date.now(),
      reference: `DEL/2026/${String(this.data.deliveries.length + 1).padStart(4, "0")}`,
      customerId: deliveryData.customerId,
      productId: deliveryData.productId,
      quantity: Number(deliveryData.quantity),
      sourceLocationId: deliveryData.sourceLocationId || "loc-main-store",
      status: "Draft",
      createdAt: new Date().toISOString()
    };

    this.data.deliveries.unshift(newDel);
    this.saveState();
    return newDel;
  }

  validateDelivery(deliveryId) {
    const del = this.data.deliveries.find(d => d.id === deliveryId);
    if (!del) throw new Error("Delivery order not found");
    if (del.status === "Done") throw new Error("Delivery order is already validated");
    if (del.status === "Canceled") throw new Error("Canceled orders cannot be validated");

    const prod = this.getProductById(del.productId);
    if (!prod) throw new Error("Product associated with this delivery does not exist");

    const srcLoc = del.sourceLocationId;
    const currentLocStock = prod.stockByLocation[srcLoc] || 0;

    // Safety rule: Do not allow delivery when available stock is insufficient
    if (currentLocStock < del.quantity) {
      throw new Error(`Insufficient stock in ${this.getLocationName(srcLoc)}. Available: ${currentLocStock} ${prod.uom}, Requested: ${del.quantity} ${prod.uom}`);
    }

    const stockBefore = prod.currentStock;

    // Core stock update: New Stock = Current Stock - Delivered Quantity
    prod.stockByLocation[srcLoc] = currentLocStock - del.quantity;
    prod.currentStock = Object.values(prod.stockByLocation).reduce((a, b) => a + b, 0);

    del.status = "Done";
    del.validatedAt = new Date().toISOString();

    // Create Ledger entry
    this.addLedgerEntry({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      operation: "Delivery",
      reference: del.reference,
      source: this.getLocationName(srcLoc),
      destination: this.getCustomerName(del.customerId),
      quantity: -del.quantity,
      stockBefore: stockBefore,
      stockAfter: prod.currentStock,
      user: this.getCurrentUser()?.name || "System",
      status: "Done"
    });

    this.saveState();
    return del;
  }

  // INTERNAL TRANSFERS (Location Movement)
  addTransfer(transferData) {
    const prod = this.getProductById(transferData.productId);
    if (!prod) throw new Error("Please select a valid product.");

    if (transferData.sourceLocationId === transferData.destinationLocationId) {
      throw new Error("Source and Destination locations must be different.");
    }

    const newTrf = {
      id: "trf-" + Date.now(),
      reference: `INT/2026/${String(this.data.transfers.length + 1).padStart(4, "0")}`,
      productId: transferData.productId,
      quantity: Number(transferData.quantity),
      sourceLocationId: transferData.sourceLocationId,
      destinationLocationId: transferData.destinationLocationId,
      status: "Draft",
      createdAt: new Date().toISOString()
    };

    this.data.transfers.unshift(newTrf);
    this.saveState();
    return newTrf;
  }

  validateTransfer(transferId) {
    const trf = this.data.transfers.find(t => t.id === transferId);
    if (!trf) throw new Error("Internal transfer record not found");
    if (trf.status === "Done") throw new Error("Transfer is already validated");

    const prod = this.getProductById(trf.productId);
    if (!prod) throw new Error("Product associated with this transfer does not exist");

    const srcLoc = trf.sourceLocationId;
    const destLoc = trf.destinationLocationId;
    const currentSrcStock = prod.stockByLocation[srcLoc] || 0;

    if (currentSrcStock < trf.quantity) {
      throw new Error(`Insufficient stock in ${this.getLocationName(srcLoc)}. Available: ${currentSrcStock} ${prod.uom}, Transfer quantity: ${trf.quantity} ${prod.uom}`);
    }

    const stockBefore = prod.currentStock;

    // Core stock update: Source stock - qty, Dest stock + qty (Net total unchanged)
    prod.stockByLocation[srcLoc] = currentSrcStock - trf.quantity;
    prod.stockByLocation[destLoc] = (prod.stockByLocation[destLoc] || 0) + trf.quantity;
    prod.currentStock = Object.values(prod.stockByLocation).reduce((a, b) => a + b, 0);

    trf.status = "Done";
    trf.validatedAt = new Date().toISOString();

    // Create Ledger Entry
    this.addLedgerEntry({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      operation: "Internal Transfer",
      reference: trf.reference,
      source: this.getLocationName(srcLoc),
      destination: this.getLocationName(destLoc),
      quantity: trf.quantity,
      stockBefore: stockBefore,
      stockAfter: prod.currentStock,
      user: this.getCurrentUser()?.name || "System",
      status: "Done"
    });

    this.saveState();
    return trf;
  }

  // INVENTORY ADJUSTMENTS (Stock Count Reconciliation)
  addAdjustment(adjData) {
    const prod = this.getProductById(adjData.productId);
    if (!prod) throw new Error("Please select a valid product.");

    const locId = adjData.locationId || "loc-main-store";
    const systemStock = prod.stockByLocation[locId] || 0;
    const physicalCount = Number(adjData.physicalCount);
    const difference = physicalCount - systemStock;

    const newAdj = {
      id: "adj-" + Date.now(),
      reference: `ADJ/2026/${String(this.data.adjustments.length + 1).padStart(4, "0")}`,
      productId: adjData.productId,
      locationId: locId,
      systemStock: systemStock,
      physicalCount: physicalCount,
      difference: difference,
      reason: adjData.reason || "Physical Audit / Inventory Adjustment",
      status: "Draft",
      createdAt: new Date().toISOString()
    };

    this.data.adjustments.unshift(newAdj);
    this.saveState();
    return newAdj;
  }

  validateAdjustment(adjId) {
    const adj = this.data.adjustments.find(a => a.id === adjId);
    if (!adj) throw new Error("Adjustment record not found");
    if (adj.status === "Done") throw new Error("Adjustment is already validated");

    const prod = this.getProductById(adj.productId);
    if (!prod) throw new Error("Product associated with this adjustment does not exist");

    const locId = adj.locationId;
    const stockBefore = prod.currentStock;

    // Core stock update: Stock = Physical Counted Quantity
    prod.stockByLocation[locId] = adj.physicalCount;
    prod.currentStock = Object.values(prod.stockByLocation).reduce((a, b) => a + b, 0);

    adj.status = "Done";
    adj.validatedAt = new Date().toISOString();

    // Create Ledger Entry
    this.addLedgerEntry({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      operation: "Adjustment",
      reference: adj.reference,
      source: "Physical Audit",
      destination: this.getLocationName(locId),
      quantity: adj.difference,
      stockBefore: stockBefore,
      stockAfter: prod.currentStock,
      user: this.getCurrentUser()?.name || "System",
      status: "Done"
    });

    this.saveState();
    return adj;
  }

  // Stock Ledger
  addLedgerEntry(entry) {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newLedger = {
      id: "led-" + Date.now(),
      timestamp: formattedDate,
      ...entry
    };

    this.data.ledger.unshift(newLedger);
  }
}

// Global Store Instance
window.imsStore = new Store();
