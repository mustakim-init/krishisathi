/* Scripted demo content. Everything here is fake and shown under a "ডেমো" badge.
   No pesticide names or doses appear anywhere: the demo answer is cultural only. */

export type ChatMessage = {
  id: number;
  role: "farmer" | "ai";
  text: string;
  /** Shown as a small caption under the bubble, e.g. the demo transcript note. */
  note?: string;
};

export const OPENING_QUESTION = "আমার ধানের পাতায় বাদামি দাগ দেখা যাচ্ছে।";

export const FOLLOW_UP_ONE = {
  text: "আপনার ধানের বয়স কত দিন?",
  replies: ["৪৫ দিন", "৩০ দিন", "জানি না"],
};

export const FOLLOW_UP_TWO = {
  text: "একটা পাতার কাছ থেকে পরিষ্কার ছবি পাঠাতে পারবেন?",
  replies: ["ছবি পাঠাই", "পরে দেব"],
};

export const FOLLOW_UP_THREE = {
  text: "জমিতে কি পানি জমে আছে?",
  replies: ["হ্যাঁ", "না"],
};

export const DEMO_ANSWER = {
  headline: "সম্ভাব্য সমস্যা: বাদামি দাগ রোগ",
  confidence: "সম্ভাবনা মাঝারি",
  summary:
    "পাতায় বাদামি দাগ আর জমিতে পানি জমা থাকার কথা মিলে যাচ্ছে। নিচের ধাপগুলো দেখুন, তারপর নিশ্চিত হতে কৃষি অফিসের সঙ্গে কথা বলুন।",
};
