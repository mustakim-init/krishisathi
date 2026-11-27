/* Scripted demo content. Everything here is fake and shown under a "ডেমো"
   badge. No pesticide names or doses appear anywhere: the demo answer is
   cultural only. */

export type PhotoVariant = 1 | 2 | 3;

export type ChatMessage = {
  id: number;
  role: "farmer" | "ai";
  text: string;
  /** A drawn sample photo attached to the message, never a real camera image. */
  photo?: PhotoVariant;
};

export const OPENING_QUESTION = "আমার ধানের পাতায় বাদামি দাগ দেখা যাচ্ছে।";

export const AGE_QUESTION = {
  text: "আপনার ধানের বয়স কত দিন?",
  replies: ["৪৫ দিন", "৩০ দিন", "জানি না"],
};

export const WATER_QUESTION = {
  text: "জমিতে কি পানি জমে আছে?",
  replies: ["হ্যাঁ", "না"],
};

export const EXAMPLE_PROMPTS = [
  "আমার ধানের পাতায় বাদামি দাগ দেখা যাচ্ছে",
  "গাছের পাতা হলদে হয়ে যাচ্ছে",
  "জমিতে পোকা দেখছি, কী করব?",
];

export const PHOTO_SAMPLES: ReadonlyArray<{ id: PhotoVariant; label: string }> = [
  { id: 1, label: "বাদামি দাগ" },
  { id: 2, label: "পাতা পোড়া" },
  { id: 3, label: "হলদে পাতা" },
];

/** What the farmer chose before the advice was shown. */
export type CaseAnswers = {
  age: string;
  standingWater: string;
};

export const DEFAULT_ANSWERS: CaseAnswers = { age: "৪৫ দিন", standingWater: "হ্যাঁ" };

export const DEMO_ANSWER = {
  headline: "সম্ভাব্য সমস্যা: বাদামি দাগ রোগ",
  confidence: "সম্ভাবনা মাঝারি",
  summary:
    "পাতায় বাদামি দাগ আর জমিতে পানি জমা থাকার কথা মিলে যাচ্ছে। নিচের ধাপগুলো দেখুন, তারপর নিশ্চিত হতে কৃষি অফিসের সঙ্গে কথা বলুন।",
};
