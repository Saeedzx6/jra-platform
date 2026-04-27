import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string, locale = 'en') {
  return new Date(dateStr).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPrice(price: string | number) {
  return `${parseFloat(String(price)).toFixed(0)} JOD`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

export function truncate(text: string, length = 120) {
  if (text.length <= length) return text;
  return text.slice(0, length) + '…';
}
