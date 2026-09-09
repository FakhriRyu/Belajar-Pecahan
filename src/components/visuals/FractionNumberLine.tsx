import React from 'react';
import { sound } from '../../utils/audioSynth';

interface FractionNumberLineProps {
  numerator: number;
  denominator: number;
  width?: number;
  height?: number;
  interactive?: boolean;
  onPointClick?: (point: number) => void;
  className?: string;
  showLabels?: boolean;
  highlightEqual?: boolean;
}

export const FractionNumberLine: React.FC<FractionNumberLineProps> = ({
  numerator,
  denominator,
  width = 240,
  height = 80,
  interactive = false,
  onPointClick,
  className = '',
  showLabels = false,
  highlightEqual = false,
}) => {
  const safeDenom = Math.max(1, Math.min(16, denominator));
  const safeNum = Math.max(0, Math.min(safeDenom, numerator));

  // Normalized 240 x 86 internal vector space (never clips!)
  const vbW = 240;
  const vbH = 86;
  const paddingX = 26;
  const lineY = 46;
  const lineWidth = vbW - paddingX * 2; // 188
  const stepWidth = lineWidth / safeDenom;
  const activeX = paddingX + safeNum * stepWidth;

  const handlePointClick = (idx: number) => {
    if (!interactive) return;
    sound.playPop(500 + idx * 25);
    if (onPointClick) {
      onPointClick(idx);
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${vbW} ${vbH}`}
        className={`overflow-visible transition-all duration-300 ${
          highlightEqual
            ? 'scale-105 drop-shadow-[0_0_16px_rgba(255,200,0,0.85)]'
            : 'drop-shadow-[0_4px_0_rgba(168,85,247,0.2)]'
        }`}
      >
        <defs>
          <linearGradient id="rainbowBridge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Wooden Sleeper Ties Background Track */}
        <rect
          x={paddingX - 6}
          y={lineY - 7}
          width={lineWidth + 12}
          height={14}
          rx="7"
          fill="#fef3c7"
          stroke="#d97706"
          strokeWidth="2.5"
        />

        {/* Rainbow Track Ribbon */}
        {safeNum > 0 && (
          <rect
            x={paddingX}
            y={lineY - 4.5}
            width={safeNum * stepWidth}
            height={9}
            rx="4.5"
            fill="url(#rainbowBridge)"
            className="transition-all duration-300"
          />
        )}

        {/* Endpoints 0 and 1 with Green Milestone Badges */}
        <g transform={`translate(${paddingX}, ${lineY + 22})`} className="pointer-events-none">
          <rect x="-11" y="-8" width="22" height="16" rx="5" fill="#58cc02" stroke="#46a302" strokeWidth="1.5" />
          <text x="0" y="3.5" textAnchor="middle" fontSize="10" fontWeight="900" fontFamily="Fredoka, sans-serif" fill="#ffffff">0</text>
        </g>

        <g transform={`translate(${paddingX + lineWidth}, ${lineY + 22})`} className="pointer-events-none">
          <rect x="-11" y="-8" width="22" height="16" rx="5" fill="#58cc02" stroke="#46a302" strokeWidth="1.5" />
          <text x="0" y="3.5" textAnchor="middle" fontSize="10" fontWeight="900" fontFamily="Fredoka, sans-serif" fill="#ffffff">1</text>
        </g>

        {/* Intermediate Ticks & Click Targets */}
        {Array.from({ length: safeDenom + 1 }).map((_, i) => {
          const x = paddingX + i * stepWidth;
          const isSelected = i === safeNum;

          return (
            <g
              key={i}
              onClick={() => handlePointClick(i)}
              className={interactive ? 'cursor-pointer' : ''}
            >
              {/* Tick Mark Line */}
              <line
                x1={x}
                y1={lineY - 9}
                x2={x}
                y2={lineY + 9}
                stroke={isSelected ? '#a855f7' : '#b45309'}
                strokeWidth={isSelected ? 3.5 : 2}
                strokeLinecap="round"
                className="pointer-events-none"
              />
              {/* Generous Hit Circle for easy tapping */}
              <circle
                cx={x}
                cy={lineY}
                r={Math.max(14, stepWidth / 2)}
                fill="transparent"
                className="hover:fill-purple-400/25 transition-colors"
              />
            </g>
          );
        })}

        {/* Cute Jumping Cart / Pin at current value (Above Track) */}
        <g transform={`translate(${activeX}, 24)`} className="transition-transform duration-300 animate-bounce-slight pointer-events-none">
          <circle cx="0" cy="0" r="11" fill="#ffc800" stroke="#78350f" strokeWidth="2.5" />
          <polygon points="-5,8 5,8 0,16" fill="#ffc800" stroke="#78350f" strokeWidth="1.5" />
          <text x="0" y="4" textAnchor="middle" fontSize="11">⭐</text>
        </g>
      </svg>

      {showLabels && (
        <span className="mt-2 text-xs font-black font-fun text-[#6b21a8] bg-[#f3e8ff] px-3 py-1 rounded-2xl border-2 border-[#c084fc] shadow-sm">
          📏 Titik {safeNum} / {safeDenom}
        </span>
      )}
    </div>
  );
};
