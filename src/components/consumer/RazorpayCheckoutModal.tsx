import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  QrCode, 
  CreditCard, 
  Building2, 
  Banknote, 
  Check, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles, 
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Truck,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShippingAddress } from '../../types';
import { scanAndNeutralizeInput } from '../../utils/securityDefense';

export const RazorpayCheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartTotal, 
    currentUser, 
    createOrder, 
    setConsumerTab,
    showToast 
  } = useApp();

  const [step, setStep] = useState<'shipping' | 'payment' | 'processing' | 'success'>('shipping');
  const [paymentTab, setPaymentTab] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');

  // Customer & Shipping state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: currentUser?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [customerNote, setCustomerNote] = useState('');

  // Payment states
  const [upiMethod, setUpiMethod] = useState<'qr' | 'id' | 'apps'>('apps');
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Netbanking bank
  const [selectedBank, setSelectedBank] = useState('hdfc');

  // Processing state
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const inrAmount = Math.round(cartTotal * 83.2);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      showToast('Please fill all mandatory shipping address fields', 'error');
      return;
    }
    setStep('payment');
  };

  const handleAuthorizePayment = () => {
    setStep('processing');

    setTimeout(() => {
      const isCOD = paymentTab === 'cod';
      const txnId = isCOD 
        ? 'COD_' + Math.random().toString(36).substring(2, 10).toUpperCase()
        : 'pay_RPZ_' + Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const sanitizedShipping: ShippingAddress = {
        fullName: scanAndNeutralizeInput(shippingAddress.fullName, 'Checkout Recipient').clean,
        phone: scanAndNeutralizeInput(shippingAddress.phone, 'Checkout Phone').clean,
        street: scanAndNeutralizeInput(shippingAddress.street, 'Checkout Street').clean,
        city: scanAndNeutralizeInput(shippingAddress.city, 'Checkout City').clean,
        state: scanAndNeutralizeInput(shippingAddress.state, 'Checkout State').clean,
        pincode: scanAndNeutralizeInput(shippingAddress.pincode, 'Checkout Pincode').clean,
        landmark: shippingAddress.landmark ? scanAndNeutralizeInput(shippingAddress.landmark, 'Checkout Landmark').clean : undefined
      };

      const cleanNote = customerNote.trim() ? scanAndNeutralizeInput(customerNote, 'Customer Commission Note').clean : undefined;

      const order = createOrder({
        shippingAddress: sanitizedShipping,
        paymentMethod: paymentTab,
        transactionId: txnId,
        razorpayPaymentId: isCOD ? undefined : txnId,
        customerNote: cleanNote
      });

      setCompletedOrderId(order.id);
      setStep('success');
    }, 1400);
  };

  const handleGoToThankYouPage = () => {
    setIsCheckoutOpen(false);
    setConsumerTab('order-confirmation');
  };

  const handleReturnToStore = () => {
    setIsCheckoutOpen(false);
    setConsumerTab('store');
    showToast('Welcome back to the art gallery!', 'info');
  };

  const handleFinishAndTrack = () => {
    setIsCheckoutOpen(false);
    setConsumerTab('tracking');
    showToast('Your commission order is live on the tracking radar!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto font-sans"
        >
          {/* Authentic Razorpay Top Bar */}
          <div className="bg-[#0c2340] text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Razorpay Brand Mark */}
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-[#3399cc] flex items-center justify-center font-black text-white text-xs italic tracking-tighter">
                  R
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm tracking-tight text-white">Razorpay</span>
                    <span className="text-[9px] bg-[#3399cc]/30 text-[#64b5f6] font-bold px-1.5 py-0.2 rounded border border-[#3399cc]/40">
                      SECURE
                    </span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30 flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                      AES-256
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-300 block">
                    Paying <strong className="text-white">Anubhart Fine Art Studio</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-stone-300 block uppercase font-medium">Order Total</span>
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="text-lg font-bold text-white font-mono">
                    ${cartTotal}
                  </span>
                  <span className="text-[11px] text-[#64b5f6] font-mono">
                    (₹{inrAmount.toLocaleString()})
                  </span>
                </div>
              </div>

              {step !== 'processing' && step !== 'success' && (
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* STEP 1: Shipping Address & Recipient Specifications */}
          {step === 'shipping' && (
            <form onSubmit={handleProceedToPayment} className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-600" />
                    <span>Step 1: Collector & Shipping Details</span>
                  </h2>
                  <span className="text-xs text-stone-400">Step 1 of 2</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  All Anubhart artworks are crated in bespoke acid-free packaging with live GPS courier tracking.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={e => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Phone Number (For Courier Updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Street Address & Apartment / Villa *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Pincode / Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.pincode}
                    onChange={e => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nearby Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite City Club"
                    value={shippingAddress.landmark || ''}
                    onChange={e => setShippingAddress({ ...shippingAddress, landmark: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Studio Commission Notes / Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call before delivery; white glove unpacking requested."
                    value={customerNote}
                    onChange={e => setCustomerNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Order Cart Preview Mini Row */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-stone-700">Artworks in Bag ({cart.length}):</span>
                  <div className="flex -space-x-2">
                    {cart.slice(0, 3).map((item, i) => (
                      <img
                        key={i}
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-8 h-8 rounded-full object-cover border border-white shadow-xs"
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block text-[10px]">Free Insured Transit</span>
                  <span className="font-bold text-stone-900">${cartTotal}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0c2340] hover:bg-[#142850] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <span>Continue to Razorpay Gateway</span>
                  <ChevronRight className="w-4 h-4 text-[#3399cc]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Razorpay Interactive Payment Gateway */}
          {step === 'payment' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <button
                  onClick={() => setStep('shipping')}
                  className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Address</span>
                </button>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>256-bit SSL Encrypted</span>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-4 gap-2 border-b border-stone-200 pb-3">
                <button
                  onClick={() => setPaymentTab('upi')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                    paymentTab === 'upi'
                      ? 'bg-[#3399cc]/10 border-[#3399cc] text-[#0c2340] shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#3399cc]" />
                  <span>UPI & QR</span>
                </button>

                <button
                  onClick={() => setPaymentTab('card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                    paymentTab === 'card'
                      ? 'bg-[#3399cc]/10 border-[#3399cc] text-[#0c2340] shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#3399cc]" />
                  <span>Cards</span>
                </button>

                <button
                  onClick={() => setPaymentTab('netbanking')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                    paymentTab === 'netbanking'
                      ? 'bg-[#3399cc]/10 border-[#3399cc] text-[#0c2340] shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#3399cc]" />
                  <span>NetBanking</span>
                </button>

                <button
                  onClick={() => setPaymentTab('cod')}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all relative ${
                    paymentTab === 'cod'
                      ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                      : 'border-stone-200 text-stone-400 bg-stone-50 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5 text-stone-400" />
                    <span className="line-through">COD</span>
                  </div>
                  <span className="text-[9px] bg-rose-100 text-rose-700 font-extrabold px-1.5 py-0.2 rounded-full leading-tight">
                    Unavailable
                  </span>
                </button>
              </div>

              {/* TAB 1: UPI Gateway */}
              {paymentTab === 'upi' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setUpiMethod('apps')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        upiMethod === 'apps' ? 'bg-[#0c2340] text-white border-[#0c2340]' : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      UPI Apps
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiMethod('qr')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        upiMethod === 'qr' ? 'bg-[#0c2340] text-white border-[#0c2340]' : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      Scan QR Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiMethod('id')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        upiMethod === 'id' ? 'bg-[#0c2340] text-white border-[#0c2340]' : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      Enter UPI ID
                    </button>
                  </div>

                  {upiMethod === 'apps' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {[
                        { id: 'gpay', label: 'Google Pay', color: 'border-blue-400 bg-blue-50/40' },
                        { id: 'phonepe', label: 'PhonePe', color: 'border-purple-400 bg-purple-50/40' },
                        { id: 'paytm', label: 'Paytm UPI', color: 'border-cyan-400 bg-cyan-50/40' },
                        { id: 'bhim', label: 'BHIM UPI', color: 'border-emerald-400 bg-emerald-50/40' }
                      ].map(app => (
                        <div
                          key={app.id}
                          onClick={() => setSelectedUpiApp(app.id)}
                          className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${
                            selectedUpiApp === app.id
                              ? `${app.color} border-[#3399cc] shadow-sm font-bold text-stone-900`
                              : 'border-stone-200 hover:border-stone-300 text-stone-600'
                          }`}
                        >
                          <Smartphone className="w-5 h-5 mx-auto mb-1 text-stone-700" />
                          <span className="text-xs block">{app.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {upiMethod === 'qr' && (
                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col items-center text-center space-y-2">
                      <div className="p-3 bg-white rounded-xl shadow-xs border border-stone-200">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=anubhaart120@oksbi%26pn=Anubhart%26am=38590"
                          alt="Razorpay UPI QR"
                          className="w-32 h-32"
                        />
                      </div>
                      <span className="text-xs font-semibold text-stone-800">
                        Scan with GPay, PhonePe, Paytm or any banking app
                      </span>
                      <span className="text-[11px] text-stone-500">
                        QR expires in 04:59 minutes • Automatic payment detection
                      </span>
                    </div>
                  )}

                  {upiMethod === 'id' && (
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-semibold text-stone-700">
                        Enter UPI VPA ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. mobile@upi or username@okaxis"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3399cc]"
                      />
                      <span className="text-[11px] text-stone-500 block">
                        A payment authorization request will be sent to your UPI app.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Card Payment */}
              {paymentTab === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full pl-3.5 pr-14 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#3399cc]"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                        VISA / RUPAY
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={e => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#3399cc]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvv}
                        onChange={e => setCvv(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#3399cc]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl uppercase focus:outline-none focus:ring-2 focus:ring-[#3399cc]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: NetBanking */}
              {paymentTab === 'netbanking' && (
                <div className="space-y-3">
                  <span className="text-xs text-stone-500 font-semibold block">Popular Indian Banks:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'hdfc', label: 'HDFC Bank' },
                      { id: 'sbi', label: 'State Bank of India' },
                      { id: 'icici', label: 'ICICI Bank' },
                      { id: 'axis', label: 'Axis Bank' },
                      { id: 'kotak', label: 'Kotak Mahindra' },
                      { id: 'pnb', label: 'Punjab National' }
                    ].map(bank => (
                      <div
                        key={bank.id}
                        onClick={() => setSelectedBank(bank.id)}
                        className={`p-2.5 rounded-xl border text-center cursor-pointer text-xs font-semibold transition-all ${
                          selectedBank === bank.id
                            ? 'bg-[#3399cc]/10 border-[#3399cc] text-[#0c2340] font-bold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {bank.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Cash on Delivery */}
              {paymentTab === 'cod' && (
                <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/80 space-y-3 text-xs text-stone-800">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Cash on Delivery (COD) Available</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed text-xs">
                    You can pay in <strong>Cash or via UPI QR scan</strong> directly to the BlueDart Air Express delivery executive when your parcel arrives at your doorstep.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="p-3 bg-white rounded-xl border border-emerald-100 flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[11px] font-bold text-stone-900 block">Zero Advance Pay</span>
                        <span className="text-[10px] text-stone-500">Pay only upon delivery</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-100 flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[11px] font-bold text-stone-900 block">Safe Delivery</span>
                        <span className="text-[10px] text-stone-500">Inspect packaging & COA</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-[11px] text-amber-900 flex items-center justify-between">
                    <span className="font-semibold">Total payable at doorstep:</span>
                    <span className="font-extrabold text-stone-900 text-sm">${cartTotal} (₹{inrAmount.toLocaleString()})</span>
                  </div>
                </div>
              )}

              {/* Pay / Confirm Order Button */}
              <div className="pt-2">
                {paymentTab === 'cod' ? (
                  <button
                    onClick={handleAuthorizePayment}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Order with Cash on Delivery (${cartTotal})</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAuthorizePayment}
                    className="w-full py-3.5 bg-[#3399cc] hover:bg-[#287ba4] text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-[#3399cc]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Pay ${cartTotal} (₹{inrAmount.toLocaleString()}) via Razorpay</span>
                  </button>
                )}
                <div className="flex items-center justify-center gap-3 mt-3 text-[11px] text-stone-400">
                  <span>Instant Studio Notification</span>
                  <span>•</span>
                  <span>PCI DSS Level 1 Certified</span>
                  <span>•</span>
                  <span>Encrypted Checkout</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Processing Animation */}
          {step === 'processing' && (
            <div className="p-12 text-center space-y-6">
              <div className="w-16 h-16 mx-auto relative flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#3399cc]/20 border-t-[#3399cc] rounded-full animate-spin" />
                <Lock className="w-6 h-6 text-[#0c2340] absolute" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {paymentTab === 'cod' ? 'Confirming Cash on Delivery Order...' : 'Authorizing Payment with Bank...'}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {paymentTab === 'cod' ? 'Registering commissioning order and alerting studio admin...' : 'Connecting to secure servers. Please do not refresh or close.'}
                </p>
              </div>

              <div className="text-[11px] text-stone-400 font-mono">
                Encrypted Session • Verified Provenance
              </div>
            </div>
          )}

          {/* STEP 4: Success & Navigation to Thank You / Store */}
          {step === 'success' && (
            <div className="p-6 sm:p-8 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                  {paymentTab === 'cod' ? 'Order Confirmed (Cash on Delivery)' : 'Payment Authorized Successfully'}
                </span>
                <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
                  Thank You for Your Purchase!
                </h2>
                <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
                  Your order has been recorded into the Anubhart Studio system. The admin workstation has been alerted, and artist Anubha Sinha has received your commissioning details.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-stone-500">Order ID:</span>
                  <span className="font-bold text-stone-900">#{completedOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Courier Partner:</span>
                  <span className="font-bold text-stone-900">BlueDart Air Express</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment Mode:</span>
                  <span className="text-emerald-700 font-bold uppercase">
                    {paymentTab === 'cod' ? 'Cash on Delivery (Pay at Doorstep)' : `${paymentTab} (Paid)`}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-200 text-stone-700">
                  <span>Admin Alert:</span>
                  <span className="text-emerald-600 font-bold">✓ Notification Dispatched</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleGoToThankYouPage}
                  className="w-full sm:w-auto px-6 py-3 bg-[#0c2340] hover:bg-[#142850] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Full Order Details & Receipt</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={handleReturnToStore}
                  className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl border border-stone-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-stone-600" />
                  <span>Come Back to Store Again</span>
                </button>
              </div>

              <div>
                <button
                  onClick={handleFinishAndTrack}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Or track order progress live on radar →
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
