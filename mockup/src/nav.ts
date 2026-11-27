export type Tab = "home" | "talk" | "farm" | "help";

export type Screen =
  | "onboarding"
  | Tab
  | "login"
  | "setup"
  | "profile"
  | "saved"
  | "weather"
  | "result"
  | "guides"
  | "guide"
  | "settings";

export const TAB_SCREENS: readonly Tab[] = ["home", "talk", "farm", "help"];

export const SCREENS: readonly Screen[] = [
  "onboarding",
  "login",
  "setup",
  "home",
  "talk",
  "result",
  "farm",
  "guides",
  "profile",
  "saved",
  "weather",
  "help",
  "guide",
  "settings",
];

export const isTab = (screen: Screen): screen is Tab => (TAB_SCREENS as readonly Screen[]).includes(screen);
