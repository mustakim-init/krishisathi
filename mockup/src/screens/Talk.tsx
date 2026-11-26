import { useEffect, useRef, useState } from "react";
import { Button, Fab, IconButton } from "material/react";
import { ICONS } from "../icons";
import { PhoneHeader } from "../components/PhoneHeader";
import { buzz } from "../settings";
import {
  DEMO_ANSWER,
  FOLLOW_UP_ONE,
  FOLLOW_UP_THREE,
  FOLLOW_UP_TWO,
  OPENING_QUESTION,
  type ChatMessage,
} from "../data/demo";

type Phase = "idle" | "listening" | "thinking";

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export default function Talk({ onResult }: { onResult: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState("");

  const endRef = useRef<HTMLDivElement>(null);
  const alive = useRef(true);
  /** Every reply and cancel bumps this token, so a pending scripted step stops. */
  const run = useRef(0);
  const nextId = useRef(1);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, composing, step]);

  const push = (role: ChatMessage["role"], text: string) => {
    setMessages((current) => [...current, { id: nextId.current++, role, text }]);
  };

  const aiSay = async (token: number, text: string) => {
    setTyping(true);
    await wait(800);
    if (!alive.current || token !== run.current) return;
    setTyping(false);
    push("ai", text);
  };

  const start = async () => {
    if (phase !== "idle" || step !== 0) return;
    const token = ++run.current;
    buzz(20);
    setPhase("listening");
    await wait(1500);
    if (!alive.current || token !== run.current) return;
    push("farmer", OPENING_QUESTION);
    setPhase("thinking");
    await aiSay(token, FOLLOW_UP_ONE.text);
    if (!alive.current || token !== run.current) return;
    setPhase("idle");
    setStep(1);
  };

  const stop = () => {
    run.current += 1;
    buzz(12);
    setPhase("idle");
    setTyping(false);
  };

  const reply = async (text: string) => {
    if (phase !== "idle" || step === 0 || step > 3) return;
    const token = ++run.current;
    push("farmer", text);
    setPhase("thinking");

    if (step === 1) {
      await aiSay(token, FOLLOW_UP_TWO.text);
      if (token === run.current) setStep(2);
    } else if (step === 2) {
      await aiSay(token, FOLLOW_UP_THREE.text);
      if (token === run.current) setStep(3);
    } else if (step === 3) {
      await aiSay(token, DEMO_ANSWER.summary);
      if (token === run.current) setStep(4);
    }

    if (alive.current && token === run.current) setPhase("idle");
  };

  const restart = () => {
    run.current += 1;
    setMessages([]);
    setTyping(false);
    setPhase("idle");
    setStep(0);
    setDraft("");
    setComposing(false);
    setPlaying(null);
  };

  const replies =
    step === 1
      ? FOLLOW_UP_ONE.replies
      : step === 2
        ? FOLLOW_UP_TWO.replies
        : step === 3
          ? FOLLOW_UP_THREE.replies
          : [];

  const submitDraft = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setComposing(false);
    void reply(text);
  };

  const stateLabel =
    phase === "listening"
      ? "শুনছি... এখন বলুন"
      : phase === "thinking"
        ? "ভাবছি..."
        : step === 0
          ? "চাপ দিয়ে কথা বলুন"
          : "উত্তর বেছে নিন";

  return (
    <section className="view view--talk">
      <PhoneHeader title="কথা বলুন" />

      <div className={`chat ${messages.length === 0 ? "chat--empty" : ""}`} aria-live="polite">
        {messages.length === 0 && (
          <div className="chat__empty">
            <p className="chat__empty-title">এভাবে বলতে পারেন</p>
            <p className="chat__example">“আমার ধানের পাতায় বাদামি দাগ দেখা যাচ্ছে।”</p>
            <p className="chat__empty-hint">
              নিচের বড় বোতামে চাপ দিন। আপনি কথা বললে আমরা লিখে দেখাব, তারপর কয়েকটি ছোট প্রশ্ন করব।
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`bubble bubble--${message.role}`}>
            <p>{message.text}</p>
            {message.role === "ai" && (
              <button
                type="button"
                className={`bubble__speak ${playing === message.id ? "is-playing" : ""}`}
                onClick={() => {
                  setPlaying(message.id);
                  window.setTimeout(
                    () => setPlaying((current) => (current === message.id ? null : current)),
                    1600,
                  );
                }}
                aria-label="উত্তরটি শুনুন"
              >
                <span dangerouslySetInnerHTML={{ __html: ICONS.volume }} />
                <span>{playing === message.id ? "বাজছে..." : "শুনুন"}</span>
              </button>
            )}
          </div>
        ))}

        {typing && (
          <div className="bubble bubble--ai bubble--typing" aria-label="উত্তর তৈরি হচ্ছে">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}

        {step === 4 && !typing && (
          <div className="answer">
            <p className="answer__label">ডেমো ফলাফল</p>
            <p className="answer__headline">{DEMO_ANSWER.headline}</p>
            <p className="answer__confidence">{DEMO_ANSWER.confidence}</p>
            <Button variant="filled" size="m" onClick={onResult}>
              বিস্তারিত দেখুন
            </Button>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {replies.length > 0 && phase === "idle" && (
        <div className="chips-row" role="group" aria-label="উত্তর বাছুন">
          {replies.map((option) => (
            <Button key={option} variant="outlined" size="m" onClick={() => void reply(option)}>
              {option}
            </Button>
          ))}
        </div>
      )}

      {step === 4 ? (
        <div className="mic-hero">
          <p className="mic-hero__state">ডেমো কথোপকথন শেষ</p>
          <Button variant="outlined" size="m" icon={ICONS.mic} onClick={restart}>
            আবার শুরু করুন
          </Button>
        </div>
      ) : composing ? (
        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            submitDraft();
          }}
        >
          <input
            className="composer__input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="এখানে লিখুন..."
            aria-label="উত্তর লিখুন"
            autoFocus
          />
          <IconButton icon={ICONS.send} ariaLabel="পাঠান" onClick={submitDraft} />
        </form>
      ) : (
        <div className="mic-hero">
          <div className={`mic-ring ${phase !== "idle" ? "is-active" : ""}`}>
            <Fab
              variant="primary"
              size="large"
              icon={phase === "listening" ? ICONS.close : ICONS.mic}
              ariaLabel={phase === "listening" ? "শোনা বন্ধ করুন" : "কথা বলুন"}
              onClick={() => {
                if (phase === "listening") stop();
                else if (phase === "idle") void start();
              }}
            />
          </div>
          <p className="mic-hero__state">{stateLabel}</p>
          <Button variant="text" size="s" onClick={() => setComposing(true)}>
            লিখে বলুন
          </Button>
        </div>
      )}

      <p className="talk-note">ডেমো কথোপকথন · সত্যিকারের রোগ নির্ণয় নয়</p>
    </section>
  );
}
