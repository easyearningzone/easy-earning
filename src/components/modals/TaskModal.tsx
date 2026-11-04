import React, { useState } from 'react';
import { Task, TaskSubmission, UserProfile } from '../../types/database';
import { store } from '../../lib/store';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  selectedTaskId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
  selectedTaskId,
}) => {
  const [activeTab, setActiveTab] = useState<'available' | 'submissions'>('available');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [proofText, setProofText] = useState('');
  const [proofImage, setProofImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const tasks = store.getTasks().filter((t) => t.status === 'active');
  const mySubmissions = user ? store.getSubmissions(user.id) : [];

  // If a specific task is opened initially
  React.useEffect(() => {
    if (selectedTaskId) {
      const found = tasks.find((t) => t.id === selectedTaskId);
      if (found) setActiveTask(found);
    }
  }, [selectedTaskId, tasks]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProofImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!activeTask) return;
    if (!proofText.trim()) {
      setFeedback({ text: 'দয়া করে প্রুফ বা কাজের বিবরণ লিখুন।', success: false });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    setTimeout(() => {
      const res = store.submitTask(user.id, activeTask.id, proofText, proofImage);
      setIsSubmitting(false);
      setFeedback({ text: res.message, success: res.success });
      if (res.success) {
        setProofText('');
        setProofImage('');
        setTimeout(() => {
          setActiveTask(null);
          setActiveTab('submissions');
        }, 1200);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-blue-100">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white p-4 sm:p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <i className="fa-solid fa-list-check text-amber-400"></i>
            মাইক্রো জব ও টাস্ক সেন্টার
          </h3>
          <p className="text-xs text-blue-200">ছোট ছোট কাজ করে নিশ্চিত টাকা আয় করুন</p>

          {/* Sub Navigation */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                setActiveTab('available');
                setActiveTask(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'available'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              চলমান কাজ সমূহ ({tasks.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('submissions');
                setActiveTask(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'submissions'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              আমার সাবমিশন ({mySubmissions.length})
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {/* Detailed Task Execution View */}
          {activeTask ? (
            <div className="space-y-4">
              <button
                onClick={() => setActiveTask(null)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span>সকল কাজের তালিকায় ফিরুন</span>
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    {activeTask.category}
                  </span>
                  <span className="text-base font-extrabold text-emerald-600">
                    ৳{activeTask.reward_amount.toFixed(2)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {activeTask.title}
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  {activeTask.description}
                </p>

                {/* Instructions */}
                <div className="bg-white rounded-xl p-3 border border-blue-100 mb-3 text-xs text-slate-700 space-y-1.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                    <i className="fa-solid fa-circle-info text-blue-600"></i>
                    <span>কাজ করার নিয়মাবলি:</span>
                  </div>
                  {activeTask.instructions.map((inst, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-600">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-[10px] flex items-center justify-center shrink-0 font-bold">
                        {i + 1}
                      </span>
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>

                {/* Task Action Link */}
                {activeTask.task_link && (
                  <a
                    href={activeTask.task_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <span>টাস্ক লিংক ওপেন করুন</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                  </a>
                )}
              </div>

              {/* Submission Form */}
              <form onSubmit={handleTaskSubmit} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <i className="fa-solid fa-file-arrow-up text-blue-600"></i>
                  <span>কাজের প্রুফ জমা দিন:</span>
                </h5>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {activeTask.required_proof}
                  </label>
                  <textarea
                    rows={3}
                    placeholder="আপনার কাজের বিবরণ, ইউজারনেম বা তথ্য এখানে লিখুন..."
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    কাজের স্ক্রিনশট আপলোড করুন (ঐচ্ছিক কিন্তু বাঞ্ছনীয়)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {proofImage && (
                    <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-slate-300">
                      <img src={proofImage} alt="Proof" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProofImage('')}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>

                {feedback && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-semibold text-center ${
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
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i>
                      <span>প্রুফ জমা দিন (টাকা আয় করুন)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : activeTab === 'available' ? (
            /* Available Tasks List */
            tasks.map((task) => {
              const alreadyDone = mySubmissions.some((s) => s.task_id === task.id);
              return (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg shrink-0">
                      <i className={task.icon || 'fa-solid fa-list-check'}></i>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                          {task.category}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-600">
                          ৳{task.reward_amount.toFixed(2)}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                        <span>
                          <i className="fa-solid fa-users text-[9px] mr-1"></i>
                          {task.current_participants}/{task.max_participants} জন সম্পন্ন করেছে
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTask(task)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      alreadyDone
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {alreadyDone ? 'পুনরায় দেখুন' : 'কাজ শুরু করুন'}
                  </button>
                </div>
              );
            })
          ) : (
            /* User Submissions History */
            mySubmissions.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <i className="fa-solid fa-clipboard-question text-4xl mb-2"></i>
                <p className="text-xs">এখনো কোনো কাজের প্রুফ জমা দেননি।</p>
              </div>
            ) : (
              mySubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {sub.task_title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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

                  <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="font-semibold block text-[10px] text-slate-400">জমা দেওয়া প্রুফ:</span>
                    {sub.proof_text}
                  </p>

                  {sub.admin_feedback && (
                    <p className="text-[11px] text-blue-700 bg-blue-50 p-2 rounded-lg">
                      <span className="font-bold">এডমিন মন্তব্য:</span> {sub.admin_feedback}
                    </p>
                  )}

                  <div className="text-[10px] text-slate-400">
                    জমা দেওয়ার সময়: {new Date(sub.submitted_at).toLocaleString('bn-BD')}
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};
