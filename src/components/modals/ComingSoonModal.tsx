import React from 'react';
import { ProjectItem } from '../../types/database';

interface ComingSoonModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 text-center animate-scale-up">
        {/* Decorative Header */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg mb-2 text-white"
            style={{ backgroundColor: project.icon_color || '#d97706' }}
          >
            <i className={project.icon}></i>
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-white text-orange-600 uppercase tracking-wider shadow-xs mb-1">
            🚀 কামিং সুন (Coming Soon)
          </span>

          <h3 className="text-base font-bold text-white leading-snug">
            {project.title_bn}
          </h3>
          <p className="text-xs text-orange-100">{project.title}</p>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-xs text-slate-600">
          <div className="bg-orange-50/80 rounded-2xl p-4 border border-orange-200 space-y-1.5 text-center">
            <span className="font-bold text-slate-800 text-xs block">
              🛠️ দ্রুত এই ফিচারটি চালু হচ্ছে!
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {project.description ||
                'আমাদের টিম এই প্রজেক্টের কাজ প্রায় শেষ পর্যায়ে নিয়ে এসেছে। শীঘ্রই এটি সকল মেম্বারদের জন্য উন্মুক্ত করা হবে।'}
            </p>
          </div>

          <div className="space-y-2">
            <a
              href="https://t.me/easyearningbd"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-[#229ED9] hover:bg-[#1f8fc4] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <i className="fa-brands fa-telegram text-sm"></i>
              <span>টেলিগ্রামে অগ্রিম নোটিশ দেখুন</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              ঠিক আছে, ফিরে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
