import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminTab } from '../../types';
import { 
  Palette, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  PackageCheck,
  Sliders,
  UserCheck,
  Crown,
  Bell,
  BellRing,
  CheckCircle2,
  Package,
  Trash2,
  Check
} from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    currentUser,
    logout,
    setActivePortal,
    products,
    orders,
    primaryOwnerEmail,
    adminNotifications,
    unreadAdminNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const outOfStockCount = products.filter(p => !p.inStock || p.stockCount <= 0).length;
  const activeOrdersCount = orders.filter(o => ['Placed', 'Processing', 'Shipped'].includes(o.orderStatus)).length;

  const navItems: { id: AdminTab; label: string; icon: React.FC<any>; badge?: number; badgeColor?: string }[] = [
    {
      id: 'catalog',
      label: 'Art Catalog & Customization',
      icon: Palette,
      badge: outOfStockCount > 0 ? outOfStockCount : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'orders',
      label: 'Collector Orders & Radar',
      icon: PackageCheck,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      badgeColor: 'bg-amber-500 text-stone-950'
    },
    {
      id: 'profile',
      label: 'Studio & Site Content Editor',
      icon: Sliders
    },
    {
      id: 'settings',
      label: 'Security & Access',
      icon: Settings
    }
  ];

  return (
    <nav className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-[37px] z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Studio Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-extrabold text-lg shadow-md font-serif">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base sm:text-lg font-serif">
                  ANUBHART STUDIO
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>OWNER WORKSTATION</span>
                </span>
              </div>
              <span className="text-[11px] text-stone-400">
                Primary Master Account: <strong className="text-stone-300">{primaryOwnerEmail}</strong>
              </span>
            </div>
          </div>

          {/* Desktop Tab Links */}
          <div className="hidden md:flex items-center gap-1.5 bg-stone-950/60 p-1 rounded-xl border border-stone-800">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action: Notifications, Live Store & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Studio Order Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                id="admin-notification-bell"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
                  unreadAdminNotificationsCount > 0
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-stone-800/80 text-stone-400 border-stone-700 hover:text-stone-200 hover:bg-stone-800'
                }`}
                title="Studio Order Notifications"
              >
                {unreadAdminNotificationsCount > 0 ? (
                  <BellRing className="w-4 h-4 animate-bounce text-amber-400" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}

                {unreadAdminNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-extrabold rounded-full font-mono shadow-sm">
                    {unreadAdminNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
                  <div className="p-3.5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-white text-sm">Studio Order Alerts</span>
                      {unreadAdminNotificationsCount > 0 && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full font-mono text-[10px] font-bold">
                          {unreadAdminNotificationsCount} new
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {unreadAdminNotificationsCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                      {adminNotifications.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-stone-500 hover:text-rose-400 p-1 rounded-md transition-colors cursor-pointer"
                          title="Clear all alerts"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-stone-800/80">
                    {adminNotifications.length === 0 ? (
                      <div className="p-8 text-center text-stone-500 space-y-2">
                        <Package className="w-8 h-8 mx-auto text-stone-600" />
                        <p className="text-xs">No notifications yet. Alerts will appear instantly when customers complete orders.</p>
                      </div>
                    ) : (
                      adminNotifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            setAdminTab('orders');
                            setIsNotifOpen(false);
                          }}
                          className={`p-3.5 transition-colors cursor-pointer hover:bg-stone-800/60 ${
                            !notif.isRead ? 'bg-amber-500/10 border-l-2 border-amber-400' : 'opacity-80'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono font-bold text-amber-300 text-[11px]">
                              #{notif.orderId}
                            </span>
                            <span className="text-[10px] text-stone-400">{notif.timestamp}</span>
                          </div>

                          <div className="font-semibold text-stone-200 mt-1 flex items-center justify-between">
                            <span className="truncate">{notif.customerName}</span>
                            <span className="font-mono text-emerald-400 font-bold">${notif.totalAmount}</span>
                          </div>

                          <p className="text-stone-400 text-[11px] mt-0.5 truncate">
                            {notif.firstItemTitle} {notif.itemsCount > 1 ? `(+${notif.itemsCount - 1} more)` : ''}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              notif.paymentMethod === 'cod'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {notif.paymentMethod === 'cod' ? 'Cash on Delivery' : notif.paymentMethod}
                            </span>
                            {!notif.isRead && (
                              <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                                Unread
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-stone-950 border-t border-stone-800 text-center">
                    <button
                      onClick={() => {
                        setAdminTab('orders');
                        setIsNotifOpen(false);
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                    >
                      Open Collector Orders Manager →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setActivePortal('consumer')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Store</span>
            </button>

            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-800">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-stone-700"
                />
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-stone-800 text-xs">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-semibold ${
                  isActive ? 'text-indigo-400 font-bold' : 'text-stone-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label.split(' ')[0]}</span>
                {item.badge !== undefined && (
                  <span className={`px-1 py-0.2 rounded-full text-[9px] font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
