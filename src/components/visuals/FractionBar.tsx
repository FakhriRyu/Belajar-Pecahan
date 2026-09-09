import React from 'react';
import { sound } from '../../utils/audioSynth';

interface FractionBarProps {
  numerator: number;
  denominator: number;
  width?: number;
  height?: number;
  interactive?: boolean;
  onSegmentClick?: (index: number) => void;
  className?: string;
  showLabels?: boolean;
  highlightEqual?: boolean;
}

export const FractionBar: React.FC<FractionBarProps> = ({
  numerator,
  denominator,
  width = 160,
  height = 56,
  interactive = false,
  onSegmentClick,
  className = '',
  showLabels = false,
  highlightEqual = false,
}) => {
  const safeDenom = Math.max(1, Math.min(16, denominator));
  const safeNum = Math.max(0, Math.min(safeDenom, numerator));
  
  // Standard SVG viewBox dimensions
  const vbW = 200;
  const vbH = 64;
  const pad = 6;
  const segWidth = (vbW - pad * 2) / safeDenom;
  const segHeight = vbH - pad * 2;

  const handleSegmentClick = (idx: number) => {
    if (!interactive) return;
    sound.playPop(440 + idx * 30);
    if (onSegmentClick) {
      onSegmentClick(idx);
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${vbW} ${vbH}`}
        className={`overflow-visible transition-all duration-300 ${
          highlightEqual
            ? 'scale-105 drop-shadow-[0_0_18px_rgba(255,200,0,0.95)]'
            : 'drop-shadow-[0_6px_10px_rgba(120,53,15,0.3)]'
        }`}
      >
        <defs>
          {/* Milk Chocolate 3D Bevel Gradient */}
          <linearGradient id={`richChoco-${safeDenom}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9a5b13" />
            <stop offset="25%" stopColor="#78350f" />
            <stop offset="80%" stopColor="#542407" />
            <stop offset="100%" stopColor="#381504" />
          </linearGradient>

          {/* Chocolate Top Highlight */}
          <linearGradient id={`chocoHighlight-${safeDenom}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Golden Foil Wrapper Metallic Gradient */}
          <linearGradient id={`goldFoil-${safeDenom}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="75%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Inner Tray Shadow */}
          <linearGradient id={`trayInner-${safeDenom}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
        </defs>

        {/* Outer Chocolate Foil Wrapper Base with 3D Lip */}
        <rect
          x="2"
          y="2"
          width={vbW - 4}
          height={vbH - 4}
          rx="14"
          fill={`url(#goldFoil-${safeDenom})`}
          stroke="#78350f"
          strokeWidth="2.5"
        />

        {/* Foil Shimmer Streak */}
        <path
          d={`M 14 5 L ${vbW - 24} 5 L ${vbW - 40} 10 L 8 10 Z`}
          fill="#ffffff"
          opacity="0.45"
        />

        {/* Inner Plate Bed */}
        <rect
          x="5"
          y="5"
          width={vbW - 10}
          height={vbH - 10}
          rx="10"
          fill={`url(#trayInner-${safeDenom})`}
          stroke="#ca8a04"
          strokeWidth="1.2"
        />

        {/* Chocolate Segments */}
        {Array.from({ length: safeDenom }).map((_, i) => {
          const isFilled = i < safeNum;
          const x = pad + 2 + i * segWidth;
          const y = pad + 2;
          const w = segWidth - 4;
          const h = segHeight - 4;

          return (
            <g
              key={i}
              onClick={() => handleSegmentClick(i)}
              className={`transition-all duration-200 ${
                interactive ? 'cursor-pointer hover:opacity-95 hover:filter hover:brightness-110' : ''
              }`}
            >
              {isFilled ? (
                <>
                  {/* Filled Chocolate Piece Outer Block */}
                  <rect
                    x={x}
                    y={y}
                    width={Math.max(2, w)}
                    height={Math.max(2, h)}
                    rx="6"
                    fill={`url(#richChoco-${safeDenom})`}
                    stroke="#2e1065"
                    strokeWidth="1.2"
                  />
                  {/* Top Edge Gloss Streak */}
                  <rect
                    x={x + 1.5}
                    y={y + 1.5}
                    width={Math.max(1, w - 3)}
                    height="3.5"
                    rx="2"
                    fill="#fed7aa"
                    opacity="0.5"
                  />
                  {/* Embossed Inner Chocolate Well (Pyramid/Pillow inset) */}
                  <rect
                    x={x + 3}
                    y={y + 3}
                    width={Math.max(2, w - 6)}
                    height={Math.max(2, h - 6)}
                    rx="3"
                    fill={`url(#chocoHighlight-${safeDenom})`}
                    stroke="#451a03"
                    strokeWidth="0.8"
                  />
                </>
              ) : (
                /* Empty / Eaten Block Slot */
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={Math.max(2, w)}
                    height={Math.max(2, h)}
                    rx="6"
                    fill="#ffffff"
                    stroke="#cbd5e1"
                    strokeWidth="1.8"
                    strokeDasharray="4 3"
                  />
                  <rect
                    x={x + 3}
                    y={y + 3}
                    width={Math.max(2, w - 6)}
                    height={Math.max(2, h - 6)}
                    rx="4"
                    fill="#f1f5f9"
                    opacity="0.6"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {showLabels && (
        <span className="mt-1 text-xs font-black font-fun text-[#451a03] bg-[#fef08a] px-3 py-0.5 rounded-full border-2 border-[#ca8a04] shadow-sm">
          {safeNum} / {safeDenom} Balok
        </span>
      )}
    </div>
  );
};
