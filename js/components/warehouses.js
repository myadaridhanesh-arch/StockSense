/**
 * Warehouse & Location Management View Component
 */

window.renderWarehouses = function() {
  const store = window.imsStore;
  const warehouses = store.data.warehouses;

  return `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Warehouses & Locations</h1>
          <p class="page-subtitle">Configure multi-warehouse hierarchy, stores, racks, and production areas.</p>
        </div>
        <button class="btn btn-primary" onclick="window.openAddLocationModal()">
          <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Add Location
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${warehouses.map(w => `
          <div class="table-card">
            <div style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid var(--border-main); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h3 style="font-size: 16px; font-weight: 700;">${w.name}</h3>
                <span style="font-size: 12px; color: var(--text-muted); font-family: monospace;">Code: ${w.code}</span>
              </div>
              <span class="badge badge-done">${w.locations.length} Locations</span>
            </div>
            
            <table class="data-table">
              <thead>
                <tr>
                  <th>Location Name</th>
                  <th>Type</th>
                  <th>Allocated Items</th>
                  <th>Total Stock in Location</th>
                </tr>
              </thead>
              <tbody>
                ${w.locations.map(loc => {
                  // Calculate total stock in this location
                  let itemsCount = 0;
                  let totalUnits = 0;
                  store.data.products.forEach(p => {
                    const qty = p.stockByLocation[loc.id] || 0;
                    if (qty > 0) {
                      itemsCount++;
                      totalUnits += qty;
                    }
                  });

                  return `
                    <tr>
                      <td style="font-weight: 600;">
                        <i data-lucide="corner-down-right" style="width: 14px; height: 14px; color: var(--text-muted); display: inline-block; vertical-align: middle;"></i>
                        ${loc.name}
                      </td>
                      <td><span class="badge badge-draft">${loc.type}</span></td>
                      <td>${itemsCount} product types</td>
                      <td style="font-weight: 700; color: var(--primary);">${totalUnits.toLocaleString()} units</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}
      </div>

      <div id="warehouse-modal-container"></div>
    </div>
  `;
};

window.openAddLocationModal = function() {
  const warehouses = window.imsStore.data.warehouses;

  const html = `
    <div class="modal-overlay" id="location-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Add New Storage Location</h3>
          <button class="modal-close" onclick="document.getElementById('location-modal').remove()">×</button>
        </div>
        <form onsubmit="window.submitAddLocation(event)">
          <div class="modal-body">
            
            <div class="form-group">
              <label class="form-label">Parent Warehouse *</label>
              <select id="loc-wh-select" class="form-control" style="width: 100%;">
                ${warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Location Name *</label>
              <input type="text" id="loc-name-input" class="form-control" style="width: 100%;" placeholder="e.g. Rack C / Cold Room 1" required>
            </div>

            <div class="form-group">
              <label class="form-label">Location Type</label>
              <select id="loc-type-select" class="form-control" style="width: 100%;">
                <option value="Store">Store</option>
                <option value="Rack">Rack</option>
                <option value="Production Area">Production Area</option>
                <option value="Buffer">Buffer Area</option>
              </select>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('location-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Location</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById("warehouse-modal-container").innerHTML = html;
};

window.submitAddLocation = function(e) {
  e.preventDefault();
  const whId = document.getElementById("loc-wh-select").value;
  const name = document.getElementById("loc-name-input").value;
  const type = document.getElementById("loc-type-select").value;

  const wh = window.imsStore.data.warehouses.find(w => w.id === whId);
  if (wh) {
    wh.locations.push({
      id: "loc-" + Date.now(),
      name: name,
      type: type
    });
    window.imsStore.saveState();
    window.imsToast.show(`Location "${name}" added to ${wh.name}!`);
    window.imsRouter.handleRoute();
  }
};
