import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Maximize2, 
  Share2, 
  Clock, 
  AlertCircle,
  Sliders,
  Ruler
} from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    setCustomizingProduct,
    setIsCartOpen,
    currentUser,
    setIsGoogleSignInOpen,
    setSignInIntent,
    setIsCheckoutOpen
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedProduct) return null;

  const allImages = [
    selectedProduct.image,
    ...(selectedProduct.additionalImages || [])
  ];

  const handleInstantBuy = () => {
    if (!selectedProduct.inStock || selectedProduct.stockCount <= 0) return;
    addToCart(selectedProduct, 1);
    if (!currentUser) {
      setSignInIntent('checkout');
      setIsGoogleSignInOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const isAvailable = selectedProduct.inStock && selectedProduct.stockCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-stone-200 my-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Visual Column */}
          <div className="bg-stone-950 p-4 sm:p-6 flex flex-col justify-between relative">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isAvailable 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-rose-600 text-white shadow-lg'
              }`}>
                {isAvailable ? `In Stock (${selectedProduct.stockCount})` : 'Out of Stock'}
              </span>

              {selectedProduct.isCustomizable && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 flex items-center gap-1 shadow-md">
                  <Sliders className="w-3 h-3" />
                  <span>Customizable</span>
                </span>
              )}
            </div>

            <div className="aspect-square rounded-2xl overflow-hidden bg-stone-900 flex items-center justify-center my-auto relative group">
              <img
                src={allImages[activeImageIndex] || selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Thumbnail switcher */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 pt-4 overflow-x-auto justify-center">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-amber-400 scale-105' : 'border-stone-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Top bar */}
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  {selectedProduct.category}
                </span>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Title & Ratings */}
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight font-serif">
                {selectedProduct.title}
              </h1>

              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{selectedProduct.rating}</span>
                </div>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-500">
                  {selectedProduct.reviewsCount} verified art collectors
                </span>
              </div>

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-stone-950 font-mono">
                  ${selectedProduct.price.toFixed(2)}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-stone-400 line-through font-mono">
                    ${selectedProduct.originalPrice.toFixed(2)}
                  </span>
                )}
                {selectedProduct.originalPrice && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Save ${(selectedProduct.originalPrice - selectedProduct.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Specs Bento */}
              <div className="grid grid-cols-2 gap-2.5 mt-5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Medium</span>
                  <span className="font-semibold text-stone-800">{selectedProduct.medium}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Base Dimensions</span>
                  <span className="font-semibold text-stone-800">{selectedProduct.dimensions}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Creation Year</span>
                  <span className="font-semibold text-stone-800">{selectedProduct.year}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Authenticity</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Certificate Signed
                  </span>
                </div>
              </div>

              {/* In stock note or alert */}
              {!isAvailable && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    This artwork is currently <strong>Out of Stock</strong> in the studio.
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-stone-100 mt-6 space-y-2">
              {/* Customizer CTA if customizable */}
              {selectedProduct.isCustomizable && (
                <button
                  type="button"
                  onClick={() => {
                    const prod = selectedProduct;
                    setSelectedProduct(null);
                    setCustomizingProduct(prod);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center gap-2 transition-all mb-2"
                >
                  <Sliders className="w-4 h-4 text-amber-700" />
                  <span>Configure Framing, Size & Inscription</span>
                </button>
              )}

              <div className="flex gap-2">
                <button
                  disabled={!isAvailable}
                  onClick={(e) => addToCart(selectedProduct, 1, undefined, e)}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    isAvailable
                      ? 'bg-stone-900 hover:bg-stone-800 text-white shadow-md active:scale-98'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAvailable ? 'Add to Collector Bag' : 'Out of Stock'}</span>
                </button>

                <button
                  disabled={!isAvailable}
                  onClick={handleInstantBuy}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    isAvailable
                      ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-extrabold shadow-md active:scale-98'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Instant Checkout</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-400 text-center pt-1">
                Dispatched in reinforced custom crate • Free Insured Delivery
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
