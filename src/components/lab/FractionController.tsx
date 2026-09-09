import React from 'react';
import type { Fraction, ShapeType } from '../../types/fractions';
import { FractionPizza } from '../visuals/FractionPizza';
import { FractionBar } from '../visuals/FractionBar';
import { FractionBeaker } from '../visuals/FractionBeaker';
import { FractionNumberLine } from '../visuals/FractionNumberLine';
import { sound } from '../../utils/audioSynth';
import { Plus, Minus, Pizza, Box, GlassWater, Milestone } from 'lucide-react';

interface FractionControllerProps {
  label: string;
  fraction: Fraction;
  onChange: (fraction: Fraction) => void;
  shape: ShapeType;
  onShapeChange: (shape: ShapeType) => void;
  themeColor?: 'amber' | 'sky';
  lang?: 'id' | 'en';
}

export const FractionController: React.FC<FractionControllerProps> = ({
  label,
  fraction,
  onChange,
  shape,
  onShapeChange,
  themeColor = 'amber',
  lang = 'id',
}) => {
  const { numerator, denominator } = fraction;

  const setNumerator = (newNum: number) => {
    const safe = Math.max(0, Math.min(denominator, newNum));
    sound.playPop(420 + safe * 40);
    onChange({ numerator: safe, denominator });
  };

  const setDenominator = (newDenom: number) => {
    const safe = Math.max(1, Math.min(12, newDenom));
    const safeNum = Math.min(numerator, safe);
    sound.playPop(370 + safe * 30);
    onChange({ numerator: safeNum, denominator: safe });
  };

  const handleShapeSelect = (s: ShapeType) => {
    sound.playPop(520);
    onShapeChange(s);
  };

  const isAmber = themeColor === 'amber';
  const headerBg = isAmber ? 'bg-[#ffc800] text-[#533800] border-[#e5a400]' : 'bg-[#1cb0f6] text-white border-[#0284c7]';
  const badgeNumBg = isAmber ? 'bg-[#fef08a] text-[#713f12] border-[#ca8a04]' : 'bg-[#e0f2fe] text-[#0369a1] border-[#38bdf8]';

  return (
    <div className="flex-1 flex flex-col items-center p-3.5 sm:p-5 rounded-[28px] sm:rounded-[32px] bg-[#fff9ed] border-4 border-[#ebd5b3] shadow-[0_6px_0_0_#d9bc8c] sm:shadow-[0_8px_0_0_#d9bc8c] select-none w-full">
      {/* Title Header Badge */}
      <div className={`px-4 sm:px-5 py-1 sm:py-1.5 rounded-full font-black font-fun text-[11px] sm:text-xs uppercase tracking-wider mb-2.5 sm:mb-3 border-b-4 shadow-sm ${headerBg}`}>
        {label}
      </div>

      {/* Shape Selector Bar */}
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 p-1 bg-white rounded-2xl border-2 border-[#ebd5b3] mb-3 sm:mb-4 w-full max-w-sm">
        <button
          onClick={() => handleShapeSelect('pizza')}
          title="Pizza Lingkaran"
          className={`btn-3d flex-1 py-1.5 px-1 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-black font-fun flex items-center justify-center gap-1 ${
            shape === 'pizza'
              ? isAmber ? 'btn-3d-yellow' : 'btn-3d-blue'
              : 'bg-transparent border-transparent hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Pizza className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="hidden min-[360px]:inline">Pizza</span>
        </button>

        <button
          onClick={() => handleShapeSelect('chocolate')}
          title="Cokelat Balok"
          className={`btn-3d flex-1 py-1.5 px-1 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-black font-fun flex items-center justify-center gap-1 ${
            shape === 'chocolate'
              ? isAmber ? 'btn-3d-yellow' : 'btn-3d-blue'
              : 'bg-transparent border-transparent hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="hidden min-[360px]:inline">{lang === 'id' ? 'Balok' : 'Bar'}</span>
        </button>

        <button
          onClick={() => handleShapeSelect('beaker')}
          title="Gelas Jus"
          className={`btn-3d flex-1 py-1.5 px-1 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-black font-fun flex items-center justify-center gap-1 ${
            shape === 'beaker'
              ? isAmber ? 'btn-3d-yellow' : 'btn-3d-blue'
              : 'bg-transparent border-transparent hover:bg-slate-100 text-slate-600'
          }`}
        >
          <GlassWater className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="hidden min-[360px]:inline">{lang === 'id' ? 'Gelas' : 'Glass'}</span>
        </button>

        <button
          onClick={() => handleShapeSelect('numberline')}
          title="Garis Bilangan"
          className={`btn-3d flex-1 py-1.5 px-1 sm:px-2.5 rounded-xl text-[11px] sm:text-xs font-black font-fun flex items-center justify-center gap-1 ${
            shape === 'numberline'
              ? isAmber ? 'btn-3d-yellow' : 'btn-3d-blue'
              : 'bg-transparent border-transparent hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Milestone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="hidden min-[360px]:inline">{lang === 'id' ? 'Garis' : 'Line'}</span>
        </button>
      </div>

      {/* Main Interactive Visualizer */}
      <div className="w-full h-38 sm:h-48 flex items-center justify-center bg-white rounded-2xl border-3 border-[#ebd5b3] p-2 mb-3 sm:mb-4 shadow-inner overflow-hidden">
        {shape === 'pizza' && (
          <FractionPizza
            numerator={numerator}
            denominator={denominator}
            size={145}
            interactive={true}
            onSliceClick={(idx) => {
              setNumerator(idx + 1 === numerator ? idx : idx + 1);
            }}
          />
        )}
        {shape === 'chocolate' && (
          <FractionBar
            numerator={numerator}
            denominator={denominator}
            width={160}
            height={48}
            interactive={true}
            onSegmentClick={(idx) => {
              setNumerator(idx + 1 === numerator ? idx : idx + 1);
            }}
          />
        )}
        {shape === 'beaker' && (
          <FractionBeaker
            numerator={numerator}
            denominator={denominator}
            width={95}
            height={130}
            interactive={true}
            onLevelClick={(lvl) => setNumerator(lvl)}
          />
        )}
        {shape === 'numberline' && (
          <FractionNumberLine
            numerator={numerator}
            denominator={denominator}
            width={210}
            height={75}
            interactive={true}
            onPointClick={(pt) => setNumerator(pt)}
          />
        )}
      </div>

      {/* Chunky 3D Stepper Controls */}
      <div className="w-full grid grid-cols-2 gap-2 sm:gap-3">
        {/* Numerator */}
        <div className="flex flex-col items-center bg-white p-2 sm:p-3 rounded-2xl border-2 border-[#ebd5b3] shadow-sm">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight mb-1 font-fun text-center">
            {lang === 'id' ? 'Pembilang' : 'Numerator'}
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setNumerator(numerator - 1)}
              disabled={numerator <= 0}
              className="btn-3d btn-3d-white w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-black flex items-center justify-center"
            >
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
            </button>
            <span className={`text-base sm:text-xl font-fun font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-xl border-2 ${badgeNumBg}`}>
              {numerator}
            </span>
            <button
              onClick={() => setNumerator(numerator + 1)}
              disabled={numerator >= denominator}
              className="btn-3d btn-3d-white w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-black flex items-center justify-center"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Denominator */}
        <div className="flex flex-col items-center bg-white p-2 sm:p-3 rounded-2xl border-2 border-[#ebd5b3] shadow-sm">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight mb-1 font-fun text-center">
            {lang === 'id' ? 'Penyebut' : 'Denominator'}
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setDenominator(denominator - 1)}
              disabled={denominator <= 1}
              className="btn-3d btn-3d-white w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-black flex items-center justify-center"
            >
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
            </button>
            <span className={`text-base sm:text-xl font-fun font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-xl border-2 ${badgeNumBg}`}>
              {denominator}
            </span>
            <button
              onClick={() => setDenominator(denominator + 1)}
              disabled={denominator >= 12}
              className="btn-3d btn-3d-white w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-black flex items-center justify-center"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>

      {/* Fraction Value Badge */}
      <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 sm:gap-2 font-black font-fun text-xs sm:text-sm text-[#451a03]">
        <span>{lang === 'id' ? 'Nilai:' : 'Value:'}</span>
        <div className="inline-flex flex-col items-center text-base sm:text-lg leading-tight text-[#b45309]">
          <span>{numerator}</span>
          <div className="w-full h-0.5 bg-[#b45309]" />
          <span>{denominator}</span>
        </div>
        <span className="text-[11px] sm:text-xs text-slate-400 font-sans">
          (= {(numerator / denominator).toFixed(2)})
        </span>
      </div>
    </div>
  );
};
