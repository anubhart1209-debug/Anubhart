import { Product, Order, FrameOption, SizeOption, StudioProfile } from '../types';

export const PRIMARY_OWNER_EMAIL = 'anubhart1209@gmail.com';

export const INITIAL_AUTHORIZED_ADMIN_EMAILS = [
  'anubhart1209@gmail.com', // Primary Owner
  'anubhasinha1607@gmail.com',
  'anubhaart120@gmail.com'
];

export const DEFAULT_STUDIO_PROFILE: StudioProfile = {
  artistName: 'Anubha Sinha',
  artistTitle: 'Master Fine Artist & Founder of ANUBHART STUDIO',
  artistPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  cityLocation: 'Varanasi, Uttar Pradesh, India',
  experienceYears: '15+ Years of Mastery',
  artworksCount: '120+ Curated Originals',
  collectorCountries: '18+ Countries Worldwide',

  heroStoryTitle: 'Where Sacred Heritage Meets Contemporary Impasto Expression',
  bioParagraph1: 'ANUBHART STUDIO is dedicated to pure tactile art. Born out of decades of deep contemplation along the historic riverfront ghats of Kashi, our works merge traditional Indian mythological iconography with European chiaroscuro lighting, heavy impasto oil knife work, and hand-applied 24-karat gold leaf gilding.',
  bioParagraph2: 'Every canvas is built from ground zero: hand-stretched pure Belgian linen, sized with traditional rabbit-skin gesso, and painted with lightfast mineral pigments suspended in cold-pressed walnut oil to ensure 100+ years of vibrant archival longevity.',
  artistStatement: 'Art is not a passive wall ornament; it is an altar of living vibration, color resonance, and ancestral memory.',

  pillar1Title: 'Wax-Sealed Physical Certificate',
  pillar1Desc: 'Every artwork arrives with an embossed, wax-sealed Certificate of Authenticity personally hand-signed by master artist Anubha.',
  pillar2Title: 'Bespoke Museum Framing',
  pillar2Desc: 'Natural white oak, architectural deep matte black, and Florentine antiqued gold leaf frames handcrafted in our private workshop.',
  pillar3Title: 'Direct Radar Tracking & Air Cargo',
  pillar3Desc: 'Real-time studio preparation updates, live courier tracking milestones, and climate-controlled insured transit.',

  phone: '+91 98765 43210',
  email: 'anubhart1209@gmail.com',
  address: 'Assi Heritage Corridor, Varanasi, Uttar Pradesh, 221005, India',
  studioHours: 'Mon - Sat, 10:00 AM - 7:00 PM IST (Collector Visits by Appointment)',
  instagramHandle: '@anubhart.studio',
  whatsappNumber: '+91 98765 43210',

  announcementBanner: 'Complimentary Insured Worldwide Transit • Embossed & Wax-Sealed Authenticity Certificates with Every Masterpiece',
  heroHeadline: 'Timeless Original Fine Art by ANUBHART STUDIO',
  heroSubtitle: 'Museum-grade original oil paintings, bespoke custom wood framing, and personalized commissions created by ANUBHART STUDIO.',
  commissionStatus: 'Open for Private Collector Commissions'
};

export const STANDARD_FRAME_OPTIONS: FrameOption[] = [
  {
    id: 'frame-none',
    label: 'Gallery Wrapped (No Outer Frame)',
    priceDelta: 0,
    previewColor: '#e7e5e4',
    description: '1.5" deep gallery wrapped Belgian linen with painted edges. Ready to hang.'
  },
  {
    id: 'frame-floating-oak',
    label: 'Natural Floating White Oak',
    priceDelta: 85,
    previewColor: '#d7ba89',
    description: 'Sustainably sourced natural white oak with a 0.25" float reveal gap.'
  },
  {
    id: 'frame-matte-black',
    label: 'Architectural Matte Black',
    priceDelta: 75,
    previewColor: '#262626',
    description: 'Solid hardwood with smooth satin black lacquer finish. Deep profile.'
  },
  {
    id: 'frame-gold-leaf',
    label: 'Vintage Antiqued Gold Leaf',
    priceDelta: 120,
    previewColor: '#eab308',
    description: 'Hand-applied 24kt style Florentine gold leaf with soft warm antiquing.'
  }
];

