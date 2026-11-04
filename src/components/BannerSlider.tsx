import React, { useState, useEffect, useRef } from 'react';
import { Banner } from '../types/database';

interface BannerSliderProps {
  banners: Banner[];
  onBannerClick?: (banner: Banner) => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ banners, onBannerClick }) => {
  const activeBanners = banners.filter((b) => b.status === 'active');
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // swipe left -> next
        setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
      } else {
        // swipe right -> prev
        setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
      }
    }
    touchStartX.current = null;
  };

  const currentBanner = activeBanners[currentIndex];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-slate-900 border border-slate-200">
      <div
        className="relative h-44 sm:h-52 w-full cursor-pointer select-none group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => onBannerClick?.(currentBanner)}
      >
        <img
          src={currentBanner.image_url}
          alt={currentBanner.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4 sm:p-5">
          {currentBanner.badge && (
            <span className="self-start text-[11px] font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full mb-1.5 shadow-sm uppercase tracking-wide">
              {currentBanner.badge}
            </span>
          )}
          <h2 className="text-white text-base sm:text-lg font-bold line-clamp-2 leading-snug drop-shadow-md">
            {currentBanner.title}
          </h2>
        </div>

        {/* Arrow controls for desktop */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous"
            >
              <i className="fa-solid fa-chevron-left text-xs"></i>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next"
            >
              <i className="fa-solid fa-chevron-right text-xs"></i>
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-2 right-4 flex items-center gap-1.5 z-10">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? 'w-6 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
