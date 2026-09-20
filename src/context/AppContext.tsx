import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  Order, 
  User, 
  CartItem, 
  ItemCustomization,
  ActivePortal, 
  ConsumerTab, 
  AdminTab,
  ShippingAddress,
  OrderStatus,
  StudioProfile,
  AdminNotification
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS,
  INITIAL_AUTHORIZED_ADMIN_EMAILS,
  DEFAULT_STUDIO_PROFILE,
  PRIMARY_OWNER_EMAIL
} from '../data/initialData';
import { 
  secureVaultSetItem, 
  secureVaultGetItemSync, 
  secureVaultRemoveItem,
  inspectVaultRecords, 
  reKeyEntireVault, 
  VaultRecordInspection, 
  isVaultLockdownActive 
} from '../utils/secureVault';
import {
  getCyberDefenseStatus,
  getAllIncidentLogs,
  simulateCyberAttack,
  toggleEmergencyLockdown,
  subscribeToCyberIncidents,
  verifyTrafficVelocity,
  CyberDefenseStatus,
  CyberIncident,
  AttackVectorType
} from '../utils/cyberDefenseEngine';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface FlyingItemData {
  id: string;
  image: string;
  startX: number;
  startY: number;
}

interface AppContextType {
  // Navigation
  activePortal: ActivePortal;
  setActivePortal: (portal: ActivePortal) => void;
  consumerTab: ConsumerTab;
  setConsumerTab: (tab: ConsumerTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  toggleStock: (id: string) => void;
  deleteProduct: (id: string) => void;

  // Modals & Active Elements
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  customizingProduct: Product | null;
  setCustomizingProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isGoogleSignInOpen: boolean;
  setIsGoogleSignInOpen: (open: boolean) => void;
  isSecurityModalOpen: boolean;
  setIsSecurityModalOpen: (open: boolean) => void;
  signInIntent: 'checkout' | 'admin' | 'tracking' | null;
  setSignInIntent: (intent: 'checkout' | 'admin' | 'tracking' | null) => void;

  // Flying bag animation
  flyingItems: FlyingItemData[];
  triggerBagDrop: (product: Product, event?: React.MouseEvent) => void;
  isBagBouncing: boolean;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, customization?: ItemCustomization, event?: React.MouseEvent) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Auth & Permissions
  currentUser: User | null;
  primaryOwnerEmail: string;
  authorizedAdminEmails: string[];
  addAuthorizedEmail: (email: string) => void;
  removeAuthorizedEmail: (email: string) => void;
  loginWithGoogle: (email: string, name: string, avatar?: string) => { success: boolean; isAuthorizedAdmin: boolean };
  logout: () => void;

  // Studio Profile & Website Content Editor ("my face, my bio, everything, my phone number")
  studioProfile: StudioProfile;
  updateStudioProfile: (updates: Partial<StudioProfile>) => void;
  resetStudioProfile: () => void;

  // Orders & Tracking
  orders: Order[];
  selectedTrackingOrder: Order | null;
  setSelectedTrackingOrder: (order: Order | null) => void;
  lastConfirmedOrder: Order | null;
  setLastConfirmedOrder: (order: Order | null) => void;
  createOrder: (orderData: {
    shippingAddress: ShippingAddress;
    paymentMethod: Order['paymentMethod'];
    transactionId: string;
    razorpayPaymentId?: string;
    customerNote?: string;
  }) => Order;
  cancelOrder: (orderId: string, reason: string) => boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  addTrackingMilestone: (orderId: string, event: { status: OrderStatus; description: string; location: string }) => void;

  // Admin Notifications for New Orders
  adminNotifications: AdminNotification[];
  unreadAdminNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;

  // Military-Grade Encrypted Vault & Cyber Defense
  cyberStatus: CyberDefenseStatus;
  cyberIncidents: CyberIncident[];
  triggerSimulatedAttack: (vector: AttackVectorType) => CyberIncident;
  toggleLockdown: (enable: boolean, passphrase?: string) => { success: boolean; message: string };
  isLockdownActive: boolean;
  reKeyVault: () => Promise<void>;
  vaultInspections: VaultRecordInspection[];
  refreshVaultInspections: () => Promise<void>;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Portals & Tabs
  const [activePortal, setActivePortalState] = useState<ActivePortal>(() => {
    const saved = localStorage.getItem('anubhart_active_portal') || localStorage.getItem('anubhav_active_portal');
    return (saved as ActivePortal) || 'consumer';
  });
  const [consumerTab, setConsumerTab] = useState<ConsumerTab>('store');
  const [adminTab, setAdminTab] = useState<AdminTab>('catalog');

