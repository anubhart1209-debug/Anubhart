import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCheck, Shield, ChevronDown, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GoogleSignInModal: React.FC = () => {
  const { 
    isGoogleSignInOpen, 
    setIsGoogleSignInOpen, 
    signInIntent, 
    loginWithGoogle, 
    authorizedAdminEmails,
    primaryOwnerEmail,
    currentUser,
    showToast,
    setActivePortal,
    setConsumerTab
  } = useApp();

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isGoogleSignInOpen) return null;

  const handleExecuteLogin = (email: string, name: string, avatar?: string) => {
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const result = loginWithGoogle(
        cleanEmail, 
        name || cleanEmail.split('@')[0], 
        avatar
      );

      if (signInIntent === 'admin' && !result.isAuthorizedAdmin) {
        setIsLoading(false);
        setErrorMessage(`"${cleanEmail}" is not authorized for Anubhart Studio Admin. Please sign in as ${primaryOwnerEmail} or an authorized studio email.`);
        return;
      }

      setIsLoading(false);
      setIsGoogleSignInOpen(false);

      if (signInIntent === 'admin' && result.isAuthorizedAdmin) {
        setActivePortal('admin');
        showToast('Welcome to Anubhart Studio Admin Workstation', 'success');
      } else if (signInIntent === 'tracking') {
        setConsumerTab('tracking');
      }
    }, 500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) {
      setErrorMessage('Please enter a valid Google email address');
      return;
    }

    const derivedName = customName.trim() || customEmail.split('@')[0];
    handleExecuteLogin(
      customEmail.trim(), 
      derivedName, 
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(derivedName)}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-sm font-sans">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-[448px] bg-white rounded-[28px] shadow-2xl border border-stone-200 overflow-hidden flex flex-col font-sans"
        >
          {/* Top subtle close button */}
          <div className="flex justify-end p-4 pb-0">
            <button
              onClick={() => setIsGoogleSignInOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-8 pb-6 pt-1 flex-1 flex flex-col">
            {/* Authentic Google "G" Logo */}
            <div className="flex justify-center mb-4">
              <svg className="w-10 h-10" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
            </div>

            {/* Header copy */}
            <div className="text-center mb-5">
              <h1 className="text-[22px] font-medium text-[#202124] leading-tight">
                Sign in with Google
              </h1>
              <p className="text-xs text-[#5f6368] mt-1.5">
                to continue to <strong className="font-semibold text-stone-900">Anubhart</strong>
              </p>
            </div>

            {/* Admin Intent Notice Banner */}
            {signInIntent === 'admin' && (
              <div className="mb-4 p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2">
                <Shield className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Studio Admin Restricted Workstation:</strong> Primary Owner account is <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 font-mono text-[11px] font-bold text-indigo-800">{primaryOwnerEmail}</code>.
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* Primary Owner Quick Access Card */}
            <div className="mb-4">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Primary Owner & Admin</span>
                <span className="text-[10px] text-amber-700 bg-amber-100 font-semibold px-1.5 py-0.2 rounded-full">
                  Master Atelier
                </span>
              </div>
              <button
                disabled={isLoading}
                onClick={() => handleExecuteLogin(
                  primaryOwnerEmail,
                  'Anubha Sinha',
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                )}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 text-left transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Anubha Sinha"
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900 transition-colors flex items-center gap-1.5">
                      <span>Anubha Sinha</span>
                      <span className="text-[9px] bg-amber-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                        Owner
                      </span>
                    </div>
                    <span className="text-xs text-stone-600 block truncate font-mono">
                      {primaryOwnerEmail}
                    </span>
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-amber-600 text-stone-950 font-bold text-[11px] rounded-lg group-hover:bg-amber-500 transition-colors shrink-0 shadow-xs">
                  Sign In
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-stone-400 font-semibold tracking-wider">
                  {signInIntent === 'admin' ? 'Or Sign In with Other Authorized Account' : 'Or Sign In with Your Google Account'}
                </span>
              </div>
            </div>

            {/* Direct Google Sign-In Form */}
            <form onSubmit={handleManualSubmit} className="space-y-3 flex-1">
              <div>
                <label className="block text-xs font-medium text-[#5f6368] mb-1">
                  Google Email or phone
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={customEmail}
                  onChange={e => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-xl focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5f6368] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Collector Name"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-xl focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoogleSignInOpen(false)}
                  className="text-xs text-stone-500 font-medium hover:text-stone-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-full shadow-sm transition-colors flex items-center gap-2"
                >
                  {isLoading ? 'Verifying...' : 'Continue with Google'}
                </button>
              </div>
            </form>

            {/* Google Permissions Disclaimer */}
            <p className="text-[11px] text-[#5f6368] leading-relaxed mt-4 pt-3 border-t border-stone-100 text-center">
              To continue, Google will securely share your email and name with <span className="font-semibold text-stone-700">Anubhart</span> for order management and provenance certificates.
            </p>
          </div>

          {/* Authentic Google Footer */}
          <div className="bg-[#f8f9fa] border-t border-stone-200 px-6 py-3 flex items-center justify-between text-xs text-[#5f6368]">
            <div className="flex items-center gap-1 cursor-pointer hover:text-stone-800">
              <span>English (United States)</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-4">
              <span className="cursor-pointer hover:text-stone-800">Help</span>
              <span className="cursor-pointer hover:text-stone-800">Privacy</span>
              <span className="cursor-pointer hover:text-stone-800">Terms</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
