import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, ShieldAlert, LogIn, Lock, CheckCircle2, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminLoginGateProps {
  children: React.ReactNode;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ children }) => {
  const { 
    currentUser, 
    authorizedAdminEmails, 
    setIsGoogleSignInOpen, 
    setSignInIntent,
    setActivePortal,
    logout 
  } = useApp();

  const isAuthorized = currentUser && authorizedAdminEmails.some(
    email => email.toLowerCase() === currentUser.email.toLowerCase()
  );

  // If user is logged in with an authorized email, grant full access
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Otherwise, display the restricted Google Sign-In Gate
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-center"
      >
        {/* Top Restricted Banner */}
        <div className="bg-stone-950 text-white p-8 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight font-serif">
            ANUBHART STUDIO ADMIN
          </h1>
          <p className="text-xs text-stone-400">
            Private Admin Workstation • Authorized ANUBHART STUDIO Access
          </p>
        </div>

        {/* Gate Body */}
        <div className="p-8 space-y-6">
          {currentUser && !isAuthorized ? (
            // Unauthorized Account State
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-left flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 space-y-1">
                  <div className="font-bold">Access Denied: Unauthorized Account</div>
                  <div>
                    Signed in as <strong>{currentUser.email}</strong>. This Google account does not have administrative privileges for ANUBHART STUDIO.
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-500">
                Please switch to an authorized creator Gmail or contact primary studio owner.
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    logout();
                    setSignInIntent('admin');
                    setIsGoogleSignInOpen(true);
                  }}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Switch Google Account
                </button>

                <button
                  onClick={() => setActivePortal('consumer')}
                  className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Return to Consumer Storefront
                </button>
              </div>
            </div>
          ) : (
            // Signed Out State
            <div className="space-y-5">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-2 text-xs">
                <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Google Authentication Enforced</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  Only verified Google accounts assigned to <strong>ANUBHART STUDIO</strong> are permitted to manage catalog inventory, toggle out-of-stock items, and update customer order radar statuses.
                </p>
                <div className="pt-1 text-[11px] text-stone-500 font-mono bg-white p-2 rounded-lg border border-stone-200">
                  Pre-authorized: {authorizedAdminEmails.join(', ')}
                </div>
              </div>

              <button
                id="admin-google-signin-button"
                onClick={() => {
                  setSignInIntent('admin');
                  setIsGoogleSignInOpen(true);
                }}
                className="w-full py-3.5 px-4 bg-white hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-bold rounded-xl border border-stone-300 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>Sign in with Authorized Google Account</span>
              </button>

              <div className="pt-2">
                <button
                  onClick={() => setActivePortal('consumer')}
                  className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
                >
                  ← Return to Customer Storefront
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
