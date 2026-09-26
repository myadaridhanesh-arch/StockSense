// Initial realistic seed dataset for IMS (Inventory Management System)

export const INITIAL_USER = {
  id: 'usr-101',
  name: 'Alex Mercer',
  email: 'alex.mercer@ims.logistics.io',
  phone: '+1 (555) 019-2834',
  role: 'Inventory Manager',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  warehouse: 'WH-1 (Central Depot)',
};

export const WAREHOUSES = [
  {
    id: 'WH-1',
    name: 'Main Central Depot',
    code: 'WH-1',
    address: 'Building A, Logistics Park, Sector 4',
    manager: 'Alex Mercer',
    totalCapacity: 50000,
    usedCapacity: 34200,
    locations: [
      { id: 'LOC-A1-01', name: 'Rack A1 - Slot 01', zone: 'Zone A', stockCount: 1450 },
      { id: 'LOC-A1-02', name: 'Rack A1 - Slot 02', zone: 'Zone A', stockCount: 980 },
      { id: 'LOC-B2-10', name: 'Shelf B2 - Bin 10', zone: 'Zone B', stockCount: 3200 },
      { id: 'LOC-C3-05', name: 'Pallet Zone C3', zone: 'Zone C', stockCount: 8500 },
    ]
  },
  {
    id: 'WH-2',
    name: 'North Regional Hub',
    code: 'WH-2',
    address: '45 Industrial Ave, North Gateway',
    manager: 'Sarah Jenkins',
    totalCapacity: 30000,
    usedCapacity: 18900,
    locations: [
      { id: 'LOC-N1-01', name: 'Rack N1 - High Density', zone: 'Zone N1', stockCount: 4200 },
      { id: 'LOC-N2-04', name: 'Cold Bay N2', zone: 'Cold Zone', stockCount: 1200 },
      { id: 'LOC-N3-12', name: 'Bulk Staging Area', zone: 'Staging', stockCount: 6500 },
    ]
  },
  {
    id: 'WH-3',
    name: 'East Fulfillment Facility',
    code: 'WH-3',
    address: '88 Express Cargo Way, East Dock',
    manager: 'David Chen',
    totalCapacity: 25000,
    usedCapacity: 12400,
    locations: [
      { id: 'LOC-E1-01', name: 'Pallet Rack E1', zone: 'Zone E', stockCount: 3100 },
      { id: 'LOC-E2-08', name: 'Pick Bin E2', zone: 'Fast Pick', stockCount: 2400 },
    ]
  }
];

export const CATEGORIES = [
  'Electronics',
  'Raw Materials',
  'Finished Goods',
  'Packaging',
  'Spare Parts'
];

export const UNITS_OF_MEASURE = [
  'Pieces (pcs)',
  'Kilograms (kg)',
  'Boxes (box)',
  'Pallets (plt)',
  'Meters (m)',
  'Liters (L)'
];

