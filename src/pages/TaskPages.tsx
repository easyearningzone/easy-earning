import React, { useState } from 'react';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { AuthGuard } from '../components/layout/AuthGuard';
import { store } from '../lib/store';
import { Task } from '../types/database';

export const MicroJobsPage: React.FC = () => {
  const user = store.getCurrentUser();
  const tasks = store.getTasks().filter((t) => t.status === 'active');
  const [selectedCat, setSelectedCat] = useState('all');

  const categories = ['all', 'টেলিগ্রাম', 'ইউটিউব', 'ফেসবুক', 'টিকটক', 'ওয়েবসাইট'];

  const filtered = selectedCat === 'all'
    ? tasks
    : tasks.filter((t) => t.category.toLowerCase().includes(selectedCat.toLowerCase()));

  const isVerified = user?.is_verified === 'verified';

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'মাইক্রো জবস (Micro Jobs)' }]} />

      {/* Lock alert banner if unverified */}
      {!isVerified && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-indigo-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0">
              <i className="fa-solid fa-lock"></i>
            </div>
            <div>
              <h3 className="font-bold text-sm">টাস্ক লকড: একাউন্ট ভেরিফিকেশন প্রয়োজন</h3>
              <p className="text-xs text-rose-100">কাজ শুরু করতে মাত্র ১০০ টাকা ফি দিয়ে একাউন্ট ভেরিফাই ও অ্যাক্টিভ করুন।</p>
            </div>
          </div>
          <a
            href="/verification.html"
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-transform active:scale-95 shrink-0 text-center"
          >
            ১০০ টাকা দিয়ে ভেরিফাই করুন 👉
          </a>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">চলমান মাইক্রো জবস ({filtered.length})</h2>
          <p className="text-xs text-slate-500">সহজ কাজ করে সরাসরি বিকাশ ও নগদে ইনকাম নিন</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCat === c
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {c === 'all' ? 'সবগুলো' : c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative"
          >
            {!isVerified && (
              <span className="absolute top-2 right-2 text-[9px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <i className="fa-solid fa-lock text-[8px]"></i> লকড
              </span>
            )}
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl shrink-0">
                <i className={task.icon || 'fa-solid fa-list-check'}></i>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-100">
                    {task.category}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600">
                    ৳{task.reward_amount.toFixed(2)}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {task.description}
                </p>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                  <span>
                    <i className="fa-solid fa-users text-[9px] mr-1"></i>
                    {task.current_participants}/{task.max_participants} সম্পন্ন
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`/job-details.html?id=${task.id}`}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
              >
                বিস্তারিত
              </a>
              {isVerified ? (
                <a
                  href={`/submit-task.html?id=${task.id}`}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  কাজ শুরু করুন
                </a>
              ) : (
                <a
                  href="/verification.html"
                  className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-indigo-900 hover:opacity-90 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-lock text-[10px]"></i>
                  <span>ভেরিফাই করুন (৳১০০)</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const JobDetailsPage: React.FC = () => {
  const user = store.getCurrentUser();
  const params = new URLSearchParams(window.location.search);
  const taskId = params.get('id') || 't1';
  const task = store.getTasks().find((t) => t.id === taskId) || store.getTasks()[0];
  const isVerified = user?.is_verified === 'verified';

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: 'মাইক্রো জবস', href: '/micro-jobs.html' },
          { label: task ? task.title : 'কাজের বিবরণ' },
        ]}
      />

      {!isVerified && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <i className="fa-solid fa-lock text-amber-600 text-base mt-0.5"></i>
          <div>
            <span className="font-bold block">একাউন্ট ভেরিফিকেশন আবশ্যক!</span>
            <span>এই কাজের প্রুফ জমা দিতে এবং রিওয়ার্ড পেতে ১০০ টাকা ফি দিয়ে একাউন্ট ভেরিফাই করতে হবে।</span>
          </div>
        </div>
      )}

      {task && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full">
                {task.category}
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                {task.title}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-emerald-600 block">
                ৳{task.reward_amount.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400">নিশ্চিত রিওয়ার্ড</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {task.description}
          </p>

          <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100 space-y-2 text-xs">
            <h4 className="font-bold text-blue-950 flex items-center gap-1.5">
              <i className="fa-solid fa-circle-info text-blue-600"></i>
              <span>কাজ করার সঠিক নিয়মাবলি:</span>
            </h4>
            <div className="space-y-1.5 pl-1">
              {task.instructions.map((inst, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{inst}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
            <strong>প্রয়োজনীয় প্রুফ:</strong> {task.required_proof}
          </div>

          <div className="flex gap-3 pt-2">
            {task.task_link && (
              <a
                href={task.task_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>কাজের লিংক ওপেন করুন</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            )}
            {isVerified ? (
              <a
                href={`/submit-task.html?id=${task.id}`}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>প্রুফ সাবমিট করুন</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            ) : (
              <a
                href="/verification.html"
                className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-indigo-900 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <i className="fa-solid fa-lock text-xs"></i>
                <span>১০০ টাকা দিয়ে ভেরিফাই করুন 👉</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const SubmitTaskPage: React.FC = () => {
  const user = store.getCurrentUser();
  const params = new URLSearchParams(window.location.search);
  const taskId = params.get('id') || 't1';
  const task = store.getTasks().find((t) => t.id === taskId) || store.getTasks()[0];

  const [proofText, setProofText] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProofImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login.html';
      return;
    }
    if (!task) return;

    setIsSubmitting(true);
    setFeedback(null);

    setTimeout(() => {
      const res = store.submitTask(user.id, task.id, proofText, proofImage);
      setIsSubmitting(false);
      setFeedback({ text: res.message, success: res.success });
      if (res.success) {
        setTimeout(() => {
          window.location.href = '/my-tasks.html';
        }, 1200);
      }
    }, 500);
  };

  if (user?.is_verified !== 'verified') {
    return (
      <AuthGuard>
        <div className="space-y-4 max-w-lg mx-auto">
          <Breadcrumb
            items={[
              { label: 'মাইক্রো জবস', href: '/micro-jobs.html' },
              { label: 'টাস্ক সাবমিশন' },
            ]}
          />
          <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-inner">
              <i className="fa-solid fa-lock"></i>
            </div>
            <div>
              <span className="text-[10px] font-extrabold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full uppercase">
                টাস্ক লকড
              </span>
              <h2 className="text-base font-black text-slate-900 mt-2">
                কাজ জমা দিতে একাউন্ট ভেরিফাই করুন
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                নতুন একাউন্ট খোলার পর ১০০ টাকা ফি দিয়ে একাউন্ট ভেরিফাই ও অ্যাক্টিভ করতে হবে। ভেরিফিকেশন সম্পন্ন না হওয়া পর্যন্ত কোনো টাস্ক ওপেন হবে না।
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
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="space-y-4">
        <Breadcrumb
          items={[
            { label: 'মাইক্রো জবস', href: '/micro-jobs.html' },
            { label: 'টাস্ক সাবমিশন (Submit Task)' },
          ]}
        />

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
              টাস্ক সাবমিট
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              {task?.title}
            </h2>
            <span className="text-xs font-bold text-emerald-600 block mt-0.5">
              পুরস্কার: ৳{task?.reward_amount.toFixed(2)}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                প্রয়োজনীয় প্রুফ তথ্য: {task?.required_proof}
              </label>
              <textarea
                rows={4}
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                placeholder="আপনার কাজের বিবরণ, আইডি, লিঙ্ক বা প্রয়োজনীয় তথ্য লিখুন..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                স্ক্রিনশট আপলোড করুন (বাধ্যতামূলক প্রমাণ)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {proofImage && (
                <div className="mt-2 w-32 h-24 rounded-lg overflow-hidden border border-slate-300">
                  <img src={proofImage} alt="" className="w-full h-full object-cover" />
                </div>
              )}
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
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : 'প্রুফ জমা দিন (টাকা ক্লেইম)'}
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};

export const MyTasksPage: React.FC = () => {
  const user = store.getCurrentUser();
  const submissions = user ? store.getSubmissions(user.id) : [];

  return (
    <AuthGuard>
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'আমার জমাকৃত কাজ (My Tasks)' }]} />

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">আমার সাবমিশন হিস্ট্রি ({submissions.length})</h2>
            <a href="/micro-jobs.html" className="text-xs font-bold text-blue-600 hover:underline">
              + নতুন কাজ খুঁজুন
            </a>
          </div>

          <div className="space-y-3">
            {submissions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                এখনো কোনো কাজের প্রুফ জমা দেননি।
              </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{sub.task_title}</h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(sub.submitted_at).toLocaleString('bn-BD')}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        sub.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : sub.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {sub.status === 'approved'
                        ? 'অনুমোদিত (+৳' + sub.reward_amount + ')'
                        : sub.status === 'rejected'
                        ? 'প্রত্যাখ্যাত'
                        : 'পর্যালোচনায় আছে'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="font-semibold text-[10px] text-slate-400 block">জমা দেওয়া প্রুফ:</span>
                    {sub.proof_text}
                  </p>

                  {sub.admin_feedback && (
                    <div className="text-[11px] text-blue-900 bg-blue-50 p-2 rounded-xl">
                      <strong>এডমিন মন্তব্য:</strong> {sub.admin_feedback}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};
