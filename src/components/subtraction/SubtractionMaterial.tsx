import React, { useState } from 'react';
import { sound } from '../../utils/audioSynth';
import { MascotBubble } from '../common/MascotBubble';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Lightbulb,
  Layers,
  ArrowDownCircle,
  Trophy,
  Check,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubtractionMaterialProps {
  onEarnCoins?: (amount: number) => void;
  lang?: 'id' | 'en';
}

type SubTab = 'concept' | 'no-borrow' | 'with-borrow' | 'story' | 'quiz';

export const SubtractionMaterial: React.FC<SubtractionMaterialProps> = ({
  onEarnCoins,
  lang = 'id',
}) => {
  const [activeTab, setActiveTab] = useState<SubTab>('concept');

  // Interactive Place Value Demo State
  const [customNum, setCustomNum] = useState<number>(735);

  // Step-by-step player for "Tanpa Meminjam" (567 - 234)
  const [stepNoBorrow, setStepNoBorrow] = useState<number>(0);

  // Step-by-step player for "Dengan Meminjam" (352 - 127)
  const [stepWithBorrow, setStepWithBorrow] = useState<number>(0);

  // Interactive Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const quizQuestions = [
    {
      id: 1,
      question:
        lang === 'id'
          ? 'Pada bilangan 735, angka 3 menempati nilai tempat apa?'
          : 'In the number 735, what place value does the digit 3 hold?',
      options: [
        lang === 'id' ? 'A. Ratusan' : 'A. Hundreds',
        lang === 'id' ? 'B. Puluhan' : 'B. Tens',
        lang === 'id' ? 'C. Satuan' : 'C. Ones',
        lang === 'id' ? 'D. Ribuan' : 'D. Thousands',
      ],
      correctIndex: 1,
      explanation:
        lang === 'id'
          ? '735 terdiri dari 7 Ratusan (700), 3 Puluhan (30), dan 5 Satuan (5).'
          : '735 consists of 7 Hundreds (700), 3 Tens (30), and 5 Ones (5).',
    },
    {
      id: 2,
      question:
        lang === 'id'
          ? 'Berapakah hasil dari 567 − 234?'
          : 'What is the result of 567 − 234?',
      options: ['333', '323', '343', '313'],
      correctIndex: 0,
      explanation:
        lang === 'id'
          ? 'Satuan: 7 - 4 = 3, Puluhan: 6 - 3 = 3, Ratusan: 5 - 2 = 3. Hasilnya adalah 333.'
          : 'Ones: 7 - 4 = 3, Tens: 6 - 3 = 3, Hundreds: 5 - 2 = 3. The result is 333.',
    },
    {
      id: 3,
      question:
        lang === 'id'
          ? 'Pada pengurangan 352 − 127, mengapa kita perlu meminjam pada langkah satuan?'
          : 'In 352 − 127, why do we need to borrow at the ones step?',
      options: [
        lang === 'id'
          ? 'A. Karena angka 2 lebih besar dari 7'
          : 'A. Because 2 is greater than 7',
        lang === 'id'
          ? 'B. Karena angka 2 lebih kecil dari 7 dan tidak cukup dikurangi'
          : 'B. Because 2 is smaller than 7 and cannot be subtracted directly',
        lang === 'id'
          ? 'C. Karena angka ratusannya berbeda'
          : 'C. Because the hundreds digit is different',
        lang === 'id'
          ? 'D. Karena tanda pengurangannya (−)'
          : 'D. Because of the subtraction sign (−)',
      ],
      correctIndex: 1,
      explanation:
        lang === 'id'
          ? 'Angka 2 pada satuan lebih kecil dari 7, sehingga harus meminjam 1 puluhan (10 satuan) dari angka 5.'
          : 'The digit 2 in ones is smaller than 7, so it must borrow 1 ten (10 ones) from digit 5.',
    },
    {
      id: 4,
      question:
        lang === 'id'
          ? '1 puluhan bernilai sama dengan berapa satuan?'
          : '1 ten is equal to how many ones?',
      options: [
        lang === 'id' ? '5 satuan' : '5 ones',
        lang === 'id' ? '10 satuan' : '10 ones',
        lang === 'id' ? '100 satuan' : '100 ones',
        lang === 'id' ? '1 satuan' : '1 one',
      ],
      correctIndex: 1,
      explanation:
        lang === 'id'
          ? 'Ingat rumus emas: 1 Puluhan = 10 Satuan, dan 1 Ratusan = 10 Puluhan.'
          : 'Golden rule: 1 Ten = 10 Ones, and 1 Hundred = 10 Tens.',
    },
    {
      id: 5,
      question:
        lang === 'id'
          ? 'Dina mempunyai uang Rp500. Ia membeli makanan seharga Rp350. Berapakah uang kembalian Dina?'
          : 'Dina has Rp500. She buys food for Rp350. How much is her change?',
      options: ['Rp100', 'Rp150', 'Rp200', 'Rp250'],
      correctIndex: 1,
      explanation:
        lang === 'id'
          ? 'Rp500 − Rp350 = Rp150. Jadi uang kembalian Dina adalah Rp150.'
          : 'Rp500 − Rp350 = Rp150. Thus Dina’s change is Rp150.',
    },
    {
      id: 6,
      question:
        lang === 'id'
          ? 'Saat melakukan pengurangan bersusun, urutan pengerjaan yang benar adalah dari...'
          : 'When performing column subtraction, the correct order is from...',
      options: [
        lang === 'id' ? 'Ratusan → Puluhan → Satuan' : 'Hundreds → Tens → Ones',
        lang === 'id' ? 'Satuan → Puluhan → Ratusan' : 'Ones → Tens → Hundreds',
        lang === 'id' ? 'Puluhan → Satuan → Ratusan' : 'Tens → Ones → Hundreds',
        lang === 'id' ? 'Bebas dari mana saja' : 'Any order',
      ],
      correctIndex: 1,
      explanation:
        lang === 'id'
          ? '⭐ Selalu kerjakan dari SATUAN → PULUHAN → RATUSAN agar jika ada proses meminjam dapat dilakukan dengan tepat.'
          : '⭐ Always calculate from ONES → TENS → HUNDREDS so any borrowing can be done accurately.',
    },
  ];

  const handleTabChange = (tab: SubTab) => {
    sound.playPop(520);
    setActiveTab(tab);
  };

  const handleQuizAnswer = (index: number) => {
    if (isAnswerSubmitted) return;
    sound.playPop(480);
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswer === quizQuestions[currentQuizIndex].correctIndex;
    if (isCorrect) {
      sound.playDing();
      setQuizScore((prev) => prev + 1);
    } else {
      sound.playBoing();
    }
  };

  const handleNextQuiz = () => {
    sound.playPop(540);
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
      sound.playFanfare();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffc800', '#58cc02', '#1cb0f6', '#ff4b4b', '#ce82ff'],
      });
      if (onEarnCoins) {
        onEarnCoins(quizScore * 10 + 20);
      }
    }
  };

  const handleRestartQuiz = () => {
    sound.playPop(500);
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setIsQuizCompleted(false);
  };

  // Helper to split number into H, T, O
  const hundreds = Math.floor(customNum / 100);
  const tens = Math.floor((customNum % 100) / 10);
  const ones = customNum % 10;

  const getMascotMessage = () => {
    switch (activeTab) {
      case 'concept':
        return lang === 'id'
          ? 'Pengurangan adalah kegiatan mencari selisih atau sisa dari dua bilangan dengan tanda (−). Yuk pahami nilai tempat bilangan!'
          : 'Subtraction is finding the difference or remainder between two numbers using (−). Let’s master place values!';
      case 'no-borrow':
        return lang === 'id'
          ? 'Pengurangan tanpa meminjam sangat mudah! Kerjakan dari kolom Satuan → Puluhan → Ratusan.'
          : 'Subtraction without borrowing is super easy! Calculate from Ones → Tens → Hundreds.';
      case 'with-borrow':
        return lang === 'id'
          ? 'Jika angka atas lebih kecil dari angka bawah, pinjam 1 dari sebelah kiri! 1 Puluhan = 10 Satuan.'
          : 'If the top digit is smaller than the bottom, borrow 1 from the left! 1 Ten = 10 Ones.';
      case 'story':
        return lang === 'id'
          ? 'Pengurangan sering kita temui di kehidupan sehari-hari, seperti saat menghitung uang kembalian belanja Dina!'
          : 'Subtraction is everywhere in daily life, like counting change when shopping with Dina!';
      case 'quiz':
        return lang === 'id'
          ? 'Ayo uji pemahamanmu dengan kuis interaktif dan menangkan koin emas!'
          : 'Test your subtraction skills with this interactive quiz and earn gold coins!';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-4 py-1 sm:py-3 px-2 sm:px-4 select-none">
      {/* Mascot Guidance */}
      <MascotBubble
        message={getMascotMessage()}
        mood={activeTab === 'quiz' ? 'celebrating' : activeTab === 'with-borrow' ? 'teaching' : 'happy'}
        lang={lang}
      />

      {/* Main Material Card Container */}
      <div className="w-full bg-[#fffdfa] border-4 sm:border-5 border-[#ebd5b3] rounded-[36px] sm:rounded-[44px] shadow-[0_12px_0_0_#d9bc8c] p-4 sm:p-7 flex flex-col items-center">
        
        {/* Module Title Header */}
        <div className="text-center mb-5 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#ff4b4b] text-white border-b-4 border-[#dc2626] px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-sm font-black font-fun shadow-md">
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'id' ? 'MATERI PEMBELAJARAN MATEMATIKA' : 'MATH LEARNING MODULE'}</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-fun text-[#451a03] mt-2 mb-1">
            {lang === 'id' ? 'Mengenal Pengurangan Bilangan' : 'Understanding Number Subtraction'}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#78350f] m-0">
            {lang === 'id'
              ? 'Konsep Dasar, Nilai Tempat, Pengurangan Bersusun & Soal Cerita'
              : 'Basic Concepts, Place Values, Column Subtraction & Word Problems'}
          </p>
        </div>

        {/* Sub-Navigation Tabs (Duolingo Style 3D Buttons) */}
        <div className="w-full flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 mb-6">
          <button
            onClick={() => handleTabChange('concept')}
            className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
              activeTab === 'concept' ? 'btn-3d-blue' : 'btn-3d-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'id' ? '1. Konsep & Nilai Tempat' : '1. Concept & Place Value'}</span>
          </button>

          <button
            onClick={() => handleTabChange('no-borrow')}
            className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
              activeTab === 'no-borrow' ? 'btn-3d-green' : 'btn-3d-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{lang === 'id' ? '2. Tanpa Meminjam' : '2. Without Borrowing'}</span>
          </button>

          <button
            onClick={() => handleTabChange('with-borrow')}
            className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
              activeTab === 'with-borrow' ? 'btn-3d-yellow' : 'btn-3d-white'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>{lang === 'id' ? '3. Dengan Meminjam' : '3. With Borrowing'}</span>
          </button>

          <button
            onClick={() => handleTabChange('story')}
            className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
              activeTab === 'story' ? 'btn-3d-purple' : 'btn-3d-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{lang === 'id' ? '4. Cerita Sehari-hari' : '4. Real-life Stories'}</span>
          </button>

          <button
            onClick={() => handleTabChange('quiz')}
            className={`btn-3d px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black font-fun flex items-center gap-1.5 ${
              activeTab === 'quiz' ? 'btn-3d-red animate-pulse' : 'btn-3d-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{lang === 'id' ? '5. Kuis & Latihan' : '5. Quiz & Practice'}</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: KONSEP DASAR & NILAI TEMPAT */}
        {/* ========================================================= */}
        {activeTab === 'concept' && (
          <div className="w-full flex flex-col gap-6 animate-pop-in">
            {/* Concept Definition Card */}
            <div className="bg-[#fff5df] p-5 sm:p-6 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">➖</span>
                <h3 className="text-lg sm:text-xl font-black font-fun text-[#451a03] m-0">
                  {lang === 'id' ? 'Apa itu Pengurangan?' : 'What is Subtraction?'}
                </h3>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-700 leading-relaxed m-0">
                {lang === 'id'
                  ? 'Pengurangan adalah kegiatan mencari selisih atau sisa dari dua bilangan. Tanda operasi pengurangan adalah simbol minus (−).'
                  : 'Subtraction is finding the difference or remainder between two numbers. The subtraction operator is the minus sign (−).'}
              </p>

              {/* Example Callout Box */}
              <div className="bg-white p-4 rounded-2xl border-2 border-[#fcd34d] flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="bg-[#fef08a] px-4 py-2 rounded-2xl border-2 border-[#eab308] font-black font-fun text-xl text-[#713f12]">
                    500 − 200 = 300
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-600 m-0 flex-1">
                  {lang === 'id'
                    ? '💡 Artinya: Jika kita mempunyai 500 benda, kemudian diambil 200 benda, maka tersisa 300 benda.'
                    : '💡 Meaning: If we have 500 items, and 200 are taken away, 300 items remain.'}
                </p>
              </div>
            </div>

            {/* Place Value Section */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧱</span>
                  <h3 className="text-lg sm:text-xl font-black font-fun text-[#451a03] m-0">
                    {lang === 'id' ? 'Nilai Tempat Bilangan (Sampai 1.000)' : 'Place Value (Up to 1,000)'}
                  </h3>
                </div>
                <span className="text-xs font-black bg-[#e0f2fe] text-[#0284c7] px-3 py-1 rounded-full border border-[#7dd3fc]">
                  {lang === 'id' ? 'Ratusan • Puluhan • Satuan' : 'Hundreds • Tens • Ones'}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-600 m-0">
                {lang === 'id'
                  ? 'Sebelum melakukan pengurangan bersusun, kita harus memahami nilai tempat bilangan.'
                  : 'Before doing column subtraction, we must understand the place values of numbers.'}
              </p>

              {/* Interactive Number Selector */}
              <div className="flex items-center gap-2 flex-wrap bg-[#f8fafc] p-3 rounded-2xl border border-slate-200">
                <span className="text-xs font-black text-slate-500">
                  {lang === 'id' ? 'Pilih contoh angka:' : 'Choose a sample number:'}
                </span>
                {[735, 500, 567, 352, 946].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      sound.playPop(520);
                      setCustomNum(num);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-transform ${
                      customNum === num
                        ? 'bg-[#1cb0f6] text-white shadow-sm scale-105'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {/* 3D Visual Cards for Place Values */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-1">
                {/* Ratusan (Hundreds) */}
                <div className="bg-[#fff1f2] p-4 rounded-2xl border-3 border-[#fecdd3] shadow-sm flex flex-col items-center text-center">
                  <span className="text-xs font-black text-[#be123c] uppercase tracking-wider mb-1">
                    {lang === 'id' ? 'Ratusan (Hundreds)' : 'Hundreds'}
                  </span>
                  <span className="text-4xl sm:text-5xl font-black font-fun text-[#e11d48] my-1">
                    {hundreds}
                  </span>
                  <div className="bg-white px-3 py-1 rounded-xl border border-[#fda4af] text-xs font-bold text-[#9f1239] mt-1">
                    = {hundreds * 100}
                  </div>
                </div>

                {/* Puluhan (Tens) */}
                <div className="bg-[#fefce8] p-4 rounded-2xl border-3 border-[#fef08a] shadow-sm flex flex-col items-center text-center">
                  <span className="text-xs font-black text-[#a16207] uppercase tracking-wider mb-1">
                    {lang === 'id' ? 'Puluhan (Tens)' : 'Tens'}
                  </span>
                  <span className="text-4xl sm:text-5xl font-black font-fun text-[#d97706] my-1">
                    {tens}
                  </span>
                  <div className="bg-white px-3 py-1 rounded-xl border border-[#fde047] text-xs font-bold text-[#854d0e] mt-1">
                    = {tens * 10}
                  </div>
                </div>

                {/* Satuan (Ones) */}
                <div className="bg-[#f0fdf4] p-4 rounded-2xl border-3 border-[#bbf7d0] shadow-sm flex flex-col items-center text-center">
                  <span className="text-xs font-black text-[#15803d] uppercase tracking-wider mb-1">
                    {lang === 'id' ? 'Satuan (Ones)' : 'Ones'}
                  </span>
                  <span className="text-4xl sm:text-5xl font-black font-fun text-[#16a34a] my-1">
                    {ones}
                  </span>
                  <div className="bg-white px-3 py-1 rounded-xl border border-[#86efac] text-xs font-bold text-[#166534] mt-1">
                    = {ones}
                  </div>
                </div>
              </div>

              {/* Mathematical Equation Breakdown */}
              <div className="bg-[#fef9c3] p-4 rounded-2xl border-2 border-[#facc15] text-center font-fun font-black text-base sm:text-xl text-[#713f12]">
                {customNum} = {hundreds * 100} + {tens * 10} + {ones}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PENGURANGAN TANPA MEMINJAM (567 - 234) */}
        {/* ========================================================= */}
        {activeTab === 'no-borrow' && (
          <div className="w-full flex flex-col gap-6 animate-pop-in">
            <div className="bg-[#f0fdf4] p-5 sm:p-6 rounded-3xl border-3 border-[#bbf7d0] shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🟢</span>
                <h3 className="text-lg sm:text-xl font-black font-fun text-[#14532d] m-0">
                  {lang === 'id' ? 'Pengurangan Tanpa Meminjam' : 'Subtraction Without Borrowing'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed m-0">
                {lang === 'id'
                  ? 'Pengurangan tanpa meminjam dilakukan ketika angka pada bilangan yang dikurangi cukup untuk dikurangi dengan angka di bawahnya.'
                  : 'Subtraction without borrowing happens when each digit of the top number is large enough to subtract the digit below it directly.'}
              </p>
            </div>

            {/* Interactive Step-by-Step Column Subtraction Visualizer */}
            <div className="bg-white p-5 sm:p-7 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-4">
                <span className="text-xs sm:text-sm font-black text-[#451a03]">
                  {lang === 'id' ? 'Contoh 1: 567 − 234' : 'Example 1: 567 − 234'}
                </span>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`w-3 h-3 rounded-full transition-all ${
                        s === stepNoBorrow ? 'bg-[#16a34a] scale-125' : s < stepNoBorrow ? 'bg-[#86efac]' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Table of Place Values for 567 - 234 */}
              <div className="bg-[#f8fafc] p-6 rounded-3xl border-2 border-slate-200 w-full max-w-sm flex flex-col items-center my-2">
                <div className="grid grid-cols-4 gap-2 text-center w-full font-fun font-black text-sm text-slate-500 pb-2 border-b-2 border-slate-200">
                  <div></div>
                  <div className={stepNoBorrow === 3 ? 'text-[#be123c] underline font-extrabold' : ''}>
                    {lang === 'id' ? 'Rat' : 'Hun'}
                  </div>
                  <div className={stepNoBorrow === 2 ? 'text-[#a16207] underline font-extrabold' : ''}>
                    {lang === 'id' ? 'Pul' : 'Ten'}
                  </div>
                  <div className={stepNoBorrow === 1 ? 'text-[#15803d] underline font-extrabold' : ''}>
                    {lang === 'id' ? 'Sat' : 'One'}
                  </div>
                </div>

                {/* Top Number: 567 */}
                <div className="grid grid-cols-4 gap-2 text-center w-full font-fun font-black text-2xl sm:text-3xl text-slate-800 pt-3">
                  <div></div>
                  <div className={`p-1 rounded-xl ${stepNoBorrow === 3 ? 'bg-[#ffe4e6] text-[#e11d48]' : ''}`}>5</div>
                  <div className={`p-1 rounded-xl ${stepNoBorrow === 2 ? 'bg-[#fef9c3] text-[#d97706]' : ''}`}>6</div>
                  <div className={`p-1 rounded-xl ${stepNoBorrow === 1 ? 'bg-[#dcfce7] text-[#16a34a]' : ''}`}>7</div>
                </div>

                {/* Bottom Number: 234 */}
                <div className="grid grid-cols-4 gap-2 text-center w-full font-fun font-black text-2xl sm:text-3xl text-slate-800 pb-2 relative">
                  <div className="text-xl text-[#dc2626] flex items-center justify-center">−</div>
                  <div className={`p-1 rounded-xl ${stepNoBorrow === 3 ? 'bg-[#ffe4e6] text-[#e11d48]' : ''}`}>2</div>
                  <div className={`p-1 rounded-xl ${stepNoBorrow === 2 ? 'bg-[#fef9c3] text-[#d97706]' : ''}`}>3</div>
                  <div className={`p-1 rounded-xl ${stepNoBorrow === 1 ? 'bg-[#dcfce7] text-[#16a34a]' : ''}`}>4</div>
                  {/* Underline */}
                  <div className="col-span-4 border-b-4 border-slate-800 -mt-1"></div>
                </div>

                {/* Result Row */}
                <div className="grid grid-cols-4 gap-2 text-center w-full font-fun font-black text-2xl sm:text-3xl pt-2">
                  <div></div>
                  <div className={`p-1 rounded-xl ${stepNoBorrow >= 3 ? 'text-[#e11d48]' : 'text-slate-300'}`}>
                    {stepNoBorrow >= 3 ? '3' : '?'}
                  </div>
                  <div className={`p-1 rounded-xl ${stepNoBorrow >= 2 ? 'text-[#d97706]' : 'text-slate-300'}`}>
                    {stepNoBorrow >= 2 ? '3' : '?'}
                  </div>
                  <div className={`p-1 rounded-xl ${stepNoBorrow >= 1 ? 'text-[#16a34a]' : 'text-slate-300'}`}>
                    {stepNoBorrow >= 1 ? '3' : '?'}
                  </div>
                </div>
              </div>

              {/* Step Explanations Box */}
              <div className="w-full bg-[#f0fdf4] border-2 border-[#86efac] p-4 rounded-2xl mt-4 text-center">
                {stepNoBorrow === 0 && (
                  <p className="text-xs sm:text-sm font-bold text-[#166534] m-0">
                    {lang === 'id'
                      ? 'Langkah 0: Susun bilangan berdasarkan nilai tempat (Ratusan sejajar Ratusan, Puluhan sejajar Puluhan, Satuan sejajar Satuan).'
                      : 'Step 0: Align numbers by place value (Hundreds with Hundreds, Tens with Tens, Ones with Ones).'}
                  </p>
                )}
                {stepNoBorrow === 1 && (
                  <p className="text-xs sm:text-sm font-bold text-[#166534] m-0">
                    {lang === 'id'
                      ? '👉 Langkah 1 (Satuan): 7 − 4 = 3. Tulis angka 3 pada kolom satuan.'
                      : '👉 Step 1 (Ones): 7 − 4 = 3. Write 3 in the ones column.'}
                  </p>
                )}
                {stepNoBorrow === 2 && (
                  <p className="text-xs sm:text-sm font-bold text-[#166534] m-0">
                    {lang === 'id'
                      ? '👉 Langkah 2 (Puluhan): 6 − 3 = 3. Tulis angka 3 pada kolom puluhan.'
                      : '👉 Step 2 (Tens): 6 − 3 = 3. Write 3 in the tens column.'}
                  </p>
                )}
                {stepNoBorrow === 3 && (
                  <p className="text-xs sm:text-sm font-bold text-[#166534] m-0">
                    {lang === 'id'
                      ? '👉 Langkah 3 (Ratusan): 5 − 2 = 3. Tulis angka 3 pada kolom ratusan.'
                      : '👉 Step 3 (Hundreds): 5 − 2 = 3. Write 3 in the hundreds column.'}
                  </p>
                )}
                {stepNoBorrow === 4 && (
                  <p className="text-xs sm:text-sm font-black text-[#15803d] m-0">
                    {lang === 'id'
                      ? '🎉 Selesai! Jadi hasil dari 567 − 234 = 333.'
                      : '🎉 Done! So 567 − 234 = 333.'}
                  </p>
                )}
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-2 sm:gap-3 mt-4">
                <button
                  disabled={stepNoBorrow === 0}
                  onClick={() => {
                    sound.playPop(480);
                    setStepNoBorrow((prev) => Math.max(0, prev - 1));
                  }}
                  className={`btn-3d btn-3d-white px-3.5 py-2 rounded-xl text-xs font-black font-fun flex items-center gap-1 ${
                    stepNoBorrow === 0 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === 'id' ? 'Sebelumnya' : 'Back'}</span>
                </button>

                {stepNoBorrow < 4 ? (
                  <button
                    onClick={() => {
                      sound.playPop(560);
                      if (stepNoBorrow === 3) sound.playDing();
                      setStepNoBorrow((prev) => Math.min(4, prev + 1));
                    }}
                    className="btn-3d btn-3d-green px-4 py-2 rounded-xl text-xs font-black font-fun flex items-center gap-1.5"
                  >
                    <span>{lang === 'id' ? 'Langkah Berikutnya' : 'Next Step'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sound.playPop(520);
                      setStepNoBorrow(0);
                    }}
                    className="btn-3d btn-3d-yellow px-4 py-2 rounded-xl text-xs font-black font-fun flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{lang === 'id' ? 'Ulangi Langkah' : 'Restart Steps'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PENGURANGAN DENGAN MEMINJAM (352 - 127) */}
        {/* ========================================================= */}
        {activeTab === 'with-borrow' && (
          <div className="w-full flex flex-col gap-6 animate-pop-in">
            {/* Concept Banner */}
            <div className="bg-[#fefce8] p-5 sm:p-6 rounded-3xl border-3 border-[#fef08a] shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🟡</span>
                <h3 className="text-lg sm:text-xl font-black font-fun text-[#713f12] m-0">
                  {lang === 'id' ? 'Pengurangan Dengan Meminjam' : 'Subtraction With Borrowing'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed m-0">
                {lang === 'id'
                  ? 'Pengurangan dengan meminjam dilakukan ketika angka yang akan dikurangi lebih kecil daripada angka pengurangnya. Ketika tidak cukup, kita meminjam 1 dari nilai tempat di sebelah kirinya.'
                  : 'Borrowing occurs when the top digit is smaller than the bottom digit. We borrow 1 from the next place value on the left.'}
              </p>

              {/* Golden Rules Badge Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div className="bg-white p-3 rounded-2xl border-2 border-[#facc15] flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  <span className="text-xs sm:text-sm font-black text-[#854d0e]">
                    1 Puluhan = 10 Satuan
                  </span>
                </div>
                <div className="bg-white p-3 rounded-2xl border-2 border-[#facc15] flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  <span className="text-xs sm:text-sm font-black text-[#854d0e]">
                    1 Ratusan = 10 Puluhan
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Step-by-Step Borrowing Visualizer for 352 - 127 */}
            <div className="bg-white p-5 sm:p-7 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-3">
                <span className="text-xs sm:text-sm font-black text-[#451a03]">
                  {lang === 'id' ? 'Contoh: 352 − 127' : 'Example: 352 − 127'}
                </span>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className={`w-3 h-3 rounded-full transition-all ${
                        s === stepWithBorrow ? 'bg-[#d97706] scale-125' : s < stepWithBorrow ? 'bg-[#fde047]' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Vertical Column Board */}
              <div className="bg-[#f8fafc] p-6 rounded-3xl border-2 border-slate-200 w-full max-w-sm flex flex-col items-center my-2">
                {/* Header */}
                <div className="grid grid-cols-4 gap-2 text-center w-full font-fun font-black text-sm text-slate-500 pb-2 border-b-2 border-slate-200">
                  <div></div>
                  <div className={stepWithBorrow === 4 ? 'text-[#be123c] font-extrabold underline' : ''}>
                    {lang === 'id' ? 'Rat' : 'Hun'}
                  </div>
                  <div className={stepWithBorrow === 2 || stepWithBorrow === 3 ? 'text-[#a16207] font-extrabold underline' : ''}>
                    {lang === 'id' ? 'Pul' : 'Ten'}
                  </div>
                  <div className={stepWithBorrow === 1 || stepWithBorrow === 2 ? 'text-[#15803d] font-extrabold underline' : ''}>
                    {lang === 'id' ? 'Sat' : 'One'}
                  </div>
                </div>

                {/* Pinjaman / Borrowed Helper Row (Shown when step >= 2) */}
                <div className="grid grid-cols-4 gap-2 text-center w-full font-fun font-black text-sm text-[#ea580c] pt-2 min-h-[28px]">
                  <div></div>
                  <div></div>
                  <div className={stepWithBorrow >= 2 ? 'animate-bounce-slight font-extrabold text-xs bg-[#fef08a] px-1 rounded-md' : ''}>
                    {stepWithBorrow >= 2 ? '4' : ''}
                  </div>
                  <div className={stepWithBorrow >= 2 ? 'animate-bounce-slight font-extrabold text-xs bg-[#bbf7d0] px-1 rounded-md' : ''}>
                    {stepWithBorrow >= 2 ? '12' : ''}
                  </div>
                </div>

                {/* Top Number: 352 */}
                <div className="grid grid-cols-4 gap-2 text-center w-full font-fun font-black text-2xl sm:text-3xl text-slate-800 pt-1">
                  <div></div>
                  <div className={`p-1 rounded-xl ${stepWithBorrow === 4 ? 'bg-[#ffe4e6] text-[#e11d48]' : ''}`}>3</div>
                  <div className={`p-1 rounded-xl relative ${stepWithBorrow >= 2 ? 'text-slate-400 line-through' : ''}`}>
                    5
                  </div>
                  <div className={`p-1 rounded-xl relative ${stepWithBorrow >= 2 ? 'text-slate-400 line-through' : ''}`}>
                    2
                  </div>
                </div>

                {/* Bottom Number: 127 */}
                <div className="grid grid-cols-4 gap-2 text-center w-full font-fun font-black text-2xl sm:text-3xl text-slate-800 pb-2 relative">
                  <div className="text-xl text-[#dc2626] flex items-center justify-center">−</div>
                  <div className={`p-1 rounded-xl ${stepWithBorrow === 4 ? 'bg-[#ffe4e6] text-[#e11d48]' : ''}`}>1</div>
                  <div className={`p-1 rounded-xl ${stepWithBorrow === 3 ? 'bg-[#fef9c3] text-[#d97706]' : ''}`}>2</div>
                  <div className={`p-1 rounded-xl ${stepWithBorrow === 1 || stepWithBorrow === 2 ? 'bg-[#dcfce7] text-[#16a34a]' : ''}`}>7</div>
                  {/* Underline */}
                  <div className="col-span-4 border-b-4 border-slate-800 -mt-1"></div>
                </div>

                {/* Result Row */}
                <div className="grid grid-cols-4 gap-2 text-center w-full font-fun font-black text-2xl sm:text-3xl pt-2">
                  <div></div>
                  <div className={`p-1 rounded-xl ${stepWithBorrow >= 4 ? 'text-[#e11d48]' : 'text-slate-300'}`}>
                    {stepWithBorrow >= 4 ? '2' : '?'}
                  </div>
                  <div className={`p-1 rounded-xl ${stepWithBorrow >= 3 ? 'text-[#d97706]' : 'text-slate-300'}`}>
                    {stepWithBorrow >= 3 ? '2' : '?'}
                  </div>
                  <div className={`p-1 rounded-xl ${stepWithBorrow >= 2 ? 'text-[#16a34a]' : 'text-slate-300'}`}>
                    {stepWithBorrow >= 2 ? '5' : '?'}
                  </div>
                </div>
              </div>

              {/* Step Explanations Box */}
              <div className="w-full bg-[#fefce8] border-2 border-[#facc15] p-4 rounded-2xl mt-4 text-center">
                {stepWithBorrow === 0 && (
                  <p className="text-xs sm:text-sm font-bold text-[#854d0e] m-0">
                    {lang === 'id'
                      ? 'Langkah 0: Susun bilangan 352 dan 127 berdasarkan nilai tempat. Selalu mulai hitung dari SATUAN!'
                      : 'Step 0: Align 352 and 127. Always start calculating from the ONES column!'}
                  </p>
                )}
                {stepWithBorrow === 1 && (
                  <p className="text-xs sm:text-sm font-bold text-[#b45309] m-0">
                    {lang === 'id'
                      ? '⚠️ Langkah 1 (Satuan): Angka 2 tidak dapat dikurangi 7 (2 < 7). Kita harus meminjam 1 puluhan dari angka 5!'
                      : '⚠️ Step 1 (Ones): 2 cannot be subtracted by 7 (2 < 7). We need to borrow 1 ten from digit 5!'}
                  </p>
                )}
                {stepWithBorrow === 2 && (
                  <p className="text-xs sm:text-sm font-bold text-[#15803d] m-0">
                    {lang === 'id'
                      ? '✨ Langkah 2 (Pinjam): Angka 5 puluhan dipinjam 1 menjadi 4. Angka 2 mendapat 10 menjadi 12 (10 + 2). Maka: 12 − 7 = 5.'
                      : '✨ Step 2 (Borrow): Digit 5 becomes 4. Digit 2 receives 10 to become 12. Thus: 12 − 7 = 5.'}
                  </p>
                )}
                {stepWithBorrow === 3 && (
                  <p className="text-xs sm:text-sm font-bold text-[#854d0e] m-0">
                    {lang === 'id'
                      ? '👉 Langkah 3 (Puluhan): Sisa 4 puluhan dikurangi 2 puluhan (4 − 2 = 2). Tulis 2 pada kolom puluhan.'
                      : '👉 Step 3 (Tens): The remaining 4 tens minus 2 tens (4 − 2 = 2). Write 2 in tens column.'}
                  </p>
                )}
                {stepWithBorrow === 4 && (
                  <p className="text-xs sm:text-sm font-bold text-[#be123c] m-0">
                    {lang === 'id'
                      ? '👉 Langkah 4 (Ratusan): 3 ratusan dikurangi 1 ratusan (3 − 1 = 2). Tulis 2 pada kolom ratusan.'
                      : '👉 Step 4 (Hundreds): 3 hundreds minus 1 hundred (3 − 1 = 2). Write 2 in hundreds column.'}
                  </p>
                )}
                {stepWithBorrow === 5 && (
                  <p className="text-xs sm:text-sm font-black text-[#15803d] m-0">
                    {lang === 'id'
                      ? '🎉 Hebat! Jadi hasil dari 352 − 127 = 225.'
                      : '🎉 Awesome! So 352 − 127 = 225.'}
                  </p>
                )}
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-2 sm:gap-3 mt-4">
                <button
                  disabled={stepWithBorrow === 0}
                  onClick={() => {
                    sound.playPop(480);
                    setStepWithBorrow((prev) => Math.max(0, prev - 1));
                  }}
                  className={`btn-3d btn-3d-white px-3.5 py-2 rounded-xl text-xs font-black font-fun flex items-center gap-1 ${
                    stepWithBorrow === 0 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === 'id' ? 'Sebelumnya' : 'Back'}</span>
                </button>

                {stepWithBorrow < 5 ? (
                  <button
                    onClick={() => {
                      sound.playPop(560);
                      if (stepWithBorrow === 4) sound.playDing();
                      setStepWithBorrow((prev) => Math.min(5, prev + 1));
                    }}
                    className="btn-3d btn-3d-yellow px-4 py-2 rounded-xl text-xs font-black font-fun flex items-center gap-1.5"
                  >
                    <span>{lang === 'id' ? 'Langkah Berikutnya' : 'Next Step'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sound.playPop(520);
                      setStepWithBorrow(0);
                    }}
                    className="btn-3d btn-3d-green px-4 py-2 rounded-xl text-xs font-black font-fun flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{lang === 'id' ? 'Ulangi Langkah' : 'Restart Steps'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Memory Tips Card */}
            <div className="bg-[#f0f9ff] p-5 rounded-3xl border-3 border-[#bae6fd] shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#0284c7]" />
                <h4 className="text-sm sm:text-base font-black font-fun text-[#0369a1] m-0">
                  {lang === 'id' ? 'Cara Mudah Mengingat (Kiat Kibo)' : 'Easy Memory Tip'}
                </h4>
              </div>
              <ul className="text-xs sm:text-sm font-bold text-slate-700 m-0 pl-5 flex flex-col gap-1.5">
                <li>
                  {lang === 'id'
                    ? '⭐ Selalu kerjakan dari: SATUAN → PULUHAN → RATUSAN'
                    : '⭐ Always calculate from: ONES → TENS → HUNDREDS'}
                </li>
                <li>
                  {lang === 'id'
                    ? '👉 Jika angka atas lebih kecil, jangan bingung! Pinjam dari sebelah kiri.'
                    : '👉 If the top digit is smaller, don’t worry! Borrow from the left.'}
                </li>
                <li>
                  {lang === 'id'
                    ? '💡 1 puluhan = 10 satuan, dan 1 ratusan = 10 puluhan.'
                    : '💡 1 ten = 10 ones, and 1 hundred = 10 tens.'}
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PENGURANGAN DALAM KEHIDUPAN SEHARI-HARI */}
        {/* ========================================================= */}
        {activeTab === 'story' && (
          <div className="w-full flex flex-col gap-6 animate-pop-in">
            {/* Main Story: Dina Belanja */}
            <div className="bg-[#faf5ff] p-5 sm:p-7 rounded-3xl border-3 border-[#e9d5ff] shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🛍️</span>
                <div>
                  <h3 className="text-lg sm:text-2xl font-black font-fun text-[#581c87] m-0">
                    {lang === 'id' ? 'Cerita 1: Menghitung Uang Kembalian Dina' : 'Story 1: Calculating Dina’s Change'}
                  </h3>
                  <p className="text-xs font-bold text-[#7e22ce] m-0">
                    {lang === 'id' ? 'Pengurangan dalam Kehidupan Sehari-hari' : 'Subtraction in Everyday Life'}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-[#d8b4fe] flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#f3e8ff] rounded-2xl border-2 border-[#a855f7] flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0">
                  👧
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed m-0">
                    {lang === 'id'
                      ? 'Dina mempunyai uang Rp500. Ia pergi ke warung dan membeli makanan lezat seharga Rp350. Berapakah uang kembalian yang diterima Dina?'
                      : 'Dina has Rp500. She goes to the snack shop and buys food for Rp350. How much change will Dina receive?'}
                  </p>
                </div>
              </div>

              {/* Story Visual Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 text-center flex flex-col items-center">
                  <span className="text-xs font-black text-slate-500 mb-1">
                    {lang === 'id' ? 'Uang Awal Dina' : 'Dina’s Initial Money'}
                  </span>
                  <span className="text-2xl font-black font-fun text-[#16a34a]">💵 Rp500</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 text-center flex flex-col items-center">
                  <span className="text-xs font-black text-slate-500 mb-1">
                    {lang === 'id' ? 'Harga Makanan (−)' : 'Food Price (−)'}
                  </span>
                  <span className="text-2xl font-black font-fun text-[#dc2626]">🥐 Rp350</span>
                </div>

                <div className="bg-[#f0fdf4] p-4 rounded-2xl border-2 border-[#86efac] text-center flex flex-col items-center shadow-inner">
                  <span className="text-xs font-black text-[#15803d] mb-1">
                    {lang === 'id' ? 'Uang Kembalian Dina' : 'Dina’s Change'}
                  </span>
                  <span className="text-2xl font-black font-fun text-[#15803d]">💰 Rp150</span>
                </div>
              </div>

              {/* Equation Badge */}
              <div className="bg-[#ffc800] text-[#533800] border-2 border-[#d97706] p-4 rounded-2xl text-center font-black font-fun text-lg sm:text-xl shadow-sm">
                Rp500 − Rp350 = Rp150
              </div>
            </div>

            {/* Additional Real Life Stories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  <h4 className="text-base font-black font-fun text-[#451a03] m-0">
                    {lang === 'id' ? 'Cerita 2: Halaman Buku' : 'Story 2: Book Pages'}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-600 m-0">
                  {lang === 'id'
                    ? 'Budi membaca buku cerita setebal 250 halaman. Budi sudah membaca 120 halaman. Berapa halaman yang belum dibaca?'
                    : 'Budi reads a 250-page book. He has read 120 pages. How many pages are left?'}
                </p>
                <div className="bg-[#fffbeb] p-2.5 rounded-xl border border-[#fef08a] font-black font-fun text-sm text-[#854d0e] mt-1 text-center">
                  250 − 120 = 130 {lang === 'id' ? 'halaman' : 'pages'}
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍎</span>
                  <h4 className="text-base font-black font-fun text-[#451a03] m-0">
                    {lang === 'id' ? 'Cerita 3: Apel Paman' : 'Story 3: Uncle’s Apples'}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-600 m-0">
                  {lang === 'id'
                    ? 'Paman memetik 450 buah apel di kebun. Sebanyak 225 buah apel telah terjual di pasar. Berapa sisa apel paman?'
                    : 'Uncle picked 450 apples. 225 apples were sold in the market. How many apples remain?'}
                </p>
                <div className="bg-[#fffbeb] p-2.5 rounded-xl border border-[#fef08a] font-black font-fun text-sm text-[#854d0e] mt-1 text-center">
                  450 − 225 = 225 {lang === 'id' ? 'apel' : 'apples'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: KUIS & LATIHAN INTERAKTIF */}
        {/* ========================================================= */}
        {activeTab === 'quiz' && (
          <div className="w-full flex flex-col gap-6 animate-pop-in">
            {!isQuizCompleted ? (
              <div className="bg-white p-5 sm:p-7 rounded-3xl border-3 border-[#ebd5b3] shadow-sm flex flex-col gap-5">
                {/* Quiz Header & Progress Indicator */}
                <div className="flex items-center justify-between flex-wrap gap-2 border-b-2 border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black bg-[#ffc800] text-[#533800] px-3 py-1 rounded-full border border-[#d97706]">
                      {lang === 'id' ? `Soal ${currentQuizIndex + 1} dari ${quizQuestions.length}` : `Question ${currentQuizIndex + 1} of ${quizQuestions.length}`}
                    </span>
                    <span className="text-xs font-black text-[#16a34a] bg-[#dcfce7] px-3 py-1 rounded-full border border-[#86efac]">
                      Skor: {quizScore}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {quizQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className={`w-3 h-3 rounded-full transition-all ${
                          idx === currentQuizIndex
                            ? 'bg-[#1cb0f6] scale-125'
                            : idx < currentQuizIndex
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
                    {quizQuestions[currentQuizIndex].question}
                  </h3>
                </div>

                {/* Options List (3D Buttons) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quizQuestions[currentQuizIndex].options.map((optionText, optIdx) => {
                    const isSelected = selectedAnswer === optIdx;
                    const isCorrect = optIdx === quizQuestions[currentQuizIndex].correctIndex;

                    let btnStyle = 'btn-3d-white text-slate-800';
                    if (isAnswerSubmitted) {
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
                        disabled={isAnswerSubmitted}
                        onClick={() => handleQuizAnswer(optIdx)}
                        className={`btn-3d p-4 rounded-2xl font-black font-fun text-sm sm:text-base text-left flex items-center justify-between transition-all ${btnStyle}`}
                      >
                        <span>{optionText}</span>
                        {isAnswerSubmitted && isCorrect && <Check className="w-5 h-5 text-white stroke-[3]" />}
                        {isAnswerSubmitted && isSelected && !isCorrect && <X className="w-5 h-5 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on Answer Submitted */}
                {isAnswerSubmitted && (
                  <div className="bg-[#f0fdf4] border-2 border-[#86efac] p-4 rounded-2xl animate-pop-in">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#15803d] mb-1">
                      <Lightbulb className="w-4 h-4" />
                      <span>{lang === 'id' ? 'Penjelasan Jawaban:' : 'Explanation:'}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#166534] m-0">
                      {quizQuestions[currentQuizIndex].explanation}
                    </p>
                  </div>
                )}

                {/* Submit / Next Button */}
                <div className="flex justify-end mt-2">
                  {!isAnswerSubmitted ? (
                    <button
                      disabled={selectedAnswer === null}
                      onClick={handleSubmitAnswer}
                      className={`btn-3d px-6 py-3 rounded-2xl font-black font-fun text-sm sm:text-base ${
                        selectedAnswer !== null ? 'btn-3d-green' : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {lang === 'id' ? 'Periksa Jawaban ✓' : 'Check Answer ✓'}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuiz}
                      className="btn-3d btn-3d-yellow px-6 py-3 rounded-2xl font-black font-fun text-sm sm:text-base flex items-center gap-2"
                    >
                      <span>
                        {currentQuizIndex < quizQuestions.length - 1
                          ? lang === 'id'
                            ? 'Soal Berikutnya'
                            : 'Next Question'
                          : lang === 'id'
                          ? 'Lihat Hasil Kuis 🏆'
                          : 'View Quiz Result 🏆'}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Completion Result Screen */
              <div className="bg-white p-6 sm:p-10 rounded-[36px] border-4 border-[#ebd5b3] shadow-lg flex flex-col items-center text-center animate-pop-in">
                <div className="w-24 h-24 rounded-full bg-[#ffc800] border-4 border-[#78350f] shadow-xl flex items-center justify-center text-5xl mb-4 animate-bounce-slight">
                  🏆
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-fun text-[#451a03] m-0">
                  {lang === 'id' ? 'Kuis Selesai! Kamu Hebat!' : 'Quiz Completed! Great Job!'}
                </h3>
                <p className="text-sm font-bold text-slate-600 mt-1 mb-4">
                  {lang === 'id'
                    ? `Kamu berhasil menjawab ${quizScore} dari ${quizQuestions.length} soal dengan benar!`
                    : `You answered ${quizScore} out of ${quizQuestions.length} questions correctly!`}
                </p>

                {/* Score & Coins Earned Badge */}
                <div className="flex items-center gap-3 bg-[#fff8eb] px-6 py-3 rounded-2xl border-2 border-[#fcd34d] mb-6 shadow-sm">
                  <span className="text-xl">🪙</span>
                  <span className="text-base font-black font-fun text-[#713f12]">
                    +{quizScore * 10 + 20} {lang === 'id' ? 'Koin Emas Diperoleh!' : 'Gold Coins Earned!'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRestartQuiz}
                    className="btn-3d btn-3d-white px-5 py-3 rounded-2xl font-black font-fun text-sm flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{lang === 'id' ? 'Coba Kuis Lagi' : 'Retake Quiz'}</span>
                  </button>

                  <button
                    onClick={() => handleTabChange('concept')}
                    className="btn-3d btn-3d-blue px-6 py-3 rounded-2xl font-black font-fun text-sm flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{lang === 'id' ? 'Baca Materi Lagi' : 'Review Material'}</span>
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
