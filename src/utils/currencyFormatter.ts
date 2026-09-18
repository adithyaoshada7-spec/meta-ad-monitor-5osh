/**
 * Formats a numeric monetary value cleanly into LKR (Rs.) or USD ($)
 */
export function formatCurrency(
  val: number | undefined | null,
  currency: string = 'LKR',
  minimumFractionDigits: number = 2
): string {
  if (val === undefined || val === null || isNaN(val)) {
    return currency === 'LKR' ? 'Rs. 0.00' : '$0.00';
  }

  const rounded = Number(val);

  if (currency === 'LKR' || currency === 'Rs' || currency === 'RS') {
    const formattedNum = new Intl.NumberFormat('en-US', {
      minimumFractionDigits,
      maximumFractionDigits: minimumFractionDigits
    }).format(rounded);
    return `Rs. ${formattedNum}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits
  }).format(rounded);
}
