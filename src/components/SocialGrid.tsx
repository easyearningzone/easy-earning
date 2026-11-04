import React from 'react';
import { SocialLink } from '../types/database';

interface SocialGridProps {
  socialLinks: SocialLink[];
}

export const SocialGrid: React.FC<SocialGridProps> = ({ socialLinks }) => {
  const activeLinks = socialLinks.filter((s) => s.is_active);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          আমাদের অফিসিয়াল কমিউনিটি
        </h2>
        <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
          <i className="fa-solid fa-users text-[10px]"></i>
          সরাসরি যুক্ত হোন
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
        {activeLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition-all group active:scale-95 text-center"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-base shadow-xs transition-transform group-hover:scale-110 mb-1.5"
              style={{ backgroundColor: link.color }}
            >
              <i className={link.icon}></i>
            </div>
            <span className="text-[11px] font-semibold text-slate-700 group-hover:text-blue-900 line-clamp-1">
              {link.name_bn || link.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};
