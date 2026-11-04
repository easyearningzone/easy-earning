import React from 'react';
import { store } from '../../lib/store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const user = store.getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-lg border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-900 mx-auto flex items-center justify-center text-2xl mb-3">
            <i className="fa-solid fa-lock"></i>
          </div>
          <h2 className="text-base font-bold text-slate-800 mb-1">লগইন প্রয়োজন</h2>
          <p className="text-xs text-slate-500 mb-4">এই পেজটি দেখার জন্য আপনার একাউন্টে প্রবেশ করা আবশ্যক।</p>
          <div className="space-y-2">
            <a
              href="/login.html"
              className="block w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              লগইন করুন
            </a>
            <a
              href="/register.html"
              className="block w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
            >
              নতুন একাউন্ট খুলুন
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
