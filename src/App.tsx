import React, { useState, useEffect } from 'react';
import { store } from './lib/store';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { FloatingSupport } from './components/FloatingSupport';
import { BannerSlider } from './components/BannerSlider';
import { VerificationCard } from './components/VerificationCard';
import { SocialGrid } from './components/SocialGrid';
import { EarningProjectGrid } from './components/EarningProjectGrid';

// Multi-Page Views
import { RegisterPage, LoginPage, ForgotPasswordPage } from './pages/AuthPages';
import {
  WalletPage,
  WithdrawPage,
  AddMoneyPage,
  TransactionsPage
} from './pages/WalletPages';
import {
  MicroJobsPage,
  JobDetailsPage,
  SubmitTaskPage,
  MyTasksPage
} from './pages/TaskPages';
import {
  ProjectsPage,
  MobileRechargePage,
  DriveOffersPage,
  TypingJobsPage,
  QuizPage,
  BonusPage,
  LeaderboardPage
} from './pages/ProjectPages';
import {
  ProfilePage,
  EditProfilePage,
  VerificationPage,
  NotificationsPage,
  AnnouncementsPage,
  ReferralPage,
  NetworkPage,
  SupportPage,
  SettingsPage,
  PrivacyPolicyPage,
  TermsPage
} from './pages/UserAccountPages';
import { GmailMarketingPage, GmailHistoryPage } from './pages/GmailMarketingPage';

// Admin Multi-Page Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginPage, AdminLayout } from './pages/admin/AdminPages';

