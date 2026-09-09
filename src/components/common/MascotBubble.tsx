import React, { useState } from 'react';
import { sound } from '../../utils/audioSynth';

interface MascotBubbleProps {
  message: string;
  mood?: 'happy' | 'thinking' | 'celebrating' | 'teaching';
  onMascotClick?: () => void;
  lang?: 'id' | 'en';
}

export const MascotBubble: React.FC<MascotBubbleProps> = ({
  message,
  mood = 'happy',
  onMascotClick,
  lang = 'id',
}) => {
  const [isWaving, setIsWaving] = useState(false);

  const handleClick = () => {
    sound.playPop(560);
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1000);
    if (onMascotClick) onMascotClick();
  };

  const getMoodBadge = () => {
    switch (mood) {
      case 'celebrating':
        return { text: lang === 'id' ? 'HORE! 🎉' : 'YAY! 🎉', bg: 'bg-[#58cc02] text-white border-[#46a302]' };
      case 'thinking':
        return { text: lang === 'id' ? 'AYO COBA! 💡' : 'TRY THIS! 💡', bg: 'bg-[#ffc800] text-[#533800] border-[#e5a400]' };
      case 'teaching':
        return { text: lang === 'id' ? 'TIPS KOKI 👨‍🍳' : 'CHEF TIP 👨‍🍳', bg: 'bg-[#1cb0f6] text-white border-[#0284c7]' };
      default:
        return { text: lang === 'id' ? 'KIBO SI KOKI' : 'CHEF KIBO', bg: 'bg-[#ff4b4b] text-white border-[#dc2626]' };
    }
  };

  const badge = getMoodBadge();

  return (
    <div className="flex items-end gap-3 max-w-2xl mx-auto my-2 px-2 sm:px-4 select-none w-full">
      {/* Mascot Avatar Container (Authentic Duolingo Cat Mascot Style) */}
      <div
        onClick={handleClick}
        className={`relative cursor-pointer group flex-shrink-0 transition-transform ${
          isWaving || mood === 'celebrating' ? 'animate-hop' : 'animate-float-bob'
        }`}
        title="Klik Kibo untuk sapaan!"
      >
        {/* Soft Duolingo style drop halo */}
        <div className="absolute -inset-1 rounded-full bg-[#ff9600] opacity-30 blur-sm group-hover:opacity-70 transition-opacity" />

        {/* Mascot Avatar Box */}
        <div className="relative w-18 h-18 sm:w-22 sm:h-22 bg-[#fff5df] rounded-full border-4 border-[#78350f] shadow-[0_5px_0_0_#451a03] flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Background Sky Glow */}
            <circle cx="60" cy="60" r="58" fill="#fffbeb" />

            {/* Cat Ears (Chunky & Rounded) */}
            {/* Left Ear */}
            <path
              d="M 32 46 C 24 32, 28 14, 46 22 C 48 30, 44 42, 32 46 Z"
              fill="#fb923c"
              stroke="#78350f"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Left Ear Pink Pad */}
            <path
              d="M 34 38 C 30 28, 32 18, 42 24 Z"
              fill="#f472b6"
            />

            {/* Right Ear */}
            <path
              d="M 88 46 C 96 32, 92 14, 74 22 C 72 30, 76 42, 88 46 Z"
              fill="#fb923c"
              stroke="#78350f"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Right Ear Pink Pad */}
            <path
              d="M 86 38 C 90 28, 88 18, 78 24 Z"
              fill="#f472b6"
            />

            {/* Chubby Head Base */}
            <ellipse
              cx="60"
              cy="64"
              rx="38"
              ry="34"
              fill="#fb923c"
              stroke="#78350f"
              strokeWidth="4.5"
            />

            {/* Forehead Ginger Tabby Stripes */}
            <path d="M 60 34 L 60 42" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
            <path d="M 52 36 L 50 43" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
            <path d="M 68 36 L 70 43" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />

            {/* White Belly/Cheek Fluff Base */}
            <ellipse
              cx="60"
              cy="76"
              rx="24"
              ry="18"
              fill="#ffffff"
            />

            {/* Rosy Cheeks (Duolingo Style) */}
            <ellipse cx="32" cy="70" rx="7" ry="4.5" fill="#fb7185" opacity="0.65" />
            <ellipse cx="88" cy="70" rx="7" ry="4.5" fill="#fb7185" opacity="0.65" />

            {/* Eyes Section (Duolingo Style: Big, expressive, glistening) */}
            {mood === 'celebrating' ? (
              /* Joyful closed crescent eyes ^ ^ */
              <g>
                <path
                  d="M 38 60 C 42 50, 52 50, 56 60"
                  fill="none"
                  stroke="#451a03"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M 64 60 C 68 50, 78 50, 82 60"
                  fill="none"
                  stroke="#451a03"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </g>
            ) : mood === 'thinking' ? (
              /* Curious thinking eye glance */
              <g>
                {/* Eyebrows */}
                <path d="M 38 46 Q 46 41 52 48" fill="none" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 68 49 Q 74 44 82 46" fill="none" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />

                {/* Left Eye */}
                <circle cx="47" cy="58" r="8" fill="#451a03" />
                <circle cx="45" cy="55" r="3" fill="#ffffff" />
                <circle cx="49" cy="61" r="1.5" fill="#ffffff" />

                {/* Right Eye */}
                <circle cx="73" cy="58" r="8" fill="#451a03" />
                <circle cx="71" cy="55" r="3" fill="#ffffff" />
                <circle cx="75" cy="61" r="1.5" fill="#ffffff" />
              </g>
            ) : (
              /* Happy standard sparkling Duolingo eyes */
              <g>
                {/* Eyebrows */}
                <path d="M 40 47 Q 47 43 54 47" fill="none" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 66 47 Q 73 43 80 47" fill="none" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />

                {/* Left Eye Sclera & Big Pupil */}
                <ellipse cx="46" cy="59" rx="8" ry="9.5" fill="#451a03" />
                <ellipse cx="44" cy="56" rx="3.5" ry="4" fill="#ffffff" />
                <circle cx="49" cy="63" r="1.5" fill="#ffffff" />

                {/* Right Eye Sclera & Big Pupil */}
                <ellipse cx="74" cy="59" rx="8" ry="9.5" fill="#451a03" />
                <ellipse cx="72" cy="56" rx="3.5" ry="4" fill="#ffffff" />
                <circle cx="77" cy="63" r="1.5" fill="#ffffff" />
              </g>
            )}

            {/* Cute Pink Nose */}
            <path
              d="M 57 69 Q 60 67 63 69 Q 60 73 57 69 Z"
              fill="#f43f5e"
              stroke="#78350f"
              strokeWidth="1.5"
            />

            {/* Cute Cat Mouth (ω smile) */}
            {mood === 'celebrating' ? (
              /* Big open joyful mouth with tongue */
              <g>
                <path
                  d="M 52 72 Q 60 70 68 72 Q 60 85 52 72 Z"
                  fill="#991b1b"
                  stroke="#78350f"
                  strokeWidth="2.5"
                />
                <ellipse cx="60" cy="78" rx="4.5" ry="3" fill="#f43f5e" />
              </g>
            ) : mood === 'thinking' ? (
              /* Cute curious 'o' mouth */
              <ellipse cx="60" cy="75" rx="3" ry="3.5" fill="#451a03" />
            ) : (
              /* Sweet friendly cat smile */
              <path
                d="M 51 72 Q 55 76 60 72 Q 65 76 69 72"
                fill="none"
                stroke="#451a03"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            )}

            {/* Cute Whiskers */}
            <line x1="22" y1="67" x2="33" y2="69" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="22" y1="74" x2="34" y2="73" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="98" y1="67" x2="87" y2="69" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="98" y1="74" x2="86" y2="73" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />

            {/* Chef Hat on Top (Duolingo Style: Cute, Puffy & Clean) */}
            <g>
              {/* Hat Puffs */}
              <circle cx="50" cy="19" r="10" fill="#ffffff" stroke="#78350f" strokeWidth="3" />
              <circle cx="70" cy="19" r="10" fill="#ffffff" stroke="#78350f" strokeWidth="3" />
              <circle cx="60" cy="14" r="12" fill="#ffffff" stroke="#78350f" strokeWidth="3" />
              <circle cx="60" cy="17" r="11" fill="#ffffff" />
              <circle cx="51" cy="20" r="9" fill="#ffffff" />
              <circle cx="69" cy="20" r="9" fill="#ffffff" />

              {/* Hat Band */}
              <rect
                x="44"
                y="24"
                width="32"
                height="10"
                rx="3"
                fill="#ffffff"
                stroke="#78350f"
                strokeWidth="3"
              />
              <rect
                x="46"
                y="27"
                width="28"
                height="4"
                rx="2"
                fill="#ff4b4b"
              />
            </g>

            {/* Waving Paw on the side */}
            <g className={isWaving ? 'animate-bounce-slight' : ''}>
              <ellipse
                cx="100"
                cy="88"
                rx="9"
                ry="8"
                fill="#fb923c"
                stroke="#78350f"
                strokeWidth="3.5"
              />
              <circle cx="100" cy="88" r="3.5" fill="#fffbeb" />
            </g>
          </svg>
        </div>
      </div>

      {/* Comic Speech Balloon (Duolingo Style) */}
      <div className="relative bg-white border-4 border-[#ebd5b3] rounded-3xl rounded-bl-none p-3.5 sm:p-4 shadow-[0_6px_0_0_#d9bc8c] text-slate-800 flex-1">
        {/* Tail */}
        <div className="absolute -left-3 bottom-0 w-0 h-0 border-t-[12px] border-t-transparent border-r-[16px] border-r-[#ebd5b3] border-b-[2px] border-b-transparent" />
        <div className="absolute -left-[7px] bottom-[3px] w-0 h-0 border-t-[9px] border-t-transparent border-r-[12px] border-r-white border-b-[2px] border-b-transparent" />

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border-b-2 shadow-sm ${badge.bg}`}>
              {badge.text}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug m-0 font-sans">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
