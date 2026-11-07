import React, { useState } from 'react';
import { UserProfile, SiteSettings } from '../types/database';

interface HeaderProps {
  user: UserProfile | null;
  settings: SiteSettings;
  onOpenSidebar: () => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  settings,
  onOpenSidebar,
  onOpenNotifications,
  onOpenAuth,
  onOpenAdmin
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#1e3a8a] text-white shadow-md border-b border-blue-900/50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            aria-label="Open Menu"
            className="w-10 h-10 rounded-xl bg-blue-800/80 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <i className="fa-solid fa-bars-staggered text-lg"></i>
          </button>

          <div className="flex items-center gap-2 cursor-pointer select-none">
            <img
              src="/assets/aistudio/Easy_Earning_BD_Growth_Emblem_331a2dc7.png"
              alt="Easy Earning BD Logo"
              className="w-10 h-10 object-contain drop-shadow-md rounded-xl hover:scale-105 transition-transform"
            />
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-wide text-white leading-tight flex items-center gap-1.5">
                {settings.site_name}
                <span className="text-[10px] bg-green-500 text-white font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  BD
                </span>
              </h1>
              <p className="text-[10px] text-blue-200 font-medium">
                {settings.developer_credit}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Admin shortcut if admin */}
          {user?.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm transition-all"
            >
              <i className="fa-solid fa-shield-halved text-xs"></i>
              <span className="hidden sm:inline">এডমিন প্যানেল</span>
            </button>
          )}

          {/* Notification Icon */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="w-10 h-10 rounded-xl bg-blue-800/80 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center relative text-white"
          >
            <i className="fa-regular fa-bell text-lg"></i>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#1e3a8a] animate-pulse"></span>
          </button>

          {/* User profile / Login */}
          {user ? (
            <button
              onClick={onOpenSidebar}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-blue-800/60 hover:bg-blue-700/80 transition-all border border-blue-700"
            >
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                alt={user.full_name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-blue-300"
              />
              <span className="text-xs font-semibold text-blue-100 hidden sm:inline max-w-[90px] truncate">
                {user.full_name}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm transition-all flex items-center gap-1.5"
            >
              <i className="fa-solid fa-right-to-bracket"></i>
              <span>লগইন</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
