/**
 * Sidebar Navigation Component
 */

window.renderSidebar = function() {
  const currentRoute = window.imsRouter.currentRoute || "dashboard";

  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="brand-badge">IMS</span>
        <span class="brand-title">Inventory Hub</span>
      </div>
      <nav class="sidebar-nav">
        
        <div class="nav-section-label">MAIN</div>
        <a href="#dashboard" class="nav-item ${currentRoute === 'dashboard' ? 'active' : ''}">
          <i data-lucide="layout-dashboard"></i>
          <span>Dashboard</span>
        </a>

        <div class="nav-section-label">PRODUCTS</div>
        <a href="#products" class="nav-item ${currentRoute === 'products' ? 'active' : ''}">
          <i data-lucide="box"></i>
          <span>Products</span>
        </a>
        <div class="sub-nav">
          <a href="#categories" class="nav-item ${currentRoute === 'categories' ? 'active' : ''}">
            <i data-lucide="tags"></i>
            <span>Categories</span>
          </a>
          <a href="#reordering" class="nav-item ${currentRoute === 'reordering' ? 'active' : ''}">
            <i data-lucide="alert-triangle"></i>
            <span>Reordering Rules</span>
          </a>
        </div>

        <div class="nav-section-label">OPERATIONS</div>
        <a href="#receipts" class="nav-item ${currentRoute === 'receipts' ? 'active' : ''}">
          <i data-lucide="arrow-down-left"></i>
          <span>Receipts</span>
        </a>
        <a href="#deliveries" class="nav-item ${currentRoute === 'deliveries' ? 'active' : ''}">
          <i data-lucide="arrow-up-right"></i>
          <span>Delivery Orders</span>
        </a>
        <a href="#transfers" class="nav-item ${currentRoute === 'transfers' ? 'active' : ''}">
          <i data-lucide="arrow-left-right"></i>
          <span>Internal Transfers</span>
        </a>
        <a href="#adjustments" class="nav-item ${currentRoute === 'adjustments' ? 'active' : ''}">
          <i data-lucide="sliders"></i>
          <span>Inventory Adjustments</span>
        </a>
        <a href="#ledger" class="nav-item ${currentRoute === 'ledger' ? 'active' : ''}">
          <i data-lucide="history"></i>
          <span>Move History (Ledger)</span>
        </a>

        <div class="nav-section-label">SETTINGS</div>
        <a href="#warehouses" class="nav-item ${currentRoute === 'warehouses' ? 'active' : ''}">
          <i data-lucide="warehouse"></i>
          <span>Warehouses</span>
        </a>

        <div class="nav-section-label">USER</div>
        <a href="#profile" class="nav-item ${currentRoute === 'profile' ? 'active' : ''}">
          <i data-lucide="user"></i>
          <span>My Profile</span>
        </a>
        <a href="javascript:void(0)" onclick="window.imsStore.logout(); window.imsRouter.navigate('login');" class="nav-item" style="color: #f87171;">
          <i data-lucide="log-out"></i>
          <span>Logout</span>
        </a>

      </nav>
    </aside>
  `;
};
