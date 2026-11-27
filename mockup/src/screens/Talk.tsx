import { useEffect, useRef, useState } from "react";
import { BottomSheet, Button } from "material/react";
import { ICONS } from "../icons";
import { buzz, playbackMs } from "../settings";
import { LeafIllustration } from "../components/LeafIllustration";
import Overlay from "../components/Overlay";
import { formatDay } from "../format";
import {
  AGE_QUESTION,
  DEMO_ANSWER,
  DEFAULT_ANSWERS,
  EXAMPLE_PROMPTS,
  OPENING_QUESTION,
  PHOTO_SAMPLES,
  WATER_QUESTION,
  type CaseAnswers,
  type ChatMessage,
  type PhotoVariant,
} from "../data/demo";
import {
  newConversationId,
  readConversations,
  saveConversation,
  titleFor,
  type Conversation,
} from "../conversations";

type Phase = "idle" | "listening" | "thinking";

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export default function Talk({
  onResult,
  onSaved,
  openConversationId,
  startWithPhoto,
  onIntentUsed,
}: {
  onResult: (answers: CaseAnswers) => void;
  onSaved: () => void;
  openConversationId?: string | null;
  startWithPhoto?: boolean;
  onIntentUsed?: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [sheet, setSheet] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [history, setHistory] = useState<Conversation[]>(readConversations);
  const [answers, setAnswers] = useState<CaseAnswers>(DEFAULT_ANSWERS);
  const [conversationId, setConversationId] = useState(newConversationId);
  const [demoConversation, setDemoConversation] = useState(false);

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
  }, [messages, typing, step]);

  // A saved chat or the camera shortcut can be requested from another screen.
  useEffect(() => {
    if (startWithPhoto) {
      setSheet(true);
      onIntentUsed?.();
      return;
    }
    if (!openConversationId) return;
    const found = readConversations().find((item) => item.id === openConversationId);
    if (found) loadConversation(found);
    onIntentUsed?.();
    // The intent props are cleared by the app after this effect runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openConversationId, startWithPhoto]);

  // Save as soon as the farmer has said anything, so the drawer and the saved
  // screen show the same conversation.
  useEffect(() => {
    if (messages.length === 0) return;
    saveConversation({
      id: conversationId,
      title: titleFor(messages),
      updatedAt: Date.now(),
      messages,
      step,
      answers,
      demo: demoConversation,
    });
    setHistory(readConversations());
  }, [messages, step, answers, conversationId, demoConversation]);

  const push = (role: ChatMessage["role"], text: string, photo?: PhotoVariant) => {
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role, text, ...(photo ? { photo } : {}) },
    ]);
  };

  const aiSay = async (token: number, text: string) => {
    setTyping(true);
    await wait(720);
    if (!alive.current || token !== run.current) return false;
    setTyping(false);
    push("ai", text);
    return true;
  };

  const start = async () => {
    if (phase !== "idle" || messages.length > 0) return;
    const token = ++run.current;
    buzz(20);
    setPhase("listening");
    await wait(1300);
    if (!alive.current || token !== run.current) return;
    push("farmer", OPENING_QUESTION);
    setPhase("thinking");
    const ok = await aiSay(token, AGE_QUESTION.text);
    if (!alive.current || token !== run.current) return;
    if (ok) {
      setPhase("idle");
      setStep(1);
    }
  };

  const reply = async (text: string) => {
    if (phase !== "idle" || step === 0) return;
    const token = ++run.current;
    push("farmer", text);
    setPhase("thinking");

    if (step === 1) {
      setAnswers((current) => ({ ...current, age: text }));
      const ok = await aiSay(token, WATER_QUESTION.text);
      if (!alive.current || token !== run.current) return;
      if (ok) setStep(2);
    } else if (step === 2) {
      setAnswers((current) => ({ ...current, standingWater: text }));
      const ok = await aiSay(token, DEMO_ANSWER.summary);
      if (!alive.current || token !== run.current) return;
      if (ok) setStep(3);
    } else {
      const ok = await aiSay(token, "এই সমস্যার পুরো সমাধান নিচে দেখতে পাবেন।");
      if (!alive.current || token !== run.current) return;
      if (!ok) return;
    }

    setPhase("idle");
  };

  const ask = async (text: string) => {
    if (phase !== "idle") return;
    if (step === 0) {
      const token = ++run.current;
      push("farmer", text);
      setPhase("thinking");
      const ok = await aiSay(token, AGE_QUESTION.text);
      if (!alive.current || token !== run.current) return;
      if (ok) {
        setPhase("idle");
        setStep(1);
      }
      return;
    }
    await reply(text);
  };

  // The demo mic does not open a real microphone. When a chat is already open it
  // answers with the first scripted option, so every voice turn has a reply.
  const voiceTurn = async () => {
    if (phase !== "idle") return;
    if (messages.length === 0 || step === 0) {
      void start();
      return;
    }
    if (step > 2) return;

    const scripted = step === 1 ? AGE_QUESTION.replies[0] : WATER_QUESTION.replies[0];
    const token = ++run.current;
    buzz(20);
    setPhase("listening");
    await wait(1200);
    if (!alive.current || token !== run.current) return;

    push("farmer", scripted);
    if (step === 1) setAnswers((current) => ({ ...current, age: scripted }));
    else setAnswers((current) => ({ ...current, standingWater: scripted }));

    const currentStep = step;
    setPhase("thinking");
    const nextText = currentStep === 1 ? WATER_QUESTION.text : DEMO_ANSWER.summary;
    const ok = await aiSay(token, nextText);
    if (!alive.current || token !== run.current) return;
    if (ok) {
      setPhase("idle");
      setStep(currentStep + 1);
    }
  };

  const sendPhoto = async (variant: PhotoVariant) => {
    if (phase !== "idle") return;
    setSheet(false);
    const token = ++run.current;
    push("farmer", "পাতার ছবি", variant);

    if (step === 0) {
      setPhase("thinking");
      const ok = await aiSay(
        token,
        `ছবি দেখছি... পাতায় বাদামি দাগ দেখা যাচ্ছে। ${AGE_QUESTION.text}`,
      );
      if (!alive.current || token !== run.current) return;
      if (ok) {
        setPhase("idle");
        setStep(1);
      }
      return;
    }

    setPhase("thinking");
    const ok = await aiSay(token, "ছবিটা দেখলাম। পাতায় বাদামি দাগ দেখা যাচ্ছে।");
    if (!alive.current || token !== run.current) return;
    if (ok) setPhase("idle");
  };

  const stop = () => {
    run.current += 1;
    buzz(12);
    setPhase("idle");
    setTyping(false);
  };

  function loadConversation(item: Conversation) {
    run.current += 1;
    setConversationId(item.id);
    setMessages(item.messages);
    setStep(item.step);
    setAnswers(item.answers);
    setDemoConversation(Boolean(item.demo));
    setPhase("idle");
    setTyping(false);
    setPlaying(null);
    setDrawer(false);
    setSheet(false);
    setDraft("");
    nextId.current = Math.max(0, ...item.messages.map((message) => message.id)) + 1;
  }

  function restart() {
    run.current += 1;
    setMessages([]);
    setPhase("idle");
    setStep(0);
    setTyping(false);
    setPlaying(null);
    setDraft("");
    setAnswers(DEFAULT_ANSWERS);
    setConversationId(newConversationId());
    setDemoConversation(false);
    setDrawer(false);
  }

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

  const submitDraft = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    void ask(text);
  };

  const quickReplies =
    phase === "idle" && step === 1
      ? AGE_QUESTION.replies
      : phase === "idle" && step === 2
        ? WATER_QUESTION.replies
        : [];

  return (
    <section className="view view--talk">
      <header className="talk__top">
        <button
          type="button"
          className="talk__menu"
          aria-label="কথার ইতিহাস"
          onClick={() => setDrawer(true)}
          dangerouslySetInnerHTML={{ __html: ICONS.menu }}
        />
        <div className="talk__titles">
          <h1 className="talk__title">কথা বলুন</h1>
          <p className="talk__sub">মুখে বলুন, লিখুন বা ছবি দিন</p>
        </div>
        {messages.length > 0 ? (
          <Button variant="text" size="s" onClick={restart}>
            নতুন
          </Button>
        ) : (
          <span className="talk__top-spacer" aria-hidden="true" />
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
                <p className="talk__empty-hint">আপনার সমস্যাটি মুখে বলুন।</p>
              </>
            ) : (
              <>
                <h2 className="talk__welcome-title">কী সমস্যা হচ্ছে?</h2>
                <p className="talk__empty-hint">মুখে বলুন, লিখুন বা পাতার ছবি দিন।</p>

                <div className="talk__examples">
                  <span className="talk__examples-label">যেমন বলতে পারেন</span>
                  {EXAMPLE_PROMPTS.map((example) => (
                    <button
                      key={example}
                      type="button"
                      className="talk__example"
                      onClick={() => void ask(example)}
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
          <div
            key={message.id}
            className={`bubble bubble--${message.role}${message.photo ? " bubble--photo" : ""}`}
          >
            {message.photo ? (
              <span className="bubble__photo">
                <LeafIllustration variant={message.photo} />
                <span className="bubble__photo-tag">অঙ্কিত নমুনা (ডেমো)</span>
              </span>
            ) : (
              <span>{message.text}</span>
            )}
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

        {quickReplies.length > 0 && (
          <div className="talk__chips talk__chips--inline">
            {quickReplies.map((item) => (
              <button key={item} type="button" className="chip-btn" onClick={() => void reply(item)}>
                {item}
              </button>
            ))}
          </div>
        )}

        {step === 3 && phase === "idle" && messages.length > 0 && (
          <div className="talk__chips talk__chips--inline">
            <Button variant="filled" size="m" onClick={() => onResult(answers)}>
              পুরো সমাধান দেখুন
            </Button>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="talk__dock">
        <form className="composer" onSubmit={submitDraft}>
          <div className="composer__field">
            <button
              type="button"
              className="composer__camera"
              aria-label="পাতার ছবি দিন"
              onClick={() => setSheet(true)}
              dangerouslySetInnerHTML={{ __html: ICONS.camera }}
            />
            <input
              className="composer__input"
              type="text"
              value={draft}
              placeholder="আপনার সমস্যা লিখুন..."
              aria-label="আপনার সমস্যা লিখুন"
              enterKeyHint="send"
              onChange={(event) => setDraft(event.target.value)}
            />
          </div>

          {draft.trim() ? (
            <button type="submit" className="composer__action composer__action--send" aria-label="পাঠান">
              <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.send }} />
            </button>
          ) : phase === "listening" ? (
            <button
              type="button"
              className="composer__action composer__action--stop"
              aria-label="থামুন"
              onClick={stop}
            >
              <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.close }} />
            </button>
          ) : step >= 3 ? (
            <button
              type="button"
              className="composer__action composer__action--send"
              aria-label="সমাধান দেখুন"
              onClick={() => onResult(answers)}
            >
              <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.check }} />
            </button>
          ) : (
            <button
              type="button"
              className="composer__action composer__action--mic"
              aria-label="কথা বলুন"
              onClick={() => void voiceTurn()}
              disabled={phase === "thinking"}
            >
              <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.mic }} />
            </button>
          )}
        </form>
      </div>

      <Overlay>
        {drawer && (
          <div className="drawer">
            <button
              type="button"
              className="drawer__scrim"
              aria-label="বন্ধ করুন"
              onClick={() => setDrawer(false)}
            />
            <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="কথার ইতিহাস">
              <div className="drawer__head">
                <h2 className="drawer__title">কথার ইতিহাস</h2>
                <button
                  type="button"
                  className="drawer__close"
                  aria-label="বন্ধ করুন"
                  onClick={() => setDrawer(false)}
                  dangerouslySetInnerHTML={{ __html: ICONS.close }}
                />
              </div>

              <Button variant="filled" size="m" onClick={restart}>
                নতুন কথা শুরু করুন
              </Button>

              <ul className="drawer__list">
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`drawer__item${item.id === conversationId ? " is-current" : ""}`}
                      onClick={() => loadConversation(item)}
                    >
                      <span className="drawer__item-title">{item.title}</span>
                      <span className="drawer__item-meta">
                        {formatDay(item.updatedAt)}
                        {item.demo ? " · ডেমো" : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="drawer__all"
                onClick={() => {
                  setDrawer(false);
                  onSaved();
                }}
              >
                সব সংরক্ষিত তথ্য দেখুন
              </button>
            </aside>
          </div>
        )}

        <BottomSheet open={sheet} headline="পাতার ছবি দিন" onClose={() => setSheet(false)}>
          <div className="sheet-body">
            <p className="fineprint">
              ডেমোতে ক্যামেরা বা গ্যালারি খোলে না। নিচের নমুনা ছবি থেকে একটি বেছে নিন।
            </p>
            <div className="samples" role="group" aria-label="নমুনা ছবি বাছুন">
              {PHOTO_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  className="sample"
                  onClick={() => void sendPhoto(sample.id)}
                >
                  <LeafIllustration variant={sample.id} />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
            <p className="fineprint">ছবি পাঠালে অ্যাপ আরও দুটি ছোট প্রশ্ন করবে।</p>
          </div>
        </BottomSheet>
      </Overlay>
    </section>
  );
}
