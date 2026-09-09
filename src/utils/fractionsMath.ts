import type { Fraction, ComparisonResult, LevelConfig } from '../types/fractions';

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function simplifyFraction(f: Fraction): { numerator: number; denominator: number; factor: number } {
  const common = gcd(f.numerator, f.denominator);
  return {
    numerator: f.numerator / common,
    denominator: f.denominator / common,
    factor: common,
  };
}

export function compareFractions(f1: Fraction, f2: Fraction): ComparisonResult {
  const cross1 = f1.numerator * f2.denominator;
  const cross2 = f2.numerator * f1.denominator;
  if (cross1 === cross2) return 'equal';
  if (cross1 > cross2) return 'greater';
  return 'less';
}

export function isEquivalent(f1: Fraction, f2: Fraction): boolean {
  return f1.numerator * f2.denominator === f2.numerator * f1.denominator;
}

export function fractionToDecimal(f: Fraction): number {
  if (f.denominator === 0) return 0;
  return f.numerator / f.denominator;
}

/**
 * Calculates SVG arc path for a pie slice
 */
export function describePieSlice(
  centerX: number,
  centerY: number,
  radius: number,
  startAngleDeg: number,
  endAngleDeg: number
): string {
  const startRad = ((startAngleDeg - 90) * Math.PI) / 180;
  const endRad = ((endAngleDeg - 90) * Math.PI) / 180;

  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);

  const largeArcFlag = endAngleDeg - startAngleDeg <= 180 ? '0' : '1';

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

/**
 * Predefined 8 Progressive Levels
 */
