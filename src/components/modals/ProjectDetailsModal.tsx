import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ProjectItem, UserProfile } from '../../types/database';
import { store } from '../../lib/store';

interface ProjectDetailsModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  onClose,
  user,
  onOpenAuth,
}) => {
  if (!project) return null;

  // Recharge state
  const [operator, setOperator] = useState('Grameenphone');
  const [rechargeNumber, setRechargeNumber] = useState(user?.mobile || '');
  const [rechargeAmount, setRechargeAmount] = useState('50');
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Quiz state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Typing state
  const [typingInput, setTypingInput] = useState('');
  const sampleTypingText = 'EASY EARNING BD বাংলাদেশের একটি বিশ্বস্ত প্ল্যাটফর্ম।';

  const wallet = user ? store.getWallet(user.id) : null;

  // Handle Mobile Recharge Execution
  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    const amount = parseFloat(rechargeAmount);
    if (!rechargeNumber || rechargeNumber.length < 11) {
      setMsg({ text: 'সঠিক ১১ ডিজিটের মোবাইল নাম্বার প্রদান করুন।', success: false });
      return;
    }
    if ((wallet?.available_balance || 0) < amount) {
      setMsg({ text: `পর্যাপ্ত ব্যালেন্স নেই। আপনার ওয়ালেটে আছে ৳${wallet?.available_balance || 0}`, success: false });
      return;
    }

    setActionLoading(true);
    setMsg(null);

    setTimeout(() => {
      // Deduct balance
      store.adjustUserBalance(
        'admin-demo-1',
        user.id,
        -amount,
        `মোবাইল রিচার্জ (${operator} - ${rechargeNumber})`
      );
      setActionLoading(false);
      setMsg({
        text: `সফল! ${rechargeNumber} নাম্বারে ৳${amount} মোবাইল রিচার্জ সফল হয়েছে।`,
        success: true,
      });
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }, 1000);
  };

  // Handle Quiz Submission
  const handleQuizSubmit = () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (quizAnswer === 1) {
      // Correct!
      setQuizFinished(true);
      store.creditBalance(user.id, 5.0, 'task_reward', 'কুইজ সঠিক উত্তর পুরস্কার');
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } else {
      setMsg({ text: 'ভুল উত্তর! সঠিক উত্তর ছিল: ঢাকা', success: false });
    }
  };

  // Handle Typing Submission
  const handleTypingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (typingInput.trim() === sampleTypingText) {
      store.creditBalance(user.id, 3.0, 'task_reward', 'টাইপিং টাস্ক সম্পন্ন পুরস্কার');
      setMsg({ text: '🎉 চমৎকার! নির্ভুল টাইপিংয়ের জন্য ৳৩ ওয়ালেটে যোগ হয়েছে।', success: true });
      setTypingInput('');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } else {
      setMsg({ text: 'টেক্সট হুবহু মেলেনি। বানান ও দাঁড়ি লক্ষ্য করুন।', success: false });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-blue-100">
        {/* Header */}
        <div
          className="p-5 text-white text-center relative"
          style={{ backgroundColor: project.icon_color || '#1e3a8a' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs mx-auto flex items-center justify-center text-2xl text-white mb-2 shadow-inner">
            <i className={project.icon}></i>
          </div>

          <h3 className="text-base sm:text-lg font-bold">{project.title_bn}</h3>
          <p className="text-xs text-white/80">{project.title}</p>
        </div>

        {/* Dynamic Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            {project.description}
          </p>

          {msg && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold text-center ${
                msg.success
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {msg.text}
            </div>
          )}

          {/* 1. Mobile Recharge Component */}
          {project.modal_id === 'recharge' && (
            <form onSubmit={handleRechargeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  অপারেটর নির্বাচন করুন
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Grameenphone', 'Robi', 'Banglalink', 'Airtel', 'Teletalk'].map((op) => (
                    <button
                      type="button"
                      key={op}
                      onClick={() => setOperator(op)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                        operator === op
                          ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোবাইল নাম্বার
                </label>
                <input
                  type="tel"
                  value={rechargeNumber}
                  onChange={(e) => setRechargeNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  রিচার্জের পরিমাণ (টাকা)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['20', '50', '100', '200'].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setRechargeAmount(amt)}
                      className={`py-1.5 rounded-lg text-xs font-extrabold border ${
                        rechargeAmount === amt
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>ওয়ালেট ব্যালেন্স:</span>
                <span className="font-bold text-blue-900">
                  ৳{(wallet?.available_balance || 0).toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {actionLoading ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  `৳${rechargeAmount} রিচার্জ করুন`
                )}
              </button>
            </form>
          )}

          {/* 2. Drive Offers */}
          {project.modal_id === 'drive_offers' && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                আজকের সেরা ড্রাইভ প্যাক সমূহ:
              </span>
              {[
                { op: 'GP', name: '40 GB + 800 Min (30 Days)', price: '৳৭৯৯', regular: '৳৯৯৮', cash: '৳২০০ ক্যাশব্যাক' },
                { op: 'Robi', name: '50 GB Internet (30 Days)', price: '৳৪৫০', regular: '৳৫৯৮', cash: '৳১৪৮ ক্যাশব্যাক' },
                { op: 'Banglalink', name: '30 GB + 500 Min (30 Days)', price: '৳৪৯৯', regular: '৳৬৫০', cash: '৳১৫১ ক্যাশব্যাক' },
              ].map((pack, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded mr-1">
                      {pack.op}
                    </span>
                    <span className="font-bold text-slate-800">{pack.name}</span>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      {pack.cash}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-blue-900 block">{pack.price}</span>
                    <span className="text-[10px] text-slate-400 line-through block">{pack.regular}</span>
                    <button
                      onClick={() =>
                        setMsg({
                          text: 'অর্ডার সফলভাবে গ্রহন করা হয়েছে। ৫ মিনিটের মধ্যে এক্টিভ হবে।',
                          success: true,
                        })
                      }
                      className="mt-1 px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg shadow-2xs"
                    >
                      কিনুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. Quiz Jobs */}
          {project.modal_id === 'quiz_jobs' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                প্রশ্ন: বাংলাদেশের রাজধানীর নাম কী? (সঠিক উত্তরে ৳৫ রিওয়ার্ড)
              </span>
              <div className="space-y-2">
                {['চট্টগ্রাম', 'ঢাকা', 'সিলেট', 'রাজশাহী'].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuizAnswer(idx)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      quizAnswer === idx
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-100'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {idx + 1}. {opt}
                  </button>
                ))}
              </div>

              {!quizFinished ? (
                <button
                  onClick={handleQuizSubmit}
                  className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  উত্তর জমা দিন
                </button>
              ) : (
                <div className="p-3 bg-green-50 text-green-700 text-xs font-bold rounded-xl text-center">
                  🎉 অভিনন্দন! কুইজের ৫৳ আপনার ওয়ালেটে জমা হয়েছে।
                </div>
              )}
            </div>
          )}

          {/* 4. Typing Jobs */}
          {project.modal_id === 'typing_jobs' && (
            <form onSubmit={handleTypingSubmit} className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-bold select-none text-center">
                "{sampleTypingText}"
              </div>
              <textarea
                rows={2}
                value={typingInput}
                onChange={(e) => setTypingInput(e.target.value)}
                placeholder="উপরের টেক্সটটি হুবহু এখানে লিখুন..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-600"
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                টাইপিং জমা দিন (৳৩)
              </button>
            </form>
          )}

          {/* 5. Leaderboard */}
          {project.modal_id === 'leaderboard' && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                আজকের শীর্ষ উপার্জনকারী সদস্যগণ:
              </span>
              {[
                { rank: 1, name: 'মোহাম্মদ রাশেদ', earned: '৳৩,৪৫০', badge: '🥇 ১ম স্থান' },
                { rank: 2, name: 'তানভীর আহমেদ', earned: '৳২,৮২০', badge: '🥈 ২য় স্থান' },
                { rank: 3, name: 'সুমন হোসাইন', earned: '৳২,৪০০', badge: '🥉 ৩য় স্থান' },
                { rank: 4, name: 'নাঈম হাসান', earned: '৳১,৯৫০', badge: '৪র্থ স্থান' },
                { rank: 5, name: 'মেহেদী হাসান', earned: '৳১,৭০০', badge: '৫ম স্থান' },
              ].map((leader) => (
                <div
                  key={leader.rank}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px] font-bold">
                      {leader.rank}
                    </span>
                    <span className="font-bold text-slate-800">{leader.name}</span>
                  </div>
                  <span className="text-emerald-600 font-extrabold">{leader.earned}</span>
                </div>
              ))}
            </div>
          )}

          {/* Default Service Support CTA */}
          {['online_shop', 'job_posting', 'target_bonus', 'welcome_bonus', 'weekly_rewards', 'monthly_rewards', 'leadership', 'digital_services', 'courses', 'photo_services', 'video_services'].includes(project.modal_id || '') && (
            <div className="space-y-3 text-center">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-1">
                  সার্ভিস ও অফার অ্যাক্টিভেশন
                </span>
                <p className="text-[11px] text-slate-500">
                  এই সার্ভিসে যুক্ত হতে বা বিস্তারিত নির্দেশিকার জন্য আমাদের টেলিগ্রাম চ্যানেলে অথবা হেল্পলাইনে যোগাযোগ করুন।
                </p>
              </div>
              <a
                href="https://t.me/easyearningbd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#229ED9] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
              >
                <i className="fa-brands fa-telegram"></i>
                <span>টেলিগ্রাম সাপোর্টে তথ্য নিন</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
