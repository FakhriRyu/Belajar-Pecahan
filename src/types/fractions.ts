export type ShapeType = 'pizza' | 'chocolate' | 'beaker' | 'numberline';

export interface Fraction {
  numerator: number;
  denominator: number;
}

export type ComparisonResult = 'equal' | 'greater' | 'less';

export interface MatchPair {
  id: string;
  fractionA: Fraction;
  shapeA: ShapeType | 'symbol';
  fractionB: Fraction;
  shapeB: ShapeType | 'symbol';
}

export interface MatchCard {
  id: string;
  fraction: Fraction;
  shape: ShapeType | 'symbol';
  isMatched: boolean;
  traySlot?: number; // 0..5 slot index on target trays
}

export interface LevelConfig {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  cards: { fraction: Fraction; shape: ShapeType | 'symbol'; pairId: string }[];
  targetPairsCount: number;
  hint: string;
  hintEn: string;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  customerAnimal: 'rabbit' | 'panda' | 'bear' | 'cat' | 'fox';
  avatar: string;
  requestedFraction: Fraction; // e.g. 1/2
  targetDenominator: number;   // e.g. 6 (so student cuts into 6 and takes 3)
  targetNumerator: number;     // 3
  dialogId: string;
  dialogEn: string;
  rewardCoins: number;
}

export interface Badge {
  id: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface UserProgress {
  unlockedLevel: number;
  levelStars: Record<number, number>; // levelId -> 1..3 stars
  totalPizzasServed: number;
  equalitiesFound: number;
  coins: number;
  unlockedBadges: string[];
}

export type NavTab = 'game' | 'lab' | 'pizza' | 'subtraction' | 'trophy';
