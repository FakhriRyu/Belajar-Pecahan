import React, { useState, useEffect } from 'react';
import type { MatchCard } from '../../types/fractions';
import { getLevelConfigs, isEquivalent } from '../../utils/fractionsMath';
import { sound } from '../../utils/audioSynth';
import { FractionPizza } from '../visuals/FractionPizza';
import { FractionBar } from '../visuals/FractionBar';
import { FractionBeaker } from '../visuals/FractionBeaker';
import { FractionNumberLine } from '../visuals/FractionNumberLine';
import { MascotBubble } from '../common/MascotBubble';
import { VictoryModal } from './VictoryModal';
import { ArrowLeft, Check, HelpCircle, CheckCircle2, RotateCcw } from 'lucide-react';

interface MatchGameProps {
  levelId: number;
  onBackToSelect: () => void;
  onLevelComplete: (levelId: number, stars: number, coins: number) => void;
  onNextLevel?: (nextLevelId: number) => void;
  lang?: 'id' | 'en';
}

interface TrayState {
  id: number;
  slotA: MatchCard | null;
  slotB: MatchCard | null;
  isMatched: boolean;
}

interface DragSource {
  type: 'pool' | 'tray';
  cardId: string;
  trayIndex?: number;
  slotKey?: 'slotA' | 'slotB';
}

