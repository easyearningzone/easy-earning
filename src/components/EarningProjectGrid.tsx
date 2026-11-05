import React, { useState } from 'react';
import { ProjectItem, UserProfile } from '../types/database';
import { ComingSoonModal } from './modals/ComingSoonModal';

interface EarningProjectGridProps {
  projects: ProjectItem[];
  user: UserProfile | null;
  onSelectProject: (project: ProjectItem) => void;
  onRequireVerification: () => void;
}

export const EarningProjectGrid: React.FC<EarningProjectGridProps> = ({
  projects,
  user,
  onSelectProject,
  onRequireVerification,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'bonus' | 'tasks' | 'services'>('all');
  const [comingSoonProject, setComingSoonProject] = useState<ProjectItem | null>(null);
  const [lockedProject, setLockedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = projects.filter((p) => {
    if (p.status !== 'active') return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'bonus') return ['bonus', 'gift', 'referral', 'rankings'].includes(p.category);
    if (activeFilter === 'tasks') return ['tasks', 'social', 'ads', 'marketing', 'work', 'entertainment'].includes(p.category);
    if (activeFilter === 'services') return ['services', 'courses', 'design', 'video', 'recharge', 'telecom', 'ecommerce', 'employer'].includes(p.category);
    return true;
  });

  const isProjectLocked = (project: ProjectItem) => {
    if (user?.is_verified === 'verified') return false;
    // Referral and Leaderboard can be viewed, but all earning tasks & jobs are strictly locked
    const isEarningTask = !['referral', 'rankings'].includes(project.category) || project.requires_verification;
    return isEarningTask;
  };

  const handleProjectClick = (project: ProjectItem) => {
    if (project.is_coming_soon) {
      setComingSoonProject(project);
      return;
    }
    if (isProjectLocked(project)) {
      setLockedProject(project);
      return;
    }
    onSelectProject(project);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        {/* Header & Category Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              সকল আর্নিং প্রজেক্ট সমূহ
            </h2>
            <p className="text-xs text-slate-500">পছন্দের ক্যাটাগরি বেছে নিয়ে কাজ শুরু করুন</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'all'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              সবগুলো ({projects.filter((p) => p.status === 'active').length})
            </button>
            <button
              onClick={() => setActiveFilter('bonus')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'bonus'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🎁 বোনাস ও রিওয়ার্ড
            </button>
            <button
              onClick={() => setActiveFilter('tasks')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'tasks'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              💼 মাইক্রো টাস্ক
            </button>
            <button
              onClick={() => setActiveFilter('services')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'services'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🚀 সার্ভিস ও শপ
            </button>
          </div>
        </div>

        {/* 4-column responsive grid matching FIRST EARNING ZONE reference */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2.5 sm:gap-3.5">
          {filteredProjects.map((project) => {
            const isFeatured = ['p4', 'p13', 'p17', 'p19', 'p20', 'p21', 'p22'].includes(project.id);
            const isComingSoon = project.is_coming_soon;

            return (
              <button
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className={`flex flex-col items-center justify-between p-2.5 rounded-2xl transition-all duration-200 group active:scale-95 text-center relative border ${
                  isComingSoon
                    ? 'bg-slate-50/60 hover:bg-rose-50/40 border-slate-200/80 hover:border-rose-300'
                    : isFeatured
                    ? 'bg-gradient-to-b from-blue-50/50 to-indigo-50/30 border-blue-200/80 shadow-xs hover:border-blue-400 hover:shadow-md'
                    : 'bg-slate-50/80 hover:bg-white border-slate-200/70 hover:border-slate-300 shadow-2xs hover:shadow-sm'
                }`}
              >
                {/* Badge */}
                {isComingSoon ? (
                  <span className="absolute -top-1.5 -right-1 text-[8.5px] font-extrabold bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-1.5 py-0.2 rounded-full shadow-xs uppercase tracking-tight">
                    কামিং সুন
                  </span>
                ) : project.badge ? (
                  <span className="absolute -top-1.5 -right-1 text-[9px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white px-1.5 py-0.2 rounded-full shadow-xs">
                    {project.badge}
                  </span>
                ) : null}

                {/* Lock indicator if not verified */}
                {!isComingSoon && isProjectLocked(project) && (
                  <span className="absolute top-1 left-1 text-[9px] text-rose-700 bg-rose-100/90 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs border border-rose-200">
                    <i className="fa-solid fa-lock text-[8px]"></i>
                    <span className="text-[7.5px]">লকড</span>
                  </span>
                )}

                {/* Icon Container with subtle gradient / color */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg shadow-sm mb-1.5 transition-transform group-hover:scale-110 group-hover:-translate-y-0.5 ${
                    isComingSoon ? 'opacity-90 grayscale-20' : ''
                  }`}
                  style={{ backgroundColor: project.icon_color || '#2563eb' }}
                >
                  <i className={project.icon}></i>
                </div>

                {/* Titles */}
                <span
                  className={`text-xs font-bold line-clamp-1 leading-tight ${
                    isComingSoon
                      ? 'text-slate-700 group-hover:text-rose-700'
                      : 'text-slate-800 group-hover:text-blue-900'
                  }`}
                >
                  {project.title_bn}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1 leading-tight">
                  {isComingSoon ? 'শীঘ্রই চালু হচ্ছে' : project.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Verification Required Modal */}
      {lockedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-inner">
              <i className="fa-solid fa-lock"></i>
            </div>
            <div>
              <span className="text-[10px] font-extrabold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full uppercase">
                ১০০ টাকা ভেরিফিকেশন প্রয়োজন
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2">
                টাস্কটি বর্তমানে লক করা আছে!
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                <strong>{lockedProject.title_bn}</strong> সহ যেকোনো টাস্ক বা প্রজেক্ট ওপেন করার জন্য প্রথমে ১০০ টাকা ফি প্রদান করে একাউন্ট ভেরিফাই ও অ্যাক্টিভ করতে হবে।
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved text-amber-600"></i>
                ভেরিফিকেশন ফি: ১০০ টাকা
              </div>
              <p className="text-[11px] text-amber-800">
                বিকাশ, নগদ বা রকেটে ১০০ টাকা পাঠিয়ে TrxID সাবমিট করলেই এডমিন ভেরিফাই করে সকল কাজ খুলে দেবেন।
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href="/verification.html"
                className="w-full py-2.5 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-unlock"></i>
                <span>১০০ টাকা দিয়ে ভেরিফাই করুন 👉</span>
              </a>
              <button
                type="button"
                onClick={() => setLockedProject(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                পরে করব
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Interactive Modal */}
      <ComingSoonModal
        project={comingSoonProject}
        isOpen={!!comingSoonProject}
        onClose={() => setComingSoonProject(null)}
      />
    </>
  );
};
