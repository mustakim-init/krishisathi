import { useEffect, useRef, useState } from "react";
import { Button, LoadingIndicator } from "material/react";
import { ICONS } from "../icons";
import { DemoNote, PhoneHeader } from "../components/PhoneHeader";
import { LeafIllustration } from "../components/LeafIllustration";

const SAMPLES = [1, 2, 3] as const;
type Sample = (typeof SAMPLES)[number];

export default function Doctor({ onBack, onResult }: { onBack: () => void; onResult: () => void }) {
  const [sample, setSample] = useState<Sample>(1);
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
    if (analyzing) return;
    setAnalyzing(true);
    timer.current = window.setTimeout(onResult, 1900);
  };

  const pickWithHint = (message: string) => {
    setHint(message);
    setSample((current) => ((current % 3) + 1) as Sample);
  };

  return (
    <section className="view">
      <PhoneHeader title="ছবি তুলে দেখান" onBack={onBack} />

      <p className="lede">
        পাতার একটি পরিষ্কার ছবি দিন। আমরা ছবিটি দেখে সম্ভাব্য সমস্যা বলব।
      </p>

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

      <p className="hint" role="status">
        {hint || "ডেমোতে ক্যামেরা চালু হয় না। উপরের নমুনা ছবি বেছে নিন।"}
      </p>

      <div className="row">
        <Button variant="outlined" size="m" icon={ICONS.camera} onClick={() => pickWithHint("ডেমোতে ক্যামেরা খোলে না, তাই নমুনা ছবি বদলানো হলো।")}>
          ক্যামেরা
        </Button>
        <Button variant="outlined" size="m" icon={ICONS.image} onClick={() => pickWithHint("ডেমোতে গ্যালারি খোলে না, তাই নমুনা ছবি বদলানো হলো।")}>
          গ্যালারি
        </Button>
      </div>

      {analyzing ? (
        <div className="analyzing" role="status">
          <LoadingIndicator size={44} aria-label="ছবি দেখছি" />
          <div>
            <p className="analyzing__title">ছবি দেখছি...</p>
            <p className="analyzing__sub">একটু অপেক্ষা করুন।</p>
          </div>
        </div>
      ) : (
        <Button variant="filled" size="m" onClick={analyze}>
          বিশ্লেষণ করুন
        </Button>
      )}

      <DemoNote />
    </section>
  );
}
