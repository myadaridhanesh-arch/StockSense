/**
 * Main Application Controller & View Orchestrator
 */

document.addEventListener("DOMContentLoaded", () => {
  const router = window.imsRouter;
  const store = window.imsStore;

  function renderView(routeHandler) {
    const root = document.getElementById("app-root");
    const user = store.getCurrentUser();

    // If user is not logged in, render unauthenticated screen directly
    if (!user && ["login", "signup", "forgot-password", "otp-reset"].includes(router.currentRoute)) {
      root.innerHTML = window.renderAuth(router.currentRoute);
      return;
    }

    // Authenticated layout
    root.innerHTML = `
      ${window.renderSidebar()}
      <div class="main-wrapper">
        ${window.renderHeader()}
        <main class="content-container">
          ${routeHandler()}
        </main>
      </div>
    `;

    // Re-initialize Lucide Icons after DOM update
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Register SPA Routes
  router.addRoute("login", () => renderView(() => window.renderAuth("login")));
  router.addRoute("signup", () => renderView(() => window.renderAuth("signup")));
  router.addRoute("forgot-password", () => renderView(() => window.renderAuth("forgot-password")));
  router.addRoute("otp-reset", () => renderView(() => window.renderAuth("otp-reset")));

  router.addRoute("dashboard", () => renderView(window.renderDashboard));
  router.addRoute("products", () => renderView(window.renderProducts));
  router.addRoute("categories", () => renderView(window.renderCategories));
  router.addRoute("reordering", () => renderView(window.renderReorderingRules));
  router.addRoute("receipts", () => renderView(window.renderReceipts));
  router.addRoute("deliveries", () => renderView(window.renderDeliveries));
  router.addRoute("transfers", () => renderView(window.renderTransfers));
  router.addRoute("adjustments", () => renderView(window.renderAdjustments));
  router.addRoute("warehouses", () => renderView(window.renderWarehouses));
  router.addRoute("ledger", () => renderView(window.renderLedger));
  router.addRoute("profile", () => renderView(window.renderProfile));

  // Initialize router
  router.init();
});
