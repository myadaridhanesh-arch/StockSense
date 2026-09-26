/**
 * Move History / Stock Ledger View Component
 */

window.renderLedger = function() {
  const store = window.imsStore;
  const ledger = store.data.ledger;

  return `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Move History (Stock Ledger)</h1>
          <p class="page-subtitle">Immutable audit log of all completed stock receipts, deliveries, internal transfers, and adjustments.</p>
        </div>
        <button class="btn btn-secondary" onclick="window.exportLedgerCSV()">
          <i data-lucide="download" style="width: 14px; height: 14px;"></i> Export CSV
        </button>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="filter-group" style="flex: 1; min-width: 200px;">
          <input type="text" id="ledger-search-input" class="form-control" style="width: 100%;" placeholder="Search by Product, SKU, Reference..." oninput="window.filterLedgerTable()">
        </div>

        <div class="filter-group">
          <label class="filter-label">Operation:</label>
          <select id="ledger-op-filter" class="form-control" onchange="window.filterLedgerTable()">
            <option value="">All Operations</option>
            <option value="Receipt">Receipt</option>
            <option value="Delivery">Delivery</option>
            <option value="Internal Transfer">Internal Transfer</option>
            <option value="Adjustment">Adjustment</option>
          </select>
        </div>
      </div>

      <div class="table-card">
        <table class="data-table" id="ledger-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Operation</th>
              <th>Reference</th>
              <th>Product & SKU</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Quantity</th>
              <th>Stock Before</th>
              <th>Stock After</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody id="ledger-table-body">
            ${renderLedgerRows(ledger)}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

function renderLedgerRows(entries) {
  if (entries.length === 0) {
    return `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 24px;">No ledger entries found matching criteria.</td></tr>`;
  }

  return entries.map(e => `
    <tr>
      <td style="font-size: 12.5px; color: var(--text-muted); text-wrap: nowrap;">${e.timestamp}</td>
      <td><span class="badge ${getLedgerBadgeClass(e.operation)}">${e.operation}</span></td>
      <td style="font-family: monospace; font-weight: 600;">${e.reference || '-'}</td>
      <td style="font-weight: 600;">
        ${e.productName} 
        <span style="font-weight: 400; color: var(--text-muted); font-size: 12px;">(${e.sku})</span>
      </td>
      <td>${e.source || 'N/A'}</td>
      <td>${e.destination || 'N/A'}</td>
      <td style="font-weight: 700; ${e.quantity > 0 ? 'color: var(--success);' : (e.quantity < 0 ? 'color: var(--danger);' : '')}">
        ${e.quantity > 0 ? '+' : ''}${e.quantity}
      </td>
      <td style="color: var(--text-muted);">${e.stockBefore !== undefined ? e.stockBefore : '-'}</td>
      <td style="font-weight: 700; color: var(--text-main);">${e.stockAfter !== undefined ? e.stockAfter : '-'}</td>
      <td style="font-size: 12.5px;">${e.user || 'System'}</td>
    </tr>
  `).join('');
}

function getLedgerBadgeClass(op) {
  if (op === 'Receipt') return 'badge-done';
  if (op === 'Delivery') return 'badge-waiting';
  if (op === 'Internal Transfer') return 'badge-pick';
  if (op === 'Adjustment') return 'badge-lowstock';
  return 'badge-draft';
}

window.filterLedgerTable = function() {
  const search = document.getElementById("ledger-search-input")?.value.toLowerCase() || "";
  const op = document.getElementById("ledger-op-filter")?.value || "";

  let list = window.imsStore.data.ledger;
  if (search) {
    list = list.filter(e => 
      e.productName.toLowerCase().includes(search) ||
      e.sku.toLowerCase().includes(search) ||
      (e.reference && e.reference.toLowerCase().includes(search))
    );
  }
  if (op) {
    list = list.filter(e => e.operation === op);
  }

  const tbody = document.getElementById("ledger-table-body");
  if (tbody) {
    tbody.innerHTML = renderLedgerRows(list);
  }
};

window.exportLedgerCSV = function() {
  const entries = window.imsStore.data.ledger;
  if (entries.length === 0) {
    window.imsToast.show("No ledger entries to export.", "warning");
    return;
  }

  let csv = "Date,Operation,Reference,Product,SKU,Source,Destination,Quantity,Stock Before,Stock After,User\n";
  entries.forEach(e => {
    csv += `"${e.timestamp}","${e.operation}","${e.reference}","${e.productName}","${e.sku}","${e.source}","${e.destination}",${e.quantity},${e.stockBefore},${e.stockAfter},"${e.user}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", `IMS_Stock_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
  a.click();
  window.imsToast.show("Move History CSV downloaded!");
};
