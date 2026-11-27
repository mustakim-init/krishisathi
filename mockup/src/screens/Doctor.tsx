import { useEffect, useRef, useState } from "react";
import { Button, LoadingIndicator } from "material/react";
import { ICONS } from "../icons";
import { DemoNote, PhoneHeader } from "../components/PhoneHeader";
import { LeafIllustration } from "../components/LeafIllustration";
import { PHOTO_QUESTIONS, type CaseAnswers } from "../data/demo";

const SAMPLES: ReadonlyArray<{ id: 1 | 2 | 3; label: string }> = [
  { id: 1, label: "বাদামি দাগ" },
  { id: 2, label: "পাতা পোড়া" },
  { id: 3, label: "হলদে পাতা" },
];

const HINT_DEFAULT = "ডেমোতে আসল ক্যামেরা খোলে না। উপরের নমুনা ছবি থেকে একটি বাছুন।";

export default function Doctor({
  onBack,
  onResult,
}: {
  onBack: () => void;
  onResult: (answers: CaseAnswers) => void;
}) {
  const [sample, setSample] = useState<1 | 2 | 3>(1);
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
    timer.current = window.setTimeout(() => onResult({ age, standingWater }), 1600);
  };

  const pickWithHint = (message: string) => {
    setHint(message);
    setSample((current) => ((current % 3) + 1) as 1 | 2 | 3);
  };

  const ready = Boolean(answers.age && answers.standingWater);

  return (
    <section className="view">
      <PhoneHeader title="ছবি দেখান" onBack={onBack} />

      <p className="lede">ধানের পাতার একটি পরিষ্কার ছবি দিন। সাথে দুটি ছোট প্রশ্নের উত্তর দিন।</p>

      <p className="step-label">ধাপ ১ — পাতার ছবি বাছুন</p>

      <div className="photo">
        <span className="photo__tag">নমুনা ছবি (ডেমো)</span>
        <LeafIllustration variant={sample} />
      </div>

      <div className="samples" role="group" aria-label="নমুনা ছবি বাছুন">
        {SAMPLES.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`sample ${sample === option.id ? "is-selected" : ""}`}
            aria-pressed={sample === option.id}
            onClick={() => {
              setSample(option.id);
              setHint("");
            }}
          >
            <LeafIllustration variant={option.id} />
            <span>{option.label}</span>
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

      <p className="step-label">ধাপ ২ — দুটি সহজ প্রশ্ন</p>

      {PHOTO_QUESTIONS.map((item) => (
        <div key={item.key} className="block">
          <p className="block__title">{item.question}</p>
          <div className="choices">
            {item.options.map((opt) => {
              const selected = answers[item.key] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  className={`choice ${selected ? "is-selected" : ""}`}
                  aria-pressed={selected}
                  onClick={() => setAnswers((prev) => ({ ...prev, [item.key]: opt }))}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {analyzing ? (
        <div className="analyzing" role="status">
          <LoadingIndicator />
          <span>ছবি দেখা হচ্ছে...</span>
        </div>
      ) : (
        <Button variant="filled" size="l" disabled={!ready} onClick={analyze}>
          {ready ? "ছবি বিশ্লেষণ করুন" : "উপরের দুটি প্রশ্নের উত্তর দিন"}
        </Button>
      )}

      <DemoNote />
    </section>
  );
}
