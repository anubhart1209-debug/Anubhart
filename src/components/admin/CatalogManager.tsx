import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ShoppingBag, 
  Sparkles, 
  DollarSign, 
  Layers 
} from 'lucide-react';

export const CatalogManager: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    toggleStock,
    deleteProduct,
    setSelectedProduct,
    setActivePortal,
    setConsumerTab
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !search.trim() || 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.medium.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalValuation = products.reduce((acc, p) => acc + p.price * (p.stockCount > 0 ? p.stockCount : 1), 0);
  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = products.filter(p => !p.inStock).length;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: Omit<Product, 'id'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-stone-100">
          <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">
            Catalog Items
          </span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">
            {products.length}
          </span>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-stone-100">
          <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider block">
            In Stock
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
            {inStockCount}
          </span>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-stone-100">
          <span className="text-[11px] text-rose-400 font-semibold uppercase tracking-wider block">
            Out of Stock
          </span>
          <span className="text-2xl font-bold font-mono text-rose-400 mt-1 block">
            {outOfStockCount}
          </span>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-stone-100">
          <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider block">
            Catalog Valuation
          </span>
          <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
            ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search catalog by title, medium..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Category dropdown */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Oil Paintings">Oil Paintings</option>
            <option value="Acrylic & Canvas">Acrylic & Canvas</option>
            <option value="Charcoal & Sketches">Charcoal & Sketches</option>
            <option value="Digital Masterpieces">Digital Masterpieces</option>
            <option value="Art Prints">Art Prints</option>
            <option value="Sculptures & Mixed">Sculptures & Mixed</option>
          </select>
        </div>

        {/* Add Product CTA */}
        <button
          id="add-art-button"
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Artwork to Catalog</span>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/80 text-[11px] uppercase tracking-wider text-stone-400 border-b border-stone-800">
              <tr>
                <th className="p-4">Artwork</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Availability (One-Click Toggle)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filteredProducts.map(product => {
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-stone-800/40 transition-colors group"
                  >
                    {/* Artwork Preview & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover border border-stone-700 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block text-xs group-hover:text-indigo-400 transition-colors">
                            {product.title}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {product.medium} • {product.dimensions}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-stone-800 text-stone-300 border border-stone-700">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4 whitespace-nowrap font-mono font-bold text-stone-100">
                      ${product.price.toFixed(2)}
                    </td>

                    {/* ONE CLICK INSTANT OUT OF STOCK TOGGLE */}
                    <td className="p-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStock(product.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                          product.inStock
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600 hover:bg-emerald-900'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-600 hover:bg-rose-900'
                        }`}
                        title="Click to toggle stock status immediately"
                      >
                        <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                        <span>{product.inStock ? 'IN STOCK' : 'OUT OF STOCK'}</span>
                        <span className="text-[10px] text-stone-400 font-normal">
                          ({product.stockCount} units)
                        </span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 whitespace-nowrap text-right space-x-1">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setActivePortal('consumer');
                          setConsumerTab('store');
                        }}
                        className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
                        title="Preview on Consumer Store"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-1.5 text-stone-400 hover:text-indigo-400 hover:bg-stone-800 rounded-lg transition-colors"
                        title="Edit Artwork Information"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${product.title}" from catalog permanently?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors"
                        title="Delete Artwork"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal for Create & Edit */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialProduct={editingProduct}
      />
    </div>
  );
};
