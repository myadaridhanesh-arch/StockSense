/**
 * Products Management View Component
 */

window.renderProducts = function() {
  const store = window.imsStore;
  const categories = store.data.categories;

  return `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Products Master</h1>
          <p class="page-subtitle">Manage inventory items, SKUs, reorder thresholds, and location breakdowns.</p>
        </div>
        <button class="btn btn-primary" onclick="window.openAddProductModal()">
          <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Add Product
        </button>
      </div>

      <!-- Filters -->
      <div class="filter-bar">
        <div class="filter-group" style="flex: 1; min-width: 200px;">
          <input type="text" id="product-search-input" class="form-control" style="width: 100%;" placeholder="Search by name or SKU..." oninput="window.filterProductsTable()">
        </div>

        <div class="filter-group">
          <label class="filter-label">Category:</label>
          <select id="product-category-filter" class="form-control" onchange="window.filterProductsTable()">
            <option value="">All Categories</option>
            ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Stock Status:</label>
          <select id="product-status-filter" class="form-control" onchange="window.filterProductsTable()">
            <option value="">All Statuses</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="table-card">
        <table class="data-table" id="products-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>UOM</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="products-table-body">
            ${renderProductRows(store.getProducts())}
          </tbody>
        </table>
      </div>

      <!-- Modal Container -->
      <div id="product-modal-container"></div>
    </div>
  `;
};

