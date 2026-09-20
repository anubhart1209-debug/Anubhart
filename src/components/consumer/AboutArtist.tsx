import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Palette, Video, MapPin, Mail, ShieldCheck, ExternalLink } from 'lucide-react';

export const AboutArtist: React.FC = () => {
  const { setConsumerTab } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Bio Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-8">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
          alt="Anubha Sinha"
          className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover shadow-lg border border-stone-200 shrink-0"
        />
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
            <Palette className="w-3.5 h-3.5 text-amber-700" />
            <span>Master Fine Artist & Educator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Anubha Sinha (ANUBHA Art 120)
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Renowned contemporary visual artist based in the historic spiritual capital of Varanasi. Combining centuries-old Indian classical iconography with cutting-edge impasto oil brushwork, hyperrealist charcoal studies, and fluid acrylic textures.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-stone-500 pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" /> Varanasi, Uttar Pradesh, India
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-amber-600" /> anubhasinha1607@gmail.com
            </span>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2">
          <ShieldCheck className="w-6 h-6 text-amber-600" />
          <h3 className="font-bold text-sm text-stone-900">Certificate of Authenticity</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Every original painting, sculpture, and limited edition print is hand-signed and comes with an embossed Certificate of Authenticity.
          </p>
        </div>

        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2">
          <Video className="w-6 h-6 text-rose-600" />
          <h3 className="font-bold text-sm text-stone-900">ArtTube Studio Channel</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Over 140,000 students and art lovers follow our comprehensive masterclasses, time-lapses, and materials breakdowns on ArtTube.
          </p>
        </div>

        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2">
          <Award className="w-6 h-6 text-emerald-600" />
          <h3 className="font-bold text-sm text-stone-900">Museum-Grade Materials</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            We exclusively formulate with archival French pigments, Belgian stretched linen, and heavy cotton rag rated for over 100+ years.
          </p>
        </div>
      </div>

      {/* CTA Row */}
      <div className="p-6 bg-stone-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base">Looking for custom commissioned artwork?</h3>
          <p className="text-xs text-stone-400 mt-1">Get in touch for bespoke murals, portrait studies, and gallery installations.</p>
        </div>
        <button
          onClick={() => setConsumerTab('store')}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0"
        >
          Explore Available Collection
        </button>
      </div>
    </div>
  );
};
