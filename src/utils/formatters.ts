/**
 * Format Indian currency numbers
 * e.g. 1250000 -> ₹12.50 Lakh
 * e.g. 15000000 -> ₹1.50 Crore
 */
export function formatPriceINR(amount: number, format: 'short' | 'full' = 'short'): string {
  if (isNaN(amount) || amount === 0) return '₹0';

  if (format === 'short') {
    if (amount >= 10000000) {
      const crore = amount / 10000000;
      return `₹${crore.toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (amount >= 100000) {
      const lakh = amount / 100000;
      return `₹${lakh.toFixed(2).replace(/\.00$/, '')} Lakh`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatKilometers(km: number): string {
  return `${new Intl.NumberFormat('en-IN').format(km)} km`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatTime(timeString: string): string {
  return timeString;
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}
