/**
 * Delivery Orders View Component (Outgoing Goods)
 */

window.renderDeliveries = function() {
  const store = window.imsStore;
  const deliveries = store.data.deliveries;

  return `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Delivery Orders (Outbound Goods)</h1>
          <p class="page-subtitle">Ship inventory to customers. Validated delivery orders deduct stock from specified location.</p>
        </div>
        <button class="btn btn-primary" onclick="window.openAddDeliveryModal()">
          <i data-lucide="plus" style="width: 14px; height: 14px;"></i> New Delivery Order
        </button>
      </div>

      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Source Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${deliveries.map(d => {
              const prod = store.getProductById(d.productId);
              return `
                <tr>
                  <td style="font-weight: 700; font-family: monospace;">${d.reference}</td>
                  <td style="font-size: 12.5px; color: var(--text-muted);">${new Date(d.createdAt).toLocaleDateString()}</td>
                  <td style="font-weight: 600;">${store.getCustomerName(d.customerId)}</td>
                  <td>${prod ? `${prod.name} (${prod.sku})` : 'Unknown'}</td>
                  <td style="font-weight: 700; color: var(--danger); font-size: 14px;">-${d.quantity} ${prod ? prod.uom : ''}</td>
                  <td>${store.getLocationName(d.sourceLocationId)}</td>
                  <td><span class="badge ${d.status === 'Done' ? 'badge-done' : (d.status === 'Canceled' ? 'badge-canceled' : 'badge-pick')}">${d.status}</span></td>
                  <td>
                    ${d.status !== 'Done' && d.status !== 'Canceled' ? `
                      <button class="btn btn-danger btn-sm" onclick="window.validateDeliveryAction('${d.id}')">
                        <i data-lucide="send" style="width: 13px; height: 13px;"></i> Validate & Deliver
                      </button>
                    ` : `<span style="font-size: 12px; color: var(--text-muted);">Completed</span>`}
                  </td>
                </tr>
              `;
            }).join('')}
            ${deliveries.length === 0 ? '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">No delivery orders found.</td></tr>' : ''}
          </tbody>
        </table>
      </div>

      <div id="delivery-modal-container"></div>
    </div>
  `;
};

window.openAddDeliveryModal = function() {
  const store = window.imsStore;
  const customers = store.data.customers;
  const products = store.data.products;
  const warehouses = store.data.warehouses;
  const mainLocs = warehouses[0]?.locations || [];

  const html = `
    <div class="modal-overlay" id="delivery-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">New Delivery Order</h3>
          <button class="modal-close" onclick="document.getElementById('delivery-modal').remove()">×</button>
        </div>
        <form onsubmit="window.submitAddDelivery(event)">
          <div class="modal-body">
            
            <div class="form-group">
              <label class="form-label">Customer *</label>
              <select id="del-customer" class="form-control" style="width: 100%;" required>
                ${customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Product to Deliver *</label>
              <select id="del-product" class="form-control" style="width: 100%;" required>
                ${products.map(p => `<option value="${p.id}">${p.name} (SKU: ${p.sku}) - Stock: ${p.currentStock} ${p.uom}</option>`).join('')}
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Delivery Quantity *</label>
                <input type="number" id="del-qty" class="form-control" style="width: 100%;" min="1" value="20" required>
              </div>
              <div class="form-group">
                <label class="form-label">Source Location *</label>
                <select id="del-src-loc" class="form-control" style="width: 100%;">
                  ${mainLocs.map(l => `<option value="${l.id}">Main Warehouse / ${l.name}</option>`).join('')}
                </select>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('delivery-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Delivery Order</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById("delivery-modal-container").innerHTML = html;
};

window.submitAddDelivery = function(e) {
  e.preventDefault();
  try {
    const del = window.imsStore.addDelivery({
      customerId: document.getElementById("del-customer").value,
      productId: document.getElementById("del-product").value,
      quantity: document.getElementById("del-qty").value,
      sourceLocationId: document.getElementById("del-src-loc").value
    });

    document.getElementById("delivery-modal")?.remove();
    window.imsToast.show(`Delivery Order ${del.reference} created!`);
    window.imsRouter.handleRoute();
  } catch (err) {
    window.imsToast.show(err.message, "danger");
  }
};

window.validateDeliveryAction = function(id) {
  try {
    const del = window.imsStore.validateDelivery(id);
    const prod = window.imsStore.getProductById(del.productId);
    window.imsToast.show(`Validated ${del.reference}! Delivered -${del.quantity} ${prod.uom}. Remaining stock: ${prod.currentStock} ${prod.uom}`);
    window.imsRouter.handleRoute();
  } catch (err) {
    window.imsToast.show(err.message, "danger");
  }
};
