/* The farmer's own cost entries. Nothing is pre-filled: the total on the farm
   screen is computed only from what the farmer adds on this device. */

export const EXPENSE_CATEGORIES = ["বীজ", "সার", "সেচ", "শ্রমিক", "ওষুধ", "অন্যান্য"] as const;

export type Expense = {
  id: string;
  category: (typeof EXPENSE_CATEGORIES)[number];
  amount: number;
};

const EXPENSE_KEY = "krishisathi.expenses";

function isExpense(value: unknown): value is Expense {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Expense>;
  return (
    typeof item.id === "string" &&
    typeof item.amount === "number" &&
    item.amount > 0 &&
    (EXPENSE_CATEGORIES as readonly string[]).includes(item.category ?? "")
  );
}

export function readExpenses(): Expense[] {
  try {
    const raw = window.localStorage.getItem(EXPENSE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isExpense) : [];
  } catch {
    return [];
  }
}

export function writeExpenses(items: Expense[]): void {
  try {
    window.localStorage.setItem(EXPENSE_KEY, JSON.stringify(items));
  } catch {
    /* Private mode can block storage; the demo still works without it. */
  }
}

export function newExpenseId(): string {
  return `e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
