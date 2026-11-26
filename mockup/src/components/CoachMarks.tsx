import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "material/react";
import { toBangla } from "../format";

type Step = {
  target: string;
  title: string;
  body: string;
  side: "above" | "below";
};

const STEPS: Step[] = [
  {
    target: "[data-coach='mic']",
    title: "এখানে চাপ দিয়ে কথা বলুন",
    body: "বড় মাইক বোতামটিই সবচেয়ে সহজ পথ। চাপ দিলে কথা বলা শুরু হবে।",
    side: "below",
  },
  {
    target: "[data-coach='camera']",
    title: "পাতার ছবি দেখাতে এখানে চাপুন",
    body: "ছবি দিয়ে সমস্যা জানতে চাইলে এই সারিতে চাপ দিন।",
    side: "below",
  },
  {
    target: "[data-coach='tabs']",
    title: "নিচের বোতাম দিয়ে পাতা বদলান",
    body: "হোম, কথা বলুন, আমার জমি আর সাহায্য — যেকোনো সময় যেতে পারবেন।",
    side: "above",
  },
];

type Box = { top: number; left: number; width: number; height: number };

export default function CoachMarks({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [spot, setSpot] = useState<Box | null>(null);
  const [bubble, setBubble] = useState({ top: 0, left: 0 });

  const rootRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const step = STEPS[index];

  useEffect(() => {
    const measure = () => {
      const root = rootRef.current;
      const target = document.querySelector<HTMLElement>(step.target);
      if (!root || !target) {
        setSpot(null);
        return;
      }
      const targetRect = target.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      setSpot({
        top: targetRect.top - rootRect.top - 8,
        left: targetRect.left - rootRect.left - 8,
        width: targetRect.width + 16,
        height: targetRect.height + 16,
      });
    };

    measure();
    const frame = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [step.target]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const node = bubbleRef.current;
    if (!root || !node || !spot) return;

    const bounds = root.getBoundingClientRect();
    const height = node.offsetHeight;
    const width = node.offsetWidth;
    const below = spot.top + spot.height + 12;
    const above = spot.top - height - 12;
    const lowest = Math.max(12, bounds.height - height - 12);

    // Prefer the requested side, but flip to the other one when it would clip.
    const order = step.side === "above" ? [above, below] : [below, above];
    const fitting = order.find((value) => value >= 12 && value <= lowest);
    const top = fitting ?? Math.min(Math.max(12, order[0]), lowest);

    const centered = spot.left + spot.width / 2 - width / 2;
    const left = Math.min(Math.max(12, centered), Math.max(12, bounds.width - width - 12));

    setBubble({ top, left });
  }, [spot, step.side, index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDone]);

  const last = index === STEPS.length - 1;

  return (
    <div className="coach" ref={rootRef} role="dialog" aria-modal="true" aria-label="অ্যাপের ছোট পরিচিতি">
      {spot && (
        <div
          className="coach__spot"
          style={{ top: spot.top, left: spot.left, width: spot.width, height: spot.height }}
        />
      )}

      <div className="coach__bubble" ref={bubbleRef} style={{ top: bubble.top, left: bubble.left }}>
        <p className="coach__count">
          পরিচিতি {toBangla(index + 1)} / {toBangla(STEPS.length)}
        </p>
        <p className="coach__title">{step.title}</p>
        <p className="coach__body">{step.body}</p>
        <div className="coach__actions">
          <Button variant="text" size="s" onClick={onDone}>
            বাদ দিন
          </Button>
          <Button variant="filled" size="s" onClick={() => (last ? onDone() : setIndex(index + 1))}>
            {last ? "বুঝেছি" : "পরবর্তী"}
          </Button>
        </div>
      </div>
    </div>
  );
}
