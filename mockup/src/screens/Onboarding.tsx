import { useState } from "react";
import { Button, Card } from "material/react";
import { ICONS } from "../icons";
import { toBangla } from "../format";

type Slide = {
  icon: string;
  title: string;
  body: string;
  tip: string;
};

const SLIDES: Slide[] = [
  {
    icon: ICONS.mic,
    title: "কথা বলে জিজ্ঞাসা করুন",
    body: "ফসলের সমস্যা নিজের ভাষায় বলুন। অ্যাপ কয়েকটি ছোট প্রশ্ন করবে, তারপর সহজ বাংলায় উত্তর দেবে।",
    tip: "পড়তে কষ্ট হলে প্রতিটি উত্তরের নিচে ‘শুনুন’ বোতাম আছে।",
  },
  {
    icon: ICONS.camera,
    title: "পাতার ছবি দেখান",
    body: "পাতায় দাগ, পোকা বা রঙ বদল দেখলে ছবি তুলে দিন। অ্যাপ ছবি দেখে সম্ভাব্য সমস্যা বলবে।",
    tip: "ছবি পরিষ্কার না হলে অ্যাপ আবার ছবি চাইবে।",
  },
  {
    icon: ICONS.book,
    title: "গাইড, জমির খাতা আর সাহায্য",
    body: "চাষের ধাপগুলো পড়ুন, কাজের তালিকা রাখুন, আর দরকারে কৃষি অফিসে ফোন করুন।",
    tip: "কৃষি অফিসের নম্বর সবসময় ‘সাহায্য’ পাতায় পাবেন।",
  },
];

export default function Onboarding({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <section className="view view--onboarding">
      <header className="onboarding__top">
        <span className="onboarding__brand">কৃষিসাথী</span>
        <span className="onboarding__count">
          ধাপ {toBangla(index + 1)} / {toBangla(SLIDES.length)}
        </span>
      </header>

      <div className="onboarding__dots" aria-hidden="true">
        {SLIDES.map((item, dot) => (
          <span key={item.title} className={`onboarding__dot ${dot === index ? "is-active" : ""}`} />
        ))}
      </div>

      <div className="onboarding__art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: slide.icon }} />

      <div className="onboarding__text">
        <h1 className="onboarding__title">{slide.title}</h1>
        <p className="onboarding__body">{slide.body}</p>
      </div>

      <Card variant="filled" className="onboarding__tip">
        <div className="onboarding__tip-row">
          <span
            className="onboarding__tip-icon"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: ICONS.sparkle }}
          />
          <p>{slide.tip}</p>
        </div>
      </Card>

      <div className="onboarding__actions">
        <Button variant="filled" size="m" onClick={() => (isLast ? onFinish() : setIndex(index + 1))}>
          {isLast ? "শুরু করুন" : "পরবর্তী"}
        </Button>
        {index > 0 && (
          <Button variant="text" size="m" onClick={() => setIndex(index - 1)}>
            পেছনে
          </Button>
        )}
      </div>

      <p className="demo-note">এটি একটি ডেমো প্রোটোটাইপ। প্রকৃত রোগ নির্ণয় নয়।</p>
    </section>
  );
}
