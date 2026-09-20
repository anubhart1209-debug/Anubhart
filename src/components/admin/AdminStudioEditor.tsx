import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Camera, 
  Upload, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Eye, 
  ShieldCheck, 
  Award, 
  Ruler, 
  Instagram, 
  MessageSquare, 
  CheckCircle2, 
  Megaphone, 
  FileText,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export const AdminStudioEditor: React.FC = () => {
  const { 
    studioProfile, 
    updateStudioProfile, 
    resetStudioProfile, 
    setActivePortal, 
    setConsumerTab, 
    showToast 
  } = useApp();

  // Local draft state initialized with current studioProfile
  const [formData, setFormData] = useState({ ...studioProfile });
  const [activeSubTab, setActiveSubTab] = useState<'face' | 'bio' | 'contact' | 'storefront' | 'pillars'>('face');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset portrait photos for instant testing if desired
  const portraitPresets = [
    {
      label: 'Contemporary Atelier (Default)',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Studio Workspace Portrait',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Artisanal Natural Light',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Varanasi Heritage Setting',
      url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  // Direct image upload from local file system
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPEG, PNG, WEBP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleInputChange('artistPhoto', reader.result);
        showToast('Photo uploaded successfully! Remember to save changes.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateStudioProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all studio profile and website text to default?')) {
      resetStudioProfile();
      setFormData({ ...studioProfile });
      showToast('Studio profile reset to default master atelier content', 'info');
    }
  };

  const handlePreviewOnSite = () => {
    updateStudioProfile(formData);
    setActivePortal('consumer');
    setConsumerTab('about');
    showToast('Switched to consumer view to preview your updated profile and bio', 'info');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 font-sans">
      {/* Top Header Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Master Atelier Admin Controls</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            Studio Identity & Website Content Editor
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
            Customize all elements of your website in real-time: your portrait photo ("face"), biography, artist statement, studio phone number, email, and storefront banners.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handlePreviewOnSite}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-bold rounded-xl border border-stone-700 transition-all flex items-center gap-2 shadow-sm"
            title="Preview changes directly on the live website"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Preview on Site</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Changes Saved!' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Editor Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-stone-900/70 p-1.5 rounded-2xl border border-stone-800">
        <button
          onClick={() => setActiveSubTab('face')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'face'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Artist Face & Identity</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bio')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'bio'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Curatorial Bio & Story</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contact')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'contact'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact Desk & Phone</span>
        </button>

        <button
          onClick={() => setActiveSubTab('storefront')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'storefront'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Website Banners & Hero</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pillars')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'pillars'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Studio Pillars & Guarantees</span>
        </button>
      </div>

      {/* TAB 1: Artist Face & Identity */}
      {activeSubTab === 'face' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Live Preview Card */}
          <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-3xl p-6 text-stone-200 flex flex-col items-center">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 self-start">
              <Eye className="w-3.5 h-3.5" />
              <span>Live Website Portrait Card Preview</span>
            </span>

            <div className="relative w-64 h-84 rounded-2xl overflow-hidden shadow-2xl border-2 border-stone-700 bg-stone-950">
              <img
                src={formData.artistPhoto}
                alt={formData.artistName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold block">
                  {formData.artistTitle || 'Master Visual Artist'}
                </span>
                <h3 className="text-lg font-bold text-white leading-tight mt-0.5">
                  {formData.artistName || 'Anubha Sinha'}
                </h3>
                <span className="text-xs text-stone-400 block mt-0.5">
                  {formData.cityLocation || 'Varanasi, India'}
                </span>
              </div>
            </div>

            <div className="w-full mt-6 pt-4 border-t border-stone-800 grid grid-cols-3 gap-2 text-center">
              <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-500 block">Experience</span>
                <span className="text-xs font-bold text-white">{formData.experienceYears}</span>
              </div>
              <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-500 block">Originals</span>
                <span className="text-xs font-bold text-white">{formData.artworksCount}</span>
              </div>
              <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-500 block">Patrons</span>
                <span className="text-xs font-bold text-white">{formData.collectorCountries}</span>
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <span>Artist Face & Visual Identity</span>
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Upload your portrait photo or paste any direct image link to update your face across the entire site.
              </p>
            </div>

            {/* Photo Upload & Presets */}
            <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-4">
              <span className="text-xs font-bold text-stone-300 block">
                Update Portrait Image ("My Face")
              </span>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo from Computer/Phone</span>
                </button>

                <span className="text-xs text-stone-500">or enter image link below:</span>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.artistPhoto}
                  onChange={e => handleInputChange('artistPhoto', e.target.value)}
                  placeholder="https://... direct image URL"
                  className="w-full px-3.5 py-2 text-xs bg-stone-900 border border-stone-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-stone-400 font-semibold block">
                  Curated Studio Presets:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {portraitPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInputChange('artistPhoto', preset.url)}
                      className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-lg text-left text-[11px] text-stone-300 transition-colors"
                    >
                      <div className="font-semibold truncate">{preset.label}</div>
                      <span className="text-[9px] text-amber-400">Click to use</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Artist Full Name
                </label>
                <input
                  type="text"
                  value={formData.artistName}
                  onChange={e => handleInputChange('artistName', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Professional Title / Designation
                </label>
                <input
                  type="text"
                  value={formData.artistTitle}
                  onChange={e => handleInputChange('artistTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Studio City & Country
                </label>
                <input
                  type="text"
                  value={formData.cityLocation}
                  onChange={e => handleInputChange('cityLocation', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Experience Years Badge
                </label>
                <input
                  type="text"
                  value={formData.experienceYears}
                  onChange={e => handleInputChange('experienceYears', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Artworks Count Badge
                </label>
                <input
                  type="text"
                  value={formData.artworksCount}
                  onChange={e => handleInputChange('artworksCount', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Collector Countries Badge
                </label>
                <input
                  type="text"
                  value={formData.collectorCountries}
                  onChange={e => handleInputChange('collectorCountries', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Identity Updates</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Curatorial Bio & Story */}
      {activeSubTab === 'bio' && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Biography & Curatorial Story Editor ("My Bio")</span>
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Edit your artist narrative, training history, medium philosophy, and curatorial statement featured on the homepage and about section.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Hero Curatorial Headline
              </label>
              <input
                type="text"
                value={formData.heroStoryTitle}
                onChange={e => handleInputChange('heroStoryTitle', e.target.value)}
                placeholder="e.g. Where Sacred Heritage Meets Contemporary Impasto Expression"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white font-serif focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Biography Paragraph 1 (Roots, Heritage & Artistic Vision)
              </label>
              <textarea
                rows={4}
                value={formData.bioParagraph1}
                onChange={e => handleInputChange('bioParagraph1', e.target.value)}
                placeholder="Describe your background, upbringing, artistic influences along the ghats of Varanasi..."
                className="w-full p-4 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white leading-relaxed focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Biography Paragraph 2 (Materials, Technique, Linen & Archival Longevity)
              </label>
              <textarea
                rows={4}
                value={formData.bioParagraph2}
                onChange={e => handleInputChange('bioParagraph2', e.target.value)}
                placeholder="Describe your canvas stretching, lightfast pigments, gold leafing, and framing craftsmanship..."
                className="w-full p-4 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white leading-relaxed focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Artist Philosophy / Personal Statement Quote
              </label>
              <textarea
                rows={2}
                value={formData.artistStatement}
                onChange={e => handleInputChange('artistStatement', e.target.value)}
                placeholder="e.g. Art is not a passive wall ornament; it is an altar of living vibration..."
                className="w-full p-3.5 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white italic focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-stone-800">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-stone-500 hover:text-stone-300 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Bio to Atelier Default</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Bio Updates</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Contact Desk & Channels */}
      {activeSubTab === 'contact' && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-400" />
              <span>Direct Studio Contact Desk ("My Phone Number, etc.")</span>
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Update your direct telephone, email address, atelier location, and collector consultation hours displayed to customers and buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Artist Direct Phone Number</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">Displayed on customer checkout and about section</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Official Artist Email (Primary Owner)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                placeholder="anubhart1209@gmail.com"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-amber-400/80 mt-1 block">Primary owner email: anubhart1209@gmail.com</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Business Line</span>
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={e => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram Profile Handle</span>
              </label>
              <input
                type="text"
                value={formData.instagramHandle}
                onChange={e => handleInputChange('instagramHandle', e.target.value)}
                placeholder="@anubhart.atelier"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Central Atelier Physical Address</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={e => handleInputChange('address', e.target.value)}
                placeholder="Assi Heritage Corridor, Varanasi, Uttar Pradesh, 221005, India"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Studio Hours & Collector Consultation Timings</span>
              </label>
              <input
                type="text"
                value={formData.studioHours}
                onChange={e => handleInputChange('studioHours', e.target.value)}
                placeholder="Mon - Sat, 10:00 AM - 7:00 PM IST (Collector Visits by Appointment)"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end border-t border-stone-800">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Contact Desk</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Website Banners & Hero */}
      {activeSubTab === 'storefront' && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-400" />
              <span>Storefront Banners & Global Headlines ("All Parts of Website")</span>
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Modify the global announcement banner, storefront headline, and commission availability badge seen by every visiting collector.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Top Announcement Marquee Bar
              </label>
              <input
                type="text"
                value={formData.announcementBanner}
                onChange={e => handleInputChange('announcementBanner', e.target.value)}
                placeholder="Complimentary Insured Worldwide Transit • Wax-Sealed Authenticity Certificates..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">Displayed on the very top of the customer storefront</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Storefront Hero Headline
              </label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={e => handleInputChange('heroHeadline', e.target.value)}
                placeholder="Timeless Original Fine Art from Varanasi"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white font-serif focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Storefront Hero Subtitle
              </label>
              <textarea
                rows={2}
                value={formData.heroSubtitle}
                onChange={e => handleInputChange('heroSubtitle', e.target.value)}
                placeholder="Museum-grade original oil paintings, bespoke wood framing, and personalized commissions..."
                className="w-full p-4 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Private Commission Desk Status Badge
              </label>
              <input
                type="text"
                value={formData.commissionStatus}
                onChange={e => handleInputChange('commissionStatus', e.target.value)}
                placeholder="Open for Private Collector Commissions"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end border-t border-stone-800">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Storefront Text</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Studio Pillars & Guarantees */}
      {activeSubTab === 'pillars' && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>The 3 Atelier Guarantees & Pillars</span>
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Configure the 3 core promises displayed on the website about physical certificates, museum framing, and direct shipment tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Pillar 1: Provenance</span>
              </div>
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.pillar1Title}
                  onChange={e => handleInputChange('pillar1Title', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-lg text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.pillar1Desc}
                  onChange={e => handleInputChange('pillar1Desc', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-lg text-stone-300 leading-relaxed"
                />
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Ruler className="w-4 h-4" />
                <span>Pillar 2: Framing</span>
              </div>
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.pillar2Title}
                  onChange={e => handleInputChange('pillar2Title', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-lg text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.pillar2Desc}
                  onChange={e => handleInputChange('pillar2Desc', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-lg text-stone-300 leading-relaxed"
                />
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Award className="w-4 h-4" />
                <span>Pillar 3: Shipping Radar</span>
              </div>
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.pillar3Title}
                  onChange={e => handleInputChange('pillar3Title', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-lg text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.pillar3Desc}
                  onChange={e => handleInputChange('pillar3Desc', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-lg text-stone-300 leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end border-t border-stone-800">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Pillars</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
