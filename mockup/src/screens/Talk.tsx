import { useEffect, useRef, useState } from "react";
import { Button, Fab, IconButton } from "material/react";
import { ICONS } from "../icons";
import { PhoneHeader } from "../components/PhoneHeader";
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
  const nextId = useRef(1);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, composing]);

  const push = (role: ChatMessage["role"], text: string) => {
    setMessages((current) => [...current, { id: nextId.current++, role, text }]);
  };

  const aiSay = async (text: string) => {
    setTyping(true);
    await wait(800);
    if (!alive.current) return;
    setTyping(false);
    push("ai", text);
  };

  const start = async () => {
    if (phase !== "idle" || step !== 0) return;
    setPhase("listening");
    await wait(1500);
    if (!alive.current) return;
    push("farmer", OPENING_QUESTION);
    setPhase("thinking");
    await aiSay(FOLLOW_UP_ONE.text);
    setPhase("idle");
    setStep(1);
  };

  const reply = async (text: string) => {
    if (phase !== "idle" || step === 0) return;
    push("farmer", text);
    setPhase("thinking");

    if (step === 1) {
      await aiSay(FOLLOW_UP_TWO.text);
      setStep(2);
    } else if (step === 2) {
      await aiSay(FOLLOW_UP_THREE.text);
      setStep(3);
    } else if (step === 3) {
      await aiSay(DEMO_ANSWER.summary);
      setStep(4);
    }

    setPhase("idle");
  };

  const replies =
    step === 1 ? FOLLOW_UP_ONE.replies : step === 2 ? FOLLOW_UP_TWO.replies : step === 3 ? FOLLOW_UP_THREE.replies : [];

  const submitDraft = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setComposing(false);
    void reply(text);
  };

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
                  window.setTimeout(() => setPlaying((current) => (current === message.id ? null : current)), 1600);
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
          <div className="bubble bubble--ai bubble--typing">
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
        <div className="chips-row">
          {replies.map((option) => (
            <Button key={option} variant="outlined" size="m" onClick={() => void reply(option)}>
              {option}
            </Button>
          ))}
        </div>
      )}

      {composing ? (
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
              ariaLabel={phase === "listening" ? "থামুন" : "কথা বলুন"}
              onClick={() => void start()}
            />
          </div>
          <p className="mic-hero__state">
            {phase === "listening" ? "শুনছি..." : phase === "thinking" ? "ভাবছি..." : step === 0 ? "কথা বলুন" : "আরও বলুন"}
          </p>
          <Button variant="text" size="xs" onClick={() => setComposing(true)}>
            লিখে বলুন
          </Button>
        </div>
      )}
    </section>
  );
}
