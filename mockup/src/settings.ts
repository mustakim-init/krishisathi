/* Small preferences. Each one changes the prototype for real: the text size
   scales the app content, the vibration fires on the mic, and the spoken
   answer plays at the chosen speed. */

export type TextSize = "normal" | "large" | "larger";
export type VoiceSpeed = "slow" | "normal";

const TEXT_KEY = "krishisathi.textSize";
const SPEED_KEY = "krishisathi.voiceSpeed";
const VIBRATE_KEY = "krishisathi.vibrate";

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* Private mode can block storage; the demo still works without it. */
  }
}

export function readTextSize(): TextSize {
  const value = read(TEXT_KEY);
  return value === "large" || value === "larger" ? value : "normal";
}

export function writeTextSize(value: TextSize): void {
  write(TEXT_KEY, value);
}

export function readVoiceSpeed(): VoiceSpeed {
  return read(SPEED_KEY) === "slow" ? "slow" : "normal";
}

export function writeVoiceSpeed(value: VoiceSpeed): void {
  write(SPEED_KEY, value);
}

export function readVibrate(): boolean {
  return read(VIBRATE_KEY) !== "off";
}

export function writeVibrate(on: boolean): void {
  write(VIBRATE_KEY, on ? "on" : "off");
}

/** Length of the scripted spoken answer, following the chosen speed. */
export function playbackMs(base: number): number {
  return readVoiceSpeed() === "slow" ? Math.round(base * 1.7) : base;
}

/** Short buzz when the mic opens or closes, as a phone would give. */
export function buzz(pattern: number | number[]): void {
  if (!readVibrate()) return;
  if (typeof navigator.vibrate !== "function") return;
  navigator.vibrate(pattern);
}
