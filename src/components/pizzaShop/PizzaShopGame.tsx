import React, { useState } from 'react';
import type { CustomerOrder, Fraction } from '../../types/fractions';
import { CustomerCard } from './CustomerCard';
import { FractionPizza } from '../visuals/FractionPizza';
import { MascotBubble } from '../common/MascotBubble';
import { isEquivalent } from '../../utils/fractionsMath';
import { sound } from '../../utils/audioSynth';
import { ChefHat, Plus, Minus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PizzaShopGameProps {
  onOrderServed: (coinsEarned: number) => void;
  lang?: 'id' | 'en';
}

const ORDERS: CustomerOrder[] = [
  {
    id: 'ord-1',
    customerName: 'Kelinci Bubu',
    customerAnimal: 'rabbit',
    avatar: '🐰',
    requestedFraction: { numerator: 1, denominator: 2 },
    targetDenominator: 4,
    targetNumerator: 2,
    dialogId: 'Halo Koki! Aku pesan 1/2 loyang pizza keju. Tolong siapkan dalam loyang 4 potong, dan beri topping pada potongan yang bernilai 1/2 loyang ya!',
    dialogEn: 'Hello Chef! I want 1/2 pizza with cheese. Please prepare it on a 4-slice tray, and top the slices that equal 1/2 of the pizza!',
    rewardCoins: 25,
  },
  {
    id: 'ord-2',
    customerName: 'Panda Momo',
    customerAnimal: 'panda',
    avatar: '🐼',
    requestedFraction: { numerator: 3, denominator: 4 },
    targetDenominator: 8,
    targetNumerator: 6,
    dialogId: 'Aku lapar sekali! Aku pesan 3/4 loyang pizza. Tolong siapkan dalam loyang 8 potong, dan beri topping sebanyak 3/4 loyang ya!',
    dialogEn: 'I am hungry! I order 3/4 of a pizza. Please use an 8-slice tray and add toppings for 3/4 of the pizza!',
    rewardCoins: 35,
  },
  {
    id: 'ord-3',
    customerName: 'Beruang Gani',
    customerAnimal: 'bear',
    avatar: '🐻',
    requestedFraction: { numerator: 1, denominator: 3 },
    targetDenominator: 6,
    targetNumerator: 2,
    dialogId: 'Beri aku pizza madu lezat! Aku pesan 1/3 loyang. Tolong siapkan dalam loyang 6 potong, dan beri topping sebanyak 1/3 loyang ya!',
    dialogEn: 'Give me honey pizza! I want 1/3 of a pizza on a 6-slice tray, topping 1/3 of the pizza!',
    rewardCoins: 30,
  },
  {
    id: 'ord-4',
    customerName: 'Kucing Mimi',
    customerAnimal: 'cat',
    avatar: '🐱',
    requestedFraction: { numerator: 2, denominator: 3 },
    targetDenominator: 6,
    targetNumerator: 4,
    dialogId: 'Aku ingin pizza ikan tuna spesial! Aku pesan 2/3 loyang. Tolong siapkan dalam loyang 6 potong, dan beri topping sebanyak 2/3 loyang ya!',
    dialogEn: 'I want tuna pizza! I order 2/3 of a pizza on a 6-slice tray, topping 2/3 of the pizza!',
    rewardCoins: 40,
  },
  {
    id: 'ord-5',
    customerName: 'Kelinci Cici',
    customerAnimal: 'rabbit',
    avatar: '🐰',
    requestedFraction: { numerator: 1, denominator: 2 },
    targetDenominator: 8,
    targetNumerator: 4,
    dialogId: 'Halo Koki! Aku juga mau 1/2 loyang pizza, tapi tolong siapkan dalam loyang 8 potongan kecil (berapa potong yang harus diberi topping ya?)',
    dialogEn: 'Hello Chef! I also want 1/2 of a pizza, but prepared on an 8-slice tray!',
    rewardCoins: 35,
  },
  {
    id: 'ord-6',
    customerName: 'Rubah Foxy',
    customerAnimal: 'fox',
    avatar: '🦊',
    requestedFraction: { numerator: 2, denominator: 5 },
    targetDenominator: 10,
    targetNumerator: 4,
    dialogId: 'Tolong buatkan 2/5 loyang pizza keju panggang! Siapkan dalam loyang 10 potong, lalu beri topping sebanyak 2/5 loyang ya!',
    dialogEn: 'Please make 2/5 baked cheese pizza on a 10-slice tray, with toppings for 2/5 of the pizza!',
    rewardCoins: 45,
  },
  {
    id: 'ord-7',
    customerName: 'Kibo si Koki Master',
    customerAnimal: 'cat',
    avatar: '🐱',
    requestedFraction: { numerator: 1, denominator: 2 },
    targetDenominator: 12,
    targetNumerator: 6,
    dialogId: 'Tantangan Master Koki: Aku mau 1/2 loyang pizza. Siapkan dalam loyang 12 potong, lalu beri topping pada potongan yang bernilai 1/2 loyang!',
    dialogEn: 'Master Chef Challenge: Prepare 1/2 pizza on a 12-slice tray, topping the equivalent of 1/2 of the whole pizza!',
    rewardCoins: 50,
  },
];

export const PizzaShopGame: React.FC<PizzaShopGameProps> = ({
  onOrderServed,
  lang = 'id',
}) => {
  const [orderIndex, setOrderIndex] = useState(0);
  const [currentDenom, setCurrentDenom] = useState(4);
  const [currentNum, setCurrentNum] = useState(0);
  const [message, setMessage] = useState<string>(
    lang === 'id'
      ? 'Pilih pisau potong, lalu klik potongan pizza ATAU tekan tombol [+ Tambah Topping] untuk menabur keju & pepperoni!'
      : 'Select knife slices, then click pizza slices OR press [+ Add Topping]!'
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const order = ORDERS[orderIndex % ORDERS.length];

  // Calculation for helper hints
  const currentFraction: Fraction = { numerator: currentNum, denominator: currentDenom };
  const matchesEquivalent = isEquivalent(currentFraction, order.requestedFraction);
  const matchesDenom = currentDenom === order.targetDenominator;
  
  // Calculate expected numerator for current denominator
  const expectedNum = (order.requestedFraction.numerator * currentDenom) / order.requestedFraction.denominator;

  // Slicing handler
  const handleCutChange = (cut: number) => {
    sound.playChop();
    setCurrentDenom(cut);
    setCurrentNum(0);
  };

  // Direct slice click
  const handleSliceClick = (idx: number) => {
    sound.playPop(440 + idx * 30);
    // If clicking on already topped part vs un-topped part
    const nextNum = idx + 1 === currentNum ? idx : idx + 1;
    setCurrentNum(nextNum);
  };

  // Stepper handlers
  const handleAddOneTopping = () => {
    if (currentNum < currentDenom) {
      sound.playPop(480 + currentNum * 25);
      setCurrentNum((prev) => prev + 1);
    }
  };

  const handleRemoveOneTopping = () => {
    if (currentNum > 0) {
      sound.playPop(380);
      setCurrentNum((prev) => prev - 1);
    }
  };

  const handleFillAll = () => {
    sound.playPop(560);
    setCurrentNum(currentDenom);
  };

  const handleClearAll = () => {
    sound.playPop(340);
    setCurrentNum(0);
  };

  const servePizza = () => {
    if (matchesEquivalent && matchesDenom) {
      sound.playDing();
      setIsSuccess(true);
      onOrderServed(order.rewardCoins);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffc800', '#ff4b4b', '#58cc02', '#1cb0f6'],
      });

      setMessage(
        lang === 'id'
          ? `🎉 YUMMY! ${order.customerName} sangat puas! ${currentNum}/${currentDenom} SENILAI dengan ${order.requestedFraction.numerator}/${order.requestedFraction.denominator}!`
          : `🎉 YUMMY! ${order.customerName} is happy! ${currentNum}/${currentDenom} equals ${order.requestedFraction.numerator}/${order.requestedFraction.denominator}!`
      );

      setTimeout(() => {
        setIsSuccess(false);
        setOrderIndex((prev) => prev + 1);
        const nextOrder = ORDERS[(orderIndex + 1) % ORDERS.length];
        setCurrentDenom(nextOrder.targetDenominator);
        setCurrentNum(0);
        setMessage(
          lang === 'id'
            ? `Pelanggan berikutnya sudah tiba! Yuk siapkan pesanan untuk ${nextOrder.customerName}!`
            : `Next customer is here! Let's prepare pizza for ${nextOrder.customerName}!`
        );
      }, 2500);
    } else if (!matchesDenom) {
      sound.playBoing();
      setMessage(
        lang === 'id'
          ? `Ups! Pelanggan meminta pizza dipotong menjadi ${order.targetDenominator} bagian.`
          : `Oops! The customer asked for ${order.targetDenominator} slices.`
      );
    } else {
      sound.playBoing();
      const diff = expectedNum - currentNum;
      if (diff > 0) {
        setMessage(
          lang === 'id'
            ? `Topping masih kurang! Coba hitung berapa potong yang senilai dengan ${order.requestedFraction.numerator}/${order.requestedFraction.denominator} loyang ya!`
            : `Not enough toppings yet! Calculate how many slices equal ${order.requestedFraction.numerator}/${order.requestedFraction.denominator} of the pizza!`
        );
      } else {
        setMessage(
          lang === 'id'
            ? `Topping kebanyakan! Coba kurangi topping agar senilai dengan ${order.requestedFraction.numerator}/${order.requestedFraction.denominator} loyang ya!`
            : `Too many toppings! Reduce toppings to equal ${order.requestedFraction.numerator}/${order.requestedFraction.denominator} of the pizza!`
        );
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 sm:gap-4 py-1 sm:py-2 px-1 sm:px-4 select-none">
      {/* Mascot Assistant */}
      <MascotBubble message={message} mood={isSuccess ? 'celebrating' : 'happy'} lang={lang} />

      {/* Customer Ticket Card */}
      <CustomerCard order={order} isCurrent={true} lang={lang} />

      {/* Italian Pizzeria Kitchen Counter */}
      <div className="bg-pizzeria-check p-2.5 sm:p-6 rounded-[28px] sm:rounded-[36px] border-4 border-[#ebd5b3] shadow-[0_8px_0_0_#d9bc8c] sm:shadow-[0_10px_0_0_#d9bc8c]">
        <div className="bg-white/95 rounded-[22px] sm:rounded-[28px] border-3 sm:border-4 border-[#ebd5b3] p-3.5 sm:p-6 shadow-md flex flex-col gap-4 sm:gap-6">
          
          {/* Main 3 Kitchen Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
            
            {/* STEP 1: Slicing Knife Tool */}
            <div className="lg:col-span-3 flex flex-col gap-2.5 sm:gap-3 bg-[#fff9ed] p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-3 border-[#ebd5b3] shadow-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[#451a03] font-black font-fun text-xs sm:text-sm">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-[#ff4b4b] text-white flex items-center justify-center text-xs">
                  1
                </div>
                <span>{lang === 'id' ? 'Potong Loyang' : '1. Slice Tray'}</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold m-0 leading-tight">
                {lang === 'id'
                  ? `Pilih loyang berisi ${order.targetDenominator} potong:`
                  : `Select ${order.targetDenominator}-slice tray:`}
              </p>
              
              <div className="grid grid-cols-4 sm:grid-cols-3 gap-1 sm:gap-1.5">
                {[2, 3, 4, 6, 8, 10, 12].map((cut) => (
                  <button
                    key={cut}
                    onClick={() => handleCutChange(cut)}
                    className={`btn-3d py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black font-fun ${
                      currentDenom === cut
                        ? 'btn-3d-red scale-105'
                        : 'btn-3d-white hover:bg-slate-50'
                    }`}
                  >
                    {cut} {lang === 'id' ? 'Pt' : 'Sl'}
                  </button>
                ))}
              </div>

              {currentDenom !== order.targetDenominator && (
                <span className="text-[10px] font-black text-[#dc2626] bg-[#fee2e2] px-2 py-0.5 sm:py-1 rounded-xl border border-[#fca5a5] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>Pilih {order.targetDenominator} potong ya!</span>
                </span>
              )}
            </div>

            {/* STEP 2: The Interactive Pizza & Topping Station */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center bg-[#fffbf2] p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-3 border-[#ebd5b3] shadow-inner">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-[#ffc800] text-[#533800] font-black flex items-center justify-center text-xs">
                  2
                </div>
                <span className="text-xs sm:text-sm font-black font-fun text-[#451a03]">
                  {lang === 'id' ? 'Beri Topping Keju & Pepperoni' : '2. Add Toppings'}
                </span>
              </div>

              {/* Wooden Pizza Board / Serving Paddle */}
              <div className="relative p-3 sm:p-4 bg-gradient-to-b from-[#fed7aa] via-[#fde68a] to-[#d97706] rounded-full border-4 border-[#78350f] shadow-[0_8px_0_0_#451a03] my-1">
                <FractionPizza
                  numerator={currentNum}
                  denominator={currentDenom}
                  size={175}
                  interactive={true}
                  showNumbers={true}
                  onSliceClick={handleSliceClick}
                />
              </div>

              {/* Topping Helper Text */}
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 m-0 mt-1 mb-2 text-center">
                👉 {lang === 'id' ? 'Klik potongan pizza atau tombol di bawah:' : 'Click pizza slices or buttons below:'}
              </p>

              {/* Chunky 3D Stepper Controls for Topping */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2">
                <div className="flex items-center gap-2 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl border-2 border-[#ebd5b3] shadow-sm">
                  {/* Minus Button */}
                  <button
                    onClick={handleRemoveOneTopping}
                    disabled={currentNum <= 0}
                    className="btn-3d btn-3d-white w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-black flex items-center justify-center"
                    title="Kurangi 1 Topping"
                  >
                    <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </button>

                  {/* Topping Counter Pill */}
                  <div className="flex flex-col items-center px-1.5 sm:px-2">
                    <span className="text-xs sm:text-sm font-black font-fun text-[#451a03]">
                      {currentNum} / {currentDenom}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black text-[#b45309] uppercase">
                      Topping
                    </span>
                  </div>

                  {/* Plus Button */}
                  <button
                    onClick={handleAddOneTopping}
                    disabled={currentNum >= currentDenom}
                    className="btn-3d btn-3d-yellow w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-black flex items-center justify-center text-[#533800]"
                    title="Tambah 1 Topping"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </button>
                </div>

                {/* Quick Fill / Clear Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleFillAll}
                    className="btn-3d btn-3d-wood px-2.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black font-fun flex items-center gap-1"
                    title="Beri Topping Semua Potongan"
                  >
                    🧀 <span>Semua</span>
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="btn-3d btn-3d-white px-2.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black font-fun flex items-center gap-1 text-slate-500"
                    title="Bersihkan Semua Topping"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 3: Order Checker & Serve Dish */}
            <div className="lg:col-span-3 flex flex-col gap-2.5 sm:gap-3 bg-[#fff9ed] p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-3 border-[#ebd5b3] shadow-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[#451a03] font-black font-fun text-xs sm:text-sm">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-[#58cc02] text-white flex items-center justify-center text-xs">
                  3
                </div>
                <span>{lang === 'id' ? 'Status & Sajikan' : '3. Serve Dish'}</span>
              </div>

              {/* Real-time Status Card */}
              <div className={`p-2.5 sm:p-3 rounded-2xl border-2 text-center transition-all ${
                matchesEquivalent && matchesDenom
                  ? 'bg-[#f0fdf4] border-[#86efac] text-[#166534]'
                  : 'bg-white border-[#ebd5b3] text-slate-700'
              }`}>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider block mb-0.5 sm:mb-1">
                  Status Pesanan:
                </span>
                
                {matchesEquivalent && matchesDenom ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="flex items-center gap-1 font-black font-fun text-xs text-[#16a34a]">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      PAS & SENILAI!
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold">
                      {currentNum}/{currentDenom} = {order.requestedFraction.numerator}/{order.requestedFraction.denominator}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-bold text-xs text-[#b45309]">
                      {lang === 'id' ? 'Buatanmu:' : 'Your Pizza:'} <strong className="text-xs sm:text-sm">{currentNum}/{currentDenom}</strong>
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold">
                      {lang === 'id' ? 'Target:' : 'Target:'} <strong className="text-[#dc2626]">{order.requestedFraction.numerator}/{order.requestedFraction.denominator} loyang</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Big 3D Serve Button */}
              <button
                onClick={servePizza}
                className={`btn-3d w-full py-3 sm:py-4 font-black font-fun text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all ${
                  matchesEquivalent && matchesDenom
                    ? 'btn-3d-green animate-bounce-slight scale-105'
                    : 'btn-3d-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                <span>{lang === 'id' ? 'SAJIKAN!' : 'SERVE!'}</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
