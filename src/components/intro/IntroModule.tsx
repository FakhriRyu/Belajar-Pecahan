import React, { useState } from 'react';
import { sound } from '../../utils/audioSynth';
import { MascotBubble } from '../common/MascotBubble';
import {
  Sparkles,
  Target,
  Eye,
  PieChart,
  Calculator,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  Lightbulb,
  Compass,
  Map,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface IntroModuleProps {
  onStartAdventure: () => void;
  onOpenLab: () => void;
  onEarnCoins?: (amount: number) => void;
  lang?: 'id' | 'en';
}

type IntroTab = 'goals' | 'observe-square' | 'observe-circle' | 'methods' | 'practice';

export const IntroModule: React.FC<IntroModuleProps> = ({
  onStartAdventure,
  onOpenLab,
  onEarnCoins,
  lang = 'id',
}) => {
  const [activeTab, setActiveTab] = useState<IntroTab>('goals');

  // Interactive Square Shading State (Persegi a: 4 petak, Persegi b: 8 petak)
  const [shadedSquareA, setShadedSquareA] = useState<number[]>([0]); // index 0 is shaded (1/4)
  const [shadedSquareB, setShadedSquareB] = useState<number[]>([0, 1]); // index 0,1 shaded (2/8)
  const [isOverlaySquare, setIsOverlaySquare] = useState<boolean>(false);

  // Interactive Multiplication Factor Simulator
  const [multiplier, setMultiplier] = useState<number>(2);
  const baseFraction = { num: 1, den: 2 };

  // Interactive Division Simulator
  const [selectedDivExample, setSelectedDivExample] = useState<number>(0);
  const divExamples = [
    { num: 3, den: 6, div: 3, resNum: 1, resDen: 2 },
    { num: 4, den: 8, div: 4, resNum: 1, resDen: 2 },
    { num: 2, den: 4, div: 2, resNum: 1, resDen: 2 },
    { num: 6, den: 12, div: 6, resNum: 1, resDen: 2 },
  ];

  // Practice Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const practiceQuestions = [
    {
      id: 1,
      question:
        lang === 'id'
          ? 'Persegi (a) dibagi menjadi 4 bagian sama besar dan diwarnai 1 bagian. Nilai pecahannya adalah...'
          : 'Square (a) is divided into 4 equal parts and 1 part is colored. The fraction value is...',
      options: ['1/2', '1/4', '2/4', '1/8'],
      correctIndex: 1,
      explanation:
        lang === 'id'
          ? '1 bagian yang diwarnai dari total 4 bagian sama besar melambangkan pecahan 1/4.'
          : '1 colored part out of 4 equal parts represents the fraction 1/4.',
    },
    {
      id: 2,
      question:
        lang === 'id'
          ? 'Persegi (b) dibagi menjadi 8 bagian sama besar. Agar luasnya sama dengan 1/4 bagian persegi (a), berapa bagian persegi (b) yang harus diwarnai?'
          : 'Square (b) is divided into 8 equal parts. To have the same area as 1/4 of square (a), how many parts of square (b) must be colored?',
      options: [
        lang === 'id' ? '1 bagian' : '1 part',
        lang === 'id' ? '2 bagian' : '2 parts',
        lang === 'id' ? '3 bagian' : '3 parts',
        lang === 'id' ? '4 bagian' : '4 parts',
      ],
      correctIndex: 1,
      explanation:
        lang === 'id'
          ? '2 bagian dari 8 petak (2/8) memiliki luas yang persis sama dengan 1 bagian dari 4 petak (1/4). Jadi 1/4 = 2/8.'
          : '2 parts out of 8 (2/8) have the exact same area as 1 part out of 4 (1/4). So 1/4 = 2/8.',
    },
    {
      id: 3,
      question:
        lang === 'id'
          ? 'Mengapa pecahan 1/2, 2/4, 3/6, dan 4/8 disebut pecahan senilai?'
          : 'Why are 1/2, 2/4, 3/6, and 4/8 called equivalent fractions?',
      options: [
        lang === 'id' ? 'Karena angka pembilang dan penyebutnya sama' : 'Because their numerators and denominators are equal',
        lang === 'id' ? 'Karena daerah yang diwarnai memiliki luas yang sama' : 'Because the colored regions represent the exact same area',
        lang === 'id' ? 'Karena jumlah potongannya sama' : 'Because the number of slices is equal',
        lang === 'id' ? 'Karena bentuk lingkarannya berbeda' : 'Because the circle shapes are different',
      ],
      correctIndex: 1,
      explanation:
        lang === 'id'
          ? 'Pecahan senilai adalah pecahan yang melambangkan daerah atau nilai yang sama besar meskipun angkanya berbeda.'
          : 'Equivalent fractions represent the exact same value or area despite having different numerators and denominators.',
    },
    {
      id: 4,
      question:
        lang === 'id'
          ? 'Untuk mencari pecahan yang senilai dengan 1/2, kita dapat mengalikan pembilang dan penyebut dengan 3. Hasilnya adalah...'
          : 'To find a fraction equivalent to 1/2, we multiply the numerator and denominator by 3. The result is...',
      options: ['2/6', '3/5', '3/6', '3/8'],
      correctIndex: 2,
      explanation:
        lang === 'id'
          ? '(1 × 3) / (2 × 3) = 3/6. Jadi 1/2 senilai dengan 3/6.'
          : '(1 × 3) / (2 × 3) = 3/6. Therefore 1/2 is equivalent to 3/6.',
    },
  ];

  const handleTabChange = (tab: IntroTab) => {
    sound.playPop(520);
    setActiveTab(tab);
  };

  const toggleSquareA = (idx: number) => {
    sound.playPop(480);
    setShadedSquareA((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleSquareB = (idx: number) => {
    sound.playPop(480);
    setShadedSquareB((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleAnswerOption = (idx: number) => {
    if (isSubmitted) return;
    sound.playPop(480);
    setSelectedOption(idx);
  };

  const handleSubmitQuestion = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    const isCorrect = selectedOption === practiceQuestions[currentQuestionIdx].correctIndex;
    if (isCorrect) {
      sound.playDing();
      setScore((s) => s + 1);
    } else {
      sound.playBoing();
    }
  };

  const handleNextQuestion = () => {
    sound.playPop(520);
    if (currentQuestionIdx < practiceQuestions.length - 1) {
      setCurrentQuestionIdx((i) => i + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      sound.playFanfare();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffc800', '#58cc02', '#1cb0f6', '#ff4b4b', '#ce82ff'],
      });
      if (onEarnCoins) {
        onEarnCoins(score * 10 + 20);
      }
    }
  };

  const handleRestartQuiz = () => {
    sound.playPop(500);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const getMascotMessage = () => {
    switch (activeTab) {
      case 'goals':
        return lang === 'id'
          ? 'Halo Sahabat Pecahan! Selamat datang di Media Belajar Pecahan Ajaib. Ayo baca tujuan belajar kita hari ini!'
          : 'Hello Fraction Friends! Welcome to the Magic Fraction Learning Media. Let’s review our learning goals today!';
      case 'observe-square':
        return lang === 'id'
          ? 'Ayo amati dua buah persegi sama besar! Bandingkan luas 1/4 dan 2/8. Apakah luasnya sama?'
          : 'Let’s observe two equal squares! Compare the area of 1/4 and 2/8. Are they equal?';
      case 'observe-circle':
        return lang === 'id'
          ? 'Lihatlah 4 lingkaran ini! Meskipun dibagi menjadi 2, 4, 6, dan 8 bagian, daerah yang diwarnai luasnya persis sama (1/2 = 2/4 = 3/6 = 4/8)!'
          : 'Look at these 4 circles! Although divided into 2, 4, 6, and 8 slices, their colored areas are identical!';
      case 'methods':
        return lang === 'id'
          ? 'Pecahan senilai dapat dicari dengan MENGALIKAN atau MEMBAGI pembilang dan penyebut dengan angka yang sama!'
          : 'Find equivalent fractions by MULTIPLYING or DIVIDING the numerator and denominator by the same number!';
      case 'practice':
        return lang === 'id'
          ? 'Hebat! Sekarang selesaikan kuis penugasan sederhana ini untuk membuktikan pemahamanmu!'
          : 'Awesome! Now complete this simple practice quiz to prove your understanding!';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-4 py-1 sm:py-3 px-2 sm:px-4 select-none">
      {/* Top Mascot Bubble */}
      <MascotBubble
        message={getMascotMessage()}
        mood={activeTab === 'practice' ? 'celebrating' : activeTab === 'methods' ? 'teaching' : 'happy'}
        lang={lang}
      />

      {/* Main Container Card */}
      <div className="w-full bg-[#fffdfa] border-4 sm:border-5 border-[#ebd5b3] rounded-[36px] sm:rounded-[44px] shadow-[0_12px_0_0_#d9bc8c] p-4 sm:p-7 flex flex-col items-center">
        
        {/* Module Header Title */}
        <div className="text-center mb-5 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#ffc800] text-[#533800] border-b-4 border-[#d97706] px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-sm font-black font-fun shadow-md">
            <Sparkles className="w-4 h-4 text-[#b45309]" />
            <span>{lang === 'id' ? 'PENDAHULUAN & BAHAN AJAR' : 'INTRODUCTION & LESSON'}</span>
            <Sparkles className="w-4 h-4 text-[#b45309]" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-fun text-[#451a03] mt-2 mb-1">
            {lang === 'id' ? 'Mengenal Konsep Pecahan Senilai' : 'Understanding Equivalent Fractions'}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#78350f] m-0">
            {lang === 'id'
              ? 'Karya Revi Dwi Anjuni, S.Pd.'
              : 'Created by Revi Dwi Anjuni, S.Pd.'}
          </p>
        </div>

        {/* 5 Sub-Navigation Tab Buttons */}
        <div className="w-full flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 mb-6">
          <button
            onClick={() => handleTabChange('goals')}
            className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
              activeTab === 'goals' ? 'btn-3d-yellow' : 'btn-3d-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>{lang === 'id' ? '1. Tujuan Belajar' : '1. Goals'}</span>
          </button>

          <button
            onClick={() => handleTabChange('observe-square')}
            className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
              activeTab === 'observe-square' ? 'btn-3d-green' : 'btn-3d-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{lang === 'id' ? '2. Amati Persegi' : '2. Observe Square'}</span>
          </button>

          <button
            onClick={() => handleTabChange('observe-circle')}
            className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
              activeTab === 'observe-circle' ? 'btn-3d-blue' : 'btn-3d-white'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>{lang === 'id' ? '3. Amati Lingkaran' : '3. Observe Circle'}</span>
          </button>

          <button
            onClick={() => handleTabChange('methods')}
            className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
              activeTab === 'methods' ? 'btn-3d-purple' : 'btn-3d-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{lang === 'id' ? '4. Cara Menentukan' : '4. Methods (× / ÷)'}</span>
          </button>

          <button
            onClick={() => handleTabChange('practice')}
            className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
              activeTab === 'practice' ? 'btn-3d-red animate-pulse' : 'btn-3d-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{lang === 'id' ? '5. Penugasan Kuis' : '5. Practice Quiz'}</span>
          </button>
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: TUJUAN PEMBELAJARAN */}
        {/* ==================================================================== */}
        {activeTab === 'goals' && (
          <div className="w-full flex flex-col gap-6 animate-pop-in">
            {/* Learning Goals Banner */}
            <div className="bg-[#fff5df] p-5 sm:p-6 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#ffc800] border-2 border-[#b45309] flex items-center justify-center text-xl shadow-sm">
                  🎯
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black font-fun text-[#451a03] m-0">
                    {lang === 'id' ? 'Tujuan Pembelajaran' : 'Learning Objectives'}
                  </h3>
                  <p className="text-xs font-bold text-[#b45309] m-0">
                    {lang === 'id'
                      ? 'Setelah mempelajari materi ini, murid diharapkan mencapai hal berikut:'
                      : 'After completing this lesson, students are expected to achieve:'}
                  </p>
                </div>
              </div>

              {/* 3 Goals Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-1">
                {/* Goal 1 */}
                <div className="bg-white p-4 rounded-2xl border-2 border-[#fcd34d] shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-[#fef08a] border border-[#eab308] font-black font-fun text-xs text-[#854d0e] flex items-center justify-center">
                      1
                    </span>
                    <h4 className="text-xs sm:text-sm font-black font-fun text-[#451a03] m-0">
                      {lang === 'id' ? 'Pengertian Pecahan' : 'Fraction Definition'}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug m-0">
                    {lang === 'id'
                      ? 'Melalui kegiatan mengamati media/PPT yang ditampilkan, murid mampu menjelaskan pengertian pecahan senilai dengan tepat.'
                      : 'Through observing the visual media, students can explain the concept of equivalent fractions accurately.'}
                  </p>
                </div>

                {/* Goal 2 */}
                <div className="bg-white p-4 rounded-2xl border-2 border-[#86efac] shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-[#dcfce7] border border-[#22c55e] font-black font-fun text-xs text-[#15803d] flex items-center justify-center">
                      2
                    </span>
                    <h4 className="text-xs sm:text-sm font-black font-fun text-[#14532d] m-0">
                      {lang === 'id' ? 'Menentukan dari Gambar' : 'Identify by Image'}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug m-0">
                    {lang === 'id'
                      ? 'Melalui kegiatan diskusi kelompok, murid mampu menentukan pecahan senilai menggunakan gambar dengan tepat.'
                      : 'Through group discussion, students can determine equivalent fractions using visual models correctly.'}
                  </p>
                </div>

                {/* Goal 3 */}
                <div className="bg-white p-4 rounded-2xl border-2 border-[#7dd3fc] shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-[#e0f2fe] border border-[#0284c7] font-black font-fun text-xs text-[#0369a1] flex items-center justify-center">
                      3
                    </span>
                    <h4 className="text-xs sm:text-sm font-black font-fun text-[#075985] m-0">
                      {lang === 'id' ? 'Penyelesaian Soal' : 'Problem Solving'}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug m-0">
                    {lang === 'id'
                      ? 'Melalui kegiatan penugasan, murid mampu menyelesaikan soal sederhana tentang pecahan senilai dengan tepat.'
                      : 'Through assigned tasks, students can solve basic equivalent fraction problems accurately.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Definition Callout */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] border-2 border-[#86efac] flex items-center justify-center text-3xl flex-shrink-0">
                  💡
                </div>
                <div>
                  <h4 className="text-base font-black font-fun text-[#15803d] m-0">
                    {lang === 'id' ? 'Apa itu Pecahan Senilai?' : 'What are Equivalent Fractions?'}
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 mb-0 leading-relaxed">
                    {lang === 'id'
                      ? 'Pecahan senilai adalah pecahan-pecahan yang memiliki nilai atau luas bagian yang sama, meskipun pembilang dan penyebutnya ditulis dengan angka yang berbeda.'
                      : 'Equivalent fractions are fractions that have the exact same value or area, even though they are written with different numerators and denominators.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleTabChange('observe-square')}
                className="btn-3d btn-3d-green px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black font-fun whitespace-nowrap flex items-center gap-2"
              >
                <span>{lang === 'id' ? 'Mulai Amati Gambar' : 'Start Observing'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: AYO MENGAMATI (PERSEGI BERPETAK - HALAMAN 59) */}
        {/* ==================================================================== */}
        {activeTab === 'observe-square' && (
          <div className="w-full flex flex-col gap-6 animate-pop-in">
            {/* Context Box */}
            <div className="bg-[#f0fdf4] p-5 sm:p-6 rounded-3xl border-3 border-[#bbf7d0] shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🟩</span>
                <h3 className="text-lg sm:text-xl font-black font-fun text-[#14532d] m-0">
                  {lang === 'id' ? 'Ayo Mengamati: Pecahan Senilai Persegi' : 'Observe: Square Equivalent Fractions'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed m-0">
                {lang === 'id'
                  ? 'Ayo amati dua buah persegi sama besar yang masing-masing dibagi menjadi 4 bagian dan 8 bagian sama besar!'
                  : 'Observe two identical squares divided into 4 equal parts and 8 equal parts respectively!'}
              </p>
            </div>

            {/* Interactive Square Observation Canvas */}
            <div className="bg-white p-5 sm:p-7 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col items-center">
              
              {/* Top Controls & Overlay Toggle */}
              <div className="flex items-center justify-between w-full mb-6 flex-wrap gap-2">
                <span className="text-xs font-black text-slate-500">
                  {lang === 'id'
                    ? '💡 Klik petak persegi untuk mengubah arsir warna'
                    : '💡 Click square cells to toggle color shading'}
                </span>
                <button
                  onClick={() => {
                    sound.playPop(500);
                    setIsOverlaySquare(!isOverlaySquare);
                  }}
                  className={`btn-3d px-3.5 py-1.5 rounded-xl text-xs font-black font-fun flex items-center gap-1.5 ${
                    isOverlaySquare ? 'btn-3d-purple' : 'btn-3d-white'
                  }`}
                >
                  <span>{isOverlaySquare ? (lang === 'id' ? 'Pisahkan Persegi' : 'Separate Squares') : (lang === 'id' ? '🔍 Tumpuk & Bandingkan' : '🔍 Overlay & Compare')}</span>
                </button>
              </div>

              {/* Squares Grid Side-by-Side Display */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14 my-3 w-full">
                
                {/* Square A (4 Parts: 2x2) */}
                <div className="flex flex-col items-center gap-3">
                  <div className="text-center">
                    <span className="font-fun font-black text-sm text-[#451a03]">
                      {lang === 'id' ? 'Persegi (a) - 4 Bagian' : 'Square (a) - 4 Parts'}
                    </span>
                    <p className="text-[11px] font-bold text-slate-500 m-0">
                      {shadedSquareA.length} {lang === 'id' ? 'dari 4 petak diwarnai' : 'of 4 cells colored'}
                    </p>
                  </div>

                  {/* 2x2 Square Grid SVG / Container */}
                  <div className="w-40 h-40 sm:w-48 sm:h-48 grid grid-cols-2 grid-rows-2 border-4 border-[#334155] rounded-2xl overflow-hidden bg-white shadow-md">
                    {[0, 1, 2, 3].map((idx) => {
                      const isShaded = shadedSquareA.includes(idx);
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleSquareA(idx)}
                          className={`border-2 border-[#334155] flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                            isShaded ? 'bg-[#86efac] hover:bg-[#4ade80]' : 'bg-white hover:bg-slate-100'
                          }`}
                        >
                          <span className={`font-black font-fun text-xs ${isShaded ? 'text-[#14532d]' : 'text-slate-300'}`}>
                            1/4
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Fraction Value Badge */}
                  <div className="bg-[#f0fdf4] px-4 py-1.5 rounded-2xl border-2 border-[#86efac] font-black font-fun text-lg text-[#15803d]">
                    {shadedSquareA.length} / 4
                  </div>
                </div>

                {/* Equal Sign (=) in Center */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#fef08a] border-3 border-[#ca8a04] flex items-center justify-center font-black font-fun text-2xl text-[#854d0e] shadow-sm">
                    =
                  </div>
                  <span className="text-[11px] font-black text-[#854d0e] mt-1">
                    {lang === 'id' ? 'Senilai' : 'Equal'}
                  </span>
                </div>

                {/* Square B (8 Parts: 2x4) */}
                <div className="flex flex-col items-center gap-3">
                  <div className="text-center">
                    <span className="font-fun font-black text-sm text-[#451a03]">
                      {lang === 'id' ? 'Persegi (b) - 8 Bagian' : 'Square (b) - 8 Parts'}
                    </span>
                    <p className="text-[11px] font-bold text-slate-500 m-0">
                      {shadedSquareB.length} {lang === 'id' ? 'dari 8 petak diwarnai' : 'of 8 cells colored'}
                    </p>
                  </div>

                  {/* 2x4 Square Grid SVG / Container */}
                  <div className="w-40 h-40 sm:w-48 sm:h-48 grid grid-cols-4 grid-rows-2 border-4 border-[#334155] rounded-2xl overflow-hidden bg-white shadow-md">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
                      const isShaded = shadedSquareB.includes(idx);
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleSquareB(idx)}
                          className={`border-2 border-[#334155] flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                            isShaded ? 'bg-[#86efac] hover:bg-[#4ade80]' : 'bg-white hover:bg-slate-100'
                          }`}
                        >
                          <span className={`font-black font-fun text-[10px] ${isShaded ? 'text-[#14532d]' : 'text-slate-300'}`}>
                            1/8
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Fraction Value Badge */}
                  <div className="bg-[#f0fdf4] px-4 py-1.5 rounded-2xl border-2 border-[#86efac] font-black font-fun text-lg text-[#15803d]">
                    {shadedSquareB.length} / 8
                  </div>
                </div>
              </div>

              {/* Conclusion Box from Textbook Page 59 */}
              <div className="w-full bg-[#fffbeb] border-2 border-[#fde047] p-4 sm:p-5 rounded-2xl mt-4">
                <h4 className="text-sm sm:text-base font-black font-fun text-[#854d0e] m-0 mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-[#d97706]" />
                  <span>{lang === 'id' ? 'Kesimpulan Pengamatan:' : 'Observation Conclusion:'}</span>
                </h4>
                <ul className="text-xs sm:text-sm font-bold text-slate-700 m-0 pl-5 flex flex-col gap-1.5">
                  <li>
                    {lang === 'id'
                      ? 'Dua persegi (a) dan (b) memiliki ukuran luas yang sama besar.'
                      : 'Both squares (a) and (b) have the exact same total area.'}
                  </li>
                  <li>
                    {lang === 'id'
                      ? 'Persegi (a) diwarnai 1 bagian (1/4), sedangkan persegi (b) diwarnai 2 bagian (2/8).'
                      : 'Square (a) is shaded 1 part (1/4), while square (b) is shaded 2 parts (2/8).'}
                  </li>
                  <li>
                    {lang === 'id'
                      ? 'Bagian yang diwarnai pada persegi (a) sama luas dengan bagian yang diwarnai pada persegi (b).'
                      : 'The shaded area in square (a) is identical in size to the shaded area in square (b).'}
                  </li>
                  <li className="text-[#15803d] font-black">
                    {lang === 'id'
                      ? '✨ Dikatakan 1/4 dan 2/8 adalah PECAHAN SENILAI ( 1/4 = 2/8 ).'
                      : '✨ Thus 1/4 and 2/8 are EQUIVALENT FRACTIONS ( 1/4 = 2/8 ).'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: PENGAMATAN LINGKARAN (HALAMAN 60 ATAS) */}
        {/* ==================================================================== */}
        {activeTab === 'observe-circle' && (
          <div className="w-full flex flex-col gap-6 animate-pop-in">
            {/* Banner */}
            <div className="bg-[#e0f2fe] p-5 sm:p-6 rounded-3xl border-3 border-[#bae6fd] shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🟢</span>
                <h3 className="text-lg sm:text-xl font-black font-fun text-[#0369a1] m-0">
                  {lang === 'id' ? 'Pecahan Senilai pada Lingkaran' : 'Equivalent Fractions on Circles'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed m-0">
                {lang === 'id'
                  ? 'Perhatikan 4 lingkaran di bawah ini! Semua daerah yang diwarnai hijau memiliki luas yang persis sama (setengah lingkaran).'
                  : 'Look at the 4 circles below! All green shaded regions have the exact same area (half circle).'}
              </p>
            </div>

            {/* 4 Circles Display (1/2, 2/4, 3/6, 4/8) */}
            <div className="bg-white p-5 sm:p-7 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col items-center">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full my-2">
                
                {/* Circle 1: 1/2 */}
                <div className="bg-[#f8fafc] p-4 rounded-3xl border-2 border-slate-200 flex flex-col items-center text-center shadow-sm hover:scale-105 transition-transform">
                  <span className="text-xs font-black text-slate-500 mb-2">
                    {lang === 'id' ? '1 dari 2 Bagian' : '1 of 2 Slices'}
                  </span>
                  <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28">
                    {/* Circle Outline */}
                    <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#334155" strokeWidth="3" />
                    {/* Shaded Left Half (1/2) */}
                    <path d="M 50 5 A 45 45 0 0 0 50 95 Z" fill="#86efac" stroke="#334155" strokeWidth="3" />
                    {/* Divider line */}
                    <line x1="50" y1="5" x2="50" y2="95" stroke="#334155" strokeWidth="3" />
                  </svg>
                  <div className="bg-[#f0fdf4] px-4 py-1.5 rounded-2xl border-2 border-[#86efac] font-black font-fun text-xl text-[#15803d] mt-3">
                    1 / 2
                  </div>
                </div>

                {/* Circle 2: 2/4 */}
                <div className="bg-[#f8fafc] p-4 rounded-3xl border-2 border-slate-200 flex flex-col items-center text-center shadow-sm hover:scale-105 transition-transform">
                  <span className="text-xs font-black text-slate-500 mb-2">
                    {lang === 'id' ? '2 dari 4 Bagian' : '2 of 4 Slices'}
                  </span>
                  <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28">
                    <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#334155" strokeWidth="3" />
                    {/* Left Half (2/4) */}
                    <path d="M 50 5 A 45 45 0 0 0 50 95 Z" fill="#86efac" stroke="#334155" strokeWidth="3" />
                    {/* Divider Lines (Vertical + Horizontal) */}
                    <line x1="50" y1="5" x2="50" y2="95" stroke="#334155" strokeWidth="3" />
                    <line x1="5" y1="50" x2="95" y2="50" stroke="#334155" strokeWidth="3" />
                  </svg>
                  <div className="bg-[#f0fdf4] px-4 py-1.5 rounded-2xl border-2 border-[#86efac] font-black font-fun text-xl text-[#15803d] mt-3">
                    2 / 4
                  </div>
                </div>

                {/* Circle 3: 3/6 */}
                <div className="bg-[#f8fafc] p-4 rounded-3xl border-2 border-slate-200 flex flex-col items-center text-center shadow-sm hover:scale-105 transition-transform">
                  <span className="text-xs font-black text-slate-500 mb-2">
                    {lang === 'id' ? '3 dari 6 Bagian' : '3 of 6 Slices'}
                  </span>
                  <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28">
                    <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#334155" strokeWidth="3" />
                    {/* Left Half (3/6) */}
                    <path d="M 50 5 A 45 45 0 0 0 50 95 Z" fill="#86efac" stroke="#334155" strokeWidth="3" />
                    {/* 6 slice dividers */}
                    <line x1="50" y1="5" x2="50" y2="95" stroke="#334155" strokeWidth="3" />
                    <line x1="11" y1="27.5" x2="89" y2="72.5" stroke="#334155" strokeWidth="3" />
                    <line x1="11" y1="72.5" x2="89" y2="27.5" stroke="#334155" strokeWidth="3" />
                  </svg>
                  <div className="bg-[#f0fdf4] px-4 py-1.5 rounded-2xl border-2 border-[#86efac] font-black font-fun text-xl text-[#15803d] mt-3">
                    3 / 6
                  </div>
                </div>

                {/* Circle 4: 4/8 */}
                <div className="bg-[#f8fafc] p-4 rounded-3xl border-2 border-slate-200 flex flex-col items-center text-center shadow-sm hover:scale-105 transition-transform">
                  <span className="text-xs font-black text-slate-500 mb-2">
                    {lang === 'id' ? '4 dari 8 Bagian' : '4 of 8 Slices'}
                  </span>
                  <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28">
                    <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#334155" strokeWidth="3" />
                    {/* Left Half (4/8) */}
                    <path d="M 50 5 A 45 45 0 0 0 50 95 Z" fill="#86efac" stroke="#334155" strokeWidth="3" />
                    {/* 8 slice dividers */}
                    <line x1="50" y1="5" x2="50" y2="95" stroke="#334155" strokeWidth="3" />
                    <line x1="5" y1="50" x2="95" y2="50" stroke="#334155" strokeWidth="3" />
                    <line x1="18.2" y1="18.2" x2="81.8" y2="81.8" stroke="#334155" strokeWidth="3" />
                    <line x1="18.2" y1="81.8" x2="81.8" y2="18.2" stroke="#334155" strokeWidth="3" />
                  </svg>
                  <div className="bg-[#f0fdf4] px-4 py-1.5 rounded-2xl border-2 border-[#86efac] font-black font-fun text-xl text-[#15803d] mt-3">
                    4 / 8
                  </div>
                </div>
              </div>

              {/* Grand Equation Banner */}
              <div className="w-full bg-[#fef08a] border-3 border-[#eab308] p-4 rounded-2xl text-center mt-3 shadow-sm">
                <span className="text-xs font-black uppercase text-[#854d0e] tracking-wider block mb-1">
                  {lang === 'id' ? 'Rumus Kesetaraan Luas Lingkaran:' : 'Circle Area Equivalence Formula:'}
                </span>
                <span className="font-fun font-black text-xl sm:text-3xl text-[#713f12]">
                  1/2 = 2/4 = 3/6 = 4/8
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: CARA MEMPEROLEH PECAHAN SENILAI (KALI & BAGI) */}
        {/* ==================================================================== */}
        {activeTab === 'methods' && (
          <div className="w-full flex flex-col gap-6 animate-pop-in">
            {/* Header Banner */}
            <div className="bg-[#faf5ff] p-5 sm:p-6 rounded-3xl border-3 border-[#e9d5ff] shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✖️➗</span>
                <h3 className="text-lg sm:text-xl font-black font-fun text-[#581c87] m-0">
                  {lang === 'id' ? 'Bagaimana Cara Memperoleh Pecahan Senilai?' : 'How to Obtain Equivalent Fractions?'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed m-0">
                {lang === 'id'
                  ? 'Pecahan-pecahan senilai dapat dicari dengan cara MENGALIKAN atau MEMBAGI pembilang dan penyebutnya dengan bilangan yang sama (bukan nol).'
                  : 'Equivalent fractions can be found by MULTIPLYING or DIVIDING both the numerator and denominator by the same number (non-zero).'}
              </p>
            </div>

            {/* Method 1: Multiplication (Perkalian) */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[#dcfce7] border border-[#22c55e] font-black font-fun text-sm text-[#15803d] flex items-center justify-center">
                    A
                  </span>
                  <h4 className="text-base sm:text-lg font-black font-fun text-[#14532d] m-0">
                    {lang === 'id' ? '1. Cara Perkalian (Memperbesar Nilai Pembagi)' : '1. Multiplication Method'}
                  </h4>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {lang === 'id' ? 'Kalikan pembilang dan penyebut dengan angka yang sama' : 'Multiply numerator & denominator equally'}
                </span>
              </div>

              {/* Textbook Examples 1/2 x 2, x 3, x 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#fffbeb] p-3.5 rounded-2xl border-2 border-[#fde047] text-center flex flex-col items-center">
                  <span className="text-xs font-black text-[#854d0e] mb-1">
                    {lang === 'id' ? 'Dikalikan 2' : 'Multiply by 2'}
                  </span>
                  <div className="font-fun font-black text-sm text-[#451a03] my-1">
                    1/2 = (1 × 2) / (2 × 2) = <span className="text-lg text-[#15803d]">2/4</span>
                  </div>
                </div>

                <div className="bg-[#fffbeb] p-3.5 rounded-2xl border-2 border-[#fde047] text-center flex flex-col items-center">
                  <span className="text-xs font-black text-[#854d0e] mb-1">
                    {lang === 'id' ? 'Dikalikan 3' : 'Multiply by 3'}
                  </span>
                  <div className="font-fun font-black text-sm text-[#451a03] my-1">
                    1/2 = (1 × 3) / (2 × 3) = <span className="text-lg text-[#15803d]">3/6</span>
                  </div>
                </div>

                <div className="bg-[#fffbeb] p-3.5 rounded-2xl border-2 border-[#fde047] text-center flex flex-col items-center">
                  <span className="text-xs font-black text-[#854d0e] mb-1">
                    {lang === 'id' ? 'Dikalikan 4' : 'Multiply by 4'}
                  </span>
                  <div className="font-fun font-black text-sm text-[#451a03] my-1">
                    1/2 = (1 × 4) / (2 × 4) = <span className="text-lg text-[#15803d]">4/8</span>
                  </div>
                </div>
              </div>

              {/* Interactive Multiplication Simulator */}
              <div className="bg-[#f8fafc] p-4 sm:p-5 rounded-2xl border-2 border-slate-200 flex flex-col items-center mt-1">
                <span className="text-xs font-black text-[#451a03] mb-2">
                  {lang === 'id' ? '🧮 Coba Simulator Perkalian Interaktif:' : '🧮 Try the Interactive Multiplier:'}
                </span>

                <div className="flex items-center gap-2 flex-wrap justify-center mb-3">
                  <span className="text-xs font-bold text-slate-500">
                    {lang === 'id' ? 'Pilih Pengali:' : 'Multiplier:'}
                  </span>
                  {[2, 3, 4, 5, 6].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        sound.playPop(520);
                        setMultiplier(m);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-black font-fun transition-transform ${
                        multiplier === m
                          ? 'bg-[#1cb0f6] text-white scale-110 shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-300'
                      }`}
                    >
                      × {m}
                    </button>
                  ))}
                </div>

                <div className="bg-white px-6 py-3 rounded-2xl border-2 border-[#7dd3fc] font-fun font-black text-lg sm:text-2xl text-[#0369a1] shadow-inner">
                  {baseFraction.num}/{baseFraction.den} = ({baseFraction.num} × {multiplier}) / ({baseFraction.den} × {multiplier}) = <span className="text-[#16a34a] underline">{baseFraction.num * multiplier}/{baseFraction.den * multiplier}</span>
                </div>
              </div>
            </div>

            {/* Method 2: Division (Pembagian / Menyederhanakan) */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[#fef08a] border border-[#eab308] font-black font-fun text-sm text-[#854d0e] flex items-center justify-center">
                    B
                  </span>
                  <h4 className="text-base sm:text-lg font-black font-fun text-[#713f12] m-0">
                    {lang === 'id' ? '2. Cara Pembagian (Menyederhanakan Pecahan)' : '2. Division Method (Simplifying)'}
                  </h4>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {lang === 'id' ? 'Bagi pembilang dan penyebut dengan angka yang sama' : 'Divide numerator & denominator equally'}
                </span>
              </div>

              {/* Textbook Example 3/6 : 3 = 1/2 */}
              <div className="bg-[#fffbeb] p-4 rounded-2xl border-2 border-[#fde047] text-center flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-center sm:text-left">
                  <span className="text-2xl">💡</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 m-0">
                    {lang === 'id'
                      ? 'Untuk mencari pecahan yang senilai dengan 3/6, kita dapat membagi pembilang dan penyebut dengan 3:'
                      : 'To find a fraction equivalent to 3/6, we can divide numerator and denominator by 3:'}
                  </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl border-2 border-[#ca8a04] font-fun font-black text-lg text-[#854d0e] whitespace-nowrap shadow-sm">
                  3/6 = (3 : 3) / (6 : 3) = <span className="text-xl text-[#15803d]">1/2</span>
                </div>
              </div>

              {/* Division Simulator */}
              <div className="bg-[#f8fafc] p-4 sm:p-5 rounded-2xl border-2 border-slate-200 flex flex-col items-center">
                <span className="text-xs font-black text-[#451a03] mb-2">
                  {lang === 'id' ? '🧮 Pilih Contoh Pembagian (Menyederhanakan Pecahan):' : '🧮 Choose a Division Example:'}
                </span>

                <div className="flex items-center gap-2 flex-wrap justify-center mb-3">
                  {divExamples.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sound.playPop(520);
                        setSelectedDivExample(idx);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black font-fun transition-transform ${
                        selectedDivExample === idx
                          ? 'bg-[#b45309] text-white scale-105 shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {ex.num}/{ex.den} : {ex.div}
                    </button>
                  ))}
                </div>

                <div className="bg-white px-6 py-3 rounded-2xl border-2 border-[#fcd34d] font-fun font-black text-lg sm:text-2xl text-[#854d0e] shadow-inner text-center">
                  {divExamples[selectedDivExample].num}/{divExamples[selectedDivExample].den} = ({divExamples[selectedDivExample].num} : {divExamples[selectedDivExample].div}) / ({divExamples[selectedDivExample].den} : {divExamples[selectedDivExample].div}) = <span className="text-[#15803d] underline">{divExamples[selectedDivExample].resNum}/{divExamples[selectedDivExample].resDen}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: KUIS & PENUGASAN PEMAHAMAN (TUJUAN 3) */}
        {/* ==================================================================== */}
        {activeTab === 'practice' && (
          <div className="w-full flex flex-col gap-6 animate-pop-in">
            {!quizFinished ? (
              <div className="bg-white p-5 sm:p-7 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col gap-5">
                {/* Header & Progress Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2 border-b-2 border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black bg-[#ffc800] text-[#533800] px-3 py-1 rounded-full border border-[#d97706]">
                      {lang === 'id'
                        ? `Penugasan ${currentQuestionIdx + 1} dari ${practiceQuestions.length}`
                        : `Question ${currentQuestionIdx + 1} of ${practiceQuestions.length}`}
                    </span>
                    <span className="text-xs font-black text-[#16a34a] bg-[#dcfce7] px-3 py-1 rounded-full border border-[#86efac]">
                      Skor: {score}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {practiceQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className={`w-3 h-3 rounded-full transition-all ${
                          idx === currentQuestionIdx
                            ? 'bg-[#1cb0f6] scale-125'
                            : idx < currentQuestionIdx
                            ? 'bg-[#86efac]'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="bg-[#f8fafc] p-4 sm:p-5 rounded-2xl border-2 border-slate-200">
                  <h3 className="text-base sm:text-xl font-black font-fun text-[#451a03] m-0">
                    {practiceQuestions[currentQuestionIdx].question}
                  </h3>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {practiceQuestions[currentQuestionIdx].options.map((optText, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === practiceQuestions[currentQuestionIdx].correctIndex;

                    let btnStyle = 'btn-3d-white text-slate-800';
                    if (isSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'btn-3d-green text-white';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'btn-3d-red text-white';
                      } else {
                        btnStyle = 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed';
                      }
                    } else if (isSelected) {
                      btnStyle = 'btn-3d-blue text-white';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() => handleAnswerOption(optIdx)}
                        className={`btn-3d p-4 rounded-2xl font-black font-fun text-sm sm:text-base text-left flex items-center justify-between transition-all ${btnStyle}`}
                      >
                        <span>{optText}</span>
                        {isSubmitted && isCorrect && <Check className="w-5 h-5 text-white stroke-[3]" />}
                        {isSubmitted && isSelected && !isCorrect && <X className="w-5 h-5 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on Submit */}
                {isSubmitted && (
                  <div className="bg-[#f0fdf4] border-2 border-[#86efac] p-4 rounded-2xl animate-pop-in">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#15803d] mb-1">
                      <Lightbulb className="w-4 h-4" />
                      <span>{lang === 'id' ? 'Pembahasan:' : 'Explanation:'}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#166534] m-0">
                      {practiceQuestions[currentQuestionIdx].explanation}
                    </p>
                  </div>
                )}

                {/* Submit / Next Button */}
                <div className="flex justify-end mt-2">
                  {!isSubmitted ? (
                    <button
                      disabled={selectedOption === null}
                      onClick={handleSubmitQuestion}
                      className={`btn-3d px-6 py-3 rounded-2xl font-black font-fun text-sm sm:text-base ${
                        selectedOption !== null ? 'btn-3d-green' : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {lang === 'id' ? 'Periksa Jawaban ✓' : 'Check Answer ✓'}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="btn-3d btn-3d-yellow px-6 py-3 rounded-2xl font-black font-fun text-sm sm:text-base flex items-center gap-2"
                    >
                      <span>
                        {currentQuestionIdx < practiceQuestions.length - 1
                          ? lang === 'id'
                            ? 'Soal Berikutnya'
                            : 'Next Question'
                          : lang === 'id'
                          ? 'Lihat Hasil Penugasan 🏆'
                          : 'View Results 🏆'}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Completion Screen */
              <div className="bg-white p-6 sm:p-10 rounded-[36px] border-4 border-[#ebd5b3] shadow-lg flex flex-col items-center text-center animate-pop-in">
                <div className="w-24 h-24 rounded-full bg-[#ffc800] border-4 border-[#78350f] shadow-xl flex items-center justify-center text-5xl mb-4 animate-bounce-slight">
                  🏆
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-fun text-[#451a03] m-0">
                  {lang === 'id' ? 'Luar Biasa! Penugasan Selesai!' : 'Awesome! Assignment Completed!'}
                </h3>
                <p className="text-sm font-bold text-slate-600 mt-1 mb-4">
                  {lang === 'id'
                    ? `Kamu berhasil menjawab ${score} dari ${practiceQuestions.length} soal dengan benar!`
                    : `You answered ${score} out of ${practiceQuestions.length} questions correctly!`}
                </p>

                {/* Score & Coins Badge */}
                <div className="flex items-center gap-3 bg-[#fff8eb] px-6 py-3 rounded-2xl border-2 border-[#fcd34d] mb-6 shadow-sm">
                  <span className="text-xl">🪙</span>
                  <span className="text-base font-black font-fun text-[#713f12]">
                    +{score * 10 + 20} {lang === 'id' ? 'Koin Emas Hadiah Belajar!' : 'Gold Coins Earned!'}
                  </span>
                </div>

                {/* Action Buttons to Continue Adventure */}
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <button
                    onClick={handleRestartQuiz}
                    className="btn-3d btn-3d-white px-5 py-3 rounded-2xl font-black font-fun text-sm flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{lang === 'id' ? 'Ulangi Penugasan' : 'Retake Quiz'}</span>
                  </button>

                  <button
                    onClick={onStartAdventure}
                    className="btn-3d btn-3d-green px-6 py-3 rounded-2xl font-black font-fun text-sm sm:text-base flex items-center gap-2"
                  >
                    <Map className="w-5 h-5" />
                    <span>{lang === 'id' ? 'Mulai Main di Peta Pulau! 🗺️' : 'Start Map Adventure! 🗺️'}</span>
                  </button>

                  <button
                    onClick={onOpenLab}
                    className="btn-3d btn-3d-blue px-5 py-3 rounded-2xl font-black font-fun text-sm flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    <span>{lang === 'id' ? 'Coba Lab Timbangan' : 'Try Scale Lab'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
