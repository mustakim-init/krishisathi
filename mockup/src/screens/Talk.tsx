import { useEffect, useRef, useState } from "react";
import { Button, Fab, IconButton } from "material/react";
import { ICONS } from "../icons";
import { buzz, playbackMs } from "../settings";
import {
  DEMO_ANSWER,
  FOLLOW_UP_ONE,
  FOLLOW_UP_THREE,
  FOLLOW_UP_TWO,
  OPENING_QUESTION,
  type ChatMessage,
} from "../data/demo";

type Phase = "idle" | "listening" | "thinking";

/* Example things a farmer might say. These are symptom descriptions in the
   farmer's own words — never a diagnosis. */
const EXAMPLE_PROMPTS = [
  "আমার ধানের পাতায় বাদামি দাগ দেখা যাচ্ছে",
  "গাছের পাতা হলদে হয়ে যাচ্ছে",
  "জমিতে পোকা দেখছি, কী করব?",
];

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export default function Talk({
  onResult,
  onPhoto,
}: {
  onResult: () => void;
  onPhoto: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState("");

  const endRef = useRef<HTMLDivElement>(null);
  const alive = useRef(true);
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
    await wait(750);
    if (!alive.current || token !== run.current) return;
    setTyping(false);
    push("ai", text);
  };

  const start = async () => {
    if (phase !== "idle" || step !== 0) return;
    const token = ++run.current;
    buzz(20);
    setPhase("listening");
    await wait(1400);
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
    setPhase("idle");
    setStep(0);
    setTyping(false);
    setPlaying(null);
    setComposing(false);
    setDraft("");
  };

  const togglePlay = (id: number) => {
    if (playing === id) {
      setPlaying(null);
      return;
    }
    setPlaying(id);
    window.setTimeout(() => {
      setPlaying((current) => (current === id ? null : current));
    }, playbackMs(2000));
  };

  const ask = (text: string) => {
    if (step === 0) {
      const token = ++run.current;
      push("farmer", text);
      setPhase("thinking");
      void aiSay(token, FOLLOW_UP_ONE.text).then(() => {
        if (alive.current && token === run.current) {
          setPhase("idle");
          setStep(1);
        }
      });
    } else {
      void reply(text);
    }
  };

  const submitDraft = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setComposing(false);
    ask(text);
  };

  const quickReplies =
    step === 1
      ? FOLLOW_UP_ONE.replies
      : step === 2
        ? FOLLOW_UP_TWO.replies
        : step === 3
          ? FOLLOW_UP_THREE.replies
          : [];

  return (
    <section className="view view--talk">
      <header className="talk__top">
        <div>
          <h1 className="talk__title">কথা বলুন</h1>
          <p className="talk__sub">ডেমো কথোপকথন · কথা বা ছবি দিয়ে জানুন</p>
        </div>
        {messages.length > 0 && (
          <Button variant="text" size="s" onClick={restart}>
            নতুন শুরু
          </Button>
        )}
      </header>

      <div className="chat" aria-live="polite">
        {messages.length === 0 && (
          <div className="talk__empty">
            {phase === "listening" ? (
              <>
                <div className="talk__listening" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <h2 className="talk__empty-title">শুনছি, বলুন...</h2>
                <p className="talk__empty-hint">আপনার সমস্যাটি নিজের ভাষায় বলুন।</p>
              </>
            ) : (
              <>
                <div
                  className="talk__empty-icon"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: ICONS.mic }}
                />
                <h2 className="talk__empty-title">নিচের মাইকে চাপ দিন</h2>
                <p className="talk__empty-hint">
                  আপনার ধানের কী সমস্যা হচ্ছে তা মুখে বলুন বা পাতার ছবি পাঠান।
                </p>

                <div className="talk__examples">
                  <span className="talk__examples-label">যেমন বলতে পারেন</span>
                  {EXAMPLE_PROMPTS.map((example) => (
                    <button
                      key={example}
                      type="button"
                      className="talk__example"
                      onClick={() => ask(example)}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`bubble bubble--${message.role}`}>
            <span>{message.text}</span>
            {message.role === "ai" && (
              <button
                type="button"
                className="bubble__audio"
                onClick={() => togglePlay(message.id)}
              >
                <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.volume }} />
                <span>{playing === message.id ? "থামান" : "শুনুন"}</span>
              </button>
            )}
          </div>
        ))}

        {typing && <div className="bubble bubble--ai">উত্তর তৈরি হচ্ছে...</div>}
        <div ref={endRef} />
      </div>

      {phase === "idle" && quickReplies.length > 0 && (
        <div className="talk__chips">
          {quickReplies.map((item) => (
            <button key={item} type="button" className="chip-btn" onClick={() => reply(item)}>
              {item}
            </button>
          ))}
        </div>
      )}

      {step === 4 && phase === "idle" && (
        <div className="talk__chips">
          <Button variant="filled" size="m" onClick={onResult}>
            পুরো সমাধান দেখুন
          </Button>
        </div>
      )}

      <div className="talk__dock">
        {composing ? (
          <form className="talk__type-form" onSubmit={submitDraft}>
            <input
              className="talk__input"
              type="text"
              value={draft}
              placeholder="সমস্যা লিখুন..."
              onChange={(event) => setDraft(event.target.value)}
            />
            <Button variant="filled" size="m" type="submit">
              পাঠান
            </Button>
          </form>
        ) : (
          <div className="talk__dock-row">
            <div className="talk__dock-side">
              <IconButton icon={ICONS.camera} ariaLabel="ছবি দেখান" onClick={onPhoto} />
              <button type="button" className="dock-link" onClick={() => setComposing(true)}>
                লিখুন
              </button>
            </div>
            {phase === "listening" ? (
              <Fab variant="secondary" size="medium" icon={ICONS.close} ariaLabel="থামুন" onClick={stop} />
            ) : (
              <Fab
                variant="primary"
                size="medium"
                icon={ICONS.mic}
                ariaLabel="কথা বলুন"
                onClick={start}
              />
            )}
            <span className="talk__status">
              {phase === "listening"
                ? "শুনছি..."
                : phase === "thinking"
                  ? "ভাবছি..."
                  : step === 0
                    ? "মাইকে চাপ দিন"
                    : "উত্তর বাছুন"}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
