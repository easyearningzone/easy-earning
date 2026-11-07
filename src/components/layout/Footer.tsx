import React from 'react';
import { SiteSettings } from '../../types/database';

interface FooterProps {
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12 py-8 px-4 text-xs text-slate-500">
      <div className="max-w-4xl mx-auto space-y-4 text-center">
        <div className="flex flex-col items-center justify-center">
          <img
            src="/assets/aistudio/Easy_Earning_BD_Growth_Emblem_331a2dc7.png"
            alt="Easy Earning BD Logo"
            className="w-14 h-14 object-contain drop-shadow-sm rounded-xl mb-1 hover:scale-105 transition-transform"
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-semibold text-slate-700">
          <a href="/dashboard.html" className="hover:text-blue-900 transition-colors">ড্যাশবোর্ড</a>
          <span>&bull;</span>
          <a href="/projects.html" className="hover:text-blue-900 transition-colors">সকল প্রজেক্ট</a>
          <span>&bull;</span>
          <a href="/micro-jobs.html" className="hover:text-blue-900 transition-colors">মাইক্রো জবস</a>
          <span>&bull;</span>
          <a href="/wallet.html" className="hover:text-blue-900 transition-colors">ওয়ালেট</a>
          <span>&bull;</span>
          <a href="/withdraw.html" className="hover:text-blue-900 transition-colors">উইথড্র</a>
          <span>&bull;</span>
          <a href="/referral.html" className="hover:text-blue-900 transition-colors">রেফারেল</a>
          <span>&bull;</span>
          <a href="/support.html" className="hover:text-blue-900 transition-colors">সাপোর্ট</a>
          <span>&bull;</span>
          <a href="/privacy-policy.html" className="hover:text-blue-900 transition-colors">প্রাইভেসি পলিসি</a>
          <span>&bull;</span>
          <a href="/terms.html" className="hover:text-blue-900 transition-colors">শর্তাবলি</a>
        </div>

        <div className="text-[11px] text-slate-400">
          <p className="font-bold text-slate-600 mb-1">{settings.site_name} &bull; {settings.tagline}</p>
          <p>&copy; {new Date().getFullYear()} {settings.site_name}. All Rights Reserved &bull; {settings.developer_credit}</p>
        </div>
      </div>
    </footer>
  );
};
