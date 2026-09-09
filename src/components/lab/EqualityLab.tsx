import React, { useState, useEffect } from 'react';
import type { Fraction, ShapeType } from '../../types/fractions';
import { FractionController } from './FractionController';
import { BalanceScale } from '../visuals/BalanceScale';
import { OverlayModal } from './OverlayModal';
import { MascotBubble } from '../common/MascotBubble';
import { FractionPizza } from '../visuals/FractionPizza';
import { FractionBar } from '../visuals/FractionBar';
import { FractionBeaker } from '../visuals/FractionBeaker';
import { FractionNumberLine } from '../visuals/FractionNumberLine';
import { isEquivalent, simplifyFraction } from '../../utils/fractionsMath';
import { sound } from '../../utils/audioSynth';
import { Layers, Wand2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EqualityLabProps {
  onDiscoverEquality: () => void;
  lang?: 'id' | 'en';
}

export const EqualityLab: React.FC<EqualityLabProps> = ({
  onDiscoverEquality,
  lang = 'id',
}) => {
  const [fractionA, setFractionA] = useState<Fraction>({ numerator: 1, denominator: 2 });
  const [shapeA, setShapeA] = useState<ShapeType>('pizza');

  const [fractionB, setFractionB] = useState<Fraction>({ numerator: 2, denominator: 4 });
  const [shapeB, setShapeB] = useState<ShapeType>('chocolate');

  const [showOverlay, setShowOverlay] = useState(false);
  const [lastCelebratedKey, setLastCelebratedKey] = useState<string>('');

  const isEq = isEquivalent(fractionA, fractionB);
  const eqKey = `${fractionA.numerator}/${fractionA.denominator}==${fractionB.numerator}/${fractionB.denominator}`;

  useEffect(() => {
    if (isEq && fractionA.denominator > 0 && fractionB.denominator > 0 && eqKey !== lastCelebratedKey) {
      setLastCelebratedKey(eqKey);
      onDiscoverEquality();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffc800', '#58cc02', '#1cb0f6', '#ff4b4b'],
      });
    }
  }, [isEq, eqKey, lastCelebratedKey, fractionA, fractionB, onDiscoverEquality]);

  const renderVisual = (f: Fraction, s: ShapeType, highlight: boolean) => {
    switch (s) {
      case 'pizza':
        return <FractionPizza numerator={f.numerator} denominator={f.denominator} size={90} highlightEqual={highlight} />;
      case 'chocolate':
        return <FractionBar numerator={f.numerator} denominator={f.denominator} width={100} height={36} highlightEqual={highlight} />;
      case 'beaker':
        return <FractionBeaker numerator={f.numerator} denominator={f.denominator} width={70} height={90} highlightEqual={highlight} />;
      case 'numberline':
        return <FractionNumberLine numerator={f.numerator} denominator={f.denominator} width={120} height={46} highlightEqual={highlight} />;
    }
  };

  const applyPreset = (numA: number, denA: number, numB: number, denB: number) => {
    sound.playPop(520);
    setFractionA({ numerator: numA, denominator: denA });
    setFractionB({ numerator: numB, denominator: denB });
  };

  const resetDefault = () => {
    sound.playPop(380);
    setFractionA({ numerator: 1, denominator: 2 });
    setFractionB({ numerator: 2, denominator: 4 });
    setShapeA('pizza');
    setShapeB('chocolate');
  };

  const simpA = simplifyFraction(fractionA);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 sm:gap-4 py-1 sm:py-2 px-1 sm:px-4 select-none">
      {/* Mascot Speech Bubble */}
      <MascotBubble
        message={
          isEq
            ? lang === 'id'
              ? `Luar biasa! ${fractionA.numerator}/${fractionA.denominator} dan ${fractionB.numerator}/${fractionB.denominator} bernilai sama (${simpA.numerator}/${simpA.denominator}). Timbangan seimbang sempurna!`
              : `Awesome! ${fractionA.numerator}/${fractionA.denominator} and ${fractionB.numerator}/${fractionB.denominator} are equivalent (${simpA.numerator}/${simpA.denominator}). The scale is balanced!`
            : lang === 'id'
              ? 'Ubah pembilang atau penyebut di kiri dan kanan sampai timbangan menjadi seimbang ya!'
              : 'Adjust numerators or denominators on both sides until the scale balances!'
        }
        mood={isEq ? 'celebrating' : 'teaching'}
        lang={lang}
      />

      {/* Toy Wooden Balance Scale Card */}
      <div className="bg-[#fff9ed] border-4 border-[#ebd5b3] rounded-[28px] sm:rounded-[36px] p-3.5 sm:p-6 shadow-[0_8px_0_0_#d9bc8c] sm:shadow-[0_10px_0_0_#d9bc8c]">
        {/* Scale Card Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ffc800] border-2 border-[#b45309] flex items-center justify-center text-sm sm:text-base shadow-sm">
              ⚖️
            </div>
            <h2 className="text-sm sm:text-lg font-black font-fun text-[#451a03] m-0">
              {lang === 'id' ? 'Timbangan Pecahan' : 'Fraction Scale'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* X-Ray Magic Lens Button */}
            <button
              onClick={() => {
                sound.playPop();
                setShowOverlay(true);
              }}
              className="btn-3d btn-3d-purple px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-black font-fun flex items-center gap-1 sm:gap-1.5 shadow-sm"
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{lang === 'id' ? 'Kaca X-Ray' : 'X-Ray'}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={resetDefault}
              title="Reset Semula"
              className="btn-3d btn-3d-white p-1.5 sm:p-2 rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* The Balance Scale Component */}
        <BalanceScale
          fractionA={fractionA}
          fractionB={fractionB}
          renderLeftVisual={renderVisual(fractionA, shapeA, isEq)}
          renderRightVisual={renderVisual(fractionB, shapeB, isEq)}
          lang={lang}
        />

        {/* Quick Example Presets */}
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t-2 border-[#ebd5b3] flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-black font-fun">
          <span className="text-[#b45309] flex items-center gap-1 w-full sm:w-auto justify-center text-center">
            <Wand2 className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Contoh Senilai:' : 'Try Examples:'}</span>
          </span>
          <button
            onClick={() => applyPreset(1, 2, 2, 4)}
            className="btn-3d btn-3d-white px-2.5 py-1 rounded-xl text-[11px] sm:text-xs"
          >
            1/2 = 2/4
          </button>
          <button
            onClick={() => applyPreset(1, 3, 2, 6)}
            className="btn-3d btn-3d-white px-2.5 py-1 rounded-xl text-[11px] sm:text-xs"
          >
            1/3 = 2/6
          </button>
          <button
            onClick={() => applyPreset(2, 3, 4, 6)}
            className="btn-3d btn-3d-white px-2.5 py-1 rounded-xl text-[11px] sm:text-xs"
          >
            2/3 = 4/6
          </button>
          <button
            onClick={() => applyPreset(3, 4, 6, 8)}
            className="btn-3d btn-3d-white px-2.5 py-1 rounded-xl text-[11px] sm:text-xs"
          >
            3/4 = 6/8
          </button>
          <button
            onClick={() => applyPreset(2, 5, 4, 10)}
            className="btn-3d btn-3d-white px-2.5 py-1 rounded-xl text-[11px] sm:text-xs"
          >
            2/5 = 4/10
          </button>
        </div>
      </div>

      {/* Two Fraction Controllers Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FractionController
          label={lang === 'id' ? 'Pecahan Kiri (A)' : 'Left Fraction (A)'}
          fraction={fractionA}
          onChange={setFractionA}
          shape={shapeA}
          onShapeChange={setShapeA}
          themeColor="amber"
          lang={lang}
        />

        <FractionController
          label={lang === 'id' ? 'Pecahan Kanan (B)' : 'Right Fraction (B)'}
          fraction={fractionB}
          onChange={setFractionB}
          shape={shapeB}
          onShapeChange={setShapeB}
          themeColor="sky"
          lang={lang}
        />
      </div>

      {/* X-Ray Modal Dialog */}
      {showOverlay && (
        <OverlayModal
          fractionA={fractionA}
          fractionB={fractionB}
          shapeA={shapeA}
          shapeB={shapeB}
          onClose={() => setShowOverlay(false)}
          lang={lang}
        />
      )}
    </div>
  );
};
