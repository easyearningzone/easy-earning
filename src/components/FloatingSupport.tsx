import React, { useState } from 'react';
import { SiteSettings } from '../types/database';

interface FloatingSupportProps {
  settings: SiteSettings;
  onOpenLiveChat: () => void;
}

export const FloatingSupport: React.FC<FloatingSupportProps> = ({ settings, onOpenLiveChat }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2.5">
      {/* Expanded quick buttons */}
      {isOpen && (
        <div className="flex flex-col gap-2 items-end animate-fade-in-up">
          {/* WhatsApp */}
          <a
            href={settings.support_whatsapp.startsWith('http') ? settings.support_whatsapp : `https://wa.me/${settings.support_whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white px-3.5 py-2 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all text-xs font-bold"
          >
            <span>WhatsApp হেল্পলাইন</span>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fa-brands fa-whatsapp text-sm"></i>
            </span>
          </a>

          {/* Telegram */}
          <a
            href={settings.support_telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#229ED9] text-white px-3.5 py-2 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all text-xs font-bold"
          >
            <span>টেলিগ্রাম সাপোর্ট</span>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fa-brands fa-telegram text-sm"></i>
            </span>
          </a>

          {/* Live Support / Tickets */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenLiveChat();
            }}
            className="flex items-center gap-2 bg-[#008744] text-white px-3.5 py-2 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all text-xs font-bold"
          >
            <span>২৪/৭ লাইভ টিকিট</span>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fa-solid fa-headset text-sm"></i>
            </span>
          </button>
        </div>
      )}

      {/* Main floating trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Support Widget"
        className="w-13 h-13 rounded-full bg-gradient-to-r from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all pulse-float relative border-2 border-white"
      >
        <i className={`text-xl transition-transform duration-300 ${isOpen ? 'fa-solid fa-xmark rotate-90' : 'fa-solid fa-comments'}`}></i>
        
        {/* Badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold">
            1
          </span>
        )}
      </button>
    </div>
  );
};