export const INITIAL_PRODUCTS = [
  {
    id: 'PRD-1001',
    sku: 'ELE-SCR-001',
    name: '4K Ultra HD Display Module 27"',
    category: 'Electronics',
    uom: 'Pieces (pcs)',
    stock: 450,
    reorderLevel: 100,
    unitPrice: 185.00,
    defaultLocation: 'LOC-A1-01',
    warehouse: 'WH-1',
    description: 'High-resolution IPS LCD panel assembly for workstation displays.',
    lastUpdated: '2026-09-25T14:30:00Z',
    stockByLocation: {
      'LOC-A1-01': 300,
      'LOC-N1-01': 100,
      'LOC-E1-01': 50
    }
  },
  {
    id: 'PRD-1002',
    sku: 'RAW-ALU-505',
    name: 'Aluminum Alloy Sheet 5mm (1000x2000mm)',
    category: 'Raw Materials',
    uom: 'Kilograms (kg)',
    stock: 75,
    reorderLevel: 200,
    unitPrice: 42.50,
    defaultLocation: 'LOC-C3-05',
    warehouse: 'WH-1',
    description: 'Aerospace-grade anodized aluminum alloy plates for chassis frame.',
    lastUpdated: '2026-09-24T11:15:00Z',
    stockByLocation: {
      'LOC-C3-05': 75
    }
  },
  {
    id: 'PRD-1003',
    sku: 'FNG-SEN-992',
    name: 'Smart IoT Temperature Sensor Unit',
    category: 'Finished Goods',
    uom: 'Boxes (box)',
    stock: 0,
    reorderLevel: 50,
    unitPrice: 240.00,
    defaultLocation: 'LOC-B2-10',
    warehouse: 'WH-1',
    description: 'Wireless IoT environmental monitoring sensor node.',
    lastUpdated: '2026-09-23T09:00:00Z',
    stockByLocation: {
      'LOC-B2-10': 0
    }
  },
  {
    id: 'PRD-1004',
    sku: 'PKG-BOX-COR',
    name: 'Heavy-Duty Corrugated Shipping Boxes (Large)',
    category: 'Packaging',
    uom: 'Boxes (box)',
    stock: 1250,
    reorderLevel: 300,
    unitPrice: 2.80,
    defaultLocation: 'LOC-C3-05',
    warehouse: 'WH-1',
    description: 'Double-walled protective packaging boxes for international freight.',
    lastUpdated: '2026-09-26T08:20:00Z',
    stockByLocation: {
      'LOC-C3-05': 800,
      'LOC-N3-12': 450
    }
  },
  {
    id: 'PRD-1005',
    sku: 'SPR-MOT-24V',
    name: 'High-Torque DC Servo Motor 24V',
    category: 'Spare Parts',
    uom: 'Pieces (pcs)',
    stock: 35,
    reorderLevel: 40,
    unitPrice: 115.00,
    defaultLocation: 'LOC-B2-10',
    warehouse: 'WH-1',
    description: 'Precision robotic actuator motor for automated assembly lines.',
    lastUpdated: '2026-09-22T16:45:00Z',
    stockByLocation: {
      'LOC-B2-10': 35
    }
  },
  {
    id: 'PRD-1006',
    sku: 'ELE-PCB-MAIN',
    name: 'Main Logic Control Board V4.2',
    category: 'Electronics',
    uom: 'Pieces (pcs)',
    stock: 820,
    reorderLevel: 150,
    unitPrice: 78.00,
    defaultLocation: 'LOC-A1-02',
    warehouse: 'WH-1',
    description: 'ARM Cortex-M4 base controller board with CAN bus transceiver.',
    lastUpdated: '2026-09-26T07:10:00Z',
    stockByLocation: {
      'LOC-A1-02': 520,
      'LOC-E2-08': 300
    }
  },
  {
    id: 'PRD-1007',
    sku: 'RAW-COP-WIRE',
    name: 'Enameled Copper Winding Wire 1.2mm',
    category: 'Raw Materials',
    uom: 'Kilograms (kg)',
    stock: 18,
    reorderLevel: 50,
    unitPrice: 16.50,
    defaultLocation: 'LOC-C3-05',
    warehouse: 'WH-1',
    description: 'High conductivity copper spool for transformer & motor coils.',
    lastUpdated: '2026-09-21T10:00:00Z',
    stockByLocation: {
      'LOC-C3-05': 18
    }
  },
  {
    id: 'PRD-1008',
    sku: 'PKG-PAL-WOOD',
    name: 'Euro Heat-Treated Wooden Pallet (1200x800mm)',
    category: 'Packaging',
    uom: 'Pallets (plt)',
    stock: 160,
    reorderLevel: 30,
    unitPrice: 22.00,
    defaultLocation: 'LOC-C3-05',
    warehouse: 'WH-1',
    description: 'ISPM 15 certified standard wooden export pallets.',
    lastUpdated: '2026-09-25T11:00:00Z',
    stockByLocation: {
      'LOC-C3-05': 100,
      'LOC-N3-12': 60
    }
  }
];

