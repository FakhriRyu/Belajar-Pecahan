import React from 'react';
import type { LevelConfig } from '../../types/fractions';
import { getLevelConfigs } from '../../utils/fractionsMath';
import { sound } from '../../utils/audioSynth';
import { MascotBubble } from '../common/MascotBubble';
import { Lock, Star, Sparkles, Compass } from 'lucide-react';

interface LevelSelectProps {
  unlockedLevel: number;
  levelStars: Record<number, number>;
  onSelectLevel: (levelId: number) => void;
  lang?: 'id' | 'en';
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  unlockedLevel,
  levelStars,
  onSelectLevel,
  lang = 'id',
}) => {
  const levels: LevelConfig[] = getLevelConfigs();

  const handleLevelClick = (id: number, isLocked: boolean) => {
    if (isLocked) {
      sound.playBoing();
      return;
    }
    sound.playPop(520);
    onSelectLevel(id);
  };

  // Biome theme metadata for the 4 island milestone sections along the path
  const getBiomeInfo = (levelId: number) => {
    if (levelId <= 2) {
      return {
        name: lang === 'id' ? '🏝️ Pulau Pizza Keju' : '🏝️ Cheese Pizza Isle',
        image: '/assets/pizza_cartoon.jpg',
        bannerColor: 'bg-[#ffc800] text-[#533800] border-[#d97706]',
      };
    }
    if (levelId <= 4) {
      return {
        name: lang === 'id' ? '🍫 Lembah Cokelat Manis' : '🍫 Sweet Chocolate Valley',
        image: '/assets/chocolate_bar.jpg',
        bannerColor: 'bg-[#b45309] text-white border-[#78350f]',
      };
    }
    if (levelId <= 6) {
      return {
        name: lang === 'id' ? '🧪 Danau Ramuan Segar' : '🧪 Fresh Potion Lagoon',
        image: '/assets/juice_beaker.jpg',
        bannerColor: 'bg-[#1cb0f6] text-white border-[#0284c7]',
      };
    }
    return {
      name: lang === 'id' ? '🌈 Puncak Pelangi Master' : '🌈 Rainbow Master Peak',
      image: '/assets/tray_wooden.jpg',
      bannerColor: 'bg-[#ce82ff] text-white border-[#a855f7]',
    };
  };

  // Serpentine winding path offsets (Duolingo / Candy Crush style)
  const pathOffsets = [
    'translate-x-0',                      // Level 1: Center
    'translate-x-12 sm:translate-x-20',   // Level 2: Right
    'translate-x-0',                      // Level 3: Center
    '-translate-x-12 sm:-translate-x-20', // Level 4: Left (Treasure)
    'translate-x-0',                      // Level 5: Center
    'translate-x-12 sm:translate-x-20',   // Level 6: Right
    '-translate-x-6 sm:-translate-x-10',  // Level 7: Slight Left
    'translate-x-0',                      // Level 8: Grand Peak Center
  ];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-3 sm:gap-4 py-1 sm:py-2 px-2 select-none">
      {/* Mascot Cheer */}
      <MascotBubble
        message={
          lang === 'id'
            ? 'Pilih tingkat pecahan di bawah ini! Telusuri jalurnya dan kumpulkan 3 bintang emas di setiap tingkat!'
            : 'Select a fraction level below! Follow the path and collect all 3 golden stars on each level!'
        }
        mood="happy"
        lang={lang}
      />

      {/* World Map Container (Duolingo Stepping Path) */}
      <div className="relative w-full bg-[#fbf6e9] border-4 sm:border-6 border-[#ebd5b3] rounded-[36px] sm:rounded-[44px] shadow-[0_12px_0_0_#d9bc8c] p-5 sm:p-8 flex flex-col items-center overflow-hidden">
        {/* Decorative Floating Elements */}
        <div className="absolute top-8 left-4 text-3xl opacity-60 animate-float-bob pointer-events-none">☁️</div>
        <div className="absolute top-44 right-6 text-3xl opacity-50 animate-float-bob delay-1000 pointer-events-none">☁️</div>
        <div className="absolute top-96 left-4 text-2xl opacity-60 pointer-events-none">🌴</div>
        <div className="absolute bottom-96 right-4 text-2xl opacity-60 pointer-events-none">🐚</div>
        <div className="absolute bottom-48 left-6 text-3xl opacity-50 animate-float-bob delay-500 pointer-events-none">☁️</div>
        <div className="absolute bottom-16 right-6 text-2xl opacity-70 pointer-events-none">🏰</div>

        {/* Map Header */}
        <div className="relative z-10 flex flex-col items-center mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#ffc800] text-[#533800] border-b-4 border-[#d97706] px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-sm font-black font-fun shadow-md">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>{lang === 'id' ? 'PETA JALUR PECAHAN' : 'FRACTION STEPPING MAP'}</span>
            <Sparkles className="w-4 h-4 text-[#b45309]" />
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-fun text-[#451a03] mt-2 mb-0">
            {lang === 'id' ? 'Jalur Master Pecahan Ajaib' : 'Magic Fraction Stepping Trail'}
          </h2>
        </div>

        {/* The Winding Stepping Nodes flowing downwards */}
        <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-11 w-full max-w-md">
          {levels.map((lvl, index) => {
            const isLocked = lvl.id > unlockedLevel;
            const isCurrent = lvl.id === unlockedLevel;
            const stars = levelStars[lvl.id] || 0;
            const biome = getBiomeInfo(lvl.id);
            const offsetClass = pathOffsets[index] || 'translate-x-0';
            const isMilestone = lvl.id === 4 || lvl.id === 8;
            const isBiomeStart = lvl.id === 1 || lvl.id === 3 || lvl.id === 5 || lvl.id === 7;

            return (
              <div key={lvl.id} className="w-full flex flex-col items-center">
                {/* Milestone Biome Header Banner along the trail */}
                {isBiomeStart && (
                  <div className="my-2 sm:my-3 flex items-center justify-center">
                    <div className={`px-4 py-1.5 rounded-2xl border-2 font-black font-fun text-xs sm:text-sm shadow-md flex items-center gap-2 ${biome.bannerColor}`}>
                      <img
                        src={biome.image}
                        alt={biome.name}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/80 object-cover shadow-inner flex-shrink-0"
                      />
                      <span>{biome.name}</span>
                    </div>
                  </div>
                )}

                {/* Level Node in the Winding Trail */}
                <div className={`flex flex-col items-center relative ${offsetClass} transition-transform`}>
                  {/* Animated Mascot Standing on Current Level */}
                  {isCurrent && (
                    <div className="absolute -top-14 sm:-top-16 z-30 flex flex-col items-center animate-hop pointer-events-none">
                      <div className="bg-[#ff4b4b] text-white text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 rounded-full border-2 border-white shadow-md mb-1 whitespace-nowrap">
                        {lang === 'id' ? 'MULAI SINI! 👇' : 'START HERE! 👇'}
                      </div>
                      <img
                        src="/assets/kibo_duolingo.jpg"
                        alt="Kibo"
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-[#78350f] shadow-lg object-cover bg-[#fffbeb]"
                      />
                    </div>
                  )}

                  {/* The Chunky Stepping Stone Button */}
                  <div className="relative group">
                    {/* Floating 3 Stars Badge for cleared levels */}
                    {!isLocked && stars > 0 && (
                      <div className="absolute -top-3.5 sm:-top-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-0.5 bg-[#ffffff] px-2 py-0.5 rounded-full border-2 border-[#ffd700] shadow-md">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                              s <= stars
                                ? 'text-[#ffc800] fill-[#ffc800]'
                                : 'text-slate-200 fill-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => handleLevelClick(lvl.id, isLocked)}
                      className={`btn-3d w-18 h-18 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center font-black font-fun shadow-lg transition-transform ${
                        isLocked
                          ? 'bg-[#e2e8f0] border-[#cbd5e1] text-slate-400 cursor-not-allowed'
                          : isCurrent
                          ? 'btn-3d-green ring-4 ring-[#86efac] scale-105 animate-pulse'
                          : stars > 0
                          ? 'btn-3d-yellow'
                          : 'btn-3d-blue'
                      }`}
                    >
                      {isLocked ? (
                        <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
                      ) : isMilestone ? (
                        <div className="flex flex-col items-center">
                          <span className="text-xl sm:text-2xl">{lvl.id === 8 ? '👑' : '🎁'}</span>
                          <span className="text-[11px] sm:text-xs font-black leading-none">{lvl.id}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-xl sm:text-2xl leading-none">{lvl.id}</span>
                          <span className="text-[9px] sm:text-[10px] uppercase tracking-tight opacity-90">
                            {stars > 0 ? (lang === 'id' ? 'Lulus' : 'Done') : (lang === 'id' ? 'Main' : 'Play')}
                          </span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Level Title Card below stone */}
                  <div
                    onClick={() => handleLevelClick(lvl.id, isLocked)}
                    className={`mt-2 px-3 py-1 bg-white/95 rounded-2xl border-2 border-[#ebd5b3] shadow-sm text-center cursor-pointer max-w-[170px] sm:max-w-[200px] ${
                      isLocked ? 'opacity-50' : 'hover:scale-105 transition-transform'
                    }`}
                  >
                    <h4 className="text-[11px] sm:text-xs font-black font-fun text-[#451a03] line-clamp-1 m-0">
                      {lang === 'id' ? lvl.title : lvl.titleEn}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
