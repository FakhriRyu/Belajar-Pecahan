import React, { useEffect } from 'react';
import type { Fraction, ComparisonResult } from '../../types/fractions';
import { compareFractions } from '../../utils/fractionsMath';
import { sound } from '../../utils/audioSynth';
import { Sparkles, Equal, ChevronLeft, ChevronRight } from 'lucide-react';

interface BalanceScaleProps {
  fractionA: Fraction;
  fractionB: Fraction;
  renderLeftVisual: React.ReactNode;
  renderRightVisual: React.ReactNode;
  lang?: 'id' | 'en';
}

export const BalanceScale: React.FC<BalanceScaleProps> = ({
  fractionA,
  fractionB,
  renderLeftVisual,
  renderRightVisual,
  lang = 'id',
}) => {
  const comparison: ComparisonResult = compareFractions(fractionA, fractionB);

  // Tilt angle
  let tiltAngle = 0;
  if (comparison === 'greater') tiltAngle = -8;
  if (comparison === 'less') tiltAngle = 8;

  useEffect(() => {
    if (comparison === 'equal') {
      sound.playBalance();
    }
  }, [fractionA.numerator, fractionA.denominator, fractionB.numerator, fractionB.denominator, comparison]);

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none py-1 overflow-hidden sm:overflow-visible">
      {/* Equality Status Banner */}
      <div className="mb-2 sm:mb-3 w-full flex justify-center">
        {comparison === 'equal' ? (
          <div className="animate-bounce-slight flex items-center justify-center gap-1.5 sm:gap-2 bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black font-fun px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full shadow-lg text-center max-w-full">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-spin flex-shrink-0" />
            <span className="text-xs sm:text-base tracking-wide">
              {lang === 'id' ? '✨ HORE! PECAHAN SENILAI! (SEIMBANG) ✨' : '✨ HOORAY! EQUAL FRACTIONS! ✨'}
            </span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-spin flex-shrink-0" />
          </div>
        ) : comparison === 'greater' ? (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#fee2e2] text-[#991b1b] border-2 border-[#fca5a5] font-black font-fun px-3 sm:px-5 py-1 sm:py-1.5 rounded-full shadow-sm text-xs sm:text-sm text-center">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff4b4b] animate-pulse stroke-[3] flex-shrink-0" />
            <span>{lang === 'id' ? 'Sisi Kiri Lebih Berat (>)' : 'Left Side is Greater (>)'}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#e0f2fe] text-[#0369a1] border-2 border-[#7dd3fc] font-black font-fun px-3 sm:px-5 py-1 sm:py-1.5 rounded-full shadow-sm text-xs sm:text-sm text-center">
            <span>{lang === 'id' ? 'Sisi Kanan Lebih Berat (<)' : 'Right Side is Greater (<)'}</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#1cb0f6] animate-pulse stroke-[3] flex-shrink-0" />
          </div>
        )}
      </div>

      {/* Toy Wooden Balance Scale Rig with Responsive Scaling */}
      <div className="w-full flex justify-center py-1">
        <div className="relative w-[520px] h-[300px] flex items-end justify-center transform origin-top scale-[0.58] min-[360px]:scale-[0.66] min-[400px]:scale-[0.76] sm:scale-[0.88] md:scale-100 transition-transform -mb-28 min-[360px]:-mb-24 min-[400px]:-mb-16 sm:-mb-8 md:mb-0">
          {/* Central Stand / Fulcrum */}
          <div className="absolute bottom-0 z-10 flex flex-col items-center">
            {/* Top Pivot Pin */}
            <div className="w-9 h-9 rounded-full bg-[#ffc800] border-4 border-[#78350f] shadow-md flex items-center justify-center -mb-2 z-20">
              <div className="w-3 h-3 rounded-full bg-[#451a03]" />
            </div>
            {/* Carved Wooden Pillar */}
            <div className="w-8 h-36 bg-[#b45309] border-x-4 border-[#78350f] rounded-t-lg shadow-inner flex flex-col items-center justify-around py-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffc800] border border-[#78350f]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffc800] border border-[#78350f]" />
            </div>
            {/* Heavy Base Foot */}
            <div className="w-38 h-8 bg-[#78350f] border-4 border-[#451a03] rounded-2xl shadow-xl flex items-center justify-center">
              <span className="text-[10px] font-black tracking-widest text-[#fef08a] uppercase font-fun">
                {comparison === 'equal' ? '✨ SEIMBANG ✨' : 'TIMBANGAN'}
              </span>
            </div>
          </div>

          {/* Rotating Cross Beam with Pans */}
          <div
            className="absolute top-[76px] w-full flex items-center justify-center transition-transform duration-500 ease-out"
            style={{ transform: `rotate(${tiltAngle}deg)` }}
          >
            {/* Wooden Beam Bar */}
            <div className="w-[88%] h-6 bg-[#d97706] border-4 border-[#78350f] rounded-full shadow-md flex items-center justify-between px-3">
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffc800] border border-[#78350f]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffc800] border border-[#78350f]" />
            </div>

            {/* Left Pan Assembly */}
            <div
              className="absolute left-[6%] top-[12px] flex flex-col items-center transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${-tiltAngle}deg)` }}
            >
              <svg width="140" height="38" className="overflow-visible">
                <line x1="70" y1="0" x2="12" y2="38" stroke="#78350f" strokeWidth="3" />
                <line x1="70" y1="0" x2="128" y2="38" stroke="#78350f" strokeWidth="3" />
              </svg>
              <div className="flex flex-col items-center -mt-1">
                <div className="min-w-[120px] min-h-[85px] flex items-center justify-center p-1.5">
                  {renderLeftVisual}
                </div>
                {/* Wooden Dish Pan */}
                <div className="w-36 h-6 bg-[#ffc800] border-3 border-[#78350f] rounded-full shadow-md" />
              </div>
            </div>

            {/* Right Pan Assembly */}
            <div
              className="absolute right-[6%] top-[12px] flex flex-col items-center transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${-tiltAngle}deg)` }}
            >
              <svg width="140" height="38" className="overflow-visible">
                <line x1="70" y1="0" x2="12" y2="38" stroke="#78350f" strokeWidth="3" />
                <line x1="70" y1="0" x2="128" y2="38" stroke="#78350f" strokeWidth="3" />
              </svg>
              <div className="flex flex-col items-center -mt-1">
                <div className="min-w-[120px] min-h-[85px] flex items-center justify-center p-1.5">
                  {renderRightVisual}
                </div>
                {/* Wooden Dish Pan */}
                <div className="w-36 h-6 bg-[#ffc800] border-3 border-[#78350f] rounded-full shadow-md" />
              </div>
            </div>
          </div>

          {/* Center Indicator */}
          <div className="absolute top-[64px] z-30 pointer-events-none">
            {comparison === 'equal' && (
              <div className="w-12 h-12 rounded-full bg-[#58cc02] border-4 border-white shadow-xl flex items-center justify-center text-white font-black animate-bounce-slight">
                <Equal className="w-7 h-7 stroke-[4]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
