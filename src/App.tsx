import React, { useState, useEffect } from 'react';
import type { NavTab, UserProgress } from './types/fractions';
import { Navbar } from './components/common/Navbar';
import { EqualityLab } from './components/lab/EqualityLab';
import { LevelSelect } from './components/game/LevelSelect';
import { MatchGame } from './components/game/MatchGame';
import { PizzaShopGame } from './components/pizzaShop/PizzaShopGame';
import { TrophyRoom } from './components/achievements/TrophyRoom';
import { SubtractionMaterial } from './components/subtraction/SubtractionMaterial';

const STORAGE_KEY = 'magic_fractions_progress_v1';

const defaultProgress: UserProgress = {
  unlockedLevel: 1,
  levelStars: {},
  totalPizzasServed: 0,
  equalitiesFound: 0,
  coins: 0,
  unlockedBadges: [],
};

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('game');
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultProgress;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const totalStars = Object.values(progress.levelStars).reduce((acc, s) => acc + s, 0);

  const handleDiscoverEquality = () => {
    setProgress((prev) => ({
      ...prev,
      equalitiesFound: prev.equalitiesFound + 1,
      coins: prev.coins + 5,
    }));
  };

  const handleLevelComplete = (levelId: number, stars: number, coins: number) => {
    setProgress((prev) => {
      const currentBestStars = prev.levelStars[levelId] || 0;
      const nextUnlocked = Math.max(prev.unlockedLevel, Math.min(8, levelId + 1));
      return {
        ...prev,
        unlockedLevel: nextUnlocked,
        levelStars: {
          ...prev.levelStars,
          [levelId]: Math.max(currentBestStars, stars),
        },
        coins: prev.coins + coins,
      };
    });
  };

  const handleOrderServed = (coinsEarned: number) => {
    setProgress((prev) => ({
      ...prev,
      totalPizzasServed: prev.totalPizzasServed + 1,
      coins: prev.coins + coinsEarned,
    }));
  };

  const handleResetProgress = () => {
    setProgress(defaultProgress);
    setSelectedLevelId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const handleToggleLang = () => {
    setLang((l) => (l === 'id' ? 'en' : 'id'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/40 to-yellow-50 flex flex-col font-nunito">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab === 'game') {
            setSelectedLevelId(null);
          }
        }}
        lang={lang}
        onToggleLang={handleToggleLang}
        totalStars={totalStars}
        totalCoins={progress.coins}
      />

      {/* Main Feature Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-start items-center">
        {currentTab === 'lab' && (
          <EqualityLab onDiscoverEquality={handleDiscoverEquality} lang={lang} />
        )}

        {currentTab === 'game' && (
          <>
            {selectedLevelId === null ? (
              <LevelSelect
                unlockedLevel={progress.unlockedLevel}
                levelStars={progress.levelStars}
                onSelectLevel={(id) => setSelectedLevelId(id)}
                lang={lang}
              />
            ) : (
              <MatchGame
                levelId={selectedLevelId}
                onBackToSelect={() => setSelectedLevelId(null)}
                onLevelComplete={(id, stars, coins) => {
                  handleLevelComplete(id, stars, coins);
                }}
                onNextLevel={(nextId) => {
                  setSelectedLevelId(nextId);
                }}
                lang={lang}
              />
            )}
          </>
        )}

        {currentTab === 'subtraction' && (
          <SubtractionMaterial
            onEarnCoins={(earned) => {
              setProgress((prev) => ({
                ...prev,
                coins: prev.coins + earned,
              }));
            }}
            lang={lang}
          />
        )}

        {currentTab === 'pizza' && (
          <PizzaShopGame onOrderServed={handleOrderServed} lang={lang} />
        )}

        {currentTab === 'trophy' && (
          <TrophyRoom
            progress={progress}
            onResetProgress={handleResetProgress}
            lang={lang}
          />
        )}
      </main>
    </div>
  );
};

export default App;
