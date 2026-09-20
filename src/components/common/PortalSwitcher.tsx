import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

export const PortalSwitcher: React.FC = () => {
  const { 
    activePortal, 
    setActivePortal, 
    currentUser, 
    cartCount,
    products,
    unreadAdminNotificationsCount,
    setIsSecurityModalOpen,
    isLockdownActive
  } = useApp();

  const outOfStockCount = products.filter(p => !p.inStock || p.stockCount <= 0).length;

  return (
    <header className="bg-stone-950 text-stone-200 border-b border-stone-800 text-xs py-2 px-3 sm:px-6 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            ANUBHART STUDIO
          </span>
          <span className="text-stone-400 hidden md:inline">•</span>
          <span className="text-stone-400 text-[11px] sm:text-xs">
            Viewing: <strong className="text-white capitalize">{activePortal === 'consumer' ? 'Consumer Art Gallery & Radar' : 'Admin Console (ANUBHART STUDIO)'}</strong>
          </span>
          {currentUser && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              <UserCheck className="w-3 h-3" />
              {currentUser.email}
            </span>
          )}

          <button
            id="btn-cryptographic-shield"
            onClick={() => setIsSecurityModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold border text-[11px] transition-all cursor-pointer shadow-xs group ${
              isLockdownActive 
                ? 'bg-red-950/90 hover:bg-red-900 text-red-300 border-red-500/60 animate-pulse' 
                : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-500/40'
            }`}
            title="Open Cryptographic Security Shield & Threat Matrix"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isLockdownActive ? 'text-red-400' : 'text-emerald-400 animate-pulse'} group-hover:scale-110 transition-transform`} />
            <span className="hidden sm:inline">Vault Shield:</span>
            <span className="text-white font-bold">
              {isLockdownActive ? 'DEFCON 1 LOCKDOWN' : 'AES-256 SEALED'}
            </span>
          </button>
        </div>

        {/* Right: Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800 shadow-inner">
          <button
            id="portal-switch-consumer"
            onClick={() => setActivePortal('consumer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activePortal === 'consumer'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Consumer Gallery</span>
            {cartCount > 0 && (
              <span className="bg-white text-stone-950 px-1.5 py-0.2 text-[10px] rounded-full font-bold ml-1 font-mono">
                {cartCount}
              </span>
            )}
          </button>

          <button
            id="portal-switch-admin"
            onClick={() => setActivePortal('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activePortal === 'admin'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin: ANUBHART STUDIO</span>
            {unreadAdminNotificationsCount > 0 && (
              <span className="bg-amber-400 text-stone-950 px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ml-1 animate-pulse flex items-center gap-0.5 shadow-xs">
                <span>🔔</span>
                <span>{unreadAdminNotificationsCount} New</span>
              </span>
            )}
            {outOfStockCount > 0 && (
              <span className="bg-rose-500 text-white px-1.5 py-0.2 text-[10px] rounded-full font-bold ml-1" title={`${outOfStockCount} items out of stock`}>
                {outOfStockCount} OOS
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
