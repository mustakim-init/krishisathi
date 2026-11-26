export type Tab = "home" | "talk" | "farm" | "help";

export type Screen = "onboarding" | Tab | "doctor" | "result" | "guides" | "guide" | "settings";

export const TAB_SCREENS: readonly Tab[] = ["home", "talk", "farm", "help"];

export const SCREENS: readonly Screen[] = [
  "onboarding",
  "home",
  "talk",
  "doctor",
  "result",
  "farm",
  "guides",
  "help",
  "guide",
  "settings",
];

export const isTab = (screen: Screen): screen is Tab => (TAB_SCREENS as readonly Screen[]).includes(screen);
