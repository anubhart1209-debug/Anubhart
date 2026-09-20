import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ShoppingBag, 
  Truck, 
  ArrowLeft, 
  Copy, 
  Check, 
  ShieldCheck, 
  Award, 
  Package, 
  Calendar, 
  CreditCard, 
  Banknote, 
  MapPin, 
  Printer, 
  Sparkles,
  BellRing,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ThankYouOrderPage: React.FC = () => {
  const { 
    lastConfirmedOrder, 
    orders, 
    setConsumerTab, 
    setSelectedTrackingOrder, 
    showToast,
    setActivePortal,
    setAdminTab
  } = useApp();

  const [copied, setCopied] = React.useState(false);

  // Fallback to the latest order in the list if lastConfirmedOrder is not set
  const order = lastConfirmedOrder || orders[0];

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    showToast('Order ID copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackToStore = () => {
    setConsumerTab('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Welcome back to the art gallery!', 'info');
  };

  const handleTrackOrder = () => {
    if (order) {
      setSelectedTrackingOrder(order);
    }
    setConsumerTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToAdminOrders = () => {
    setActivePortal('admin');
    setAdminTab('orders');
    showToast('Switched to Studio Admin Orders view', 'info');
  };

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">No Recent Order Found</h2>
        <p className="text-stone-500 text-sm max-w-md mx-auto">
          You haven't placed an order in this session yet, or your session was cleared. Browse our gallery to select and commission an original work.
        </p>
        <button
          onClick={handleBackToStore}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0c2340] hover:bg-[#142850] text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Come Back to Store Again</span>
        </button>
      </div>
    );
  }

  const isCOD = order.paymentMethod === 'cod';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Top Breadcrumb / Return Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <button
          onClick={handleBackToStore}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 text-xs sm:text-sm font-semibold transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Come Back to Store Again</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono font-medium">Order Status: {order.orderStatus}</span>
        </div>
      </div>

      {/* Hero Thank You Celebration Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-b from-stone-900 via-[#0c2340] to-stone-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative backdrop elements */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isCOD ? 'Cash on Delivery Order Confirmed' : 'Purchase & Payment Verified'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight text-stone-100">
              Thank You for Purchasing!
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Your order has been officially recorded into the studio registry. Artist <strong className="text-amber-300 font-semibold">Anubha Sinha</strong> and our curation team have received your order notification and are initiating customized framing and archival inspection.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800/80 border border-stone-700 rounded-xl text-xs font-mono text-stone-300">
                <span className="text-stone-400">Order ID:</span>
                <span className="font-bold text-amber-300">#{order.id}</span>
                <button
                  onClick={() => handleCopyOrderId(order.id)}
                  className="ml-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Order ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 border border-emerald-600/40 rounded-xl text-xs text-emerald-300">
                <BellRing className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Admin Alert Dispatched</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col w-full md:w-auto gap-3 shrink-0">
            <button
              onClick={handleBackToStore}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Come Back to Store Again</span>
            </button>

            <button
              onClick={handleTrackOrder}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Track Live Dispatch Radar</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Admin Sync Notification Notice Bar */}
      <div className="p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-emerald-950 text-sm">
              Studio Admin Workstation Alerted
            </div>
            <div className="text-stone-600">
              An immediate notification has been broadcast to the studio dashboard with order #{order.id} and stock updated.
            </div>
          </div>
        </div>

        <button
          onClick={handleGoToAdminOrders}
          className="px-3.5 py-1.5 bg-white hover:bg-stone-50 text-[#0c2340] border border-stone-300 font-bold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 text-xs"
        >
          <span>View in Admin Portal</span>
          <ExternalLink className="w-3 h-3 text-stone-500" />
        </button>
      </div>

      {/* Order Details & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Ordered Artworks & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ordered Artworks Itemization */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                <span>Ordered Artworks ({order.items.length})</span>
              </h2>
              <span className="text-xs text-stone-500">Stock count updated</span>
            </div>

            <div className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={item.id || idx} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-stone-200 shadow-2xs shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base truncate">
                        {item.product.title}
                      </h3>
                      <span className="font-extrabold text-stone-900 text-sm shrink-0">
                        ${item.unitPrice * item.quantity}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500">
                      {item.product.medium || item.product.category} • Qty: <strong className="text-stone-800">{item.quantity}</strong>
                    </p>

                    {item.customization && (
                      <div className="mt-2 p-2.5 bg-stone-50 rounded-lg border border-stone-200/80 text-[11px] space-y-1 text-stone-600">
                        {item.customization.selectedSize && (
                          <div>
                            <span className="text-stone-400">Size:</span> {item.customization.selectedSize}
                          </div>
                        )}
                        {item.customization.selectedFrame && (
                          <div>
                            <span className="text-stone-400">Frame:</span> {item.customization.selectedFrame}
                          </div>
                        )}
                        {item.customization.inscription && (
                          <div className="italic text-amber-900 font-serif">
                            "{item.customization.inscription}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Destination & Delivery Timeline */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-200">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Delivery & Shipping Destination</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1 text-stone-700">
                <span className="text-[11px] font-bold uppercase text-stone-400 block">Recipient</span>
                <p className="font-bold text-stone-900 text-sm">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p className="text-stone-500">Phone: {order.shippingAddress.phone}</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1 text-stone-700">
                <span className="text-[11px] font-bold uppercase text-stone-400 block">Courier & Logistics</span>
                <p className="font-bold text-stone-900 text-sm">{order.courierPartner}</p>
                <p className="font-mono text-stone-600">Air Waybill: {order.trackingNumber}</p>
                <div className="pt-1 flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Est. Arrival: {order.estimatedDelivery}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Payment Summary & Next Steps */}
        <div className="space-y-6">
          {/* Payment & Charges Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-200">
              <CreditCard className="w-4 h-4 text-[#3399cc]" />
              <span>Payment Details</span>
            </h2>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold text-stone-900 uppercase">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className={`font-bold uppercase ${isCOD ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {isCOD ? 'Pending (Pay at Doorstep)' : 'Paid & Verified'}
                </span>
              </div>

              <div className="flex justify-between font-mono text-[11px]">
                <span>Transaction Ref:</span>
                <span className="text-stone-800">{order.transactionId}</span>
              </div>

              <div className="pt-3 border-t border-stone-200 space-y-1.5">
                <div className="flex justify-between text-stone-500">
                  <span>Artwork Subtotal</span>
                  <span>${order.subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Museum Crating</span>
                  <span className="text-emerald-600 font-semibold">Complimentary</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Air Express Shipping</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Certificate of Authenticity</span>
                  <span className="text-emerald-600 font-semibold">Included</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="font-bold text-stone-900 text-sm">
                  {isCOD ? 'Amount Due on Delivery' : 'Total Amount Paid'}
                </span>
                <span className="font-extrabold text-stone-900 text-xl font-mono">
                  ${order.totalAmount}
                </span>
              </div>
            </div>

            {isCOD && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                <Banknote className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Please keep exact cash (${order.totalAmount}) or be ready with any UPI app to scan the courier's QR code when the parcel is delivered.
                </span>
              </div>
            )}
          </div>

          {/* Provenance & Guarantee Guarantee Card */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3 text-xs text-stone-700">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Collector's Guarantee</span>
            </div>
            <ul className="space-y-2 text-[11px] text-stone-600">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Hand-signed & wax-sealed Certificate of Provenance</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Climate-controlled, shock-absorbent archival crating</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Full transit insurance coverage up to delivery door</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 bg-white hover:bg-stone-100 text-stone-800 font-semibold rounded-xl border border-stone-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-stone-500" />
                <span>Print Order Receipt</span>
              </button>
            </div>
          </div>

          {/* Store Return Button */}
          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl border border-amber-200/60 text-center space-y-3">
            <h3 className="font-serif font-bold text-amber-950 text-sm">
              Want to Explore More Artworks?
            </h3>
            <p className="text-xs text-amber-800/90 leading-relaxed">
              Browse our gallery catalog to discover other original paintings, sketches, and sculptures.
            </p>
            <button
              onClick={handleBackToStore}
              className="w-full py-3 bg-[#0c2340] hover:bg-[#142850] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Come Back to Store Again</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