export const INITIAL_OPERATIONS = [
  {
    id: 'OP-REC-8901',
    type: 'Receipt',
    reference: 'PO-2026-0881',
    status: 'Completed',
    warehouse: 'WH-1',
    productId: 'PRD-1001',
    productName: '4K Ultra HD Display Module 27"',
    sku: 'ELE-SCR-001',
    quantity: 150,
    source: 'Vendor: DisplayTech Korea Ltd',
    destination: 'Rack A1 - Slot 01',
    date: '2026-09-25T14:30:00Z',
    createdBy: 'Alex Mercer',
    notes: 'Received initial bulk shipment. Inspection passed 100%.'
  },
  {
    id: 'OP-DEL-8902',
    type: 'Delivery',
    reference: 'SO-2026-4019',
    status: 'Completed',
    warehouse: 'WH-1',
    productId: 'PRD-1004',
    productName: 'Heavy-Duty Corrugated Shipping Boxes (Large)',
    sku: 'PKG-BOX-COR',
    quantity: 200,
    source: 'Pallet Zone C3',
    destination: 'Customer: Global Logistics Inc',
    date: '2026-09-26T08:20:00Z',
    createdBy: 'Sarah Jenkins',
    notes: 'Dispatched via Express Carrier #8839.'
  },
  {
    id: 'OP-TRN-8903',
    type: 'Internal Transfer',
    reference: 'TR-2026-0042',
    status: 'Completed',
    warehouse: 'WH-1',
    productId: 'PRD-1006',
    productName: 'Main Logic Control Board V4.2',
    sku: 'ELE-PCB-MAIN',
    quantity: 100,
    source: 'WH-1 (Rack A1 - Slot 02)',
    destination: 'WH-3 (Pick Bin E2)',
    date: '2026-09-26T07:10:00Z',
    createdBy: 'Alex Mercer',
    notes: 'Inter-warehouse stock rebalancing for Q3 production line.'
  },
  {
    id: 'OP-ADJ-8904',
    type: 'Inventory Adjustment',
    reference: 'ADJ-2026-012',
    status: 'Completed',
    warehouse: 'WH-1',
    productId: 'PRD-1005',
    productName: 'High-Torque DC Servo Motor 24V',
    sku: 'SPR-MOT-24V',
    quantity: -5,
    source: 'Shelf B2 - Bin 10',
    destination: 'Adjustment: Damaged in Transit',
    date: '2026-09-22T16:45:00Z',
    createdBy: 'David Chen',
    notes: 'Physical audit count discrepancy of 5 damaged motor casings.'
  },
  {
    id: 'OP-REC-8905',
    type: 'Receipt',
    reference: 'PO-2026-0912',
    status: 'Pending',
    warehouse: 'WH-2',
    productId: 'PRD-1003',
    productName: 'Smart IoT Temperature Sensor Unit',
    sku: 'FNG-SEN-992',
    quantity: 100,
    source: 'Vendor: MicroSense Corp',
    destination: 'Cold Bay N2',
    date: '2026-09-26T09:00:00Z',
    createdBy: 'Sarah Jenkins',
    notes: 'Awaiting dock arrival confirmation.'
  },
  {
    id: 'OP-DEL-8906',
    type: 'Delivery',
    reference: 'SO-2026-4050',
    status: 'Pending',
    warehouse: 'WH-1',
    productId: 'PRD-1001',
    productName: '4K Ultra HD Display Module 27"',
    sku: 'ELE-SCR-001',
    quantity: 50,
    source: 'Rack A1 - Slot 01',
    destination: 'Customer: Apex Systems',
    date: '2026-09-26T09:15:00Z',
    createdBy: 'Alex Mercer',
    notes: 'Staged for pick-up at loading dock 2.'
  }
];

export const INITIAL_STOCK_LEDGER = [
  {
    id: 'LED-001',
    date: '2026-09-26T08:20:00Z',
    productId: 'PRD-1004',
    productName: 'Heavy-Duty Corrugated Shipping Boxes (Large)',
    sku: 'PKG-BOX-COR',
    operation: 'Delivery',
    reference: 'SO-2026-4019',
    quantity: -200,
    source: 'Pallet Zone C3',
    destination: 'Customer: Global Logistics Inc',
    stockBefore: 1450,
    stockAfter: 1250,
    user: 'Sarah Jenkins',
    notes: 'Dispatched via Express Carrier #8839.'
  },
  {
    id: 'LED-002',
    date: '2026-09-26T07:10:00Z',
    productId: 'PRD-1006',
    productName: 'Main Logic Control Board V4.2',
    sku: 'ELE-PCB-MAIN',
    operation: 'Internal Transfer',
    reference: 'TR-2026-0042',
    quantity: 100,
    source: 'WH-1 (Rack A1 - Slot 02)',
    destination: 'WH-3 (Pick Bin E2)',
    stockBefore: 820,
    stockAfter: 820,
    user: 'Alex Mercer',
    notes: 'Inter-warehouse stock rebalancing. WH-1 decreased by 100, WH-3 increased by 100.'
  },
  {
    id: 'LED-003',
    date: '2026-09-25T14:30:00Z',
    productId: 'PRD-1001',
    productName: '4K Ultra HD Display Module 27"',
    sku: 'ELE-SCR-001',
    operation: 'Receipt',
    reference: 'PO-2026-0881',
    quantity: 150,
    source: 'Vendor: DisplayTech Korea Ltd',
    destination: 'Rack A1 - Slot 01',
    stockBefore: 300,
    stockAfter: 450,
    user: 'Alex Mercer',
    notes: 'Received bulk shipment PO-2026-0881.'
  },
  {
    id: 'LED-004',
    date: '2026-09-22T16:45:00Z',
    productId: 'PRD-1005',
    productName: 'High-Torque DC Servo Motor 24V',
    sku: 'SPR-MOT-24V',
    operation: 'Inventory Adjustment',
    reference: 'ADJ-2026-012',
    quantity: -5,
    source: 'Shelf B2 - Bin 10',
    destination: 'Adjustment: Damaged Goods',
    stockBefore: 40,
    stockAfter: 35,
    user: 'David Chen',
    notes: 'Physical audit count adjustment (-5 units).'
  }
];
