import React, { useState } from 'react';
import type { Fraction, ShapeType } from '../../types/fractions';
import { simplifyFraction, isEquivalent, describePieSlice } from '../../utils/fractionsMath';
import { sound } from '../../utils/audioSynth';
import { X, Sparkles, Layers, CheckCircle2 } from 'lucide-react';

interface OverlayModalProps {
  fractionA: Fraction;
  fractionB: Fraction;
  shapeA: ShapeType;
  shapeB: ShapeType;
  onClose: () => void;
  lang?: 'id' | 'en';
}

export const OverlayModal: React.FC<OverlayModalProps> = ({
  fractionA,
  fractionB,
  onClose,
  lang = 'id',
}) => {
  const [opacityA] = useState(0.7);
  const [opacityB] = useState(0.7);

  const equivalent = isEquivalent(fractionA, fractionB);
  const simpA = simplifyFraction(fractionA);
  const simpB = simplifyFraction(fractionB);

  const handleClose = () => {
    sound.playPop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in select-none">
      <div className="relative w-full max-w-xl bg-[#fff9ed] rounded-[36px] border-4 border-[#ebd5b3] shadow-[0_16px_0_0_#d9bc8c] p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#ebd5b3] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-[#ce82ff] rounded-2xl text-white shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-fun text-[#451a03] m-0">
                {lang === 'id' ? '🔍 Kaca Tumpuk Ajaib (X-Ray)' : '🔍 Magic X-Ray Overlay'}
              </h3>
              <p className="text-xs font-bold text-slate-500 m-0">
                {lang === 'id' ? 'Buktikan kesetaraan luas pecahan secara visual!' : 'Visually verify equivalent areas!'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="btn-3d btn-3d-white p-2 rounded-2xl"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Status result */}
        <div className="mb-4">
          {equivalent ? (
            <div className="bg-[#f0fdf4] border-3 border-[#86efac] rounded-2xl p-3.5 flex items-center gap-2.5 text-[#166534] font-black font-fun text-sm shadow-sm">
              <Sparkles className="w-6 h-6 text-[#58cc02] flex-shrink-0 animate-spin" />
              <span>
                {lang === 'id'
                  ? `TERBUKTI SENILAI! Luas ${fractionA.numerator}/${fractionA.denominator} dan ${fractionB.numerator}/${fractionB.denominator} sama persis!`
                  : `PROVEN EQUIVALENT! Areas of ${fractionA.numerator}/${fractionA.denominator} and ${fractionB.numerator}/${fractionB.denominator} match completely!`}
              </span>
            </div>
          ) : (
            <div className="bg-[#fff1f2] border-3 border-[#fca5a5] rounded-2xl p-3.5 flex items-center gap-2.5 text-[#991b1b] font-black font-fun text-sm shadow-sm">
              <span>
                {lang === 'id'
                  ? `Pecahan ${fractionA.numerator}/${fractionA.denominator} dan ${fractionB.numerator}/${fractionB.denominator} belum sama luasnya.`
                  : `Fractions have different areas.`}
              </span>
            </div>
          )}
        </div>

        {/* Stacked Pizza Display */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-3xl border-3 border-[#ebd5b3] mb-5 shadow-inner">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
              <circle cx="100" cy="100" r="95" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
              <circle cx="100" cy="100" r="84" fill="#ffffff" />

              {/* Layer A (Gold/Amber) */}
              <g opacity={opacityA}>
                {Array.from({ length: fractionA.denominator }).map((_, i) => {
                  const sliceA = 360 / fractionA.denominator;
                  const isFilled = i < fractionA.numerator;
                  const path = describePieSlice(100, 100, 84, i * sliceA, (i + 1) * sliceA);
                  return (
                    <path
                      key={`a-${i}`}
                      d={path}
                      fill={isFilled ? '#ffc800' : 'none'}
                      stroke="#d97706"
                      strokeWidth="2.5"
                    />
                  );
                })}
              </g>

              {/* Layer B (Cyan / Sky) */}
              <g opacity={opacityB}>
                {Array.from({ length: fractionB.denominator }).map((_, i) => {
                  const sliceB = 360 / fractionB.denominator;
                  const isFilled = i < fractionB.numerator;
                  const path = describePieSlice(100, 100, 84, i * sliceB, (i + 1) * sliceB);
                  return (
                    <path
                      key={`b-${i}`}
                      d={path}
                      fill={isFilled ? '#1cb0f6' : 'none'}
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      strokeDasharray={isFilled ? undefined : '4 3'}
                    />
                  );
                })}
              </g>

              <circle cx="100" cy="100" r="5" fill="#78350f" />
            </svg>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs font-black font-fun">
            <span className="flex items-center gap-1.5 text-[#b45309]">
              <span className="w-4 h-4 rounded-full bg-[#ffc800] border-2 border-[#b45309] inline-block" />
              Pecahan Kiri: {fractionA.numerator}/{fractionA.denominator}
            </span>
            <span className="flex items-center gap-1.5 text-[#0369a1]">
              <span className="w-4 h-4 rounded-full bg-[#1cb0f6] border-2 border-[#0284c7] inline-block" />
              Pecahan Kanan: {fractionB.numerator}/{fractionB.denominator}
            </span>
          </div>
        </div>

        {/* Math Explanation Box */}
        <div className="bg-[#fff5df] border-2 border-[#ebd5b3] rounded-2xl p-4 mb-4">
          <h4 className="text-xs font-black font-fun text-[#b45309] uppercase tracking-wider mb-1.5">
            {lang === 'id' ? '💡 Rahasia Matematika Pecahan Senilai:' : '💡 Fraction Breakdown:'}
          </h4>
          <div className="text-xs sm:text-sm font-bold text-slate-700 space-y-1">
            <p className="m-0">
              • Bentuk paling sederhana dari <strong>{fractionA.numerator}/{fractionA.denominator}</strong> adalah <span className="bg-[#fef08a] px-2 py-0.5 rounded-lg font-black text-[#713f12]">{simpA.numerator}/{simpA.denominator}</span>
            </p>
            <p className="m-0">
              • Bentuk paling sederhana dari <strong>{fractionB.numerator}/{fractionB.denominator}</strong> adalah <span className="bg-[#e0f2fe] px-2 py-0.5 rounded-lg font-black text-[#0369a1]">{simpB.numerator}/{simpB.denominator}</span>
            </p>
            {equivalent && (
              <p className="text-[#16a34a] font-black mt-1.5 m-0 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Keduanya memiliki bentuk sederhana yang sama ({simpA.numerator}/{simpA.denominator}), terbukti SENILAI!
              </p>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="btn-3d btn-3d-yellow w-full py-3.5 font-black font-fun text-base rounded-2xl shadow-md"
        >
          {lang === 'id' ? 'SAYA MENGERTI! TUTUP' : 'GOT IT! CLOSE'}
        </button>
      </div>
    </div>
  );
};
