import React from 'react';
import type { UserProgress, Badge } from '../../types/fractions';
import { sound } from '../../utils/audioSynth';
import { MascotBubble } from '../common/MascotBubble';
import { Trophy, CheckCircle2, RotateCcw, Lock } from 'lucide-react';

interface TrophyRoomProps {
  progress: UserProgress;
  onResetProgress: () => void;
  lang?: 'id' | 'en';
}

export const TrophyRoom: React.FC<TrophyRoomProps> = ({
  progress,
  onResetProgress,
  lang = 'id',
}) => {
  const totalStars = Object.values(progress.levelStars).reduce((acc, s) => acc + s, 0);

  const badges: Badge[] = [
    {
      id: 'b1',
      title: 'Koki Pecahan Pemula',
      titleEn: 'Beginner Fraction Chef',
      desc: 'Selesaikan Tingkat 1 tantangan kesetaraan',
      descEn: 'Clear Level 1 in fraction match',
      icon: '🌱',
      unlocked: (progress.levelStars[1] || 0) > 0,
      progress: (progress.levelStars[1] || 0) > 0 ? 1 : 0,
      maxProgress: 1,
    },
    {
      id: 'b2',
      title: 'Penyeimbang Timbangan Sejati',
      titleEn: 'Master of Balance Scale',
      desc: 'Temukan 5 pecahan senilai di Lab Eksplorasi',
      descEn: 'Discover 5 equivalent fractions in Equality Lab',
      icon: '⚖️',
      unlocked: progress.equalitiesFound >= 5,
      progress: Math.min(5, progress.equalitiesFound),
      maxProgress: 5,
    },
    {
      id: 'b3',
      title: 'Koki Pizza Bintang Lima',
      titleEn: '5-Star Pizza Chef',
      desc: 'Layani 3 pelanggan hewan di Kedai Pizza Kibo',
      descEn: 'Serve 3 animal customers at Kibo’s Shop',
      icon: '🍕',
      unlocked: progress.totalPizzasServed >= 3,
      progress: Math.min(3, progress.totalPizzasServed),
      maxProgress: 3,
    },
    {
      id: 'b4',
      title: 'Kolektor Bintang Emas',
      titleEn: 'Golden Star Collector',
      desc: 'Kumpulkan minimal 12 bintang di tantangan level',
      descEn: 'Collect at least 12 stars across levels',
      icon: '🌟',
      unlocked: totalStars >= 12,
      progress: Math.min(12, totalStars),
      maxProgress: 12,
    },
    {
      id: 'b5',
      title: 'Master Pecahan Senilai',
      titleEn: 'Ultimate Fraction Master',
      desc: 'Buka dan selesaikan semua 8 Tingkat Pecahan Ajaib',
      descEn: 'Unlock and clear all 8 Magic Fraction Levels',
      icon: '👑',
      unlocked: progress.unlockedLevel >= 8 && (progress.levelStars[8] || 0) > 0,
      progress: Math.min(8, Object.keys(progress.levelStars).length),
      maxProgress: 8,
    },
  ];

  const handleReset = () => {
    sound.playBoing();
    const confirmText =
      lang === 'id'
        ? 'Apakah kamu yakin ingin mengulang semua skor dan prestasi?'
        : 'Are you sure you want to reset all scores and trophies?';
    if (window.confirm(confirmText)) {
      onResetProgress();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 sm:gap-4 py-1 sm:py-2 px-1 sm:px-4 select-none">
      <MascotBubble
        message={
          lang === 'id'
            ? 'Selamat datang di Lemari Trofi! Kumpulkan semua piala dan lencana prestasimu di sini!'
            : 'Welcome to the Trophy Room! Collect all your trophies and achievement badges here!'
        }
        mood="celebrating"
        lang={lang}
      />

      {/* Top Statistics Cards (Duolingo & Toca Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
        {/* Total Stars */}
        <div className="bg-[#fff9ed] border-3 sm:border-4 border-[#ebd5b3] shadow-[0_4px_0_0_#d9bc8c] sm:shadow-[0_6px_0_0_#d9bc8c] rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex items-center gap-3">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#ffc800] border-2 border-[#b45309] flex items-center justify-center text-xl sm:text-2xl shadow-sm flex-shrink-0">
            ⭐
          </div>
          <div>
            <span className="text-[11px] sm:text-xs font-black text-[#b45309] uppercase font-fun block">
              {lang === 'id' ? 'Bintang Emas' : 'Golden Stars'}
            </span>
            <span className="text-xl sm:text-2xl font-fun font-black text-[#451a03]">
              {totalStars} / 24
            </span>
          </div>
        </div>

        {/* Pizzas Served */}
        <div className="bg-[#fff9ed] border-3 sm:border-4 border-[#ebd5b3] shadow-[0_4px_0_0_#d9bc8c] sm:shadow-[0_6px_0_0_#d9bc8c] rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex items-center gap-3">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#ff4b4b] border-2 border-[#ea2b2b] flex items-center justify-center text-xl sm:text-2xl shadow-sm flex-shrink-0">
            🍕
          </div>
          <div>
            <span className="text-[11px] sm:text-xs font-black text-[#991b1b] uppercase font-fun block">
              {lang === 'id' ? 'Pizza Disajikan' : 'Pizzas Served'}
            </span>
            <span className="text-xl sm:text-2xl font-fun font-black text-[#451a03]">
              {progress.totalPizzasServed} Loyang
            </span>
          </div>
        </div>

        {/* Equalities Found */}
        <div className="bg-[#fff9ed] border-3 sm:border-4 border-[#ebd5b3] shadow-[0_4px_0_0_#d9bc8c] sm:shadow-[0_6px_0_0_#d9bc8c] rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex items-center gap-3">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#1cb0f6] border-2 border-[#0284c7] flex items-center justify-center text-xl sm:text-2xl shadow-sm flex-shrink-0">
            ⚖️
          </div>
          <div>
            <span className="text-[11px] sm:text-xs font-black text-[#0369a1] uppercase font-fun block">
              {lang === 'id' ? 'Pecahan Senilai' : 'Lab Equalities'}
            </span>
            <span className="text-xl sm:text-2xl font-fun font-black text-[#451a03]">
              {progress.equalitiesFound} Ditemukan
            </span>
          </div>
        </div>
      </div>

      {/* Badges Cabinet */}
      <div className="bg-[#fff9ed] border-4 border-[#ebd5b3] rounded-[28px] sm:rounded-[36px] p-4 sm:p-6 shadow-[0_8px_0_0_#d9bc8c] sm:shadow-[0_10px_0_0_#d9bc8c]">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffc800]" />
            <h2 className="text-base sm:text-xl font-black font-fun text-[#451a03] m-0">
              {lang === 'id' ? 'Lemari Trofi & Lencana' : 'Trophy Cabinet'}
            </h2>
          </div>
          <span className="text-[11px] sm:text-xs font-black text-[#713f12] bg-[#fef08a] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border-2 border-[#ca8a04]">
            {badges.filter((b) => b.unlocked).length} / {badges.length} {lang === 'id' ? 'Terbuka' : 'Unlocked'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-3 transition-all flex items-start gap-3 ${
                b.unlocked
                  ? 'bg-white border-[#ebd5b3] shadow-[0_4px_0_0_#d9bc8c]'
                  : 'bg-slate-100/80 border-slate-200 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-sm flex-shrink-0 ${
                  b.unlocked
                    ? 'bg-[#fef08a] border-2 border-[#ca8a04] animate-bounce-slight'
                    : 'bg-slate-200 border-2 border-slate-300'
                }`}
              >
                {b.unlocked ? b.icon : <Lock className="w-5 h-5 text-slate-400" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black font-fun text-[#451a03] m-0">
                    {lang === 'id' ? b.title : b.titleEn}
                  </h3>
                  {b.unlocked && (
                    <CheckCircle2 className="w-4 h-4 text-[#58cc02] flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs font-bold text-slate-500 mt-0.5 mb-2 leading-tight">
                  {lang === 'id' ? b.desc : b.descEn}
                </p>

                {/* Progress Bar (Duolingo Style) */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
                  <div
                    className={`h-full transition-all duration-500 ${
                      b.unlocked ? 'bg-[#58cc02]' : 'bg-slate-400'
                    }`}
                    style={{ width: `${(b.progress / b.maxProgress) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-slate-400 mt-1 block font-fun">
                  Progres: {b.progress} / {b.maxProgress}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Data Option */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#ff4b4b] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'id' ? 'Reset Semua Progres Belajar' : 'Reset All Progress'}</span>
        </button>
      </div>
    </div>
  );
};
