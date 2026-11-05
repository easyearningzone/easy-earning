import React, { useState } from 'react';
import { store } from '../../lib/store';
import { UserProfile } from '../../types/database';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'register') {
      if (!fullName.trim() || !mobile.trim() || !email.trim() || !password) {
        setErrorMsg('সবগুলো আবশ্যক ফিল্ড পূরণ করুন।');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
        return;
      }

      setLoading(true);
      setTimeout(async () => {
        const res = await store.register(fullName, mobile, email, password, referralCode);
        setLoading(false);
        if (res.success && res.user) {
          setSuccessMsg(res.message);
          setTimeout(() => {
            onSuccess(res.user!);
            onClose();
          }, 800);
        } else {
          setErrorMsg(res.message);
        }
      }, 100);
    } else if (mode === 'login') {
      if (!email.trim() || !password) {
        setErrorMsg('ইমেইল ও পাসওয়ার্ড প্রদান করুন।');
        return;
      }

      setLoading(true);
      setTimeout(async () => {
        const res = await store.login(email, password);
        setLoading(false);
        if (res.success && res.user) {
          setSuccessMsg(res.message);
          setTimeout(() => {
            onSuccess(res.user!);
            onClose();
          }, 600);
        } else {
          setErrorMsg(res.message);
        }
      }, 100);
    } else {
      // Forgot password
      if (!email.trim()) {
        setErrorMsg('আপনার একাউন্টের ইমেইল ঠিকানা প্রদান করুন।');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg('আপনার ইমেইলে পাসওয়ার্ড রিসেট লিংক ও কোড পাঠানো হয়েছে।');
      }, 600);
    }
  };

  const fillDemoUser = () => {
    setEmail('user@easyearningbd.com');
    setPassword('user123');
    setMode('login');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@easyearningbd.com');
    setPassword('admin123');
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a8a] via-blue-800 to-indigo-900 text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 mx-auto flex items-center justify-center text-xl font-extrabold mb-2 shadow-md">
            <i className="fa-solid fa-hand-holding-dollar"></i>
          </div>

          <h3 className="text-base sm:text-lg font-bold">
            {mode === 'login'
              ? 'একাউন্টে লগইন করুন'
              : mode === 'register'
              ? 'নতুন একাউন্ট রেজিস্টার করুন'
              : 'পাসওয়ার্ড পুনরুদ্ধার'}
          </h3>
          <p className="text-xs text-blue-200">EASY EARNING BD &bull; অনলাইন আর্নিং প্ল্যাটফর্ম</p>

          {/* Mode Switcher */}
          <div className="flex gap-2 mt-3 bg-blue-950/40 p-1 rounded-xl">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              লগইন
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              রেজিস্ট্রেশন
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3.5">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-50 text-green-700 text-xs font-semibold rounded-xl border border-green-200 text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পুরো নাম (Full Name) *
                  </label>
                  <input
                    type="text"
                    placeholder="আপনার নাম লিখুন"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    মোবাইল নাম্বার (Mobile Number) *
                  </label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ইমেইল এড্রেস (Email Address) *
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    পাসওয়ার্ড (Password) *
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-blue-600 hover:underline font-semibold"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                  required
                />
              </div>
            )}

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পাসওয়ার্ড নিশ্চিত করুন (Confirm Password) *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    রেফারেল কোড (Referral Code - ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: EASYBD"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs uppercase"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : mode === 'login' ? (
                'লগইন করুন'
              ) : mode === 'register' ? (
                'একাউন্ট তৈরি করুন'
              ) : (
                'রিসেট লিংক পাঠান'
              )}
            </button>
          </form>

          {/* Quick Demo Login Helpers */}
          <div className="pt-2 border-t border-slate-200">
            <span className="text-[11px] text-slate-500 font-semibold block text-center mb-2">
              ⚡ দ্রুত টেস্ট করার জন্য ডেমো একাউন্ট:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoUser}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 text-center transition-all"
              >
                👤 ইউজার (রাশেদ)
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-lg border border-amber-300 text-center transition-all"
              >
                🛡️ এডমিন একাউন্ট
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
