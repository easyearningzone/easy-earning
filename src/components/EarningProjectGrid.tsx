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

  const filteredProjects = projects.filter((p) => {
    if (p.status !== 'active') return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'bonus') return ['bonus', 'gift', 'referral', 'rankings'].includes(p.category);
    if (activeFilter === 'tasks') return ['tasks', 'social', 'ads', 'marketing', 'work', 'entertainment'].includes(p.category);
    if (activeFilter === 'services') return ['services', 'courses', 'design', 'video', 'recharge', 'telecom', 'ecommerce', 'employer'].includes(p.category);
    return true;
  });

  const handleProjectClick = (project: ProjectItem) => {
    if (project.is_coming_soon) {
      setComingSoonProject(project);
      return;
    }
    if (project.requires_verification && user?.is_verified !== 'verified') {
      onRequireVerification();
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

                {/* Requires verification lock indicator */}
                {!isComingSoon && project.requires_verification && user?.is_verified !== 'verified' && (
                  <span className="absolute top-1 left-1 text-[9px] text-amber-700 bg-amber-100 px-1 rounded flex items-center gap-0.5">
                    <i className="fa-solid fa-lock text-[8px]"></i>
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

      {/* Coming Soon Interactive Modal */}
      <ComingSoonModal
        project={comingSoonProject}
        isOpen={!!comingSoonProject}
        onClose={() => setComingSoonProject(null)}
      />
    </>
  );
};
