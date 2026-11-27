import { formatDate } from "./format";

export type WeatherKind = "sun" | "cloudSun" | "cloud" | "rain" | "storm";

export type WeatherDay = {
  icon: WeatherKind;
  condition: string;
  high: number;
  low: number;
  rain: number;
};

type DemoWeather = {
  current: {
    temp: number;
    condition: string;
    icon: WeatherKind;
    high: number;
    low: number;
    rain: number;
    humidity: number;
    wind: number;
  };
  days: WeatherDay[];
};

/* Phase 1 has no weather service. These are fixed sample values, labelled
   "ডেমো" everywhere they appear; the dates follow the device calendar. */
export const DEMO_WEATHER: DemoWeather = {
  current: {
    temp: 32,
    condition: "আংশিক মেঘলা",
    icon: "cloudSun",
    high: 34,
    low: 24,
    rain: 20,
    humidity: 68,
    wind: 9,
  },
  days: [
    { icon: "cloudSun", condition: "আংশিক মেঘলা", high: 34, low: 24, rain: 20 },
    { icon: "sun", condition: "রোদ", high: 33, low: 23, rain: 10 },
    { icon: "cloudSun", condition: "মেঘলা", high: 31, low: 23, rain: 30 },
    { icon: "rain", condition: "হালকা বৃষ্টি", high: 29, low: 22, rain: 60 },
    { icon: "rain", condition: "বৃষ্টি", high: 28, low: 22, rain: 70 },
    { icon: "storm", condition: "বজ্রসহ বৃষ্টি", high: 27, low: 21, rain: 80 },
    { icon: "cloudSun", condition: "মেঘলা", high: 30, low: 22, rain: 40 },
  ],
};

const WEEKDAYS = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];
const FULL_WEEKDAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

export type WeatherLabel = {
  label: string;
  fullLabel: string;
  date: string;
};

/** The next seven calendar days, starting today. */
export function nextSevenDays(): WeatherLabel[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
    return {
      label: index === 0 ? "আজ" : WEEKDAYS[day.getDay()],
      fullLabel: index === 0 ? "আজ" : FULL_WEEKDAYS[day.getDay()],
      date: formatDate(day.getTime()),
    };
  });
}
