import React, { useState } from 'react';
import { store } from '../lib/store';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Read ref from URL if exists
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) setReferralCode(ref.toUpperCase());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

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
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 800);
      } else {
        setErrorMsg(res.message);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
        <div className="text-center space-y-1">
          <a href="/dashboard.html" className="inline-block">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center mx-auto shadow-md">
              <i className="fa-solid fa-hand-holding-dollar text-blue-950 text-xl font-bold"></i>
            </div>
          </a>
          <h1 className="text-lg font-bold text-slate-900">নতুন একাউন্ট রেজিস্টার করুন</h1>
          <p className="text-xs text-slate-500">EASY EARNING BD-তে যোগ দিয়ে আজই আয় শুরু করুন</p>
        </div>

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
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পুরো নাম (Full Name) *</label>
            <input
              type="text"
              placeholder="আপনার পুরো নাম"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নাম্বার (Mobile Number) *</label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল এড্রেস (Email Address) *</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পাসওয়ার্ড *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কনফার্ম পাসওয়ার্ড *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">রেফারেল কোড (ঐচ্ছিক)</label>
            <input
              type="text"
              placeholder="যেমন: EASYBD"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs uppercase outline-none focus:border-blue-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-900 to-indigo-900 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'একাউন্ট তৈরি করুন'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          ইতিমধ্যে একাউন্ট আছে?{' '}
          <a href="/login.html" className="font-bold text-blue-900 hover:underline">
            লগইন করুন
          </a>
        </div>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    setLoading(true);
    setTimeout(async () => {
      const res = await store.login(email, password);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          window.location.href = res.user?.role === 'admin' ? '/admin/dashboard.html' : '/dashboard.html';
        }, 600);
      } else {
        setErrorMsg(res.message);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
        <div className="text-center space-y-1">
          <a href="/dashboard.html" className="inline-block">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center mx-auto shadow-md">
              <i className="fa-solid fa-hand-holding-dollar text-blue-950 text-xl font-bold"></i>
            </div>
          </a>
          <h1 className="text-lg font-bold text-slate-900">একাউন্টে লগইন করুন</h1>
          <p className="text-xs text-slate-500">EASY EARNING BD</p>
        </div>

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
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল এড্রেস</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-900"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">পাসওয়ার্ড</label>
              <a href="/forgot-password.html" className="text-[11px] text-blue-600 hover:underline">
                ভুলে গেছেন?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-900 to-indigo-900 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'লগইন করুন'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          নতুন সদস্য?{' '}
          <a href="/register.html" className="font-bold text-blue-900 hover:underline">
            রেজিস্ট্রেশন করুন
          </a>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-xl shadow-xs">
            <i className="fa-solid fa-key"></i>
          </div>
          <h1 className="text-lg font-bold text-slate-900">পাসওয়ার্ড পুনরুদ্ধার</h1>
          <p className="text-xs text-slate-500">আপনার নিবন্ধিত ইমেইলে রিসেট কোড পাঠানো হবে</p>
        </div>

        {submitted ? (
          <div className="p-4 bg-green-50 text-green-800 rounded-2xl border border-green-200 text-xs space-y-3 text-center">
            <p>আপনার ইমেইলে পাসওয়ার্ড রিসেট লিংক ও নির্দেশিকা পাঠানো হয়েছে। ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।</p>
            <a
              href="/login.html"
              className="block w-full py-2 bg-green-700 text-white font-bold rounded-xl shadow-xs"
            >
              লগইনে ফিরুন
            </a>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল এড্রেস</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              রিসেট লিংক পাঠান
            </button>

            <a
              href="/login.html"
              className="block text-center text-xs text-blue-900 font-bold hover:underline"
            >
              লগইনে ফিরে যান
            </a>
          </form>
        )}
      </div>
    </div>
  );
};
