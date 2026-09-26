/**
 * Inventory Adjustments View Component (Physical Stock Audits)
 */

window.renderAdjustments = function() {
  const store = window.imsStore;
  const adjustments = store.data.adjustments;

  return `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Inventory Adjustments</h1>
          <p class="page-subtitle">Reconcile physical stock counts with system balances (damages, shrinkage, audit counts).</p>
        </div>
        <button class="btn btn-primary" onclick="window.openAddAdjustmentModal()">
          <i data-lucide="plus" style="width: 14px; height: 14px;"></i> New Adjustment
        </button>
      </div>

      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date</th>
              <th>Product</th>
              <th>Location</th>
              <th>System Stock</th>
              <th>Physical Count</th>
              <th>Difference</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${adjustments.map(a => {
              const prod = store.getProductById(a.productId);
              return `
                <tr>
                  <td style="font-weight: 700; font-family: monospace;">${a.reference}</td>
                  <td style="font-size: 12.5px; color: var(--text-muted);">${new Date(a.createdAt).toLocaleDateString()}</td>
                  <td style="font-weight: 600;">${prod ? `${prod.name} (${prod.sku})` : 'Unknown'}</td>
                  <td>${store.getLocationName(a.locationId)}</td>
                  <td>${a.systemStock} ${prod ? prod.uom : ''}</td>
                  <td style="font-weight: 700;">${a.physicalCount} ${prod ? prod.uom : ''}</td>
                  <td style="font-weight: 700; ${a.difference < 0 ? 'color: var(--danger);' : (a.difference > 0 ? 'color: var(--success);' : '')}">
                    ${a.difference > 0 ? '+' : ''}${a.difference} ${prod ? prod.uom : ''}
                  </td>
                  <td style="color: var(--text-muted); font-size: 12.5px;">${a.reason}</td>
                  <td><span class="badge ${a.status === 'Done' ? 'badge-done' : 'badge-lowstock'}">${a.status}</span></td>
                  <td>
                    ${a.status !== 'Done' ? `
                      <button class="btn btn-warning btn-sm" onclick="window.validateAdjustmentAction('${a.id}')">
                        <i data-lucide="sliders" style="width: 13px; height: 13px;"></i> Validate & Adjust
                      </button>
                    ` : `<span style="font-size: 12px; color: var(--text-muted);">Reconciled</span>`}
                  </td>
                </tr>
              `;
            }).join('')}
            ${adjustments.length === 0 ? '<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 24px;">No stock adjustments recorded.</td></tr>' : ''}
          </tbody>
        </table>
      </div>

      <div id="adjustment-modal-container"></div>
    </div>
  `;
};

window.openAddAdjustmentModal = function() {
  const store = window.imsStore;
  const products = store.data.products;
  const warehouses = store.data.warehouses;
  const mainLocs = warehouses[0]?.locations || [];

  const html = `
    <div class="modal-overlay" id="adjustment-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">New Inventory Adjustment</h3>
          <button class="modal-close" onclick="document.getElementById('adjustment-modal').remove()">×</button>
        </div>
        <form onsubmit="window.submitAddAdjustment(event)">
          <div class="modal-body">
            
            <div class="form-group">
              <label class="form-label">Product to Adjust *</label>
              <select id="adj-product" class="form-control" style="width: 100%;" onchange="window.updateSystemStockDisplay()" required>
                ${products.map(p => `<option value="${p.id}">${p.name} (SKU: ${p.sku})</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Target Location *</label>
              <select id="adj-location" class="form-control" style="width: 100%;" onchange="window.updateSystemStockDisplay()">
                ${mainLocs.map(l => `<option value="${l.id}">Main Warehouse / ${l.name}</option>`).join('')}
              </select>
            </div>

            <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 13px;">
              System Calculated Stock: <strong id="adj-system-stock-display" style="font-size: 15px; color: var(--primary);">0</strong>
            </div>

            <div class="form-group">
              <label class="form-label">Actual Physical Count *</label>
              <input type="number" id="adj-physical-count" class="form-control" style="width: 100%;" value="77" required>
            </div>

            <div class="form-group">
              <label class="form-label">Reason / Audit Notes</label>
              <input type="text" id="adj-reason" class="form-control" style="width: 100%;" value="Damaged goods / Physical audit count discrepancy">
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('adjustment-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Adjustment (Draft)</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById("adjustment-modal-container").innerHTML = html;
  setTimeout(() => window.updateSystemStockDisplay(), 50);
};

window.updateSystemStockDisplay = function() {
  const prodId = document.getElementById("adj-product")?.value;
  const locId = document.getElementById("adj-location")?.value;
  if (!prodId || !locId) return;

  const prod = window.imsStore.getProductById(prodId);
  if (prod) {
    const locStock = prod.stockByLocation[locId] || 0;
    const el = document.getElementById("adj-system-stock-display");
    if (el) el.innerText = `${locStock} ${prod.uom}`;
  }
};

window.submitAddAdjustment = function(e) {
  e.preventDefault();
  try {
    const adj = window.imsStore.addAdjustment({
      productId: document.getElementById("adj-product").value,
      locationId: document.getElementById("adj-location").value,
      physicalCount: document.getElementById("adj-physical-count").value,
      reason: document.getElementById("adj-reason").value
    });

    document.getElementById("adjustment-modal")?.remove();
    window.imsToast.show(`Adjustment ${adj.reference} created as Draft! Difference: ${adj.difference > 0 ? '+' : ''}${adj.difference}`);
    window.imsRouter.handleRoute();
  } catch (err) {
    window.imsToast.show(err.message, "danger");
  }
};

window.validateAdjustmentAction = function(id) {
  try {
    const adj = window.imsStore.validateAdjustment(id);
    const prod = window.imsStore.getProductById(adj.productId);
    window.imsToast.show(`Validated ${adj.reference}! Adjusted stock in location to ${adj.physicalCount} ${prod.uom}. Final total stock: ${prod.currentStock} ${prod.uom}`);
    window.imsRouter.handleRoute();
  } catch (err) {
    window.imsToast.show(err.message, "danger");
  }
};
