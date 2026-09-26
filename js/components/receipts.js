/**
 * Receipts Management View Component (Incoming Goods)
 */

window.renderReceipts = function() {
  const store = window.imsStore;
  const receipts = store.data.receipts;

  return `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Stock Receipts (Incoming Goods)</h1>
          <p class="page-subtitle">Receive stock from suppliers. Validated receipts automatically increase warehouse inventory.</p>
        </div>
        <button class="btn btn-primary" onclick="window.openAddReceiptModal()">
          <i data-lucide="plus" style="width: 14px; height: 14px;"></i> New Receipt
        </button>
      </div>

      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Destination Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${receipts.map(r => {
              const prod = store.getProductById(r.productId);
              return `
                <tr>
                  <td style="font-weight: 700; font-family: monospace;">${r.reference}</td>
                  <td style="font-size: 12.5px; color: var(--text-muted);">${new Date(r.createdAt).toLocaleDateString()}</td>
                  <td style="font-weight: 600;">${store.getSupplierName(r.supplierId)}</td>
                  <td>${prod ? `${prod.name} (${prod.sku})` : 'Unknown'}</td>
                  <td style="font-weight: 700; color: var(--success); font-size: 14px;">+${r.quantity} ${prod ? prod.uom : ''}</td>
                  <td>${store.getLocationName(r.destinationLocationId)}</td>
                  <td><span class="badge ${getReceiptBadge(r.status)}">${r.status}</span></td>
                  <td>
                    ${r.status === 'Draft' || r.status === 'Waiting' || r.status === 'Ready' ? `
                      <button class="btn btn-success btn-sm" onclick="window.validateReceiptAction('${r.id}')">
                        <i data-lucide="check" style="width: 13px; height: 13px;"></i> Validate & Receive
                      </button>
                    ` : `<span style="font-size: 12px; color: var(--text-muted);">Completed</span>`}
                  </td>
                </tr>
              `;
            }).join('')}
            ${receipts.length === 0 ? '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">No stock receipts found.</td></tr>' : ''}
          </tbody>
        </table>
      </div>

      <div id="receipt-modal-container"></div>
    </div>
  `;
};

function getReceiptBadge(status) {
  if (status === 'Done') return 'badge-done';
  if (status === 'Canceled') return 'badge-canceled';
  return 'badge-waiting';
}

window.openAddReceiptModal = function() {
  const store = window.imsStore;
  const suppliers = store.data.suppliers;
  const products = store.data.products;
  const warehouses = store.data.warehouses;
  const mainLocs = warehouses[0]?.locations || [];

  const html = `
    <div class="modal-overlay" id="receipt-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">New Goods Receipt</h3>
          <button class="modal-close" onclick="document.getElementById('receipt-modal').remove()">×</button>
        </div>
        <form onsubmit="window.submitAddReceipt(event)">
          <div class="modal-body">
            
            <div class="form-group">
              <label class="form-label">Supplier *</label>
              <select id="rec-supplier" class="form-control" style="width: 100%;" required>
                ${suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Product *</label>
              <select id="rec-product" class="form-control" style="width: 100%;" required>
                ${products.map(p => `<option value="${p.id}">${p.name} (SKU: ${p.sku}) - Current: ${p.currentStock} ${p.uom}</option>`).join('')}
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Quantity to Receive *</label>
                <input type="number" id="rec-qty" class="form-control" style="width: 100%;" min="1" value="100" required>
              </div>
              <div class="form-group">
                <label class="form-label">Destination Location *</label>
                <select id="rec-dest-loc" class="form-control" style="width: 100%;">
                  ${mainLocs.map(l => `<option value="${l.id}">Main Warehouse / ${l.name}</option>`).join('')}
                </select>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('receipt-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Receipt (Draft)</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById("receipt-modal-container").innerHTML = html;
};

window.submitAddReceipt = function(e) {
  e.preventDefault();
  try {
    const rec = window.imsStore.addReceipt({
      supplierId: document.getElementById("rec-supplier").value,
      productId: document.getElementById("rec-product").value,
      quantity: document.getElementById("rec-qty").value,
      destinationLocationId: document.getElementById("rec-dest-loc").value
    });

    document.getElementById("receipt-modal")?.remove();
    window.imsToast.show(`Receipt ${rec.reference} created as Draft!`);
    window.imsRouter.handleRoute();
  } catch (err) {
    window.imsToast.show(err.message, "danger");
  }
};

window.validateReceiptAction = function(id) {
  try {
    const rec = window.imsStore.validateReceipt(id);
    const prod = window.imsStore.getProductById(rec.productId);
    window.imsToast.show(`Validated ${rec.reference}! Received +${rec.quantity} ${prod.uom}. New stock: ${prod.currentStock} ${prod.uom}`);
    window.imsRouter.handleRoute();
  } catch (err) {
    window.imsToast.show(err.message, "danger");
  }
};
