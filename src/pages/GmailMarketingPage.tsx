import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { AuthGuard } from '../components/layout/AuthGuard';
import { store } from '../lib/store';

export const GmailMarketingPage: React.FC = () => {
  const user = store.getCurrentUser();
  const settings = store.getSettings();

  const [gmailAddress, setGmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const todayPassword = settings.gmail_today_password || '@easybd2026';
  const price = settings.gmail_sell_price || 14.0;
  const limit = settings.gmail_daily_limit || 1000;
  const reportTime = settings.gmail_report_time || '২-৩ দিন';
  const tutorialUrl = settings.gmail_tutorial_url || 'https://youtu.be/SVnx1ErWc0s?si=_TNFeyqdNl_J_TQV';

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(todayPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleAutoFillPassword = () => {
    setPassword(todayPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login.html';
      return;
    }

    if (!gmailAddress.toLowerCase().endsWith('@gmail.com')) {
      setFeedback({ success: false, message: 'দয়া করে একটি সঠিক @gmail.com অ্যাড্রেস প্রদান করুন।' });
      return;
    }

    if (!password.trim()) {
      setFeedback({ success: false, message: 'পাসওয়ার্ড প্রদান করা আবশ্যক।' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    setTimeout(() => {
      const res = store.submitGmail(user.id, gmailAddress, password);
      setLoading(false);
      setFeedback(res);
      if (res.success) {
        setGmailAddress('');
        setPassword('');
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    }, 600);
  };

  return (
    <AuthGuard>
      <div className="max-w-[480px] mx-auto space-y-4">
        <Breadcrumb
          items={[
            { label: 'হোম', href: '/dashboard.html' },
            { label: 'সকল প্রজেক্ট', href: '/projects.html' },
            { label: 'জিমেইল মার্কেটিং' },
          ]}
        />

        {/* Top Tutorial Banner Button */}
        <a
          href={tutorialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#0088cc] to-[#2AABEE] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] group"
        >
          <div className="w-9 h-9 rounded-full bg-white text-[#0088cc] flex items-center justify-center text-lg shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <i className="fa-brands fa-youtube text-red-600"></i>
          </div>
          <span className="flex-1 text-sm font-bold">জিমেইল সেলস টিউটোরিয়াল দেখুন</span>
          <i className="fa-solid fa-arrow-up-right-from-square text-xs opacity-80 mr-1"></i>
        </a>

        {/* Top Action Button: Gmail History */}
        <a
          href="/gmail-history.html"
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs hover:shadow-xs hover:border-blue-400 transition-all active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-900 to-blue-600 text-white flex items-center justify-center text-sm shrink-0 shadow-xs">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </div>
          <span className="flex-1">আমার জিমেইল সেলস হিস্ট্রি ও স্ট্যাটাস</span>
          <i className="fa-solid fa-chevron-right text-xs text-slate-400"></i>
        </a>

        {/* Card 1: Main Info & Daily Password Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-center space-y-4">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto text-xl mb-2 shadow-2xs">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">জিমেইল মার্কেটিং</h2>
            <p className="text-xs text-slate-500 leading-relaxed mt-1 px-1">
              সঠিক নিয়মে কাজ করুন অন্যথায় পেমেন্ট পাবেন না। যদি ভুল জিমেইল জমা দেন অথবা ভুল পাসওয়ার্ড জমা দেন তাহলে আপনার অ্যাকাউন্ট সাময়িক বা স্থায়ীভাবে সাসপেন্ড হতে পারে।
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 font-bold text-xs border border-blue-200/80">
            <i className="fa-regular fa-clock text-blue-600"></i>
            <span>রিপোর্ট টাইম: {reportTime}</span>
          </div>

          {/* Info Grid (Limit & Price) */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="block text-[11px] font-bold text-slate-500 mb-0.5">দৈনিক লিমিট</span>
              <strong className="text-lg font-extrabold text-slate-900">{limit} টি</strong>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="block text-[11px] font-bold text-slate-500 mb-0.5">প্রতি জিমেইল প্রাইস</span>
              <strong className="text-lg font-extrabold text-emerald-600">৳ {price.toFixed(2)}</strong>
            </div>
          </div>

          {/* Today's Info Box */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 rounded-2xl p-4 text-white text-left shadow-md space-y-2.5">
            <h4 className="text-center font-bold text-xs uppercase tracking-wider text-blue-200">
              আজকের তথ্য ও রিকোয়ার্ড পাসওয়ার্ড
            </h4>

            <div className="bg-white/15 backdrop-blur-xs rounded-xl p-3 flex items-center justify-between border border-white/25">
              <div>
                <span className="text-[10px] font-semibold text-blue-200 block">জিমেইল তৈরির পাসওয়ার্ড</span>
                <strong className="text-base font-mono tracking-wider text-white select-all">
                  {todayPassword}
                </strong>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
                  title="পাসওয়ার্ড কপি করুন"
                >
                  <i className={`fa-solid ${copied ? 'fa-check text-emerald-300' : 'fa-copy'}`}></i>
                  <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
              </div>
            </div>
            <p className="text-[10px] text-blue-200/90 text-center">
              ⚠️ জিমেইল তৈরি করার সময় অবশ্যই এই পাসওয়ার্ডটি ব্যবহার করবেন।
            </p>
          </div>
        </div>

        {/* Card 2: Submission Form */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="text-center">
            <h3 className="text-base font-extrabold text-slate-900">জিমেইল সাবমিট ফর্ম</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              নিচের ফর্মটি সঠিক তথ্য দিয়ে ফিলাপ করে সাবমিট করুন
            </p>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-2xl text-xs font-semibold border flex items-start gap-2 ${
                feedback.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              <i
                className={`fa-solid ${
                  feedback.success ? 'fa-circle-check text-emerald-600' : 'fa-circle-exclamation text-rose-600'
                } mt-0.5`}
              ></i>
              <div className="flex-1">{feedback.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                জিমেইল লিখুন <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={gmailAddress}
                onChange={(e) => setGmailAddress(e.target.value)}
                placeholder="যেমন: myname1234@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  পাসওয়ার্ড লিখুন <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoFillPassword}
                  className="text-[10px] text-blue-700 font-bold hover:underline"
                >
                  আজকের পাসওয়ার্ড বসান
                </button>
              </div>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="যেমন: @easybd2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>যাচাই ও সাবমিট হচ্ছে...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check-square"></i>
                  <span>সাবমিট করুন (৳{price.toFixed(2)} ইনকাম)</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};

export const GmailHistoryPage: React.FC = () => {
  const user = store.getCurrentUser();
  const submissions = user ? store.getGmailSubmissions(user.id) : [];

  return (
    <AuthGuard>
      <div className="max-w-[480px] mx-auto space-y-4">
        <Breadcrumb
          items={[
            { label: 'হোম', href: '/dashboard.html' },
            { label: 'জিমেইল মার্কেটিং', href: '/gmail-marketing.html' },
            { label: 'জিমেইল সেলস হিস্ট্রি' },
          ]}
        />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">আমার জিমেইল সেলস হিস্ট্রি</h2>
            <p className="text-xs text-slate-500">মোট সাবমিট করা জিমেইল: {submissions.length}টি</p>
          </div>

          <a
            href="/gmail-marketing.html"
            className="px-3 py-1.5 rounded-xl bg-blue-900 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <i className="fa-solid fa-plus text-[10px]"></i>
            <span>নতুন জিমেইল দিন</span>
          </a>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto text-2xl">
              <i className="fa-solid fa-envelope-open-text"></i>
            </div>
            <h3 className="text-sm font-bold text-slate-800">এখনো কোনো জিমেইল জমা দেননি</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              প্রতি জিমেইল সেল করে নিশ্চিত ১৪ টাকা আয় করতে এখনই জিমেইল তৈরি করে সাবমিট করুন।
            </p>
            <a
              href="/gmail-marketing.html"
              className="inline-block px-4 py-2 bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              জিমেইল সাবমিট করুন
            </a>
          </div>
        ) : (
          <div className="space-y-2.5">
            {submissions.map((sub) => {
              const dateStr = new Date(sub.submitted_at).toLocaleDateString('bn-BD', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {sub.gmail_address}
                      </span>
                      <span className="text-[10px] text-slate-400">{dateStr}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        sub.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : sub.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {sub.status === 'approved'
                        ? 'অনুমোদিত (পেইড)'
                        : sub.status === 'rejected'
                        ? 'বাতিল'
                        : 'পেন্ডিং (যাচাই চলছে)'}
                    </span>
                  </div>

                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">পেমেন্ট রেট:</span>
                    <strong className="text-emerald-600 font-extrabold">
                      ৳{sub.price_rate.toFixed(2)}
                    </strong>
                  </div>

                  {sub.rejection_reason && (
                    <div className="p-2 bg-rose-50 text-rose-700 rounded-xl text-[11px] border border-rose-200">
                      <strong>বাতিলের কারণ: </strong>
                      {sub.rejection_reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AuthGuard>
  );
};
