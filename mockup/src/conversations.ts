/* Conversations saved on the device. Two clearly labelled demo chats seed the
   history drawer; every later conversation is the visitor's own script. */

import {
  AGE_QUESTION,
  DEMO_ANSWER,
  OPENING_QUESTION,
  WATER_QUESTION,
  type CaseAnswers,
  type ChatMessage,
} from "./data/demo";

export type Conversation = {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
  step: number;
  answers: CaseAnswers;
  demo: boolean;
};

const CONVERSATION_KEY = "krishisathi.conversations";
const MAX_SAVED = 20;

function demoConversations(): Conversation[] {
  const day = 86_400_000;
  return [
    {
      id: "demo-brown-spots",
      title: "পাতায় বাদামি দাগ",
      updatedAt: Date.now() - day,
      step: 3,
      answers: { age: "৪৫ দিন", standingWater: "হ্যাঁ" },
      demo: true,
      messages: [
        { id: 1, role: "farmer", text: OPENING_QUESTION },
        { id: 2, role: "ai", text: AGE_QUESTION.text },
        { id: 3, role: "farmer", text: "৪৫ দিন" },
        { id: 4, role: "ai", text: WATER_QUESTION.text },
        { id: 5, role: "farmer", text: "হ্যাঁ" },
        { id: 6, role: "ai", text: DEMO_ANSWER.summary },
      ],
    },
    {
      id: "demo-yellow-leaves",
      title: "পাতা হলদে হয়ে যাচ্ছে",
      updatedAt: Date.now() - day * 4,
      step: 3,
      answers: { age: "৩০ দিন", standingWater: "না" },
      demo: true,
      messages: [
        { id: 1, role: "farmer", text: "গাছের পাতা হলদে হয়ে যাচ্ছে।" },
        { id: 2, role: "ai", text: AGE_QUESTION.text },
        { id: 3, role: "farmer", text: "৩০ দিন" },
        { id: 4, role: "ai", text: WATER_QUESTION.text },
        { id: 5, role: "farmer", text: "না" },
        { id: 6, role: "ai", text: DEMO_ANSWER.summary },
      ],
    },
  ];
}

function isMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ChatMessage>;
  return (
    typeof item.id === "number" &&
    (item.role === "farmer" || item.role === "ai") &&
    typeof item.text === "string"
  );
}

function isConversation(value: unknown): value is Conversation {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Conversation>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.updatedAt === "number" &&
    Array.isArray(item.messages) &&
    item.messages.every(isMessage) &&
    typeof item.step === "number" &&
    Boolean(item.answers) &&
    typeof item.answers === "object"
  );
}

function writeAll(items: Conversation[]): void {
  try {
    window.localStorage.setItem(CONVERSATION_KEY, JSON.stringify(items));
  } catch {
    /* Private mode can block storage; the history drawer still works in memory. */
  }
}

export function readConversations(): Conversation[] {
  try {
    const raw = window.localStorage.getItem(CONVERSATION_KEY);
    if (!raw) {
      const seeded = demoConversations();
      writeAll(seeded);
      return seeded;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return demoConversations();
    return parsed
      .filter(isConversation)
      .map((item) => ({ ...item, demo: Boolean(item.demo) }))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return demoConversations();
  }
}

export function saveConversation(next: Conversation): void {
  const rest = readConversations().filter((item) => item.id !== next.id);
  writeAll([next, ...rest].slice(0, MAX_SAVED));
}

export function newConversationId(): string {
  return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function titleFor(messages: ChatMessage[]): string {
  const first = messages.find((message) => message.role === "farmer");
  if (!first) return "নতুন কথা";
  if (first.photo) return "পাতার ছবি দেখানো হয়েছে";
  return first.text.length > 46 ? `${first.text.slice(0, 46)}…` : first.text;
}
