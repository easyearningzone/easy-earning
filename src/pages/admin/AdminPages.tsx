import React, { useState } from 'react';
import { AdminGuard } from '../../components/layout/AdminGuard';
import { store } from '../../lib/store';
import { Task, SiteSettings } from '../../types/database';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('songworld061@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await store.login(email, password);
    if (res.success && res.user?.role === 'admin') {
      window.location.href = '/admin/dashboard.html';
    } else {
      setError('ভুল এডমিন ক্রেডেনশিয়াল বা এডমিন এক্সেস নেই।');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-800 space-y-4">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto text-xl font-bold">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h1 className="text-lg font-bold text-white">এডমিন লগইন পোর্টাল</h1>
          <p className="text-xs text-slate-400">EASY EARNING BD &bull; সংরক্ষিত এলাকা</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 text-red-300 text-xs font-semibold rounded-xl border border-red-800 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">এডমিন ইমেইল</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            এডমিন ড্যাশবোর্ডে প্রবেশ
          </button>
        </form>

        <a href="/dashboard.html" className="block text-center text-xs text-slate-400 hover:text-white">
          &larr; মূল ওয়েবসাইটে ফিরুন
        </a>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode; currentTab: string }> = ({
  children,
  currentTab,
}) => {
  const user = store.getCurrentUser();
  const withdrawals = store.getWithdrawals().filter((w) => w.status === 'pending');
  const submissions = store.getSubmissions().filter((s) => s.status === 'pending');
  const verifications = store.getAllUsers().filter((u) => u.is_verified === 'pending');

  const navs = [
    { href: '/admin/dashboard.html', id: 'dashboard', label: 'ওভারভিউ', icon: 'fa-solid fa-gauge' },
    { href: '/admin/withdrawals.html', id: 'withdrawals', label: `উইথড্র রিকোয়েস্ট (${withdrawals.length})`, icon: 'fa-solid fa-money-bill-transfer', badge: withdrawals.length },
    { href: '/admin/submissions.html', id: 'submissions', label: `টাস্ক সাবমিশন (${submissions.length})`, icon: 'fa-solid fa-list-check', badge: submissions.length },
    { href: '/admin/dashboard.html', id: 'gmail', label: `জিমেইল সেল (${store.getGmailSubmissions().filter(g => g.status === 'pending').length})`, icon: 'fa-solid fa-envelope', badge: store.getGmailSubmissions().filter(g => g.status === 'pending').length },
    { href: '/admin/verifications.html', id: 'verifications', label: `ইউজার ভেরিফিকেশন (${verifications.length})`, icon: 'fa-solid fa-id-card', badge: verifications.length },
    { href: '/admin/users.html', id: 'users', label: 'ইউজার ম্যানেজমেন্ট', icon: 'fa-solid fa-users' },
    { href: '/admin/jobs.html', id: 'jobs', label: 'টাস্ক ও জবস ম্যানেজার', icon: 'fa-solid fa-briefcase' },
    { href: '/admin/transactions.html', id: 'transactions', label: 'ওয়ালেট এডজাস্টমেন্ট', icon: 'fa-solid fa-wallet' },
    { href: '/admin/banners.html', id: 'banners', label: 'ব্যানার ও নোটিশ', icon: 'fa-solid fa-images' },
    { href: '/admin/settings.html', id: 'settings', label: 'ওয়েবসাইট সেটিংস', icon: 'fa-solid fa-sliders' },
    { href: '/admin/admin-logs.html', id: 'logs', label: 'অডিট হিস্ট্রি', icon: 'fa-solid fa-clock-rotate-left' },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href="/dashboard.html"
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span>ইউজার সাইট</span>
              </a>
              <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                EASY EARNING BD &bull; এডমিন প্যানেল
              </h1>
            </div>

            <div className="text-xs text-amber-400 font-semibold">
              এডমিন: {user?.full_name}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 bg-white rounded-2xl p-3 shadow-sm border border-slate-200 shrink-0 h-fit space-y-1">
            {navs.map((n) => (
              <a
                key={n.id}
                href={n.href}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  currentTab === n.id
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <i className={`${n.icon} w-4 text-center`}></i>
                  <span>{n.label}</span>
                </div>
                {n.badge && n.badge > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white">
                    {n.badge}
                  </span>
                ) : null}
              </a>
            ))}
          </aside>

          <main className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
};