export function getLevelConfigs(): LevelConfig[] {
  return [
    {
      id: 1,
      title: 'Tingkat 1: Setengah & Seperempat',
      titleEn: 'Level 1: Halves & Fourths',
      description: 'Cocokkan gambar pizza & cokelat yang bernilai setengah (1/2) dan seperempat (1/4)!',
      descriptionEn: 'Match pizzas & chocolate bars showing 1/2 and 1/4!',
      hint: 'Lihat luas bagian yang diwarnai, apakah sama besarnya?',
      hintEn: 'Look at the colored area, are they the same size?',
      targetPairsCount: 3,
      cards: [
        { pairId: 'p1', fraction: { numerator: 1, denominator: 2 }, shape: 'pizza' },
        { pairId: 'p1', fraction: { numerator: 2, denominator: 4 }, shape: 'chocolate' },
        { pairId: 'p2', fraction: { numerator: 1, denominator: 4 }, shape: 'pizza' },
        { pairId: 'p2', fraction: { numerator: 2, denominator: 8 }, shape: 'chocolate' },
        { pairId: 'p3', fraction: { numerator: 3, denominator: 4 }, shape: 'pizza' },
        { pairId: 'p3', fraction: { numerator: 6, denominator: 8 }, shape: 'chocolate' },
      ],
    },
    {
      id: 2,
      title: 'Tingkat 2: Simbol Angka & Gambar',
      titleEn: 'Level 2: Numbers & Visuals',
      description: 'Pasangkan kartu pecahan angka dengan gambar visual yang senilai!',
      descriptionEn: 'Pair symbolic fraction cards with their equivalent visual shapes!',
      hint: 'Ingat: Angka atas (pembilang) adalah bagian warna, angka bawah (penyebut) adalah semua potongan.',
      hintEn: 'Remember: Top number is shaded, bottom number is total slices.',
      targetPairsCount: 3,
      cards: [
        { pairId: 'p1', fraction: { numerator: 1, denominator: 3 }, shape: 'symbol' },
        { pairId: 'p1', fraction: { numerator: 2, denominator: 6 }, shape: 'pizza' },
        { pairId: 'p2', fraction: { numerator: 2, denominator: 3 }, shape: 'symbol' },
        { pairId: 'p2', fraction: { numerator: 4, denominator: 6 }, shape: 'chocolate' },
        { pairId: 'p3', fraction: { numerator: 1, denominator: 2 }, shape: 'symbol' },
        { pairId: 'p3', fraction: { numerator: 3, denominator: 6 }, shape: 'beaker' },
      ],
    },
    {
      id: 3,
      title: 'Tingkat 3: Jus Segar & Cokelat Sepertiga',
      titleEn: 'Level 3: Fresh Juice & Thirds',
      description: 'Temukan pasangan pecahan senilai menggunakan gelas jus dan cokelat!',
      descriptionEn: 'Find equivalent pairs using juice beakers and chocolate grids!',
      hint: 'Gelas yang terisi 2 dari 4 bagian sama tingginya dengan 1 dari 2 bagian!',
      hintEn: 'A beaker filled 2 of 4 parts is at the exact same height as 1 of 2 parts!',
      targetPairsCount: 3,
      cards: [
        { pairId: 'p1', fraction: { numerator: 1, denominator: 2 }, shape: 'beaker' },
        { pairId: 'p1', fraction: { numerator: 4, denominator: 8 }, shape: 'pizza' },
        { pairId: 'p2', fraction: { numerator: 3, denominator: 5 }, shape: 'chocolate' },
        { pairId: 'p2', fraction: { numerator: 6, denominator: 10 }, shape: 'symbol' },
        { pairId: 'p3', fraction: { numerator: 2, denominator: 4 }, shape: 'symbol' },
        { pairId: 'p3', fraction: { numerator: 3, denominator: 6 }, shape: 'chocolate' },
      ],
    },
    {
      id: 4,
      title: 'Tingkat 4: Jembatan Garis Bilangan',
      titleEn: 'Level 4: Number Line Bridge',
      description: 'Lompat bersama kelinci pada garis bilangan pecahan senilai!',
      descriptionEn: 'Jump with the bunny along the fraction number line!',
      hint: 'Posisi titik pada garis bilangan menunjukkan nilai pecahan dari 0 ke 1.',
      hintEn: 'The point position on the number line represents the fraction value from 0 to 1.',
      targetPairsCount: 3,
      cards: [
        { pairId: 'p1', fraction: { numerator: 1, denominator: 4 }, shape: 'numberline' },
        { pairId: 'p1', fraction: { numerator: 2, denominator: 8 }, shape: 'symbol' },
        { pairId: 'p2', fraction: { numerator: 3, denominator: 4 }, shape: 'numberline' },
        { pairId: 'p2', fraction: { numerator: 6, denominator: 8 }, shape: 'pizza' },
        { pairId: 'p3', fraction: { numerator: 1, denominator: 3 }, shape: 'numberline' },
        { pairId: 'p3', fraction: { numerator: 3, denominator: 9 }, shape: 'chocolate' },
      ],
    },
    {
      id: 5,
      title: 'Tingkat 5: Kelipatan & Penyederhanaan',
      titleEn: 'Level 5: Multiples & Simplification',
      description: 'Pecahan dengan penyebut lebih besar! Kalikan atas dan bawah dengan angka yang sama.',
      descriptionEn: 'Fractions with larger denominators! Multiply top and bottom by the same number.',
      hint: 'Jika kamu mengalikan pembilang & penyebut dengan 2 atau 3, nilainya tetap sama!',
      hintEn: 'If you multiply both numerator & denominator by 2 or 3, the value stays equal!',
      targetPairsCount: 3,
      cards: [
        { pairId: 'p1', fraction: { numerator: 2, denominator: 5 }, shape: 'symbol' },
        { pairId: 'p1', fraction: { numerator: 4, denominator: 10 }, shape: 'pizza' },
        { pairId: 'p2', fraction: { numerator: 4, denominator: 6 }, shape: 'chocolate' },
        { pairId: 'p2', fraction: { numerator: 8, denominator: 12 }, shape: 'beaker' },
        { pairId: 'p3', fraction: { numerator: 3, denominator: 6 }, shape: 'numberline' },
        { pairId: 'p3', fraction: { numerator: 5, denominator: 10 }, shape: 'symbol' },
      ],
    },
    {
      id: 6,
      title: 'Tingkat 6: Tantangan Campuran Model',
      titleEn: 'Level 6: Mixed Visual Challenge',
      description: 'Cocokkan berbagai bentuk visual yang berbeda: Pizza, Cokelat, Jus, dan Garis!',
      descriptionEn: 'Match different visual representations: Pizza, Chocolate, Juice, and Number line!',
      hint: 'Jangan terkecoh oleh bentuknya! Fokus pada proporsi nilai pecahannya.',
      hintEn: 'Do not be fooled by shape! Focus on the fraction ratio.',
      targetPairsCount: 3,
      cards: [
        { pairId: 'p1', fraction: { numerator: 3, denominator: 4 }, shape: 'beaker' },
        { pairId: 'p1', fraction: { numerator: 9, denominator: 12 }, shape: 'numberline' },
        { pairId: 'p2', fraction: { numerator: 2, denominator: 8 }, shape: 'chocolate' },
        { pairId: 'p2', fraction: { numerator: 3, denominator: 12 }, shape: 'pizza' },
        { pairId: 'p3', fraction: { numerator: 4, denominator: 5 }, shape: 'symbol' },
        { pairId: 'p3', fraction: { numerator: 8, denominator: 10 }, shape: 'chocolate' },
      ],
    },
    {
      id: 7,
      title: 'Tingkat 7: Pecahan Utuh & Satu Lebih',
      titleEn: 'Level 7: Wholes & Beyond',
      description: 'Pecahan utuh senilai (seperti 2/2, 4/4) dan pecahan bernilai 1!',
      descriptionEn: 'Whole equivalent fractions (like 2/2, 4/4) and unit values!',
      hint: 'Jika pembilang sama dengan penyebut (misal 4/4), nilainya adalah 1 utuh!',
      hintEn: 'When numerator equals denominator (e.g. 4/4), it represents 1 whole!',
      targetPairsCount: 3,
      cards: [
        { pairId: 'p1', fraction: { numerator: 4, denominator: 4 }, shape: 'pizza' },
        { pairId: 'p1', fraction: { numerator: 8, denominator: 8 }, shape: 'chocolate' },
        { pairId: 'p2', fraction: { numerator: 5, denominator: 5 }, shape: 'beaker' },
        { pairId: 'p2', fraction: { numerator: 1, denominator: 1 }, shape: 'symbol' },
        { pairId: 'p3', fraction: { numerator: 2, denominator: 3 }, shape: 'numberline' },
        { pairId: 'p3', fraction: { numerator: 6, denominator: 9 }, shape: 'pizza' },
      ],
    },
    {
      id: 8,
      title: 'Tingkat 8: Master Pecahan Ajaib',
      titleEn: 'Level 8: Ultimate Fraction Master',
      description: 'Ujian terakhir para Koki Matematika! Cocokkan pecahan senilai dengan tepat dan cepat!',
      descriptionEn: 'The ultimate Math Chef challenge! Match equivalent fractions with precision!',
      hint: 'Kamu sudah menjadi Master Pecahan! Gunakan semua teknik yang telah dipelajari.',
      hintEn: 'You are now a Fraction Master! Use all your learned strategies.',
      targetPairsCount: 3,
      cards: [
        { pairId: 'p1', fraction: { numerator: 3, denominator: 9 }, shape: 'pizza' },
        { pairId: 'p1', fraction: { numerator: 4, denominator: 12 }, shape: 'chocolate' },
        { pairId: 'p2', fraction: { numerator: 6, denominator: 8 }, shape: 'numberline' },
        { pairId: 'p2', fraction: { numerator: 9, denominator: 12 }, shape: 'beaker' },
        { pairId: 'p3', fraction: { numerator: 5, denominator: 10 }, shape: 'symbol' },
        { pairId: 'p3', fraction: { numerator: 6, denominator: 12 }, shape: 'symbol' },
      ],
    },
  ];
}
