import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { 
  PackageCheck, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  DollarSign, 
  Search, 
  FileText,
  AlertCircle,
  XCircle,
  Plus,
  Send,
  Sliders,
  ExternalLink,
  BellRing,
  Sparkles,
  Check
} from 'lucide-react';

export const OrdersManager: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    addTrackingMilestone, 
    showToast,
    adminNotifications,
    unreadAdminNotificationsCount,
    markAllNotificationsAsRead,
    markNotificationAsRead
  } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Milestone input per order
  const [activeMilestoneOrder, setActiveMilestoneOrder] = useState<string | null>(null);
  const [milestoneStatus, setMilestoneStatus] = useState<OrderStatus>('Processing');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [milestoneLoc, setMilestoneLoc] = useState('Anubhart Central Studio, Varanasi');

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'All' || o.orderStatus === filterStatus;
    const matchesSearch = !search.trim() ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.userName.toLowerCase().includes(search.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.transactionId.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleAddMilestone = (orderId: string) => {
    if (!milestoneDesc.trim()) return;
    addTrackingMilestone(orderId, {
      status: milestoneStatus,
      description: milestoneDesc.trim(),
      location: milestoneLoc.trim()
    });
    setMilestoneDesc('');
    setActiveMilestoneOrder(null);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Real-time Order Alerts Broadcast Banner */}
      {unreadAdminNotificationsCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-emerald-500/20 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-extrabold shadow-md shrink-0">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div className="space-y-0.5">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span>{unreadAdminNotificationsCount} New Customer Order{unreadAdminNotificationsCount > 1 ? 's' : ''} Received!</span>
                <span className="px-2 py-0.5 bg-amber-400 text-stone-950 font-extrabold rounded-full text-[10px] uppercase tracking-wider animate-pulse">
                  Live Alert
                </span>
              </div>
              <p className="text-stone-300 text-xs">
                Most Recent: <strong className="text-amber-300 font-mono">#{adminNotifications[0]?.orderId}</strong> placed by <strong className="text-white">{adminNotifications[0]?.customerName}</strong> ({adminNotifications[0]?.paymentMethod.toUpperCase()}) — ${adminNotifications[0]?.totalAmount}
              </p>
            </div>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-bold border border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Acknowledge & Mark Read</span>
          </button>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-stone-100">
          <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">
            Total Orders
          </span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">
            {orders.length}
          </span>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-stone-100">
          <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider block">
            In Preparation / Placed
          </span>
          <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
            {orders.filter(o => ['Placed', 'Processing'].includes(o.orderStatus)).length}
          </span>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-stone-100">
          <span className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider block">
            Dispatched / Out for Delivery
          </span>
          <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">
            {orders.filter(o => ['Shipped', 'OutForDelivery'].includes(o.orderStatus)).length}
          </span>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-stone-100">
          <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider block">
            Studio Revenue
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
            ${totalRevenue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, tracking #..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:outline-none"
          >
            <option value="All">All Orders ({orders.length})</option>
            <option value="Placed">Placed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="OutForDelivery">Out For Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-stone-900 border border-stone-800 rounded-3xl p-8 space-y-3">
          <PackageCheck className="w-12 h-12 text-stone-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching customer orders</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Try adjusting your search criteria or filter options.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const isCancelled = order.orderStatus === 'Cancelled';
            const isDelivered = order.orderStatus === 'Delivered';
            const unreadNotif = adminNotifications.find(n => n.orderId === order.id && !n.isRead);

            return (
              <div
                key={order.id}
                className={`bg-stone-900 border rounded-2xl p-5 text-xs text-stone-300 space-y-4 shadow-sm transition-all ${
                  unreadNotif 
                    ? 'border-amber-500/80 ring-2 ring-amber-500/20 bg-stone-900/95' 
                    : isCancelled 
                    ? 'border-rose-900/50 opacity-80' 
                    : 'border-stone-800'
                }`}
              >
                {/* Order Head */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white font-mono">#{order.id}</span>
                      {unreadNotif && (
                        <button
                          onClick={() => markNotificationAsRead(unreadNotif.id)}
                          className="text-[10px] text-stone-950 font-extrabold bg-amber-400 hover:bg-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse cursor-pointer"
                          title="Click to mark as acknowledged"
                        >
                          <BellRing className="w-3 h-3" />
                          <span>NEW ORDER ({order.paymentMethod.toUpperCase()})</span>
                        </button>
                      )}
                      <span className="text-[10px] text-stone-400 font-mono bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                        {order.courierPartner}: {order.trackingNumber}
                      </span>
                      {order.razorpayPaymentId && (
                        <span className="text-[10px] text-sky-400 font-mono bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                          Razorpay: {order.razorpayPaymentId}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      Placed on {order.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-emerald-400">
                      ${order.totalAmount.toFixed(2)}
                    </span>

                    {/* Order Status Control */}
                    <select
                      value={order.orderStatus}
                      onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border focus:outline-none cursor-pointer ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : order.orderStatus === 'Shipped' || order.orderStatus === 'OutForDelivery'
                          ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-950 text-rose-300 border-rose-700'
                          : 'bg-amber-950 text-amber-300 border-amber-700'
                      }`}
                    >
                      <option value="Placed">Status: Placed</option>
                      <option value="Processing">Status: Processing</option>
                      <option value="Shipped">Status: Shipped</option>
                      <option value="OutForDelivery">Status: Out For Delivery</option>
                      <option value="Delivered">Status: Delivered</option>
                      <option value="Cancelled">Status: Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Collector Shipping info */}
                  <div className="space-y-1.5 bg-stone-950 p-4 rounded-xl border border-stone-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Collector & Destination
                      </span>
                      <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-medium">
                        Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                      </span>
                    </div>

                    <p className="font-bold text-white text-sm">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-stone-400 text-[11px]">{order.userEmail} • Phone: {order.shippingAddress.phone}</p>
                    <p className="text-stone-300 leading-relaxed text-[11px]">
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                    {order.shippingAddress.landmark && (
                      <p className="text-[10px] text-stone-400 italic">Landmark: {order.shippingAddress.landmark}</p>
                    )}
                    {order.customerNote && (
                      <div className="p-2 bg-amber-950/40 border border-amber-800/50 rounded-lg text-amber-300 text-[11px] mt-2">
                        <strong>Collector Commission Note:</strong> "{order.customerNote}"
                      </div>
                    )}
                  </div>

                  {/* Artworks in Order */}
                  <div className="space-y-2 bg-stone-950 p-4 rounded-xl border border-stone-800/80">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Ordered Artworks & Customization
                    </span>

                    <ul className="space-y-2.5 pt-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-stone-900/60 p-2 rounded-lg border border-stone-800">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-12 h-12 rounded-lg object-cover border border-stone-700 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-stone-200 font-bold block truncate">
                              {item.quantity}x {item.product.title}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              Unit: ${(item.unitPrice || item.product.price).toFixed(2)}
                            </span>

                            {item.customization && (
                              <div className="mt-1 flex flex-wrap gap-1 text-[9px]">
                                {item.customization.selectedFrame && (
                                  <span className="bg-stone-800 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                                    Frame: {item.customization.selectedFrame}
                                  </span>
                                )}
                                {item.customization.selectedSize && (
                                  <span className="bg-stone-800 text-stone-300 px-1.5 py-0.2 rounded font-mono">
                                    {item.customization.selectedSize}
                                  </span>
                                )}
                                {item.customization.inscription && (
                                  <span className="bg-amber-900/40 text-amber-200 px-1.5 py-0.2 rounded italic block w-full truncate">
                                    "{item.customization.inscription}"
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tracking Milestones Timeline */}
                <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Live Customer Tracking Timeline ({order.trackingTimeline.length} events)
                    </span>
                    <button
                      onClick={() => setActiveMilestoneOrder(activeMilestoneOrder === order.id ? null : order.id)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{activeMilestoneOrder === order.id ? 'Cancel' : 'Add Milestone Update'}</span>
                    </button>
                  </div>

                  {/* Add Milestone Form */}
                  {activeMilestoneOrder === order.id && (
                    <div className="p-3 bg-stone-900 rounded-lg border border-stone-800 space-y-2.5 mt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-stone-400 block mb-0.5">Status Phase</label>
                          <select
                            value={milestoneStatus}
                            onChange={e => setMilestoneStatus(e.target.value as OrderStatus)}
                            className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2 py-1 text-xs text-white"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="OutForDelivery">Out For Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-400 block mb-0.5">Location</label>
                          <input
                            type="text"
                            value={milestoneLoc}
                            onChange={e => setMilestoneLoc(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-400 block mb-0.5">Description Note</label>
                          <input
                            type="text"
                            placeholder="e.g. Masterwork inspected & crated"
                            value={milestoneDesc}
                            onChange={e => setMilestoneDesc(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddMilestone(order.id)}
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg flex items-center gap-1.5"
                      >
                        <Send className="w-3 h-3" />
                        <span>Publish Milestone to Customer Radar</span>
                      </button>
                    </div>
                  )}

                  <div className="space-y-1.5 text-[11px] pt-1">
                    {order.trackingTimeline.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-stone-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="font-mono text-[10px] text-stone-500">{item.timestamp}</span>
                        <span className="text-white font-medium">{item.title}</span>
                        <span className="text-stone-500">({item.location})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