function renderProductRows(products) {
  if (products.length === 0) {
    return `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">No products match criteria.</td></tr>`;
  }

  return products.map(p => {
    const isLow = p.currentStock <= p.reorderLevel && p.currentStock > 0;
    const isOut = p.currentStock <= 0;
    const statusBadge = isOut 
      ? `<span class="badge badge-outofstock">Out of Stock</span>`
      : (isLow ? `<span class="badge badge-lowstock">Low Stock</span>` : `<span class="badge badge-instock">In Stock</span>`);

    return `
      <tr>
        <td style="font-weight: 700; font-family: monospace;">${p.sku}</td>
        <td style="font-weight: 600; color: var(--text-main);">${p.name}</td>
        <td>${window.imsStore.getCategoryName(p.categoryId)}</td>
        <td><span class="badge badge-draft">${p.uom}</span></td>
        <td style="font-weight: 700; font-size: 14px; ${isOut ? 'color: var(--danger);' : (isLow ? 'color: var(--warning);' : 'color: var(--success);')}">
          ${p.currentStock} ${p.uom}
        </td>
        <td style="color: var(--text-muted);">${p.reorderLevel} ${p.uom}</td>
        <td>${statusBadge}</td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-secondary btn-sm" onclick="window.viewStockByLocation('${p.id}')">
              <i data-lucide="map-pin" style="width: 13px; height: 13px;"></i> Location Breakdown
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.openEditProductModal('${p.id}')">
              <i data-lucide="edit-3" style="width: 13px; height: 13px;"></i> Edit
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.filterProductsTable = function() {
  const search = document.getElementById("product-search-input")?.value || "";
  const categoryId = document.getElementById("product-category-filter")?.value || "";
  const stockStatus = document.getElementById("product-status-filter")?.value || "";

  const filtered = window.imsStore.getProducts({ search, categoryId, stockStatus });
  const tbody = document.getElementById("products-table-body");
  if (tbody) {
    tbody.innerHTML = renderProductRows(filtered);
    if (window.lucide) window.lucide.createIcons();
  }
};

window.openAddProductModal = function() {
  const categories = window.imsStore.data.categories;
  const warehouses = window.imsStore.data.warehouses;
  const mainLocs = warehouses[0]?.locations || [];

  const html = `
    <div class="modal-overlay" id="product-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Create New Product</h3>
          <button class="modal-close" onclick="document.getElementById('product-modal').remove()">×</button>
        </div>
        <form onsubmit="window.submitAddProduct(event)">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Product Name *</label>
              <input type="text" id="add-prod-name" class="form-control" style="width: 100%;" placeholder="e.g. Steel Rod" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">SKU *</label>
                <input type="text" id="add-prod-sku" class="form-control" style="width: 100%; font-family: monospace;" placeholder="e.g. SR-001" required>
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <select id="add-prod-cat" class="form-control" style="width: 100%;">
                  ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Unit of Measure</label>
                <input type="text" id="add-prod-uom" class="form-control" style="width: 100%;" value="KG" placeholder="KG, pcs, Bags" required>
              </div>
              <div class="form-group">
                <label class="form-label">Initial Stock</label>
                <input type="number" id="add-prod-stock" class="form-control" style="width: 100%;" value="0" min="0" required>
              </div>
              <div class="form-group">
                <label class="form-label">Reorder Level</label>
                <input type="number" id="add-prod-reorder" class="form-control" style="width: 100%;" value="20" min="0" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Initial Location</label>
              <select id="add-prod-loc" class="form-control" style="width: 100%;">
                ${mainLocs.map(l => `<option value="${l.id}">Main Warehouse / ${l.name}</option>`).join('')}
              </select>
              <span class="form-hint">Initial stock will be placed in this location.</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('product-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById("product-modal-container").innerHTML = html;
};

window.submitAddProduct = function(e) {
  e.preventDefault();
  try {
    const p = window.imsStore.addProduct({
      name: document.getElementById("add-prod-name").value,
      sku: document.getElementById("add-prod-sku").value,
      categoryId: document.getElementById("add-prod-cat").value,
      uom: document.getElementById("add-prod-uom").value,
      initialStock: document.getElementById("add-prod-stock").value,
      reorderLevel: document.getElementById("add-prod-reorder").value,
      locationId: document.getElementById("add-prod-loc").value
    });

    document.getElementById("product-modal")?.remove();
    window.imsToast.show(`Product "${p.name}" created successfully!`);
    window.imsRouter.handleRoute();
  } catch (err) {
    window.imsToast.show(err.message, "danger");
  }
};

window.openEditProductModal = function(id) {
  const p = window.imsStore.getProductById(id);
  if (!p) return;

  const categories = window.imsStore.data.categories;

  const html = `
    <div class="modal-overlay" id="edit-product-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Edit Product: ${p.name}</h3>
          <button class="modal-close" onclick="document.getElementById('edit-product-modal').remove()">×</button>
        </div>
        <form onsubmit="window.submitEditProduct(event, '${p.id}')">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Product Name</label>
              <input type="text" id="edit-prod-name" class="form-control" style="width: 100%;" value="${p.name}" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">SKU</label>
                <input type="text" id="edit-prod-sku" class="form-control" style="width: 100%; font-family: monospace;" value="${p.sku}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <select id="edit-prod-cat" class="form-control" style="width: 100%;">
                  ${categories.map(c => `<option value="${c.id}" ${c.id === p.categoryId ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Unit of Measure (UOM)</label>
                <input type="text" id="edit-prod-uom" class="form-control" style="width: 100%;" value="${p.uom}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Reorder Warning Threshold</label>
                <input type="number" id="edit-prod-reorder" class="form-control" style="width: 100%;" value="${p.reorderLevel}" min="0" required>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('edit-product-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Update Details</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById("product-modal-container").innerHTML = html;
};

window.submitEditProduct = function(e, id) {
  e.preventDefault();
  try {
    window.imsStore.updateProduct(id, {
      name: document.getElementById("edit-prod-name").value,
      sku: document.getElementById("edit-prod-sku").value,
      categoryId: document.getElementById("edit-prod-cat").value,
      uom: document.getElementById("edit-prod-uom").value,
      reorderLevel: Number(document.getElementById("edit-prod-reorder").value)
    });

    document.getElementById("edit-product-modal")?.remove();
    window.imsToast.show("Product updated successfully!");
    window.imsRouter.handleRoute();
  } catch (err) {
    window.imsToast.show(err.message, "danger");
  }
};

window.viewStockByLocation = function(id) {
  const p = window.imsStore.getProductById(id);
  if (!p) return;

  const locEntries = Object.entries(p.stockByLocation || {});

  const html = `
    <div class="modal-overlay" id="location-breakdown-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Location Breakdown: ${p.name}</h3>
          <button class="modal-close" onclick="document.getElementById('location-breakdown-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 16px; font-size: 13px;">
            Total Company Stock: <strong style="font-size: 16px; color: var(--primary);">${p.currentStock} ${p.uom}</strong>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Stock Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${locEntries.map(([locId, qty]) => `
                <tr>
                  <td style="font-weight: 600;">${window.imsStore.getLocationName(locId)}</td>
                  <td style="font-weight: 700; color: var(--text-main);">${qty} ${p.uom}</td>
                </tr>
              `).join('')}
              ${locEntries.length === 0 ? '<tr><td colspan="2" style="text-align: center; color: var(--text-muted); padding: 16px;">No location allocations set.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('location-breakdown-modal').remove()">Close</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("product-modal-container").innerHTML = html;
};
