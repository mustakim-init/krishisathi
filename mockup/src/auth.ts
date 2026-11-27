/* Scripted sign-in state. No SMS, no Google request and no server: the demo
   screen verifies a fixed code and keeps the chosen account on this device. */

export type Auth =
  | { method: "phone"; phone: string }
  | { method: "google"; email: string };

const AUTH_KEY = "krishisathi.auth";

function isAuth(value: unknown): value is Auth {
  if (!value || typeof value !== "object") return false;
  const saved = value as Partial<Auth> & { method?: string };
  if (saved.method === "phone") return typeof (saved as { phone?: unknown }).phone === "string";
  if (saved.method === "google") return typeof (saved as { email?: unknown }).email === "string";
  return false;
}

export function readAuth(): Auth | null {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isAuth(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeAuth(auth: Auth): void {
  try {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  } catch {
    /* Private mode can block storage; the demo still works without it. */
  }
}

export function clearAuth(): void {
  try {
    window.localStorage.removeItem(AUTH_KEY);
  } catch {
    /* Nothing to clear when storage is blocked. */
  }
}
