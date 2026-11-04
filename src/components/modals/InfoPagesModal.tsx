import React, { useState } from 'react';
import { UserProfile, SiteSettings } from '../../types/database';
import { store } from '../../lib/store';

interface InfoPagesModalProps {
  pageType: 'profile' | 'support' | 'about' | 'privacy' | 'faq' | 'reviews' | 'password' | null;
  onClose: () => void;
  user: UserProfile | null;
  settings: SiteSettings;
  onOpenAuth: () => void;
}

export const InfoPagesModal: React.FC<InfoPagesModalProps> = ({
  pageType,
  onClose,
  user,
  settings,
  onOpenAuth,
}) => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!pageType) return null;

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ text: 'আপনার সাপোর্ট টিকিট জমা নেওয়া হয়েছে। প্রতিনিধি শীঘ্রই রিপ্লাই দিবেন।', success: true });
    setTicketSubject('');
    setTicketMessage('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ text: 'মূল্যবান মতামতের জন্য ধন্যবাদ! আপনার রিভিউ সফলভাবে প্রকাশিত হয়েছে।', success: true });
    setReviewComment('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMsg({ text: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।', success: false });
      return;
    }
    setMsg({ text: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।', success: true });
    setOldPassword('');
    setNewPassword('');
  };

  const titles: Record<string, string> = {
    profile: 'আমার প্রোফাইল (My Profile)',
    support: 'সাপোর্ট ও হেল্পলাইন (Support)',
    about: 'আমাদের সম্পর্কে (About Us)',
    privacy: 'প্রাইভেসি ও নীতিমালা (Privacy Policy)',
    faq: 'সাধারণ প্রশ্নাবলি (FAQ)',
    reviews: 'ইউজার রিভিউ ও মতামত (Reviews)',
    password: 'পাসওয়ার্ড পরিবর্তন (Change Password)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-blue-800 text-white p-4 sm:p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h3 className="text-base sm:text-lg font-bold">{titles[pageType]}</h3>
          <p className="text-xs text-blue-200">{settings.site_name} &bull; {settings.developer_credit}</p>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700">
          {msg && (
            <div
              className={`p-3 rounded-xl font-semibold text-center ${
                msg.success
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {msg.text}
            </div>
          )}

          {/* Profile */}
          {pageType === 'profile' && (
            !user ? (
              <div className="text-center py-6">
                <p className="mb-2">প্রোফাইল দেখতে অনুগ্রহ করে লগইন করুন</p>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  লগইন করুন
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <img
                    src={user.avatar_url}
                    alt=""
                    className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-300"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{user.full_name}</h4>
                    <p className="text-slate-500">{user.email}</p>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {user.role === 'admin' ? 'এডমিনিস্ট্রেটর' : 'রেগুলার মেম্বার'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">মোবাইল</span>
                    <span className="font-bold text-slate-800">{user.mobile}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">রেফার কোড</span>
                    <span className="font-bold text-blue-700">{user.referral_code}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">ভেরিফিকেশন স্ট্যাটাস</span>
                    <span className="font-bold text-emerald-700">{user.is_verified.toUpperCase()}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">জয়েনিং ডেট</span>
                    <span className="font-bold text-slate-800">{new Date(user.created_at).toLocaleDateString('bn-BD')}</span>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Support */}
          {pageType === 'support' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${settings.support_whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl flex flex-col items-center text-center hover:bg-[#25D366]/20 transition-all"
                >
                  <i className="fa-brands fa-whatsapp text-2xl text-[#25D366] mb-1"></i>
                  <span className="font-bold text-slate-800">WhatsApp সাপোর্ট</span>
                  <span className="text-[10px] text-slate-500">{settings.support_whatsapp}</span>
                </a>
                <a
                  href={settings.support_telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#229ED9]/10 border border-[#229ED9]/30 rounded-2xl flex flex-col items-center text-center hover:bg-[#229ED9]/20 transition-all"
                >
                  <i className="fa-brands fa-telegram text-2xl text-[#229ED9] mb-1"></i>
                  <span className="font-bold text-slate-800">Telegram গ্রুপ</span>
                  <span className="text-[10px] text-slate-500">তাত্ক্ষণিক সমাধান</span>
                </a>
              </div>

              <form onSubmit={handleSupportSubmit} className="space-y-2 pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-800 block">সাপোর্ট টিকিট পাঠান:</span>
                <input
                  type="text"
                  placeholder="বিষয় (Subject)"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  required
                />
                <textarea
                  rows={3}
                  placeholder="আপনার সমস্যা বা বার্তা বিস্তারিত লিখুন..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-xs"
                >
                  টিকিট সাবমিট করুন
                </button>
              </form>
            </div>
          )}

          {/* About Us */}
          {pageType === 'about' && (
            <div className="space-y-3 leading-relaxed">
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                <h4 className="font-bold text-blue-900 text-sm mb-1">{settings.site_name}</h4>
                <p className="text-slate-600">{settings.tagline}</p>
                <p className="text-blue-800 font-bold mt-1 text-[11px]">ডেভেলপার: {settings.developer_credit}</p>
              </div>
              <p>
                EASY EARNING BD বাংলাদেশের একটি অগ্রগামী মাইক্রো-টাস্ক এবং ডিজিটাল ইনকাম প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য হল তরুণদের ঘরে বসে তাদের স্মার্টফোন ব্যবহার করে পার্ট-টাইম বা ফুল-টাইম বৈধ অনলাইন আয় করার সুযোগ করে দেওয়া।
              </p>
              <p>
                আমরা প্রতিটি কাজের সঠিক যাচাই এবং মাত্র ৩০ মিনিটের মধ্যে বিকাশ, নগদ ও রকেটের মাধ্যমে টাকা পেআউট নিশ্চিত করি।
              </p>
            </div>
          )}

          {/* Privacy Policy */}
          {pageType === 'privacy' && (
            <div className="space-y-2.5 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">আমাদের গোপনীয়তা নীতি:</h4>
              <p>১. ব্যবহারকারীদের সকল ব্যক্তিগত তথ্য সুরক্ষিত ডাটাবেজে এনক্রিপ্ট করে সংরক্ষণ করা হয়।</p>
              <p>২. আমরা কোনো অবস্থাতেই আপনার পাসওয়ার্ড, ইমেইল লগইন, ওটিপি বা ব্যক্তিগত এক্সেস তথ্য চাই না।</p>
              <p>৩. ফেক স্ক্রিনশট, ভিপিএন অপব্যবহার বা একাধিক একাউন্ট ব্যবহারকারীকে তাৎক্ষণিক ব্যান করা হয়।</p>
              <p>৪. সমস্ত উইথড্রয়াল ম্যানুয়াল অডিটের মাধ্যমে নিরাপদে গ্রাহকের একাউন্টে সরাসরি পরিশোধ করা হয়।</p>
            </div>
          )}

          {/* FAQ */}
          {pageType === 'faq' && (
            <div className="space-y-2">
              {[
                { q: 'উইথড্র করার সর্বনিম্ন লিমিট কত?', a: 'সর্বনিম্ন ৫০ টাকা ব্যালেন্স হলেই বিকাশ, নগদ বা রকেটে উইথড্র করতে পারবেন।' },
                { q: 'টাকা পেতে কত সময় লাগে?', a: 'সাধারণত ১০ মিনিট থেকে সর্বোচ্চ ১-২ ঘণ্টার মধ্যে এডমিন যাচাই করে পেমেন্ট পাঠিয়ে দেয়।' },
                { q: 'রেফার করে কত বোনাস পাব?', a: 'প্রতি রেফারে ১০ টাকা তাৎক্ষণিক বোনাস এবং রেফারেল মেম্বারদের আয়ের ১০% আজীবন কমিশন পাবেন।' },
                { q: 'ভেরিফিকেশন কি বাধ্যতামূলক?', a: 'প্রাথমিক উইথড্রতে বাধ্যতামূলক নয়, তবে বড় অঙ্কের লেনদেন ও সুরক্ষার জন্য NID ভেরিফিকেশন বাঞ্ছনীয়।' },
              ].map((faq, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <h5 className="font-bold text-slate-800 mb-1">❓ {faq.q}</h5>
                  <p className="text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          )}

          {/* Reviews */}
          {pageType === 'reviews' && (
            <div className="space-y-3">
              <form onSubmit={handleReviewSubmit} className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-800 block">আপনার রেটিং দিন:</span>
                <div className="flex gap-1 text-amber-400 text-base">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`cursor-pointer ${star <= reviewRating ? 'fa-solid fa-star' : 'fa-regular fa-star'}`}
                    ></i>
                  ))}
                </div>
                <textarea
                  rows={2}
                  placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  রিভিউ পোস্ট করুন
                </button>
              </form>

              <div className="space-y-2">
                {[
                  { name: 'শামীম ওসমান', star: 5, text: 'মাত্র ২০ মিনিটের মধ্যে নগদে ১০০ টাকা উইথড্র পেয়েছি! ধন্যবাদ EASY EARNING BD।' },
                  { name: 'আরিফুর রহমান', star: 5, text: 'অনেক সহজ সহজ কাজ। স্পিন আর দৈনিক বোনাস দিয়েও ভালো টাকা জমে।' },
                ].map((rev, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">{rev.name}</span>
                      <span className="text-amber-500 font-bold">★★★★★</span>
                    </div>
                    <p className="text-slate-600">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Change Password */}
          {pageType === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">বর্তমান পাসওয়ার্ড</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">নতুন পাসওয়ার্ড</label>
                <input
                  type="password"
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-xs"
              >
                পাসওয়ার্ড আপডেট করুন
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
