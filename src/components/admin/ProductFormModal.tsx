import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, CustomizationOptions, FrameOption, SizeOption } from '../../types';
import { X, Upload, Sparkles, Check, Image as ImageIcon, Sliders, Ruler, Frame } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  initialProduct?: Product | null;
}

const CATEGORIES: ProductCategory[] = [
  'Oil Paintings',
  'Acrylic & Canvas',
  'Charcoal & Sketches',
  'Digital Masterpieces',
  'Art Prints',
  'Sculptures & Mixed'
];

const PRESET_ART_IMAGES = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1200&q=80'
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialProduct
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('250');
  const [originalPrice, setOriginalPrice] = useState('300');
  const [category, setCategory] = useState<ProductCategory>('Oil Paintings');
  const [image, setImage] = useState(PRESET_ART_IMAGES[0]);
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('30" x 24" inches');
  const [medium, setMedium] = useState('Oil on Stretched Linen Canvas');
  const [year, setYear] = useState(2025);
  const [inStock, setInStock] = useState(true);
  const [stockCount, setStockCount] = useState(1);
  const [featured, setFeatured] = useState(false);

  // Customization controls
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [allowFrames, setAllowFrames] = useState(true);
  const [allowSizes, setAllowSizes] = useState(true);
  const [allowInscription, setAllowInscription] = useState(true);

  useEffect(() => {
    if (initialProduct) {
      setTitle(initialProduct.title);
      setPrice(initialProduct.price.toString());
      setOriginalPrice(initialProduct.originalPrice ? initialProduct.originalPrice.toString() : '');
      setCategory(initialProduct.category);
      setImage(initialProduct.image);
      setDescription(initialProduct.description);
      setDimensions(initialProduct.dimensions);
      setMedium(initialProduct.medium);
      setYear(initialProduct.year);
      setInStock(initialProduct.inStock);
      setStockCount(initialProduct.stockCount);
      setFeatured(!!initialProduct.featured);
      setIsCustomizable(!!initialProduct.isCustomizable);
      setAllowFrames(!!initialProduct.customizationOptions?.frames?.length);
      setAllowSizes(!!initialProduct.customizationOptions?.sizes?.length);
      setAllowInscription(!!initialProduct.customizationOptions?.allowInscription);
    } else {
      setTitle('');
      setPrice('275');
      setOriginalPrice('340');
      setCategory('Oil Paintings');
      setImage(PRESET_ART_IMAGES[0]);
      setDescription('Original studio artwork with embossed signed certificate of authenticity included.');
      setDimensions('30" x 24" inches');
      setMedium('Oil on Stretched Linen Canvas');
      setYear(2025);
      setInStock(true);
      setStockCount(1);
      setFeatured(false);
      setIsCustomizable(false);
      setAllowFrames(true);
      setAllowSizes(true);
      setAllowInscription(true);
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      alert('Please provide a title and image URL.');
      return;
    }

    const numericPrice = parseFloat(price) || 0;
    const numericOriginalPrice = originalPrice ? parseFloat(originalPrice) : undefined;

    const defaultFrames: FrameOption[] = [
      { id: 'none', label: 'Raw Gallery Canvas (No Frame)', priceDelta: 0, previewColor: '#e7e5e4', description: 'Museum-wrapped stretched edges ready to hang as-is' },
      { id: 'gold-leaf', label: 'Florentine Antiqued 24K Gold Leaf', priceDelta: 85, previewColor: '#d4af37', description: 'Hand-gilded Italian wood with velvet slip liner' },
      { id: 'matte-black', label: 'Minimalist Charcoal Matte Black', priceDelta: 60, previewColor: '#1c1917', description: 'Modern gallery depth floating wood frame in obsidian' },
      { id: 'white-oak', label: 'Natural Solid White Oak', priceDelta: 75, previewColor: '#d7c4a7', description: 'Sustainably sourced Scandinavian hardwood edge' }
    ];

    const defaultSizes: SizeOption[] = [
      { id: 'standard', label: 'Standard Gallery', dimensions: dimensions.trim() || '30" x 24"', priceMultiplier: 1.0 },
      { id: 'large', label: 'Grand Statement', dimensions: '40" x 30" (Grand Scale)', priceMultiplier: 1.35 },
      { id: 'oversized', label: 'Collector Exhibition', dimensions: '48" x 36" (Statement Scale)', priceMultiplier: 1.65 }
    ];

    onSubmit({
      title: title.trim(),
      price: numericPrice,
      originalPrice: numericOriginalPrice,
      category,
      image: image.trim(),
      additionalImages: initialProduct?.additionalImages || [],
      description: description.trim(),
      inStock,
      stockCount: inStock ? (stockCount > 0 ? stockCount : 1) : 0,
      dimensions: dimensions.trim(),
      medium: medium.trim(),
      year: Number(year) || 2025,
      featured,
      rating: initialProduct?.rating || 5.0,
      reviewsCount: initialProduct?.reviewsCount || 0,
      certificateIncluded: true,
      isCustomizable,
      customizationOptions: isCustomizable ? {
        frames: allowFrames ? defaultFrames : [],
        sizes: allowSizes ? defaultSizes : [],
        allowInscription
      } : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl max-w-2xl w-full text-stone-100 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div>
            <h2 className="font-bold text-base sm:text-lg text-white">
              {initialProduct ? 'Edit Catalog Artwork' : 'Add New Art to Catalog'}
            </h2>
            <p className="text-xs text-stone-400">
              Changes reflect immediately on the Anubhart storefront.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Artwork Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ganga Aarti: Twilight Devotion"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category & Medium */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Art Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Artistic Medium</label>
              <input
                type="text"
                value={medium}
                onChange={e => setMedium(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Studio Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Original Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Optional"
                value={originalPrice}
                onChange={e => setOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Stock Count</label>
              <input
                type="number"
                min="0"
                value={stockCount}
                onChange={e => setStockCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Creation Year</label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(parseInt(e.target.value) || 2025)}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Dimensions</label>
            <input
              type="text"
              value={dimensions}
              onChange={e => setDimensions(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white font-mono"
            />
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Artwork Image URL</label>
            <input
              type="url"
              required
              value={image}
              onChange={e => setImage(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white font-mono"
            />
            {/* Presets */}
            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
              <span className="text-[10px] text-stone-500 whitespace-nowrap">Presets:</span>
              {PRESET_ART_IMAGES.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`preset-${i}`}
                  onClick={() => setImage(img)}
                  className={`w-8 h-8 rounded object-cover cursor-pointer border ${
                    image === img ? 'border-amber-400 scale-105' : 'border-stone-700 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Curatorial Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none"
            />
          </div>

          {/* CUSTOMIZATION OPTIONS SECTION */}
          <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-white">Customization Capabilities</span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCustomizable}
                  onChange={e => setIsCustomizable(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            <p className="text-[11px] text-stone-400">
              {isCustomizable
                ? 'Collectors can customize framing options, dimensions, and custom gift inscriptions.'
                : 'Artwork will be sold as fixed original item only (no customer alterations).'}
            </p>

            {isCustomizable && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-stone-800 text-xs">
                <label className="flex items-center gap-2 cursor-pointer p-2 bg-stone-900 rounded-xl border border-stone-800">
                  <input
                    type="checkbox"
                    checked={allowFrames}
                    onChange={e => setAllowFrames(e.target.checked)}
                    className="accent-amber-500"
                  />
                  <span>Frame Options</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 bg-stone-900 rounded-xl border border-stone-800">
                  <input
                    type="checkbox"
                    checked={allowSizes}
                    onChange={e => setAllowSizes(e.target.checked)}
                    className="accent-amber-500"
                  />
                  <span>Size Scales</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 bg-stone-900 rounded-xl border border-stone-800">
                  <input
                    type="checkbox"
                    checked={allowInscription}
                    onChange={e => setAllowInscription(e.target.checked)}
                    className="accent-amber-500"
                  />
                  <span>Back Inscription</span>
                </label>
              </div>
            )}
          </div>

          {/* Stock and Featured Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-950 border border-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={e => setInStock(e.target.checked)}
                className="w-4 h-4 accent-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-white block">Mark In Stock</span>
                <span className="text-[10px] text-stone-400">Uncheck to mark Out of Stock on storefront</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-950 border border-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-white block">Curator's Feature</span>
                <span className="text-[10px] text-stone-400">Spotlight in top gallery hero banner</span>
              </div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {initialProduct ? 'Save Artwork Updates' : 'Add to Studio Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
