import React, { useEffect } from 'react';
import { sound } from '../../utils/audioSynth';
import { Star, RotateCcw, ArrowRight, Map } from 'lucide-react';
import confetti from 'canvas-confetti';


interface VictoryModalProps {
  levelId: number;
  starsEarned: number;
  coinsEarned: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
  hasNextLevel: boolean;
  lang?: 'id' | 'en';
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelId,
  starsEarned,
  coinsEarned,
  onNextLevel,
  onReplay,
  onLevelSelect,
  hasNextLevel,
  lang = 'id',
}) => {
  useEffect(() => {
    sound.playFanfare();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#ffc800', '#58cc02', '#1cb0f6', '#ff4b4b', '#ce82ff'],
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-pop-in select-none">
      <div className="relative w-full max-w-md bg-[#fff9ed] rounded-[36px] border-4 border-[#ebd5b3] shadow-[0_16px_0_0_#d9bc8c] p-6 text-center flex flex-col items-center">
        {/* Floating Trophy & Celebratory Kibo Mascot */}
        <div className="flex items-center justify-center -mt-16 mb-2 gap-2">
          <img
            src="/assets/kibo_duolingo.jpg"
            alt="Kibo"
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 border-[#78350f] shadow-xl object-cover bg-[#fffbeb] animate-bounce-slight"
          />
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#ffc800] border-4 border-[#78350f] shadow-xl flex items-center justify-center text-3xl sm:text-4xl animate-bounce-slight delay-150">
            🏆
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black font-fun text-[#451a03] m-0">
          {lang === 'id' ? `Tingkat ${levelId} Selesai!` : `Level ${levelId} Cleared!`}
        </h3>
        <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 mb-4">
          {lang === 'id' ? 'Kamu berhasil membuktikan semua kesetaraan pecahan!' : 'You matched all equivalent fractions!'}
        </p>

        {/* 3 Animated Stars */}
        <div className="flex items-center justify-center gap-3 my-2">
          {[1, 2, 3].map((starIdx) => {
            const isFilled = starIdx <= starsEarned;
            return (
              <div
                key={starIdx}
                className={`transform transition-all duration-500 ${
                  isFilled ? 'scale-110 animate-bounce-slight' : 'scale-90 opacity-30'
                }`}
              >
                <Star
                  className={`w-14 h-14 ${
                    isFilled
                      ? 'text-[#ffc800] fill-[#ffc800] drop-shadow-[0_6px_0_#ca8a04]'
                      : 'text-slate-300 fill-slate-200'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Reward Coins Pill */}
        <div className="flex items-center gap-2 bg-[#fef08a] border-2 border-[#ca8a04] rounded-full px-5 py-2 my-4 shadow-sm">
          <span className="text-base font-black font-fun text-[#713f12]">
            +{coinsEarned} Koin Emas
          </span>
          <span className="text-xl">🪙</span>
        </div>

        {/* Action Buttons (Duolingo Style 3D) */}
        <div className="w-full flex flex-col gap-2.5 mt-1">
          {hasNextLevel && (
            <button
              onClick={() => {
                sound.playPop();
                onNextLevel();
              }}
              className="btn-3d btn-3d-green w-full py-4 font-black font-fun text-lg rounded-2xl shadow-lg flex items-center justify-center gap-2"
            >
              <span>{lang === 'id' ? 'TINGKAT BERIKUTNYA' : 'NEXT LEVEL'}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playPop();
                onReplay();
              }}
              className="btn-3d btn-3d-white py-3 font-black font-fun text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'id' ? 'Main Ulang' : 'Replay'}</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onLevelSelect();
              }}
              className="btn-3d btn-3d-yellow py-3 font-black font-fun text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5"
            >
              <Map className="w-4 h-4" />
              <span>{lang === 'id' ? 'Peta Pulau' : 'World Map'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
