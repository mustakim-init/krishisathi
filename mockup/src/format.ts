const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const ENGLISH_FROM_BANGLA: Record<string, string> = {
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9",
};

/** Writes a number with Bangla digits, e.g. 12 -> "১২". */
export function toBangla(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)]);
}

/** Reads a value typed with Bangla or English digits as plain English digits. */
export function fromBangla(value: string): string {
  return value.replace(/[০-৯]/g, (digit) => ENGLISH_FROM_BANGLA[digit] ?? digit);
}

const MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** Short Bangla date for saved items: আজ / গতকাল / ২৫ নভেম্বর. */
export function formatDay(timestamp: number): string {
  const now = new Date();
  const then = new Date(timestamp);
  const days = Math.round((startOfDay(now) - startOfDay(then)) / 86_400_000);
  if (days <= 0) return "আজ";
  if (days === 1) return "গতকাল";
  return `${toBangla(then.getDate())} ${MONTHS[then.getMonth()]}`;
}

/** Calendar date for headers and forecasts, including future days. */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${toBangla(date.getDate())} ${MONTHS[date.getMonth()]}`;
}
