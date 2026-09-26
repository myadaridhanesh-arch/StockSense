/**
 * My Profile View Component
 */

window.renderProfile = function() {
  const user = window.imsStore.getCurrentUser();
  const warehouses = window.imsStore.data.warehouses;

  return `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">My Profile</h1>
          <p class="page-subtitle">User preferences and staff credentials.</p>
        </div>
      </div>

      <div style="max-width: 580px; background: var(--bg-card); border: 1px solid var(--border-main); border-radius: 8px; padding: 24px;">
        <form onsubmit="window.submitProfileUpdate(event)">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="prof-name" class="form-control" style="width: 100%;" value="${user?.name || ''}" required>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="prof-email" class="form-control" style="width: 100%;" value="${user?.email || ''}" required>
          </div>

          <div class="form-group">
            <label class="form-label">Role</label>
            <input type="text" class="form-control" style="width: 100%; background: #f1f5f9;" value="${user?.role || 'Inventory Staff'}" readonly>
          </div>

          <div class="form-group">
            <label class="form-label">Assigned Primary Warehouse</label>
            <select id="prof-warehouse" class="form-control" style="width: 100%;">
              ${warehouses.map(w => `<option value="${w.id}" ${user?.warehouse === w.id ? 'selected' : ''}>${w.name}</option>`).join('')}
            </select>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: 12px;">Save Profile Changes</button>
        </form>
      </div>
    </div>
  `;
};

window.submitProfileUpdate = function(e) {
  e.preventDefault();
  const user = window.imsStore.getCurrentUser();
  if (user) {
    user.name = document.getElementById("prof-name").value;
    user.email = document.getElementById("prof-email").value;
    user.warehouse = document.getElementById("prof-warehouse").value;
    window.imsStore.saveState();
    window.imsToast.show("Profile updated successfully!");
    window.imsRouter.handleRoute();
  }
};
