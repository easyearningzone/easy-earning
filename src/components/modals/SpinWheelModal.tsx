import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../../types/database';
import { store } from '../../lib/store';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

const SEGMENTS = [
  { label: '৳৫', value: 5, color: '#2563eb' },
  { label: '৳০', value: 0, color: '#64748b' },
  { label: '৳১০', value: 10, color: '#10b981' },
  { label: '৳২', value: 2, color: '#f59e0b' },
  { label: '৳১৫', value: 15, color: '#8b5cf6' },
  { label: '৳০', value: 0, color: '#94a3b8' },
  { label: '৳২৫', value: 25, color: '#ec4899' },
  { label: '৳৫০', value: 50, color: '#008744' },
];

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (spinning) return;

    setSpinning(true);
    setResultMsg(null);

    // Pick random segment
    const prizeIndex = Math.floor(Math.random() * SEGMENTS.length);
    const chosenPrize = SEGMENTS[prizeIndex];

    const segmentAngle = 360 / SEGMENTS.length;
    // Calculate final angle (extra spins + target segment center)
    const extraSpins = 360 * 5;
    const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);
    const totalRotation = rotation + extraSpins + (targetAngle - (rotation % 360));

    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      store.claimSpinWin(user.id, chosenPrize.value);
      if (chosenPrize.value > 0) {
        setResultMsg(`🎉 অভিনন্দন! আপনি ৳${chosenPrize.value} জিতেছেন! ব্যালেন্সে যোগ হয়েছে।`);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        setResultMsg('পরের বার আবার চেষ্টা করুন!');
      }
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-blue-100 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 p-4 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h3 className="text-base font-bold flex items-center justify-center gap-2">
            <i className="fa-solid fa-dharmachakra animate-spin-slow"></i>
            লাকি স্পিন হুইল
          </h3>
          <p className="text-xs text-amber-100">হুইল ঘুরিয়ে জিতে নিন ৫০৳ পর্যন্ত ক্যাশ</p>
        </div>

        {/* Wheel Container */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-64 h-64 mb-4">
            {/* Pointer Pin at Top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-red-600 filter drop-shadow-md"></div>

            {/* Rotating Wheel */}
            <div
              className="w-full h-full rounded-full border-4 border-amber-400 shadow-xl overflow-hidden relative"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {SEGMENTS.map((seg, i) => {
                  const angle = 360 / SEGMENTS.length;
                  const startAngle = (i * angle * Math.PI) / 180;
                  const endAngle = (((i + 1) * angle) * Math.PI) / 180;
                  const x1 = 50 + 50 * Math.cos(startAngle);
                  const y1 = 50 + 50 * Math.sin(startAngle);
                  const x2 = 50 + 50 * Math.cos(endAngle);
                  const y2 = 50 + 50 * Math.sin(endAngle);
                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  // Text position
                  const midAngle = ((i + 0.5) * angle * Math.PI) / 180;
                  const textX = 50 + 32 * Math.cos(midAngle);
                  const textY = 50 + 32 * Math.sin(midAngle);

                  return (
                    <g key={i}>
                      <path d={pathData} fill={seg.color} stroke="#ffffff" strokeWidth="0.8" />
                      <text
                        x={textX}
                        y={textY}
                        fill="#ffffff"
                        fontSize="5.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${i * angle + angle / 2 + 90}, ${textX}, ${textY})`}
                      >
                        {seg.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Center Hub */}
              <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-amber-400 text-amber-500 font-extrabold text-xs">
                ★
              </div>
            </div>
          </div>

          {/* Result message */}
          {resultMsg && (
            <div className="text-xs font-bold text-center mb-3 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              {resultMsg}
            </div>
          )}

          {/* Spin Trigger Button */}
          <button
            onClick={handleSpin}
            disabled={spinning}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
              spinning
                ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:brightness-110 text-white shadow-orange-300/50'
            }`}
          >
            {spinning ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>স্পিন ঘুরছে...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-play"></i>
                <span>স্পিন করুন (ফ্রি)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
