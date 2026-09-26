/**
 * Internal Transfers View Component (Location to Location Movement)
 */

window.renderTransfers = function() {
  const store = window.imsStore;
  const transfers = store.data.transfers;

  return `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Internal Location Transfers</h1>
          <p class="page-subtitle">Move inventory between warehouses, stores, racks, and production floors without affecting net company stock.</p>
        </div>
        <button class="btn btn-primary" onclick="window.openAddTransferModal()">
          <i data-lucide="plus" style="width: 14px; height: 14px;"></i> New Internal Transfer
        </button>
      </div>

      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Source Location</th>
              <th>Destination Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${transfers.map(t => {
              const prod = store.getProductById(t.productId);
              return `
                <tr>
                  <td style="font-weight: 700; font-family: monospace;">${t.reference}</td>
                  <td style="font-size: 12.5px; color: var(--text-muted);">${new Date(t.createdAt).toLocaleDateString()}</td>
                  <td style="font-weight: 600;">${prod ? `${prod.name} (${prod.sku})` : 'Unknown'}</td>
                  <td style="font-weight: 700; color: var(--info); font-size: 14px;">${t.quantity} ${prod ? prod.uom : ''}</td>
                  <td>${store.getLocationName(t.sourceLocationId)}</td>
                  <td>${store.getLocationName(t.destinationLocationId)}</td>
                  <td><span class="badge ${t.status === 'Done' ? 'badge-done' : 'badge-pick'}">${t.status}</span></td>
                  <td>
                    ${t.status !== 'Done' ? `
                      <button class="btn btn-primary btn-sm" onclick="window.validateTransferAction('${t.id}')">
                        <i data-lucide="check-circle" style="width: 13px; height: 13px;"></i> Validate Transfer
                      </button>
                    ` : `<span style="font-size: 12px; color: var(--text-muted);">Completed</span>`}
                  </td>
                </tr>
              `;
            }).join('')}
            ${transfers.length === 0 ? '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">No internal transfers recorded.</td></tr>' : ''}
          </tbody>
        </table>
      </div>

      <div id="transfer-modal-container"></div>
    </div>
  `;
};

window.openAddTransferModal = function() {
  const store = window.imsStore;
  const products = store.data.products;
  const warehouses = store.data.warehouses;

  // Compile list of all locations across all warehouses
  const allLocations = [];
  warehouses.forEach(wh => {
    wh.locations.forEach(l => {
      allLocations.push({ id: l.id, name: `${wh.name} / ${l.name}` });
    });
  });

  const html = `
    <div class="modal-overlay" id="transfer-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">New Internal Transfer</h3>
          <button class="modal-close" onclick="document.getElementById('transfer-modal').remove()">×</button>
        </div>
        <form onsubmit="window.submitAddTransfer(event)">
          <div class="modal-body">
            
            <div class="form-group">
              <label class="form-label">Product to Transfer *</label>
              <select id="trf-product" class="form-control" style="width: 100%;" required>
                ${products.map(p => `<option value="${p.id}">${p.name} (SKU: ${p.sku}) - Total Stock: ${p.currentStock} ${p.uom}</option>`).join('')}
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Source Location *</label>
                <select id="trf-src-loc" class="form-control" style="width: 100%;">
                  ${allLocations.map((l, i) => `<option value="${l.id}" ${i === 0 ? 'selected' : ''}>${l.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Destination Location *</label>
                <select id="trf-dest-loc" class="form-control" style="width: 100%;">
                  ${allLocations.map((l, i) => `<option value="${l.id}" ${i === 3 ? 'selected' : ''}>${l.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Transfer Quantity *</label>
              <input type="number" id="trf-qty" class="form-control" style="width: 100%;" min="1" value="30" required>
              <span class="form-hint">Transfers modify location breakdown only. Total company inventory remains unchanged.</span>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('transfer-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Transfer</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById("transfer-modal-container").innerHTML = html;
};

window.submitAddTransfer = function(e) {
  e.preventDefault();
  try {
    const trf = window.imsStore.addTransfer({
      productId: document.getElementById("trf-product").value,
      sourceLocationId: document.getElementById("trf-src-loc").value,
      destinationLocationId: document.getElementById("trf-dest-loc").value,
      quantity: document.getElementById("trf-qty").value
    });

    document.getElementById("transfer-modal")?.remove();
    window.imsToast.show(`Transfer order ${trf.reference} created!`);
    window.imsRouter.handleRoute();
  } catch (err) {
    window.imsToast.show(err.message, "danger");
  }
};

window.validateTransferAction = function(id) {
  try {
    const trf = window.imsStore.validateTransfer(id);
    const prod = window.imsStore.getProductById(trf.productId);
    const srcName = window.imsStore.getLocationName(trf.sourceLocationId);
    const destName = window.imsStore.getLocationName(trf.destinationLocationId);

    window.imsToast.show(`Transferred ${trf.quantity} ${prod.uom} from ${srcName} → ${destName}. Total stock remains ${prod.currentStock} ${prod.uom}!`);
    window.imsRouter.handleRoute();
  } catch (err) {
    window.imsToast.show(err.message, "danger");
  }
};
