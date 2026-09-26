/**
 * Dashboard Component
 */

window.renderDashboard = function() {
  const store = window.imsStore;
  const products = store.data.products;
  const receipts = store.data.receipts;
  const deliveries = store.data.deliveries;
  const transfers = store.data.transfers;
  const adjustments = store.data.adjustments;

  // Key metrics calculation
  const totalStock = products.reduce((acc, p) => acc + p.currentStock, 0);
  const lowStockItems = products.filter(p => p.currentStock <= p.reorderLevel && p.currentStock > 0);
  const outOfStockItems = products.filter(p => p.currentStock <= 0);

  const pendingReceipts = receipts.filter(r => r.status !== "Done" && r.status !== "Canceled");
  const pendingDeliveries = deliveries.filter(d => d.status !== "Done" && d.status !== "Canceled");
  const pendingTransfers = transfers.filter(t => t.status !== "Done" && t.status !== "Canceled");

  return `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Inventory Dashboard</h1>
          <p class="page-subtitle">Real-time overview of warehouse stock, pending moves, and warnings.</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <a href="#receipts" class="btn btn-primary btn-sm">
            <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Receive Stock
          </a>
          <a href="#deliveries" class="btn btn-secondary btn-sm">
            <i data-lucide="minus" style="width: 14px; height: 14px;"></i> Deliver Stock
          </a>
          <a href="#transfers" class="btn btn-secondary btn-sm">
            <i data-lucide="arrow-left-right" style="width: 14px; height: 14px;"></i> Transfer Stock
          </a>
          <a href="#adjustments" class="btn btn-secondary btn-sm">
            <i data-lucide="sliders" style="width: 14px; height: 14px;"></i> Adjust Stock
          </a>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid-stats">
        <div class="stat-card">
          <span class="stat-label">Total Stock Quantity</span>
          <span class="stat-value">${totalStock.toLocaleString()}</span>
          <span class="stat-meta" style="color: var(--success); font-weight: 600;">Across all warehouses</span>
        </div>
        
        <div class="stat-card" style="border-left: 4px solid var(--warning);">
          <span class="stat-label">Low Stock Items</span>
          <span class="stat-value" style="color: var(--warning);">${lowStockItems.length}</span>
          <span class="stat-meta">Below minimum reorder level</span>
        </div>

        <div class="stat-card" style="border-left: 4px solid var(--danger);">
          <span class="stat-label">Out of Stock Items</span>
          <span class="stat-value" style="color: var(--danger);">${outOfStockItems.length}</span>
          <span class="stat-meta">Zero available quantity</span>
        </div>

        <div class="stat-card">
          <span class="stat-label">Pending Receipts</span>
          <span class="stat-value">${pendingReceipts.length}</span>
          <span class="stat-meta">Awaiting inbound validation</span>
        </div>

        <div class="stat-card">
          <span class="stat-label">Pending Deliveries</span>
          <span class="stat-value">${pendingDeliveries.length}</span>
          <span class="stat-meta">Awaiting picking / shipping</span>
        </div>

        <div class="stat-card">
          <span class="stat-label">Scheduled Transfers</span>
          <span class="stat-value">${pendingTransfers.length}</span>
          <span class="stat-meta">Internal location moves</span>
        </div>
      </div>

      <!-- Quick Action / Warnings Layout -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px;">
        
        <!-- Live Move History / Recent Operations -->
        <div class="table-card">
          <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-main); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 15px; font-weight: 700;">Recent Completed Operations</h3>
            <a href="#ledger" style="font-size: 12px; color: var(--primary); text-decoration: none; font-weight: 600;">View Ledger →</a>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Operation</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${store.data.ledger.slice(0, 5).map(entry => `
                <tr>
                  <td style="font-size: 12.5px; color: var(--text-muted);">${entry.timestamp}</td>
                  <td><span class="badge ${getOperationBadgeClass(entry.operation)}">${entry.operation}</span></td>
                  <td style="font-weight: 600;">${entry.productName} <span style="font-weight: 400; color: var(--text-muted);">(${entry.sku})</span></td>
                  <td style="font-weight: 700; ${entry.quantity > 0 ? 'color: var(--success);' : (entry.quantity < 0 ? 'color: var(--danger);' : '')}">
                    ${entry.quantity > 0 ? '+' : ''}${entry.quantity}
                  </td>
                  <td><span class="badge badge-done">${entry.status}</span></td>
                </tr>
              `).join('')}
              ${store.data.ledger.length === 0 ? '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">No move history logged yet.</td></tr>' : ''}
            </tbody>
          </table>
        </div>

        <!-- Low Stock Warnings Widget -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-main); border-radius: 8px; padding: 20px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
            <i data-lucide="alert-triangle" style="color: var(--warning);"></i>
            <h3 style="font-size: 15px; font-weight: 700;">Reorder Warnings</h3>
          </div>
          
          ${lowStockItems.length === 0 && outOfStockItems.length === 0 ? `
            <div style="font-size: 13px; color: var(--text-muted); padding: 20px 0; text-align: center;">
              All items are above reorder levels.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${[...outOfStockItems, ...lowStockItems].map(p => `
                <div style="padding: 10px 12px; border: 1px solid var(--border-main); border-radius: 6px; background: #fff;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 600; font-size: 13px;">${p.name}</span>
                    <span class="badge ${p.currentStock <= 0 ? 'badge-outofstock' : 'badge-lowstock'}">
                      ${p.currentStock <= 0 ? 'OUT OF STOCK' : 'LOW STOCK'}
                    </span>
                  </div>
                  <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px; display: flex; justify-content: space-between;">
                    <span>Current: <strong>${p.currentStock} ${p.uom}</strong></span>
                    <span>Reorder Level: ${p.reorderLevel} ${p.uom}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>
    </div>
  `;
};

function getOperationBadgeClass(op) {
  if (op === 'Receipt') return 'badge-done';
  if (op === 'Delivery') return 'badge-waiting';
  if (op === 'Internal Transfer') return 'badge-pick';
  if (op === 'Adjustment') return 'badge-lowstock';
  return 'badge-draft';
}
