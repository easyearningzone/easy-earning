import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { AuthGuard } from '../components/layout/AuthGuard';
import { store } from '../lib/store';
import { ProjectItem } from '../types/database';
import { ComingSoonModal } from '../components/modals/ComingSoonModal';

export const ProjectsPage: React.FC = () => {
  const projects = store.getProjects().filter((p) => p.status === 'active');
  const [filter, setFilter] = useState('all');
  const [comingSoonProject, setComingSoonProject] = useState<ProjectItem | null>(null);

  const filtered = filter === 'all'
    ? projects
    : filter === 'bonus'
    ? projects.filter((p) => ['bonus', 'gift', 'referral', 'rankings'].includes(p.category))
    : filter === 'tasks'
    ? projects.filter((p) => ['tasks', 'social', 'ads', 'marketing', 'work', 'entertainment'].includes(p.category))
    : projects.filter((p) => ['services', 'courses', 'design', 'video', 'recharge', 'telecom'].includes(p.category));

  return (
    <>
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'সকল আর্নিং প্রজেক্ট (All Projects)' }]} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h2 className="text-base font-bold text-slate-900">সকল আর্নিং প্রজেক্ট ({projects.length})</h2>
            <p className="text-xs text-slate-500">যে কাজ বা সার্ভিস নিতে চান ক্লিক করে শুরু করুন</p>
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'সবগুলো' },
              { id: 'bonus', label: '🎁 বোনাস' },
              { id: 'tasks', label: '💼 মাইক্রো টাস্ক' },
              { id: 'services', label: '🚀 সার্ভিস ও কোর্স' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((p) => {
            const isComingSoon = p.is_coming_soon;
            // Direct page mapping for specific projects
            let targetUrl = `/project-details.html?id=${p.id}`;
            if (p.modal_id === 'recharge') targetUrl = '/mobile-recharge.html';
            if (p.modal_id === 'drive_offers') targetUrl = '/drive-offers.html';
            if (p.modal_id === 'tasks') targetUrl = '/micro-jobs.html';
            if (p.modal_id === 'typing_jobs') targetUrl = '/typing-jobs.html';
            if (p.modal_id === 'quiz_jobs') targetUrl = '/quiz.html';
            if (p.modal_id === 'daily_bonus' || p.modal_id === 'spin_wheel' || p.modal_id === 'gift_code' || p.modal_id === 'welcome_bonus') targetUrl = '/bonus.html';
            if (p.modal_id === 'referral') targetUrl = '/referral.html';
            if (p.modal_id === 'leaderboard') targetUrl = '/leaderboard.html';
            if (p.modal_id === 'digital_services') targetUrl = '/digital-services.html';
            if (p.modal_id === 'courses') targetUrl = '/courses.html';
            if (p.modal_id === 'gmail_marketing' || p.id === 'p20') targetUrl = '/gmail-marketing.html';

            return (
              <div
                key={p.id}
                onClick={() => {
                  if (isComingSoon) {
                    setComingSoonProject(p);
                  } else {
                    window.location.href = targetUrl;
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center text-center group active:scale-95 relative cursor-pointer ${
                  isComingSoon
                    ? 'bg-slate-50/70 hover:bg-rose-50/40 border-slate-200 hover:border-rose-300'
                    : 'bg-white border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-400'
                }`}
              >
                {/* Badge */}
                {isComingSoon ? (
                  <span className="absolute -top-1.5 -right-1 text-[9px] font-extrabold bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-2 py-0.5 rounded-full shadow-xs uppercase tracking-tight">
                    কামিং সুন
                  </span>
                ) : p.badge ? (
                  <span className="absolute -top-1.5 -right-1 text-[9px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                    {p.badge}
                  </span>
                ) : null}

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg shadow-sm mb-2 transition-transform group-hover:scale-110 ${
                    isComingSoon ? 'opacity-90' : ''
                  }`}
                  style={{ backgroundColor: p.icon_color || '#2563eb' }}
                >
                  <i className={p.icon}></i>
                </div>
                <h3
                  className={`text-xs font-bold line-clamp-1 ${
                    isComingSoon ? 'text-slate-700 group-hover:text-rose-700' : 'text-slate-800 group-hover:text-blue-900'
                  }`}
                >
                  {p.title_bn}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-1">
                  {isComingSoon ? 'শীঘ্রই চালু হচ্ছে' : p.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <ComingSoonModal
        project={comingSoonProject}
        isOpen={!!comingSoonProject}
        onClose={() => setComingSoonProject(null)}
      />
    </>
  );
};

export const MobileRechargePage: React.FC = () => {
  const user = store.getCurrentUser();
  const wallet = user ? store.getWallet(user.id) : null;
  const [operator, setOperator] = useState('Grameenphone');
  const [number, setNumber] = useState(user?.mobile || '');
  const [amount, setAmount] = useState('50');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const amt = parseFloat(amount);
    if ((wallet?.available_balance || 0) < amt) {
      setFeedback({ text: 'আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই।', success: false });
      return;
    }

    setLoading(true);
    setFeedback(null);
    setTimeout(() => {
      store.adjustUserBalance('admin-demo-1', user.id, -amt, `মোবাইল রিচার্জ (${operator} - ${number})`);
      setLoading(false);
      setFeedback({ text: `সফল! ${number} নাম্বারে ৳${amt} রিচার্জ সফলভাবে পাঠানো হয়েছে।`, success: true });
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }, 1000);
  };

  return (
    <AuthGuard>
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'সকল প্রজেক্ট', href: '/projects.html' }, { label: 'মোবাইল রিচার্জ' }]} />

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">তাৎক্ষণিক মোবাইল রিচার্জ</h2>
            <p className="text-xs text-slate-500">ওয়ালেট ব্যালেন্স দিয়ে যেকোনো প্রিপেইড বা পোস্টপেইড নাম্বারে রিচার্জ করুন</p>
          </div>

          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex justify-between items-center text-xs">
            <span className="text-slate-600">বর্তমান ব্যালেন্স:</span>
            <span className="text-base font-extrabold text-blue-900">৳{(wallet?.available_balance || 0).toFixed(2)}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">অপারেটর সিলেক্ট করুন</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {['Grameenphone', 'Robi', 'Banglalink', 'Airtel', 'Teletalk'].map((op) => (
                  <button
                    type="button"
                    key={op}
                    onClick={() => setOperator(op)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                      operator === op
                        ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নাম্বার</label>
              <input
                type="tel"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পরিমাণ (টাকা)</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {['20', '50', '100', '200'].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-extrabold border ${
                      amount === amt
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold text-center ${
                  feedback.success
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {feedback.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : `৳${amount} রিচার্জ সম্পন্ন করুন`}
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};

export const DriveOffersPage: React.FC = () => {
  const [ordered, setOrdered] = useState<string | null>(null);

  const packs = [
    { id: '1', op: 'Grameenphone', name: '40 GB + 800 Min (30 Days)', price: '৳৭৯৯', reg: '৳৯৯৮', cash: '৳২০০ ক্যাশব্যাক' },
    { id: '2', op: 'Robi', name: '50 GB Internet (30 Days)', price: '৳৪৫০', reg: '৳৫৯৮', cash: '৳১৪৮ ক্যাশব্যাক' },
    { id: '3', op: 'Banglalink', name: '30 GB + 500 Min (30 Days)', price: '৳৪৯৯', reg: '৳৬৫০', cash: '৳১৫১ ক্যাশব্যাক' },
    { id: '4', op: 'Airtel', name: '25 GB + 450 Min (30 Days)', price: '৳৩৯৯', reg: '৳৫২০', cash: '৳১২১ ক্যাশব্যাক' },
  ];

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'সকল প্রজেক্ট', href: '/projects.html' }, { label: 'ড্রাইভ অফার' }]} />

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">আজকের স্পেশাল ড্রাইভ অফার সমূহ</h2>
          <p className="text-xs text-slate-500">সেরা ডিসকাউন্টে সরাসরি ক্যাশব্যাক সহ ইন্টারনেট ও মিনিট প্যাক</p>
        </div>

        {ordered && (
          <div className="p-3 bg-green-50 text-green-800 rounded-xl border border-green-200 text-xs font-semibold">
            {ordered}
          </div>
        )}

        <div className="space-y-3">
          {packs.map((p) => (
            <div
              key={p.id}
              className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded mr-1">
                  {p.op}
                </span>
                <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                <div className="text-emerald-700 font-semibold mt-1">{p.cash}</div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                <div>
                  <span className="text-base font-extrabold text-blue-900">{p.price}</span>
                  <span className="text-slate-400 line-through text-[11px] ml-1">{p.reg}</span>
                </div>
                <button
                  onClick={() => setOrdered(`${p.op} - ${p.name} অর্ডার সফল হয়েছে। ৫-১০ মিনিটের মধ্যে যুক্ত হবে।`)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  এখনই কিনুন
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TypingJobsPage: React.FC = () => {
  const user = store.getCurrentUser();
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const targetText = 'EASY EARNING BD বাংলাদেশের একটি সেরা অনলাইন ইনকাম প্ল্যাটফর্ম।';

  if (user?.is_verified !== 'verified') {
    return (
      <div className="space-y-4 max-w-lg mx-auto">
        <Breadcrumb items={[{ label: 'সকল প্রজেক্ট', href: '/projects.html' }, { label: 'টাইপিং জবস' }]} />
        <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-inner">
            <i className="fa-solid fa-lock"></i>
          </div>
          <div>
            <span className="text-[10px] font-extrabold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full uppercase">
              টাস্ক লকড
            </span>
            <h2 className="text-base font-black text-slate-900 mt-2">
              টাইপিং জবস আনলক করতে একাউন্ট ভেরিফাই করুন
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              নতুন একাউন্ট খোলার পর ১০০ টাকা ফি দিয়ে একাউন্ট ভেরিফাই ও অ্যাক্টিভ করতে হবে। ভেরিফিকেশন ছাড়া কোনো প্রকার টাস্ক ওপেন হবে না।
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
            ফি: ৳১০০ (বিকাশ, নগদ বা রকেটে পেমেন্ট করে TrxID দিয়ে ভেরিফাই করুন)
          </div>
          <div className="pt-2">
            <a
              href="/verification.html"
              className="w-full py-3 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-unlock"></i>
              <span>১০০ টাকা দিয়ে একাউন্ট ভেরিফাই করুন 👉</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login.html';
      return;
    }
    if (input.trim() === targetText) {
      store.creditBalance(user.id, 3.0, 'task_reward', 'টাইপিং টাস্ক সম্পন্ন');
      setFeedback('🎉 চমৎকার! নির্ভুল টাইপিংয়ের জন্য ৳৩ ওয়ালেটে যোগ হয়েছে।');
      setInput('');
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } else {
      setFeedback('টেক্সট হুবহু মেলেনি। সঠিক বানান ও যতিচিহ্ন লক্ষ্য করুন।');
    }
  };

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'সকল প্রজেক্ট', href: '/projects.html' }, { label: 'টাইপিং জবস' }]} />

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">বাংলা ও ইংরেজি টাইপিং জবস</h2>
          <p className="text-xs text-slate-500">প্রদত্ত টেক্সট নির্ভুলভাবে টাইপ করে প্রতি টাস্কে টাকা আয় করুন</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center select-none">
          <span className="text-[11px] text-slate-500 font-semibold block mb-1">নিচের বাক্যটি হুবহু লিখুন:</span>
          <p className="text-sm font-bold text-blue-950 font-serif">"{targetText}"</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="এখানে টাইপ করুন..."
            className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-900"
            required
          />

          {feedback && (
            <div className="p-3 bg-slate-100 rounded-xl text-xs font-semibold text-center text-slate-800">
              {feedback}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            টাইপিং জমা দিন (৳৩ রিওয়ার্ড)
          </button>
        </form>
      </div>
    </div>
  );
};

export const QuizPage: React.FC = () => {
  const user = store.getCurrentUser();
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);

  if (user?.is_verified !== 'verified') {
    return (
      <div className="space-y-4 max-w-lg mx-auto">
        <Breadcrumb items={[{ label: 'সকল প্রজেক্ট', href: '/projects.html' }, { label: 'কুইজ টাস্ক' }]} />
        <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-inner">
            <i className="fa-solid fa-lock"></i>
          </div>
          <div>
            <span className="text-[10px] font-extrabold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full uppercase">
              টাস্ক লকড
            </span>
            <h2 className="text-base font-black text-slate-900 mt-2">
              কুইজ জবস আনলক করতে একাউন্ট ভেরিফাই করুন
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              নতুন একাউন্ট খোলার পর ১০০ টাকা ফি দিয়ে একাউন্ট ভেরিফাই ও অ্যাক্টিভ করতে হবে। ভেরিফিকেশন ছাড়া কোনো প্রকার টাস্ক ওপেন হবে না।
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
            ফি: ৳১০০ (বিকাশ, নগদ বা রকেটে পেমেন্ট করে TrxID দিয়ে ভেরিফাই করুন)
          </div>
          <div className="pt-2">
            <a
              href="/verification.html"
              className="w-full py-3 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-unlock"></i>
              <span>১০০ টাকা দিয়ে একাউন্ট ভেরিফাই করুন 👉</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!user) {
      window.location.href = '/login.html';
      return;
    }
    if (selectedOpt === 1) {
      store.creditBalance(user.id, 5.0, 'task_reward', 'কুইজ সঠিক উত্তর পুরস্কার');
      setResult('🎉 সঠিক উত্তর! আপনার একাউন্টে ৳৫ ক্রেডিট হয়েছে।');
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } else {
      setResult('ভুল উত্তর! সঠিক উত্তর ছিল: ঢাকা। পরের কুইজে আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'সকল প্রজেক্ট', href: '/projects.html' }, { label: 'কুইজ টাস্ক' }]} />

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">সাধারণ জ্ঞান কুইজ টাস্ক</h2>
          <p className="text-xs text-slate-500">প্রতিটি সঠিক উত্তরের জন্য সাথে সাথে ওয়ালেটে টাকা নিন</p>
        </div>

        <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-3">
          <h3 className="text-sm font-bold text-blue-950">
            প্রশ্ন: বাংলাদেশের বর্তমান রাজধানীর নাম কী?
          </h3>

          <div className="space-y-2">
            {['চট্টগ্রাম', 'ঢাকা', 'সিলেট', 'রাজশাহী'].map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOpt(idx)}
                className={`w-full p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  selectedOpt === idx
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {idx + 1}. {opt}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="p-3 bg-slate-100 rounded-xl text-xs font-semibold text-center text-slate-800">
            {result}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          উত্তর সাবমিট করুন (৳৫ রিওয়ার্ড)
        </button>
      </div>
    </div>
  );
};

export const BonusPage: React.FC = () => {
  const user = store.getCurrentUser();
  const [giftInput, setGiftInput] = useState('');
  const [giftMsg, setGiftMsg] = useState<string | null>(null);
  const [dailyMsg, setDailyMsg] = useState<string | null>(null);

  const handleDaily = () => {
    if (!user) {
      window.location.href = '/login.html';
      return;
    }
    const res = store.claimDailyBonus(user.id);
    setDailyMsg(res.message);
    if (res.success) confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  };

  const handleGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login.html';
      return;
    }
    const res = store.redeemGiftCode(user.id, giftInput);
    setGiftMsg(res.message);
    if (res.success) {
      setGiftInput('');
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'সকল প্রজেক্ট', href: '/projects.html' }, { label: 'বোনাস ও রিওয়ার্ড' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily Bonus Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center text-xl font-bold">
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <h3 className="text-sm font-bold text-slate-900">দৈনিক চেক-ইন বোনাস</h3>
          <p className="text-xs text-slate-500">প্রতি ২৪ ঘণ্টায় একবার ফ্রিতে ৫ টাকা বোনাস সংগ্রহ করুন</p>
          {dailyMsg && <div className="text-xs font-bold text-blue-900">{dailyMsg}</div>}
          <button
            onClick={handleDaily}
            className="w-full py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            আজকের বোনাস ক্লেইম
          </button>
        </div>

        {/* Gift Code Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center text-xl font-bold">
            <i className="fa-solid fa-ticket"></i>
          </div>
          <h3 className="text-sm font-bold text-slate-900">সিক্রেট গিফট কোড</h3>
          <p className="text-xs text-slate-500">টেলিগ্রাম চ্যানেলে শেয়ার করা প্রোমো কোড দিয়ে রিওয়ার্ড নিন</p>
          <form onSubmit={handleGift} className="space-y-2">
            <input
              type="text"
              placeholder="যেমন: EASY2026"
              value={giftInput}
              onChange={(e) => setGiftInput(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold uppercase"
              required
            />
            {giftMsg && <div className="text-xs font-bold text-pink-700">{giftMsg}</div>}
            <button
              type="submit"
              className="w-full py-2.5 bg-pink-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              কোড রিডিম করুন
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const LeaderboardPage: React.FC = () => {
  const leaders = [
    { rank: 1, name: 'মোহাম্মদ রাশেদ', earned: '৳৩,৪৫০', tasks: '৪২টি কাজ', prize: '🥇 ১ম পুরস্কার' },
    { rank: 2, name: 'তানভীর আহমেদ', earned: '৳২,৮২০', tasks: '৩৮টি কাজ', prize: '🥈 ২য় পুরস্কার' },
    { rank: 3, name: 'সুমন হোসাইন', earned: '৳২,৪০০', tasks: '৩৫টি কাজ', prize: '🥉 ৩য় পুরস্কার' },
    { rank: 4, name: 'নাঈম হাসান', earned: '৳১,৯৫০', tasks: '২৮টি কাজ', prize: '৪র্থ পুরস্কার' },
    { rank: 5, name: 'মেহেদী হাসান', earned: '৳১,৭০০', tasks: '২৫টি কাজ', prize: '৫ম পুরস্কার' },
    { rank: 6, name: 'আরিফুল ইসলাম', earned: '৳১,৬০০', tasks: '২৪টি কাজ', prize: '৬ষ্ঠ পুরস্কার' },
    { rank: 7, name: 'শাকিল আহমেদ', earned: '৳১,৪৫০', tasks: '২১টি কাজ', prize: '৭ম পুরস্কার' },
  ];

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'সকল প্রজেক্ট', href: '/projects.html' }, { label: 'লিডারবোর্ড (Leaderboard)' }]} />

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">চলতি মাসের সেরা টপ আর্নারবৃন্দ</h2>
          <p className="text-xs text-slate-500">শীর্ষ ৩ জনকে প্রতি মাসে বিশেষ মেগা ক্যাশ প্রাইজ প্রদান করা হয়</p>
        </div>

        <div className="divide-y divide-slate-100">
          {leaders.map((lead) => (
            <div key={lead.rank} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                    lead.rank === 1
                      ? 'bg-amber-400 text-slate-950'
                      : lead.rank === 2
                      ? 'bg-slate-300 text-slate-800'
                      : lead.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {lead.rank}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{lead.name}</h4>
                  <span className="text-[10px] text-slate-400">{lead.tasks}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-emerald-600 block">{lead.earned}</span>
                <span className="text-[10px] text-amber-700 font-semibold">{lead.prize}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
