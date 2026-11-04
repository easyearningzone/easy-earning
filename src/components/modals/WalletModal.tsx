import React, { useState } from 'react';
import { UserProfile, PaymentMethod } from '../../types/database';
import { store } from '../../lib/store';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'withdraw' | 'history'>('overview');
  const [method, setMethod] = useState<PaymentMethod>('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<'personal' | 'agent'>('personal');
  const [amountStr, setAmountStr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const wallet = user ? store.getWallet(user.id) : null;
  const transactions = user ? store.getTransactions(user.id) : [];
  const withdrawals = user ? store.getWithdrawals(user.id) : [];
  const settings = store.getSettings();

  const numAmount = parseFloat(amountStr) || 0;
  const fee = parseFloat(((numAmount * settings.withdrawal_fee_pct) / 100).toFixed(2));
  const finalAmount = Math.max(0, parseFloat((numAmount - fee).toFixed(2)));

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!accountNumber.trim() || accountNumber.length < 11) {
      setFeedback({ text: 'সঠিক ১১ ডিজিটের মোবাইল একাউন্ট নাম্বার দিন।', success: false });
      return;
    }
    if (numAmount < settings.min_withdrawal) {
      setFeedback({ text: `সর্বনিম্ন উইথড্রয়াল ৳${settings.min_withdrawal}`, success: false });
      return;
    }
    if (numAmount > settings.max_withdrawal) {
      setFeedback({ text: `সর্বোচ্চ উইথড্রয়াল ৳${settings.max_withdrawal}`, success: false });
      return;
    }
    if ((wallet?.available_balance || 0) < numAmount) {
      setFeedback({ text: 'আপনার ওয়ালেটে পর্যাপ্ত এভেইলেবল ব্যালেন্স নেই।', success: false });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    setTimeout(() => {
      const res = store.requestWithdrawal(user.id, method, accountNumber, numAmount, accountType);
      setIsSubmitting(false);
      setFeedback({ text: res.message, success: res.success });
      if (res.success) {
        setAmountStr('');
        setAccountNumber('');
        setTimeout(() => {
          setActiveTab('history');
        }, 1200);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-blue-100">
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-[#1e3a8a] via-blue-800 to-indigo-900 text-white p-4 sm:p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm">
              <i className="fa-solid fa-wallet"></i>
            </span>
            <h3 className="text-base sm:text-lg font-bold">মাই ওয়ালেট ও ক্যাশআউট</h3>
          </div>
          <p className="text-xs text-blue-200">বিকাশ, নগদ এবং রকেটে পেমেন্ট গ্রহণ করুন</p>

          {/* Wallet Tabs */}
          <div className="flex gap-1.5 mt-3 bg-blue-950/40 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              ব্যালেন্স ওভারভিউ
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'withdraw'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              উইথড্র রিকোয়েস্ট
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              লেনদেন হিস্ট্রি ({transactions.length})
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {!user ? (
            <div className="text-center py-10">
              <p className="text-sm text-slate-600 mb-3">ওয়ালেট দেখতে দয়া করে লগইন করুন</p>
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl"
              >
                লগইন করুন
              </button>
            </div>
          ) : activeTab === 'overview' ? (
            /* Balance Overview Cards */
            <div className="space-y-3">
              {/* Main Available Card */}
              <div className="rainbow-card p-5 border border-slate-200 shadow-sm text-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
                  বর্তমান এভেইলেবল ব্যালেন্স
                </span>
                <div className="text-3xl font-extrabold text-blue-900 my-1">
                  ৳{(wallet?.available_balance || 0).toFixed(2)}
                </div>
                <div className="flex justify-center gap-2 mt-3">
                  <button
                    onClick={() => setActiveTab('withdraw')}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-money-bill-transfer"></i>
                    <span>টাকা উত্তোলন (Withdraw)</span>
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">মোট ব্যালেন্স</span>
                  <span className="text-base font-bold text-slate-900 block mt-0.5">
                    ৳{(wallet?.total_balance || 0).toFixed(2)}
                  </span>
                </div>
                <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
                  <span className="text-[11px] text-amber-700 block">পেন্ডিং উইথড্রয়াল</span>
                  <span className="text-base font-bold text-amber-900 block mt-0.5">
                    ৳{(wallet?.pending_balance || 0).toFixed(2)}
                  </span>
                </div>
                <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200">
                  <span className="text-[11px] text-emerald-700 block">সর্বমোট আয়</span>
                  <span className="text-base font-bold text-emerald-900 block mt-0.5">
                    ৳{(wallet?.total_earnings || 0).toFixed(2)}
                  </span>
                </div>
                <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200">
                  <span className="text-[11px] text-blue-700 block">মোট সফল উত্তোলন</span>
                  <span className="text-base font-bold text-blue-900 block mt-0.5">
                    ৳{(wallet?.total_withdrawals || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Supported Payment Logos */}
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  আমাদের সাপোর্টেড পেমেন্ট মেথড
                </span>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1 text-pink-600 font-bold text-xs bg-white px-3 py-1.5 rounded-lg shadow-2xs border border-slate-200">
                    <i className="fa-solid fa-mobile-screen"></i> বিকাশ (bKash)
                  </div>
                  <div className="flex items-center gap-1 text-orange-600 font-bold text-xs bg-white px-3 py-1.5 rounded-lg shadow-2xs border border-slate-200">
                    <i className="fa-solid fa-mobile-screen"></i> নগদ (Nagad)
                  </div>
                  <div className="flex items-center gap-1 text-purple-600 font-bold text-xs bg-white px-3 py-1.5 rounded-lg shadow-2xs border border-slate-200">
                    <i className="fa-solid fa-mobile-screen"></i> রকেট (Rocket)
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'withdraw' ? (
            /* Withdrawal Request Form */
            <form onSubmit={handleWithdrawalSubmit} className="space-y-3.5">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  পেমেন্ট মেথড নির্বাচন করুন
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('bkash')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      method === 'bkash'
                        ? 'border-pink-600 bg-pink-50 text-pink-700 ring-2 ring-pink-200'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>bKash</span>
                    <span className="text-[10px] text-pink-600 font-medium">বিকাশ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('nagad')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      method === 'nagad'
                        ? 'border-orange-600 bg-orange-50 text-orange-700 ring-2 ring-orange-200'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Nagad</span>
                    <span className="text-[10px] text-orange-600 font-medium">নগদ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('rocket')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      method === 'rocket'
                        ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-200'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Rocket</span>
                    <span className="text-[10px] text-purple-600 font-medium">রকেট</span>
                  </button>
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {method === 'bkash' ? 'বিকাশ' : method === 'nagad' ? 'নগদ' : 'রকেট'} মোবাইল নাম্বার
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold"
                  required
                />
              </div>

              {/* Account Type */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="accountType"
                    checked={accountType === 'personal'}
                    onChange={() => setAccountType('personal')}
                    className="accent-blue-600"
                  />
                  <span>পার্সোনাল (Personal)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="accountType"
                    checked={accountType === 'agent'}
                    onChange={() => setAccountType('agent')}
                    className="accent-blue-600"
                  />
                  <span>এজেন্ট (Agent)</span>
                </label>
              </div>

              {/* Amount */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    উইথড্রয়াল পরিমাণ (টাকা)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    লিমিট: ৳{settings.min_withdrawal} - ৳{settings.max_withdrawal}
                  </span>
                </div>
                <input
                  type="number"
                  placeholder={`যেমন: ${settings.min_withdrawal}`}
                  min={settings.min_withdrawal}
                  max={settings.max_withdrawal}
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-extrabold text-blue-900"
                  required
                />
              </div>

              {/* Fee & Calculation Summary */}
              {numAmount > 0 && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>রিকোয়েস্ট এমাউন্ট:</span>
                    <span className="font-bold">৳{numAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>সার্ভিস চার্জ ({settings.withdrawal_fee_pct}%):</span>
                    <span className="text-red-600 font-bold">-৳{fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-extrabold border-t border-slate-200 pt-1">
                    <span>আপনি পাবেন (Final Payout):</span>
                    <span className="text-emerald-600 text-sm">৳{finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

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
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  'উইথড্র রিকোয়েস্ট সাবমিট করুন'
                )}
              </button>

              <p className="text-[11px] text-center text-slate-500">
                ⚠️ এডমিন ম্যানুয়ালি ভেরিফাই করে মাত্র ৩০-১২০ মিনিটের মধ্যে পেমেন্ট পাঠিয়ে ট্রানজেকশন আইডি আপডেট করে দিবে।
              </p>
            </form>
          ) : (
            /* Transactions & Withdrawals Ledger */
            <div className="space-y-2.5">
              {transactions.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <i className="fa-solid fa-receipt text-3xl mb-2"></i>
                  <p className="text-xs">এখনো কোনো লেনদেন রেকর্ড নেই।</p>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                          tx.amount > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        <i
                          className={
                            tx.amount > 0
                              ? 'fa-solid fa-arrow-down-left'
                              : 'fa-solid fa-arrow-up-right-from-square'
                          }
                        ></i>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">
                          {tx.description}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(tx.created_at).toLocaleString('bn-BD')}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-extrabold ${
                          tx.amount > 0 ? 'text-green-600' : 'text-rose-600'
                        }`}
                      >
                        {tx.amount > 0 ? `+৳${tx.amount.toFixed(2)}` : `-৳${Math.abs(tx.amount).toFixed(2)}`}
                      </span>
                      <span
                        className={`block text-[10px] font-semibold ${
                          tx.status === 'completed'
                            ? 'text-green-600'
                            : tx.status === 'pending'
                            ? 'text-amber-600'
                            : 'text-red-500'
                        }`}
                      >
                        {tx.status === 'completed'
                          ? 'সম্পন্ন'
                          : tx.status === 'pending'
                          ? 'পেন্ডিং'
                          : 'বাতিল'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
