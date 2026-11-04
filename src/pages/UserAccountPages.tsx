import React, { useState } from 'react';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { AuthGuard } from '../components/layout/AuthGuard';
import { store } from '../lib/store';

export const ProfilePage: React.FC = () => {
  const user = store.getCurrentUser();
  const wallet = user ? store.getWallet(user.id) : null;

  return (
    <AuthGuard>
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'আমার প্রোফাইল' }]} />

        {user && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt=""
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-100 shadow-xs"
              />
              <div className="flex-1">
                <h2 className="text-base font-bold text-slate-900">{user.full_name}</h2>
                <p className="text-xs text-slate-500">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                    {user.role === 'admin' ? 'এডমিনিস্ট্রেটর' : 'মেম্বার'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      user.is_verified === 'verified'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    KYC: {user.is_verified.toUpperCase()}
                  </span>
                </div>
              </div>

              <a
                href="/edit-profile.html"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
              >
                এডিট
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">মোবাইল নাম্বার</span>
                <span className="font-bold text-slate-800">{user.mobile}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">রেফারেল কোড</span>
                <span className="font-bold text-blue-900 font-mono">{user.referral_code}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">ওয়ালেট ব্যালেন্স</span>
                <span className="font-bold text-emerald-700">৳{(wallet?.available_balance || 0).toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">যোগদানের তারিখ</span>
                <span className="font-bold text-slate-800">
                  {new Date(user.created_at).toLocaleDateString('bn-BD')}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/verification.html"
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs rounded-xl border border-blue-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <i className="fa-solid fa-id-card"></i>
                <span>আইডি ভেরিফিকেশন স্ট্যাটাস দেখুন</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export const EditProfilePage: React.FC = () => {
  const user = store.getCurrentUser();
  const [name, setName] = useState(user?.full_name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const users = store.getAllUsers();
    const target = users.find((u) => u.id === user.id);
    if (target) {
      target.full_name = name;
      target.mobile = mobile;
      localStorage.setItem('easy_earning_bd_users', JSON.stringify(users));
      store.setCurrentUser(target);
      setSaved(true);
      setTimeout(() => {
        window.location.href = '/profile.html';
      }, 800);
    }
  };

  return (
    <AuthGuard>
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'প্রোফাইল', href: '/profile.html' }, { label: 'প্রোফাইল এডিট' }]} />

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">ব্যক্তিগত তথ্য আপডেট</h2>

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পুরো নাম</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নাম্বার</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                required
              />
            </div>

            {saved && (
              <div className="p-3 bg-green-50 text-green-700 text-xs font-bold rounded-xl text-center">
                প্রোফাইল সফলভাবে আপডেট হয়েছে!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              সংরক্ষণ করুন
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};

export const VerificationPage: React.FC = () => {
  const user = store.getCurrentUser();
  const [docType, setDocType] = useState('nid');
  const [docNumber, setDocNumber] = useState('');
  const [docImage, setDocImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDocImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const res = store.submitVerification(
        user.id,
        docType,
        docNumber,
        docImage || 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80'
      );
      setIsSubmitting(false);
      setFeedback({ text: res.message, success: res.success });
    }, 600);
  };

  return (
    <AuthGuard>
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'প্রোফাইল', href: '/profile.html' }, { label: 'একাউন্ট ভেরিফিকেশন (KYC)' }]} />

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">আইডি ভেরিফিকেশন (KYC)</h2>
            <p className="text-xs text-slate-500">আপনার NID বা জন্ম নিবন্ধন সনদ জমা দিয়ে নিরাপদ লেনদেন নিশ্চিত করুন</p>
          </div>

          {user?.is_verified === 'verified' ? (
            <div className="p-4 bg-green-50 rounded-2xl border border-green-200 text-center space-y-2">
              <i className="fa-solid fa-circle-check text-green-600 text-3xl"></i>
              <h3 className="font-bold text-sm text-green-900">আপনার একাউন্ট সম্পূর্ণ ভেরিফাইড!</h3>
              <p className="text-xs text-green-700">আপনি সর্বোচ্চ লিমিটে আনলিমিটেড উইথড্র উপভোগ করতে পারবেন।</p>
            </div>
          ) : user?.is_verified === 'pending' ? (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-2">
              <i className="fa-solid fa-hourglass-half text-amber-600 text-3xl animate-pulse"></i>
              <h3 className="font-bold text-sm text-amber-900">ভেরিফিকেশন পর্যালোচনায় আছে</h3>
              <p className="text-xs text-amber-700">আমাদের এডমিন আপনার জমাকৃত ডকুমেন্টস যাচাই করছে।</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ডকুমেন্ট প্রকার</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="nid">জাতীয় পরিচয়পত্র (NID)</option>
                  <option value="birth_certificate">জন্ম নিবন্ধন সনদ</option>
                  <option value="passport">পাসপোর্ট</option>
                  <option value="student_id">স্টুডেন্ট আইডি</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ডকুমেন্ট নম্বর</label>
                <input
                  type="text"
                  placeholder="যেমন: 1998564738..."
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ডকুমেন্টের সামনের ছবি</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                />
              </div>

              {feedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold text-center ${
                    feedback.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : 'ভেরিফিকেশন সাবমিট করুন'}
              </button>
            </form>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export const NotificationsPage: React.FC = () => {
  const notifs = [
    { id: '1', title: 'পেমেন্ট অনুমোদিত হয়েছে!', msg: 'আপনার বিকাশ নাম্বারে ৳১৬০ উইথড্রয়াল সফল হয়েছে। TrxID: 9X7G2M4B1', time: '১ ঘণ্টা আগে', read: false },
    { id: '2', title: 'টাস্ক রিওয়ার্ড যুক্ত হয়েছে', msg: 'টেলিগ্রাম চ্যানেলে জয়েন টাস্ক সফল হওয়ায় ৳১০ ওয়ালেটে যোগ হয়েছে।', time: '৩ ঘণ্টা আগে', read: true },
    { id: '3', title: 'নতুন বোনাস অফার!', msg: 'আজকের দৈনিক বোনাস গ্রহণ করুন এবং লাকি স্পিন হুইল ঘোরান।', time: 'গতকাল', read: true },
  ];

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'নোটিফিকেশন (Notifications)' }]} />

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          নোটিফিকেশন সমূহ ({notifs.length})
        </h2>

        <div className="divide-y divide-slate-100">
          {notifs.map((n) => (
            <div key={n.id} className="py-3 flex items-start gap-3">
              <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? 'bg-slate-300' : 'bg-blue-600'}`}></span>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{n.msg}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AnnouncementsPage: React.FC = () => {
  const notice = store.getNotice();

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'জরুরি নোটিশ ও নির্দেশনা' }]} />

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            অফিসিয়াল বিজ্ঞপ্তি
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-2">{notice.title}</h2>
          <span className="text-[10px] text-slate-400">প্রকাশের সময়: {new Date(notice.created_at).toLocaleDateString('bn-BD')}</span>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
          {notice.message}
        </div>

        <div className="flex gap-2">
          {notice.telegram_url && (
            <a
              href={notice.telegram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-[#229ED9] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <i className="fa-brands fa-telegram"></i>
              <span>টেলিগ্রাম চ্যানেল</span>
            </a>
          )}
          {notice.whatsapp_url && (
            <a
              href={notice.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-[#25D366] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <i className="fa-brands fa-whatsapp"></i>
              <span>হোয়াটসঅ্যাপ হেল্পলাইন</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const ReferralPage: React.FC = () => {
  const user = store.getCurrentUser();
  const settings = store.getSettings();
  const referralCode = user?.referral_code || 'EASYBD';
  const siteUrl = window.location.origin;
  const referralLink = `${siteUrl}?ref=${referralCode}`;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'রেফারেল ড্যাশবোর্ড (Refer & Earn)' }]} />

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">রেফারেল প্রোগ্রাম</h2>
          <p className="text-xs text-slate-500">
            প্রতি রেফারে ৳{settings.referral_bonus} ইনস্ট্যান্ট + আজীবন {settings.referral_commission_pct}% ইনকাম কমিশন
          </p>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
          <span className="text-[10px] text-emerald-800 uppercase font-bold block">আপনার ইনভাইট লিংক:</span>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-white px-3 py-2 text-xs rounded-xl border border-emerald-300 font-mono text-slate-800 select-all"
            />
            <button
              onClick={copy}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shrink-0 transition-all"
            >
              {copied ? 'কপি হয়েছে' : 'কপি করুন'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`EASY EARNING BD-তে জয়েন করে ঘরে বসে টাকা আয় করুন!\nলিংক: ${referralLink}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 bg-[#25D366] text-white font-bold text-xs rounded-xl text-center shadow-xs"
          >
            WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 bg-[#229ED9] text-white font-bold text-xs rounded-xl text-center shadow-xs"
          >
            Telegram
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 bg-[#1877F2] text-white font-bold text-xs rounded-xl text-center shadow-xs"
          >
            Facebook
          </a>
        </div>

        <a
          href="/network.html"
          className="block text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
        >
          আমার রেফারেল টিম ও নেটওয়ার্ক দেখুন &rarr;
        </a>
      </div>
    </div>
  );
};

export const NetworkPage: React.FC = () => {
  const user = store.getCurrentUser();
  const allUsers = store.getAllUsers();
  const myReferees = allUsers.filter((u) => u.referred_by === user?.referral_code);

  return (
    <AuthGuard>
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'রেফারেল', href: '/referral.html' }, { label: 'আমার নেটওয়ার্ক (My Network)' }]} />

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">আমার রেফারেল নেটওয়ার্ক ({myReferees.length} জন)</h2>

          <div className="space-y-2">
            {myReferees.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                এখনো কোনো মেম্বার যুক্ত হয়নি। রেফারেল লিংক শেয়ার করে টিম তৈরি করুন।
              </div>
            ) : (
              myReferees.map((ref) => (
                <div key={ref.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={ref.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-800">{ref.full_name}</h4>
                      <span className="text-[10px] text-slate-400">যোগদান: {new Date(ref.created_at).toLocaleDateString('bn-BD')}</span>
                    </div>
                  </div>
                  <span className="text-emerald-700 font-extrabold">+৳১০.০০</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export const SupportPage: React.FC = () => {
  const settings = store.getSettings();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'গ্রাহক সেবা ও সাপোর্ট (Customer Support)' }]} />

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">২৪/৭ কাস্টমার সাপোর্ট সেন্টার</h2>
          <p className="text-xs text-slate-500">যেকোনো প্রশ্ন, পেমেন্ট সংক্রান্ত সমস্যা বা সহায়তার জন্য যোগাযোগ করুন</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href={`https://wa.me/${settings.support_whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-green-50 rounded-2xl border border-green-200 text-center hover:bg-green-100 transition-all"
          >
            <i className="fa-brands fa-whatsapp text-2xl text-green-600 mb-1"></i>
            <span className="font-bold text-xs text-slate-800 block">WhatsApp হেল্পলাইন</span>
            <span className="text-[10px] text-slate-500">{settings.support_whatsapp}</span>
          </a>
          <a
            href={settings.support_telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-center hover:bg-blue-100 transition-all"
          >
            <i className="fa-brands fa-telegram text-2xl text-blue-500 mb-1"></i>
            <span className="font-bold text-xs text-slate-800 block">Telegram সাপোর্ট</span>
            <span className="text-[10px] text-slate-500">গ্রুপ সাপোর্ট</span>
          </a>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            setSubject('');
            setMessage('');
          }}
          className="space-y-3 pt-2 border-t border-slate-100"
        >
          <h3 className="text-xs font-bold text-slate-800">সাপোর্ট টিকিট পাঠান:</h3>
          <input
            type="text"
            placeholder="বিষয় (Subject)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            required
          />
          <textarea
            rows={3}
            placeholder="আপনার সমস্যা বা প্রশ্নের বিস্তারিত লিখুন..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            required
          />

          {sent && (
            <div className="p-3 bg-green-50 text-green-700 text-xs font-bold rounded-xl text-center">
              আপনার টিকিট সফলভাবে জমা হয়েছে। আমাদের সাপোর্ট প্রতিনিধি দ্রুত রিপ্লাই দিবে।
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            টিকিট সাবমিট করুন
          </button>
        </form>
      </div>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  return (
    <AuthGuard>
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'একাউন্ট সেটিংস' }]} />

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">একাউন্ট সেটিংস ও নিরাপত্তা</h2>

          <div className="space-y-2">
            <a href="/edit-profile.html" className="block p-3 bg-slate-50 rounded-xl hover:bg-slate-100 text-xs font-bold text-slate-800">
              👤 প্রোফাইল তথ্য পরিবর্তন &rarr;
            </a>
            <a href="/verification.html" className="block p-3 bg-slate-50 rounded-xl hover:bg-slate-100 text-xs font-bold text-slate-800">
              🛡️ আইডি ভেরিফিকেশন (KYC) &rarr;
            </a>
            <a href="/privacy-policy.html" className="block p-3 bg-slate-50 rounded-xl hover:bg-slate-100 text-xs font-bold text-slate-800">
              🔒 প্রাইভেসি পলিসি &rarr;
            </a>
            <a href="/terms.html" className="block p-3 bg-slate-50 rounded-xl hover:bg-slate-100 text-xs font-bold text-slate-800">
              📄 ব্যবহারের নিয়মাবলি ও শর্তাবলি &rarr;
            </a>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'প্রাইভেসি পলিসি (Privacy Policy)' }]} />

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs text-slate-700 leading-relaxed">
        <h2 className="text-base font-bold text-slate-900">গোপনীয়তা ও নিরাপত্তা নীতিমালা</h2>
        <p>১. EASY EARNING BD ব্যবহারকারীদের সকল তথ্য সুরক্ষিত সার্ভার ও ডাটাবেজে এনক্রিপ্ট করে রাখে।</p>
        <p>২. আমরা কোনো অবস্থাতেই আপনার পাসওয়ার্ড, ইমেইল লগইন, ২FA বা গোপন পিন নম্বর চাই না।</p>
        <p>৩. সমস্ত পেআউট এবং উইথড্রয়াল ম্যানুয়াল যাচাইকরণের মাধ্যমে বিশ্বস্তভাবে সরাসরি বিকাশ, নগদ বা রকেটে পাঠানো হয়।</p>
        <p>৪. ফেক স্ক্রিনশট বা অবৈধ কার্যকলাপের বিরুদ্ধে প্ল্যাটফর্মে জিরো-টলারেন্স নীতি কার্যকর রয়েছে।</p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'শর্তাবলি ও নীতিমালা (Terms & Conditions)' }]} />

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs text-slate-700 leading-relaxed">
        <h2 className="text-base font-bold text-slate-900">ব্যবহারের সাধারণ শর্তাবলি</h2>
        <p>১. একজন ব্যবহারকারী কেবল একটি একাউন্ট পরিচালনা করতে পারবেন। মাল্টিপল একাউন্ট নিষিদ্ধ।</p>
        <p>২. টাস্ক সাবমিশনের নিয়ম যথাযথভাবে পূরণ করলেই কেবল ওয়ালেটে রিওয়ার্ড যুক্ত করা হবে।</p>
        <p>৩. সর্বনিম্ন ৫০ টাকা হলে যেকোনো সময় উইথড্রয়াল আবেদন করা যাবে।</p>
        <p>৪. সাইটের সার্বিক নিরাপত্তা রক্ষার্থে এডমিন প্যানেল সন্দেহজনক একাউন্ট সাময়িকভাবে স্থগিত করতে পারে।</p>
      </div>
    </div>
  );
};