  const setActivePortal = (portal: ActivePortal) => {
    setActivePortalState(portal);
    localStorage.setItem('anubhart_active_portal', portal);
  };

  // Products - Encrypted in Secure Vault
  const [products, setProducts] = useState<Product[]>(() => {
    return secureVaultGetItemSync<Product[]>('anubhart_art_products', INITIAL_PRODUCTS);
  });

  // Authorized Admin Emails - Encrypted in Secure Vault
  const [authorizedAdminEmails, setAuthorizedAdminEmails] = useState<string[]>(() => {
    const emails = secureVaultGetItemSync<string[]>('anubhart_admin_emails', INITIAL_AUTHORIZED_ADMIN_EMAILS);
    const cleansed = emails
      .map(e => (typeof e === 'string' && e.toLowerCase() === 'anubaart1209@gmail.com' ? PRIMARY_OWNER_EMAIL : e))
      .filter(e => e && typeof e === 'string');
    return Array.from(new Set([PRIMARY_OWNER_EMAIL, ...cleansed]));
  });

  // Studio Profile & Website Content - Encrypted in Secure Vault
  const [studioProfile, setStudioProfile] = useState<StudioProfile>(() => {
    const profile = secureVaultGetItemSync<StudioProfile>('anubhart_studio_profile', DEFAULT_STUDIO_PROFILE);
    if (profile.email === 'anubaart1209@gmail.com') {
      profile.email = PRIMARY_OWNER_EMAIL;
    }
    return profile;
  });

  useEffect(() => {
    secureVaultSetItem('anubhart_studio_profile', studioProfile);
  }, [studioProfile]);

  const updateStudioProfile = (updates: Partial<StudioProfile>) => {
    setStudioProfile(prev => {
      const updated = { ...prev, ...updates };
      secureVaultSetItem('anubhart_studio_profile', updated);
      return updated;
    });
    showToast('Studio profile encrypted & saved to Vault!', 'success');
  };

  const resetStudioProfile = () => {
    setStudioProfile(DEFAULT_STUDIO_PROFILE);
    secureVaultSetItem('anubhart_studio_profile', DEFAULT_STUDIO_PROFILE);
    showToast('Restored original studio profile in Vault', 'info');
  };

