import React, { useState } from 'react';
import { UserProfile } from '../../types/database';
import { store } from '../../lib/store';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
}) => {
  const [docType, setDocType] = useState('nid');
  const [docNumber, setDocNumber] = useState('');
  const [docImage, setDocImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDocImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!docNumber.trim()) {
      setFeedback({ text: 'ডকুমেন্ট নাম্বার সঠিকভাবে লিখুন।', success: false });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    setTimeout(() => {
      const res = store.submitVerification(
        user.id,
        docType,
        docNumber,
        docImage || 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80'
      );
      setIsSubmitting(false);
      setFeedback({ text: res.message, success: res.success });
      if (res.success) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs mx-auto flex items-center justify-center text-2xl text-amber-400 mb-2 shadow-inner">
            <i className="fa-solid fa-id-card-clip"></i>
          </div>
          <h3 className="text-base sm:text-lg font-bold">একাউন্ট ভেরিফিকেশন (KYC)</h3>
          <p className="text-xs text-blue-200">আইডি ভেরিফাই করে আনলিমিটেড উইথড্র সুবিধা নিন</p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {!user ? (
            <div className="text-center py-6">
              <p className="text-xs text-slate-600 mb-3">ভেরিফিকেশন সাবমিট করতে লগইন করুন</p>
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl"
              >
                লগইন করুন
              </button>
            </div>
          ) : user.is_verified === 'verified' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-3xl">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <h4 className="font-bold text-slate-800 text-base">আপনার একাউন্ট সম্পূর্ণ ভেরিফাইড!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                ডকুমেন্ট টাইপ: {user.verification_doc_type?.toUpperCase()} (নং: {user.verification_doc_number})
              </p>
              <div className="bg-green-50 p-3 rounded-xl border border-green-200 text-xs text-green-700">
                {user.verification_notes || 'সকল ফিচার সফলভাবে আনলক করা হয়েছে।'}
              </div>
            </div>
          ) : user.is_verified === 'pending' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl animate-pulse">
                <i className="fa-solid fa-hourglass-half"></i>
              </div>
              <h4 className="font-bold text-slate-800 text-base">ভেরিফিকেশন রিকোয়েস্ট জমা আছে</h4>
              <p className="text-xs text-slate-600">
                আমাদের এডমিন আপনার জমাকৃত ডকুমেন্টস যাচাই করছে। সাধারণত ২-১২ ঘণ্টার মধ্যে এপ্রুভ হয়ে যাবে।
              </p>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-800">
                ডকুমেন্ট টাইপ: {user.verification_doc_type?.toUpperCase()} &bull; আইডি নং: {user.verification_doc_number}
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              {user.is_verified === 'rejected' && (
                <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-xs text-red-700">
                  <span className="font-bold block">পূর্বের ভেরিফিকেশন প্রত্যাখ্যাত হয়েছে:</span>
                  {user.verification_notes || 'অনুগ্রহ করে সঠিক তথ্য ও স্পষ্ট ছবি দিয়ে পুনরায় আবেদন করুন।'}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ডকুমেন্ট ক্যাটাগরি
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs font-semibold bg-white"
                >
                  <option value="nid">জাতীয় পরিচয়পত্র (NID Card)</option>
                  <option value="birth_certificate">জন্ম নিবন্ধন সনদ (Birth Certificate)</option>
                  <option value="passport">পাসপোর্ট (Passport)</option>
                  <option value="student_id">স্টুডেন্ট আইডি (Student ID)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আইডি / ডকুমেন্ট নম্বর
                </label>
                <input
                  type="text"
                  placeholder="যেমন: 199852039281..."
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ডকুমেন্টের সামনের অংশের ছবি
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {docImage && (
                  <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-slate-300">
                    <img src={docImage} alt="Preview" className="w-full h-full object-cover" />
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
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  'ভেরিফিকেশন রিকোয়েস্ট জমা দিন'
                )}
              </button>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-[11px] text-blue-900 leading-relaxed flex items-start gap-2">
                <i className="fa-solid fa-shield-halved text-blue-600 mt-0.5"></i>
                <span>
                  <strong>নিরাপত্তা অঙ্গীকার:</strong> EASY EARNING BD কখনো আপনার ইমেইল পাসওয়ার্ড, ওটিপি বা ২FA কোড চায় না। আপনার ডকুমেন্টস কেবল পরিচয় নিশ্চিতকরণের জন্য ব্যবহৃত হবে।
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
