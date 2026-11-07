import React, { useState } from 'react';
import { UserProfile, SiteSettings } from '../../types/database';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  settings: SiteSettings;
  currentPage?: string;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  user,
  settings,
  currentPage,
  onLogout,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyReferralCode = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navSections = [
    {
      title: 'মূল মেন্যু (Main Navigation)',
      items: [
        { href: '/dashboard.html', pageId: 'dashboard', label: 'ড্যাশবোর্ড', icon: 'fa-solid fa-gauge-high' },
        { href: '/projects.html', pageId: 'projects', label: 'সকল আর্নিং প্রজেক্ট', icon: 'fa-solid fa-shapes' },
        { href: '/micro-jobs.html', pageId: 'micro-jobs', label: 'মাইক্রো জবস (Micro Jobs)', icon: 'fa-solid fa-list-check' },
        { href: '/my-tasks.html', pageId: 'my-tasks', label: 'আমার জমা দেওয়া কাজ', icon: 'fa-solid fa-clipboard-check' },
        { href: '/bonus.html', pageId: 'bonus', label: 'বোনাস ও রিওয়ার্ড (Bonus)', icon: 'fa-solid fa-gift' },
        { href: '/leaderboard.html', pageId: 'leaderboard', label: 'লিডারবোর্ড (Leaderboard)', icon: 'fa-solid fa-trophy' },
      ],
    },
    {
      title: 'আর্থিক লেনদেন (Wallet & Finance)',
      items: [
        { href: '/wallet.html', pageId: 'wallet', label: 'ওয়ালেট ওভারভিউ', icon: 'fa-solid fa-wallet' },
        { href: '/withdraw.html', pageId: 'withdraw', label: 'টাকা উত্তোলন (Withdraw)', icon: 'fa-solid fa-money-bill-transfer' },
        { href: '/add-money.html', pageId: 'add-money', label: 'ব্যালেন্স রিচার্জ (Add Money)', icon: 'fa-solid fa-circle-plus' },
        { href: '/transactions.html', pageId: 'transactions', label: 'লেনদেনের ইতিহাস', icon: 'fa-solid fa-receipt' },
      ],
    },
    {
      title: 'কাজের বিশেষ সার্ভিস (Tasks & Services)',
      items: [
        { href: '/mobile-recharge.html', pageId: 'mobile-recharge', label: 'মোবাইল রিচার্জ', icon: 'fa-solid fa-mobile-screen-button' },
        { href: '/drive-offers.html', pageId: 'drive-offers', label: 'ড্রাইভ অফার প্যাক', icon: 'fa-solid fa-bolt-lightning' },
        { href: '/typing-jobs.html', pageId: 'typing-jobs', label: 'টাইপিং জবস', icon: 'fa-solid fa-keyboard' },
        { href: '/quiz.html', pageId: 'quiz', label: 'কুইজ ইনকাম', icon: 'fa-solid fa-lightbulb' },
        { href: '/digital-services.html', pageId: 'digital-services', label: 'ডিজিটাল সার্ভিসেস', icon: 'fa-solid fa-globe' },
        { href: '/courses.html', pageId: 'courses', label: 'ফ্রিল্যান্সিং কোর্স', icon: 'fa-solid fa-graduation-cap' },
      ],
    },
    {
      title: 'রেফারেল ও নেটওয়ার্ক (Referral)',
      items: [
        { href: '/referral.html', pageId: 'referral', label: 'রেফারেল ড্যাশবোর্ড', icon: 'fa-solid fa-users-viewfinder' },
        { href: '/network.html', pageId: 'network', label: 'আমার টিম ও নেটওয়ার্ক', icon: 'fa-solid fa-users-rays' },
      ],
    },
    {
      title: 'একাউন্ট ও সাপোর্ট (Account & Support)',
      items: [
        { href: '/profile.html', pageId: 'profile', label: 'আমার প্রোফাইল', icon: 'fa-solid fa-user' },
        { href: '/edit-profile.html', pageId: 'edit-profile', label: 'প্রোফাইল এডিট', icon: 'fa-solid fa-user-pen' },
        { href: '/verification.html', pageId: 'verification', label: 'আইডি ভেরিফিকেশন (KYC)', icon: 'fa-solid fa-id-card' },
        { href: '/notifications.html', pageId: 'notifications', label: 'নোটিফিকেশন', icon: 'fa-regular fa-bell' },
        { href: '/announcements.html', pageId: 'announcements', label: 'জরুরি নোটিশ', icon: 'fa-solid fa-bullhorn' },
        { href: '/settings.html', pageId: 'settings', label: 'একাউন্ট সেটিংস', icon: 'fa-solid fa-gear' },
        { href: '/support.html', pageId: 'support', label: 'সাপোর্ট সেন্টার', icon: 'fa-solid fa-headset' },
        { href: '/privacy-policy.html', pageId: 'privacy-policy', label: 'প্রাইভেসি পলিসি', icon: 'fa-solid fa-shield-halved' },
        { href: '/terms.html', pageId: 'terms', label: 'শর্তাবলি ও নিয়মাবলী', icon: 'fa-solid fa-file-contract' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 left-0 max-w-[320px] w-full bg-white shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-in-out">
        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.full_name}
                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-white/60 shadow-md"
                  />
                  {user.is_verified === 'verified' && (
                    <span className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full ring-2 ring-blue-900 text-[10px] w-4 h-4 flex items-center justify-center">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    {user.full_name}
                    {user.role === 'admin' && (
                      <span className="text-[9px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded">
                        ADMIN
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-blue-200">{user.mobile}</p>

                  <div className="mt-0.5">
                    {user.is_verified === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-400/30">
                        <i className="fa-solid fa-circle-check text-[9px]"></i> ভেরিফাইড
                      </span>
                    ) : user.is_verified === 'pending' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                        <i className="fa-solid fa-clock text-[9px]"></i> পেন্ডিং
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-red-500/20 text-red-200 px-2 py-0.5 rounded-full border border-red-400/30">
                        <i className="fa-solid fa-circle-xmark text-[9px]"></i> আন-ভেরিফাইড
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Affiliate ID with Copy */}
              <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between border border-white/10 backdrop-blur-xs">
                <div>
                  <span className="text-[10px] text-blue-200 uppercase font-medium block">রেফারেল আইডি</span>
                  <span className="text-sm font-extrabold tracking-wider text-amber-300">
                    {user.referral_code}
                  </span>
                </div>
                <button
                  onClick={copyReferralCode}
                  className="px-2.5 py-1 text-xs font-semibold bg-white/20 hover:bg-white/30 active:scale-95 text-white rounded-lg transition-all flex items-center gap-1"
                >
                  <i className={copied ? 'fa-solid fa-check text-green-300' : 'fa-regular fa-copy'}></i>
                  <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-2 text-center">
              <img
                src="/assets/aistudio/Easy_Earning_BD_Growth_Emblem_331a2dc7.png"
                alt="Easy Earning BD Logo"
                className="w-16 h-16 object-contain drop-shadow-md rounded-2xl mx-auto mb-2"
              />
              <h3 className="font-bold text-sm">স্বাগতম অতিথি!</h3>
              <p className="text-xs text-blue-200 mb-2">আয় শুরু করতে একাউন্টে লগইন করুন</p>
              <a
                href="/login.html"
                className="inline-block w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl transition-all shadow-md"
              >
                লগইন / রেজিস্টার করুন
              </a>
            </div>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Admin Switch Link */}
          {user?.role === 'admin' && (
            <a
              href="/admin/dashboard.html"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all border border-amber-300 shadow-2xs"
            >
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs shadow-xs">
                <i className="fa-solid fa-shield-halved"></i>
              </span>
              <span>এডমিন প্যানেল (Admin Panel)</span>
            </a>
          )}

          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                {sec.title}
              </span>
              {sec.items.map((item) => {
                const isActive = currentPage === item.pageId;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-blue-50/70 hover:text-blue-900'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-blue-800'
                      }`}
                    >
                      <i className={item.icon}></i>
                    </span>
                    <span className="flex-1">{item.label}</span>
                    <i
                      className={`fa-solid fa-chevron-right text-[10px] ${
                        isActive ? 'text-blue-200' : 'text-slate-300'
                      }`}
                    ></i>
                  </a>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50">
          {user ? (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>লগআউট (Logout)</span>
            </button>
          ) : (
            <div className="text-center text-[10px] text-slate-400">
              {settings.site_name} &bull; {settings.developer_credit}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