  // Current User - Encrypted in Secure Vault
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return secureVaultGetItemSync<User | null>('anubhart_current_user', null);
  });

  // Cart - Encrypted in Secure Vault
  const [cart, setCart] = useState<CartItem[]>(() => {
    return secureVaultGetItemSync<CartItem[]>('anubhart_cart', []);
  });

  // Orders - Encrypted in Secure Vault
  const [orders, setOrders] = useState<Order[]>(() => {
    return secureVaultGetItemSync<Order[]>('anubhart_orders', INITIAL_ORDERS);
  });

  // Active selections & Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(() => {
    return secureVaultGetItemSync<Order | null>('anubhart_last_confirmed_order', null);
  });

  // Admin Notifications for Orders - Encrypted in Secure Vault
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(() => {
    return secureVaultGetItemSync<AdminNotification[]>('anubhart_admin_notifications', [
      {
        id: 'notif_init_1',
        orderId: 'order_rcpt_88291',
        customerName: 'Priya Sharma',
        customerEmail: 'priya.sharma@gmail.com',
        itemsCount: 1,
        firstItemTitle: 'Echoes of the Sacred Ghats',
        totalAmount: 465,
        paymentMethod: 'card',
        paymentStatus: 'paid',
        timestamp: 'Sep 18, 2026 at 04:30 PM',
        isRead: false
      }
    ]);
  });

  const unreadAdminNotificationsCount = adminNotifications.filter(n => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setAdminNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setAdminNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAllNotifications = () => {
    setAdminNotifications([]);
  };

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isGoogleSignInOpen, setIsGoogleSignInOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [signInIntent, setSignInIntent] = useState<'checkout' | 'admin' | 'tracking' | null>(null);

  // Bag Drop Animation State
  const [flyingItems, setFlyingItems] = useState<FlyingItemData[]>([]);
  const [isBagBouncing, setIsBagBouncing] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Military-Grade Encrypted Vault Sync
  useEffect(() => {
    secureVaultSetItem('anubhart_art_products', products);
  }, [products]);

  useEffect(() => {
    secureVaultSetItem('anubhart_cart', cart);
  }, [cart]);

  useEffect(() => {
    secureVaultSetItem('anubhart_orders', orders);
  }, [orders]);

  useEffect(() => {
    if (lastConfirmedOrder) {
      secureVaultSetItem('anubhart_last_confirmed_order', lastConfirmedOrder);
    }
  }, [lastConfirmedOrder]);

  useEffect(() => {
    secureVaultSetItem('anubhart_admin_notifications', adminNotifications);
  }, [adminNotifications]);

  useEffect(() => {
    secureVaultSetItem('anubhart_admin_emails', authorizedAdminEmails);
  }, [authorizedAdminEmails]);

  useEffect(() => {
    if (currentUser) {
      secureVaultSetItem('anubhart_current_user', currentUser);
    } else {
      secureVaultRemoveItem('anubhart_current_user');
    }
  }, [currentUser]);

  // Cyber Defense State & Intrusion Monitoring
  const [cyberStatus, setCyberStatus] = useState<CyberDefenseStatus>(() => getCyberDefenseStatus());
  const [cyberIncidents, setCyberIncidents] = useState<CyberIncident[]>(() => getAllIncidentLogs());
  const [vaultInspections, setVaultInspections] = useState<VaultRecordInspection[]>([]);
  const isLockdownActive = isVaultLockdownActive();

  const refreshVaultInspections = async () => {
    try {
      const records = await inspectVaultRecords();
      setVaultInspections(records);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshVaultInspections();
    // Subscribe to live cyber incident alerts
    const unsubscribe = subscribeToCyberIncidents(newIncident => {
      setCyberIncidents(getAllIncidentLogs());
      setCyberStatus(getCyberDefenseStatus());
      showToast(`🛡️ Cyber Defense Alert: Countermeasure engaged against [${newIncident.vector}]. Attack Neutralized!`, 'info');
    });
    return unsubscribe;
  }, []);

  const triggerSimulatedAttack = (vector: AttackVectorType): CyberIncident => {
    const inc = simulateCyberAttack(vector);
    setCyberIncidents(getAllIncidentLogs());
    setCyberStatus(getCyberDefenseStatus());
    refreshVaultInspections();
    return inc;
  };

  const toggleLockdown = (enable: boolean, passphrase?: string) => {
    const result = toggleEmergencyLockdown(enable, passphrase);
    setCyberStatus(getCyberDefenseStatus());
    if (result.success) {
      showToast(result.message, enable ? 'error' : 'success');
    } else {
      showToast(result.message, 'error');
    }
    return result;
  };

  const reKeyVault = async () => {
    try {
      const res = await reKeyEntireVault();
      await refreshVaultInspections();
      setCyberStatus(getCyberDefenseStatus());
      showToast(`Vault Re-Keyed: Rotated AES-256 keys and re-encrypted ${res.count} records.`, 'success');
    } catch (e) {
      showToast('Vault Re-Keying encountered an issue.', 'error');
    }
  };

  // Trigger Bag Drop Animation
  const triggerBagDrop = (product: Product, event?: React.MouseEvent) => {
    const startX = event ? event.clientX : window.innerWidth / 2;
    const startY = event ? event.clientY : window.innerHeight / 2;
    const flyingId = Date.now().toString() + Math.random().toString(36).substring(2, 5);

    setFlyingItems(prev => [...prev, { id: flyingId, image: product.image, startX, startY }]);

    // Trigger bounce on the bag when particle lands
    setTimeout(() => {
      setIsBagBouncing(true);
      setTimeout(() => setIsBagBouncing(false), 600);
    }, 550);

    // Clean up flying item
    setTimeout(() => {
      setFlyingItems(prev => prev.filter(item => item.id !== flyingId));
    }, 800);
  };

  // Cart Operations
  const addToCart = (
    product: Product, 
    quantity = 1, 
    customization?: ItemCustomization,
    event?: React.MouseEvent
  ): boolean => {
    if (!product.inStock || product.stockCount <= 0) {
      showToast(`"${product.title}" is currently out of stock`, 'error');
      return false;
    }

    // Trigger visual item drop into bag animation!
    triggerBagDrop(product, event);

    const priceAdjustment = customization?.additionalCost || 0;
    const unitPrice = product.price + priceAdjustment;
    
    // Hash of customization to distinguish customized variants of same product
    const customKey = customization 
      ? `${customization.selectedSize || ''}-${customization.selectedFrame || ''}-${customization.inscription || ''}`
      : 'standard';
    const cartItemId = `${product.id}-${customKey}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stockCount) {
          showToast(`Only ${product.stockCount} pieces available in studio`, 'info');
          updated[existingIndex].quantity = product.stockCount;
        } else {
          updated[existingIndex].quantity = newQty;
        }
        return updated;
      }
      return [...prev, {
        id: cartItemId,
        product,
        quantity: Math.min(quantity, product.stockCount),
        customization,
        unitPrice
      }];
    });

    showToast(`Added "${product.title}" to your Bag`, 'success');
    return true;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from your Bag', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          const clamped = Math.min(quantity, item.product.stockCount);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Product Operations (Admin)
  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const id = `art-${Date.now().toString(36)}`;
    const product: Product = {
      ...newProductData,
      id,
      rating: 5.0,
      reviewsCount: 1,
      certificateIncluded: true
    };
    setProducts(prev => [product, ...prev]);
    showToast(`"${product.title}" added to gallery catalog`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          if (updated.stockCount <= 0) {
            updated.inStock = false;
          } else if (updates.inStock === true && updated.stockCount === 0) {
            updated.stockCount = 1;
          }
          return updated;
        }
        return p;
      })
    );
    showToast('Artwork details updated', 'success');
  };

  const toggleStock = (id: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStatus = !p.inStock;
          const newCount = newStatus ? (p.stockCount > 0 ? p.stockCount : 1) : 0;
          showToast(`"${p.title}" marked as ${newStatus ? 'In Stock' : 'Out of Stock'}`, 'info');
          return { ...p, inStock: newStatus, stockCount: newCount };
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    const p = products.find(prod => prod.id === id);
    setProducts(prev => prev.filter(prod => prod.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
    showToast(`"${p?.title || 'Artwork'}" removed from catalog`, 'info');
  };

  // Auth Operations
  const addAuthorizedEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    if (authorizedAdminEmails.includes(clean)) {
      showToast('This email is already in the authorized admin list', 'info');
      return;
    }
    setAuthorizedAdminEmails(prev => [...prev, clean]);
    showToast(`Authorized "${clean}" for Anubhart Studio Admin`, 'success');
  };

  const removeAuthorizedEmail = (email: string) => {
    const clean = email.toLowerCase().trim();
    if (clean === PRIMARY_OWNER_EMAIL.toLowerCase()) {
      showToast(`${PRIMARY_OWNER_EMAIL} is the Primary Owner of Anubhart and cannot be removed`, 'error');
      return;
    }
    if (authorizedAdminEmails.length <= 1) {
      showToast('At least one admin account must remain authorized', 'error');
      return;
    }
    setAuthorizedAdminEmails(prev => prev.filter(e => e.toLowerCase() !== clean));
    showToast(`Revoked studio access for ${email}`, 'info');
  };

  const loginWithGoogle = (email: string, name: string, avatar?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const isAuthorizedAdmin = authorizedAdminEmails.some(e => e.toLowerCase() === cleanEmail);

    const user: User = {
      id: `usr_${Date.now()}`,
      name: name || cleanEmail.split('@')[0],
      email: cleanEmail,
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || cleanEmail)}`,
      role: isAuthorizedAdmin ? 'admin' : 'customer'
    };

    setCurrentUser(user);
    showToast(`Signed in as ${user.name} (${user.email})`, 'success');
    return { success: true, isAuthorizedAdmin };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
  };

  // Orders & Tracking Operations
  const createOrder = (orderData: {
    shippingAddress: ShippingAddress;
    paymentMethod: Order['paymentMethod'];
    transactionId: string;
    razorpayPaymentId?: string;
    customerNote?: string;
  }): Order => {
    if (isVaultLockdownActive()) {
      showToast('CYBER LOCKDOWN ACTIVE: Order creation is paused while the vault is air-gapped.', 'error');
      throw new Error('SECURITY_LOCKDOWN_ENFORCED');
    }
    const velocity = verifyTrafficVelocity('order_create');
    if (!velocity.allowed) {
      showToast('Volumetric cyber defense engaged: Too many requests. Please wait a few seconds.', 'error');
      throw new Error('RATE_LIMIT_EXCEEDED');
    }

    const orderNum = Math.floor(100000 + Math.random() * 900000);
    const trackingNum = `ANUBHART-AIR-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' at ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const isCOD = orderData.paymentMethod === 'cod';

    const newOrder: Order = {
      id: `order_rcpt_${orderNum}`,
      items: [...cart],
      totalAmount: cartTotal,
      subtotal: cartTotal,
      shippingFee: 0,
      taxAmount: 0,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: isCOD ? 'pending' : 'paid',
      orderStatus: 'Placed',
      createdAt: formattedDate,
      userEmail: currentUser?.email || 'guest@anubhart.com',
      userName: currentUser?.name || orderData.shippingAddress.fullName,
      transactionId: orderData.transactionId,
      razorpayPaymentId: orderData.razorpayPaymentId || orderData.transactionId,
      trackingNumber: trackingNum,
      courierPartner: 'BlueDart Air Express',
      estimatedDelivery: new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      customerNote: orderData.customerNote,
      trackingTimeline: [
        {
          title: isCOD ? 'Order Placed (Cash on Delivery)' : 'Order Placed & Payment Verified',
          location: 'Anubhart Online Gallery',
          timestamp: formattedDate,
          completed: true,
          current: true,
          note: isCOD
            ? `Order confirmed with Cash on Delivery (${orderData.transactionId}). $${cartTotal} (Cash/UPI) will be collected upon delivery by courier.`
            : `Payment authorized via ${orderData.paymentMethod.toUpperCase()} (${orderData.transactionId}). Studio has received your commissioning request.`
        },
        {
          title: 'Studio Preparation & Framing',
          location: 'Anubhart Master Studio, Varanasi',
          timestamp: 'Scheduled within 24-48 hrs',
          completed: false,
          note: 'Master artist inspection, protective acid-free varnishing, bespoke frame mounting, and Certificate of Authenticity signing.'
        },
        {
          title: 'Secure Dispatched & Transit Scan',
          location: 'Varanasi Central Air Cargo Hub',
          timestamp: 'Pending studio handover',
          completed: false,
          note: 'Handed over to BlueDart Air Express with temperature-controlled crating.'
        },
        {
          title: 'Out for Delivery to Address',
          location: `${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}`,
          timestamp: 'Estimated within 3-4 days',
          completed: false,
          note: 'Courier delivery agent will call prior to arrival. Signature required.'
        },
        {
          title: 'Delivered to Collector',
          location: orderData.shippingAddress.city,
          timestamp: 'Final Destination',
          completed: false
        }
      ]
    };

    // Deduct stock for each product by the exact quantity ordered
    // For example: 22 in stock minus 1 ordered becomes 21
    setProducts(prev =>
      prev.map(p => {
        const inCart = cart.find(ci => ci.product.id === p.id);
        if (inCart) {
          const orderedQty = inCart.quantity || 1;
          const newStock = Math.max(0, p.stockCount - orderedQty);
          return {
            ...p,
            stockCount: newStock,
            inStock: newStock > 0
          };
        }
        return p;
      })
    );

    // Save order
    setOrders(prev => [newOrder, ...prev]);
    setSelectedTrackingOrder(newOrder);
    setLastConfirmedOrder(newOrder);

    // Create and dispatch real-time notification for Admin Workstation
    const firstItem = newOrder.items[0];
    const totalQty = newOrder.items.reduce((acc, it) => acc + (it.quantity || 1), 0);
    const newAdminNotif: AdminNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      orderId: newOrder.id,
      customerName: newOrder.userName,
      customerEmail: newOrder.userEmail,
      itemsCount: totalQty,
      firstItemTitle: firstItem?.product.title || 'Studio Artwork Piece',
      totalAmount: newOrder.totalAmount,
      paymentMethod: newOrder.paymentMethod,
      paymentStatus: newOrder.paymentStatus,
      timestamp: formattedDate,
      isRead: false
    };
    setAdminNotifications(prev => [newAdminNotif, ...prev]);

    // Clear cart
    clearCart();

    // Direct consumer site to the dedicated Order Confirmation / Thank You for Purchasing page
    setConsumerTab('order-confirmation');

    showToast(`Order #${newOrder.id} placed! Studio admin notified.`, 'success');

    return newOrder;
  };

  const cancelOrder = (orderId: string, reason: string): boolean => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      showToast('Cannot cancel an order that has already been dispatched', 'error');
      return false;
    }

    const cancelTimestamp = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }) + ' at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            orderStatus: 'Cancelled',
            cancelReason: reason,
            trackingTimeline: [
              ...o.trackingTimeline,
              {
                title: 'Order Cancelled & Refund Initiated',
                location: 'Anubhart Customer Support',
                timestamp: cancelTimestamp,
                completed: true,
                current: true,
                note: `Cancellation reason: ${reason}. Full refund of $${o.totalAmount} will be credited to original payment source within 2-4 business days.`
              }
            ]
          };
        }
        return o;
      })
    );

    showToast(`Order #${orderId} was cancelled. Full refund initiated.`, 'info');
    return true;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }) + ' at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updatedTimeline = o.trackingTimeline.map(step => {
            if (status === 'Processing' && step.title.includes('Studio Preparation')) {
              return { ...step, completed: true, current: true, timestamp: nowStr, note: note || step.note };
            }
            if (status === 'Shipped' && (step.title.includes('Secure Dispatched') || step.title.includes('Dispatched'))) {
              return { ...step, completed: true, current: true, timestamp: nowStr, note: note || step.note };
            }
            if (status === 'OutForDelivery' && step.title.includes('Out for Delivery')) {
              return { ...step, completed: true, current: true, timestamp: nowStr, note: note || step.note };
            }
            if (status === 'Delivered' && step.title.includes('Delivered')) {
              return { ...step, completed: true, current: true, timestamp: nowStr, note: note || step.note };
            }
            return step;
          });

          return {
            ...o,
            orderStatus: status,
            trackingTimeline: updatedTimeline
          };
        }
        return o;
      })
    );

    showToast(`Order #${orderId} updated to ${status}`, 'success');
  };

  const addTrackingMilestone = (orderId: string, event: { status: OrderStatus; description: string; location: string }) => {
    const timestampStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }) + ' at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updatedTimeline = [
            ...o.trackingTimeline.map(step => ({ ...step, current: false })),
            {
              title: event.description,
              location: event.location,
              timestamp: timestampStr,
              completed: true,
              current: true,
              note: `Admin Milestone update recorded for ${event.status}.`
            }
          ];

          return {
            ...o,
            orderStatus: event.status,
            trackingTimeline: updatedTimeline
          };
        }
        return o;
      })
    );

    showToast(`Milestone published to Order #${orderId} radar!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        activePortal,
        setActivePortal,
        consumerTab,
        setConsumerTab,
        adminTab,
        setAdminTab,

        products,
        addProduct,
        updateProduct,
        toggleStock,
        deleteProduct,

        selectedProduct,
        setSelectedProduct,
        customizingProduct,
        setCustomizingProduct,
        selectedTrackingOrder,
        setSelectedTrackingOrder,

        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isGoogleSignInOpen,
        setIsGoogleSignInOpen,
        isSecurityModalOpen,
        setIsSecurityModalOpen,
        signInIntent,
        setSignInIntent,

        flyingItems,
        triggerBagDrop,
        isBagBouncing,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,

        currentUser,
        primaryOwnerEmail: PRIMARY_OWNER_EMAIL,
        authorizedAdminEmails,
        addAuthorizedEmail,
        removeAuthorizedEmail,
        loginWithGoogle,
        logout,

        studioProfile,
        updateStudioProfile,
        resetStudioProfile,

        orders,
        lastConfirmedOrder,
        setLastConfirmedOrder,
        createOrder,
        cancelOrder,
        updateOrderStatus,
        addTrackingMilestone,

        adminNotifications,
        unreadAdminNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,

        // Military-Grade Encrypted Vault & Cyber Defense
        cyberStatus,
        cyberIncidents,
        triggerSimulatedAttack,
        toggleLockdown,
        isLockdownActive,
        reKeyVault,
        vaultInspections,
        refreshVaultInspections,

        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
