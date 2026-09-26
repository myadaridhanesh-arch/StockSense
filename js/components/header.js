/**
 * Top Header Component
 */

window.renderHeader = function() {
  const user = window.imsStore.getCurrentUser();
  const warehouses = window.imsStore.data.warehouses;

  return `
    <header class="top-header">
      <div class="header-search">
        <i data-lucide="search" style="color: var(--text-muted); width: 16px; height: 16px;"></i>
        <input type="text" id="global-search-input" placeholder="Search product, SKU, operation..." onkeyup="if(event.key==='Enter') window.handleGlobalSearch(this.value)">
      </div>

      <div class="header-actions">
        <div class="warehouse-selector">
          <select id="header-warehouse-select" onchange="window.handleWarehouseChange(this.value)">
            <option value="all">All Warehouses</option>
            ${warehouses.map(w => `<option value="${w.id}" ${user?.warehouse === w.id ? 'selected' : ''}>${w.name}</option>`).join('')}
          </select>
        </div>

        <button class="btn btn-secondary btn-sm" onclick="if(confirm('Reset system to benchmark clean demo state?')) { window.imsStore.resetDemoData(); window.imsToast.show('Data reset to demo state'); window.location.reload(); }">
          <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Reset Demo
        </button>

        <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700;">
            ${user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <span>${user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  `;
};

window.handleWarehouseChange = function(whId) {
  const user = window.imsStore.getCurrentUser();
  if (user) {
    user.warehouse = whId;
    window.imsStore.saveState();
    window.imsRouter.handleRoute();
  }
};

window.handleGlobalSearch = function(query) {
  if (!query) return;
  window.imsRouter.navigate("products");
  setTimeout(() => {
    const input = document.getElementById("product-search-input");
    if (input) {
      input.value = query;
      input.dispatchEvent(new Event("input"));
    }
  }, 100);
};
