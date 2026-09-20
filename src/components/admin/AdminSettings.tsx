import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Plus, Trash2, Mail, UserCheck, AlertCircle, Sparkles, Crown, Lock, Flame, Activity, Zap } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const {
    authorizedAdminEmails,
    addAuthorizedEmail,
    removeAuthorizedEmail,
    currentUser,
    primaryOwnerEmail,
    setIsSecurityModalOpen
  } = useApp();

  const [newEmail, setNewEmail] = useState('');

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) return;
    addAuthorizedEmail(newEmail.trim());
    setNewEmail('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 font-sans">
      {/* Studio Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 text-stone-100 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Studio Permissions</span>
        </div>
        <h1 className="text-xl font-extrabold text-white font-serif">
          Authorized ANUBHART STUDIO Accounts
        </h1>
        <p className="text-xs text-stone-400 leading-relaxed">
          The primary owner account is <strong className="text-amber-400">{primaryOwnerEmail}</strong>. Only the verified Google accounts authorized below can access the artist console, manage orders, and edit website content for ANUBHART STUDIO.
        </p>
      </div>

      {/* Add Email Form */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Authorize an Additional Google / Gmail Account</span>
        </h2>
        <p className="text-xs text-stone-400">
          Enter an assistant or gallery curator email to grant them administrative access to the ANUBHART STUDIO console.
        </p>

        <form onSubmit={handleAddEmail} className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="email"
              required
              placeholder="e.g. curator@anubhart.com or assistant@gmail.com"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Authorize Account</span>
          </button>
        </form>
      </div>

      {/* Current Authorized List */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Authorized ANUBHART STUDIO Accounts ({authorizedAdminEmails.length})
          </h3>
          <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full font-medium">
            Active Whitelist
          </span>
        </div>

        <div className="space-y-2">
          {authorizedAdminEmails.map(email => {
            const isSelf = currentUser && currentUser.email.toLowerCase() === email.toLowerCase();
            const isOwner = email.toLowerCase() === primaryOwnerEmail.toLowerCase();

            return (
              <div
                key={email}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-xs ${
                  isOwner 
                    ? 'bg-amber-950/20 border-amber-500/40' 
                    : 'bg-stone-950 border-stone-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    isOwner
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'bg-stone-800 text-stone-300'
                  }`}>
                    {isOwner ? <Crown className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{email}</span>
                      {isOwner && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.2 rounded-full font-bold border border-amber-500/40 flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          <span>Primary Studio Owner</span>
                        </span>
                      )}
                      {isSelf && (
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-medium border border-indigo-500/30">
                          Current Session
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-500">
                      {isOwner ? 'Permanent Root Ownership Privileges' : 'Studio Management Access'}
                    </span>
                  </div>
                </div>

                {!isOwner && !isSelf && (
                  <button
                    onClick={() => {
                      if (confirm(`Revoke studio access for ${email}?`)) {
                        removeAuthorizedEmail(email);
                      }
                    }}
                    className="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-stone-900 rounded-lg transition-colors"
                    title="Remove access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {isOwner && (
                  <span className="text-[11px] text-stone-500 flex items-center gap-1 font-mono pr-2">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Protected</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cryptographic Shield & Autonomous Threat Defense */}
      <div className="bg-stone-900 border border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Military-Grade Encrypted Vault & Cyber Defense Matrix</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  ZERO-LEAKAGE SEALED
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Guards Customer Orders, Phone Numbers & Catalog from Cyber Attacks & Data Leaks
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSecurityModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Open Cyber Defense HUD</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-stone-300">
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Encryption Engine</span>
            <span className="font-bold text-emerald-400 block font-mono">AES-GCM 256-Bit</span>
            <p className="text-[11px] text-stone-400">Hardware Web Crypto with unique 96-bit IVs.</p>
          </div>

          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Key Derivation</span>
            <span className="font-bold text-emerald-400 block font-mono">PBKDF2 (250K)</span>
            <p className="text-[11px] text-stone-400">SHA-512 with high-entropy salt prevents brute-forcing.</p>
          </div>

          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Integrity Signatures</span>
            <span className="font-bold text-emerald-400 block font-mono">HMAC-SHA256</span>
            <p className="text-[11px] text-stone-400">Digital sealing detects bit-flips and tamper attempts.</p>
          </div>

          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Cyber Attack Counter</span>
            <span className="font-bold text-amber-400 block flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Fight Back Engaged</span>
            </span>
            <p className="text-[11px] text-stone-400">Honeypots, DDoS mitigation, and active script quarantine.</p>
          </div>
        </div>
      </div>

      {/* Studio Info Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-3 text-xs text-stone-400">
        <h3 className="text-sm font-bold text-white">ANUBHART STUDIO Credentials</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
            <span className="text-stone-500 block text-[10px] uppercase font-semibold">Primary Founder & Owner</span>
            <span className="font-bold text-amber-400 mt-0.5 block">{primaryOwnerEmail}</span>
          </div>
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
            <span className="text-stone-500 block text-[10px] uppercase font-semibold">Central Studio Location</span>
            <span className="font-bold text-white mt-0.5 block">Varanasi, Uttar Pradesh, India</span>
          </div>
        </div>
      </div>
    </div>
  );
};
