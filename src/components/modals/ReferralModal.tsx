import React, { useState } from 'react';
import { UserProfile } from '../../types/database';
import { store } from '../../lib/store';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const settings = store.getSettings();
  const allUsers = store.getAllUsers();
  const referralCode = user?.referral_code || 'EASYBD';
  const siteUrl = window.location.origin;
  const referralLink = `${siteUrl}?ref=${referralCode}`;

  // Find users referred by this user
  const myReferees = allUsers.filter((u) => u.referred_by === referralCode);
  const activeCount = myReferees.filter((u) => !u.is_suspended).length;
  const estimatedEarnings = myReferees.length * settings.referral_bonus;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const shareText = encodeURIComponent(
    `🔥 EASY EARNING BD-তে কাজ করে প্রতিদিন ২০০-৫০০ টাকা আয় করুন! এখনই ফ্রি একাউন্ট খুলে ওয়েলকাম বোনাস নিন।\nরেফার কোড: ${referralCode}\nলিংক: ${referralLink}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-[#1e3a8a] text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs mx-auto flex items-center justify-center text-2xl text-amber-300 mb-2 shadow-inner">
            <i className="fa-solid fa-users-viewfinder"></i>
          </div>

          <h3 className="text-lg font-bold">রেফারেল প্রোগ্রাম (Refer & Earn)</h3>
          <p className="text-xs text-teal-100">
            প্রতি রেফারে ৳{settings.referral_bonus} ইনস্ট্যান্ট + আজীবন {settings.referral_commission_pct}% ইনকাম কমিশন
          </p>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {!user ? (
            <div className="text-center py-8">
              <p className="text-xs text-slate-600 mb-3">আপনার ব্যক্তিগত রেফারেল লিংক পেতে অনুগ্রহ করে লগইন করুন</p>
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                লগইন / সাইনআপ
              </button>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">মোট রেফারেল</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {myReferees.length} জন
                  </span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-center">
                  <span className="text-[10px] text-emerald-700 block">সক্রিয় মেম্বার</span>
                  <span className="text-base font-extrabold text-emerald-800">
                    {activeCount} জন
                  </span>
                </div>
                <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 text-center">
                  <span className="text-[10px] text-blue-700 block">রেফারেল বোনাস</span>
                  <span className="text-base font-extrabold text-blue-900">
                    ৳{estimatedEarnings}
                  </span>
                </div>
              </div>

              {/* Referral Code Box */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                    আপনার ইউনিক রেফার কোড
                  </span>
                  <span className="text-base font-extrabold text-blue-900 tracking-wider">
                    {referralCode}
                  </span>
                </div>
                <button
                  onClick={copyCode}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <i className={copiedCode ? 'fa-solid fa-check text-green-300' : 'fa-regular fa-copy'}></i>
                  <span>{copiedCode ? 'কপি হয়েছে' : 'কোড কপি'}</span>
                </button>
              </div>

              {/* Referral Link Box */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                  আপনার ইনভাইট লিংক
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="w-full bg-white px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-700 select-all font-mono"
                  />
                  <button
                    onClick={copyLink}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shrink-0 active:scale-95 flex items-center gap-1"
                  >
                    <i className={copiedLink ? 'fa-solid fa-check text-green-200' : 'fa-solid fa-link'}></i>
                    <span>{copiedLink ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">
                  সরাসরি শেয়ার করুন:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://wa.me/?text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 shadow-xs"
                  >
                    <i className="fa-brands fa-whatsapp text-sm"></i>
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('EASY EARNING BD-তে জয়েন করে ঘরে বসে টাকা আয় করুন!')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 rounded-xl bg-[#229ED9] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 shadow-xs"
                  >
                    <i className="fa-brands fa-telegram text-sm"></i>
                    <span>Telegram</span>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 rounded-xl bg-[#1877F2] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 shadow-xs"
                  >
                    <i className="fa-brands fa-facebook text-sm"></i>
                    <span>Facebook</span>
                  </a>
                </div>
              </div>

              {/* Referred Friends List */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>আপনার রেফারেল টিম</span>
                  <span className="text-[11px] text-slate-500">{myReferees.length} জন সদস্য</span>
                </h4>

                {myReferees.length === 0 ? (
                  <div className="text-center py-4 bg-slate-50 rounded-xl text-slate-400 text-xs">
                    এখনো কোনো বন্ধু আপনার কোড ব্যবহার করে জয়েন করেনি। শেয়ার করে টিম তৈরি করুন!
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {myReferees.map((referee) => (
                      <div
                        key={referee.id}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={referee.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80'}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-800">{referee.full_name}</span>
                        </div>
                        <span className="text-green-600 font-bold">+৳{settings.referral_bonus}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
