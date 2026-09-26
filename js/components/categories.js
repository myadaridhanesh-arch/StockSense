/**
 * Categories & Reordering Rules View Component
 */

window.renderCategories = function() {
  const store = window.imsStore;
  const categories = store.data.categories;

  return `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Categories Master</h1>
          <p class="page-subtitle">Group products into logical categories for tracking and reporting.</p>
        </div>
        <button class="btn btn-primary" onclick="window.openAddCategoryModal()">
          <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Add Category
        </button>
      </div>

      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th>Product Count</th>
            </tr>
          </thead>
          <tbody>
            ${categories.map(c => {
              const count = store.data.products.filter(p => p.categoryId === c.id).length;
              return `
                <tr>
                  <td style="font-weight: 700;">${c.name}</td>
                  <td style="color: var(--text-muted);">${c.description || 'N/A'}</td>
                  <td><span class="badge badge-draft">${count} products</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div id="category-modal-container"></div>
    </div>
  `;
};

window.renderReorderingRules = function() {
  const store = window.imsStore;
  const products = store.data.products;

  return `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Reordering Rules</h1>
          <p class="page-subtitle">Set minimum stock levels. System automatically alerts when inventory falls below thresholds.</p>
        </div>
      </div>

      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Current Stock</th>
              <th>Reorder Level (Min)</th>
              <th>Warning Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => {
              const isLow = p.currentStock <= p.reorderLevel && p.currentStock > 0;
              const isOut = p.currentStock <= 0;

              return `
                <tr>
                  <td style="font-weight: 700; font-family: monospace;">${p.sku}</td>
                  <td style="font-weight: 600;">${p.name}</td>
                  <td style="font-weight: 700;">${p.currentStock} ${p.uom}</td>
                  <td style="color: var(--text-muted); font-size: 14px;">${p.reorderLevel} ${p.uom}</td>
                  <td>
                    ${isOut ? `<span class="badge badge-outofstock">OUT OF STOCK</span>` : 
                      (isLow ? `<span class="badge badge-lowstock">LOW STOCK WARNING</span>` : `<span class="badge badge-instock">OK (Sufficient)</span>`)}
                  </td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="window.openEditProductModal('${p.id}')">
                      Edit Threshold
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

window.openAddCategoryModal = function() {
  const html = `
    <div class="modal-overlay" id="add-category-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Create Category</h3>
          <button class="modal-close" onclick="document.getElementById('add-category-modal').remove()">×</button>
        </div>
        <form onsubmit="window.submitAddCategory(event)">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Category Name *</label>
              <input type="text" id="cat-name-input" class="form-control" style="width: 100%;" required>
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea id="cat-desc-input" class="form-control" style="width: 100%; height: 80px;"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('add-category-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Category</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.getElementById("category-modal-container").innerHTML = html;
};

window.submitAddCategory = function(e) {
  e.preventDefault();
  const name = document.getElementById("cat-name-input").value;
  const desc = document.getElementById("cat-desc-input").value;

  window.imsStore.data.categories.push({
    id: "cat-" + Date.now(),
    name: name,
    description: desc
  });
  window.imsStore.saveState();
  window.imsToast.show(`Category "${name}" created!`);
  window.imsRouter.handleRoute();
};