export const MatchGame: React.FC<MatchGameProps> = ({
  levelId,
  onBackToSelect,
  onLevelComplete,
  onNextLevel,
  lang = 'id',
}) => {
  const levels = getLevelConfigs();
  const config = levels.find((l) => l.id === levelId) || levels[0];

  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [dragSource, setDragSource] = useState<DragSource | null>(null);
  const [hoveredDropTarget, setHoveredDropTarget] = useState<string | null>(null);

  const [trays, setTrays] = useState<TrayState[]>([
    { id: 1, slotA: null, slotB: null, isMatched: false },
    { id: 2, slotA: null, slotB: null, isMatched: false },
    { id: 3, slotA: null, slotB: null, isMatched: false },
  ]);

  const [mistakes, setMistakes] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [starsEarned, setStarsEarned] = useState<number>(3);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const initLevel = () => {
    const rawCards: MatchCard[] = config.cards.map((c, index) => ({
      id: `card-${index}-${c.pairId}`,
      fraction: { ...c.fraction },
      shape: c.shape,
      isMatched: false,
    }));

    const shuffled = [...rawCards].sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setSelectedCardId(null);
    setDragSource(null);
    setHoveredDropTarget(null);
    setTrays([
      { id: 1, slotA: null, slotB: null, isMatched: false },
      { id: 2, slotA: null, slotB: null, isMatched: false },
      { id: 3, slotA: null, slotB: null, isMatched: false },
    ]);
    setMistakes(0);
    setShowHint(false);
    setIsVictory(false);
    setFeedbackMessage(
      lang === 'id'
        ? '💡 Tarik (drag & drop) atau klik kartu pecahan di bawah untuk menaruhnya di nampan target!'
        : '💡 Drag & drop or click fraction cards below into the tray slots to match!'
    );
  };

  useEffect(() => {
    initLevel();
  }, [levelId]);

  // Click handler (for tap / mobile / accessibility)
  const handleCardClick = (card: MatchCard) => {
    if (card.isMatched) return;
    sound.playPop(480);
    if (selectedCardId === card.id) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(card.id);
    }
  };

  const handleSlotClick = (trayIndex: number, slotKey: 'slotA' | 'slotB') => {
    const tray = trays[trayIndex];
    if (tray.isMatched) return;

    // If clicking an occupied slot with no card selected, return card to pool
    if (!selectedCardId && tray[slotKey]) {
      sound.playPop(360);
      const cardToReturn = tray[slotKey]!;
      setTrays((prev) => {
        const next = [...prev];
        next[trayIndex] = { ...next[trayIndex], [slotKey]: null };
        return next;
      });
      setCards((prev) => [...prev, cardToReturn]);
      return;
    }

    // If card selected, place it in slot
    if (selectedCardId) {
      const card = cards.find((c) => c.id === selectedCardId);
      if (!card) return;

      sound.playPop(540);
      const existingInSlot = tray[slotKey];

      setTrays((prev) => {
        const next = [...prev];
        next[trayIndex] = { ...next[trayIndex], [slotKey]: card };
        return next;
      });

      setCards((prev) => {
        const filtered = prev.filter((c) => c.id !== selectedCardId);
        if (existingInSlot) {
          filtered.push(existingInSlot);
        }
        return filtered;
      });

      setSelectedCardId(null);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, source: DragSource) => {
    sound.playPop(420);
    setDragSource(source);
    e.dataTransfer.setData('text/plain', JSON.stringify(source));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDragSource(null);
    setHoveredDropTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (hoveredDropTarget !== targetId) {
      setHoveredDropTarget(targetId);
    }
  };

  const handleDragLeave = () => {
    setHoveredDropTarget(null);
  };

  const handleDropOnSlot = (e: React.DragEvent, targetTrayIndex: number, targetSlotKey: 'slotA' | 'slotB') => {
    e.preventDefault();
    setHoveredDropTarget(null);

    const targetTray = trays[targetTrayIndex];
    if (targetTray.isMatched) return;

    if (!dragSource) return;

    sound.playPop(540);

    let movingCard: MatchCard | null = null;

    if (dragSource.type === 'pool') {
      movingCard = cards.find((c) => c.id === dragSource.cardId) || null;
      if (!movingCard) return;

      const existingInSlot = targetTray[targetSlotKey];

      // Update tray
      setTrays((prev) => {
        const next = [...prev];
        next[targetTrayIndex] = { ...next[targetTrayIndex], [targetSlotKey]: movingCard };
        return next;
      });

      // Update pool
      setCards((prev) => {
        const filtered = prev.filter((c) => c.id !== dragSource.cardId);
        if (existingInSlot) {
          filtered.push(existingInSlot);
        }
        return filtered;
      });
    } else if (dragSource.type === 'tray' && dragSource.trayIndex !== undefined && dragSource.slotKey) {
      const sourceTray = trays[dragSource.trayIndex];
      movingCard = sourceTray[dragSource.slotKey];
      if (!movingCard) return;

      const existingInTargetSlot = targetTray[targetSlotKey];

      // Swap or move between tray slots
      setTrays((prev) => {
        const next = [...prev];
        // clear or swap source
        next[dragSource.trayIndex!] = {
          ...next[dragSource.trayIndex!],
          [dragSource.slotKey!]: existingInTargetSlot,
        };
        // place in target
        next[targetTrayIndex] = {
          ...next[targetTrayIndex],
          [targetSlotKey]: movingCard,
        };
        return next;
      });
    }

    setDragSource(null);
    setSelectedCardId(null);
  };

  const handleDropOnPool = (e: React.DragEvent) => {
    e.preventDefault();
    setHoveredDropTarget(null);
    if (!dragSource || dragSource.type !== 'tray' || dragSource.trayIndex === undefined || !dragSource.slotKey) {
      return;
    }

    const sourceTray = trays[dragSource.trayIndex];
    const cardToReturn = sourceTray[dragSource.slotKey];
    if (!cardToReturn) return;

    sound.playPop(380);

    setTrays((prev) => {
      const next = [...prev];
      next[dragSource.trayIndex!] = {
        ...next[dragSource.trayIndex!],
        [dragSource.slotKey!]: null,
      };
      return next;
    });

    setCards((prev) => [...prev, cardToReturn]);
    setDragSource(null);
  };

  const checkAnswers = () => {
    let allTraysFilled = true;
    let anyMistake = false;
    let newMatchedCount = 0;

    const nextTrays = trays.map((tray) => {
      if (tray.isMatched) {
        newMatchedCount++;
        return tray;
      }
      if (!tray.slotA || !tray.slotB) {
        allTraysFilled = false;
        return tray;
      }

      const eq = isEquivalent(tray.slotA.fraction, tray.slotB.fraction);
      if (eq) {
        newMatchedCount++;
        return { ...tray, isMatched: true };
      } else {
        anyMistake = true;
        return tray;
      }
    });

    if (!allTraysFilled && nextTrays.some((t) => !t.isMatched && (!t.slotA || !t.slotB))) {
      sound.playBoing();
      setFeedbackMessage(
        lang === 'id' ? 'Lengkapi semua kotak nampan terlebih dahulu ya!' : 'Please fill all tray slots first!'
      );
      return;
    }

    if (anyMistake) {
      sound.playBoing();
      setMistakes((m) => m + 1);
      setFeedbackMessage(
        lang === 'id'
          ? 'Ups! Masih ada pasangan yang belum senilai. Periksa kembali dan coba lagi!'
          : 'Oops! Some pairs are not equivalent yet. Check again!'
      );

      const cardsToReturn: MatchCard[] = [];
      const cleanedTrays = nextTrays.map((t) => {
        if (!t.isMatched) {
          if (t.slotA) cardsToReturn.push(t.slotA);
          if (t.slotB) cardsToReturn.push(t.slotB);
          return { ...t, slotA: null, slotB: null };
        }
        return t;
      });

      setTrays(cleanedTrays);
      setCards((prev) => [...prev, ...cardsToReturn]);
      return;
    }

    // All correct!
    sound.playDing();
    setTrays(nextTrays);

    if (newMatchedCount === 3) {
      let finalStars = 3;
      if (mistakes === 1 || mistakes === 2) finalStars = 2;
      if (mistakes >= 3) finalStars = 1;

      const coins = finalStars * 10;
      setStarsEarned(finalStars);
      setIsVictory(true);
      onLevelComplete(levelId, finalStars, coins);
    }
  };

  // Render clean un-cropped fraction visuals without restrictive borders
  const renderCardVisual = (card: MatchCard) => {
    const { numerator, denominator } = card.fraction;
    if (card.shape === 'symbol') {
      return (
        <div className="flex flex-col items-center justify-center p-1 select-none">
          <span className="text-2xl sm:text-4xl font-black font-fun text-[#451a03] leading-none">
            {numerator}
          </span>
          <div className="w-8 sm:w-12 h-1 sm:h-2 bg-[#451a03] rounded-full my-1 sm:my-1.5" />
          <span className="text-2xl sm:text-4xl font-black font-fun text-[#451a03] leading-none">
            {denominator}
          </span>
        </div>
      );
    }
    if (card.shape === 'pizza') {
      return <FractionPizza numerator={numerator} denominator={denominator} size={90} />;
    }
    if (card.shape === 'chocolate') {
      return <FractionBar numerator={numerator} denominator={denominator} width={100} height={42} />;
    }
    if (card.shape === 'beaker') {
      return <FractionBeaker numerator={numerator} denominator={denominator} width={65} height={85} />;
    }
    if (card.shape === 'numberline') {
      return <FractionNumberLine numerator={numerator} denominator={denominator} width={110} height={44} />;
    }
    return null;
  };

  const isReadyToCheck = trays.every((t) => t.isMatched || (t.slotA && t.slotB));

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 sm:gap-4 py-1 sm:py-2 px-1 sm:px-4 select-none">
      {/* Top Level Nav Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => {
            sound.playPop();
            onBackToSelect();
          }}
          className="btn-3d btn-3d-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black font-fun flex items-center gap-1 sm:gap-1.5 flex-shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{lang === 'id' ? 'Peta' : 'Map'}</span>
        </button>

        <div className="text-center">
          <div className="bg-[#ffc800] border-b-2 sm:border-b-4 border-[#e5a400] text-[#533800] px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black font-fun inline-block shadow-sm">
            {lang === 'id' ? 'Tingkat ' + levelId : 'Level ' + levelId}
          </div>
          <h2 className="text-sm sm:text-xl font-black font-fun text-[#451a03] m-0 mt-0.5 line-clamp-1">
            {lang === 'id' ? config.title : config.titleEn}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => {
              sound.playPop();
              setShowHint(!showHint);
            }}
            className="btn-3d btn-3d-yellow p-1.5 sm:p-2 rounded-xl sm:rounded-2xl"
            title="Petunjuk"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={initLevel}
            className="btn-3d btn-3d-white p-1.5 sm:p-2 rounded-xl sm:rounded-2xl"
            title="Ulangi Level"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Mascot Guidance */}
      <MascotBubble
        message={showHint ? (lang === 'id' ? `💡 Petunjuk: ${config.hint}` : `💡 Hint: ${config.hintEn}`) : feedbackMessage}
        mood={isVictory ? 'celebrating' : showHint ? 'teaching' : 'happy'}
        lang={lang}
      />

      {/* 3 Authentic 3D Wooden Trays (Drop Zones) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 my-1">
        {trays.map((tray, trayIdx) => (
          <div
            key={tray.id}
            className={`relative rounded-[30px] sm:rounded-[34px] p-3.5 sm:p-4.5 border-[5px] sm:border-[6px] transition-all duration-300 flex flex-col items-center justify-center ${
              tray.isMatched
                ? 'bg-gradient-to-b from-[#ecfdf5] to-[#d1fae5] border-[#10b981] shadow-[0_8px_0_0_#059669]'
                : 'border-[#78350f]'
            }`}
            style={{
              backgroundImage: tray.isMatched
                ? undefined
                : 'linear-gradient(to bottom, #fed7aa 0%, #fde68a 25%, #fcd34d 60%, #f59e0b 90%, #d97706 100%)',
              boxShadow: tray.isMatched
                ? '0 8px 0 0 #059669, inset 0 3px 6px rgba(0,0,0,0.1)'
                : '0 8px 0 0 #451a03, inset 0 3px 6px rgba(255,255,255,0.4)',
            }}
          >
            {/* Left & Right Wooden/Brass Tray Handles */}
            <div className="absolute -left-3 sm:-left-3.5 top-1/2 -translate-y-1/2 w-2.5 sm:w-3 h-14 bg-[#78350f] rounded-l-md border-2 border-r-0 border-[#451a03] shadow-sm flex flex-col justify-between py-1.5 items-center pointer-events-none">
              <div className="w-1 h-1 rounded-full bg-[#fbbf24]" />
              <div className="w-1 h-1 rounded-full bg-[#fbbf24]" />
            </div>
            <div className="absolute -right-3 sm:-right-3.5 top-1/2 -translate-y-1/2 w-2.5 sm:w-3 h-14 bg-[#78350f] rounded-r-md border-2 border-l-0 border-[#451a03] shadow-sm flex flex-col justify-between py-1.5 items-center pointer-events-none">
              <div className="w-1 h-1 rounded-full bg-[#fbbf24]" />
              <div className="w-1 h-1 rounded-full bg-[#fbbf24]" />
            </div>

            {/* Subtle Wood Plank Grain Lines */}
            {!tray.isMatched && (
              <div className="absolute inset-0 rounded-[25px] sm:rounded-[28px] overflow-hidden pointer-events-none opacity-25">
                <div className="w-full h-full flex flex-col justify-between py-3 sm:py-4">
                  <div className="w-full h-[1.5px] bg-[#78350f]" />
                  <div className="w-full h-[1.5px] bg-[#78350f]" />
                  <div className="w-full h-[1.5px] bg-[#78350f]" />
                  <div className="w-full h-[1.5px] bg-[#78350f]" />
                </div>
              </div>
            )}

            {/* Match Success Badge at top if matched */}
            {tray.isMatched && (
              <div className="absolute -top-3.5 z-20 flex items-center gap-1 bg-[#58cc02] text-white px-3 py-0.5 rounded-full border-2 border-white shadow-md text-xs font-black font-fun animate-bounce-slight">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'id' ? 'SENILAI!' : 'EQUAL!'}</span>
              </div>
            )}

            {/* Two Drop Target Slots with Center Equal Sign */}
            <div className="w-full flex items-center justify-center gap-2 sm:gap-2.5 relative z-10">
              {/* Slot A */}
              {(() => {
                const targetId = `tray-${trayIdx}-slotA`;
                const isHovered = hoveredDropTarget === targetId;
                return (
                  <div
                    onClick={() => handleSlotClick(trayIdx, 'slotA')}
                    onDragOver={(e) => handleDragOver(e, targetId)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDropOnSlot(e, trayIdx, 'slotA')}
                    className={`w-28 h-28 min-[380px]:w-32 min-[380px]:h-32 sm:w-34 sm:h-34 rounded-2xl flex items-center justify-center p-1.5 sm:p-2 transition-all cursor-pointer ${
                      tray.isMatched
                        ? 'bg-white/95 border-2 border-[#10b981] shadow-sm'
                        : isHovered
                        ? 'bg-[#dcfce7] ring-4 ring-[#58cc02] scale-105 shadow-md'
                        : tray.slotA
                        ? 'bg-white/95 border-2 border-[#b45309] shadow-sm hover:scale-105'
                        : 'bg-[#fffbeb]/90 border-2 border-dashed border-[#b45309]/60 hover:bg-white shadow-inner'
                    }`}
                  >
                    {tray.slotA ? (
                      <div
                        draggable={!tray.isMatched}
                        onDragStart={(e) =>
                          handleDragStart(e, {
                            type: 'tray',
                            cardId: tray.slotA!.id,
                            trayIndex: trayIdx,
                            slotKey: 'slotA',
                          })
                        }
                        onDragEnd={handleDragEnd}
                        className="w-full h-full flex items-center justify-center"
                      >
                        {renderCardVisual(tray.slotA)}
                      </div>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] text-[#b45309] font-black font-fun text-center px-1 opacity-70">
                        {lang === 'id' ? 'Tarik kartu' : 'Drop card'}
                      </span>
                    )}
                  </div>
                );
              })()}

              {/* Chunky Wooden Equal Sign Medallion */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ffc800] border-2 border-[#78350f] flex items-center justify-center text-base sm:text-lg font-black text-[#451a03] shadow-[0_2px_0_0_#78350f] flex-shrink-0">
                =
              </div>

              {/* Slot B */}
              {(() => {
                const targetId = `tray-${trayIdx}-slotB`;
                const isHovered = hoveredDropTarget === targetId;
                return (
                  <div
                    onClick={() => handleSlotClick(trayIdx, 'slotB')}
                    onDragOver={(e) => handleDragOver(e, targetId)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDropOnSlot(e, trayIdx, 'slotB')}
                    className={`w-28 h-28 min-[380px]:w-32 min-[380px]:h-32 sm:w-34 sm:h-34 rounded-2xl flex items-center justify-center p-1.5 sm:p-2 transition-all cursor-pointer ${
                      tray.isMatched
                        ? 'bg-white/95 border-2 border-[#10b981] shadow-sm'
                        : isHovered
                        ? 'bg-[#dcfce7] ring-4 ring-[#58cc02] scale-105 shadow-md'
                        : tray.slotB
                        ? 'bg-white/95 border-2 border-[#b45309] shadow-sm hover:scale-105'
                        : 'bg-[#fffbeb]/90 border-2 border-dashed border-[#b45309]/60 hover:bg-white shadow-inner'
                    }`}
                  >
                    {tray.slotB ? (
                      <div
                        draggable={!tray.isMatched}
                        onDragStart={(e) =>
                          handleDragStart(e, {
                            type: 'tray',
                            cardId: tray.slotB!.id,
                            trayIndex: trayIdx,
                            slotKey: 'slotB',
                          })
                        }
                        onDragEnd={handleDragEnd}
                        className="w-full h-full flex items-center justify-center"
                      >
                        {renderCardVisual(tray.slotB)}
                      </div>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] text-[#b45309] font-black font-fun text-center px-1 opacity-70">
                        {lang === 'id' ? 'Tarik kartu' : 'Drop card'}
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* Available Fraction Cards Pool (Drag Source & Drop Return Area) */}
      <div
        onDragOver={(e) => handleDragOver(e, 'pool')}
        onDragLeave={handleDragLeave}
        onDrop={handleDropOnPool}
        className={`bg-[#fff9ed] border-4 rounded-[28px] sm:rounded-[32px] p-3.5 sm:p-6 shadow-[0_6px_0_0_#d9bc8c] sm:shadow-[0_8px_0_0_#d9bc8c] transition-all ${
          hoveredDropTarget === 'pool'
            ? 'border-[#58cc02] bg-[#f0fdf4] ring-4 ring-[#86efac]'
            : 'border-[#ebd5b3]'
        }`}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#b45309] flex items-center gap-1 sm:gap-1.5">
            <span>📦</span>
            <span>{lang === 'id' ? 'Pilihan Kartu (Tarik / Klik):' : 'Available Cards:'}</span>
          </span>
          <span className="text-[11px] sm:text-xs font-black text-[#713f12] bg-[#fef08a] px-2.5 sm:px-3 py-0.5 rounded-full border border-[#ca8a04]">
            {cards.length} {lang === 'id' ? 'tersisa' : 'remaining'}
          </span>
        </div>

        {cards.length === 0 ? (
          <div className="py-4 sm:py-6 text-center text-[#b45309] text-xs sm:text-sm font-bold">
            {lang === 'id'
              ? '✨ Semua kartu sudah diletakkan di nampan! Klik tombol "PERIKSA PASANGAN" di bawah!'
              : '✨ All cards are on trays! Click "CHECK ANSWERS" below!'}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-6 min-h-[100px] sm:min-h-[120px]">
            {cards.map((card) => {
              const isSelected = selectedCardId === card.id;
              const isDragging = dragSource?.cardId === card.id;

              return (
                <div
                  key={card.id}
                  draggable={true}
                  onDragStart={(e) =>
                    handleDragStart(e, {
                      type: 'pool',
                      cardId: card.id,
                    })
                  }
                  onDragEnd={handleDragEnd}
                  onClick={() => handleCardClick(card)}
                  className={`relative p-1.5 sm:p-3 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-all ${
                    isDragging
                      ? 'opacity-40 scale-95'
                      : isSelected
                      ? 'ring-4 ring-[#ffc800] bg-[#fef08a] scale-110 shadow-xl'
                      : 'hover:scale-105 sm:hover:scale-110 hover:-translate-y-1'
                  }`}
                  title={lang === 'id' ? 'Tarik atau klik untuk memilih' : 'Drag or click to pick'}
                >
                  {renderCardVisual(card)}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Action: Big 3D Duolingo Green Button */}
      <div className="flex items-center justify-center gap-3 mt-1">
        <button
          onClick={checkAnswers}
          disabled={!isReadyToCheck}
          className={`btn-3d px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl font-black font-fun text-base sm:text-xl flex items-center gap-2 sm:gap-2.5 shadow-xl transition-all ${
            isReadyToCheck
              ? 'btn-3d-green animate-bounce-slight'
              : 'bg-[#e2e8f0] border-[#cbd5e1] text-slate-400 cursor-not-allowed'
          }`}
        >
          <Check className="w-5 h-5 sm:w-7 sm:h-7 stroke-[3.5]" />
          <span>{lang === 'id' ? 'PERIKSA PASANGAN' : 'CHECK ANSWERS'}</span>
        </button>
      </div>

      {/* Victory Modal */}
      {isVictory && (
        <VictoryModal
          levelId={levelId}
          starsEarned={starsEarned}
          coinsEarned={starsEarned * 10}
          onNextLevel={() => {
            if (levelId < 8) {
              if (onNextLevel) {
                onNextLevel(levelId + 1);
              }
            } else {
              onBackToSelect();
            }
          }}
          onReplay={initLevel}
          onLevelSelect={onBackToSelect}
          hasNextLevel={levelId < 8}
          lang={lang}
        />
      )}
    </div>
  );
};
