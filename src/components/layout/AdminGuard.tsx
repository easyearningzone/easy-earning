import React from 'react';
import { store } from '../../lib/store';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const user = store.getCurrentUser();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-xl border border-slate-700">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center text-2xl mb-3 border border-amber-500/30">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h2 className="text-base font-bold text-white mb-1">এডমিন এক্সেস প্রয়োজন</h2>
          <p className="text-xs text-slate-400 mb-4">শুধুমাত্র অনুমোদিত এডমিনিস্ট্রেটর এই পেজটি ব্যবহারের অনুমতিপ্রাপ্ত।</p>
          <div className="space-y-2">
            <a
              href="/admin/login.html"
              className="block w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              এডমিন লগইন করুন
            </a>
            <a
              href="/dashboard.html"
              className="block w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all"
            >
              মূল ওয়েবসাইটে ফিরুন
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
