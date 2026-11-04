import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, showBackButton = true }) => {
  return (
    <div className="flex items-center justify-between text-xs text-slate-500 mb-3 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-2xs">
      <div className="flex items-center gap-1.5 flex-wrap">
        <a href="/dashboard.html" className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1">
          <i className="fa-solid fa-house text-[10px]"></i>
          <span>হোম</span>
        </a>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <span className="text-slate-300">/</span>
              {isLast || !item.href ? (
                <span className="text-slate-800 font-semibold">{item.label}</span>
              ) : (
                <a href={item.href} className="text-blue-600 hover:text-blue-800 font-medium">
                  {item.label}
                </a>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {showBackButton && (
        <button
          onClick={() => window.history.back()}
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all font-semibold"
        >
          <i className="fa-solid fa-arrow-left text-[10px]"></i>
          <span>পেছনে</span>
        </button>
      )}
    </div>
  );
};
