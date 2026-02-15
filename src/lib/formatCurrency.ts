export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatCompact(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M zł`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K zł`;
  }
  return formatCurrency(amount);
}
