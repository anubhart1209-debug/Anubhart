export type ProductCategory = 
  | 'Oil Paintings' 
  | 'Acrylic & Canvas' 
  | 'Charcoal & Sketches' 
  | 'Digital Masterpieces' 
  | 'Art Prints' 
  | 'Sculptures & Mixed';

export interface FrameOption {
  id: string;
  label: string;
  priceDelta: number;
  previewColor: string;
  description: string;
}

export interface SizeOption {
  id: string;
  label: string;
  dimensions: string;
  priceMultiplier: number;
}

export interface CustomizationOptions {
  sizes?: SizeOption[];
  frames?: FrameOption[];
  allowInscription?: boolean;
  allowReferenceNotes?: boolean;
  baseDimensions?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  image: string;
  additionalImages?: string[];
  description: string;
  inStock: boolean;
  stockCount: number;
  dimensions: string;
  medium: string;
  year: number;
  featured?: boolean;
  rating: number;
  reviewsCount: number;
  certificateIncluded: boolean;
  // Customization capabilities
  isCustomizable?: boolean;
  customizationOptions?: CustomizationOptions;
}

export interface ItemCustomization {
  selectedSize?: string;
  selectedFrame?: string;
  inscription?: string;
  notes?: string;
  additionalCost: number;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + hash of customization)
  product: Product;
  quantity: number;
  customization?: ItemCustomization;
  unitPrice: number; // base price + customization additionalCost
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'customer';
  phone?: string;
  savedAddress?: ShippingAddress;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface TrackingEvent {
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
  note?: string;
}

export type OrderStatus = 'Placed' | 'Processing' | 'Shipped' | 'OutForDelivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string; // Razorpay format e.g. order_rcpt_88921
  items: CartItem[];
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount?: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'razorpay' | 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'paid' | 'pending';
  orderStatus: OrderStatus;
  createdAt: string;
  userEmail: string;
  userName: string;
  transactionId: string;
  razorpayPaymentId?: string;
  trackingNumber: string;
  courierPartner: string;
  estimatedDelivery: string;
  trackingTimeline: TrackingEvent[];
  cancelReason?: string;
  customerNote?: string;
}

export type ActivePortal = 'consumer' | 'admin';
export type ConsumerTab = 'store' | 'tracking' | 'about' | 'order-confirmation';
export type AdminTab = 'catalog' | 'orders' | 'profile' | 'settings';

export interface AdminNotification {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  firstItemTitle: string;
  totalAmount: number;
  paymentMethod: Order['paymentMethod'];
  paymentStatus: Order['paymentStatus'];
  timestamp: string;
  isRead: boolean;
}

export interface StudioProfile {
  // Artist Identity & Portrait ("my face")
  artistName: string;
  artistTitle: string;
  artistPhoto: string;
  cityLocation: string;
  experienceYears: string;
  artworksCount: string;
  collectorCountries: string;
  
  // Biography & Curatorial Story ("my bio")
  heroStoryTitle: string;
  bioParagraph1: string;
  bioParagraph2: string;
  artistStatement: string;
  
  // Studio Pillars & Guarantees
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;

  // Contact Desk & Channels ("my phone number, etc.")
  phone: string;
  email: string;
  address: string;
  studioHours: string;
  instagramHandle: string;
  whatsappNumber: string;

  // Global Website Elements ("all the parts of the website")
  announcementBanner: string;
  heroHeadline: string;
  heroSubtitle: string;
  commissionStatus: string;
}
