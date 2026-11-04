import React, { useState } from 'react';
import { UserProfile, SiteSettings } from '../types/database';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  settings: SiteSettings;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  user,
  settings,
  onNavigate,
  onLogout,
  onOpenAuth
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyReferralCode = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড (Dashboard)', icon: 'fa-solid fa-gauge-high' },
    { id: 'profile', label: 'আমার প্রোফাইল (My Profile)', icon: 'fa-solid fa-user' },
    { id: 'verification', label: 'একাউন্ট ভেরিফিকেশন (KYC)', icon: 'fa-solid fa-id-card' },
    { id: 'referral', label: 'বন্ধুদের রেফার করুন (Refer)', icon: 'fa-solid fa-users-viewfinder' },
    { id: 'wallet', label: 'আমার ওয়ালেট ও ক্যাশআউট (Wallet)', icon: 'fa-solid fa-wallet' },
    { id: 'tasks', label: 'সকল মাইক্রো জবস (Micro Jobs)', icon: 'fa-solid fa-list-check' },
    { id: 'support', label: 'সাপোর্ট সেন্টার (Support Center)', icon: 'fa-solid fa-headset' },
    { id: 'about', label: 'আমাদের সম্পর্কে (About Us)', icon: 'fa-solid fa-circle-info' },
    { id: 'privacy', label: 'প্রাইভেসি পলিসি (Privacy Policy)', icon: 'fa-solid fa-shield-halved' },
    { id: 'faq', label: 'সাধারণ জিজ্ঞাসা (FAQ)', icon: 'fa-solid fa-circle-question' },
    { id: 'reviews', label: 'ইউজার রিভিউ (User Reviews)', icon: 'fa-solid fa-star' },
    { id: 'password', label: 'পাসওয়ার্ড পরিবর্তন (Change Password)', icon: 'fa-solid fa-key' },
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
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/60 shadow-md"
                  />
                  {user.is_verified === 'verified' && (
                    <span className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full ring-2 ring-blue-900 text-[10px] w-4 h-4 flex items-center justify-center">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                    {user.full_name}
                    {user.role === 'admin' && (
                      <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded">
                        ADMIN
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-blue-200">{user.mobile}</p>
                  
                  {/* Verification Status Badge */}
                  <div className="mt-1">
                    {user.is_verified === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-400/30">
                        <i className="fa-solid fa-circle-check text-[10px]"></i> ভেরিফাইড একাউন্ট
                      </span>
                    ) : user.is_verified === 'pending' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                        <i className="fa-solid fa-clock text-[10px]"></i> ভেরিফিকেশন পেন্ডিং
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-red-500/20 text-red-200 px-2 py-0.5 rounded-full border border-red-400/30">
                        <i className="fa-solid fa-circle-xmark text-[10px]"></i> আন-ভেরিফাইড
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Affiliate ID with Copy */}
              <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between border border-white/10 backdrop-blur-xs">
                <div>
                  <span className="text-[10px] text-blue-200 uppercase font-medium block">রেফারেল / এফিলিয়েট আইডি</span>
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

              <div className="text-[11px] text-blue-200/80 flex items-center gap-1">
                <i className="fa-regular fa-calendar text-[10px]"></i>
                <span>যোগদানের তারিখ: {new Date(user.created_at).toLocaleDateString('bn-BD')}</span>
              </div>
            </div>
          ) : (
            <div className="py-2 text-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl text-white">
                <i className="fa-solid fa-user"></i>
              </div>
              <h3 className="font-bold text-base">স্বাগতম অতিথি!</h3>
              <p className="text-xs text-blue-200 mb-3">আয় শুরু করতে এখনই একাউন্টে লগইন করুন</p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl transition-all shadow-md"
              >
                লগইন / রেজিস্টার করুন
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Admin Switch Link */}
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                onClose();
                onNavigate('admin');
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all border border-amber-200 mb-2"
            >
              <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm shadow-xs">
                <i className="fa-solid fa-shield-halved"></i>
              </span>
              <span>এডমিন প্যানেল (Admin Panel)</span>
            </button>
          )}

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onClose();
                onNavigate(item.id);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-900 hover:bg-blue-50/80 rounded-xl transition-all text-left"
            >
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-blue-800 flex items-center justify-center text-sm">
                <i className={item.icon}></i>
              </span>
              <span className="flex-1">{item.label}</span>
              <i className="fa-solid fa-chevron-right text-xs text-slate-300"></i>
            </button>
          ))}
        </div>

        {/* Bottom Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          {user ? (
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>লগআউট (Logout)</span>
            </button>
          ) : (
            <div className="text-center text-xs text-slate-500">
              {settings.site_name} &bull; {settings.developer_credit}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
