import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Boxes, 
  AlertTriangle,
  Package,
  Layers,
  CheckCircle,
  X
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { SearchBar } from '../components/SearchBar';
import { StockBadge } from '../components/StockBadge';
import { ModalWrapper } from '../components/ModalWrapper';
import { ProductDetailModal } from './ProductDetailModal';

export const ProductsScreen = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    categories, 
    uoms, 
    warehouses 
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All'); // 'All' | 'LowStock' | 'OutOfStock'

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: categories[0] || 'Electronics',
    uom: uoms[0] || 'Pieces (pcs)',
    stock: 50,
    reorderLevel: 20,
    unitPrice: 25.00,
    warehouse: 'WH-1',
    defaultLocation: 'LOC-A1-01',
    description: ''
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      sku: `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
      category: categories[0] || 'Electronics',
      uom: uoms[0] || 'Pieces (pcs)',
      stock: 50,
      reorderLevel: 20,
      unitPrice: 45.00,
      warehouse: 'WH-1',
      defaultLocation: 'LOC-A1-01',
      description: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      uom: product.uom,
      stock: product.stock,
      reorderLevel: product.reorderLevel,
      unitPrice: product.unitPrice || 10,
      warehouse: product.warehouse || 'WH-1',
      defaultLocation: product.defaultLocation || 'LOC-A1-01',
      description: product.description || ''
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const success = addProduct(formData);
    if (success) setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProduct(editingProduct.id, formData);
    setEditingProduct(null);
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    
    let matchesStock = true;
    if (stockFilter === 'LowStock') matchesStock = p.stock > 0 && p.stock <= p.reorderLevel;
    if (stockFilter === 'OutOfStock') matchesStock = p.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      
      {/* Screen Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Boxes className="w-6 h-6 text-sky-400" />
            <span>Product Inventory Catalog</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage product items, SKUs, reorder points, and location bin tracking.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-sky-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* Search Bar & Category Filter Pills */}
      <div className="space-y-3">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Search product name or SKU..." 
        />

        {/* Category Pills Slider */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'All'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
            }`}
          >
            All Categories ({products.length})
          </button>

          {categories.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  isSel
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Quick Stock Status Filter Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Status Filter:</span>
          <button
            onClick={() => setStockFilter('All')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              stockFilter === 'All' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStockFilter('LowStock')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              stockFilter === 'LowStock' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            Low Stock Only
          </button>
          <button
            onClick={() => setStockFilter('OutOfStock')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              stockFilter === 'OutOfStock' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            Out of Stock Only
          </button>
        </div>
      </div>

      {/* Products Grid / Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div 
            key={product.id}
            className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg hover:border-slate-600 transition flex flex-col justify-between group"
          >
            <div>
              {/* Card Header: SKU & Status */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {product.sku}
                </span>
                <StockBadge stock={product.stock} reorderLevel={product.reorderLevel} />
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-slate-100 text-sm sm:text-base line-clamp-1">{product.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description || 'No description provided.'}</p>
            </div>

            {/* Key Metrics & Location */}
            <div className="mt-4 pt-3 border-t border-slate-700/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Stock:</span>
                <span className="font-extrabold text-white text-base">
                  {product.stock} <span className="text-xs font-normal text-slate-400">{product.uom}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Reorder Level:</span>
                <span className="font-bold text-amber-400">{product.reorderLevel} {product.uom}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Default Bin: <strong className="text-slate-200">{product.defaultLocation}</strong></span>
                <span>Wh: <strong className="text-sky-400">{product.warehouse}</strong></span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => setViewingProduct(product)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-slate-700/80 hover:bg-slate-700 text-slate-200 py-1.5 rounded-xl text-xs font-semibold transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Details</span>
                </button>
                <button
                  onClick={() => handleOpenEditModal(product)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 py-1.5 rounded-xl text-xs font-semibold transition border border-sky-500/30"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete product "${product.name}"?`)) {
                      deleteProduct(product.id);
                    }
                  }}
                  className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition border border-rose-500/30"
                  title="Delete product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-800/40 rounded-2xl border border-slate-700/50">
            <Package className="w-12 h-12 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No products match your filter criteria.</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing search terms or adding a new product.</p>
          </div>
        )}
      </div>

      {/* ADD PRODUCT MODAL */}
      <ModalWrapper
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Inventory Product"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. 4K Industrial Monitor"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">SKU Code *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="SKU-1001"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-sky-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Unit of Measure</label>
              <select
                value={formData.uom}
                onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                {uoms.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Initial Stock Quantity</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Reorder Threshold</label>
              <input
                type="number"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Warehouse</label>
              <select
                value={formData.warehouse}
                onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.code} - {w.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Default Bin Location</label>
              <input
                type="text"
                value={formData.defaultLocation}
                onChange={(e) => setFormData({ ...formData, defaultLocation: e.target.value })}
                placeholder="LOC-A1-01"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Technical specs, supplier notes..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 rounded-xl text-xs transition"
          >
            Save Product to Catalog
          </button>
        </form>
      </ModalWrapper>

      {/* EDIT PRODUCT MODAL */}
      <ModalWrapper
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title={`Edit Product: ${editingProduct?.sku}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Reorder Level</label>
              <input
                type="number"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 rounded-xl text-xs transition"
          >
            Update Changes
          </button>
        </form>
      </ModalWrapper>

      {/* VIEW PRODUCT DETAIL MODAL */}
      <ProductDetailModal
        product={viewingProduct}
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
      />

    </div>
  );
};
