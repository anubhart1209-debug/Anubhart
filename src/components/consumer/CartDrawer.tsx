import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  AlertTriangle, 
  Lock, 
  ShieldCheck, 
  LogIn,
  Sparkles,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartTotal,
    cartCount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    currentUser,
    setIsGoogleSignInOpen,
    setSignInIntent,
    setIsCheckoutOpen
  } = useApp();

  if (!isCartOpen) return null;

  // Check if any product is out of stock
  const hasOutOfStockItems = cart.some(item => !item.product.inStock || item.product.stockCount <= 0);

  const handleProceedToCheckout = () => {
    if (hasOutOfStockItems) {
      alert('Please remove out of stock artwork before proceeding to checkout.');
      return;
    }

    if (!currentUser) {
      setSignInIntent('checkout');
      setIsGoogleSignInOpen(true);
      setIsCartOpen(false);
    } else {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200"
      >
        {/* Drawer Header with Luxury Bag Aesthetic */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                <span>Your Collector Bag</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.2 rounded-full font-mono">
                  {cartCount} {cartCount === 1 ? 'Artwork' : 'Artworks'}
                </span>
              </h2>
              <span className="text-[10px] text-stone-400 block">
                Insured Air Freight • Varanasi Master Studio
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100 flex items-center justify-between text-[11px] text-amber-900">
          <div className="flex items-center gap-1.5 font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Eligible for Free White-Glove Insured Delivery</span>
          </div>
          <span className="font-bold text-amber-800 font-mono">$0 Shipping</span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-20 text-center text-stone-400 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400 border border-stone-200">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-base font-bold text-stone-800">Your bag is currently empty</p>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                  Browse our original oil paintings, charcoal drawings, or configure a bespoke custom commission.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Explore Art Gallery
              </button>
            </div>
          ) : (
            <>
              {hasOutOfStockItems && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Inventory Notice:</strong> One or more artworks in your bag is out of stock. Please remove it to proceed.
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {cart.map(item => {
                  const isOOS = !item.product.inStock || item.product.stockCount <= 0;
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex gap-3 ${
                        isOOS
                          ? 'border-rose-300 bg-rose-50/40 opacity-80'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
                      }`}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-20 h-20 object-cover rounded-xl border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="text-xs font-bold text-stone-900 truncate leading-snug">
                              {item.product.title}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-stone-500 truncate">{item.product.medium}</p>

                          {/* Customization Details Badges */}
                          {item.customization && (
                            <div className="mt-1 space-y-0.5">
                              {item.customization.selectedFrame && (
                                <span className="inline-block text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded font-medium mr-1">
                                  Frame: {item.customization.selectedFrame}
                                </span>
                              )}
                              {item.customization.selectedSize && (
                                <span className="inline-block text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded font-medium mr-1">
                                  {item.customization.selectedSize}
                                </span>
                              )}
                              {item.customization.inscription && (
                                <span className="inline-block text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded italic block truncate">
                                  "{item.customization.inscription}"
                                </span>
                              )}
                            </div>
                          )}

                          {isOOS && (
                            <span className="inline-block mt-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                          <span className="text-xs font-bold text-stone-900 font-mono">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </span>

                          <div className="flex items-center gap-1.5 border border-stone-200 rounded-lg p-0.5 bg-stone-50">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-200 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-stone-800 px-1 font-mono">{item.quantity}</span>
                            <button
                              disabled={isOOS}
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-200 transition-colors disabled:opacity-30"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={clearCart}
                  className="text-[11px] text-stone-400 hover:text-rose-600 transition-colors underline"
                >
                  Clear all items from bag
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer with Razorpay Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Artwork Subtotal:</span>
                <span className="font-mono font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>White-Glove Insured Air Freight:</span>
                <span className="text-emerald-700 font-medium">Free Compliments</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="text-amber-600 font-mono text-lg">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Google Sign-in Notice if not signed in */}
            {!currentUser && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-[11px] text-blue-900">
                <LogIn className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Sign in with Google to save delivery address & track this order live.</span>
              </div>
            )}

            <button
              onClick={handleProceedToCheckout}
              disabled={hasOutOfStockItems}
              className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                hasOutOfStockItems
                  ? 'bg-stone-400 cursor-not-allowed'
                  : 'bg-[#0c2340] hover:bg-[#142850] active:scale-[0.99] shadow-[#0c2340]/20'
              }`}
            >
              <Lock className="w-4 h-4 text-[#3399cc]" />
              <span>{currentUser ? 'Proceed to Razorpay Checkout' : 'Sign in with Google to Checkout'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Razorpay Verified • Signed Certificate of Authenticity</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
