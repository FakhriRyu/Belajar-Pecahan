import React from 'react';
import { sound } from '../../utils/audioSynth';

interface FractionBeakerProps {
  numerator: number;
  denominator: number;
  width?: number;
  height?: number;
  interactive?: boolean;
  onLevelClick?: (level: number) => void;
  className?: string;
  showLabels?: boolean;
  highlightEqual?: boolean;
}

export const FractionBeaker: React.FC<FractionBeakerProps> = ({
  numerator,
  denominator,
  width = 110,
  height = 150,
  interactive = false,
  onLevelClick,
  className = '',
  showLabels = false,
  highlightEqual = false,
}) => {
  const safeDenom = Math.max(1, Math.min(16, denominator));
  const safeNum = Math.max(0, Math.min(safeDenom, numerator));

  // Normalized viewBox dimensions for consistent, crisp rendering
  const vbW = 120;
  const vbH = 160;

  const glassLeft = 26;
  const glassRight = 98;
  const glassWidth = glassRight - glassLeft;
  const glassTop = 22;
  const glassBottom = 142;
  const glassHeight = glassBottom - glassTop;

  const liquidFillRatio = safeNum / safeDenom;
  const liquidHeight = glassHeight * liquidFillRatio;
  const liquidY = glassBottom - liquidHeight;

  const handleTickClick = (level: number) => {
    if (!interactive) return;
    sound.playPop(460 + level * 28);
    if (onLevelClick) {
      onLevelClick(level);
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
            ? 'scale-105 drop-shadow-[0_0_16px_rgba(255,200,0,0.95)]'
            : 'drop-shadow-[0_6px_10px_rgba(14,116,144,0.25)]'
        }`}
      >
        <defs>
          {/* Crisp, clean cyan fruit juice liquid */}
          <linearGradient id="cleanJuice" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Glass edge shine gradient */}
          <linearGradient id="glassSideShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Glass Beaker Outer Body with Spout */}
        <path
          d={`
            M 20 ${glassTop}
            L 12 ${glassTop - 6}
            L 22 ${glassTop - 2}
            L ${glassRight + 4} ${glassTop - 2}
            L ${glassRight + 4} ${glassTop}
            L ${glassRight} ${glassBottom - 10}
            Q ${glassRight} ${glassBottom} ${glassRight - 10} ${glassBottom}
            L ${glassLeft + 10} ${glassBottom}
            Q ${glassLeft} ${glassBottom} ${glassLeft} ${glassBottom - 10}
            Z
          `}
          fill="#f0f9ff"
          stroke="#0284c7"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* 2. Liquid Body (Only if filled) */}
        {liquidHeight > 0 && (
          <g className="pointer-events-none">
            {/* Liquid Fill Path */}
            <path
              d={`
                M ${glassLeft + 3} ${liquidY}
                L ${glassRight - 3} ${liquidY}
                L ${glassRight - 3} ${glassBottom - 8}
                Q ${glassRight - 3} ${glassBottom - 3} ${glassRight - 10} ${glassBottom - 3}
                L ${glassLeft + 10} ${glassBottom - 3}
                Q ${glassLeft + 3} ${glassBottom - 3} ${glassLeft + 3} ${glassBottom - 8}
                Z
              `}
              fill="url(#cleanJuice)"
              className="transition-all duration-300"
            />
            {/* Clean Liquid Top Surface (Meniscus) */}
            <ellipse
              cx={(glassLeft + glassRight) / 2}
              cy={liquidY}
              rx={(glassWidth - 6) / 2}
              ry="4"
              fill="#7dd3fc"
              stroke="#0284c7"
              strokeWidth="1"
            />
            {/* 2 Subtle cute bubbles */}
            {liquidHeight > 20 && (
              <>
                <circle
                  cx={glassLeft + glassWidth * 0.65}
                  cy={liquidY + liquidHeight * 0.55}
                  r="3.5"
                  fill="#ffffff"
                  opacity="0.8"
                />
                <circle
                  cx={glassLeft + glassWidth * 0.4}
                  cy={liquidY + liquidHeight * 0.75}
                  r="2.5"
                  fill="#ffffff"
                  opacity="0.75"
                />
              </>
            )}
          </g>
        )}

        {/* 3. Clean Measurement Ruler Ticks (Left Edge Only) */}
        {Array.from({ length: safeDenom + 1 }).map((_, i) => {
          const tickY = glassBottom - (glassHeight / safeDenom) * i;
          const isMain = i === 0 || i === safeDenom || i === safeNum;
          const tickLen = isMain ? 14 : 9;

          return (
            <g key={`tick-${i}`} className="pointer-events-none">
              {/* Solid clean tick mark on left border */}
              <line
                x1={glassLeft}
                y1={tickY}
                x2={glassLeft + tickLen}
                y2={tickY}
                stroke={i <= safeNum ? '#ffffff' : '#0284c7'}
                strokeWidth={isMain ? 3 : 2}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* 4. Glossy Glass Reflection Highlight */}
        <path
          d={`M ${glassLeft + 5} ${glassTop + 6} L ${glassLeft + 5} ${glassBottom - 12}`}
          stroke="url(#glassSideShine)"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="pointer-events-none"
        />

        {/* 5. Clean Interactive Touch Zones (Full width per tick) */}
        {interactive && (
          <g>
            {/* Level 0 Zone (Bottom) */}
            <rect
              x={glassLeft - 6}
              y={glassBottom - 8}
              width={glassWidth + 12}
              height={18}
              fill="transparent"
              className="cursor-pointer hover:fill-red-400/20 transition-colors"
              onClick={() => handleTickClick(0)}
            >
              <title>Kosongkan Gelas (0/{safeDenom})</title>
            </rect>

            {/* Level 1..safeDenom Hit Strips */}
            {Array.from({ length: safeDenom }).map((_, idx) => {
              const lvl = idx + 1;
              const stepH = glassHeight / safeDenom;
              const zoneY = glassBottom - lvl * stepH;

              return (
                <rect
                  key={`zone-${lvl}`}
                  x={glassLeft - 6}
                  y={zoneY}
                  width={glassWidth + 12}
                  height={stepH}
                  fill="transparent"
                  className="cursor-pointer hover:fill-sky-400/25 transition-colors"
                  onClick={() => handleTickClick(lvl === safeNum ? lvl - 1 : lvl)}
                >
                  <title>Isi ke takaran {lvl}/{safeDenom}</title>
                </rect>
              );
            })}
          </g>
        )}
      </svg>

      {showLabels && (
        <span className="mt-1 text-xs font-black font-fun text-[#0369a1] bg-[#e0f2fe] px-3 py-0.5 rounded-full border-2 border-[#38bdf8] shadow-sm">
          🧃 {safeNum} / {safeDenom} Takaran
        </span>
      )}
    </div>
  );
};
