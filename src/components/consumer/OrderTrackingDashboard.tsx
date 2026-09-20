import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  AlertTriangle, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

export const OrderTrackingDashboard: React.FC = () => {
  const { 
    orders, 
    currentUser, 
    cancelOrder, 
    showToast, 
    setConsumerTab,
    selectedTrackingOrder,
    setSelectedTrackingOrder,
    setIsGoogleSignInOpen,
    setSignInIntent
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of delivery address / mind');
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

  // Filter orders for the user
  const userOrders = orders.filter(o => {
    // If user is logged in, prioritize orders matching their email, or show all if demo
    if (currentUser) {
      if (o.userEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
    }
    // Search query matches
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.id.toLowerCase().includes(q) ||
        o.trackingNumber.toLowerCase().includes(q) ||
        o.shippingAddress.phone.includes(q) ||
        o.shippingAddress.fullName.toLowerCase().includes(q) ||
        o.userEmail.toLowerCase().includes(q)
      );
    }
    // Return all orders for transparency if no filter
    return true;
  });

  const filteredOrders = userOrders.filter(o => {
    if (statusFilter === 'active') return ['Placed', 'Processing', 'Shipped', 'OutForDelivery'].includes(o.orderStatus);
    if (statusFilter === 'delivered') return o.orderStatus === 'Delivered';
    if (statusFilter === 'cancelled') return o.orderStatus === 'Cancelled';
    return true;
  });

  const activeOrder = selectedTrackingOrder || filteredOrders[0] || null;

  const handleCopyTracking = (trackingNum: string) => {
    navigator.clipboard.writeText(trackingNum);
    setCopiedTracking(trackingNum);
    showToast('Tracking number copied to clipboard', 'info');
    setTimeout(() => setCopiedTracking(null), 2500);
  };

  const handleConfirmCancel = () => {
    if (!cancellingOrderId) return;
    cancelOrder(cancellingOrderId, cancelReason);
    setCancellingOrderId(null);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1"><Clock className="w-3 h-3" /> Placed</span>;
      case 'Processing':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1"><Sparkles className="w-3 h-3" /> In Framing</span>;
      case 'Shipped':
        return <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1"><Truck className="w-3 h-3" /> In Transit</span>;
      case 'OutForDelivery':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1"><Truck className="w-3 h-3" /> Out for Delivery</span>;
      case 'Delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'Cancelled':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Search Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            <Package className="w-4 h-4" />
            <span>Collector Data & Real-Time Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Track Your Commissions & Orders
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
            Monitor real-time studio framing, temperature-controlled courier transit, and review all recipient and customization specifications you provided.
          </p>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Order ID (order_rcpt_...), phone, or name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
            {(['all', 'active', 'delivered', 'cancelled'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                  statusFilter === tab
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {!currentUser && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Want to automatically see all your past orders? Sign in with your Google account.
              </span>
            </div>
            <button
              onClick={() => {
                setSignInIntent('tracking');
                setIsGoogleSignInOpen(true);
              }}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors shrink-0"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout: Orders List on Left, Active Tracking Inspector on Right */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No Orders Found</h3>
          <p className="text-xs text-stone-500">
            {searchQuery 
              ? `No orders matching "${searchQuery}". Please check your Order ID or phone number.`
              : 'You haven’t placed an art commission order yet.'}
          </p>
          <button
            onClick={() => setConsumerTab('store')}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>Explore Fine Art Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Order Cards List (Left Column) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block px-1">
              Your Orders ({filteredOrders.length})
            </span>

            {filteredOrders.map(order => {
              const isSelected = activeOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedTrackingOrder(order)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/60 border-amber-500 shadow-md ring-1 ring-amber-400'
                      : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-stone-900">
                      #{order.id}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex -space-x-2 overflow-hidden shrink-0">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-xs"
                        />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {order.items.map(i => i.product.title).join(', ')}
                      </p>
                      <span className="text-[11px] text-stone-500 block">
                        Placed on {order.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500">
                      Total: <strong className="text-stone-900 font-serif">${order.totalAmount}</strong>
                    </span>
                    <span className="text-amber-700 font-medium text-[11px] flex items-center gap-1">
                      <span>View Full Timeline</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Order Detailed Tracking & Given Information (Right Column) */}
          {activeOrder && (
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-8">
              {/* Header with Order Status & Live Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-extrabold text-stone-900 font-mono">
                      Order #{activeOrder.id}
                    </h2>
                    {getStatusBadge(activeOrder.orderStatus)}
                  </div>
                  <span className="text-xs text-stone-500">
                    Payment verified via <strong className="uppercase text-stone-700">{activeOrder.paymentMethod}</strong> • Trans ID: <code className="text-stone-700 font-mono">{activeOrder.transactionId}</code>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInvoiceOrder(activeOrder)}
                    className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-stone-500" />
                    <span>Official Invoice</span>
                  </button>

                  {['Placed', 'Processing'].includes(activeOrder.orderStatus) && (
                    <button
                      onClick={() => setCancellingOrderId(activeOrder.id)}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Courier Tracking Live Card */}
              {activeOrder.orderStatus !== 'Cancelled' && (
                <div className="bg-stone-900 text-white rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">
                          Assigned Courier Service
                        </span>
                        <div className="font-extrabold text-sm text-white">
                          {activeOrder.courierPartner}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800">
                      <span className="text-xs font-mono text-stone-300">
                        {activeOrder.trackingNumber}
                      </span>
                      <button
                        onClick={() => handleCopyTracking(activeOrder.trackingNumber)}
                        className="text-stone-400 hover:text-white transition-colors"
                        title="Copy Tracking Number"
                      >
                        {copiedTracking === activeOrder.trackingNumber ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
                    <span className="text-stone-400">
                      Estimated Arrival Window:
                    </span>
                    <span className="text-amber-400 font-bold font-mono">
                      {activeOrder.estimatedDelivery} (Direct White-Glove Handover)
                    </span>
                  </div>
                </div>
              )}

              {/* Real-Time Step Timeline */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
                  Live Dispatch & Studio Milestone Timeline
                </h3>

                <div className="space-y-6 relative pl-6 border-l-2 border-stone-200 ml-3">
                  {activeOrder.trackingTimeline.map((step, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          step.completed
                            ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                            : 'bg-white border-stone-300 text-stone-400'
                        }`}
                      >
                        {step.completed ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className={`text-sm font-bold ${step.completed ? 'text-stone-900' : 'text-stone-400'}`}>
                            {step.title}
                          </h4>
                          <span className="text-[11px] text-stone-500 font-mono">
                            {step.timestamp}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{step.location}</span>
                        </div>

                        {step.note && (
                          <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 mt-2 leading-relaxed">
                            {step.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* "What You Have Given" - Customer Details Card */}
              <div className="pt-6 border-t border-stone-100 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Customer & Recipient Details You Provided</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 rounded-2xl p-5 border border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-400 font-semibold block uppercase text-[10px]">
                      Shipping Recipient
                    </span>
                    <div className="font-bold text-stone-900 mt-0.5">
                      {activeOrder.shippingAddress.fullName}
                    </div>
                    <div className="flex items-center gap-1 text-stone-600 mt-1">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>{activeOrder.shippingAddress.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-600 mt-0.5">
                      <Mail className="w-3 h-3 text-stone-400" />
                      <span>{activeOrder.userEmail}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 font-semibold block uppercase text-[10px]">
                      Delivery Address & Destination
                    </span>
                    <p className="text-stone-800 mt-0.5 leading-relaxed font-medium">
                      {activeOrder.shippingAddress.street}, {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pincode}
                    </p>
                    {activeOrder.shippingAddress.landmark && (
                      <span className="text-stone-500 block mt-1">
                        Landmark: {activeOrder.shippingAddress.landmark}
                      </span>
                    )}
                  </div>
                </div>

                {activeOrder.customerNote && (
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs text-amber-900">
                    <strong className="block text-[11px] uppercase tracking-wider text-amber-800">
                      Your Special Instructions to Studio:
                    </strong>
                    <span className="italic mt-0.5 block">"{activeOrder.customerNote}"</span>
                  </div>
                )}
              </div>

              {/* Commissioned Artwork Line Items */}
              <div className="pt-6 border-t border-stone-100 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Commissioned Pieces ({activeOrder.items.reduce((s, i) => s + i.quantity, 0)})
                </h3>

                <div className="space-y-3">
                  {activeOrder.items.map(item => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-14 h-14 rounded-xl object-cover border border-stone-200 shadow-xs shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm">
                            {item.product.title}
                          </h4>
                          <span className="text-stone-500 block text-[11px]">
                            {item.product.medium} • Qty: {item.quantity}
                          </span>

                          {/* Customization Details Badges */}
                          {item.customization && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.customization.selectedFrame && (
                                <span className="bg-stone-200/80 text-stone-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                                  Frame: {item.customization.selectedFrame}
                                </span>
                              )}
                              {item.customization.selectedSize && (
                                <span className="bg-stone-200/80 text-stone-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                                  Size: {item.customization.selectedSize}
                                </span>
                              )}
                              {item.customization.inscription && (
                                <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[10px] italic">
                                  Dedication: "{item.customization.inscription}"
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right sm:text-right w-full sm:w-auto font-mono font-bold text-stone-900 text-sm">
                        ${item.unitPrice * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Cancel Commission Order</h3>
                <span className="text-xs text-stone-500">Order #{cancellingOrderId}</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to cancel this order? If you cancel now, your full payment will be refunded immediately back to your original source via Razorpay.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Please select a reason for cancellation:
              </label>
              <select
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Change of delivery address / mind">Change of delivery address or mind</option>
                <option value="Want to customize with a different frame/size">Want to order with a different frame or size</option>
                <option value="Placed order by mistake">Placed order by mistake</option>
                <option value="Selected wrong payment method">Selected wrong payment method</option>
                <option value="Other personal reason">Other personal reason</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancellingOrderId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Confirm Cancellation & Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Tax Invoice & Certificate Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-stone-200 space-y-6 my-auto text-stone-900 font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h2 className="text-2xl font-serif font-black tracking-tight text-stone-900">
                  ANUBHART
                </h2>
                <span className="text-[11px] text-stone-500 block uppercase tracking-widest font-semibold">
                  Fine Art Studio & Gallery • Varanasi, India
                </span>
              </div>
              <button
                onClick={() => setInvoiceOrder(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs">
              <div>
                <span className="text-stone-400 uppercase font-semibold text-[10px] block">Billed & Shipped To:</span>
                <strong className="text-sm text-stone-900 block mt-0.5">{invoiceOrder.shippingAddress.fullName}</strong>
                <span className="text-stone-600 block">{invoiceOrder.shippingAddress.street}</span>
                <span className="text-stone-600 block">{invoiceOrder.shippingAddress.city}, {invoiceOrder.shippingAddress.state} - {invoiceOrder.shippingAddress.pincode}</span>
                <span className="text-stone-600 block">Phone: {invoiceOrder.shippingAddress.phone}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-stone-400 uppercase font-semibold text-[10px] block">Invoice Details:</span>
                <span className="font-mono font-bold block mt-0.5">INV-{invoiceOrder.id.toUpperCase()}</span>
                <span className="text-stone-600 block">Date: {invoiceOrder.createdAt}</span>
                <span className="text-stone-600 block">Razorpay Txn: {invoiceOrder.transactionId}</span>
                <span className="text-emerald-700 font-bold block mt-1">Status: Authorized & Paid</span>
              </div>
            </div>

            {/* Line items table */}
            <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Artwork Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {invoiceOrder.items.map(item => (
                    <tr key={item.id}>
                      <td className="p-3">
                        <span className="font-bold text-stone-900 block">{item.product.title}</span>
                        <span className="text-stone-500 text-[11px] block">{item.product.medium}</span>
                        {item.customization?.selectedFrame && (
                          <span className="text-stone-600 text-[10px] block">• Custom Frame: {item.customization.selectedFrame}</span>
                        )}
                        {item.customization?.selectedSize && (
                          <span className="text-stone-600 text-[10px] block">• Proportions: {item.customization.selectedSize}</span>
                        )}
                      </td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right font-mono">${item.unitPrice}</td>
                      <td className="p-3 text-right font-mono font-bold">${item.unitPrice * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-xs pt-2">
              <div className="flex items-center gap-1.5 text-stone-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Original Signed Museum Certificate Included with Package</span>
              </div>
              <div className="text-right">
                <span className="text-stone-500 mr-3">Grand Total:</span>
                <span className="text-xl font-bold font-serif text-stone-900">${invoiceOrder.totalAmount}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Print Official Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
