import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../../types/database';
import { store } from '../../lib/store';

interface DailyBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

export const DailyBonusModal: React.FC<DailyBonusModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
}) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const streakDays = [
    { day: 1, amount: 5, label: '১ম দিন' },
    { day: 2, amount: 7, label: '২য় দিন' },
    { day: 3, amount: 10, label: '৩য় দিন' },
    { day: 4, amount: 12, label: '৪র্থ দিন' },
    { day: 5, amount: 15, label: '৫ম দিন' },
    { day: 6, amount: 18, label: '৬ষ্ঠ দিন' },
    { day: 7, amount: 25, label: '৭ম দিন (মেগা)', isMega: true },
  ];

  // Check if claimed today
  const claims = user ? store.getBonusClaims(user.id) : [];
  const todayStr = new Date().toISOString().split('T')[0];
  const claimedToday = claims.some(
    (c) => c.bonus_type === 'daily' && c.claimed_at.startsWith(todayStr)
  );

  const handleClaim = () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    setLoading(true);
    setMsg(null);

    setTimeout(() => {
      const res = store.claimDailyBonus(user.id);
      setLoading(false);
      setMsg({ text: res.message, success: res.success });
      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-[#1e3a8a] p-5 text-white relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-900 mx-auto flex items-center justify-center text-2xl shadow-lg mb-2">
            <i className="fa-solid fa-calendar-check"></i>
          </div>

          <h3 className="text-lg font-bold text-white">দৈনিক চেক-ইন বোনাস</h3>
          <p className="text-xs text-blue-100">প্রতিদিন লগইন করে ফ্রিতে টাকা সংগ্রহ করুন</p>
        </div>

        {/* 7-Day Streak Grid */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {streakDays.map((item, idx) => (
              <div
                key={item.day}
                className={`p-2 rounded-xl text-center border transition-all ${
                  item.isMega
                    ? 'col-span-4 sm:col-span-1 bg-gradient-to-b from-amber-50 to-orange-50 border-amber-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-[10px] text-slate-500 font-medium block">
                  {item.label}
                </span>
                <span
                  className={`text-sm font-extrabold block my-0.5 ${
                    item.isMega ? 'text-amber-600' : 'text-blue-700'
                  }`}
                >
                  ৳{item.amount}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {idx === 0 && claimedToday ? (
                    <i className="fa-solid fa-check text-green-500 font-bold"></i>
                  ) : (
                    <i className="fa-solid fa-gift"></i>
                  )}
                </span>
              </div>
            ))}
          </div>

          {msg && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold text-center ${
                msg.success
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {msg.text}
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handleClaim}
            disabled={loading || (claimedToday && !!user)}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
              claimedToday && !!user
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white'
            }`}
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : claimedToday && !!user ? (
              <>
                <i className="fa-solid fa-circle-check text-green-600"></i>
                <span>আজকের বোনাস গ্রহণ সম্পন্ন হয়েছে</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-hand-holding-dollar"></i>
                <span>আজকের ৫৳ বোনাস ক্লেইম করুন</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-500">
            নোট: প্রতিদিন অন্তত একবার চেক-ইন করতে হবে। ধারাবাহিক ৭ দিন ক্লেইম করলে মেগা রিওয়ার্ড মিলবে।
          </p>
        </div>
      </div>
    </div>
  );
};
