# StockSense – Inventory Management System

StockSense is a modular Inventory Management System designed to replace manual stock registers, spreadsheets, and scattered inventory tracking with a centralized system for managing products, stock movements, warehouses, and inventory history.

## 🚀 Project Overview

StockSense helps inventory managers and warehouse staff manage:

- Products and SKUs
- Stock availability by location
- Incoming stock / Receipts
- Outgoing stock / Delivery Orders
- Internal stock transfers
- Physical stock adjustments
- Stock movement history / ledger
- Reorder levels and low-stock monitoring
- Multi-location inventory

## 🛠️ Technology Stack

- **Frontend:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Supporting Server:** Python `http.server`
- **Testing:** Python demo scenario

## 📁 Project Structure

```text
StockSense/
├── src/
├── public/
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── server.py
└── test_demo_scenario.py
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
cd <PROJECT-FOLDER>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The Vite configuration uses port **3000**.

Open:

```text
http://localhost:3000
```
https://localhost:3000/#dashboard
## 🧪 Inventory Demo Flow

The project includes a Python validation script for the core inventory flow.

Run:

```bash
python test_demo_scenario.py
```

The demonstrated flow is:

1. Login and open the dashboard.
2. Create a **Steel Rod** product.
3. Set initial stock to **0 KG**.
4. Receive **100 KG**.
5. Dashboard shows **100 KG** total stock.
6. Transfer **30 KG** from Main Store to Production Floor.
7. Main Store = **70 KG**, Production Floor = **30 KG**.
8. Deliver **20 KG** from Main Store.
9. Total stock = **80 KG**.
10. Adjust damaged stock by **3 KG**.
11. Main Store = **47 KG**.
12. Final total stock = **77 KG**.
13. Move History records the Receipt, Internal Transfer, Delivery, and Adjustment.

The validation script checks the stock calculations and ledger records.

## 📦 Core Inventory Operations

### Receipt

Receiving stock increases stock at the selected destination location.

```text
Current Stock + Received Quantity = New Stock
```

Example:

```text
0 KG + 100 KG = 100 KG
```

### Internal Transfer

An internal transfer moves stock between locations without changing total company stock.

```text
Source Location - Quantity
Destination Location + Quantity
```

Example:

```text
Main Store: 100 → 70 KG
Production Floor: 0 → 30 KG
Total: 100 KG
```

### Delivery

A validated delivery decreases stock from the selected source location.

```text
Current Stock - Delivered Quantity = New Stock
```

Example:

```text
100 KG - 20 KG = 80 KG
```

### Inventory Adjustment

An adjustment updates recorded stock to match the physical count.

Example:

```text
System Stock: 50 KG
Physical Count: 47 KG
Difference: -3 KG
```

Final total:

```text
80 KG - 3 KG = 77 KG
```

## 📊 Stock Ledger

Stock movements are recorded in a ledger for traceability.

The demonstrated ledger contains:

- Receipt
- Internal Transfer
- Delivery
- Adjustment

Ledger information includes:

- Operation type
- Reference
- Product
- Quantity
- Stock before
- Stock after

## 🔎 Product Information

Product inventory information includes:

- Product Name
- SKU / Code
- Category
- Unit of Measure
- Initial Stock
- Current Stock
- Reorder Level
- Stock by Location

## 🏭 Locations and Warehouses

Stock can be tracked separately by location, such as:

```text
Main Store
Production Floor
```

This allows the system to show both total stock and location-wise stock.

## 📈 Dashboard

The target dashboard includes important inventory KPIs:

- Total Products in Stock
- Low Stock / Out of Stock Items
- Pending Receipts
- Pending Deliveries
- Scheduled Internal Transfers

Filtering can be provided by:

- Document Type
- Status
- Warehouse / Location
- Product Category

## 🔄 Inventory Workflow

```text
Supplier
   ↓
Receipt
   ↓
Stock In
   ↓
Warehouse / Location
   ↓
Internal Transfer
   ↓
Production / Other Location
   ↓
Delivery
   ↓
Stock Out
```

Physical counting:

```text
Physical Count
      ↓
Inventory Adjustment
      ↓
Updated Stock
      ↓
Ledger Entry
```

## 🎯 Project Goal

The goal of StockSense is to provide a centralized inventory workflow where stock changes are visible, traceable, and organized instead of being maintained through manual registers or separate spreadsheets.

## 🧑‍💻 Development Commands

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Run the inventory validation:

```bash
python test_demo_scenario.py
```

## ⚠️ Implementation Note

The current project files demonstrate the React/Vite frontend setup and the Python inventory-flow validation.

For a complete production-ready IMS, the following should be connected to a persistent backend/database:

- User signup/login
- OTP password reset
- User roles and permissions
- Product records
- Warehouse/location records
- Receipts
- Deliveries
- Internal transfers
- Adjustments
- Stock ledger
- Dashboard KPIs
- Search and filters

## 📄 License

This project is developed as a hackathon/academic Inventory Management System project.
