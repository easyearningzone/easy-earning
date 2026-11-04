import React from 'react';
import { Notice } from '../types/database';

interface NoticeModalProps {
  notice: Notice;
  isOpen: boolean;
  onClose: () => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({ notice, isOpen, onClose }) => {
  if (!isOpen || !notice.is_active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-blue-100 transform transition-all animate-scale-up">
        {/* Header with decorative illustration */}
        <div className="bg-gradient-to-r from-[#1e3a8a] via-blue-700 to-indigo-800 p-5 text-white relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xs mx-auto flex items-center justify-center text-3xl text-amber-300 mb-2 shadow-inner">
            <i className="fa-solid fa-bullhorn animate-bounce"></i>
          </div>

          <h3 className="text-lg font-bold text-white leading-snug">
            {notice.title}
          </h3>
          <p className="text-xs text-blue-100 mt-1">EASY EARNING BD অফিসিয়াল বার্তা</p>
        </div>

        {/* Message Content */}
        <div className="p-5 space-y-4">
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-48 overflow-y-auto">
            {notice.message}
          </div>

          {/* Social Community Action Buttons */}
          <div className="space-y-2">
            {notice.telegram_url && (
              <a
                href={notice.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <i className="fa-brands fa-telegram text-base"></i>
                <span>টেলিগ্রাম চ্যানেলে জয়েন করুন</span>
              </a>
            )}

            {notice.whatsapp_url && (
              <a
                href={notice.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <i className="fa-brands fa-whatsapp text-base"></i>
                <span>হোয়াটসঅ্যাপ গ্রুপে যুক্ত হোন</span>
              </a>
            )}

            {notice.tutorial_url && (
              <a
                href={notice.tutorial_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <i className="fa-brands fa-youtube text-base"></i>
                <span>কাজ শেখার ভিডিও টিউটোরিয়াল দেখুন</span>
              </a>
            )}
          </div>

          {/* Dismiss button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
