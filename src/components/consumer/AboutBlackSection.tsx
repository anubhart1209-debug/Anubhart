import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Mail, 
  Phone, 
  Award, 
  ShieldCheck, 
  Palette, 
  Send, 
  Check, 
  Ruler, 
  HeartHandshake 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AboutBlackSection: React.FC = () => {
  const { showToast, studioProfile } = useApp();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryNote, setInquiryNote] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryEmail.trim() || !inquiryNote.trim()) return;

    setInquirySent(true);
    showToast(`Your custom commission inquiry has been transmitted directly to ${studioProfile.artistName} at Anubhart Studio.`, 'success');
    setTimeout(() => {
      setInquiryName('');
      setInquiryEmail('');
      setInquiryNote('');
      setInquirySent(false);
    }, 4000);
  };

  return (
    <section id="about-anubhart" className="bg-[#09090b] text-stone-200 py-16 sm:py-24 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Heritage of ANUBHART STUDIO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-serif">
            About ANUBHART STUDIO
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
            Founded by contemporary fine artist <strong className="text-stone-200 font-medium">{studioProfile.artistName}</strong> in the ancient sacred city of {studioProfile.cityLocation}, ANUBHART STUDIO creates timeless museum-grade original art and bespoke fine art commissions for discerning collectors worldwide.
          </p>
        </div>

        {/* Master Artist Spotlight & Studio Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-stone-900/60 rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-2xl">
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-stone-700 bg-stone-950">
              <img
                src={studioProfile.artistPhoto}
                alt={`${studioProfile.artistName}, Founder of ANUBHART STUDIO`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold block">
                  {studioProfile.artistTitle}
                </span>
                <h3 className="text-lg font-bold text-white">{studioProfile.artistName}</h3>
                <span className="text-xs text-stone-400 block">{studioProfile.cityLocation}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white font-serif">
                {studioProfile.heroStoryTitle}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                {studioProfile.bioParagraph1}
              </p>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
                {studioProfile.bioParagraph2}
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
                <ShieldCheck className="w-5 h-5 text-amber-500 mb-1" />
                <h4 className="text-xs font-bold text-white">{studioProfile.pillar1Title}</h4>
                <p className="text-[11px] text-stone-400">
                  {studioProfile.pillar1Desc}
                </p>
              </div>

              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
                <Ruler className="w-5 h-5 text-amber-500 mb-1" />
                <h4 className="text-xs font-bold text-white">{studioProfile.pillar2Title}</h4>
                <p className="text-[11px] text-stone-400">
                  {studioProfile.pillar2Desc}
                </p>
              </div>

              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
                <Award className="w-5 h-5 text-amber-500 mb-1" />
                <h4 className="text-xs font-bold text-white">{studioProfile.pillar3Title}</h4>
                <p className="text-[11px] text-stone-400">
                  {studioProfile.pillar3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Location & Commission Inquiry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Studio Details */}
          <div className="lg:col-span-5 bg-stone-900/60 rounded-3xl p-6 sm:p-8 border border-stone-800 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 block mb-1">
                Private Studio & Gallery
              </span>
              <h3 className="text-xl font-bold text-white">Visit Our Studio</h3>
              <p className="text-xs text-stone-400 mt-1">
                {studioProfile.studioHours}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-center text-amber-500 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">Central Studio</span>
                  <span className="text-stone-400">{studioProfile.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-center text-amber-500 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">Official Artist Email</span>
                  <a href={`mailto:${studioProfile.email}`} className="text-stone-300 hover:text-amber-400 transition-colors">
                    {studioProfile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-center text-amber-500 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">Direct Commission Desk & Phone</span>
                  <a href={`tel:${studioProfile.phone}`} className="text-stone-300 hover:text-amber-400 transition-colors">
                    {studioProfile.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800/80 text-[11px] text-stone-400 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Worldwide insured air transit with custom wooden crating.</span>
            </div>
          </div>

          {/* Quick Commission Inquiries Form */}
          <div className="lg:col-span-7 bg-stone-900/60 rounded-3xl p-6 sm:p-8 border border-stone-800 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 block mb-1">
                Custom Art Commission
              </span>
              <h3 className="text-xl font-bold text-white">Commission a One-of-a-Kind Artwork</h3>
              <p className="text-xs text-stone-400 mt-1">
                Have a specific dimension, subject, or palette in mind for your residence or office? Send us a note.
              </p>
            </div>

            {inquirySent ? (
              <div className="p-8 bg-stone-950 rounded-2xl border border-emerald-800/50 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Inquiry Received</h4>
                <p className="text-xs text-stone-400">
                  Thank you! Anubha Sinha will review your commission request and reply within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Chawla"
                      value={inquiryName}
                      onChange={e => setInquiryName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. maya@example.com"
                      value={inquiryEmail}
                      onChange={e => setInquiryEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Describe Your Commission Vision (Dimensions, Subject, Room Color Palette)
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. We are looking for a large 48x36 inch landscape for our dining hall featuring the morning sunrise over Varanasi in gold, indigo, and terracotta..."
                    value={inquiryNote}
                    onChange={e => setInquiryNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Commission Request to Artist</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom studio copyright */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-amber-600 text-stone-950 flex items-center justify-center font-bold text-[10px]">
              A
            </div>
            <span className="font-bold text-stone-300">ANUBHART STUDIO</span>
            <span>• Original Fine Art & Custom Commissions</span>
          </div>
          <span>© 2025 ANUBHART STUDIO. All rights reserved. Registered Studio in Varanasi, India.</span>
        </div>
      </div>
    </section>
  );
};
