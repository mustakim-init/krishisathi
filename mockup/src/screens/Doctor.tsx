import { useEffect, useRef, useState } from "react";
import { Button, LoadingIndicator } from "material/react";
import { ICONS } from "../icons";
import { DemoNote, PhoneHeader } from "../components/PhoneHeader";
import { LeafIllustration } from "../components/LeafIllustration";
import { PHOTO_QUESTIONS, type CaseAnswers } from "../data/demo";

const SAMPLES = [1, 2, 3] as const;
type Sample = (typeof SAMPLES)[number];

const HINT_DEFAULT = "ডেমোতে ক্যামেরা চালু হয় না। উপরের নমুনা ছবি বেছে নিন।";

export default function Doctor({
  onBack,
  onResult,
}: {
  onBack: () => void;
  onResult: (answers: CaseAnswers) => void;
}) {
  const [sample, setSample] = useState<Sample>(1);
  const [answers, setAnswers] = useState<Partial<CaseAnswers>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [hint, setHint] = useState("");

  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const analyze = () => {
    const { age, standingWater } = answers;
    if (analyzing || !age || !standingWater) return;
    setAnalyzing(true);
    timer.current = window.setTimeout(() => onResult({ age, standingWater }), 1900);
  };

  const pickWithHint = (message: string) => {
    setHint(message);
    setSample((current) => ((current % 3) + 1) as Sample);
  };

  const ready = Boolean(answers.age && answers.standingWater);

  return (
    <section className="view">
      <PhoneHeader title="ছবি তুলে দেখান" onBack={onBack} />

      <p className="lede">পাতার একটি পরিষ্কার ছবি দিন। অ্যাপ ছবিটি দেখে সম্ভাব্য সমস্যা বলবে।</p>

      <p className="step-label">ধাপ ১ — ছবি বাছুন</p>

      <div className="photo">
        <span className="photo__tag">অঙ্কিত নমুনা ছবি</span>
        <LeafIllustration variant={sample} />
      </div>

      <div className="samples" role="group" aria-label="নমুনা ছবি বাছুন">
        {SAMPLES.map((option) => (
          <button
            key={option}
            type="button"
            className={`sample ${sample === option ? "is-selected" : ""}`}
            aria-pressed={sample === option}
            onClick={() => {
              setSample(option);
              setHint("");
            }}
          >
            <LeafIllustration variant={option} />
            <span>নমুনা {option}</span>
          </button>
        ))}
      </div>

      <div className="row">
        <Button
          variant="outlined"
          size="m"
          icon={ICONS.camera}
          onClick={() => pickWithHint("ডেমোতে ক্যামেরা খোলে না, তাই নমুনা ছবি বদলানো হলো।")}
        >
          ক্যামেরা
        </Button>
        <Button
          variant="outlined"
          size="m"
          icon={ICONS.image}
          onClick={() => pickWithHint("ডেমোতে গ্যালারি খোলে না, তাই নমুনা ছবি বদলানো হলো।")}
        >
          গ্যালারি
        </Button>
      </div>

      <p className="hint" role="status">
        {hint || HINT_DEFAULT}
      </p>

      <p className="step-label">ধাপ ২ — ছোট দুটি প্রশ্নের উত্তর দিন</p>
      <p className="hint">ছবি একা সব বলে না। এই উত্তরগুলো মিলিয়ে দেখা হয়।</p>

      <div className="questions">
        {PHOTO_QUESTIONS.map((item) => (
          <div key={item.key} className="question">
            <p className="question__text">{item.question}</p>
            <div className="choices" role="group" aria-label={item.question}>
              {item.options.map((option) => {
                const chosen = answers[item.key] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    className={`choice ${chosen ? "is-selected" : ""}`}
                    aria-pressed={chosen}
                    onClick={() => setAnswers((current) => ({ ...current, [item.key]: option }))}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="step-label">ধাপ ৩ — ফলাফল দেখুন</p>

      {analyzing ? (
        <div className="analyzing" role="status">
          <LoadingIndicator size={44} aria-label="ছবি দেখছি" />
          <div>
            <p className="analyzing__title">ছবি দেখছি...</p>
            <p className="analyzing__sub">একটু অপেক্ষা করুন।</p>
          </div>
        </div>
      ) : ready ? (
        <Button variant="filled" size="m" onClick={analyze}>
          ছবি দেখে সমস্যা বলুন
        </Button>
      ) : (
        <p className="hint">উপরের দুটি প্রশ্নের উত্তর দিলে ফলাফল দেখা যাবে।</p>
      )}

      <DemoNote />
    </section>
  );
}