export default function App() {
  const [, setTick] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Subscribe to reactive store
  useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, []);

  const currentUser = store.getCurrentUser();
  const settings = store.getSettings();
  const banners = store.getBanners();
  const socialLinks = store.getSocialLinks();
  const projects = store.getProjects();
  const userWallet = currentUser ? store.getWallet(currentUser.id) : null;

  // Determine current page from URL path
  const pathname = window.location.pathname.toLowerCase();

  // Helper for active page id
  const getPageId = (): string => {
    if (pathname.includes('register')) return 'register';
    if (pathname.includes('login')) return 'login';
    if (pathname.includes('forgot-password')) return 'forgot-password';
    if (pathname.includes('wallet')) return 'wallet';
    if (pathname.includes('withdraw')) return 'withdraw';
    if (pathname.includes('add-money')) return 'add-money';
    if (pathname.includes('transactions')) return 'transactions';
    if (pathname.includes('micro-jobs')) return 'micro-jobs';
    if (pathname.includes('job-details')) return 'job-details';
    if (pathname.includes('submit-task')) return 'submit-task';
    if (pathname.includes('my-tasks')) return 'my-tasks';
    if (pathname.includes('mobile-recharge')) return 'mobile-recharge';
    if (pathname.includes('drive-offers')) return 'drive-offers';
    if (pathname.includes('typing-jobs')) return 'typing-jobs';
    if (pathname.includes('quiz')) return 'quiz';
    if (pathname.includes('gmail-marketing') || pathname.includes('gmail-sell')) return 'gmail-marketing';
    if (pathname.includes('gmail-history')) return 'gmail-history';
    if (pathname.includes('projects')) return 'projects';
    if (pathname.includes('bonus')) return 'bonus';
    if (pathname.includes('leaderboard')) return 'leaderboard';
    if (pathname.includes('profile')) return 'profile';
    if (pathname.includes('edit-profile')) return 'edit-profile';
    if (pathname.includes('verification')) return 'verification';
    if (pathname.includes('notifications')) return 'notifications';
    if (pathname.includes('announcements')) return 'announcements';
    if (pathname.includes('referral')) return 'referral';
    if (pathname.includes('network')) return 'network';
    if (pathname.includes('support')) return 'support';
    if (pathname.includes('settings')) return 'settings';
    if (pathname.includes('privacy-policy')) return 'privacy-policy';
    if (pathname.includes('terms')) return 'terms';
    if (pathname.includes('admin/login')) return 'admin-login';
    if (pathname.includes('admin')) return 'admin';
    return 'dashboard';
  };

  const pageId = getPageId();

  // Route: Admin Login
  if (pageId === 'admin-login') {
    return <AdminLoginPage />;
  }

  // Route: Admin Pages (all /admin/*.html)
  if (pathname.startsWith('/admin')) {
    return (
      <AdminDashboard
        onBackToApp={() => {
          window.location.href = '/dashboard.html';
        }}
        currentUser={currentUser}
      />
    );
  }

  // Standalone Auth Pages (No Header/Footer distraction)
  if (pageId === 'register') return <RegisterPage />;
  if (pageId === 'login') return <LoginPage />;
  if (pageId === 'forgot-password') return <ForgotPasswordPage />;

  // Render Inner Page View
  const renderPageContent = () => {
    switch (pageId) {
      case 'wallet':
        return <WalletPage />;
      case 'withdraw':
        return <WithdrawPage />;
      case 'add-money':
        return <AddMoneyPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'micro-jobs':
        return <MicroJobsPage />;
      case 'job-details':
        return <JobDetailsPage />;
      case 'submit-task':
        return <SubmitTaskPage />;
      case 'my-tasks':
        return <MyTasksPage />;
      case 'mobile-recharge':
        return <MobileRechargePage />;
      case 'drive-offers':
        return <DriveOffersPage />;
      case 'typing-jobs':
        return <TypingJobsPage />;
      case 'quiz':
        return <QuizPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'bonus':
        return <BonusPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'profile':
        return <ProfilePage />;
      case 'edit-profile':
        return <EditProfilePage />;
      case 'verification':
        return <VerificationPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'referral':
        return <ReferralPage />;
      case 'network':
        return <NetworkPage />;
      case 'support':
        return <SupportPage />;
      case 'settings':
        return <SettingsPage />;
      case 'privacy-policy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      case 'gmail-marketing':
        return <GmailMarketingPage />;
      case 'gmail-history':
        return <GmailHistoryPage />;
      case 'dashboard':
      default:
        // Main Dashboard / Landing Page
        return (
          <div className="space-y-4">
            {/* User Balance Strip */}
            {currentUser && (
              <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-lg">
                    <i className="fa-solid fa-wallet"></i>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">বর্তমান ওয়ালেট ব্যালেন্স</span>
                    <span className="text-lg font-extrabold text-blue-900 leading-tight">
                      ৳{(userWallet?.available_balance || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <a
                  href="/withdraw.html"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-money-bill-transfer text-xs"></i>
                  <span>উত্তোলন</span>
                </a>
              </div>
            )}

            {/* Banner Slider */}
            <BannerSlider banners={banners} onBannerClick={() => (window.location.href = '/micro-jobs.html')} />

            {/* Verification Card */}
            <VerificationCard
              user={currentUser}
              onOpenVerification={() => (window.location.href = '/verification.html')}
              onOpenAuth={() => (window.location.href = '/login.html')}
            />

            {/* 4 Direct Quick Shortcuts */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <a
                href="/bonus.html"
                className="p-2.5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all active:scale-95 flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-1 shadow-2xs">
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">দৈনিক বোনাস</span>
                <span className="text-[9px] text-emerald-600 font-extrabold">৫৳ ফ্রি</span>
              </a>

              <a
                href="/bonus.html"
                className="p-2.5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all active:scale-95 flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg mb-1 shadow-2xs">
                  <i className="fa-solid fa-dharmachakra"></i>
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">লাকি স্পিন</span>
                <span className="text-[9px] text-amber-600 font-extrabold">৫০৳ পর্যন্ত</span>
              </a>

              <a
                href="/bonus.html"
                className="p-2.5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all active:scale-95 flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center text-lg mb-1 shadow-2xs">
                  <i className="fa-solid fa-ticket"></i>
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">গিফট কোড</span>
                <span className="text-[9px] text-pink-600 font-extrabold">কোড রিডিম</span>
              </a>

              <a
                href="/referral.html"
                className="p-2.5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all active:scale-95 flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-1 shadow-2xs">
                  <i className="fa-solid fa-users-viewfinder"></i>
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">রেফার করুন</span>
                <span className="text-[9px] text-blue-600 font-extrabold">১০৳ + ১০%</span>
              </a>
            </div>

            {/* Social Grid */}
            <SocialGrid socialLinks={socialLinks} />

            {/* All 26 Earning Projects */}
            <EarningProjectGrid
              projects={projects}
              user={currentUser}
              onSelectProject={(project) => {
                let target = `/project-details.html?id=${project.id}`;
                if (project.modal_id === 'recharge') target = '/mobile-recharge.html';
                if (project.modal_id === 'drive_offers') target = '/drive-offers.html';
                if (project.modal_id === 'tasks') target = '/micro-jobs.html';
                if (project.modal_id === 'typing_jobs') target = '/typing-jobs.html';
                if (project.modal_id === 'quiz_jobs') target = '/quiz.html';
                if (project.modal_id === 'daily_bonus' || project.modal_id === 'spin_wheel' || project.modal_id === 'gift_code') target = '/bonus.html';
                if (project.modal_id === 'referral') target = '/referral.html';
                if (project.modal_id === 'leaderboard') target = '/leaderboard.html';
                if (project.modal_id === 'gmail_marketing' || project.id === 'p20') target = '/gmail-marketing.html';
                window.location.href = target;
              }}
              onRequireVerification={() => {
                window.location.href = '/verification.html';
              }}
            />

            {/* Live Cashout Notification Marquee */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-2.5 text-xs text-slate-600">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <i className="fa-solid fa-shield-check"></i>
              </span>
              <div className="truncate">
                <strong className="text-slate-800 font-bold">লাইভ ক্যাশআউট: </strong>
                <span>মোহাম্মদ রাশেদ বিকাশ নাম্বারে ৳১৬০ উইথড্র গ্রহণ করেছেন (TrxID: 9X7G2M4B1)</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#0f172a] pb-24 font-['Poppins','Hind_Siliguri',sans-serif]">
      {/* Reusable Header */}
      <Header
        user={currentUser}
        settings={settings}
        onOpenSidebar={() => setSidebarOpen(true)}
        currentPage={pageId}
      />

      {/* Main Container */}
      <main className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-3.5 sm:px-4 py-4">
        {renderPageContent()}
      </main>

      {/* Reusable Multi-Page Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={currentUser}
        settings={settings}
        currentPage={pageId}
        onLogout={() => {
          store.logout();
          setSidebarOpen(false);
          window.location.href = '/login.html';
        }}
      />

      {/* Reusable Bottom Navigation */}
      <BottomNav currentPage={pageId} />

      {/* Reusable Floating Support */}
      <FloatingSupport
        settings={settings}
        onOpenLiveChat={() => (window.location.href = '/support.html')}
      />

      {/* Reusable Footer */}
      <Footer settings={settings} />
    </div>
  );
}
