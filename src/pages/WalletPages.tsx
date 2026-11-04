import React, { useState } from 'react';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { AuthGuard } from '../components/layout/AuthGuard';
import { store } from '../lib/store';
import { PaymentMethod } from '../types/database';

export const WalletPage: React.FC = () => {
  const user = store.getCurrentUser();
  const wallet = user ? store.getWallet(user.id) : null;
  const transactions = user ? store.getTransactions(user.id) : [];

  return (
    <AuthGuard>
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'ওয়ালেট ওভারভিউ' }]} />

        {/* Main Available Card */}
        <div className="rainbow-card p-6 border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            বর্তমান এভেইলেবল ব্যালেন্স
          </span>
          <div className="text-4xl font-extrabold text-blue-900 my-2">
            ৳{(wallet?.available_balance || 0).toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mb-4">যেকোনো সময় সরাসরি বিকাশ, নগদ বা রকেটে উত্তোলন করুন</p>
          <div className="flex justify-center gap-3">
            <a
              href="/withdraw.html"
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <i className="fa-solid fa-money-bill-transfer"></i>
              <span>টাকা উত্তোলন (Withdraw)</span>
            </a>
            <a
              href="/add-money.html"
              className="px-4 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <i className="fa-solid fa-plus-circle"></i>
              <span>ব্যালেন্স রিচার্জ (Add Money)</span>
            </a>
          </div>
        </div>

        {/* 4 Balances Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 block">মোট ব্যালেন্স</span>
            <span className="text-lg font-bold text-slate-900 block mt-1">
              ৳{(wallet?.total_balance || 0).toFixed(2)}
            </span>
          </div>
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 shadow-2xs">
            <span className="text-xs text-amber-700 block">পেন্ডিং উইথড্রয়াল</span>
            <span className="text-lg font-bold text-amber-900 block mt-1">
              ৳{(wallet?.pending_balance || 0).toFixed(2)}
            </span>
          </div>
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 shadow-2xs">
            <span className="text-xs text-emerald-700 block">সর্বমোট আয়</span>
            <span className="text-lg font-bold text-emerald-900 block mt-1">
              ৳{(wallet?.total_earnings || 0).toFixed(2)}
            </span>
          </div>
          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 shadow-2xs">
            <span className="text-xs text-blue-700 block">মোট সফল পেআউট</span>
            <span className="text-lg font-bold text-blue-900 block mt-1">
              ৳{(wallet?.total_withdrawals || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">সাম্প্রতিক লেনদেন</h3>
            <a href="/transactions.html" className="text-xs font-semibold text-blue-600 hover:underline">
              সম্পূর্ণ ইতিহাস দেখুন &rarr;
            </a>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{tx.description}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(tx.created_at).toLocaleString('bn-BD')}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-extrabold ${
                      tx.amount > 0 ? 'text-green-600' : 'text-rose-600'
                    }`}
                  >
                    {tx.amount > 0 ? `+৳${tx.amount.toFixed(2)}` : `-৳${Math.abs(tx.amount).toFixed(2)}`}
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export const WithdrawPage: React.FC = () => {
  const user = store.getCurrentUser();
  const wallet = user ? store.getWallet(user.id) : null;
  const settings = store.getSettings();

  const [method, setMethod] = useState<PaymentMethod>('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<'personal' | 'agent'>('personal');
  const [amountStr, setAmountStr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const numAmount = parseFloat(amountStr) || 0;
  const fee = parseFloat(((numAmount * settings.withdrawal_fee_pct) / 100).toFixed(2));
  const finalAmount = Math.max(0, parseFloat((numAmount - fee).toFixed(2)));

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

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
          window.location.href = '/transactions.html';
        }, 1500);
      }
    }, 600);
  };

  return (
    <AuthGuard>
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'ওয়ালেট', href: '/wallet.html' }, { label: 'টাকা উত্তোলন (Withdraw)' }]} />

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">টাকা উত্তোলন (Withdraw Money)</h2>
            <p className="text-xs text-slate-500">বিকাশ, নগদ ও রকেটে দ্রুত পেমেন্ট গ্রহণ করুন</p>
          </div>

          <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 flex justify-between items-center text-xs">
            <span className="text-slate-600">বর্তমান উত্তোলনযোগ্য ব্যালেন্স:</span>
            <span className="text-base font-extrabold text-blue-900">
              ৳{(wallet?.available_balance || 0).toFixed(2)}
            </span>
          </div>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {method.toUpperCase()} একাউন্ট নাম্বার
              </label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs font-bold"
                required
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="accType"
                  checked={accountType === 'personal'}
                  onChange={() => setAccountType('personal')}
                  className="accent-blue-600"
                />
                <span>পার্সোনাল (Personal)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="accType"
                  checked={accountType === 'agent'}
                  onChange={() => setAccountType('agent')}
                  className="accent-blue-600"
                />
                <span>এজেন্ট (Agent)</span>
              </label>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">উইথড্র পরিমাণ (টাকা)</label>
                <span className="text-[10px] text-slate-500">
                  সর্বনিম্ন: ৳{settings.min_withdrawal} &bull; সর্বোচ্চ: ৳{settings.max_withdrawal}
                </span>
              </div>
              <input
                type="number"
                min={settings.min_withdrawal}
                max={settings.max_withdrawal}
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder={`যেমন: ${settings.min_withdrawal}`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-extrabold text-blue-900"
                required
              />
            </div>

            {numAmount > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>রিকোয়েস্ট এমাউন্ট:</span>
                  <span className="font-bold">৳{numAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>সার্ভিস চার্জ ({settings.withdrawal_fee_pct}%):</span>
                  <span className="text-red-600 font-bold">-৳{fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold border-t border-slate-200 pt-1">
                  <span>আপনি পাবেন (Final Amount):</span>
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
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : 'উইথড্র রিকোয়েস্ট সাবমিট করুন'}
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};

export const AddMoneyPage: React.FC = () => {
  const settings = store.getSettings();
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [trxId, setTrxId] = useState('');
  const [amount, setAmount] = useState('100');
  const [senderNumber, setSenderNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AuthGuard>
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'ওয়ালেট', href: '/wallet.html' }, { label: 'ব্যালেন্স রিচার্জ (Add Money)' }]} />

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">ব্যালেন্স রিচার্জ (Add Money)</h2>
            <p className="text-xs text-slate-500">জব পোস্টিং ও সার্ভিসের জন্য ওয়ালেটে ব্যালেন্স যোগ করুন</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2 text-xs text-blue-950">
            <span className="font-bold block">পেমেন্ট নির্দেশিকা:</span>
            <p>১. নিচের নাম্বারে Send Money / ক্যাশআউট করুন:</p>
            <div className="p-2.5 bg-white rounded-xl border border-blue-300 font-mono font-bold text-blue-900 flex justify-between items-center">
              <span>{settings.payment_numbers[method]}</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase font-sans">
                {method}
              </span>
            </div>
            <p>২. টাকা পাঠানোর পর প্রাপ্ত ট্রানজেকশন আইডি (TrxID) নিচের বক্সে দিন।</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মেথড</label>
              <div className="grid grid-cols-3 gap-2">
                {(['bkash', 'nagad', 'rocket'] as const).map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`py-2 rounded-xl text-xs font-bold border uppercase transition-all ${
                      method === m
                        ? 'border-blue-900 bg-blue-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পাঠানো টাকার পরিমাণ (৳)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">যে নাম্বার থেকে পাঠিয়েছেন</label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ট্রানজেকশন আইডি (TrxID)</label>
              <input
                type="text"
                placeholder="যেমন: 9X7G2M4B1"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono uppercase font-bold"
                required
              />
            </div>

            {submitted && (
              <div className="p-3 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold rounded-xl text-center">
                আপনার ডিপোজিট রিকোয়েস্ট সফলভাবে জমা হয়েছে। এডমিন ভেরিফাই করে ৫-১৫ মিনিটের মধ্যে ব্যালেন্স যুক্ত করে দিবে।
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              ডিপোজিট ভেরিফিকেশন জমা দিন
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};

export const TransactionsPage: React.FC = () => {
  const user = store.getCurrentUser();
  const transactions = user ? store.getTransactions(user.id) : [];

  return (
    <AuthGuard>
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'ওয়ালেট', href: '/wallet.html' }, { label: 'লেনদেনের ইতিহাস (Transactions)' }]} />

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">সকল লেনদেন ইতিহাস ({transactions.length})</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">কোনো লেনদেন রেকর্ড পাওয়া যায়নি।</div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                        tx.amount > 0 ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
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
                      <span className="text-xs font-bold text-slate-800 block">{tx.description}</span>
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
        </div>
      </div>
    </AuthGuard>
  );
};
