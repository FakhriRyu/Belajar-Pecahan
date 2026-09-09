import React from 'react';
import type { NavTab } from '../../types/fractions';
import { sound } from '../../utils/audioSynth';
import { Volume2, VolumeX, Music, Trophy, Compass, Map, Pizza } from 'lucide-react';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  lang: 'id' | 'en';
  onToggleLang: () => void;
  totalStars: number;
  totalCoins: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  lang,
  onToggleLang,
  totalStars,
  totalCoins,
}) => {
  const [soundOn, setSoundOn] = React.useState(sound.getSoundEnabled());
  const [musicOn, setMusicOn] = React.useState(sound.getMusicEnabled());

  const handleTabClick = (tab: NavTab) => {
    sound.playPop();
    onTabChange(tab);
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sound.setSoundEnabled(next);
    if (next) sound.playPop();
  };

  const toggleMusic = () => {
    const next = !musicOn;
    setMusicOn(next);
    sound.setMusicEnabled(next);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fffdfa] border-b-4 border-[#ebd5b3] shadow-md px-3 sm:px-5 py-2 sm:py-2.5">
      <div className="max-w-6xl mx-auto">
        {/* Desktop View (md and above): Single clean row */}
        <div className="hidden md:flex items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
            onClick={() => handleTabClick('game')}
          >
            <img
              src="/favicon.svg"
              alt="Pecahan Ajaib Logo"
              className="w-11 h-11 rounded-2xl shadow-sm transform -rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all object-cover"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black font-fun text-[#451a03] tracking-tight leading-none m-0">
                  Pecahan Ajaib
                </h1>
              </div>
              <p className="text-[11px] font-bold text-[#b45309] m-0">
                {lang === 'id' ? 'Media Belajar Pecahan Senilai' : 'Interactive Fraction Learning'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="flex items-center gap-2">
            {/* Peta Pecahan (Game) */}
            <button
              onClick={() => handleTabClick('game')}
              className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
                currentTab === 'game'
                  ? 'btn-3d-green shadow-sm'
                  : 'btn-3d-white hover:bg-slate-50'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>{lang === 'id' ? 'Peta Pulau' : 'World Map'}</span>
            </button>

            {/* Lab Eksplorasi */}
            <button
              onClick={() => handleTabClick('lab')}
              className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
                currentTab === 'lab'
                  ? 'btn-3d-blue shadow-sm'
                  : 'btn-3d-white hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{lang === 'id' ? 'Lab Timbangan' : 'Scale Lab'}</span>
            </button>

            {/* Kedai Pizza */}
            <button
              onClick={() => handleTabClick('pizza')}
              className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
                currentTab === 'pizza'
                  ? 'btn-3d-red shadow-sm'
                  : 'btn-3d-white hover:bg-slate-50'
              }`}
            >
              <Pizza className="w-4 h-4" />
              <span>{lang === 'id' ? 'Kedai Pizza' : 'Pizza Shop'}</span>
            </button>

            {/* Ruang Trofi */}
            <button
              onClick={() => handleTabClick('trophy')}
              className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
                currentTab === 'trophy'
                  ? 'btn-3d-purple shadow-sm'
                  : 'btn-3d-white hover:bg-slate-50'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>{lang === 'id' ? 'Trofi' : 'Trophies'}</span>
            </button>
          </nav>

          {/* Desktop User Stats & Quick Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 bg-[#fff8eb] px-3 py-1.5 rounded-2xl border-2 border-[#ebd5b3] shadow-inner">
              <div className="flex items-center gap-1 text-[#b45309] font-black text-xs">
                <span className="text-base">⭐</span>
                <span>{totalStars}</span>
              </div>
              <div className="w-[1.5px] h-3.5 bg-[#ebd5b3]" />
              <div className="flex items-center gap-1 text-[#b45309] font-black text-xs">
                <span className="text-base">🪙</span>
                <span>{totalCoins}</span>
              </div>
            </div>

            <button
              onClick={toggleSound}
              title={soundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
              className={`btn-3d p-2 rounded-xl text-xs ${
                soundOn ? 'btn-3d-yellow' : 'btn-3d-white text-slate-400'
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleMusic}
              title={musicOn ? 'Matikan Musik' : 'Nyalakan Musik'}
              className={`btn-3d p-2 rounded-xl text-xs ${
                musicOn ? 'btn-3d-purple animate-pulse' : 'btn-3d-white text-slate-400'
              }`}
            >
              <Music className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleLang}
              className="btn-3d btn-3d-wood px-2.5 py-1.5 text-xs font-black rounded-xl"
            >
              {lang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
            </button>
          </div>
        </div>

        {/* Mobile View (< md): Ultra Compact 2-Row Header */}
        <div className="flex md:hidden flex-col gap-1.5">
          {/* Mobile Row 1: Logo & Title (Left) + Quick Stats & Audio/Lang (Right) */}
          <div className="flex items-center justify-between w-full">
            {/* Logo & Title */}
            <div
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={() => handleTabClick('game')}
            >
              <img
                src="/favicon.svg"
                alt="Logo"
                className="w-8 h-8 rounded-xl object-cover shadow-sm"
              />
              <div className="flex flex-col">
                <h1 className="text-base font-black font-fun text-[#451a03] leading-tight m-0">
                  Pecahan Ajaib
                </h1>
                <span className="text-[9px] font-bold text-[#b45309] leading-tight">
                  {lang === 'id' ? 'Pecahan Senilai' : 'Fraction Quest'}
                </span>
              </div>
            </div>

            {/* Quick Stats & Controls */}
            <div className="flex items-center gap-1.5">
              {/* Stars & Coins Compact Badge */}
              <div className="flex items-center gap-1.5 bg-[#fff8eb] px-2 py-1 rounded-xl border border-[#ebd5b3]">
                <div className="flex items-center gap-0.5 text-[#b45309] font-black text-[11px]">
                  <span>⭐</span>
                  <span>{totalStars}</span>
                </div>
                <div className="w-[1px] h-3 bg-[#ebd5b3]" />
                <div className="flex items-center gap-0.5 text-[#b45309] font-black text-[11px]">
                  <span>🪙</span>
                  <span>{totalCoins}</span>
                </div>
              </div>

              {/* Sound */}
              <button
                onClick={toggleSound}
                className={`btn-3d p-1.5 rounded-lg text-xs ${
                  soundOn ? 'btn-3d-yellow' : 'btn-3d-white text-slate-400'
                }`}
              >
                {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Music */}
              <button
                onClick={toggleMusic}
                className={`btn-3d p-1.5 rounded-lg text-xs ${
                  musicOn ? 'btn-3d-purple animate-pulse' : 'btn-3d-white text-slate-400'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
              </button>

              {/* Lang */}
              <button
                onClick={onToggleLang}
                className="btn-3d btn-3d-wood px-1.5 py-1 text-[10px] font-black rounded-lg"
              >
                {lang === 'id' ? 'ID' : 'EN'}
              </button>
            </div>
          </div>

          {/* Mobile Row 2: 4-Column Compact Tab Bar */}
          <nav className="grid grid-cols-4 gap-1.5 w-full pt-0.5">
            {/* Game Tab */}
            <button
              onClick={() => handleTabClick('game')}
              className={`btn-3d py-1.5 px-1 rounded-xl text-[11px] font-black font-fun flex items-center justify-center gap-1 ${
                currentTab === 'game' ? 'btn-3d-green' : 'btn-3d-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Peta' : 'Map'}</span>
            </button>

            {/* Lab Tab */}
            <button
              onClick={() => handleTabClick('lab')}
              className={`btn-3d py-1.5 px-1 rounded-xl text-[11px] font-black font-fun flex items-center justify-center gap-1 ${
                currentTab === 'lab' ? 'btn-3d-blue' : 'btn-3d-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Lab' : 'Lab'}</span>
            </button>

            {/* Pizza Tab */}
            <button
              onClick={() => handleTabClick('pizza')}
              className={`btn-3d py-1.5 px-1 rounded-xl text-[11px] font-black font-fun flex items-center justify-center gap-1 ${
                currentTab === 'pizza' ? 'btn-3d-red' : 'btn-3d-white'
              }`}
            >
              <Pizza className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Kedai' : 'Shop'}</span>
            </button>

            {/* Trophy Tab */}
            <button
              onClick={() => handleTabClick('trophy')}
              className={`btn-3d py-1.5 px-1 rounded-xl text-[11px] font-black font-fun flex items-center justify-center gap-1 ${
                currentTab === 'trophy' ? 'btn-3d-purple' : 'btn-3d-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Trofi' : 'Trofi'}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
