import React from 'react';
import { describePieSlice } from '../../utils/fractionsMath';
import { sound } from '../../utils/audioSynth';

interface FractionPizzaProps {
  numerator: number;
  denominator: number;
  size?: number;
  interactive?: boolean;
  onSliceClick?: (index: number) => void;
  className?: string;
  showLabels?: boolean;
  showNumbers?: boolean;
  highlightEqual?: boolean;
}

export const FractionPizza: React.FC<FractionPizzaProps> = ({
  numerator,
  denominator,
  size = 140,
  interactive = false,
  onSliceClick,
  className = '',
  showLabels = false,
  showNumbers = false,
  highlightEqual = false,
}) => {
  const safeDenom = Math.max(1, Math.min(16, denominator));
  const safeNum = Math.max(0, Math.min(safeDenom, numerator));
  const sliceAngle = 360 / safeDenom;
  
  const vbSize = 200;
  const center = vbSize / 2;
  const radius = 84;

  const handleSliceClick = (idx: number) => {
    if (!interactive) return;
    sound.playPop(420 + idx * 35);
    if (onSliceClick) {
      onSliceClick(idx);
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${vbSize} ${vbSize}`}
        className={`overflow-visible transition-all duration-300 ${
          highlightEqual
            ? 'scale-105 drop-shadow-[0_0_18px_rgba(255,200,0,0.95)]'
            : 'drop-shadow-[0_6px_12px_rgba(180,83,9,0.3)]'
        }`}
      >
        <defs>
          {/* Pizza Wooden Serving Plate */}
          <radialGradient id={`woodPlate-${safeDenom}`} cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="70%" stopColor="#f97316" />
            <stop offset="95%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </radialGradient>

          {/* Pizza Crust 3D gradient */}
          <radialGradient id={`crispyCrust-${safeDenom}`} cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>

          {/* Gooey Melted Mozzarella Cheese */}
          <radialGradient id={`gooeyCheese-${safeDenom}`} cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fffdf0" />
            <stop offset="30%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#facc15" />
            <stop offset="90%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>

          {/* Pepperoni 3D */}
          <radialGradient id={`pepSlice-${safeDenom}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="80%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>

          {/* Dough base shadow */}
          <radialGradient id={`doughBase-${safeDenom}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="85%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </radialGradient>
        </defs>

        {/* 1. Whole Base Outer Crust */}
        <circle
          cx={center}
          cy={center}
          r={radius + 6}
          fill={`url(#crispyCrust-${safeDenom})`}
          stroke="#78350f"
          strokeWidth="3.5"
        />

        {/* 2. Empty Plate Inner Base (for un-topped dough) */}
        <circle
          cx={center}
          cy={center}
          r={radius - 2}
          fill={`url(#doughBase-${safeDenom})`}
          stroke="#fde047"
          strokeWidth="1.5"
        />

        {/* 3. Slices */}
        {Array.from({ length: safeDenom }).map((_, i) => {
          const isFilled = i < safeNum;
          const startAngle = i * sliceAngle;
          const endAngle = (i + 1) * sliceAngle;
          const slicePath = describePieSlice(center, center, radius, startAngle, endAngle);
          const crustRimPath = describePieSlice(center, center, radius + 6, startAngle, endAngle);

          // Center coordinate for slice number / topping
          const midAngleRad = (((startAngle + endAngle) / 2 - 90) * Math.PI) / 180;
          const pepDist = radius * 0.55;
          const pepX = center + pepDist * Math.cos(midAngleRad);
          const pepY = center + pepDist * Math.sin(midAngleRad);

          const numDist = radius * 0.75;
          const numX = center + numDist * Math.cos(midAngleRad);
          const numY = center + numDist * Math.sin(midAngleRad);

          return (
            <g
              key={i}
              onClick={() => handleSliceClick(i)}
              className={`transition-all duration-200 ${
                interactive ? 'cursor-pointer hover:opacity-95 hover:filter hover:brightness-105' : ''
              }`}
            >
              {isFilled ? (
                <g>
                  {/* Cheese Slice */}
                  <path
                    d={slicePath}
                    fill={`url(#gooeyCheese-${safeDenom})`}
                    stroke="#ca8a04"
                    strokeWidth="1.8"
                  />
                  {/* Inner Cheese Highlight Arc */}
                  <path
                    d={describePieSlice(center, center, radius * 0.85, startAngle + 1, endAngle - 1)}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    opacity="0.35"
                  />
                  {/* Outer Crust Rim */}
                  <path
                    d={crustRimPath}
                    fill="none"
                    stroke="#92400e"
                    strokeWidth="4.5"
                  />
                  {/* Toppings (Pepperoni & Basil) */}
                  {safeDenom <= 12 && (
                    <g>
                      {/* Pepperoni */}
                      <circle
                        cx={pepX}
                        cy={pepY}
                        r={Math.min(9.5, (radius * 0.38) / Math.sqrt(safeDenom))}
                        fill={`url(#pepSlice-${safeDenom})`}
                        stroke="#7f1d1d"
                        strokeWidth="1.2"
                      />
                      {/* Pepperoni Gloss Dot */}
                      <circle
                        cx={pepX - 2.5}
                        cy={pepY - 2.5}
                        r={Math.min(2.5, radius * 0.08)}
                        fill="#fecaca"
                        opacity="0.85"
                      />
                      {/* Basil Leaf */}
                      {safeDenom <= 8 && (
                        <g>
                          <ellipse
                            cx={pepX + 7}
                            cy={pepY - 4}
                            rx="3.5"
                            ry="2"
                            fill="#16a34a"
                            transform={`rotate(25, ${pepX + 7}, ${pepY - 4})`}
                            stroke="#14532d"
                            strokeWidth="0.8"
                          />
                          <ellipse
                            cx={pepX + 6.5}
                            cy={pepY - 4}
                            rx="2"
                            ry="0.8"
                            fill="#86efac"
                            transform={`rotate(25, ${pepX + 7}, ${pepY - 4})`}
                            opacity="0.8"
                          />
                        </g>
                      )}
                    </g>
                  )}
                </g>
              ) : (
                /* Unfilled slice: dough look with dotted divider */
                <g>
                  <path
                    d={slicePath}
                    fill="#fffdf5"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                </g>
              )}

              {/* Optional Slice Number Indicator */}
              {showNumbers && safeDenom <= 12 && (
                <text
                  x={numX}
                  y={numY + 3.5}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="900"
                  fontFamily="Fredoka, sans-serif"
                  fill={isFilled ? '#713f12' : '#94a3b8'}
                  className="pointer-events-none select-none"
                >
                  {i + 1}
                </text>
              )}
            </g>
          );
        })}

        {/* Center Olive Pin */}
        <circle cx={center} cy={center} r={5.5} fill="#451a03" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx={center - 1.5} cy={center - 1.5} r={1.5} fill="#ffffff" opacity="0.8" />
      </svg>

      {showLabels && (
        <span className="mt-1 text-xs font-black font-fun text-[#713f12] bg-[#fef08a] px-3 py-0.5 rounded-full border-2 border-[#ca8a04] shadow-sm">
          {safeNum} / {safeDenom} Potong
        </span>
      )}
    </div>
  );
};
