import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PortalSwitcher } from './components/common/PortalSwitcher';
import { ToastContainer } from './components/common/ToastContainer';
import { ConsumerNavbar } from './components/consumer/ConsumerNavbar';
import { ArtStore } from './components/consumer/ArtStore';
import { OrderTrackingDashboard } from './components/consumer/OrderTrackingDashboard';
import { ThankYouOrderPage } from './components/consumer/ThankYouOrderPage';
import { AboutBlackSection } from './components/consumer/AboutBlackSection';
import { ProductDetailModal } from './components/consumer/ProductDetailModal';
import { ArtworkCustomizerModal } from './components/consumer/ArtworkCustomizerModal';
import { FlyingBagDropAnimation } from './components/consumer/FlyingBagDropAnimation';
import { CartDrawer } from './components/consumer/CartDrawer';
import { RazorpayCheckoutModal } from './components/consumer/RazorpayCheckoutModal';
import { GoogleSignInModal } from './components/consumer/GoogleSignInModal';
import { SecurityDefenseModal } from './components/common/SecurityDefenseModal';

import { AdminLoginGate } from './components/admin/AdminLoginGate';
import { AdminNavbar } from './components/admin/AdminNavbar';
import { CatalogManager } from './components/admin/CatalogManager';
import { OrdersManager } from './components/admin/OrdersManager';
import { AdminStudioEditor } from './components/admin/AdminStudioEditor';
import { AdminSettings } from './components/admin/AdminSettings';

import { Palette, ShieldCheck, Heart, Sparkles, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MainLayout: React.FC = () => {
  const { 
    activePortal, 
    consumerTab, 
    adminTab,
    setConsumerTab,
    setActivePortal,
    isSecurityModalOpen,
    setIsSecurityModalOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Universal Top Switcher for dual websites */}
      <PortalSwitcher />

      {activePortal === 'consumer' ? (
        /* CONSUMER APPLICATION */
        <div className="flex-1 flex flex-col bg-stone-50">
          <ConsumerNavbar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <AnimatePresence mode="wait">
              {consumerTab === 'store' && (
                <motion.div
                  key="consumer-store"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArtStore searchQuery={searchQuery} />
                </motion.div>
              )}

              {consumerTab === 'tracking' && (
                <motion.div
                  key="consumer-tracking"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <OrderTrackingDashboard />
                </motion.div>
              )}

              {consumerTab === 'order-confirmation' && (
                <motion.div
                  key="consumer-order-confirmation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ThankYouOrderPage />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Consumer Modals & Animation Overlays */}
          <FlyingBagDropAnimation />
          <ProductDetailModal />
          <ArtworkCustomizerModal />
          <CartDrawer />
          <RazorpayCheckoutModal />

          {/* Dedicated Black "About Us" Page At the Last of the Website */}
          <AboutBlackSection />
        </div>
      ) : (
        /* ADMIN WORKSTATION APPLICATION */
        <div className="flex-1 flex flex-col bg-stone-950 text-stone-100">
          <AdminLoginGate>
            <AdminNavbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <AnimatePresence mode="wait">
                {adminTab === 'catalog' && (
                  <motion.div
                    key="admin-catalog"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CatalogManager />
                  </motion.div>
                )}

                {adminTab === 'orders' && (
                  <motion.div
                    key="admin-orders"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <OrdersManager />
                  </motion.div>
                )}

                {adminTab === 'profile' && (
                  <motion.div
                    key="admin-profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AdminStudioEditor />
                  </motion.div>
                )}

                {adminTab === 'settings' && (
                  <motion.div
                    key="admin-settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AdminSettings />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            <footer className="border-t border-stone-800 py-6 px-4 text-xs text-stone-500 mt-auto bg-stone-950">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>ANUBHART STUDIO Admin Workstation</span>
                <button
                  onClick={() => setActivePortal('consumer')}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  ← Switch back to Consumer View
                </button>
              </div>
            </footer>
          </AdminLoginGate>
        </div>
      )}

      {/* Global Google Sign In Modal, Security Shield & Notifications */}
      <GoogleSignInModal />
      <SecurityDefenseModal 
        isOpen={isSecurityModalOpen} 
        onClose={() => setIsSecurityModalOpen(false)} 
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
