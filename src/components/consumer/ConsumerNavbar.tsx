import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Palette, 
  User as UserIcon, 
  LogOut, 
  Search, 
  Sparkles,
  Package,
  Info,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface ConsumerNavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const ConsumerNavbar: React.FC<ConsumerNavbarProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  const {
    consumerTab,
    setConsumerTab,
    cartCount,
    cartTotal,
    setIsCartOpen,
    currentUser,
    logout,
    setIsGoogleSignInOpen,
    setSignInIntent,
    orders,
    isBagBouncing,
    setIsSecurityModalOpen
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Active orders placed by this customer (or all in demo)
  const activeOrdersCount = orders.filter(o => 
    ['Placed', 'Processing', 'Shipped', 'OutForDelivery'].includes(o.orderStatus)
  ).length;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-[37px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setConsumerTab('store')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-stone-900 text-amber-300 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform font-serif font-black text-xl">
                A
              </div>
              <div>
                <span className="font-extrabold text-stone-900 tracking-tight text-xl sm:text-2xl block leading-none font-serif">
                  ANUBHART STUDIO
                </span>
                <span className="text-[10px] text-amber-700 tracking-widest uppercase font-semibold">
                  Originals & Commissions
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 bg-stone-100/80 p-1 rounded-xl border border-stone-200">
            <button
              id="nav-store-link"
              onClick={() => setConsumerTab('store')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                consumerTab === 'store'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span>Art Gallery</span>
            </button>

            <button
              id="nav-tracking-link"
              onClick={() => setConsumerTab('tracking')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                consumerTab === 'tracking'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-indigo-600" />
              <span>Track Orders</span>
              {activeOrdersCount > 0 && (
                <span className="bg-indigo-600 text-white text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              id="nav-about-link"
              onClick={() => {
                setConsumerTab('about');
                const el = document.getElementById('about-anubhart');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                consumerTab === 'about'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-stone-500" />
              <span>About Us</span>
            </button>

            {consumerTab === 'order-confirmation' && (
              <button
                id="nav-order-confirmation-link"
                onClick={() => setConsumerTab('order-confirmation')}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs flex items-center gap-1.5 animate-pulse"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Thank You / Order</span>
              </button>
            )}

            <button
              id="nav-safe-site-badge"
              onClick={() => setIsSecurityModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-300/60 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Verified Safe Site: AES-256 Encrypted & Intrusion Protected"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>AES-256 Safe Site</span>
            </button>
          </div>

          {/* Search Box (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search paintings, sketches, medium..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-stone-100 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
            />
          </div>

          {/* Right Action Area: Prominent Shopping Bag & User Profile */}
          <div className="flex items-center gap-3">
            {/* Ultra-Prominent Shopping Bag Button */}
            <button
              id="cart-trigger-button"
              onClick={() => setIsCartOpen(true)}
              className={`relative px-3.5 py-2 rounded-xl border flex items-center gap-2.5 transition-all shadow-xs ${
                isBagBouncing ? 'scale-110 ring-4 ring-amber-400/50' : 'hover:scale-102'
              } ${
                cartCount > 0
                  ? 'bg-stone-900 text-white border-amber-500/80 shadow-amber-900/10'
                  : 'bg-white text-stone-800 border-stone-300 hover:border-stone-400'
              }`}
              title="View Collector Bag"
            >
              {/* Luxury Leather Tote Bag SVG Icon */}
              <div className="relative">
                <svg className={`w-5 h-5 ${cartCount > 0 ? 'text-amber-400' : 'text-stone-700'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-stone-950 font-black text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>

              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${cartCount > 0 ? 'text-amber-300' : 'text-stone-400'}`}>
                  My Bag
                </span>
                <span className="text-xs font-mono font-bold">
                  {cartCount > 0 ? `$${cartTotal}` : 'Empty'}
                </span>
              </div>
            </button>

            {/* Google User Auth */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-stone-200 hover:border-stone-300 transition-all bg-stone-50"
                >
                  <span className="text-xs font-medium text-stone-800 hidden sm:inline truncate max-w-[110px]">
                    {currentUser.name}
                  </span>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover border border-stone-200"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-xs">
                    <div className="px-3.5 py-2.5 border-b border-stone-100">
                      <p className="font-bold text-stone-900 truncate">{currentUser.name}</p>
                      <p className="text-stone-500 truncate text-[11px]">{currentUser.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                          Google Verified
                        </span>
                        {currentUser.role === 'admin' && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                            Studio Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setConsumerTab('tracking');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-stone-50 text-stone-700 flex items-center gap-2 font-medium"
                    >
                      <Package className="w-4 h-4 text-indigo-600" />
                      <span>My Orders & Tracking</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium border-t border-stone-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="google-signin-nav-button"
                onClick={() => {
                  setSignInIntent(null);
                  setIsGoogleSignInOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 rounded-xl border border-stone-300 shadow-2xs hover:shadow-xs transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span className="hidden sm:inline">Sign in with Google</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 py-3 space-y-2">
            <div className="px-2">
              <input
                type="text"
                placeholder="Search art gallery..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-xl"
              />
            </div>

            <button
              onClick={() => {
                setConsumerTab('store');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-50 rounded-lg flex items-center gap-2"
            >
              <Palette className="w-4 h-4 text-amber-600" />
              <span>Art Gallery</span>
            </button>

            <button
              onClick={() => {
                setConsumerTab('tracking');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-50 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                <span>Track Orders</span>
              </div>
              {activeOrdersCount > 0 && (
                <span className="bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded-full font-mono font-bold">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setConsumerTab('about');
                setIsMobileMenuOpen(false);
                const el = document.getElementById('about-anubhart');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-50 rounded-lg flex items-center gap-2"
            >
              <Info className="w-4 h-4 text-stone-500" />
              <span>About ANUBHART STUDIO</span>
            </button>

            <button
              onClick={() => {
                setIsSecurityModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg flex items-center gap-2 border border-emerald-200"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>AES-256 Cryptographic Shield (Safe Site)</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
