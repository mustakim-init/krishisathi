import { Button, Card } from "material/react";
import { ICONS } from "../icons";
import { DemoNote, PhoneHeader } from "../components/PhoneHeader";
import { toBangla } from "../format";
import type { Screen } from "../nav";

const TOPICS = [
  {
    icon: ICONS.mic,
    title: "কথা বলে প্রশ্ন করুন",
    steps: [
      "হোম পাতায় বড় মাইক বোতামে চাপ দিন।",
      "‘শুনছি’ লেখা এলে স্বাভাবিক গতিতে বলুন।",
      "উত্তর বুঝতে না পারলে ‘শুনুন’ চেপে আবার শুনুন।",
    ],
    screen: "talk",
    action: "কথা বলার পাতায় যান",
  },
  {
    icon: ICONS.camera,
    title: "পাতার ছবি দিয়ে দেখান",
    steps: [
      "হোম পাতায় ‘ছবি তুলে দেখান’ চাপুন।",
      "একটি পরিষ্কার নমুনা ছবি বেছে নিন।",
      "‘ছবি দেখে সমস্যা বলুন’ চাপুন, তারপর ফলাফল পড়ুন।",
    ],
    screen: "doctor",
    action: "ছবির পাতায় যান",
  },
  {
    icon: ICONS.sprout,
    title: "জমির কাজ মনে রাখুন",
    steps: [
      "‘আমার জমি’ পাতায় আজকের কাজ দেখুন।",
      "কাজ শেষ হলে পাশের বাক্সে টিক দিন।",
      "‘খরচের খাতা’ থেকে টাকার হিসাব দেখুন।",
    ],
    screen: "farm",
    action: "জমির পাতায় যান",
  },
  {
    icon: ICONS.book,
    title: "গাইড পড়ুন, সাহায্য নিন",
    steps: [
      "‘চাষের গাইড’ থেকে ধানের যেকোনো ধাপ বেছে নিন।",
      "প্রতিটি ধাপে তিনটি ছোট কাজ আছে।",
      "নিশ্চিত না হলে ‘সাহায্য’ পাতায় কৃষি অফিসের নম্বর পাবেন।",
    ],
    screen: "guides",
    action: "গাইডের পাতায় যান",
  },
] as const satisfies ReadonlyArray<{
  icon: string;
  title: string;
  steps: readonly string[];
  screen: Screen;
  action: string;
}>;

export default function Guide({
  onBack,
  onGo,
  onTour,
}: {
  onBack: () => void;
  onGo: (screen: Screen) => void;
  onTour: () => void;
}) {
  return (
    <section className="view">
      <PhoneHeader title="কীভাবে ব্যবহার করবেন" onBack={onBack} />

      <p className="lede">
        চারটি কাজ দিয়ে অ্যাপটি চলে। নিচে প্রতিটি কাজের ছোট ছোট ধাপ দেওয়া আছে। কোথাও আটকে গেলে
        আবার এখানে ফিরে আসুন।
      </p>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">প্রথম পরিচিতি আবার দেখুন</h2>
        <p>হোম পাতায় কোন বোতাম কী কাজ করে, সেটি আবার চিহ্নিত করে দেখানো হবে।</p>
        <Button variant="outlined" size="m" icon={ICONS.sparkle} onClick={onTour}>
          পরিচিতি দেখুন
        </Button>
      </Card>

      <div className="guide-list">
        {TOPICS.map((topic, index) => (
          <Card key={topic.title} variant="outlined" className="guide-card">
            <div className="guide-card__head">
              <span
                className="guide-card__icon"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: topic.icon }}
              />
              <div>
                <p className="guide-card__count">কাজ {toBangla(index + 1)}</p>
                <h2 className="guide-card__title">{topic.title}</h2>
              </div>
            </div>

            <ol className="steps steps--compact">
              {topic.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <Button variant="text" size="m" onClick={() => onGo(topic.screen)}>
              {topic.action}
            </Button>
          </Card>
        ))}
      </div>

      <DemoNote />
    </section>
  );
}
