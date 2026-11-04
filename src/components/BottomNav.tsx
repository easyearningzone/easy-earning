import React from 'react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'হোম', icon: 'fa-solid fa-house' },
    { id: 'agent', label: 'এজেন্ট', icon: 'fa-solid fa-user-tie' },
    { id: 'product', label: 'প্রোডাক্ট', isCenter: true, icon: 'fa-solid fa-boxes-stacked' },
    { id: 'wallet', label: 'ওয়ালেট', icon: 'fa-solid fa-wallet' },
    { id: 'network', label: 'নেটওয়ার্ক', icon: 'fa-solid fa-users-rays' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto px-3 h-16 flex items-center justify-around relative">
        {tabs.map((tab) => {
          if (tab.isCenter) {
            const isActive = currentTab === tab.id;
            return (
              <div key={tab.id} className="relative -top-5 flex flex-col items-center">
                <button
                  onClick={() => onTabChange(tab.id)}
                  aria-label={tab.label}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 ring-4 ring-orange-200'
                      : 'bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 hover:scale-105 ring-4 ring-blue-100'
                  }`}
                >
                  <i className={`${tab.icon} text-xl drop-shadow`}></i>
                </button>
                <span
                  className={`text-[11px] font-bold mt-1 ${
                    isActive ? 'text-amber-600' : 'text-slate-600'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            );
          }

          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center w-14 py-1 transition-all active:scale-90"
            >
              <div
                className={`w-9 h-7 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-blue-100 text-[#1e3a8a] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <i className={`${tab.icon} text-base`}></i>
              </div>
              <span
                className={`text-[11px] font-semibold tracking-tight transition-colors ${
                  isActive ? 'text-[#1e3a8a] font-bold' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
