import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../../types/database';
import { store } from '../../lib/store';

interface GiftCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

export const GiftCodeModal: React.FC<GiftCodeModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!code.trim()) return;

    setLoading(true);
    setFeedback(null);

    setTimeout(() => {
      const res = store.redeemGiftCode(user.id, code);
      setLoading(false);
      setFeedback({ text: res.message, success: res.success });
      if (res.success) {
        setCode('');
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-5 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs mx-auto flex items-center justify-center text-2xl text-white mb-2 shadow-inner">
            <i className="fa-solid fa-ticket"></i>
          </div>
          <h3 className="text-lg font-bold">সিক্রেট গিফট কোড রিডিম</h3>
          <p className="text-xs text-pink-100">প্রোমো কোড দিয়ে ফ্রি ওয়ালেট রিওয়ার্ড গ্রহণ করুন</p>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                গিফট কোড লিখুন
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="যেমন: EASY2026 বা WELCOME10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none text-sm uppercase tracking-wider font-bold"
                />
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
              disabled={loading || !code.trim()}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                'রিডিম করুন ও টাকা সংগ্রহ করুন'
              )}
            </button>
          </form>

          {/* Tips / Available demo codes hint */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] space-y-1">
            <span className="font-bold text-slate-800 block">💡 আজকের চালু কোড সমূহ:</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span
                onClick={() => setCode('EASY2026')}
                className="cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-300 hover:border-pink-500 text-pink-700 font-bold"
              >
                EASY2026 (২০৳)
              </span>
              <span
                onClick={() => setCode('WELCOME10')}
                className="cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-300 hover:border-pink-500 text-pink-700 font-bold"
              >
                WELCOME10 (১০৳)
              </span>
              <span
                onClick={() => setCode('AHADSPECIAL')}
                className="cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-300 hover:border-pink-500 text-pink-700 font-bold"
              >
                AHADSPECIAL (৫০৳)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
