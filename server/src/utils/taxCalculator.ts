interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 1000000, rate: 0 },
  { min: 1000001, max: 3000000, rate: 0.05 },
  { min: 3000001, max: 6000000, rate: 0.10 },
  { min: 6000001, max: 10000000, rate: 0.15 },
  { min: 10000001, max: 20000000, rate: 0.20 },
  { min: 20000001, max: Infinity, rate: 0.25 }
];

export const calculateTax = (revenue: number): number => {
  let totalTax = 0;
  let remainingRevenue = revenue;

  for (const bracket of TAX_BRACKETS) {
    if (remainingRevenue <= 0) break;

    const taxableInThisBracket = Math.min(
      remainingRevenue,
      bracket.max - bracket.min + 1
    );

    if (taxableInThisBracket > 0) {
      totalTax += taxableInThisBracket * bracket.rate;
      remainingRevenue -= taxableInThisBracket;
    }
  }

  return Math.round(totalTax);
}; 