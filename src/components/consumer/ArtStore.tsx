import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product } from '../../types';
import { 
  ShoppingBag, 
  Sparkles, 
  Eye, 
  Check, 
  SlidersHorizontal, 
  ShieldCheck, 
  ArrowUpRight, 
  Layers, 
  Star,
  Sliders,
  Ruler
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ArtStoreProps {
  searchQuery: string;
}

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Oil Paintings',
  'Acrylic & Canvas',
  'Charcoal & Sketches',
  'Digital Masterpieces',
  'Art Prints',
  'Sculptures & Mixed'
];

export const ArtStore: React.FC<ArtStoreProps> = ({ searchQuery }) => {
  const { 
    products, 
    addToCart, 
    setSelectedProduct, 
    setCustomizingProduct,
    setConsumerTab,
    studioProfile
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock'>('all');
  const [customizableOnly, setCustomizableOnly] = useState(false);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch = !searchQuery.trim() || 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.medium.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStock = stockFilter === 'all' || (p.inStock && p.stockCount > 0);
        const matchesCustom = !customizableOnly || p.isCustomizable;
        return matchesCat && matchesSearch && matchesStock && matchesCustom;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, stockFilter, customizableOnly, sortBy]);

  const featuredPiece = products.find(p => p.featured && p.inStock) || products[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Dynamic Atelier Announcement & Status Bar */}
      {studioProfile?.announcementBanner && (
        <div className="bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 border border-amber-500/30 rounded-2xl px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-200 shadow-sm">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="font-medium text-stone-200">
              {studioProfile.announcementBanner}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40">
              {studioProfile.commissionStatus || 'Commissions Open'}
            </span>
            <a
              href="#about-anubhart"
              className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 transition-colors"
            >
              Meet {studioProfile.artistName} →
            </a>
          </div>
        </div>
      )}

      {/* Hero Exhibition Banner */}
      {featuredPiece && (
        <section className="relative rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-stone-800">
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-transparent z-10" />
          <img
            src={featuredPiece.image}
            alt={featuredPiece.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50 filter saturate-125"
          />

          <div className="relative z-20 max-w-2xl p-6 sm:p-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold backdrop-blur-md border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Anubhart Curated Masterwork</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-serif">
              {featuredPiece.title}
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm line-clamp-2 leading-relaxed font-light">
              {featuredPiece.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">
                ${featuredPiece.price.toFixed(2)}
              </div>
              <button
                onClick={() => setSelectedProduct(featuredPiece)}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>View Masterpiece Details</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {featuredPiece.isCustomizable && (
                <button
                  onClick={() => setCustomizingProduct(featuredPiece)}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-md transition-all border border-white/20 flex items-center gap-1.5"
                >
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Customize Framing & Dimensions</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Filter and Control Bar */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Subcontrols: In-stock toggle, Customizable toggle & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-b border-stone-200 pb-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-stone-500 font-medium">
              Showing <strong>{filteredProducts.length}</strong> original works
            </span>

            <button
              onClick={() => setStockFilter(stockFilter === 'all' ? 'in-stock' : 'all')}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
                stockFilter === 'in-stock'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
              }`}
            >
              {stockFilter === 'in-stock' ? '✓ In Stock Only' : 'Include Out of Stock'}
            </button>

            <button
              onClick={() => setCustomizableOnly(!customizableOnly)}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                customizableOnly
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
              }`}
            >
              <Sliders className="w-3 h-3 text-amber-600" />
              <span>{customizableOnly ? '✓ Customizable Only' : 'Customizable Options'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-800 focus:outline-none"
            >
              <option value="featured">Curator's Choice</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Artwork Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-stone-50 rounded-3xl border border-stone-200 p-8 space-y-3">
          <Layers className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No artworks match your criteria</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the active filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setStockFilter('all');
              setCustomizableOnly(false);
            }}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProducts.map(product => {
              const isOOS = !product.inStock || product.stockCount <= 0;

              return (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className={`group bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                    isOOS ? 'border-stone-200 opacity-90' : 'border-stone-200 hover:border-amber-400'
                  }`}
                >
                  {/* Visual Frame */}
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        isOOS ? 'grayscale-[30%]' : ''
                      }`}
                    />

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      {isOOS ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white shadow-md">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600/90 text-white backdrop-blur-xs shadow-xs">
                          In Stock ({product.stockCount})
                        </span>
                      )}

                      {product.isCustomizable && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 shadow-xs flex items-center gap-1">
                          <Sliders className="w-2.5 h-2.5" />
                          <span>Customizable</span>
                        </span>
                      )}
                    </div>

                    {/* Category pill */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-950/70 text-stone-200 backdrop-blur-xs">
                        {product.category}
                      </span>
                    </div>

                    {/* Quick View overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="px-3.5 py-2 bg-white/95 hover:bg-white text-stone-900 text-xs font-bold rounded-xl shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-transform hover:scale-105"
                      >
                        <Eye className="w-4 h-4" /> Quick View
                      </button>

                      {product.isCustomizable && (
                        <button
                          onClick={() => setCustomizingProduct(product)}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-transform hover:scale-105"
                        >
                          <Sliders className="w-4 h-4" /> Customize
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Artwork Meta */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 
                          onClick={() => setSelectedProduct(product)}
                          className="font-bold text-sm text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1 cursor-pointer font-serif"
                        >
                          {product.title}
                        </h3>
                      </div>

                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                        {product.medium} • {product.dimensions}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center text-amber-500 text-[11px] font-bold">
                          <Star className="w-3 h-3 fill-amber-400 mr-1" />
                          <span>{product.rating}</span>
                        </div>
                        <span className="text-[10px] text-stone-400">({product.reviewsCount} reviews)</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium ml-auto">
                          Physical Cert.
                        </span>
                      </div>
                    </div>

                    {/* Footer with Price, Customizer Trigger and Add to Bag */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase tracking-wider">Studio Price</div>
                        <div className="text-base font-bold text-stone-950 font-mono">
                          ${product.price.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {product.isCustomizable && (
                          <button
                            type="button"
                            onClick={() => setCustomizingProduct(product)}
                            className="p-2 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                            title="Customize Frame & Dimensions"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          disabled={isOOS}
                          onClick={(e) => addToCart(product, 1, undefined, e)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isOOS
                              ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                              : 'bg-stone-900 hover:bg-amber-600 text-white shadow-xs hover:shadow-md active:scale-95'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{isOOS ? 'Out of Stock' : 'Add to Bag'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
