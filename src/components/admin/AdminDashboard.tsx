import React, { useState, useEffect } from 'react';
import { store } from '../../lib/store';
import {
  UserProfile,
  Task,
  TaskSubmission,
  WithdrawalRequest,
  WalletTransaction,
  Banner,
  Notice,
  SiteSettings
} from '../../types/database';
import {
  testSupabaseConnection,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY
} from '../../lib/supabaseClient';

interface AdminDashboardProps {
  onBackToApp: () => void;
  currentUser: UserProfile | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToApp,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'verification' | 'tasks' | 'submissions' | 'gmail' | 'withdrawals' | 'transactions' | 'banners' | 'settings' | 'sql'
  >('overview');

  // Trigger re-render on store update
  const [, setTick] = useState(0);
  useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, []);

  const users = store.getAllUsers();
  const tasks = store.getTasks();
  const submissions = store.getSubmissions();
  const gmailSubmissions = store.getGmailSubmissions();
  const withdrawals = store.getWithdrawals();
  const transactions = store.getTransactions();
  const banners = store.getBanners();
  const notice = store.getNotice();
  const settings = store.getSettings();
  const auditLogs = store.getAuditLogs();

  // Stats calculation
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.is_suspended).length;
  const verifiedUsers = users.filter((u) => u.is_verified === 'verified').length;
  const pendingVerifications = users.filter((u) => u.is_verified === 'pending').length;
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending').length;
  const pendingGmails = gmailSubmissions.filter((g) => g.status === 'pending').length;
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending').length;
  const totalPayouts = withdrawals
    .filter((w) => w.status === 'approved')
    .reduce((sum, w) => sum + w.amount, 0);

  // States for sub-forms
  const [searchTerm, setSearchTerm] = useState('');
  const [trxInput, setTrxInput] = useState<{ [id: string]: string }>({});
  const [rejectReason, setRejectReason] = useState<{ [id: string]: string }>({});
  const [feedbackMsg, setFeedbackMsg] = useState<{ [id: string]: string }>({});
  const [gmailRejectReason, setGmailRejectReason] = useState<{ [id: string]: string }>({});

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCat, setNewTaskCat] = useState('সোশ্যাল');
  const [newTaskReward, setNewTaskReward] = useState('10');
  const [newTaskLink, setNewTaskLink] = useState('');
  const [newTaskProof, setNewTaskProof] = useState('কাজের স্ক্রিনশট ও আইডি দিন');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // Manual balance adjust state
  const [adjustUserId, setAdjustUserId] = useState('');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  // Settings form state
  const [siteForm, setSiteForm] = useState<SiteSettings>({ ...settings });

  // Supabase test form
  const [sbUrl, setSbUrl] = useState(localStorage.getItem('supabase_custom_url') || DEFAULT_SUPABASE_URL);
  const [sbKey, setSbKey] = useState(localStorage.getItem('supabase_custom_key') || DEFAULT_SUPABASE_ANON_KEY);
  const [sbTestResult, setSbTestResult] = useState<string | null>(null);

  // Verification review
  const handleApproveKYC = (userId: string) => {
    if (!currentUser) return;
    store.processVerification(currentUser.id, userId, true, 'এডমিন কর্তৃক যাচাই ও অনুমোদন সম্পন্ন।');
  };

  const handleRejectKYC = (userId: string) => {
    if (!currentUser) return;
    const reason = rejectReason[userId] || 'অস্পষ্ট ছবি বা অসত্য তথ্যের কারণে বাতিল।';
    store.processVerification(currentUser.id, userId, false, reason);
  };

  // Withdrawal processing
  const handleApproveWithdrawal = (reqId: string) => {
    if (!currentUser) return;
    const trx = trxInput[reqId] || 'TX' + Math.random().toString(36).substring(2, 9).toUpperCase();
    store.approveWithdrawal(currentUser.id, reqId, trx);
  };

  const handleRejectWithdrawal = (reqId: string) => {
    if (!currentUser) return;
    const reason = rejectReason[reqId] || 'নাম্বার ভুল বা তথ্যে গড়মিল থাকায় বাতিল। ব্যালেন্স ফেরত দেওয়া হয়েছে।';
    store.rejectWithdrawal(currentUser.id, reqId, reason);
  };

  // Submission processing
  const handleApproveSub = (subId: string) => {
    if (!currentUser) return;
    store.approveSubmission(currentUser.id, subId, 'সঠিক কাজ হয়েছে। রিওয়ার্ড প্রদান সম্পন্ন।');
  };

  const handleRejectSub = (subId: string) => {
    if (!currentUser) return;
    const fb = feedbackMsg[subId] || 'স্ক্রিনশট স্পষ্ট নয় বা নিয়ম মানা হয়নি।';
    store.rejectSubmission(currentUser.id, subId, fb);
  };

  // Gmail Marketing processing
  const handleApproveGmail = (gmId: string) => {
    if (!currentUser) return;
    store.approveGmailSubmission(currentUser.id, gmId);
  };

  const handleRejectGmail = (gmId: string) => {
    if (!currentUser) return;
    const reason = gmailRejectReason[gmId] || 'ভুল পাসওয়ার্ড বা ২-স্টেপ ভেরিফিকেশন চালু থাকায় বাতিল।';
    store.rejectGmailSubmission(currentUser.id, gmId, reason);
  };

  // Create Task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: 'task-' + Date.now(),
      title: newTaskTitle,
      category: newTaskCat,
      reward_amount: parseFloat(newTaskReward) || 10,
      task_link: newTaskLink,
      required_proof: newTaskProof,
      description: newTaskDesc || newTaskTitle,
      instructions: [
        'লিংকে ক্লিক করে কাজ সম্পন্ন করুন।',
        'কাজের স্পষ্ট প্রমাণ হিসেবে স্ক্রিনশট নিন।',
        'স্ক্রিনশট আপলোড করে সাবমিট করুন।'
      ],
      max_participants: 500,
      current_participants: 0,
      status: 'active',
      created_at: new Date().toISOString()
    };
    store.saveTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskLink('');
    alert('নতুন টাস্ক সফলভাবে পাবলিশ হয়েছে!');
  };

  // Handle Manual Balance Adjust
  const handleBalanceAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !adjustUserId || !adjustAmount) return;
    const amt = parseFloat(adjustAmount);
    store.adjustUserBalance(currentUser.id, adjustUserId, amt, adjustReason || 'ম্যানুয়াল এডমিন সমন্বয়');
    setAdjustAmount('');
    setAdjustReason('');
    alert('ব্যালেন্স সমন্বয় সফল হয়েছে!');
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.saveSettings(siteForm);
    alert('ওয়েবসাইট সেটিংস সফলভাবে সেভ হয়েছে!');
  };

  // Test Supabase Connection
  const handleTestSupabase = async () => {
    setSbTestResult('সংযোগ পরীক্ষা করা হচ্ছে...');
    localStorage.setItem('supabase_custom_url', sbUrl);
    localStorage.setItem('supabase_custom_key', sbKey);
    const res = await testSupabaseConnection(sbUrl, sbKey);
    setSbTestResult(res.message);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      {/* Admin Top Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToApp}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>ইউজার সাইটে ফিরুন</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-xs">
                <i className="fa-solid fa-shield-halved"></i>
              </span>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold tracking-wide text-white">
                  EASY EARNING BD &bull; এডমিন প্যানেল
                </h1>
                <p className="text-[10px] text-amber-400 font-medium">
                  লগইন আছেন: {currentUser?.full_name || 'Admin'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              <i className="fa-solid fa-signal mr-1 text-[10px]"></i> সিস্টেম রানিং
            </span>
          </div>
        </div>
      </header>

      {/* Admin Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white rounded-2xl p-3 shadow-sm border border-slate-200 shrink-0 h-fit space-y-1">
          {[
            { id: 'overview', label: 'ওভারভিউ ড্যাশবোর্ড', icon: 'fa-solid fa-gauge' },
            { id: 'withdrawals', label: `উইথড্র রিকোয়েস্ট (${pendingWithdrawals})`, icon: 'fa-solid fa-money-bill-transfer', badge: pendingWithdrawals > 0 ? pendingWithdrawals : undefined },
            { id: 'submissions', label: `টাস্ক সাবমিশন (${pendingSubmissions})`, icon: 'fa-solid fa-list-check', badge: pendingSubmissions > 0 ? pendingSubmissions : undefined },
            { id: 'gmail', label: `জিমেইল সেল (${pendingGmails})`, icon: 'fa-solid fa-envelope', badge: pendingGmails > 0 ? pendingGmails : undefined },
            { id: 'verification', label: `ইউজার ভেরিফিকেশন (${pendingVerifications})`, icon: 'fa-solid fa-id-card', badge: pendingVerifications > 0 ? pendingVerifications : undefined },
            { id: 'users', label: 'ইউজার ম্যানেজমেন্ট', icon: 'fa-solid fa-users' },
            { id: 'tasks', label: 'টাস্ক তৈরি ও পরিচালনা', icon: 'fa-solid fa-briefcase' },
            { id: 'transactions', label: 'ওয়ালেট ও ব্যালেন্স এডজাস্ট', icon: 'fa-solid fa-wallet' },
            { id: 'banners', label: 'ব্যানার ও নোটিশ', icon: 'fa-solid fa-images' },
            { id: 'settings', label: 'ওয়েবসাইট সেটিংস', icon: 'fa-solid fa-sliders' },
            { id: 'sql', label: 'Supabase SQL সেটাপ', icon: 'fa-solid fa-database' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <i className={`${tab.icon} w-4 text-center`}></i>
                <span>{tab.label}</span>
              </div>
              {tab.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Main Panel View */}
        <main className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 overflow-x-auto">
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">এডমিন ড্যাশবোর্ড ওভারভিউ</h2>
                <p className="text-xs text-slate-500">প্ল্যাটফর্মের সামগ্রিক পরিসংখ্যান ও লেনদেনের সারসংক্ষেপ</p>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <span className="text-xs font-medium text-blue-700 block">মোট ইউজার</span>
                  <span className="text-2xl font-extrabold text-blue-950 mt-1 block">{totalUsers}</span>
                  <span className="text-[10px] text-blue-600">সক্রিয়: {activeUsers}</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs font-medium text-amber-700 block">পেন্ডিং উইথড্র</span>
                  <span className="text-2xl font-extrabold text-amber-950 mt-1 block">{pendingWithdrawals}</span>
                  <span className="text-[10px] text-amber-600">যাচাই ও প্রসেস বাকি</span>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <span className="text-xs font-medium text-indigo-700 block">পেন্ডিং টাস্ক প্রুফ</span>
                  <span className="text-2xl font-extrabold text-indigo-950 mt-1 block">{pendingSubmissions}</span>
                  <span className="text-[10px] text-indigo-600">অনুমোদনের অপেক্ষায়</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-medium text-emerald-700 block">মোট পরিশোধিত টাকা</span>
                  <span className="text-2xl font-extrabold text-emerald-950 mt-1 block">৳{totalPayouts.toFixed(2)}</span>
                  <span className="text-[10px] text-emerald-600">সফল বিকাশ/নগদ পেআউট</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 mb-2">প্রয়োজনীয় দ্রুত পদক্ষেপ:</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTab('withdrawals')}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs"
                  >
                    উইথড্র রিকোয়েস্ট যাচাই ({pendingWithdrawals})
                  </button>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                  >
                    টাস্ক স্ক্রিনশট রিভিউ ({pendingSubmissions})
                  </button>
                  <button
                    onClick={() => setActiveTab('verification')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    আইডি ভেরিফিকেশন এপ্রুভাল ({pendingVerifications})
                  </button>
                </div>
              </div>

              {/* Audit Logs */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 mb-2">সাম্প্রতিক এডমিন অডিট হিস্ট্রি:</h3>
                <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200 max-h-56 overflow-y-auto">
                  {auditLogs.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-400">কোনো অডিট লগ রেকর্ড নেই।</div>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="p-2.5 text-xs flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800">{log.action}: </span>
                          <span className="text-slate-600">{log.details}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                          {new Date(log.created_at).toLocaleTimeString('bn-BD')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. WITHDRAWALS */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-900">উইথড্রয়াল রিকোয়েস্ট ম্যানেজমেন্ট</h2>
                  <p className="text-xs text-slate-500">বিকাশ, নগদ ও রকেটে টাকা পাঠানো নিশ্চিত করে এপ্রুভ করুন</p>
                </div>
              </div>

              <div className="space-y-3">
                {withdrawals.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">কোনো উইথড্রয়াল রিকোয়েস্ট নেই।</div>
                ) : (
                  withdrawals.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white uppercase ${
                              req.method === 'bkash'
                                ? 'bg-pink-600'
                                : req.method === 'nagad'
                                ? 'bg-orange-600'
                                : 'bg-purple-600'
                            }`}
                          >
                            {req.method} ({req.account_type || 'personal'})
                          </span>
                          <span className="text-sm font-extrabold text-slate-900 font-mono">
                            {req.account_number}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-extrabold text-blue-900">
                            ৳{req.amount.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            পেআউট: ৳{req.final_amount.toFixed(2)} (ফি: ৳{req.fee})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="text-slate-600">
                          <span>ইউজার: <strong>{req.user_name}</strong> &bull; সময়: {new Date(req.created_at).toLocaleString('bn-BD')}</span>
                          {req.admin_transaction_id && (
                            <span className="block font-bold text-emerald-700 mt-0.5">
                              TrxID: {req.admin_transaction_id}
                            </span>
                          )}
                          {req.rejection_reason && (
                            <span className="block font-bold text-red-600 mt-0.5">
                              বাতিলের কারণ: {req.rejection_reason}
                            </span>
                          )}
                        </div>

                        {req.status === 'pending' ? (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                              type="text"
                              placeholder="TrxID (ঐচ্ছিক)"
                              value={trxInput[req.id] || ''}
                              onChange={(e) =>
                                setTrxInput({ ...trxInput, [req.id]: e.target.value })
                              }
                              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white uppercase"
                            />
                            <button
                              onClick={() => handleApproveWithdrawal(req.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs"
                            >
                              পেমেন্ট সম্পন্ন (Approve)
                            </button>
                            <button
                              onClick={() => handleRejectWithdrawal(req.id)}
                              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-xs"
                            >
                              বাতিল ও রিফান্ড
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase self-start sm:self-auto ${
                              req.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {req.status === 'approved' ? 'পরিশোধিত' : 'প্রত্যাখ্যাত'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 3. TASK SUBMISSIONS */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">টাস্ক সাবমিশন ও স্ক্রিনশট যাচাই</h2>
                <p className="text-xs text-slate-500">ইউজারদের জমা দেওয়া প্রমাণ দেখে রিওয়ার্ড যোগ করুন</p>
              </div>

              <div className="space-y-3">
                {submissions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">কোনো সাবমিশন জমা নেই।</div>
                ) : (
                  submissions.map((sub) => (
                    <div key={sub.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-extrabold text-blue-900 block">{sub.task_title}</span>
                          <span className="text-[11px] text-slate-500">
                            ইউজার: {sub.user_name} ({sub.user_email}) &bull; সময়: {new Date(sub.submitted_at).toLocaleString('bn-BD')}
                          </span>
                        </div>
                        <span className="text-sm font-extrabold text-emerald-600">
                          ৳{sub.reward_amount.toFixed(2)}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                        <span className="font-bold block text-[10px] text-slate-400">প্রদত্ত প্রুফ বিবরণ:</span>
                        {sub.proof_text}
                        {sub.proof_image_url && (
                          <div className="mt-2">
                            <span className="font-bold block text-[10px] text-slate-400 mb-1">স্ক্রিনশট:</span>
                            <img
                              src={sub.proof_image_url}
                              alt="Proof"
                              className="max-h-48 rounded-lg border border-slate-300"
                            />
                          </div>
                        )}
                      </div>

                      {sub.status === 'pending' ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleApproveSub(sub.id)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                          >
                            এপ্রুভ করুন (টাকা যোগ হবে)
                          </button>
                          <button
                            onClick={() => handleRejectSub(sub.id)}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs"
                          >
                            রিজেক্ট করুন
                          </button>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-500">
                            স্ট্যাটাস: {sub.status.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* GMAIL MARKETING / SELL SUBMISSIONS */}
          {activeTab === 'gmail' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    জিমেইল মার্কেটিং ও সেলস সাবমিশন ({gmailSubmissions.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    ইউজারদের জমা দেওয়া জিমেইল যাচাই করে ওয়ালেটে পেমেন্ট অনুমোদন বা বাতিল করুন
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    পেন্ডিং: {pendingGmails}টি
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                    রেট: ৳{(siteForm.gmail_sell_price || 14).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {gmailSubmissions.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                    এখনো কোনো ইউজার জিমেইল জমা দেয়নি।
                  </div>
                ) : (
                  gmailSubmissions.map((gm) => (
                    <div
                      key={gm.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-envelope text-red-500"></i>
                            <span className="text-sm font-bold text-slate-900">{gm.gmail_address}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            জমা দিয়েছেন: {gm.user_name || 'ইউজার'} ({gm.user_email || 'N/A'}) &bull;{' '}
                            {new Date(gm.submitted_at).toLocaleString('bn-BD')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-emerald-600">
                            ৳{gm.price_rate.toFixed(2)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              gm.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : gm.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {gm.status === 'approved'
                              ? 'অনুমোদিত'
                              : gm.status === 'rejected'
                              ? 'বাতিল'
                              : 'পেন্ডিং'}
                          </span>
                        </div>
                      </div>

                      {/* Gmail Credential Box */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">
                            সাবমিট করা ক্রেডেনশিয়াল:
                          </span>
                          <div className="font-mono text-slate-800 flex items-center gap-2">
                            <span>পাসওয়ার্ড: <strong>{gm.gmail_password}</strong></span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(gm.gmail_password);
                                alert('পাসওয়ার্ড কপি করা হয়েছে!');
                              }}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                              title="পাসওয়ার্ড কপি করুন"
                            >
                              <i className="fa-regular fa-copy"></i>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(gm.gmail_address);
                              alert('জিমেইল কপি করা হয়েছে!');
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                          >
                            <i className="fa-regular fa-copy mr-1"></i> জিমেইল কপি
                          </button>
                        </div>
                      </div>

                      {/* Action buttons */}
                      {gm.status === 'pending' ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                          <input
                            type="text"
                            placeholder="বাতিলের কারণ (যদি বাতিল করতে চান)..."
                            value={gmailRejectReason[gm.id] || ''}
                            onChange={(e) =>
                              setGmailRejectReason({
                                ...gmailRejectReason,
                                [gm.id]: e.target.value,
                              })
                            }
                            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white flex-1"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveGmail(gm.id)}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs"
                            >
                              অনুমোদন করুন (৳{gm.price_rate.toFixed(2)} যোগ হবে)
                            </button>
                            <button
                              onClick={() => handleRejectGmail(gm.id)}
                              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-xs"
                            >
                              বাতিল
                            </button>
                          </div>
                        </div>
                      ) : gm.rejection_reason ? (
                        <div className="p-2 bg-rose-50 text-rose-700 rounded-lg text-[11px] border border-rose-200">
                          <strong>বাতিলের কারণ: </strong>
                          {gm.rejection_reason}
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 4. USER VERIFICATION (KYC) */}
          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">ইউজার ভেরিফিকেশন (KYC) অনুমোদন</h2>
                <p className="text-xs text-slate-500">NID ও ডকুমেন্ট পর্যালোচনা করে একাউন্ট ভেরিফাই করুন</p>
              </div>

              <div className="space-y-3">
                {users.filter((u) => u.is_verified === 'pending').length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">কোনো পেন্ডিং ভেরিফিকেশন নেই।</div>
                ) : (
                  users
                    .filter((u) => u.is_verified === 'pending')
                    .map((u) => (
                      <div key={u.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{u.full_name}</h4>
                            <span className="text-xs text-slate-500">{u.email} &bull; {u.mobile}</span>
                            <div className="text-xs font-semibold text-blue-900 mt-1">
                              ডকুমেন্ট: {u.verification_doc_type?.toUpperCase()} &bull; নম্বর: {u.verification_doc_number}
                            </div>
                          </div>
                          <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                            পেন্ডিং
                          </span>
                        </div>

                        {u.verification_doc_image && (
                          <div className="w-48 h-32 rounded-xl overflow-hidden border border-slate-300">
                            <img src={u.verification_doc_image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveKYC(u.id)}
                            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs"
                          >
                            অনুমোদন করুন (Verify)
                          </button>
                          <button
                            onClick={() => handleRejectKYC(u.id)}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs"
                          >
                            বাতিল করুন
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* 5. USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">ইউজার ম্যানেজমেন্ট ({users.length})</h2>
                  <p className="text-xs text-slate-500">ইউজার একাউন্ট পরিচালনা ও স্ট্যাটাস পরিবর্তন</p>
                </div>
                <input
                  type="text"
                  placeholder="নাম বা মোবাইল দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 outline-none max-w-xs"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2.5 px-3">নাম ও ইমেইল</th>
                      <th className="py-2.5 px-3">মোবাইল</th>
                      <th className="py-2.5 px-3">রেফার কোড</th>
                      <th className="py-2.5 px-3">ভেরিফিকেশন</th>
                      <th className="py-2.5 px-3">একশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users
                      .filter(
                        (u) =>
                          u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.mobile.includes(searchTerm) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-800">{u.full_name}</div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </td>
                          <td className="py-2.5 px-3 font-mono">{u.mobile}</td>
                          <td className="py-2.5 px-3 font-bold text-blue-700">{u.referral_code}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.is_verified === 'verified'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {u.is_verified}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            {currentUser && (
                              <button
                                onClick={() => store.toggleUserSuspension(currentUser.id, u.id)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                  u.is_suspended
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                {u.is_suspended ? 'আন-সাসপেন্ড' : 'সাসপেন্ড করুন'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. TASKS CREATOR */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">নতুন মাইক্রো জব / টাস্ক তৈরি</h2>
                <p className="text-xs text-slate-500">ইউজারদের জন্য নতুন ইনকাম কাজ তৈরি ও পাবলিশ করুন</p>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">কাজের শিরোনাম</label>
                    <input
                      type="text"
                      placeholder="যেমন: ইউটিউব চ্যানেল সাবস্ক্রাইব করুন"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                    <select
                      value={newTaskCat}
                      onChange={(e) => setNewTaskCat(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    >
                      <option value="টেলিগ্রাম">টেলিগ্রাম</option>
                      <option value="ইউটিউব">ইউটিউব</option>
                      <option value="ফেসবুক">ফেসবুক</option>
                      <option value="টিকটক">টিকটক</option>
                      <option value="ওয়েবসাইট">ওয়েবসাইট</option>
                      <option value="অ্যাপস">অ্যাপস ডাউনলোড</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">রিওয়ার্ডের পরিমাণ (টাকা)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newTaskReward}
                      onChange={(e) => setNewTaskReward(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">টাস্ক লিংক (ইউআরএল)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newTaskLink}
                      onChange={(e) => setNewTaskLink(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">প্রয়োজনীয় প্রুফ নির্দেশিকা</label>
                  <input
                    type="text"
                    value={newTaskProof}
                    onChange={(e) => setNewTaskProof(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  টাস্ক পাবলিশ করুন
                </button>
              </form>

              {/* Existing Tasks */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 mb-2">চলমান টাস্ক তালিকা ({tasks.length}):</h3>
                <div className="space-y-2">
                  {tasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{t.title}</span>
                        <span className="text-[11px] text-slate-500 block">
                          ক্যাটাগরি: {t.category} &bull; সম্পন্ন: {t.current_participants}/{t.max_participants}
                        </span>
                      </div>
                      <span className="font-extrabold text-emerald-600">৳{t.reward_amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. WALLET ADJUSTMENTS */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">ম্যানুয়াল ব্যালেন্স এডজাস্টমেন্ট ও অডিট</h2>
                <p className="text-xs text-slate-500">বিশেষ কারণে কোনো ইউজারের ব্যালেন্সে টাকা যোগ বা কর্তন করুন</p>
              </div>

              <form onSubmit={handleBalanceAdjust} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ইউজার নির্বাচন করুন</label>
                    <select
                      value={adjustUserId}
                      onChange={(e) => setAdjustUserId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                      required
                    >
                      <option value="">নির্বাচন করুন...</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.full_name} ({u.mobile})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">পরিমাণ (যোগ করতে +৫০, বিয়োগ করতে -৫০)</label>
                    <input
                      type="number"
                      step="1"
                      placeholder="যেমন: 50 অথবা -50"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">এডজাস্টমেন্টের কারণ (বাধ্যতামূলক)</label>
                  <input
                    type="text"
                    placeholder="যেমন: স্পেশাল বোনাস অথবা পেমেন্ট সমন্বয়"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  ব্যালেন্স আপডেট করুন
                </button>
              </form>
            </div>
          )}

          {/* 8. BANNERS & NOTICES */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">হোম ব্যানার ও ঘোষণা নোটিশ</h2>
                <p className="text-xs text-slate-500">হোমপেজের ব্যানার স্লাইডার ও নোটিশ পপআপ পরিচালনা</p>
              </div>

              {/* Notice Editor */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-800">পপআপ নোটিশ বার্তা:</h3>
                <input
                  type="text"
                  value={notice.title}
                  onChange={(e) => store.saveNotice({ ...notice, title: e.target.value })}
                  placeholder="নোটিশ শিরোনাম"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
                <textarea
                  rows={3}
                  value={notice.message}
                  onChange={(e) => store.saveNotice({ ...notice, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notice.is_active}
                      onChange={(e) => store.saveNotice({ ...notice, is_active: e.target.checked })}
                      className="accent-blue-600"
                    />
                    <span>নোটিশ সক্রিয় রাখুন</span>
                  </label>
                  <button
                    onClick={() => alert('নোটিশ আপডেট সেভ হয়েছে!')}
                    className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg"
                  >
                    সেভ করুন
                  </button>
                </div>
              </div>

              {/* Banners List */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800">হোম ব্যানার সমূহ ({banners.length}):</h3>
                {banners.map((b) => (
                  <div key={b.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={b.image_url} alt="" className="w-16 h-10 object-cover rounded-lg" />
                      <div>
                        <span className="font-bold text-slate-800">{b.title}</span>
                        <span className="text-[10px] text-slate-400 block">{b.badge}</span>
                      </div>
                    </div>
                    <span className="text-green-600 font-bold">সক্রিয়</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">ওয়েবসাইট সেটিংস ও পেআউট কনফিগারেশন</h2>
                <p className="text-xs text-slate-500">মিনিমাম ক্যাশআউট, রেফার বোনাস এবং হেল্পলাইন পরিবর্তন</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">সাইটের নাম</label>
                    <input
                      type="text"
                      value={siteForm.site_name}
                      onChange={(e) => setSiteForm({ ...siteForm, site_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ডেভেলপার ক্রেডিট</label>
                    <input
                      type="text"
                      value={siteForm.developer_credit}
                      onChange={(e) => setSiteForm({ ...siteForm, developer_credit: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">সর্বনিম্ন উইথড্র (টাকা)</label>
                    <input
                      type="number"
                      value={siteForm.min_withdrawal}
                      onChange={(e) => setSiteForm({ ...siteForm, min_withdrawal: parseFloat(e.target.value) || 50 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">উইথড্র ফি (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={siteForm.withdrawal_fee_pct}
                      onChange={(e) => setSiteForm({ ...siteForm, withdrawal_fee_pct: parseFloat(e.target.value) || 2 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">রেফারেল বোনাস (টাকা)</label>
                    <input
                      type="number"
                      value={siteForm.referral_bonus}
                      onChange={(e) => setSiteForm({ ...siteForm, referral_bonus: parseFloat(e.target.value) || 10 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">বিকাশ পেমেন্ট নাম্বার</label>
                    <input
                      type="text"
                      value={siteForm.payment_numbers.bkash}
                      onChange={(e) =>
                        setSiteForm({
                          ...siteForm,
                          payment_numbers: { ...siteForm.payment_numbers, bkash: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">নগদ পেমেন্ট নাম্বার</label>
                    <input
                      type="text"
                      value={siteForm.payment_numbers.nagad}
                      onChange={(e) =>
                        setSiteForm({
                          ...siteForm,
                          payment_numbers: { ...siteForm.payment_numbers, nagad: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">রকেট পেমেন্ট নাম্বার</label>
                    <input
                      type="text"
                      value={siteForm.payment_numbers.rocket}
                      onChange={(e) =>
                        setSiteForm({
                          ...siteForm,
                          payment_numbers: { ...siteForm.payment_numbers, rocket: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                {/* GMAIL MARKETING CONFIGURATION */}
                <div className="pt-3 border-t border-slate-200">
                  <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <i className="fa-solid fa-envelope text-red-500"></i>
                    <span>জিমেইল সেল ও মার্কেটিং কনফিগারেশন:</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">প্রতি জিমেইল রেট (টাকা)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={siteForm.gmail_sell_price ?? 14}
                        onChange={(e) =>
                          setSiteForm({
                            ...siteForm,
                            gmail_sell_price: parseFloat(e.target.value) || 14,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">দৈনিক লিমিট (টি)</label>
                      <input
                        type="number"
                        value={siteForm.gmail_daily_limit ?? 1000}
                        onChange={(e) =>
                          setSiteForm({
                            ...siteForm,
                            gmail_daily_limit: parseInt(e.target.value) || 1000,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">আজকের রিকোয়ার্ড পাসওয়ার্ড</label>
                      <input
                        type="text"
                        value={siteForm.gmail_today_password || '@easybd2026'}
                        onChange={(e) =>
                          setSiteForm({
                            ...siteForm,
                            gmail_today_password: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ইউটিউব টিউটোরিয়াল লিংক</label>
                      <input
                        type="url"
                        value={siteForm.gmail_tutorial_url || ''}
                        onChange={(e) =>
                          setSiteForm({
                            ...siteForm,
                            gmail_tutorial_url: e.target.value,
                          })
                        }
                        placeholder="https://youtu.be/..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">রিপোর্ট টাইম টেক্সট</label>
                      <input
                        type="text"
                        value={siteForm.gmail_report_time || '২-৩ দিন'}
                        onChange={(e) =>
                          setSiteForm({
                            ...siteForm,
                            gmail_report_time: e.target.value,
                          })
                        }
                        placeholder="যেমন: ২-৩ দিন"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  সেটিংস সংরক্ষণ করুন
                </button>
              </form>
            </div>
          )}

          {/* 10. SUPABASE SQL & SETUP */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Supabase ডাটাবেজ ইন্টিগ্রেশন ও SQL স্ক্রিপ্ট</h2>
                <p className="text-xs text-slate-500">আপনার Supabase প্রজেক্টে ২২টি টেবিল ও RLS তৈরি করতে নিচের নির্দেশনা অনুসরণ করুন</p>
              </div>

              {/* Active Configured Status */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <h3 className="text-xs font-bold text-emerald-950">Supabase প্রজেক্ট সফলভাবে সংযুক্ত</h3>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-mono mt-0.5">{sbUrl}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                    Active Client Config
                  </span>
                </div>
              </div>

              {/* Direct Supabase Credentials Tester */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800">Supabase API ক্রেডেনশিয়াল ও কানেকশন টেস্ট:</h3>
                  <span className="text-[10px] text-slate-500 font-mono">v2.119.0 Client</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Project URL</label>
                    <input
                      type="url"
                      placeholder="VITE_SUPABASE_URL (যেমন: https://xyz.supabase.co)"
                      value={sbUrl}
                      onChange={(e) => setSbUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Publishable / Anon Public Key</label>
                    <input
                      type="text"
                      placeholder="VITE_SUPABASE_ANON_KEY (sb_publishable_...)"
                      value={sbKey}
                      onChange={(e) => setSbKey(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleTestSupabase}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-satellite-dish"></i>
                    <span>কানেকশন টেস্ট করুন</span>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('supabase_custom_url', sbUrl);
                      localStorage.setItem('supabase_custom_key', sbKey);
                      alert('Supabase ক্রেডেনশিয়াল লোকাল স্টোরেজে সফলভাবে সেভ করা হয়েছে!');
                    }}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-floppy-disk"></i>
                    <span>সেটিংস সেভ করুন</span>
                  </button>
                </div>

                {sbTestResult && (
                  <div className={`p-3 rounded-xl font-semibold text-xs border ${
                    sbTestResult.includes('সফল')
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}>
                    {sbTestResult}
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-2">
                <span className="font-bold block flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-info"></i>
                  <span>Supabase SQL Editor-এ রান করার নিয়ম:</span>
                </span>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 leading-relaxed">
                  <li>আপনার Supabase ড্যাশবোর্ডে (<a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-blue-700 underline font-bold">supabase.com/dashboard</a>) লগইন করুন।</li>
                  <li>বামের মেন্যু থেকে <strong>SQL Editor</strong>-এ ক্লিক করুন।</li>
                  <li>নতুন কুয়েরি খুলে আমাদের <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-blue-900 border border-blue-200">/supabase/schema.sql</code> ফাইলের সম্পূর্ণ কোড পেস্ট করে <strong>Run</strong> চাপুন (এটি ২২টি টেবিল ও RLS তৈরি করবে)।</li>
                  <li>এরপর <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-blue-900 border border-blue-200">/supabase/seed.sql</code> ফাইলের প্রাথমিক ডাটা পেস্ট করে <strong>Run</strong> চাপুন।</li>
                </ol>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
