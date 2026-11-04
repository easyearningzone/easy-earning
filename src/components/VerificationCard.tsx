import React from 'react';
import { UserProfile } from '../types/database';

interface VerificationCardProps {
  user: UserProfile | null;
  onOpenVerification: () => void;
  onOpenAuth: () => void;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({
  user,
  onOpenVerification,
  onOpenAuth
}) => {
  if (!user) {
    return (
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 shadow-sm border border-blue-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-800/80 flex items-center justify-center text-amber-400 text-xl shadow-xs">
              <i className="fa-solid fa-shield-cat"></i>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">একাউন্টে লগইন করুন</h3>
              <p className="text-xs text-blue-200">আয় এবং উইথড্র করার জন্য একাউন্ট প্রয়োজন</p>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold rounded-xl shadow-md transition-transform active:scale-95"
          >
            লগইন / সাইনআপ
          </button>
        </div>
      </div>
    );
  }

  if (user.is_verified === 'verified') {
    return (
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-green-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-500 text-white flex items-center justify-center text-xl shadow-sm">
              <i className="fa-solid fa-certificate"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-800">একাউন্ট ভেরিফাইড (KYC Approved)</h3>
                <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full font-bold">
                  সক্রিয়
                </span>
              </div>
              <p className="text-xs text-slate-600">আপনি সর্বোচ্চ লিমিটে আনলিমিটেড উইথড্র ও টাস্ক করতে পারবেন।</p>
            </div>
          </div>
          <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
            <i className="fa-solid fa-shield-check"></i>
          </span>
        </div>
      </div>
    );
  }

  if (user.is_verified === 'pending') {
    return (
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-sm animate-pulse">
              <i className="fa-solid fa-clock"></i>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">ভেরিফিকেশন পর্যালোচনায় আছে</h3>
              <p className="text-xs text-slate-600">আপনার NID/ডকুমেন্ট আমাদের এডমিন টিম যাচাই করছে।</p>
            </div>
          </div>
          <button
            onClick={onOpenVerification}
            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded-lg transition-all"
          >
            বিবরণ দেখুন
          </button>
        </div>
      </div>
    );
  }

  // Unverified or Rejected
  return (
    <div className="rainbow-card p-4 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl shadow-xs">
            <i className="fa-solid fa-id-card"></i>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-slate-900">
                {user.is_verified === 'rejected' ? 'ভেরিফিকেশন ব্যর্থ হয়েছে' : 'একাউন্ট ভেরিফাই করুন (KYC)'}
              </h3>
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                {user.is_verified === 'rejected' ? 'প্রত্যাখ্যাত' : 'প্রয়োজনীয়'}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              উইথড্র দ্রুত পেতে ও সর্বোচ্চ বোনাস পেতে এখনই আইডি ভেরিফাই করুন।
            </p>
          </div>
        </div>

        <button
          onClick={onOpenVerification}
          className="whitespace-nowrap px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1"
        >
          <span>Verify Now</span>
          <i className="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>
    </div>
  );
};
