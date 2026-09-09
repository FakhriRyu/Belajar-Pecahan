import React from 'react';
import type { CustomerOrder } from '../../types/fractions';

interface CustomerCardProps {
  order: CustomerOrder;
  isCurrent?: boolean;
  lang?: 'id' | 'en';
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  order,
  lang = 'id',
}) => {
  const getAnimalEmoji = (animal: CustomerOrder['customerAnimal']) => {
    switch (animal) {
      case 'rabbit': return '🐰';
      case 'panda': return '🐼';
      case 'bear': return '🐻';
      case 'cat': return '🐱';
      case 'fox': return '🦊';
    }
  };

  return (
    <div className="relative bg-[#fff9ed] p-3 sm:p-5 rounded-[24px] sm:rounded-[32px] border-4 border-[#ebd5b3] shadow-[0_6px_0_0_#d9bc8c] sm:shadow-[0_8px_0_0_#d9bc8c] flex items-start gap-3 sm:gap-4 select-none">
      {/* Hanging Clothespin Header decoration */}
      <div className="absolute -top-3 left-6 sm:left-10 w-6 h-4 sm:w-7 sm:h-5 bg-[#d97706] rounded-md border-2 border-[#78350f] shadow-sm flex items-center justify-center text-[9px] font-black text-white">
        📌
      </div>

      {/* Animal Customer Avatar */}
      <div className="w-13 h-13 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#fff5df] border-3 sm:border-4 border-[#b45309] shadow-md flex items-center justify-center text-3xl sm:text-5xl flex-shrink-0 animate-bounce-slight">
        {getAnimalEmoji(order.customerAnimal)}
      </div>

      {/* Order Speech Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="font-fun font-black text-sm sm:text-base text-[#451a03]">
            {order.customerName}
          </span>
          <span className="text-[10px] sm:text-xs font-black text-[#713f12] bg-[#fef08a] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#ca8a04] whitespace-nowrap">
            +{order.rewardCoins} 🪙 {lang === 'id' ? 'Hadiah' : 'Reward'}
          </span>
        </div>

        <p className="text-[11px] sm:text-sm font-bold text-slate-700 leading-snug m-0">
          "{lang === 'id' ? order.dialogId : order.dialogEn}"
        </p>

        {/* Big Chunky Recipe Target Chip */}
        <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-1.5 bg-[#fee2e2] border-2 border-[#fca5a5] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black text-[#991b1b]">
          <span>🎯 {lang === 'id' ? 'Misi:' : 'Mission:'}</span>
          <span>{lang === 'id' ? 'Beri topping senilai' : 'Top equivalent of'}</span>
          <span className="bg-white px-1.5 py-0.5 rounded-lg border border-[#f87171] text-xs sm:text-sm font-black text-[#dc2626]">
            {order.requestedFraction.numerator}/{order.requestedFraction.denominator} loyang
          </span>
          <span>{lang === 'id' ? `pada pizza ${order.targetDenominator} potong` : `on a ${order.targetDenominator}-slice pizza`}</span>
        </div>
      </div>
    </div>
  );
};