export const STANDARD_SIZE_OPTIONS: SizeOption[] = [
  {
    id: 'size-original',
    label: 'Original Studio Scale',
    dimensions: '30" x 24" inches',
    priceMultiplier: 1.0
  },
  {
    id: 'size-medium',
    label: 'Grand Collector Edition',
    dimensions: '40" x 32" inches',
    priceMultiplier: 1.35
  },
  {
    id: 'size-statement',
    label: 'Monumental Statement Canvas',
    dimensions: '54" x 42" inches',
    priceMultiplier: 1.75
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'art-001',
    title: 'Echoes of the Sacred Ghats',
    price: 380,
    originalPrice: 450,
    category: 'Oil Paintings',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An evocative impressionist landscape capturing twilight reflections along the Varanasi riverbanks. Layered with heavy impasto oil strokes using cold-pressed walnut oil and pure cadmium pigments.',
    inStock: true,
    stockCount: 3,
    dimensions: '36" x 24" inches',
    medium: 'Oil on Stretched Belgian Linen',
    year: 2025,
    featured: true,
    rating: 5.0,
    reviewsCount: 28,
    certificateIncluded: true,
    isCustomizable: true,
    customizationOptions: {
      sizes: STANDARD_SIZE_OPTIONS,
      frames: STANDARD_FRAME_OPTIONS,
      allowInscription: true,
      allowReferenceNotes: true,
      baseDimensions: '36" x 24" inches'
    }
  },
  {
    id: 'art-002',
    title: 'Gilded Cosmic Dance',
    price: 490,
    originalPrice: 580,
    category: 'Acrylic & Canvas',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Vibrant fluid acrylic composition embellished with hand-applied 24k gold leaf foil. Represents the sacred cosmic cycle with intricate textured patterns and high-gloss archival varnish.',
    inStock: true,
    stockCount: 2,
    dimensions: '40" x 30" inches',
    medium: 'Acrylic & 24K Gold Leaf on Cotton Duck',
    year: 2024,
    featured: true,
    rating: 4.9,
    reviewsCount: 34,
    certificateIncluded: true,
    isCustomizable: true,
    customizationOptions: {
      sizes: STANDARD_SIZE_OPTIONS,
      frames: STANDARD_FRAME_OPTIONS,
      allowInscription: true,
      allowReferenceNotes: true,
      baseDimensions: '40" x 30" inches'
    }
  },
  {
    id: 'art-003',
    title: 'Silent Monk of Sarnath',
    price: 240,
    category: 'Charcoal & Sketches',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    description: 'Masterwork hyperrealistic portrait drawn in compressed willow charcoal and white pastel highlights. Depicts serene meditation under the bodhi trees with profound chiaroscuro contrast.',
    inStock: true,
    stockCount: 4,
    dimensions: '28" x 20" inches',
    medium: 'Compressed Charcoal on 300gsm Arches Paper',
    year: 2025,
    featured: false,
    rating: 4.8,
    reviewsCount: 19,
    certificateIncluded: true,
    isCustomizable: true,
    customizationOptions: {
      sizes: STANDARD_SIZE_OPTIONS,
      frames: STANDARD_FRAME_OPTIONS,
      allowInscription: true,
      allowReferenceNotes: false,
      baseDimensions: '28" x 20" inches'
    }
  },
  {
    id: 'art-004',
    title: 'Celestial Lotus Bloom',
    price: 320,
    originalPrice: 390,
    category: 'Digital Masterpieces',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    description: 'Limited edition museum-grade Giclée on archival rag. Digital brushwork capturing organic fractal geometry and ethereal radiance in ultramarine and burnt sienna.',
    inStock: true,
    stockCount: 22,
    dimensions: '30" x 20" inches',
    medium: 'UltraChrome HDR Giclée on Hahnemühle Rag',
    year: 2024,
    featured: false,
    rating: 5.0,
    reviewsCount: 16,
    certificateIncluded: true,
    isCustomizable: false
  },
  {
    id: 'art-005',
    title: 'Morning Raga in Red',
    price: 440,
    category: 'Oil Paintings',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=80',
    description: 'Bold expressive study celebrating Indian musical ragas through fiery vermilion, ochre, and deep crimson impasto knife strokes. One-of-a-kind original painting.',
    inStock: false, // Demo out of stock
    stockCount: 0,
    dimensions: '36" x 36" inches',
    medium: 'Oil on Gallery Canvas',
    year: 2024,
    featured: false,
    rating: 4.9,
    reviewsCount: 22,
    certificateIncluded: true,
    isCustomizable: true,
    customizationOptions: {
      sizes: STANDARD_SIZE_OPTIONS,
      frames: STANDARD_FRAME_OPTIONS,
      allowInscription: true,
      allowReferenceNotes: true,
      baseDimensions: '36" x 36" inches'
    }
  },
  {
    id: 'art-006',
    title: 'The Eternal Terracotta Muse',
    price: 520,
    originalPrice: 620,
    category: 'Sculptures & Mixed',
    image: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1200&q=80',
    description: 'Relief mixed-media sculpture mounted on weathered teakwood. Hand-carved terracotta elements blended with oxidized bronze powder and crystalline mineral glazes.',
    inStock: true,
    stockCount: 1,
    dimensions: '24" x 18" x 4" inches',
    medium: 'Terracotta & Cast Bronze on Teak Wood',
    year: 2025,
    featured: true,
    rating: 5.0,
    reviewsCount: 14,
    certificateIncluded: true,
    isCustomizable: false
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'order_rcpt_88291',
    items: [
      {
        id: 'art-001-custom-1',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        unitPrice: 465,
        customization: {
          selectedSize: 'Grand Collector Edition (40" x 32")',
          selectedFrame: 'Natural Floating White Oak',
          inscription: 'To Priya & Rohan - Celebrating your new home in joy.',
          notes: 'Please apply a slightly darker varnish tone on edges.',
          additionalCost: 85
        }
      }
    ],
    totalAmount: 465,
    subtotal: 465,
    shippingFee: 0,
    taxAmount: 0,
    shippingAddress: {
      fullName: 'Private Art Collector',
      phone: '+91 98765 43210',
      street: '42 Crescent Avenue, Civil Lines',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110054',
      landmark: 'Near Embassy Quarter'
    },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'Shipped',
    createdAt: 'Sep 18, 2025 at 02:45 PM',
    userEmail: 'anubaart1209@gmail.com',
    userName: 'Anubha Sinha',
    transactionId: 'pay_RPZ8841920X',
    razorpayPaymentId: 'pay_RPZ8841920X',
    trackingNumber: 'BLUEDART-889104829',
    courierPartner: 'BlueDart Air Express',
    estimatedDelivery: 'Sep 22, 2025',
    customerNote: 'Fragile artwork, handle with white gloves.',
    trackingTimeline: [
      {
        title: 'Order Placed & Verified',
        location: 'ANUBHART STUDIO Online Gallery',
        timestamp: '18 Sep 2025, 02:45 PM',
        completed: true,
        note: 'Payment authorized via Razorpay UPI.'
      },
      {
        title: 'Studio Inspection & Custom Framing',
        location: 'ANUBHART STUDIO Central Studio, Varanasi',
        timestamp: '19 Sep 2025, 10:15 AM',
        completed: true,
        note: 'Natural White Oak floating frame attached. Certificate of Authenticity embossed.'
      },
      {
        title: 'Dispatched & Handed to BlueDart Express',
        location: 'Varanasi Hub (VNS-01)',
        timestamp: '19 Sep 2025, 04:30 PM',
        completed: true,
        current: true,
        note: 'Air cargo package scanned. Temperature-controlled transit.'
      },
      {
        title: 'In Transit to Regional Destination',
        location: 'Delhi Gateway Distribution Center',
        timestamp: 'Expected 21 Sep 2025',
        completed: false
      },
      {
        title: 'Delivered to Doorstep',
        location: 'Gurugram, Haryana',
        timestamp: 'Estimated 22 Sep 2025',
        completed: false
      }
    ]
  }
];
