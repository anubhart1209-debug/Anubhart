import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Info, ShieldCheck, Ruler, Palette, FileText, ShoppingBag } from 'lucide-react';
import { Product, FrameOption, SizeOption, ItemCustomization } from '../../types';
import { useApp } from '../../context/AppContext';
import { STANDARD_FRAME_OPTIONS, STANDARD_SIZE_OPTIONS } from '../../data/initialData';

export const ArtworkCustomizerModal: React.FC = () => {
  const { customizingProduct, setCustomizingProduct, addToCart } = useApp();

  const product = customizingProduct;

  const frameOptions: FrameOption[] = product?.customizationOptions?.frames || STANDARD_FRAME_OPTIONS;
  const sizeOptions: SizeOption[] = product?.customizationOptions?.sizes || STANDARD_SIZE_OPTIONS;

  const [selectedSize, setSelectedSize] = useState<SizeOption>(sizeOptions[0]);
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(frameOptions[1] || frameOptions[0]);
  const [inscription, setInscription] = useState('');
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'frame' | 'size' | 'inscription'>('frame');

  if (!product) return null;

  // Calculate pricing
  const basePrice = product.price;
  const sizeMultiplierDelta = Math.round(basePrice * (selectedSize.priceMultiplier - 1));
  const frameDelta = selectedFrame.priceDelta;
  const totalCustomPrice = basePrice + sizeMultiplierDelta + frameDelta;
  const additionalCost = sizeMultiplierDelta + frameDelta;

  const handleAddToBag = (e: React.MouseEvent) => {
    const customization: ItemCustomization = {
      selectedSize: `${selectedSize.label} (${selectedSize.dimensions})`,
      selectedFrame: selectedFrame.label,
      inscription: inscription.trim() || undefined,
      notes: notes.trim() || undefined,
      additionalCost
    };

    addToCart(product, 1, customization, e);
    setCustomizingProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl bg-stone-900 text-stone-100 rounded-3xl shadow-2xl border border-stone-800 overflow-hidden flex flex-col md:flex-row my-auto max-h-[92vh]"
        >
          {/* Close button */}
          <button
            onClick={() => setCustomizingProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-800/80 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Interactive Framing Preview Stage */}
          <div className="md:w-1/2 bg-stone-950 p-6 sm:p-8 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-stone-800">
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Customizer</span>
            </div>

            {/* Framed Canvas Stage */}
            <div className="w-full max-w-sm aspect-4/5 relative flex items-center justify-center p-4">
              <div
                className="relative transition-all duration-300 shadow-2xl overflow-hidden rounded-xs flex items-center justify-center"
                style={{
                  borderWidth: selectedFrame.id === 'frame-none' ? '0px' : '16px',
                  borderStyle: 'solid',
                  borderColor: selectedFrame.previewColor,
                  boxShadow: selectedFrame.id === 'frame-gold-leaf' 
                    ? '0 20px 40px -15px rgba(234, 179, 8, 0.3), inset 0 0 10px rgba(0,0,0,0.5)' 
                    : '0 25px 50px -12px rgba(0,0,0,0.8), inset 0 0 8px rgba(0,0,0,0.4)',
                  padding: selectedFrame.id === 'frame-floating-oak' ? '6px' : '0px',
                  backgroundColor: selectedFrame.id === 'frame-floating-oak' ? '#1c1917' : 'transparent'
                }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover max-h-[340px]"
                />

                {/* Simulated signature inscription preview */}
                {inscription.trim() && (
                  <div className="absolute bottom-2 right-2 bg-stone-950/80 backdrop-blur-xs text-[9px] text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-400/30">
                    Hand-inscribed: "{inscription.slice(0, 24)}{inscription.length > 24 ? '...' : ''}"
                  </div>
                )}
              </div>
            </div>

            {/* Frame specs footer */}
            <div className="mt-4 text-center">
              <span className="text-xs text-stone-400 font-medium block">
                Preview: {selectedFrame.label} • {selectedSize.dimensions}
              </span>
              <span className="text-[11px] text-stone-500 mt-0.5 block">
                Acid-free museum mounting & UV-protective museum glazing included.
              </span>
            </div>
          </div>

          {/* Right: Customization Controls */}
          <div className="md:w-1/2 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  {product.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                  {product.title}
                </h2>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                  Customize framing, proportions, and handwritten canvas inscription by master artist Anubha Sinha.
                </p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-stone-800 text-xs">
                <button
                  onClick={() => setActiveTab('frame')}
                  className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'frame'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Frame Style</span>
                </button>
                <button
                  onClick={() => setActiveTab('size')}
                  className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'size'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Canvas Scale</span>
                </button>
                <button
                  onClick={() => setActiveTab('inscription')}
                  className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'inscription'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Dedication</span>
                </button>
              </div>

              {/* Tab 1: Frame Selection */}
              {activeTab === 'frame' && (
                <div className="space-y-3">
                  <span className="text-xs text-stone-400 font-medium block">
                    Choose Museum-Grade Framing:
                  </span>
                  <div className="space-y-2">
                    {frameOptions.map(frame => {
                      const isSelected = selectedFrame.id === frame.id;
                      return (
                        <div
                          key={frame.id}
                          onClick={() => setSelectedFrame(frame)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 text-white shadow-xs'
                              : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-lg border border-stone-700 shrink-0 shadow-inner"
                              style={{ backgroundColor: frame.previewColor }}
                            />
                            <div>
                              <div className="text-xs font-bold flex items-center gap-1.5">
                                {frame.label}
                                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                              </div>
                              <span className="text-[11px] text-stone-500 block">
                                {frame.description}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                            {frame.priceDelta === 0 ? 'Included' : `+$${frame.priceDelta}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: Size Selection */}
              {activeTab === 'size' && (
                <div className="space-y-3">
                  <span className="text-xs text-stone-400 font-medium block">
                    Select Finished Artwork Dimensions:
                  </span>
                  <div className="space-y-2">
                    {sizeOptions.map(size => {
                      const isSelected = selectedSize.id === size.id;
                      const delta = Math.round(basePrice * (size.priceMultiplier - 1));
                      return (
                        <div
                          key={size.id}
                          onClick={() => setSelectedSize(size)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 text-white'
                              : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold flex items-center gap-1.5">
                              {size.label}
                              {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                            </div>
                            <span className="text-[11px] text-stone-400 font-mono">
                              {size.dimensions}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {delta === 0 ? 'Standard Base' : `+$${delta}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Personalization & Inscription */}
              {activeTab === 'inscription' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Handwritten Back-of-Canvas Dedication (Free)
                    </label>
                    <p className="text-[11px] text-stone-400 mb-2">
                      Inscribed in archival gold ink and signed by artist Anubha Sinha. Perfect for gifts, housewarmings, or anniversaries.
                    </p>
                    <input
                      type="text"
                      maxLength={120}
                      placeholder="e.g. Dedicated to Aarav & Meera on your new journey - 2025"
                      value={inscription}
                      onChange={e => setInscription(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-stone-500 block text-right mt-1">
                      {inscription.length} / 120 characters
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Artist Commission Notes / Subtle Color Focus (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Please enhance the warm ochre reflections in the lower water ripples to match our living room palette."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Checkout / Bag Action */}
            <div className="pt-6 border-t border-stone-800 mt-6 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-stone-400 block uppercase tracking-wider font-semibold">
                    Total Customized Price
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-amber-400 font-serif">
                      ${totalCustomPrice}
                    </span>
                    {additionalCost > 0 && (
                      <span className="text-xs text-stone-400 font-mono">
                        (Base ${basePrice} + ${additionalCost} customizations)
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Certificate Included</span>
                </div>
              </div>

              <button
                onClick={handleAddToBag}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Customized Artwork to Bag</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
